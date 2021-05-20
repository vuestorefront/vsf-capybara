<template>
  <div class="o-printed-product-order-form product" :class="skinClass">
    <div class="_info">
      <div>
        <h1 class="_product-name-mobile">
          {{ productName }}
        </h1>

        <m-zoom-gallery ref="gallery" :images="galleryImages" />
      </div>

      <div>
        <h1 class="_product-name-desktop">
          {{ productName }}
        </h1>

        <div class="_short-description" v-html="shortDescription" />

        <a-custom-product-price
          class="_price"
          :price="price"
          :special-price="specialPrice"
          show-cents
        />

        <validation-observer v-slot="{ passes }" slim>
          <form
            data-action="addToCart"
            method="POST"
            :action="formAction"
            :product-id="productId"
            :data-product-sku="productSku"
            @submit.prevent="
              (event) => passes(() => onSubmit(event))
            "
          >
            <input type="hidden" name="submit_value">

            <input
              type="hidden"
              name="product_id"
              :value="productId"
            >

            <div class="_additional-options">
              <div v-show="hasStyleSelections">
                <SfSelect
                  v-model="selectedStyle"
                  label="Select Design Variant"
                  :required="true"
                >
                  <SfSelectOption
                    v-for="option in availableStyles"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SfSelectOption>
                </SfSelect>
              </div>
            </div>

            <div class="_artwork-upload">
              <div class="_step-title">
                Upload your pet's photo
              </div>

              <validation-provider
                v-slot="{ errors }"
                name="'Artwork'"
                tag="div"
                class="_uploader-wrapper"
              >
                <input
                  type="hidden"
                  name="uploaded_artwork_ids[]"
                  :value="storageItemId"
                  required
                >

                <MArtworkUpload
                  ref="artwork-upload"
                  class="_file-uploader"
                  :product-id="productType"
                  :disabled="isUploadDisabled"
                  :upload-url="artworkUploadUrl"
                  @input="onArtworkChange"
                />

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <!-- <extra-faces
              :available-options="addons"
              :product-id="productType"
              :disabled="isUploadDisabled"
              :upload-url="artworkUploadUrl"
              :initial-variant="initialExtraFacesAddon"
              :initial-artworks="uploadedAddonArtworkUrls"
              v-show="hasExtraFaceAddons"
            /> -->

            <validation-provider
              v-slot="{ errors, classes }"
              rules="required"
              :name="'Quantity'"
              slim
            >
              <div class="_quantity-field" :class="classes">
                <ACustomProductQuantity
                  v-model="quantity"
                  class="_qty-container"
                />

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <div class="_actions">
              <div class="row">
                <div class="medium-8 large-6 columns">
                  <SfButton class="_add-to-cart color-primary" type="submit">
                    Add to Cart
                  </SfButton>
                </div>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>

    <div class="row _description">
      <div class="columns">
        <div class="_header">
          <div class="custom-header _h3">
            <div class="_container">
              <h3 class="_content">
                Product Details
              </h3>
            </div>
          </div>
        </div>

        <div class="_product-description" v-html="description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import ACustomProductPrice from '../atoms/a-custom-product-price.vue';
import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import MZoomGallery, { ZoomGalleryImage } from '../molecules/m-zoom-gallery.vue';
import MArtworkUpload from '../molecules/m-artwork-upload.vue';

import { SfButton, SfSelect } from '@storefront-ui/vue';

import FileStorageItem from '../../ts/modules/file-storage/item.model';
// import ArtworkUpload from './ArtworkUpload.vue';
// import ExtraFaces from './ExtraFaces.vue';
// import SelectOption from './select-option.interface';
// import AddonOption from './addon-option.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export interface GalleryProductImages {
  sku: string,
  images: ZoomGalleryImage[]
}

export default {
  name: 'OPrintedProductOrderForm',
  components: {
    ValidationObserver,
    ValidationProvider,
    // ArtworkUpload,
    ACustomProductPrice,
    ACustomProductQuantity,
    MZoomGallery,
    MArtworkUpload,
    SfSelect,
    SfButton
    // ExtraFaces
  },
  props: {
    artworkUploadUrl: {
      type: String,
      required: true
    },
    formAction: {
      type: String,
      required: true
    },
    product: {
      type: Object,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    productSku: {
      type: String,
      required: true
    },
    productType: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      default: 0
    },
    productSpecialPrice: {
      type: Number,
      default: 0
    },
    productQuantity: {
      type: Number,
      default: 1
    },
    productDescription: {
      type: String,
      default: ''
    },
    productShortDescription: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: ''
    },
    productImages: {
      type: Array as PropType<GalleryProductImages[]>,
      default: []
    },
    availableStyles: {
      type: Array, // as PropType<SelectOption[]>,
      default: () => []
    },
    addons: {
      type: Array, // as PropType<AddonOption[]>,
      default: () => []
    },
    initialStyleValue: {
      type: String,
      default: ''
    },
    initialExtraFacesAddon: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      quantity: 1,
      fStorageItemId: undefined,
      fSelectedStyle: undefined
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    galleryImages (): ZoomGalleryImage[] {
      const productImages = this.productImages.find(
        (item) => item.sku === this.selectedStyle
      );

      if (!productImages || !this.selectedStyle) {
        return this.productImages[0]['images'];
      }

      return productImages['images'];
    },
    isUploadDisabled (): boolean {
      return false;
    },
    price (): number {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.price) {
        return this.productPrice;
      }

      return style.price;
    },
    specialPrice (): number {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.specialPrice) {
        return this.productSpecialPrice;
      }

      return style.specialPrice;
    },
    selectedStyle: {
      get: function (): string | undefined {
        return this.fSelectedStyle;
      },
      set: function (value: string | undefined) {
        this.fSelectedStyle = value;
      }
    },
    hasStyleSelections (): boolean {
      return !(
        this.availableStyles.length === 1 &&
            this.selectedStyle !== undefined
      );
    },
    hasExtraFaceAddons (): boolean {
      return (
        this.addons.length > 0 && this.initialExtraFacesAddon !== undefined
      );
    },
    storageItemId (): string | undefined {
      return this.fStorageItemId;
    },
    description (): string | undefined {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.description) {
        return this.productDescription;
      }

      return style.description;
    },
    shortDescription (): string | undefined {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.shortDescription) {
        return this.productShortDescription;
      }

      return style.shortDescription;
    }
  },
  methods: {
    onArtworkChange (value?: FileStorageItem): void {
      if (!value) {
        this.fStorageItemId = undefined;
        return;
      }

      this.fStorageItemId = value.id;
    },
    onSubmit (event: Event) {
      (event.target as HTMLFormElement).submit();
    },
    getGallery (): HTMLElement | undefined {
      return this.$refs['gallery'] as HTMLElement | undefined;
    }
  },
  mounted () {
    if (
      this.initialStyleValue &&
          this.availableStyles.find(
            (item) => item.value === this.initialStyleValue
          )
    ) {
      this.selectedStyle = this.initialStyleValue;
    }
  },
  created () {
    this.quantity = this.productQuantity;

    if (this.uploadedArtworkId) {
      this.fStorageItemId = this.uploadedArtworkId;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-printed-product-order-form {
    ._info {
      display: flex;
      justify-content: space-between;
    }

    ._info > div {
      max-width: 100%;
      flex-grow: 1;
    }

    ._product-name-desktop {
        display: none;
    }

    ._price,
    ._additional-options,
    ._artwork-upload,
    ._qty-container,
    ._actions {
        margin-top: 1em;
    }

    ._design-option-list {
        display: block;
    }

    ._actions {
        ._add-to-cart {
            margin: 0;
            width: 100%;
        }
    }

    ._artwork-upload {
        ._step-title {
            font-weight: 800;
            text-align: left;
        }

        ._uploader-wrapper {
            margin-top: 0.25em;
        }
    }

    ._qty-container {
        ::v-deep ._quantity {
            ._header {
                font-weight: 800;
            }
        }
    }

    ._error-text {
        font-size: 0.8em;
        margin-top: 0.5em;
    }

    ._description {
        margin-top: 3em;

        ._product-description {
            margin-top: 1em;
        }
    }

    &.-skin-petsies {
        ._error-text {
            color: var(--c-danger-variant);
        }
    }

  @include for-desktop {
    ._info > div {
      max-width: 45%;
    }

    ._product-name-desktop {
        display: block;
    }

    ._product-name-mobile {
        display: none;
    }
  }
}
</style>

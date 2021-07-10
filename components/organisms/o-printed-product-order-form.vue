<template>
  <div class="o-printed-product-order-form product" :class="skinClass">
    <div class="_info">
      <div>
        <header class="sf-heading sf-heading--no-underline sf-heading--left">
          <h1 class="_product-name-mobile sf-heading__title">
            {{ productName }}
          </h1>
        </header>

        <m-zoom-gallery ref="gallery" :images="galleryImages" />
      </div>

      <div>
        <header class="sf-heading sf-heading--no-underline sf-heading--left">
          <h1 class="_product-name-desktop sf-heading__title">
            {{ productName }}
          </h1>
        </header>

        <div class="_short-description" v-html="shortDescription" />

        <a-custom-price
          class="_price"
          :regular="price"
          :special-price="specialPrice"
        />

        <validation-observer v-slot="{ passes }" slim>
          <form
            @submit.prevent="(event) => passes(() => onSubmit(event))"
          >
            <div class="_additional-options">
              <div v-show="hasStyleSelections">
                <div class="_step-title">
                  Design
                </div>

                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="'Style Option'"
                  tag="div"
                >
                  <SfSelect
                    v-model="selectedStyle"
                    v-if="showDesignSelector"
                    name="design_option"
                    required
                    class="sf-select--underlined"
                    :size="10"
                    :disabled="isSubmitting"
                  >
                    <SfSelectOption disabled value="">
                      Select Design Variant
                    </SfSelectOption>

                    <SfSelectOption
                      v-for="option in availableStyles"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SfSelectOption>
                  </SfSelect>

                  <div class="_error-text">
                    {{ errors[0] }}
                  </div>
                </validation-provider>
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
                  :disabled="isSubmitting"
                  :upload-url="artworkUploadUrl"
                  @file-added="onArtworkAdd"
                  @file-removed="onArtworkRemove"
                />

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <MExtraFaces
              ref="extra-faces"
              :available-options="addons"
              :product-id="productType"
              :disabled="isSubmitting"
              :upload-url="artworkUploadUrl"
              v-show="hasExtraFaceAddons"
            />

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
                  :disabled="isSubmitting"
                />

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <div class="_actions">
              <div class="row">
                <div class="medium-8 large-6 columns">
                  <SfButton class="_add-to-cart color-primary" type="submit" :disabled="isSubmitting">
                    Add to Cart
                  </SfButton>
                </div>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>

    <div class="_description">
      <header class="sf-heading">
        <h3 class="sf-heading__title sf-heading__title--h3">
          Product Details
        </h3>
      </header>

      <div class="_product-description" v-html="description" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import { SfButton, SfSelect } from '@storefront-ui/vue';

import { Item } from 'src/modules/file-storage';

import ACustomPrice from '../atoms/a-custom-price.vue';
import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import MZoomGallery from '../molecules/m-zoom-gallery.vue';
import MArtworkUpload from '../molecules/m-artwork-upload.vue';
import MExtraFaces from '../molecules/m-extra-faces.vue';
import ZoomGalleryImage from 'theme/interfaces/zoom-gallery-image.interface';
import ExtraPhotoAddonOption from '../interfaces/extra-photo-addon-option.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export interface GalleryProductImages {
  sku: string,
  images: ZoomGalleryImage[]
}

export interface SelectOption {
  optionId: number,
  optionValueId: number,
  value: string,
  label: string,
  description: string,
  shortDescription: string,
  price: number,
  specialPrice: number
}

export default Vue.extend({
  name: 'OPrintedProductOrderForm',
  components: {
    ValidationObserver,
    ValidationProvider,
    ACustomPrice,
    ACustomProductQuantity,
    MZoomGallery,
    MArtworkUpload,
    MExtraFaces,
    SfSelect,
    SfButton
  },
  props: {
    artworkUploadUrl: {
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
      type: Array as PropType<SelectOption[]>,
      default: () => []
    },
    addons: {
      type: Array as PropType<ExtraPhotoAddonOption[]>,
      default: () => []
    },
    defaultStyle: {
      type: String,
      default: ''
    },
    uploadedArtworkId: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      quantity: 1,
      fStorageItemId: undefined as string | undefined,
      fSelectedStyle: undefined as string | undefined,
      isSubmitting: false,
      fShouldShowDesignSelector: true
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
        this.addons.length > 0
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
    },
    showDesignSelector: function (): boolean {
      return this.fShouldShowDesignSelector
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: types.PRODUCT_SET_BUNDLE_OPTION
    }),
    onArtworkAdd (value: Item): void {
      this.fStorageItemId = value.id;
    },
    onArtworkRemove (storageItemId: string): void {
      this.fStorageItemId = undefined;
    },
    async onSubmit (event: Event): Promise<void> {
      this.isSubmitting = true;

      await this.$store.dispatch(
        'product/setBundleOptions',
        { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
      );

      let extraFacesArtworks: string[] = [];
      const extraFacesComponent = this.getExtraFaces();

      if (extraFacesComponent) {
        extraFacesArtworks = extraFacesComponent.getFilesIds();
      }

      this.$store.dispatch('cart/addItem', {
        productToAdd: Object.assign({}, this.product, {
          qty: this.quantity,
          customerImagesIds: [this.storageItemId, ...extraFacesArtworks],
          uploadMethod: 'upload-now'
        })
      }).then(() => {
        this.onSuccess();
      }).catch(err => {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      }).finally(() => {
        this.isSubmitting = false;
      });
    },
    async onSuccess (): Promise<void> {
      try {
        const uploader = this.getUploader();
        if (uploader) {
          uploader.clearInput();
        }

        const extraFaces = this.getExtraFaces();
        if (extraFaces) {
          extraFaces.clearUploaders();
        }

        this.goToCart();
      } catch (e) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message: e.message, timeToLive: 10 * 1000 }),
          { root: true }
        );
      }
    },
    onFailure (message: any): void {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    getGallery (): HTMLElement | undefined {
      return this.$refs['gallery'] as HTMLElement | undefined;
    },
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    },
    getExtraFaces (): InstanceType<typeof MExtraFaces> | undefined {
      return this.$refs['extra-faces'] as InstanceType<typeof MExtraFaces> | undefined;
    },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    }
  },
  async mounted (): Promise<void> {
    if (
      this.defaultStyle &&
          this.availableStyles.find(
            (item) => item.value === this.defaultStyle
          )
    ) {
      this.selectedStyle = this.defaultStyle;
    }
  },
  created (): void {
    this.quantity = this.productQuantity;

    if (this.uploadedArtworkId) {
      this.fStorageItemId = this.uploadedArtworkId;
    }
  },
  watch: {
    product: {
      handler () {
        this.fShouldShowDesignSelector = false;

        this.fSelectedStyle = this.defaultStyle ? this.defaultStyle : undefined;

        this.$nextTick(() => {
          this.fShouldShowDesignSelector = true;
        })
      },
      immediate: true
    },
    selectedStyle: {
      handler () {
        const selectedDesign = this.availableStyles.find(design => design.value === this.selectedStyle);

        if (!selectedDesign) {
          return;
        }

        this.setBundleOptionValue({
          optionId: selectedDesign.optionId,
          optionQty: 1,
          optionSelections: [selectedDesign.optionValueId]
        });
      },
      immediate: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";
@import "~@storefront-ui/shared/styles/components/atoms/SfHeading";

.o-printed-product-order-form {
    ._info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    ._info > div {
      width: 100%;
      flex-grow: 1;
    }

    ._product-name-desktop {
        display: none;
    }

    ._short-description {
      @include font(
        --product-description-font,
        var(--font-light),
        var(--font-base),
        1.6,
        var(--font-family-primary)
      );
    }

    ._price,
    ._additional-options,
    ._artwork-upload,
    ._qty-container,
    ._actions {
        margin-top: 1.5em;
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

    ._step-title {
        font-size: var(--font-base);
        font-weight: 800;
        text-align: left;
    }

    ._artwork-upload {
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
        margin-top: calc(var(--spacer-lg) * 2);

        ._product-description {
            margin-top: 1em;

            ::v-deep h1,
            ::v-deep h2,
            ::v-deep h3,
            ::v-deep h4,
            ::v-deep h5,
            ::v-deep h6 {
              //@extend .sf-heading;
              text-align: var(--heading-text-align, center);
              margin-top: var(--spacer-lg);
              @extend .sf-heading__title;
            }

            ::v-deep h2 {
              @extend .sf-heading__title--h2;
            }

            ::v-deep h3 {
              @extend .sf-heading__title--h3;
            }

            ::v-deep h4 {
              @extend .sf-heading__title--h4;
            }

            ::v-deep h5 {
              @extend .sf-heading__title--h5;
            }

            ::v-deep h6 {
              @extend .sf-heading__title--h6;
            }
        }
    }

    .sf-select {
      --select-padding: 0;
    }

    &.-skin-petsies {
        ._error-text {
            color: var(--c-danger-variant);
        }
    }

  @media (min-width: $tablet-min) {
    ._info {
      flex-direction: row;
    }

    ._info > div {
      max-width: 48.5%;
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

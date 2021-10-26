<template>
  <div class="o-printed-product-order-form product" :class="skinClass">
    <div class="_info">
      <div>
        <header class="sf-heading sf-heading--no-underline sf-heading--left">
          <h1 class="_product-name-mobile sf-heading__title">
            {{ product.name }}
          </h1>
        </header>

        <m-zoom-gallery ref="gallery" :images="galleryImages" />
      </div>

      <div>
        <header class="sf-heading sf-heading--no-underline sf-heading--left">
          <h1 class="_product-name-desktop sf-heading__title">
            {{ product.name }}
          </h1>
        </header>

        <div class="_short-description" v-html="shortDescription" />

        <a-custom-price
          class="_price"
          :regular="price"
          :special-price="specialPrice"
        />

        <validation-observer v-slot="{ passes }" slim ref="validation-observer">
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
                    v-if="shouldShowDesignSelector"
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
                  :value="customerImage"
                  required
                >

                <MArtworkUpload
                  ref="artwork-upload"
                  class="_file-uploader"
                  :product-id="backendProductId"
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
              :backend-product-id="backendProductId"
              :disabled="isSubmitting"
              :upload-url="artworkUploadUrl"
              v-show="hasExtraFaceAddons"
              @input="extraFacesData = $event"
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
import Vue, { PropType, VueConstructor } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import { SfButton, SfSelect } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';
import { getProductPrice } from 'theme/helpers';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';

import { ImageHandlerService, Item } from 'src/modules/file-storage';
import { ExtraPhotoAddon, ProductValue } from 'src/modules/budsies';

import ACustomPrice from '../atoms/a-custom-price.vue';
import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import MZoomGallery from '../molecules/m-zoom-gallery.vue';
import MArtworkUpload from '../molecules/m-artwork-upload.vue';
import MExtraFaces from '../molecules/m-extra-faces.vue';
import ZoomGalleryImage from '../../interfaces/zoom-gallery-image.interface';
import ExtraPhotoAddonOption from '../interfaces/extra-photo-addon-option.interface';
import ExtraFacesConfiguratorData from '../interfaces/extra-faces-configurator-data.interface';
import CustomerImage from '../interfaces/customer-image.interface';
import { InjectType } from 'src/modules/shared';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

interface InjectedServices {
  imageHandlerService: ImageHandlerService
}

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

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
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
  inject: {
    imageHandlerService: { from: 'ImageHandlerService' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    artworkUploadUrl: {
      type: String,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  data () {
    return {
      quantity: 1,
      customerImage: undefined as CustomerImage | undefined,
      selectedStyle: undefined as string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      extraFacesData: {
        addon: undefined,
        storageItems: []
      } as ExtraFacesConfiguratorData,
      isSubmitting: false,
      shouldShowDesignSelector: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      getProductGallery: 'product/getProductGallery'
    }),
    skinClass (): string {
      return '-skin-petsies';
    },
    addonsBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(item => item.title.toLowerCase() === 'extra faces');
    },
    addons (): ExtraPhotoAddonOption[] {
      if (!this.addonsBundleOption) {
        return []
      }

      const addons: ExtraPhotoAddon[] = this.$store.getters['budsies/getPrintedProductAddons'](this.product.id);

      if (!addons.length) {
        return [];
      }

      let addonOptions: Record<string, number> = {};

      for (const productLink of this.addonsBundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        addonOptions[productLink.product.sku] = +productLink.id;
      }

      const result: ExtraPhotoAddonOption[] = [];

      for (const addon of addons) {
        const addonOption = addonOptions[addon.id];

        if (!addonOption && addon.id) {
          Logger.warn('The option product of extra photo addon is not found: ' + addon.id, 'budsies')();
          continue;
        }

        result.push({
          id: addon.id,
          label: addon.label,
          value: addon.value,
          optionId: this.addonsBundleOption.option_id,
          optionValueId: addonOption
        })
      }

      return result;
    },
    styleBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(item => item.title.toLowerCase() === 'product');
    },
    availableStyles () {
      if (!this.styleBundleOption) {
        return []
      }

      let availableStyles: SelectOption[] = [];
      for (const productLink of this.styleBundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        availableStyles.push({
          optionId: this.styleBundleOption.option_id,
          optionValueId: +productLink.id,
          value: productLink.product.sku,
          label: productLink.product.name,
          description: productLink.product.description,
          shortDescription: productLink.product.short_description ? productLink.product.short_description : '',
          price: productLink.product.regular_price,
          specialPrice: productLink.product.final_price ? productLink.product.final_price : 0
        });
      }

      return availableStyles;
    },
    backendProductId (): ProductValue {
      switch (this.product.id) {
        case 277:
          return ProductValue.PRINTED_SOCKS;
        case 340:
          return ProductValue.PRINTED_MASKS;
        case 353:
          return ProductValue.PRINTED_KEYCHAINS;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.product.id}' product ID`
          );
      }
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
    bundleProductPrice (): {regular: any, special: any} {
      return getProductPrice(this.product, this.getCurrentCustomOptions, false);
    },
    productImages (): GalleryProductImages[] {
      const images = this.getProductGallery.map((imageObject: any) => ({
        stage: imageObject.src,
        thumb: imageObject.src,
        big: imageObject.src
      }));

      let result: GalleryProductImages[] = [
        {
          sku: this.product.sku,
          images: images
        }
      ]

      if (!this.styleBundleOption) {
        return result;
      }

      for (const productLink of this.styleBundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        const gallery = getGalleryByProduct(productLink.product);

        const images = gallery.map((imageObject: any) => ({
          stage: imageObject.src,
          thumb: imageObject.src,
          big: imageObject.src
        }));

        result.push({
          sku: productLink.product.sku,
          images: images
        });
      }

      return result;
    },
    price (): number {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.price) {
        return this.bundleProductPrice.regular;
      }

      return style.price;
    },
    specialPrice (): number {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.specialPrice) {
        return this.bundleProductPrice.special;
      }

      return style.specialPrice;
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
    description (): string | undefined {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.description) {
        return this.product.description;
      }

      return style.description;
    },
    shortDescription (): string | undefined {
      const style = this.availableStyles.find(
        (item) => item.value === this.selectedStyle
      );

      if (!style || !style.shortDescription) {
        return this.product.short_description;
      }

      return style.shortDescription;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: types.PRODUCT_SET_BUNDLE_OPTION
    }),
    onArtworkAdd (value: Item): void {
      this.customerImage = {
        id: value.id,
        url: this.imageHandlerService.getOriginalImageUrl(value.url)
      };
    },
    onArtworkRemove (storageItemId: string): void {
      this.customerImage = undefined;
    },
    async onSubmit (event: Event): Promise<void> {
      this.isSubmitting = true;

      await this.$store.dispatch(
        'product/setBundleOptions',
        { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
      );

      const extraFacesArtworks: CustomerImage[] = this.extraFacesData.storageItems.map(item => ({
        id: item.id,
        url: this.imageHandlerService.getOriginalImageUrl(item.url)
      }));

      this.$store.dispatch('cart/addItem', {
        productToAdd: Object.assign({}, this.product, {
          qty: this.quantity,
          customerImages: [this.customerImage, ...extraFacesArtworks],
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
    getValidationObserver (): InstanceType<typeof ValidationObserver> | undefined {
      return this.$refs['validation-observer'] as InstanceType<typeof ValidationObserver> | undefined;
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
  created (): void {
    if (this.product.qty) {
      this.quantity = this.product.qty;
    }
  },
  watch: {
    availableStyles: {
      handler (): void {
        // SfSelect doesn't support options updating in the current package version
        this.shouldShowDesignSelector = false;

        this.$nextTick(() => {
          this.shouldShowDesignSelector = true;
        });
      }
    },
    product: {
      handler (newValue: Product, oldValue: Product | undefined) {
        if (newValue.id === oldValue?.id) {
          return;
        }

        this.selectedStyle = undefined;
        if (this.availableStyles.length === 1) {
          this.selectedStyle = this.availableStyles[0].value;
        }

        const extraFacesComponent = this.getExtraFaces();
        if (extraFacesComponent) {
          extraFacesComponent.reset();
        }

        const validator = this.getValidationObserver();
        validator?.reset();
      },
      immediate: true
    },
    selectedStyle: {
      handler () {
        if (!this.styleBundleOption) {
          Logger.error('styleBundleOption is not defined while attempt to set style was performed', 'budsies')();
          return
        }

        const selectedDesign = this.availableStyles.find(design => design.value === this.selectedStyle);

        this.setBundleOptionValue({
          optionId: this.styleBundleOption.option_id,
          optionQty: 1,
          optionSelections: selectedDesign ? [selectedDesign.optionValueId] : []
        });
      },
      immediate: false
    },
    'extraFacesData.addon': {
      handler (newValue: ExtraPhotoAddonOption | undefined) {
        if (!this.addonsBundleOption) {
          return
        }

        this.setBundleOptionValue({
          optionId: this.addonsBundleOption.option_id,
          optionQty: 1,
          optionSelections: newValue ? [newValue.optionValueId] : []
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

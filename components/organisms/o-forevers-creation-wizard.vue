<template>
  <div class="o-forevers-creation-wizard product" :class="skinClass">
    <SfHeading
      :level="1"
      :title="$t('Create Your Custom Forevers Plush')"
    />

    <div class="_content">
      <div class="_steps-container">
        <SfSteps
          class="_steps"
          :active="currentStep"
          :steps="steps"
          :can-go-back="canGoBack"
          @change="onChangeStep"
        >
          <SfStep name="Type">
            <MProductTypeChooseStep
              :value="productTypeStepData"
              :disabled="isSubmitting || isProductLoadingForExistingPlushieId"
              @input="onProductTypeStepDataInput"
              @next-step="nextStep"
            />
          </SfStep>

          <SfStep name="Photo">
            <MImageUploadStep
              :initial-value="imageUploadStepData"
              :artwork-upload-url="artworkUploadUrl"
              :product="activeProduct"
              :plushie-id="plushieId"
              :disabled="isSubmitting"
              @input="onImageUploadStepDataInput"
              @next-step="nextStep"
              v-if="plushieId"
            />
          </SfStep>

          <SfStep name="Pet Info">
            <MPetInfoStep
              v-model="petInfoStepData"
              :plushie-id="plushieId"
              :product="activeProduct"
              :disabled="isSubmitting"
              @next-step="nextStep"
              @input-field-blur="onPetInfoStepInputFieldBlur"
            />
          </SfStep>

          <SfStep name="Customize">
            <MCustomizeStep
              v-model="customizeStepData"
              :plushie-id="plushieId"
              :product="activeProduct"
              :addons-bundle-option="addonsBundleOption"
              :production-time-bundle-option="productionTimeBundleOption"
              :add-to-cart="onAddToCartHandler"
              :disabled="isSubmitting"
              @next-step="nextStep"
            />
          </SfStep>
        </SfSteps>
      </div>

      <MFloatingPhoto
        v-if="showFloatingPhoto"
        :image-url="floatingPhotoImageUrl"
        :pet-name="petInfoStepData.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { setBundleProductOptionsAsync } from '@vue-storefront/core/modules/catalog/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import { SfHeading, SfSteps } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';
import CartItem from 'core/modules/cart/types/CartItem';

import {
  ImageUploadMethod,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';
import ServerError from 'src/modules/shared/types/server-error';
import ForeversCreationWizardPersistanceStateService from 'theme/helpers/forevers-creation-wizard-persistance-state.service';

import MProductTypeChooseStep from './OForeversCreationWizard/m-product-type-choose-step.vue';
import MImageUploadStep from './OForeversCreationWizard/m-image-upload-step.vue';
import MPetInfoStep from './OForeversCreationWizard/m-pet-info-step.vue';
import MCustomizeStep from './OForeversCreationWizard/m-customize-step.vue';
import MFloatingPhoto from './OForeversCreationWizard/m-floating-photo.vue';

import ForeversWizardProductTypeStepData from '../interfaces/forevers-wizard-product-type-step-data.interface';
import ForeversWizardImageUploadStepData from '../interfaces/forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from '../interfaces/forevers-wizard-pet-info-step-data.interface';
import ForeversWizardCustomizeStepData from '../interfaces/forevers-wizard-customize-step-data.interface';
import BodypartOption from '../interfaces/bodypart-option';
import CustomerImage from '../interfaces/customer-image.interface';
import ForeversCreationWizardPersistanceState from '../interfaces/forevers-creation-wizard-persistance-state.interface';

export default Vue.extend({
  name: 'OForeversCreationWizard',
  components: {
    SfSteps,
    SfHeading,
    MProductTypeChooseStep,
    MImageUploadStep,
    MPetInfoStep,
    MCustomizeStep,
    MFloatingPhoto
  },
  props: {
    artworkUploadUrl: {
      type: String,
      required: true
    },
    existingPlushieId: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      currentStep: 0,

      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      productTypeStepData: {
        product: undefined,
        plushieId: undefined
      } as ForeversWizardProductTypeStepData,
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      imageUploadStepData: {
        uploadMethod: ImageUploadMethod.NOW,
        customerImages: []
      } as ForeversWizardImageUploadStepData,
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      petInfoStepData: {
        name: undefined,
        breed: undefined,
        email: undefined
      } as ForeversWizardPetInfoStepData,
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      customizeStepData: {
        bodypartsValues: {},
        addons: [],
        description: undefined,
        productionTime: undefined,
        quantity: 1
      } as ForeversWizardCustomizeStepData,

      isSubmitting: false,
      foreversCreationWizardPersistanceStateService: undefined as ForeversCreationWizardPersistanceStateService | undefined,
      isProductLoadingForExistingPlushieId: false
    }
  },
  computed: {
    canGoBack (): boolean {
      return !this.isSubmitting && (this.currentStep !== 1 || !this.existingCartitem);
    },
    getBodypartOptions (): (id: string) => BodypartOption[] {
      return this.$store.getters['budsies/getBodypartOptions']
    },
    cartItems (): CartItem[] {
      return this.$store.getters['cart/getCartItems']
    },
    customerImages (): CustomerImage[] {
      if (this.imageUploadStepData.uploadMethod !== ImageUploadMethod.NOW) {
        return [];
      }

      return this.imageUploadStepData.customerImages;
    },
    skinClass (): string {
      return '-skin-petsies';
    },
    activeProduct (): Product | CartItem | null {
      return this.existingCartitem ? this.existingCartitem : this.product;
    },
    product (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    plushieId (): number | undefined {
      return this.productTypeStepData.plushieId;
    },
    addonsBundleOption (): BundleOption | undefined {
      return this.getBundleOption('addons');
    },
    productionTimeBundleOption (): BundleOption | undefined {
      return this.getBundleOption('production time');
    },
    existingCartitem (): CartItem | undefined {
      return this.cartItems.find(({ plushieId }) => plushieId && plushieId === this.existingPlushieId);
    },
    steps (): TranslateResult[] {
      return [
        this.$t('Type'),
        this.$t('Photo'),
        this.$t('Pet Info'),
        this.$t('Customize')
      ]
    },
    showFloatingPhoto (): boolean {
      return (this.currentStep === this.steps.length - 1) && !!this.floatingPhotoImageUrl;
    },
    floatingPhotoImageUrl (): string | undefined {
      return this.customerImages[0] ? this.customerImages[0].url : undefined;
    }
  },
  methods: {
    async addToCart (): Promise<void> {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      await this.$store.dispatch(
        'product/setBundleOptions',
        { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
      );

      this.$store.commit(
        budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CUSTOMER_EMAIL_SET,
        { email: this.petInfoStepData.email }
      );

      try {
        try {
          await this.$store.dispatch('cart/addItem', {
            productToAdd: Object.assign({}, this.product, {
              qty: this.customizeStepData.quantity,
              plushieId: this.plushieId + '',
              email: this.petInfoStepData.email?.trim(),
              plushieName: this.petInfoStepData.name?.trim(),
              plushieBreed: this.petInfoStepData.breed?.trim(),
              plushieDescription: this.customizeStepData.description?.trim(),
              bodyparts: this.getBodypartsData(),
              uploadMethod: this.imageUploadStepData.uploadMethod,
              customerImages: this.customerImages
            })
          });
        } catch (error) {
          if (error instanceof ServerError) {
            throw error;
          }

          Logger.error(error, 'budsies')();
        }

        this.goToCrossSells();

        if (!this.plushieId) {
          throw new Error('Plushie Id is undefined');
        }

        if (!this.foreversCreationWizardPersistanceStateService) {
          this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
        }

        this.foreversCreationWizardPersistanceStateService.removeStateByPlushieId(this.plushieId);
      } catch (error) {
        Logger.error(error, 'budsies')();

        this.onFailure('Unexpected error: ' + error);
      } finally {
        this.isSubmitting = false;
      }
    },
    fillAddons (cartItem: CartItem): void {
      const productOption = cartItem.product_option;
      this.customizeStepData.addons = [];

      if (!this.addonsBundleOption || !productOption) {
        return;
      }

      if (!productOption.extension_attributes.bundle_options[this.addonsBundleOption.option_id]) {
        return;
      }

      this.customizeStepData.addons = productOption.extension_attributes.bundle_options[this.addonsBundleOption.option_id].option_selections.map((selection: number) => selection);
    },
    fillBodypartsValues (cartItem: CartItem): void {
      this.customizeStepData.bodypartsValues = {};

      if (!cartItem.bodyparts) {
        return;
      }

      const bodyparts: Record<string, string[]> = cartItem.bodyparts as Record<string, string[]>;

      Object.keys(bodyparts).forEach((key: string) => {
        Vue.set(
          this.customizeStepData.bodypartsValues,
          key,
          this.getBodypartOptions(key).filter(
            (bodypart: BodypartOption) => bodyparts[key].includes(bodypart.id)
          )
        );
      });
    },
    async fillPlushieData (): Promise<void> {
      if (!this.existingCartitem) {
        return;
      }

      this.currentStep = 1; // todo

      this.fillImageUploadStepData(this.existingCartitem);
      this.fillProductTypeStepData(this.existingCartitem);
      this.fillPetInfoStepData(this.existingCartitem);

      await this.loadProductOptions(this.existingCartitem.id);

      this.fillCustomizeStepData(this.existingCartitem);
    },
    async fillPlushieDataFromPersistedState (): Promise<void> {
      if (this.existingCartitem || !this.existingPlushieId) {
        return;
      }

      if (!this.foreversCreationWizardPersistanceStateService) {
        this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
      }

      const persistanceState = await this.foreversCreationWizardPersistanceStateService.getStateByPlushieId(Number.parseInt(this.existingPlushieId));

      await this.fillProductTypeStepDataFromPersistanceState(persistanceState);
      this.fillImageUploadStepDataFromPersistanceState(persistanceState);
      this.fillPetInfoStepDataFromPersistanceState(persistanceState);
    },
    fillProductTypeStepData (cartItem: CartItem): void {
      this.productTypeStepData.product = cartItem;
      this.productTypeStepData.plushieId = cartItem.plushieId ? Number.parseInt(cartItem.plushieId, 10) : undefined;
    },
    async fillProductTypeStepDataFromPersistanceState (persistanceState?: ForeversCreationWizardPersistanceState): Promise<void> {
      if (!persistanceState?.productTypeData) {
        this.productTypeStepData = {
          product: undefined,
          plushieId: undefined
        };
        return;
      }

      this.isProductLoadingForExistingPlushieId = true;

      const product = await this.$store.dispatch(
        'product/loadProduct',
        { parentSku: persistanceState.productTypeData.productSku }
      );

      this.productTypeStepData = {
        product,
        plushieId: persistanceState.productTypeData.plushieId
      }

      this.isProductLoadingForExistingPlushieId = false;

      this.currentStep = 1;
    },
    fillImageUploadStepDataFromPersistanceState (persistanceState?: ForeversCreationWizardPersistanceState): void {
      if (!persistanceState?.imageUploadStepData) {
        this.imageUploadStepData = {
          uploadMethod: ImageUploadMethod.NOW,
          customerImages: []
        };
        return;
      }

      this.imageUploadStepData = persistanceState.imageUploadStepData;

      if (
        (this.imageUploadStepData.uploadMethod === ImageUploadMethod.NOW && this.imageUploadStepData.customerImages.length !== 0) ||
           this.imageUploadStepData.uploadMethod !== ImageUploadMethod.NOW
      ) {
        this.currentStep = 2;
      }
    },
    fillPetInfoStepDataFromPersistanceState (persistanceState?: ForeversCreationWizardPersistanceState): void {
      if (!persistanceState?.petInfoStepData) {
        this.petInfoStepData = {
          name: undefined,
          breed: undefined,
          email: undefined
        };
        return;
      }

      this.petInfoStepData = persistanceState.petInfoStepData;

      if (this.petInfoStepData.name && this.petInfoStepData.breed && this.petInfoStepData.email) {
        this.currentStep = 3;
      }
    },
    fillProductionTime (cartItem: CartItem): void {
      const productOption = cartItem.product_option;
      this.customizeStepData.productionTime = undefined;
      if (!this.productionTimeBundleOption || !productOption) {
        return;
      }

      if (!productOption.extension_attributes.bundle_options[this.productionTimeBundleOption.option_id]) {
        return;
      }

      this.customizeStepData.productionTime = productOption.extension_attributes.bundle_options[this.productionTimeBundleOption.option_id].option_selections[0];
    },
    fillImageUploadStepData (cartItem: CartItem): void {
      this.imageUploadStepData.uploadMethod = cartItem.uploadMethod
        ? cartItem.uploadMethod as ImageUploadMethod
        : ImageUploadMethod.NOW;
      this.imageUploadStepData.customerImages = cartItem.customerImages ? cartItem.customerImages : [];
    },
    fillPetInfoStepData (cartItem: CartItem): void {
      this.petInfoStepData.name = cartItem.plushieName;
      this.petInfoStepData.breed = cartItem.plushieBreed;
      this.petInfoStepData.email = cartItem.email;
    },
    fillCustomizeStepData (cartItem: CartItem): void {
      this.fillBodypartsValues(cartItem);
      this.fillAddons(cartItem);
      this.fillProductionTime(cartItem);
      this.customizeStepData.description = cartItem.plushieDescription;
      this.customizeStepData.quantity = cartItem.qty;
    },
    nextStep (): void {
      if (this.currentStep === 3) {
        return;
      }

      this.currentStep += 1;
    },
    getBodypartsData (): Record<string, string[]> {
      let data: Record<string, string[]> = {};

      for (const bodyPartId in this.customizeStepData.bodypartsValues) {
        let value = this.customizeStepData.bodypartsValues[bodyPartId];

        if (value === undefined) {
          continue;
        }

        if (!Array.isArray(value)) {
          value = [value]
        }

        data[bodyPartId] = value.map(item => item.id);
      }

      return data;
    },
    getBundleOption (optionTitle: string): BundleOption | undefined {
      if (!this.activeProduct?.bundle_options) {
        return undefined;
      }

      return this.activeProduct.bundle_options.find((option: BundleOption) => option.title.toLowerCase() === optionTitle);
    },
    goToCrossSells (): void {
      let route;
      if (this.product) {
        route = '/cross-sells/p/' + this.product.sku
      } else {
        route = '/cart'
      }

      this.$router.push(localizedRoute(route));
    },
    async loadProductOptions (id?: number | string): Promise<void> {
      await Promise.all([
        this.$store.dispatch('budsies/loadProductBodyparts', { productId: id }),
        this.$store.dispatch('budsies/loadProductRushAddons', { productId: id })
      ]);
    },
    onAddToCartHandler (): void {
      if (this.existingCartitem) {
        this.updateExistingCartItem();
      } else {
        this.addToCart();
      }
    },
    onChangeStep (nextStep: number) {
      if (nextStep < this.currentStep) {
        this.currentStep = nextStep;
      }
    },
    onFailure (message: any): void {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    onImageUploadStepDataInput (value: ForeversWizardImageUploadStepData): void {
      this.imageUploadStepData = value;
      this.persistImageUploadStepData(value);
    },
    onPetInfoStepInputFieldBlur (): void {
      this.persistPetInfoStepData(this.petInfoStepData);
    },
    onProductTypeStepDataInput (value: ForeversWizardProductTypeStepData): void {
      this.productTypeStepData = value;
      this.persistProductTypeStepData(value);
      this.$router.push({ query: { ...this.$route.query, id: value.plushieId?.toString(10) } });
    },
    persistImageUploadStepData (value: ForeversWizardImageUploadStepData): void {
      if (this.existingCartitem) {
        return;
      }

      if (!this.plushieId) {
        throw new Error('Plushie id is undefined');
      }

      if (!this.foreversCreationWizardPersistanceStateService) {
        this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
      }

      this.foreversCreationWizardPersistanceStateService.saveImageUploadStepData(this.plushieId, value);
    },
    persistPetInfoStepData (value: ForeversWizardPetInfoStepData): void {
      if (this.existingCartitem) {
        return;
      }

      if (!this.plushieId) {
        throw new Error('Plushie id is undefined');
      }

      if (!this.foreversCreationWizardPersistanceStateService) {
        this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
      }

      this.foreversCreationWizardPersistanceStateService.savePetInfoStepData(this.plushieId, value);
    },
    persistProductTypeStepData (value: ForeversWizardProductTypeStepData): void {
      if (this.existingCartitem) {
        return;
      }

      if (!value.plushieId || !value.product) {
        throw new Error('Plushie Id or Product Sku is undefined');
      }

      if (!this.foreversCreationWizardPersistanceStateService) {
        this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
      }

      this.foreversCreationWizardPersistanceStateService.saveProductTypeStepData(value.plushieId, value.product.sku);
    },
    setBundleOptionValue (optionId: number, optionQty: number, optionSelections: number[]): void {
      this.$store.commit('product' + '/' + catalogTypes.PRODUCT_SET_BUNDLE_OPTION, { optionId, optionQty, optionSelections });
    },
    async updateClientAndServerItem (payload: {
      product: CartItem,
      forceUpdateServerItem?: boolean,
      forceClientState?: boolean
    }): Promise<void> {
      await this.$store.dispatch('cart/updateClientAndServerItem', payload);
    },
    async updateExistingCartItem (): Promise<void> {
      if (!this.existingCartitem) {
        return;
      }

      this.isSubmitting = true;

      try {
        try {
          await this.updateClientAndServerItem({
            product: Object.assign({}, this.existingCartitem, {
              qty: this.customizeStepData.quantity,
              plushieId: this.plushieId + '',
              email: this.petInfoStepData.email?.trim(),
              plushieName: this.petInfoStepData.name?.trim(),
              plushieBreed: this.petInfoStepData.breed?.trim(),
              plushieDescription: this.customizeStepData.description?.trim(),
              bodyparts: this.getBodypartsData(),
              uploadMethod: this.imageUploadStepData.uploadMethod,
              product_option: setBundleProductOptionsAsync(null, { product: this.existingCartitem, bundleOptions: this.$store.state.product.current_bundle_options }),
              customerImages: this.customerImages
            }),
            forceUpdateServerItem: true
          });
        } catch (error) {
          if (error instanceof ServerError) {
            throw error;
          }

          Logger.error(error, 'budsies')();
        }

        this.goToCrossSells();
      } catch (error) {
        Logger.error(error, 'budsies')();

        this.onFailure('Unexpected error: ' + error);
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  created (): void {
    this.$store.dispatch('budsies/loadBreeds');

    this.fillPlushieData();
  },
  beforeMount (): void {
    this.foreversCreationWizardPersistanceStateService = new ForeversCreationWizardPersistanceStateService();
    this.fillPlushieDataFromPersistedState();
  },
  watch: {
    product: {
      async handler () {
        if (!this.product) {
          return;
        }

        await this.loadProductOptions(this.product.id);
      },
      immediate: true

    },
    'customizeStepData.addons': {
      handler (newValue: number[]) {
        if (!this.addonsBundleOption) {
          return
        }

        this.setBundleOptionValue(
          this.addonsBundleOption.option_id,
          1,
          newValue
        );
      },
      immediate: false
    },
    'customizeStepData.productionTime': {
      handler (newValue: number | undefined) {
        if (!this.productionTimeBundleOption) {
          return
        }

        this.setBundleOptionValue(this.productionTimeBundleOption.option_id,
          1,
          newValue ? [newValue] : []
        );
      },
      immediate: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";
@import "~@storefront-ui/shared/styles/helpers/layout";
@import "~@storefront-ui/shared/styles/components/atoms/SfHeading";

.o-forevers-creation-wizard {
  --steps-content-padding: var(--spacer-base) var(--spacer-sm) 0;
  $floating-photo-width: 14%;

  text-align: center;

  .sf-step {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }

  b,
  strong {
    font-weight: var(--font-semibold);
  }

  ._step-divider {
    display: none;
  }

  ._step-number {
    display: inline-block;
    margin-top: var(--spacer-lg);
    text-transform: uppercase;
    color: var(--_c-light-primary);
    font-size: var(--font-xl);
    font-weight: var(--font-semibold);
    @include border(--step-border, 0 0 4px 0, solid, var(--_c-light-primary));

    &._email-step {
      margin-top: var(--spacer-2xl);
    }
  }

  ._step-title {
    margin-top: var(--spacer-base);
    --heading-title-font-size: var(--font-xl);
    --heading-title-font-weight: var(--font-semibold);

    &.-required {
      ::v-deep .sf-heading__title::after {
        color: var(--c-danger-variant);
        content: "*";
      }
    }
  }

  ._popup-link {
    font-weight: var(--font-medium);
  }

  ._popup-content {
    text-align: left;
  }

  .sf-input {
    text-align: center;
    display: inline-block;
    --input-width: 20em;
  }

  .sf-modal {
    --modal-top: 3.75rem;
  }

  .sf-divider {
    margin-top: var(--spacer-xl);
  }

  .m-bodypart-option-configurator {
    margin-top: var(--spacer-base);
  }

  .m-artwork-upload {
    margin: var(--spacer-lg) auto;
    max-width: 610px;
  }

  ._qty-container {
      margin-top: var(--spacer-xs);
  }

  ._actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--spacer-xl);

    ._add-to-cart-and-make-another {
      margin: var(--spacer-lg) 0 0 0;
      font-size: var(--font-sm);
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
      font-size: var(--font-xs);
      margin-top: var(--spacer-sm);
      height: calc(var(--font-xs) * 1.2);
  }

  ._form-errors {
    margin-top: var(--spacer-xl);
    min-height: calc(var(--font-xs) * 1.2 * 4);

    ._error-link {
      color: inherit;
    }
  }

  ._order-agreement {
    max-width: 50em;
    font-size: var(--font-xs);

  }

  &.-skin-petsies {
      ._error-text {
          color: var(--c-danger-variant);
      }
  }

  .m-floating-photo {
    position: absolute;
    top: 0;
    display: none;
    width: $floating-photo-width;
    right: 0;
    height: 100%;
  }

  ._content {
    display: flex;
    justify-content: center;
    position: relative;
  }

  ._steps-container {
    display: flex;
    justify-content: center;
    flex-grow: 1;
  }

  ._steps {
    flex-grow: 1;
  }

  @media (min-width: $tablet-min) {

    ._step-divider {
      display: block;
    }
  }

@include for-desktop {
  .m-floating-photo {
    display: block;
  }

  ._steps-container {
    max-width: calc(100% - #{$floating-photo-width} * 2 - 50px);
  }

  ._steps {
    max-width: 77.5rem;
  }

  .sf-modal {
    --modal-top: 50%;
  }
}

}
</style>

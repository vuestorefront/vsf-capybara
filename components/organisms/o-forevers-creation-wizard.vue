<template>
  <div class="o-forevers-creation-wizard product" :class="skinClass">
    <SfHeading
      :level="1"
      :title="$t('Create Your Custom Forevers Plush')"
    />

    <SfSteps
      :active="currentStep"
      :steps="[$t('Type'), $t('Photo'), $t('Pet Info'), $t('Customize')]"
      :can-go-back="!isSubmitting"
      @change="onChangeStep"
    >
      <SfStep name="Type">
        <MProductTypeChooseStep
          v-model="productTypeStepData"
          :disabled="isSubmitting"
          @next-step="nextStep"
        />
      </SfStep>

      <SfStep name="Photo">
        <MImageUploadStep
          :initial-value="imageUploadStepData"
          :artwork-upload-url="artworkUploadUrl"
          :product="product"
          :plushie-id="plushieId"
          :disabled="isSubmitting"
          @input="imageUploadStepData = $event"
          @next-step="nextStep"
          v-if="plushieId"
        />
      </SfStep>

      <SfStep name="Pet Info">
        <MPetInfoStep
          v-model="petInfoStepData"
          :plushie-id="plushieId"
          :disabled="isSubmitting"
          @next-step="nextStep"
        />
      </SfStep>

      <SfStep name="Customize">
        <MCustomizeStep
          v-model="customizeStepData"
          :plushie-id="plushieId"
          :product="product"
          :addons-bundle-option="addonsBundleOption"
          :production-time-bundle-option="productionTimeBundleOption"
          :add-to-cart="addToCart"
          :disabled="isSubmitting"
          @next-step="nextStep"
        />
      </SfStep>
    </SfSteps>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapMutations } from 'vuex';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import { SfHeading, SfSteps } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';

import {
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';

import MProductTypeChooseStep from './OForeversCreationWizard/m-product-type-choose-step.vue';
import MImageUploadStep from './OForeversCreationWizard/m-image-upload-step.vue';
import MPetInfoStep from './OForeversCreationWizard/m-pet-info-step.vue';
import MCustomizeStep from './OForeversCreationWizard/m-customize-step.vue';

import AddonOption from '../interfaces/addon-option.interface';
import BodypartOption from '../interfaces/bodypart-option';
import ProductionTimeOption from '../interfaces/production-time-option.interface';

interface InjectedServices {
  window: Window
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'OForeversCreationWizard',
  components: {
    SfSteps,
    SfHeading,
    MProductTypeChooseStep,
    MImageUploadStep,
    MPetInfoStep,
    MCustomizeStep
  },
  props: {
    artworkUploadUrl: {
      type: String,
      required: true
    },
    uploadedArtworkId: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      currentStep: 0,

      productTypeStepData: {
        product: undefined as Product | undefined,
        plushieId: undefined as number | undefined
      },
      imageUploadStepData: {
        uploadMethod: 'now' as 'now' | 'later',
        storageItemsIds: [] as string[]
      },
      petInfoStepData: {
        name: undefined as string | undefined,
        breed: undefined as string | undefined,
        email: undefined as string | undefined
      },
      customizeStepData: {
        bodypartsValues: {} as unknown as Record<string, BodypartOption | BodypartOption[] | undefined>,
        addons: [] as AddonOption[],
        description: undefined as string | undefined,
        productionTime: undefined as ProductionTimeOption | undefined,
        quantity: 1
      },

      isSubmitting: false
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    product (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    plushieId (): number | undefined {
      return this.productTypeStepData.plushieId;
    },
    addonsBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      let result;

      for (const option of this.product.bundle_options) {
        if (option.title === 'Addons') {
          result = option;
          break;
        }
      }

      return result;
    },
    productionTimeBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      let result;

      for (const option of this.product.bundle_options) {
        if (option.title === 'Production time') {
          result = option;
          break;
        }
      }

      return result;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
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

      let storageItemsIds: string[] = [];
      if (this.imageUploadStepData.uploadMethod === 'now') {
        storageItemsIds = this.imageUploadStepData.storageItemsIds;
      }

      try {
        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, {
            qty: this.customizeStepData.quantity,
            plushieId: this.plushieId + '',
            email: this.petInfoStepData.email,
            plushieName: this.petInfoStepData.name,
            plushieBreed: this.petInfoStepData.breed,
            plushieDescription: this.customizeStepData.description,
            bodyparts: this.getBodypartsData(),
            customerImagesIds: storageItemsIds,
            uploadMethod: this.imageUploadStepData.uploadMethod === 'now' ? 'upload-now' : 'upload-email'
          })
        });

        this.goToCart();
      } catch (err) {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      } finally {
        this.isSubmitting = false;
      }
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
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
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
    }
  },
  created (): void {
    this.$store.dispatch('budsies/loadBreeds');

    if (this.uploadedArtworkId) {
      this.imageUploadStepData.storageItemsIds = [ this.uploadedArtworkId ];
      this.imageUploadStepData.uploadMethod = 'now';
    }
  },
  watch: {
    product: {
      async handler () {
        if (!this.product) {
          return;
        }

        await Promise.all([
          this.$store.dispatch('budsies/loadProductBodyparts', { productId: this.product.id }),
          this.$store.dispatch('budsies/loadProductRushAddons', { productId: this.product.id })
        ]);
      },
      immediate: true

    },
    'customizeStepData.addons': {
      handler (newValue: AddonOption[]) {
        if (!this.addonsBundleOption) {
          return
        }

        this.setBundleOptionValue({
          optionId: this.addonsBundleOption.option_id,
          optionQty: 1,
          optionSelections: newValue.map(item => item.optionValueId)
        });
      },
      immediate: false
    },
    'customizeStepData.productionTime': {
      handler (newValue: ProductionTimeOption) {
        if (!this.productionTimeBundleOption) {
          return
        }

        this.setBundleOptionValue({
          optionId: this.productionTimeBundleOption.option_id,
          optionQty: 1,
          optionSelections: newValue.optionValueId ? [newValue.optionValueId] : []
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
@import "~@storefront-ui/shared/styles/helpers/layout";
@import "~@storefront-ui/shared/styles/components/atoms/SfHeading";

.o-forevers-creation-wizard {
  --steps-content-padding: var(--spacer-base) var(--spacer-sm) 0;

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

  @media (min-width: $tablet-min) {

    ._step-divider {
      display: block;
    }
  }

@include for-desktop {
  .sf-modal {
    --modal-top: 50%;
  }
}

}
</style>

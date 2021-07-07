<template>
  <div class="o-forevers-creation-wizard product" :class="skinClass">
    <SfHeading
      :level="1"
      :title="$t('Create Your Custom Forevers Plush')"
    />

    <SfSteps
      :active="currentStep"
      :steps="steps.map(step => step.name)"
      @change="changeStep"
    >
      <!-- <SfStep v-for="step in steps" :key="step.key" :name="step.name"> -->
      <!-- <component :is="step.component" :is-active="true" /> -->
      <SfStep key="product_type" name="Type">
        <MProductTypeChooseStep v-model="productTypeStepData" @next-step="nextStep" />
      </SfStep>

      <SfStep key="photo" name="Photo">
        <MImageUploadStep
          v-model="imageUploadStepData"
          :artwork-upload-url="artworkUploadUrl"
          :product="product"
          :plushie-id="plushieId"
          @next-step="nextStep"
        />
      </SfStep>

      <SfStep key="pet_info" name="Pet Info">
        <MPetInfoStep
          v-model="petInfoStepData"
          :plushie-id="plushieId"
          @next-step="nextStep"
        />
      </SfStep>

      <SfStep key="customize" name="Customize">
        <MCustomizeStep
          v-model="customizeStepData"
          :plushie-id="plushieId"
          :product="product"
          @next-step="nextStep"
        />
      </SfStep>
    </SfSteps>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import { TranslateResult } from 'vue-i18n';
import { mapMutations } from 'vuex';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import { SfHeading, SfSteps } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';

import { InjectType } from 'src/modules/shared';
import {
  Bodypart,
  BodypartValue,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';

import MProductTypeChooseStep from './OForeversCreationWizard/m-product-type-choose-step.vue';
import MImageUploadStep from './OForeversCreationWizard/m-image-upload-step.vue';
import MPetInfoStep from './OForeversCreationWizard/m-pet-info-step.vue';
import MCustomizeStep from './OForeversCreationWizard/m-customize-step.vue';

import BodypartOption from '../interfaces/bodypart-option';
import AddonOption from '../interfaces/addon-option.interface';

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
        product: undefined,
        plushieId: undefined
      },
      imageUploadStepData: {
        uploadMethod: 'now',
        storageItemId: undefined
      },
      petInfoStepData: {
        name: undefined,
        breed: undefined,
        email: undefined
      },
      customizeStepData: {
        bodypartsValues: {},
        addons: [],
        description: undefined,
        quantity: 1
      },

      size: undefined as BodypartOption | undefined,
      isSubmitting: false,
      shouldMakeAnother: false,

      selectedAddons: [] as string[]
    }
  },
  computed: {
    steps (): Record<string, string | TranslateResult>[] {
      return [
        {
          key: 'product_type',
          name: this.$t('Type'),
          component: 'div'
        },
        {
          key: 'photo',
          name: this.$t('Photo'),
          component: 'div'
        },
        {
          key: 'pet_info',
          name: this.$t('Pet Info'),
          component: 'div'
        },
        {
          key: 'customize',
          name: this.$t('Customize'),
          component: 'div'
        }
      ]
    },
    skinClass (): string {
      return '-skin-petsies';
    },
    product (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    plushieId (): number | undefined {
      return this.productTypeStepData.plushieId;
    }

  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
    changeStep (nextStep: number) {
      if (nextStep < this.currentStep) {
        // this.$bus.$emit('checkout-before-edit', this.steps[nextStep].key);
        this.currentStep = nextStep;
      }
    },
    nextStep (): void {
      if (this.currentStep === 3) {
        return;
      }

      this.currentStep += 1;
    },
    getBodypartsData (): Record<string, string> {
      let data: Record<string, string> = {};

      for (let key in this.bodypartsValues) {
        const value = this.bodypartsValues[key];

        if (value === undefined) {
          continue;
        }

        data[value.optionId] = value.optionValueId;
      }

      return data;
    },
    // getValidationObserver (): InstanceType<typeof ValidationObserver> | undefined {
    //   return this.$refs['validation-observer'] as InstanceType<typeof ValidationObserver> | undefined;
    // },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    },
    goToFieldByName (field: string): void {
      // Strip quotes
      let refName = field.replace(/^['"]+|['"]+$/g, '');
      // Strip spaces & convert to lower case
      refName = refName.toLowerCase().replace(/ /g, '-');

      refName += '-field-anchor';

      const ref = this.$refs[refName] as HTMLElement | undefined;
      if (!ref) {
        Logger.warn(`Reference for the field with error not found. Field: ${field}, ref: ${refName}`, 'budsies')();
        return;
      }

      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    prefillEmail (): void {
      const customerEmail = this.$store.getters['budsies/getCustomerEmail'];
      if (customerEmail) {
        this.email = customerEmail;
        this.showEmailStep = false;
      }
    },
    resetForm (): void {
      this.quantity = this.product.qty;
      this.storageItemId = undefined;
      this.size = undefined;
      this.name = undefined;

      for (const bodypart of this.bodyparts) {
        this.bodypartsValues[bodypart.code] = undefined;
      }

      const uploader = this.getUploader();
      if (uploader) {
        uploader.clearInput();
      }

      const validator = this.getValidationObserver();
      validator?.reset();
    },
    async onSubmit (event: Event): Promise<void> {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      const shouldMakeAnother = this.shouldMakeAnother;
      this.shouldMakeAnother = false;

      await this.$store.dispatch(
        'product/setBundleOptions',
        { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
      );

      this.$store.commit(
        budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CUSTOMER_EMAIL_SET,
        { email: this.email }
      );

      try {
        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, {
            qty: this.quantity,
            plushieId: this.plushieId + '',
            email: this.email,
            plushieName: this.name,
            bodyparts: this.getBodypartsData(),
            customerImagesIds: this.isUploadNow && this.storageItemId ? [this.storageItemId] : [],
            uploadMethod: this.isUploadNow ? 'upload-now' : 'upload-email'
          })
        });

        if (!shouldMakeAnother) {
          this.goToCart();
          return;
        }

        // this.resetForm();
        this.window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        const notification = notifications.createNotification({
          type: 'info',
          message: 'Product was added to the cart',
          timeToLive: 5 * 1000
        });

        this.$store.dispatch(
          'notification/spawnNotification',
          notification,
          { root: true }
        );
        this.$emit('make-another');
      } catch (err) {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      } finally {
        this.isSubmitting = false;
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
    // this.resetForm();

    if (this.uploadedArtworkId) {
      this.storageItemId = this.uploadedArtworkId;
    }
  },
  watch: {
    size: {
      handler () {
        if (!this.size) {
          return
        }

        this.setBundleOptionValue({
          optionId: this.size.optionId,
          optionQty: 1,
          optionSelections: [this.size.optionValueId]
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

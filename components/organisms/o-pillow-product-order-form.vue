<template>
  <div class="o-pillow-product-order-form product" :class="skinClass">
    <header class="sf-heading sf-heading--no-underline">
      <h1 class="sf-heading__title">
        Pillow Order Form
      </h1>
    </header>

    <div class="_top-notes">
      <p><b>Estimated Delivery: 2 weeks</b></p>
      <p><i>Please make sure everything is correct before submitting. Your pillow goes straight to print!</i></p>
    </div>

    <SfDivider />

    <validation-observer v-slot="{ passes }" slim>
      <form
        @submit.prevent="(event) => passes(() => onSubmit(event))"
      >
        <div class="_step-number">
          Step {{ getNextStepNumber(true) }}
        </div>
        <h2 class="_step-title -required sf-heading__title">
          Upload your photo
        </h2>
        <p>We do not edit your photos. The photo you submit will be printed on the pillow as is.</p>
        <p>Don't have your photos? You can finalize your order and send them to us later.</p>
        <validation-provider
          v-slot="{ errors }"
          name="'Artwork'"
          tag="div"
        >
          <input
            type="hidden"
            name="uploaded_artwork_ids[]"
            :value="fStorageItemId"
            required
          >

          <MArtworkUpload
            ref="artwork-upload"
            class="_file-uploader"
            :product-id="backendProductId"
            :disabled="isUploadDisabled"
            :upload-url="artworkUploadUrl"
            @input="onArtworkChange"
          />

          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>
        <p><b>Please Note: We recommend high resolution, clear photos for our Petsies Pillows!</b></p>
        <p><b>Low quality, dark or blurry photos may impact photo clarity on your Pillow.</b></p>
        <SfDivider />
        <div class="_step-number">
          Step {{ getNextStepNumber() }}
        </div>
        <h2 class="_step-title -required sf-heading__title">
          Size
        </h2>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="'Size'"
          tag="div"
        >
          <m-bodypart-option-configurator
            name="pillow_size"
            v-model="fSize"
            :options="sizes"
          />
          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>
        <div
          v-for="bodypart in bodyparts"
          :key="bodypart.id"
        >
          <div class="_step-number">
            Step {{ getNextStepNumber() }}
          </div>
          <h2 class="_step-title -required sf-heading__title">
            {{ bodypart.name }}
          </h2>
          <validation-provider
            v-slot="{ errors }"
            rules="required"
            :name="`'${bodypart.name}'`"
            tag="div"
          >
            <m-bodypart-option-configurator
              :name="bodypart.code"
              v-model="fBodypartsValues[bodypart.code]"
              :options="getBodypartValues(bodypart)"
              type="bodypart"
            />
            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>
        <div class="_step-number">
          Step {{ getNextStepNumber() }}
        </div>
        <h2 class="_step-title -required sf-heading__title">
          Your Pet's Name
        </h2>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="'Pet Name'"
          tag="div"
        >
          <SfInput
            name="pet_name"
            v-model="fName"
            placeholder="Name"
            :required="false"
          />
          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>
        <validation-provider
          v-slot="{ errors, classes }"
          rules="required"
          :name="'Quantity'"
          slim
        >
          <div class="_quantity-field" :class="classes">
            <h2 class="_step-title -required sf-heading__title">
              Quantity
            </h2>

            <ACustomProductQuantity
              v-model="fQuantity"
              class="_qty-container"
            />

            <div class="_error-text">
              {{ errors[0] }}
            </div>

            <a
              class="_popup-link"
              href="javascript:void(0)"
              @click="fQuantityNotesVisible = true"
            >Quantity & Shipping Discounts</a>

            <SfModal
              :visible="fQuantityNotesVisible"
              @close="fQuantityNotesVisible = false"
            >
              <div class="_popup-content">
                <p><b>Quantity Discounts</b></p>
                <p>All quantity discounts applied automatically at checkout:</p>
                <ul>
                  <li>10% discount on 10+ Petsies</li>
                  <li>20% discount on 20+ Petsies</li>
                </ul>
                <p><b>Shipping Discounts</b></p>
                <ul>
                  <li>First custom Petsie: $13.95 domestic</li>
                  <li>Each additional Petsie in same order: $5.95</li>
                  <li>All domestic Petsies ship via USPS 2 day priority mail.</li>
                  <li>International orders ship via USPS First Class Mail for just $24.95 worldwide, with $5.95 per each additional Petsie in the order.</li>
                </ul>
              </div>
            </SfModal>
          </div>
        </validation-provider>
        <template v-if="showEmailStep">
          <div class="_step-number">
            Step {{ getNextStepNumber() }}
          </div>
          <h2 class="_step-title -required sf-heading__title">
            Enter your email address
          </h2>
          <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="'Email'"
            tag="div"
          >
            <SfInput
              name="email"
              v-model="fEmail"
              placeholder="sample@email.com"
              :required="false"
            />
            <div class="_error-text">
              {{ errors[0] }}
            </div>
            <p><b>Sometimes our team has questions about your design</b></p>
          </validation-provider>
        </template>

        <div class="_actions">
          <SfButton class="_add-to-cart color-primary" type="submit" :disabled="isLoading">
            Add to Cart
          </SfButton>
          <SfButton
            class="_add-to-cart-and-make-another color-secondary"
            type="submit"
            :disabled="isLoading"
            @click="fMakeAnother = true"
          >
            Save & Make Another
          </SfButton>
        </div>
      </form>
    </validation-observer>
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
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import { SfButton, SfDivider, SfInput, SfModal } from '@storefront-ui/vue';

import { Item } from 'src/modules/file-storage';

import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import MArtworkUpload from '../molecules/m-artwork-upload.vue';
import MBodypartOptionConfigurator from '../molecules/m-bodypart-option-configurator.vue';
import BodypartOption from '../interfaces/bodypart-option';
import Bodypart from 'src/modules/budsies/models/bodypart.model';
import BodypartValue from 'src/modules/budsies/models/bodypart-value.model';
import * as budsiesTypes from 'src/modules/budsies/store/mutation-types';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'OPillowProductOrderForm',
  components: {
    MBodypartOptionConfigurator,
    ValidationObserver,
    ValidationProvider,
    ACustomProductQuantity,
    MArtworkUpload,
    SfButton,
    SfDivider,
    SfInput,
    SfModal
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
    backendProductId: {
      type: String,
      required: true
    },
    plushieId: {
      type: String,
      required: true
    },
    sizes: {
      type: Array as PropType<BodypartOption[]>,
      default: () => []
    },
    bodyparts: {
      type: Array as PropType<Bodypart[]>,
      default: () => []
    },
    uploadedArtworkId: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      fQuantity: 1,
      fStorageItemId: undefined as string | undefined,
      fSize: undefined as BodypartOption | undefined,
      fBodypartsValues: {},
      fName: undefined as string | undefined,
      fEmail: undefined as string | undefined,
      fIsLoading: false,
      fMakeAnother: false,
      fQuantityNotesVisible: false
    }
  },
  computed: {
    isLoading (): boolean {
      return this.fIsLoading;
    },
    skinClass (): string {
      return '-skin-petsies';
    },
    isUploadDisabled (): boolean {
      return false;
    },
    showEmailStep (): boolean {
      const customerEmail = this.$store.getters['budsies/getCustomerEmail'];

      return customerEmail === undefined;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
    getNextStepNumber (reset = false): number {
      if (reset) {
        this.stepNumber = 0;
      }

      this.stepNumber += 1;

      return this.stepNumber;
    },
    getBodypartValues (bodypart: Bodypart): BodypartOption[] {
      const bodypartsValues = this.$store.getters['budsies/getBodypartBodypartsValues'](bodypart.id);

      if (!bodypartsValues.length) {
        return [];
      }

      const result: BodypartOption[] = [];

      bodypartsValues.forEach((bodypartValue: BodypartValue) => {
        result.push({
          id: bodypartValue.id,
          label: bodypartValue.name,
          value: bodypartValue.code,
          isSelected: false,
          image: bodypartValue.image ? bodypartValue.image : '',
          optionId: bodypart.id,
          optionValueId: bodypartValue.id
        });
      });

      return result;
    },
    onArtworkChange (value?: Item): void {
      if (!value) {
        this.fStorageItemId = undefined;
        return;
      }

      this.fStorageItemId = value.id;
    },
    async onSubmit (event: Event): Promise<void> {
      this.fIsLoading = true;

      await this.$store.dispatch(
        'product/setBundleOptions',
        { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
      );

      this.$store.commit(
        budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CUSTOMER_EMAIL_SET,
        { email: this.fEmail }
      );

      this.$store.dispatch('cart/addItem', {
        productToAdd: Object.assign({}, this.product, {
          qty: this.fQuantity,
          plushieId: this.plushieId,
          email: this.fEmail,
          plushieName: this.fName,
          bodyparts: this.getBodypartsData(),
          customerImagesIds: [this.fStorageItemId]
        })
      }).then(() => {
        this.onSuccess();
      }).catch(err => {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      }).finally(() => {
        this.fIsLoading = false;
      });
    },
    async onSuccess (): Promise<void> {
      try {
        this.$store.commit(budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CURRENT_PLUSHIE_ID_CLEAR);

        const uploader = this.getUploader();
        if (uploader) {
          uploader.clearInput();
        }

        if (!this.fMakeAnother) {
          this.goToCart();

          return;
        }

        this.fMakeAnother = false;
        this.refreshPage();
      } catch (e) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message: e.message, timeToLive: 10 * 1000 }),
          { root: true }
        );
      }
    },
    getBodypartsData (): Record<string, string> {
      let data: Record<string, string> = {};

      for (let key in this.fBodypartsValues) {
        const value = this.fBodypartsValues[key];

        data[value.optionId] = value.optionValueId;
      }

      return data;
    },
    onFailure (message: any): void {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    },
    refreshPage (): void {
      this.$router.go(0);
    }
  },
  mounted (): void {
    this.stepNumber = 0;
  },
  created (): void {
    this.fQuantity = this.product.qty;

    this.bodyparts.forEach(bodypart => {
      this.fBodypartsValues[bodypart.code] = undefined;
    });

    if (this.uploadedArtworkId) {
      this.fStorageItemId = this.uploadedArtworkId;
    }

    const customerEmail = this.$store.getters['budsies/getCustomerEmail'];
    if (customerEmail) {
      this.fEmail = customerEmail;
    }
  },
  watch: {
    fSize: {
      handler () {
        if (!this.fSize) {
          return
        }

        this.setBundleOptionValue({
          optionId: this.fSize.optionId,
          optionQty: 1,
          optionSelections: [this.fSize.optionValueId]
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

.o-pillow-product-order-form {
  text-align: center;

  ._step-number {
    display: inline-block;
    margin-top: var(--spacer-lg);
    text-transform: uppercase;
    color: var(--_c-light-primary);
    font-size: var(--font-xl);
    font-weight: var(--font-bold);
    @include border(--step-border, 0 0 4px 0, solid, var(--_c-light-primary));
  }

  ._step-title {
    margin-top: var(--spacer-base);
    font-size: var(--font-xl);
    font-weight: var(--font-bold);

    &.-required {
      &:after {
        color: var(--c-danger-variant);
        content: "*";
        margin-left: var(--spacer-2xs);
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
    margin-top: var(--spacer-lg);
    text-align: left;
    display: inline-block;
    --input-width: 20em;
  }

  .sf-modal {
    --modal-top: 3.75rem;
  }

  .sf-divider {
    margin-top: var(--spacer-2xl);
  }

  .m-bodypart-option-configurator {
    margin-top: var(--spacer-base);
  }

  .m-artwork-upload {
    margin: var(--spacer-lg) auto;
    max-width: 610px;
  }

  ._qty-container {
      margin-top: var(--spacer-base);
  }

  ._actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--spacer-xl);

    ._add-to-cart,
    ._add-to-cart-and-make-another {
        margin: var(--spacer-lg) 0 0 0;
    }

    ._add-to-cart-and-make-another {
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
      margin-top: var(--spacer-lg);
  }

  &.-skin-petsies {
      ._error-text {
          color: var(--c-danger-variant);
      }
  }
}
</style>

<template>
  <div class="o-pillow-product-order-form product" :class="skinClass">
    <SfHeading
      :level="1"
      title="Pillow Order Form"
    />

    <div class="_top-notes">
      <p><strong>Estimated Delivery: 2 weeks</strong></p>
      <p><strong>Please make sure everything is correct before submitting. Your pillow goes straight to print!</strong></p>
    </div>

    <SfDivider class="_step-divider" />

    <validation-observer v-slot="{ passes }" slim ref="validation-observer">
      <form
        @submit.prevent="(event) => passes(() => onSubmit(event))"
      >
        <div class="_step-number">
          Step {{ getNextStepNumber(true) }}
        </div>

        <SfHeading
          class="_step-title -required "
          :level="2"
          title="Upload your photo"
        />

        <div class="_upload-now" v-if="isUploadNow">
          <p>We do not edit your photos. The photo you submit will be printed on the pillow as is.</p>
          <p>
            Don't have your photos? You can finalize your order and <a
              class="_popup-link"
              href="javascript:void(0)"
              @click.stop.prevent="isUploadNow = false"
            >send them to us later.</a>
          </p>

          <validation-provider
            v-slot="{ errors }"
            name="'Artwork'"
            tag="div"
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
              :product-id="backendProductId"
              :disabled="isSubmitting"
              :upload-url="artworkUploadUrl"
              @input="onArtworkChange"
            />

          <p>
            <strong>
              Please Note: We recommend high resolution, clear photos for our Petsies Pillows!
              <br>
              Low quality, dark or blurry photos may impact photo clarity on your Pillow.
            </strong>
          </p>

            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="_upload-email" v-if="!isUploadNow">
          <p>
            Want to upload photos now? Please use <a
              class="_popup-link"
              href="javascript:void(0)"
              @click.stop.prevent="isUploadNow = true"
            >our uploader.</a>
          </p>

          <p>
            When you're ready, please email a photo of the design to: <br> <a
              class="_popup-link"
              href="mailto:photos@mypetsies.com"
            >photos@mypetsies.com</a>
          </p>

          <p>Include this design's magic word in the subject line of the email:</p>
          <p>{{ shortcode }}</p>

          <p>
            Don't worry, we'll send you a reminder with this code after you complete your order. <br> You may include only one photo per Pillow. <br> <a
              class="_popup-link"
              href="mailto:photos@mypetsies.com"
            >Photos@mypetsies.com</a> is an automated inbox used only for receiving images.
          </p>

          <p>NOTE: Proceed to Step 2 to complete your order. You may send us your photo within the next 5 days.</p>
        </div>

        <SfDivider class="_step-divider" />

        <div class="_step-number">
          Step {{ getNextStepNumber() }}
        </div>

        <SfHeading
          class="_step-title -required "
          :level="2"
          title="Size"
        />

        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="'Size'"
          tag="div"
        >
          <m-bodypart-option-configurator
            name="pillow_size"
            v-model="size"
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
          <SfDivider class="_step-divider" />

          <div class="_step-number">
            Step {{ getNextStepNumber() }}
          </div>

          <SfHeading
            class="_step-title -required "
            :level="2"
            :title="bodypart.name"
          />

          <validation-provider
            v-slot="{ errors }"
            rules="required"
            :name="`'${bodypart.name}'`"
            tag="div"
          >
            <m-bodypart-option-configurator
              :name="bodypart.code"
              v-model="bodypartsValues[bodypart.code]"
              :options="getBodypartValues(bodypart)"
              type="bodypart"
            />

            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <SfDivider class="_step-divider" />

        <div class="_step-number">
          Step {{ getNextStepNumber() }}
        </div>

        <SfHeading
          class="_step-title -required "
          :level="2"
          title="Your Pet's Name"
        />

        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="'Pet Name'"
          tag="div"
        >
          <SfInput
            name="pet_name"
            v-model="name"
            placeholder="Name"
            :required="false"
            :valid="!errors.length"
            :error-message="errors[0]"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors, classes }"
          rules="required"
          :name="'Quantity'"
          slim
        >
          <div class="_quantity-field" :class="classes">
            <SfHeading
              class="_step-title -required "
              :level="2"
              title="Quantity"
            />

            <ACustomProductQuantity
              v-model="quantity"
              class="_qty-container"
            />

            <div class="_error-text">
              {{ errors[0] }}
            </div>

            <a
              class="_popup-link"
              href="javascript:void(0)"
              @click="areQuantityNotesVisible = true"
            >Quantity & Shipping Discounts</a>

            <SfModal
              :visible="areQuantityNotesVisible"
              @close="areQuantityNotesVisible = false"
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

        <div v-show="showEmailStep">
          <div class="_step-number _email-step">
            Step {{ getNextStepNumber() }}
          </div>

          <SfHeading
            class="_step-title -required"
            :level="2"
            title="Enter your email address"
          />

          <validation-provider
            v-slot="{ errors }"
            rules="required|email"
            name="'Email'"
            tag="div"
          >
            <SfInput
              name="email"
              v-model="email"
              placeholder="sample@email.com"
              :required="false"
              :valid="!errors.length"
              :error-message="errors[0]"
            />

            <div><b>Sometimes our team has questions about your design</b></div>
          </validation-provider>
        </div>

        <div class="_actions">
          <SfButton
            class="_add-to-cart color-primary"
            type="submit"
            :disabled="isSubmitting"
            @click="shouldMakeAnother = false"
          >
            Add to Cart
          </SfButton>

          <SfButton
            class="_add-to-cart-and-make-another color-secondary"
            type="submit"
            :disabled="isSubmitting"
            @click="shouldMakeAnother = true"
          >
            Save & Make Another
          </SfButton>

          <p class="_order-agreement">
            I agree to <a href="/terms-of-service/" target="_blank">Terms of Service</a>,
            <a href="/privacy-policy/" target="_blank">Privacy Policy</a>,
            and <a href="http://support.mypetsies.com/support/solutions/folders/13000003991" target="_blank">Refund Policy</a>.
            I understand that Petsies happily takes care of all tears, defects, and shipping damage with either a refund or a repair.
            I also understand that my custom Petsies order is backed by the Petsies Guarantee.
          </p>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import { SfButton, SfDivider, SfInput, SfModal, SfHeading } from '@storefront-ui/vue';

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

extend('email', {
  ...email,
  message: 'Please, provide the correct email address'
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
    SfModal,
    SfHeading
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
      type: Number as PropType<number | undefined>,
      default: undefined
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
      quantity: 1,
      storageItemId: undefined as string | undefined,
      size: undefined as BodypartOption | undefined,
      bodypartsValues: {} as unknown as Record<string, BodypartOption | undefined>,
      name: undefined as string | undefined,
      email: undefined as string | undefined,
      isSubmitting: false,
      shouldMakeAnother: false,
      areQuantityNotesVisible: false,
      isUploadNow: true
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    showEmailStep (): boolean {
      const customerEmail = this.$store.getters['budsies/getCustomerEmail'];

      return customerEmail === undefined;
    },
    shortcode (): string | undefined {
      return this.$store.getters['budsies/getPlushieShortcode'](this.plushieId);
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
      const bodypartsValues: BodypartValue[] = this.$store.getters['budsies/getBodypartBodypartsValues'](bodypart.id);

      if (!bodypartsValues.length) {
        return [];
      }

      const result: BodypartOption[] = [];

      for (const bodypartValue of bodypartsValues) {
        result.push({
          id: bodypartValue.id,
          label: bodypartValue.name,
          value: bodypartValue.code,
          isSelected: false,
          image: bodypartValue.image ? bodypartValue.image : '',
          optionId: bodypart.id,
          optionValueId: bodypartValue.id
        });
      }

      return result;
    },
    getValidationObserver (): InstanceType<typeof ValidationObserver> | undefined {
      return this.$refs['validation-observer'] as InstanceType<typeof ValidationObserver> | undefined;
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
    onArtworkChange (value?: Item): void {
      if (!value) {
        this.storageItemId = undefined;
        return;
      }

      this.storageItemId = value.id;
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
            customerImagesIds: this.storageItemId ? [this.storageItemId] : [],
          uploadMethod: this.isUploadNow ? 'upload-now' : 'upload-email'
        })
      });

        if (!shouldMakeAnother) {
          this.goToCart();
          return;
        }

        this.resetForm();
        this.$emit('make-another');
      } catch (err) {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      } finally {
        this.isSubmitting = false;
      }
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
    }
  },
  created (): void {
    this.resetForm();

    if (this.uploadedArtworkId) {
      this.storageItemId = this.uploadedArtworkId;
    }

    const customerEmail = this.$store.getters['budsies/getCustomerEmail'];
    if (customerEmail) {
      this.email = customerEmail;
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
    },
    plushieId: {
      handler () {
        if (!this.plushieId) {
          return;
        }

        this.$store.dispatch('budsies/loadPlushieShortcode', { plushieId: this.plushieId });
      },
      immediate: true
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
    font-weight: var(--font-bold);
    @include border(--step-border, 0 0 4px 0, solid, var(--_c-light-primary));

    &._email-step {
      margin-top: var(--spacer-2xl);
    }
  }

  ._step-title {
    margin-top: var(--spacer-base);
    --heading-title-font-size: var(--font-xl);
    --heading-title-font-weight: var(--font-bold);

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
      margin-top: var(--spacer-sm);
      height: calc(var(--font-xs) * 1.2);
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

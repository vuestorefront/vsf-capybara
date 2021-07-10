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

    <validation-observer v-slot="{ passes, errors: formErrors }" slim ref="validation-observer">
      <form
        @submit.prevent="(event) => passes(() => onSubmit(event))"
      >
        <div
          class="_step-number"
          ref="artwork-field-anchor"
        >
          Step 1
        </div>

        <SfHeading
          class="_step-title -required "
          :level="2"
          title="Upload your photo"
        />

        <div class="_upload-now" v-show="isUploadNow">
          <p>We do not edit your photos. The photo you submit will be printed on the pillow as is.</p>
          <p>
            Don't have your photos? You can finalize your order and <a
              class="_popup-link"
              href="javascript:void(0)"
              @click.stop.prevent="switchToUploadLater"
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
              :required="isUploadNow"
            >

            <MArtworkUpload
              ref="artwork-upload"
              class="_file-uploader"
              :product-id="backendProductId"
              :disabled="isSubmitting"
              :upload-url="artworkUploadUrl"
              @file-added="onArtworkAdd"
              @file-removed="onArtworkRemove"
              v-if="backendProductId"
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

        <div class="_upload-email" v-show="!isUploadNow">
          <p>
            Want to upload photos now? Please use <a
              class="_popup-link"
              href="javascript:void(0)"
              @click.stop.prevent="switchToUploadNow"
            >our uploader.</a>
          </p>

          <p>
            When you're ready, please email a photo of the design to: <br> <a
              class="_popup-link"
              href="mailto:photos@mypetsies.com"
            >photos@mypetsies.com</a>
          </p>

          <p>Include this design's magic word in the subject line of the email:</p>
          <p><b>{{ shortcode }}</b></p>

          <p>
            Don't worry, we'll send you a reminder with this code after you complete your order. <br> You may include only one photo per Pillow. <br> <a
              class="_popup-link"
              href="mailto:photos@mypetsies.com"
            >Photos@mypetsies.com</a> is an automated inbox used only for receiving images.
          </p>

          <p>NOTE: Proceed to Step 2 to complete your order. You may send us your photo within the next 5 days.</p>
        </div>

        <SfDivider class="_step-divider" />

        <div
          class="_step-number"
          ref="size-field-anchor"
        >
          Step 2
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
            :disabled="isSubmitting"
          />

          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>

        <SfDivider class="_step-divider" />

        <div
          class="_step-number"
          ref="pillow-type-field-anchor"
        >
          Step 3
        </div>

        <div
          v-for="bodypart in bodyparts"
          :key="bodypart.id"
        >
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
              v-model="bodypartsValues[bodypart.id]"
              :max-values="bodypart.maxValues"
              :options="getBodypartValuesOptions(bodypart)"
              type="bodypart"
              :disabled="isSubmitting"
            />

            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <SfDivider class="_step-divider" />

        <div
          class="_step-number"
          ref="pet-name-field-anchor"
        >
          Step 4
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
            :disabled="isSubmitting"
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
              :disabled="isSubmitting"
            />

            <div class="_error-text">
              {{ errors[0] }}
            </div>

            <a
              class="_popup-link"
              href="javascript:void(0)"
              @click="areQuantityNotesVisible = true"
            >Quantity & Shipping Discounts</a>
          </div>
        </validation-provider>

        <validation-provider
          v-slot="{ errors, classes }"
          name="Production time"
          v-if="isProductionOptionsAvailable"
          slim
        >
          <div
            class="_production-time-field"
            :class="classes"
          >
            <SfHeading
              class="_step-title -required"
              :level="3"
              :title="$t('Choose your production time')"
            />

            *{{ $t('We will refund the rush fee in the unlikely event we do not meet a promised delivery date') }}.

            <SfSelect
              v-model="productionTime"
              name="rush_addons"
              class="_rush-addons"
              :disabled="isSubmitting"
              :valid="!errors.length"
              :error-message="errors[0]"
            >
              <SfSelectOption
                v-for="option in productionTimeOptions"
                :key="option.id"
                :value="option"
              >
                {{ option.text }}
              </SfSelectOption>
            </SfSelect>
          </div>
        </validation-provider>

        <div v-show="showEmailStep">
          <div
            class="_step-number _email-step"
            ref="email-field-anchor"
          >
            Step 5
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
              :disabled="isSubmitting"
              :required="false"
              :valid="!errors.length"
              :error-message="errors[0]"
            />

            <div><b>Sometimes our team has questions about your design</b></div>
          </validation-provider>
        </div>

        <div class="_form-errors">
          <template
            v-for="(fieldErrors, field) in formErrors"
          >
            <div
              class="_error-text"
              :key="field"
              v-if="fieldErrors.length > 0"
            >
              <a
                class="_error-link"
                href="javascript:void(0)"
                @click.prevent="goToFieldByName(field.toString())"
              >
                {{ fieldErrors.join('. ') }}
              </a>
            </div>
          </template>
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
            I agree to
            <router-link to="/terms-of-service/" target="_blank">
              Terms of Service
            </router-link>,
            <router-link to="/privacy-policy/" target="_blank">
              Privacy Policy
            </router-link>,
            and <a href="http://support.mypetsies.com/support/solutions/folders/13000003991" target="_blank">Refund Policy</a>.
            I understand that Petsies happily takes care of all tears, defects, and shipping damage with either a refund or a repair.
            I also understand that my custom Petsies order is backed by the Petsies Guarantee.
          </p>
        </div>
      </form>
    </validation-observer>

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
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import { mapMutations } from 'vuex';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import {
  SfButton,
  SfDivider,
  SfInput,
  SfModal,
  SfHeading,
  SfSelect
} from '@storefront-ui/vue';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';
import Product from 'core/modules/catalog/types/Product';

import { Item } from 'src/modules/file-storage';
import { InjectType } from 'src/modules/shared';
import {
  vuexTypes as budsiesTypes,
  Bodypart,
  BodypartValue,
  ImageUploadMethod,
  BodyPartValueContentType,
  ProductValue,
  RushAddon
} from 'src/modules/budsies';

import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import MArtworkUpload from '../molecules/m-artwork-upload.vue';
import MBodypartOptionConfigurator from '../molecules/m-bodypart-option-configurator.vue';
import BodypartOption from '../interfaces/bodypart-option';
import SizeOption from '../interfaces/size-option';
import ProductionTimeOption from '../interfaces/production-time-option.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

extend('email', {
  ...email,
  message: 'Please, provide the correct email address'
});

interface InjectedServices {
  window: Window
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
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
    SfHeading,
    SfSelect
  },
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    artworkUploadUrl: {
      type: String,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    plushieId: {
      type: Number as PropType<number | undefined>,
      default: undefined
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
      size: undefined as SizeOption | undefined,
      bodypartsValues: {} as unknown as Record<string, BodypartOption | BodypartOption[] | undefined>,
      name: undefined as string | undefined,
      email: undefined as string | undefined,
      isSubmitting: false,
      shouldMakeAnother: false,
      areQuantityNotesVisible: false,
      showEmailStep: true,
      uploadMethod: ImageUploadMethod.NOW,
      productionTime: undefined as ProductionTimeOption | undefined
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    isUploadNow (): boolean {
      return this.uploadMethod === ImageUploadMethod.NOW;
    },
    backendProductId (): ProductValue | undefined {
      switch (this.product.id) {
        case 253:
          return ProductValue.PILLOW;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.product.id}' product ID`
          );
      }
    },
    bodyparts (): Bodypart[] {
      return this.$store.getters['budsies/getProductBodyparts'](this.product.id);
    },
    isProductionOptionsAvailable (): boolean {
      return this.productionTimeOptions.length !== 0;
    },
    productionTimeBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(item => item.title.toLowerCase() === 'production time');
    },
    productionTimeOptions (): ProductionTimeOption[] {
      if (!this.productionTimeBundleOption || !this.product) {
        return []
      }

      const addons: RushAddon[] = this.$store.getters['budsies/getProductRushAddons'](this.product.id);

      if (!addons.length) {
        return [];
      }

      let addonOptions: Record<string, number> = {};

      for (const productLink of this.productionTimeBundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        addonOptions[productLink.product.sku] = +productLink.id;
      }

      const result: ProductionTimeOption[] = [];

      for (const addon of addons) {
        const addonOption = addonOptions[addon.id];

        if (!addonOption && addon.id) {
          Logger.warn('The option product of rush addon is not found: ' + addon.id, 'budsies')();
          continue;
        }

        result.push({
          id: addon.id,
          text: addon.text,
          isDomestic: addon.isDomestic,
          optionId: this.productionTimeBundleOption.option_id,
          optionValueId: addonOption
        })
      }

      return result;
    },
    sizeBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(item => item.title.toLowerCase() === 'product');
    },
    sizes (): SizeOption[] {
      if (!this.sizeBundleOption) {
        return [];
      }

      let availableSizes: SizeOption[] = [];
      for (const productLink of this.sizeBundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        availableSizes.push({
          id: String(productLink.product.id),
          label: productLink.product.name + ' - $' + productLink.product.price,
          value: productLink.product.sku,
          isSelected: false,
          contentTypeId: BodyPartValueContentType.IMAGE,
          image: productLink.product.image,
          optionId: this.sizeBundleOption.option_id,
          optionValueId: productLink.id.toString()
        });
      }

      return availableSizes;
    },
    shortcode (): string | undefined {
      return this.$store.getters['budsies/getPlushieShortcode'](this.plushieId);
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
    getBodypartValuesOptions (bodypart: Bodypart): BodypartOption[] {
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
          contentTypeId: bodypartValue.contentTypeId,
          color: bodypartValue.color,
          image: bodypartValue.image
        });
      }

      return result;
    },
    getBodypartsData (): Record<string, string[]> {
      let data: Record<string, string[]> = {};

      for (const bodyPartId in this.bodypartsValues) {
        let value = this.bodypartsValues[bodyPartId];

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
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    },
    getValidationObserver (): InstanceType<typeof ValidationObserver> | undefined {
      return this.$refs['validation-observer'] as InstanceType<typeof ValidationObserver> | undefined;
    },
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
      this.quantity = this.product.qty || 1;
      this.storageItemId = undefined;
      this.size = undefined;
      this.name = undefined;

      for (const bodypart of this.bodyparts) {
        this.bodypartsValues[bodypart.id] = undefined;
      }

      const uploader = this.getUploader();
      if (uploader) {
        uploader.clearInput();
      }

      this.productionTime = undefined;
      if (this.productionTimeOptions.length) {
        this.productionTime = this.productionTimeOptions[0];
      }

      const validator = this.getValidationObserver();
      validator?.reset();
    },
    switchToUploadNow (): void {
      if (this.isSubmitting) {
        return;
      }

      this.uploadMethod = ImageUploadMethod.NOW;
    },
    switchToUploadLater (): void {
      if (this.isSubmitting) {
        return;
      }

      this.uploadMethod = ImageUploadMethod.EMAIL;
    },
    toggleUploadMethod (): void {
      if (this.isSubmitting) {
        return;
      }

      this.uploadMethod = this.uploadMethod === ImageUploadMethod.EMAIL ? ImageUploadMethod.NOW : ImageUploadMethod.EMAIL;
    },
    onArtworkAdd (value: Item): void {
      this.storageItemId = value.id;
    },
    onArtworkRemove (storageItemId: string): void {
      this.storageItemId = undefined;
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
            uploadMethod: this.uploadMethod
          })
        });

        if (!shouldMakeAnother) {
          this.goToCart();
          return;
        }

        this.resetForm();
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
  beforeMount () {
    this.$bus.$once('budsies-store-synchronized', this.prefillEmail);
  },
  beforeDestroy () {
    this.$bus.$off('budsies-store-synchronized', this.prefillEmail);
  },
  created (): void {
    this.resetForm();

    if (this.uploadedArtworkId) {
      this.storageItemId = this.uploadedArtworkId;
    }

    this.prefillEmail();
  },
  watch: {
    size: {
      handler (newValue: SizeOption | undefined) {
        if (!this.sizeBundleOption) {
          Logger.error('sizeBundleOption is not defined while attempt to set size was performed', 'budsies')();
          return
        }

        this.setBundleOptionValue({
          optionId: this.sizeBundleOption.option_id,
          optionQty: 1,
          optionSelections: newValue ? [newValue.optionValueId] : []
        });
      },
      immediate: false
    },
    productionTime: {
      handler (newValue: ProductionTimeOption | undefined) {
        if (!this.productionTimeBundleOption) {
          Logger.error('productionTimeBundleOption is not defined while attempt to set it was performed', 'budsies')();
          return
        }

        this.setBundleOptionValue({
          optionId: this.productionTimeBundleOption.option_id,
          optionQty: 1,
          optionSelections: newValue?.optionValueId ? [newValue.optionValueId] : []
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

  ._production-time-field {
    max-width: 47em;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--spacer-xl);
    text-align: center;

    ::v-deep .sf-select__selected {
      justify-content: center;
    }
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

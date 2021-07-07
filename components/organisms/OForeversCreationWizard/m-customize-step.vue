<template>
  <validation-observer
    v-slot="{ passes }"
    class="forevers-wizard-customization-step"
    tag="div"
    ref="validation-observer"
  >
    <SfHeading
      class="_step-title"
      :level="2"
      :title="$t('Customize your Petsies plush')"
    />

    <validation-provider
      v-slot="{ errors }"
      class="_bodypart _section"
      rules="required"
      :name="`'${bodypart.name}'`"
      v-for="bodypart in bodyparts"
      :key="bodypart.id"
      tag="div"
    >
      <SfHeading
        class="_step-title -required "
        :level="3"
        :title="bodypart.name"
      />

      <div
        class="_helper-text"
        v-if="bodypart.code === 'size'"
      >
        The Standard size fits most animals. We recommend the Miniature size for smaller dog breeds, miniature cats, hamsters, etc.
      </div>

      <div
        class="_helper-text"
        v-if="bodypart.code === 'forevers_color_palette'"
      >
        You may select up to 3 most prominent color(s) of your animal to assist our team.
      </div>

      <div
        v-if="bodypart.code === 'eye_color'"
      >
        (<a
          class="_popup-link"
          href="javascript:void(0)"
          @click="areEyeColorNotesVisible = true"
        >?</a>)
      </div>

      <m-bodypart-option-configurator
        class="_options-list"
        :name="bodypart.code"
        v-model="bodypartsValues[bodypart.code]"
        :options="getBodypartValues(bodypart)"
        type="bodypart"
      />

      <div
        class="_helper-text"
        v-if="bodypart.code === 'forevers_color_palette'"
      >
        Click a selected color to deselect it. <br>

        Your color input is especially helpful when photos are blurry or poorly lit.
        If left blank, our designers will use their professional judgement.
      </div>

      <div class="_error-text">
        {{ errors[0] }}
      </div>
    </validation-provider>

    <validation-provider
      v-slot="{ errors, classes }"
      rules="required"
      :name="$t('Description')"
      slim
    >
      <div class="_description-field _section" :class="classes">
        <SfHeading
          class="_step-title -required "
          :level="3"
          :title="$t('Describe Your Pet\'s Physical Features')"
        />

        <textarea
          name="description"
          rows="4"
          v-model="description"
          :placeholder="$t('Tell us about your pet\'s coloration and defining feature(s).')"
          :required="true"
          :valid="!errors.length"
          :error-message="errors[0]"
        />

        <div class="_error-text">
          {{ errors[0] }}
        </div>
      </div>
    </validation-provider>

    <div class="_section">
      <SfHeading
        class="_step-title"
        :level="2"
        :title="$t('Final Options')"
      />

      <validation-provider
        v-slot="{ errors, classes }"
        rules="required"
        :name="$t('Quantity')"
        slim
      >
        <div class="_quantity-field" :class="classes">
          <SfHeading
            class="_step-title -required "
            :level="3"
            :title="$t('How many Petsies of this exact same design?')"
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
        </div>
      </validation-provider>

      <div class="_addons">
        <SfHeading
          class="_step-title"
          :level="3"
          :title="$t('Upgrade Your Petsies (optional)')"
        />

        <MAddonsSelector
          :addons="addons"
          v-model="selectedAddons"
        />
      </div>
    </div>

    <div class="_actions _section">
      <SfButton
        class="_add-to-cart color-primary"
        type="submit"
        :disabled="disabled"
        @click="(event) => passes(() => submitStep())"
      >
        Add to Cart
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
          <li>Petsies: (US) $13.95, $5.95 for each additional; (International) $25.95, $5.95 for each additional</li>
          <li>Pillows: (US) starting at $9.95;&nbsp;(International) $20.95</li>
          <li>Petsies Socks: (US) $4.95; (International)&nbsp;$9.95</li>
          <li>Read more about rates&nbsp;<a href="http://support.mypetsies.com/support/solutions/articles/13000017023-shipping-handling-fees" target="_blank">here</a>. Rates determined by weight</li>
          <li>Tracking number will be emailed to you at time of shipment</li>
        </ul>
      </div>
    </SfModal>

    <SfModal
      :visible="areEyeColorNotesVisible"
      @close="areEyeColorNotesVisible = false"
    >
      <div class="_popup-content">
        If your pet has different color eyes, <br>
        please indicate in Special Instructions
      </div>
    </SfModal>
  </validation-observer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import { SfHeading, SfButton, SfModal } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';

import {
  Bodypart,
  BodypartValue,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';

import MAddonsSelector from '../../molecules/m-addons-selector.vue';
import ACustomProductQuantity from '../../atoms/a-custom-product-quantity.vue';
import MBodypartOptionConfigurator from '../../molecules/m-bodypart-option-configurator.vue';

import BodypartOption from '../../interfaces/bodypart-option';
import AddonOption from '../../interfaces/addon-option.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'MCustomizeStep',
  components: {
    SfHeading,
    SfButton,
    SfModal,
    ValidationProvider,
    ValidationObserver,
    MAddonsSelector,
    ACustomProductQuantity,
    MBodypartOptionConfigurator
  },
  props: {
    value: {
      type: Object as PropType<any>,
      default: () => ({
        bodypartsValues: {},
        addons: [],
        description: undefined,
        quantity: 1
      })
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    plushieId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      areQuantityNotesVisible: false,
      areEyeColorNotesVisible: false
    }
  },
  computed: {
    selectedAddons: {
      get (): string[] {
        return this.value.addons;
      },
      set (value: string[]): void {
        const newValue = { ...this.value, addons: value };
        this.$emit('input', newValue);
      }
    },
    bodypartsValues: {
      get (): Record<string, BodypartOption | undefined> {
        return this.value.bodypartsValues;
      },
      set (value: Record<string, BodypartOption | undefined>): void {
        const newValue = { ...this.value, bodypartsValues: value };
        this.$emit('input', newValue);
      }
    },
    description: {
      get (): string | undefined {
        return this.value.description;
      },
      set (value: string): void {
        const newValue = { ...this.value, description: value };
        this.$emit('input', newValue);
      }
    },
    quantity: {
      get (): number {
        return this.value.quantity;
      },
      set (value: number): void {
        const newValue = { ...this.value, quantity: value };
        this.$emit('input', newValue);
      }
    },
    addons (): AddonOption[] {
      if (!this.product?.bundle_options) {
        return []
      }

      let result: AddonOption[] = [];
      for (const option of this.product.bundle_options) {
        if (option.title !== 'Addons') {
          continue;
        }

        for (const productLink of option.product_links) {
          if (!productLink.product) {
            continue;
          }

          const images: string[] = getGalleryByProduct(productLink.product).map((i: any) => i.src);

          result.push({
            id: Number(productLink.product.id),
            sku: productLink.product.sku,
            name: productLink.product.name,
            description: productLink.product.description,
            price: productLink.product.final_price,
            images: images,
            optionId: option.option_id,
            optionValueId: productLink.id.toString(),
            videoUrl: (productLink as any).video_url ? (productLink as any).video_url : undefined
          });
        }
      }

      return result;
    },
    bodyparts (): Bodypart[] {
      if (!this.product) {
        return [];
      }

      const bodyparts = this.$store.getters['budsies/getProductBodyparts'](this.product.id);

      if (!bodyparts.length) {
        return [];
      }

      return bodyparts;
    }
  },
  methods: {
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
    submitStep (): void {
      //
    }
  },
  watch: {
    product: {
      async handler () {
        if (!this.product) {
          return;
        }

        await this.$store.dispatch('budsies/loadProductBodyparts', { productId: this.product.id })
      },
      immediate: true

    }
  }
});

</script>

<style lang="scss">
.forevers-wizard-customization-step {
  ._section {
    margin-top: var(--spacer-base);
  }

  ._quantity-field,
  ._addons {
    margin-top: var(--spacer-base);
  }

  ._helper-text {
    font-size: var(--font-xs);
  }

  ._bodypart {
    ._helper-text,
    ._options-list {
      margin-top: var(--spacer-sm);
    }
  }

  textarea {
    box-sizing: border-box;
    border: 1px solid var(--c-light);
    width: 100%;
    padding: 0.5em;
    font-family: var(--font-family-primary);
    resize: vertical;
  }

  ._error-text {
    color: var(--c-danger-variant);
    font-size: var(--font-xs);
    margin-top: var(--spacer-xs);
    height: calc(var(--font-xs) * 1.2);
  }

  ._actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ._order-agreement {
    max-width: 50em;
    font-size: var(--font-xs);
  }
}
</style>

<template>
  <div class="forevers-wizard-product-type-step">
    <SfHeading
      :level="2"
      :title="$t('Select Your Type of Pet')"
    />

    <div class="_buttons-wrapper">
      <SfButton
        class="_button"
        :disabled="isDisabled"
        @click="createPlushie('dog')"
      >
        <BaseImage
          class="_image"
          src="/assets/forevers/dog-icon1_1.png"
          :alt="$t('Forevers Dog')"
          width="76px"
          :aspect-ratio="1"
        />
        {{ $t('Forevers Dog') }}
      </SfButton>

      <SfButton
        class="_button"
        :disabled="isDisabled"
        @click="createPlushie('cat')"
      >
        <BaseImage
          class="_image"
          src="/assets/forevers/cat-icon1_1.png"
          :alt="$t('Forevers Cat')"
          width="76px"
          :aspect-ratio="1"
        />
        {{ $t('Forevers Cat') }}
      </SfButton>

      <SfButton
        class="_button"
        :disabled="isDisabled"
        @click="createPlushie('other')"
      >
        <BaseImage
          class="_image"
          src="/assets/forevers/other-icon1_1.png"
          :alt="$t('Forevers Other')"
          width="76px"
          :aspect-ratio="1"
        />
        {{ $t('Forevers Other') }}
      </SfButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SfHeading, SfButton } from '@storefront-ui/vue';

import { Logger } from '@vue-storefront/core/lib/logger';

import {
  BaseImage
} from 'src/modules/budsies';

import ForeversWizardProductTypeStepData from '../../interfaces/forevers-wizard-product-type-step-data.interface';

export default Vue.extend({
  name: 'MProductTypeChooseStep',
  components: {
    SfHeading,
    SfButton,
    BaseImage
  },
  props: {
    value: {
      type: Object as PropType<ForeversWizardProductTypeStepData>,
      default: () => ({
        product: undefined,
        plushieId: undefined
      })
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isSubmitting: false
    }
  },
  computed: {
    isDisabled (): boolean {
      return this.disabled || this.isSubmitting;
    }
  },
  methods: {
    async createPlushie (type: 'dog' | 'cat' | 'other'): Promise<void> {
      if (this.disabled) {
        return;
      }

      let productSku: string;

      switch (type) {
        case 'dog':
          productSku = 'ForeversDog_bundle'
          break;
        case 'cat':
          productSku = 'ForeversCat_bundle'
          break;
        case 'other':
          productSku = 'ForeversOther_bundle'
          break;
        default:
          throw new Error('Unknown product type: ' + type);
      }

      if (this.value.product?.sku === productSku) {
        this.$emit('next-step');
        return;
      }

      this.isSubmitting = true;

      try {
        const product = await this.$store.dispatch('product/loadProduct', {
          parentSku: productSku,
          childSku: null
        });

        const [plushieCreationTask] = await Promise.all([
          await this.$store.dispatch('budsies/createNewPlushie', { productId: product.id })
        ])

        const plushieId = plushieCreationTask.result;

        this.$emit('input', { product, plushieId });
        this.$emit('next-step');
      } catch (error) {
        Logger.error('Unable to create plushie: ' + error, 'budsies')();
      } finally {
        this.isSubmitting = false;
      }
    }
  }
});

</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.forevers-wizard-product-type-step {
  ._buttons-wrapper {
    display: inline-grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
    padding: 1em 0;
  }

  ._button {
    justify-content: flex-start;
    flex-direction: row;
    gap: 1em;
  }

  @media (min-width: $tablet-min) {
    ._buttons-wrapper {
      padding: 3em;
    }

    ._button {
      flex-direction: row;
    }
  }
}
</style>

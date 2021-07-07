<template>
  <div class="forevers-wizard-product-type-step">
    <SfHeading
      :level="2"
      :title="$t('Select Your Type of Pet')"
    />

    <div class="_buttons-wrapper">
      <SfButton
        class="_button"
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

import {
  BaseImage,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';

export default Vue.extend({
  name: 'MProductTypeChooseStep',
  components: {
    SfHeading,
    SfButton,
    BaseImage
  },
  props: {
    value: {
      type: Object as PropType<any>,
      default: () => ({
        product: undefined,
        plushieId: undefined
      })
    },
    uploadedArtworkId: {
      type: String,
      default: undefined
    }
  },
  methods: {
    async createPlushie (type: 'dog' | 'cat' | 'other'): Promise<void> {
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

      const product = await this.$store.dispatch('product/loadProduct', {
        parentSku: productSku,
        childSku: null
      });

      const [plushieCreationTask] = await Promise.all([
        await this.$store.dispatch('budsies/createNewPlushie', { productId: product.id })
        // await this.$store.dispatch('budsies/loadProductBodyparts', { productId: product.id })
      ])

      const plushieId = plushieCreationTask.result;

      this.$emit('input', { product, plushieId });
      this.$emit('next-step');
    }
  }
});

</script>

<style lang="scss">
.forevers-wizard-product-type-step {
  ._buttons-wrapper {
    display: inline-grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
    padding: 3em;
  }

  ._button {
    justify-content: flex-start;

    ._image {
        margin-right: 1em;
    }
  }
}
</style>

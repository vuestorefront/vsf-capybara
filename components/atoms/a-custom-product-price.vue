<template>
  <div class="a-custom-product-price" :class="skinClass">
    <div class="_base-price" :class="{ '-strikeout': isSpecial }">
      {{ price | currency("$", precision) }}
    </div>

    <div class="_special-price" v-if="isSpecial">
      {{ specialPrice | currency("$", precision) }}
    </div>

    <div class="_saved-value" v-if="isSpecial">
      (Save {{ saveAmount | currency("$", precision) }} |
      {{ savePercent }}%)
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ACustomProductPrice',
  props: {
    price: {
      type: Number,
      required: true
    },
    specialPrice: {
      type: Number,
      default: 0
    },
    showCents: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    isSpecial (): boolean {
      return this.price !== this.specialPrice;
    },
    precision (): number {
      return this.showCents ? 2 : 0;
    },
    saveAmount (): number {
      return this.price - this.specialPrice;
    },
    savePercent (): number {
      return Math.round(
        ((this.price - this.specialPrice) / this.price) * 100
      );
    }
  }
})
</script>

<style lang="scss" scoped>
.a-custom-product-price {
    > * {
        display: inline-block;
        font-weight: 800;
    }

    ._base-price {
        font-size: 1.5em;

        &.-strikeout {
            font-size: 1em;
            text-decoration: line-through;
        }
    }

    ._special-price {
        font-size: 1.5em;
        margin: 0 0.25em 0 0.5em;
    }

    &.-skin-petsies {
        > * {
            color: var(--c-warning);
        }

        ._base-price {
            &.-strikeout {
                color: var(--c-text);
            }
        }
    }
}
</style>

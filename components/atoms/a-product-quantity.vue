<template>
  <SfQuantitySelector
    class="a-product-quantity"
    :qty="value"
    :value="value"
    :min="1"
    :max="maxQuantity"
    :disabled="disabled"
    @input="$emit('input', $event)"
    @blur="$v.$touch()"
  />
</template>

<script>
import {
  minValue,
  maxValue,
  numeric,
  required
} from 'vuelidate/lib/validators';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { SfQuantitySelector } from '@storefront-ui/vue';

export default {
  name: 'AProductQuantity',
  components: {
    SfQuantitySelector
  },
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    maxQuantity: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    unlimitQuantity: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isOnline () {
      return onlineHelper.isOnline;
    },
    disabled () {
      return this.isOnline && !this.unlimitQuantity ? !this.maxQuantity : false;
    },
    error () {
      const isBelowZero = !this.$v.value.numeric || !this.$v.value.minValue || !this.$v.value.required
      if (isBelowZero) return this.$t(`Quantity must be positive integer`)
      const isBelowMax = this.maxQuantity && this.value && !this.$v.value.maxValue
      if (isBelowZero) {
        return this.$t('Quantity must be below {quantity}', {
          quantity: this.maxQuantity
        })
      }
      return ''
    }
  },
  validations () {
    return {
      value: {
        minValue: minValue(1),
        maxValue: maxValue(this.maxQuantity) && this.unlimitQuantity,
        numeric,
        required
      }
    };
  },
  watch: {
    '$v.$invalid' () {
      this.$emit('error', this.error);
    }
  }
};
</script>
<style lang="scss" scoped>
.a-product-quantity {
  display: flex;
  flex-shrink: 0;
  height: auto;
  width: 100%;
  min-width: 4.625rem;
  max-width: 5.625rem;
}
</style>

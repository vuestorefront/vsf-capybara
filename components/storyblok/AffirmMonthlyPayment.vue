<template>
  <div
    class="storyblok-affirm-monthly-payment"
    :class="cssClasses"
    :style="styles"
  >
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import AffirmMonthlyPaymentData from './interfaces/affirm-monthly-payment-data.interface';

export default Blok.extend({
  name: 'StoryblokAffirmMonthlyPayment',
  computed: {
    itemData (): AffirmMonthlyPaymentData {
      return this.item as AffirmMonthlyPaymentData;
    },
  }
})
</script>

<style lang="scss" scoped>

</style>

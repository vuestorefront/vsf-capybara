<template>
  <div id="cart-recovery" />
</template>

<script lang="ts">
import Vue from 'vue';
// import config from 'config';
import * as types from '../../../../core/modules/cart/store/mutation-types'
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default Vue.extend({
  name: 'CartRecovery',
  components: {

  },
  computed: {

  },
  async mounted () {
    const { result, resultCode } = await this.$store.dispatch('budsies/loadRecoverableCart', {
      recoveryId: this.$route.params.id,
      recoveryCode: this.$route.params.code
    });

    console.log(result);

    if (resultCode !== 200) {
      this.$router.push(localizedRoute('/error'))
    }

    this.$store.commit('cart/' + types.CART_LOAD_CART_SERVER_TOKEN, result)

    this.$store.dispatch('cart/load', { forceClientState: true })

    this.$router.push(localizedRoute('/cart'))
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

</style>

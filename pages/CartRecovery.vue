<template>
  <div id="cart-recovery">
    <div class="_loader-container" v-if="isLoading">
      <div class="_loader" />
    </div>
    <SfHeading :level="1" :title="title" class="_title" />
    <div class="_error-action" v-if="isShowError">
      <SfButton @click="goToHomepage">
        {{ $t('Return to home') }}
      </SfButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { Logger } from '@vue-storefront/core/lib/logger';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import {
  SfButton,
  SfHeading
} from '@storefront-ui/vue';

export default Vue.extend({
  name: 'CartRecovery',
  components: {
    SfButton,
    SfHeading
  },
  data () {
    return {
      isLoading: true,
      isShowError: false
    }
  },
  computed: {
    title (): string {
      return this.isShowError ? 'Sorry, we were unable to restore your cart content.'
        : 'Please wait, we are restoring your cart content...'
    }
  },
  async mounted () {
    try {
      const cartToken = await this.$store.dispatch('budsies/loadRecoverableCart', {
        recoveryId: this.$route.params.id,
        recoveryCode: this.$route.params.code
      });

      this.$store.commit('cart/' + types.CART_LOAD_CART_SERVER_TOKEN, cartToken)

      await this.$store.dispatch('cart/load', { forceClientState: false })

      EventBus.$emit('after-cart-recovery', cartToken)

      await this.$store.dispatch('cart/syncTotals')

      this.$router.push(localizedRoute({ name: 'detailed-cart' }))
    } catch (error) {
      this.isShowError = true;
      Logger.error(error, 'budsies')();
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    goToHomepage (): void {
      this.$router.push(localizedRoute('/'));
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

#cart-recovery {
  box-sizing: border-box;
  padding: 0 var(--spacer-xs);
  // Auto margins for vertical center alignment
  margin: auto;

  ._loader-container {
    position: relative;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1em 0;

    ._loader {
      position: absolute;
      width: 4.8em;
      height: 4.8em;
      border-radius: 100%;
      border: 2px solid var(--c-secondary);
      border-bottom-color: var(--c-primary);
      animation: rotate 1s linear infinite;
    }
  }

  ._title {
    margin: 3em 0;
  }

  ._error-action {
    text-align: center;
    width: 100%;

    .sf-button {
      display: inline-block;
    }
  }
}
</style>

import Vue, { PropType } from 'vue';

import HeaderCtaButtonType from 'src/modules/shared/types/header-cta-button-type';
import Product from 'core/modules/catalog/types/Product';

export default Vue.extend({
  computed: {
    cartItems (): Product[] {
      return this.$store.getters['cart/getCartItems'];
    },
    ctaButtonType () {
      const routeName = this.$route.name;
      if (routeName === 'detailed-cart' && this.cartItems && this.cartItems.length > 0) {
        return HeaderCtaButtonType.GO_TO_CHECKOUT;
      }

      if (routeName === 'checkout') {
        return HeaderCtaButtonType.HIDDEN;
      }

      return HeaderCtaButtonType.DEFAULT;
    },
    showCtaButtonContainer (): boolean {
      return this.ctaButtonType !== HeaderCtaButtonType.HIDDEN;
    },
    showGoToCheckoutButton (): boolean {
      return this.ctaButtonType === HeaderCtaButtonType.GO_TO_CHECKOUT;
    },
    showMakeYourOwnDropdown (): boolean {
      return this.ctaButtonType === HeaderCtaButtonType.DEFAULT;
    }
  },
  methods: {
    goToCheckout (): void {
      this.$router.push({ name: 'checkout' });
    }
  }
});

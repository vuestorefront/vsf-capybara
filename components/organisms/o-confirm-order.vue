<template>
  <div class="o-confirm-order">
    <SfHeading
      :title="`${isVirtualCart ? 3 : 4}. ${$t('Review')}`"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <SfAccordion :open="$t('Totals')" class="accordion mobile-only">
      <SfAccordionItem :header="$t('Details')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              {{ personalDetails.firstName }} {{ personalDetails.lastName }}
            </p>
            <p class="content">
              {{ personalDetails.emailAddress }}
            </p>
          </div>
          <SfButton
            class="sf-button--text color-secondary accordion__edit"
            @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
          >
            {{ $t('Edit') }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Shipping')" v-if="!isVirtualCart">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              <span class="content__label">
                {{ shippingMethod }}
              </span>
              <br>
              {{ shippingDetails.streetAddress }}
              {{ shippingDetails.apartmentNumber }},
              {{ shippingDetails.zipCode }}
              <br>
              {{ shippingDetails.city }}, {{ shippingDetails.country }}
            </p>
            <p class="content">
              {{ shippingDetails.phoneNumber }}
            </p>
          </div>
          <SfButton
            class="sf-button--text color-secondary accordion__edit"
            @click="$bus.$emit('checkout-before-edit', 'shipping')"
          >
            {{ $t('Edit') }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Billing Address')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              {{ paymentDetails.streetAddress }}
              {{ paymentDetails.apartmentNumber }},
              {{ paymentDetails.zipCode }}
              <br>
              {{ paymentDetails.city }}, {{ paymentDetails.country }}
            </p>
            <p class="content">
              {{ paymentDetails.phoneNumber }}
            </p>
          </div>
          <SfButton
            class="sf-button--text color-secondary accordion__edit"
            @click="$bus.$emit('checkout-before-edit', 'payment')"
          >
            {{ $t('Edit') }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Order details')">
        <div class="accordion__item">
          <transition name="fade">
            <div class="accordion__content">
              <SfCollectedProduct
                v-for="product in productsInCart"
                :key="getCartItemKey(product)"
                v-model="product.qty"
                :image="getThumbnailForProduct(product)"
                :title="product.name | htmlDecode"
                :regular-price="getProductRegularPrice(product)"
                :special-price="getProductSpecialPrice(product)"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__option" v-if="getPlushieName(product)">
                    {{ getPlushieName(product) | htmlDecode }}
                  </div>
                  <div
                    class="collected-product__option"
                    v-for="option in getBundleProductOptions(product)"
                    :key="option"
                  >
                    <SfIcon
                      icon="check"
                      size="xxs"
                      color="blue-primary"
                      class="collected-product__option__icon"
                    />
                    {{ option }}
                  </div>
                </template>
                <template #actions>
                  <div>
                    <div class="collected-product__properties">
                      <template v-for="option in getProductOptions(product)">
                        <SfProperty
                          v-if="isCustomOption(product, option)"
                          :key="option.label"
                          :name="option.label"
                          :value="option.value"
                          class="collected-product__property"
                        />
                        <div
                          v-else
                          :key="option.label"
                          class="collected-product__property"
                        >
                          {{ option.value }}
                        </div>
                      </template>
                    </div>
                    <div class="collected-product__action">
                      {{ $t('Quantity') }}:
                      <span class="product__qty">{{ product.qty }}</span>
                    </div>
                  </div>
                </template>
                <template #input>
                  <span />
                </template>
                <template #more-actions>
                  <span />
                </template>
                <template #remove>
                  <span />
                </template>
              </SfCollectedProduct>
            </div>
          </transition>
        </div>
      </SfAccordionItem>

      <SfAccordionItem :header="$t('Totals')">
        <div class="accordion__content">
          <MPriceSummary />
        </div>
      </SfAccordionItem>
    </SfAccordion>

    <o-cart-items-table :cart-items="productsInCart" />

    <APromoCode class="mobile-only" :allow-promo-code-removal="false" />
    <div class="totals desktop-only">
      <div class="totals__element">
        <APromoCode :allow-promo-code-removal="false" />
      </div>
      <MPriceSummary class="totals__element" />
    </div>
    <SfHeading
      :title="$t('Payment method')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <OGiftCardPayment :cart-items="cartItems" />
      <div class="form__radio-group">
        <div v-for="method in paymentMethods" :key="method.code">
          <SfRadio
            v-model="payment.paymentMethod"
            :label="method.title ? method.title : method.name"
            :value="method.code"
            name="payment-method"
            class="form__radio payment-method"
            :class="{ hidden: method.code === 'braintree' }"
            @input="onPaymentMethodChange"
          />
        </div>
        <template v-if="isBraintreeAvailable">
          <div class="_braintree" v-if="showBraintreeMethods">
            <component
              v-for="braintreeMethod in braintreePaymentMethods"
              :is="braintreeMethod.component"
              :key="braintreeMethod.code"
              :ref="braintreeMethod.code"
              :braintree-client="braintreeClient"
              :show-content="isBraintreeMethodSelected(braintreeMethod.code)"
              @success="placeOrder"
              @error="onBraintreePaymentMethodError"
              @braintree-method-selected="() => changeBraintreePaymentMethod(braintreeMethod.code)"
            >
              <template #title>
                <SfRadio
                  :selected="selectedBraintreePaymentMethod"
                  :label="braintreeMethod.name"
                  :value="braintreeMethod.code"
                  @input="changeBraintreePaymentMethod"
                  class="form__radio"
                />
              </template>
            </component>
          </div>
        </template>
      </div>
    </div>

    <div class="actions">
      <SfButton
        v-show="showPlaceOrderButton"
        class="sf-button--full-width actions__button place-order-btn"
        :disabled="!productsInCart.length || isCheckoutInProgress"
        @click="onPlaceOrder"
      >
        {{ $t('Place the order') }}
      </SfButton>

      <SfButton
        class="sf-button--full-width sf-button--text color-secondary actions__button actions__button--secondary"
        @click="$bus.$emit('checkout-before-edit', 'payment')"
      >
        {{ $t('Edit payment') }}
      </SfButton>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { OrderModule } from '@vue-storefront/core/modules/order';
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment';
import { createSmoothscroll, getCartItemPrice } from 'theme/helpers';
import {
  SfRadio,
  SfIcon,
  SfImage,
  SfPrice,
  SfTable,
  SfButton,
  SfHeading,
  SfAccordion,
  SfCollectedProduct,
  SfProperty
} from '@storefront-ui/vue';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
import APromoCode from 'theme/components/atoms/a-promo-code';
import OGiftCardPayment from './o-gift-card-payment.vue';

import { onlineHelper } from '@vue-storefront/core/helpers';
import { ProductId } from 'src/modules/budsies';
import getCartItemKey from 'src/modules/budsies/helpers/get-cart-item-key.function';
import { AFFIRM_BEFORE_PLACE_ORDER, AFFIRM_MODAL_CLOSED, AFFIRM_CHECKOUT_ERROR } from 'src/modules/payment-affirm/types/AffirmCheckoutEvents';
import { SN_BRAINTREE, SET_SELECTED_METHOD } from 'src/modules/payment-braintree/store/mutation-types';

import OCartItemsTable from 'theme/components/organisms/o-cart-items-table';
import { mapMobileObserver } from '@storefront-ui/vue/src/utilities/mobile-observer';
import PaymentCard from 'src/modules/payment-braintree/components/payment-card.vue';
import PaymentApplePay from 'src/modules/payment-braintree/components/payment-apple-pay.vue';
import PaymentPayPal from 'src/modules/payment-braintree/components/payment-pay-pal.vue';

export default {
  name: 'OConfirmOrder',
  components: {
    APromoCode,
    MPriceSummary,
    OCartItemsTable,
    OGiftCardPayment,
    SfRadio,
    SfIcon,
    SfImage,
    SfPrice,
    SfTable,
    SfButton,
    SfHeading,
    SfAccordion,
    SfCollectedProduct,
    SfProperty
  },
  mixins: [OrderReview, Payment],
  data () {
    return {
      isCheckoutInProgress: false,
      braintreeClient: undefined
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      isVirtualCart: 'cart/isVirtualCart',
      shippingDetails: 'checkout/getShippingDetails',
      shippingMethods: 'checkout/getShippingMethods',
      paymentDetails: 'checkout/getPaymentDetails',
      paymentMethods: 'checkout/getPaymentMethods',
      personalDetails: 'checkout/getPersonalDetails'
    }),
    ...mapMobileObserver(),
    cartItems () {
      return this.$store.getters['cart/getCartItems'];
    },
    isBraintreeAvailable () {
      return !!this.paymentMethods.find(({ code }) => code === 'braintree');
    },
    shippingMethod () {
      const shippingMethod = this.shippingMethods.find(
        method => this.shippingDetails.shippingMethod === method.method_code
      );
      return shippingMethod ? shippingMethod.method_title : '';
    },
    paymentMethod () {
      const paymentMethod = this.paymentMethods.find(
        method => this.paymentDetails.paymentMethod === method.code
      );
      return paymentMethod ? paymentMethod.title : '';
    },
    braintreePaymentMethods () {
      return {
        card: {
          code: 'card',
          name: 'Card',
          component: PaymentCard
        },
        applePay: {
          code: 'applePay',
          name: 'ApplePay',
          component: PaymentApplePay
        },
        paypal: {
          code: 'paypal',
          name: 'Paypal',
          component: PaymentPayPal
        }
      }
    },
    selectedBraintreePaymentMethod () {
      if (this.paymentDetails.paymentMethod !== 'braintree') {
        return;
      }

      return this.$store.getters['braintree/selectedMethod'];
    },
    showBraintreeMethods () {
      return !!this.braintreeClient;
    },
    showPlaceOrderButton () {
      return !this.selectedBraintreePaymentMethod ||
       (this.selectedBraintreePaymentMethod &&
        this.selectedBraintreePaymentMethod !== this.braintreePaymentMethods.paypal.code);
    }
  },
  beforeCreate () {
    registerModule(OrderModule);
  },
  async created () {
    this.$bus.$on(AFFIRM_BEFORE_PLACE_ORDER, this.onAffirmBeforePlaceOrderHandler);
    this.$bus.$on(AFFIRM_MODAL_CLOSED, this.onAffirmModalClosedHandler);
    this.$bus.$on(AFFIRM_CHECKOUT_ERROR, this.onAffirmPlaceOrderError);

    if (!this.isBraintreeAvailable) {
      return;
    }

    this.braintreeClient = await this.$store.dispatch('braintree/createBraintreeClient');
  },
  beforeDestroy () {
    this.$bus.$off(AFFIRM_BEFORE_PLACE_ORDER, this.onAffirmBeforePlaceOrderHandler);
    this.$bus.$off(AFFIRM_MODAL_CLOSED, this.onAffirmModalClosedHandler);
    this.$bus.$off(AFFIRM_CHECKOUT_ERROR, this.onAffirmPlaceOrderError);
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    getPlushieName (product) {
      if (!product.plushieName) {
        return '';
      }

      let name = product.plushieName;

      if (product.plushieBreed) {
        name += ', ' + product.plushieBreed;
      }

      return this.truncate(name);
    },
    getThumbnailForProduct (product) {
      if (product.thumbnail && product.thumbnail.includes('://')) {
        return product.thumbnail;
      }

      return getThumbnailForProduct(product);
    },
    getProductRegularPrice (product) {
      return getCartItemPrice(product, {}).regular;
    },
    getProductSpecialPrice (product) {
      return getCartItemPrice(product, {}).special;
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || [];
    },
    isCustomOption (product, productOption) {
      if (!product.custom_options) {
        return false;
      }

      return product.custom_options.find(option => option.title === productOption.label) !== undefined;
    },
    getBundleProductOptions (product) {
      if (!product.bundle_options ||
          product.bundle_options.length < 2 ||
          !product.product_option ||
          !product.product_option.extension_attributes ||
          !product.product_option.extension_attributes.bundle_options
      ) {
        return [];
      }

      let result = [];
      const productBundleOptions = product.product_option.extension_attributes.bundle_options;

      product.bundle_options.forEach(option => {
        // Hide Forevers simple products
        if ([ProductId.FOREVERS_DOG, ProductId.FOREVERS_CAT, ProductId.FOREVERS_OTHER]
          .includes(product.id) && option.title.toLowerCase() === 'product'
        ) {
          return;
        }

        if (!productBundleOptions.hasOwnProperty(option.option_id)) {
          return
        }

        const selections = productBundleOptions[option.option_id].option_selections;

        if (!selections) {
          return
        }

        selections.forEach(selection => {
          const productLink = option.product_links.find(productLink => +productLink.id === selection);

          if (!productLink) {
            return;
          }

          result.push(productLink.product.name);
        });
      });

      return result;
    },
    onSuccess () {},
    onFailure (response) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: this.$t(response.result),
        action1: { label: this.$t('OK') }
      });
    },
    onBraintreePaymentMethodError () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: this.$t('Something went wrong. Please try another payment method'),
        action1: { label: this.$t('OK') }
      });
    },
    truncate (text, desktopLength = 75, mobileLength = 50) {
      const maxLength = this.isMobile ? mobileLength : desktopLength;

      if (text.length <= maxLength) {
        return text;
      }

      return text.substring(0, maxLength) + '...';
    },
    onAffirmBeforePlaceOrderHandler () {
      this.isCheckoutInProgress = true;
    },
    onAffirmModalClosedHandler () {
      this.isCheckoutInProgress = false;
    },
    onAffirmPlaceOrderError () {
      this.isCheckoutInProgress = false;
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: this.$t('Something went wrong'),
        action1: { label: this.$t('OK') }
      });
    },
    getCartItemKey (cartItem) {
      return getCartItemKey(cartItem);
    },
    onBraintreeMethodSelected () {
      this.payment.paymentMethod = 'braintree';
      this.onPaymentMethodChange();
    },
    onPaymentMethodChange () {
      this.$bus.$emit('checkout-after-paymentMethodChanged', this.payment);
      this.changePaymentMethod();
    },
    changeBraintreePaymentMethod (code) {
      this.$store.commit(`${SN_BRAINTREE}/${SET_SELECTED_METHOD}`, code);

      if (this.paymentDetails.paymentMethod !== 'braintree') {
        this.onBraintreeMethodSelected();
      }
    },
    onPlaceOrder () {
      if (this.paymentDetails.paymentMethod !== 'braintree') {
        this.placeOrder();
        return;
      }

      this.$refs[this.selectedBraintreePaymentMethod][0].doPayment();
    },
    isBraintreeMethodSelected (methodCode) {
      return !!this.selectedBraintreePaymentMethod &&
       this.selectedBraintreePaymentMethod === methodCode;
    }
  },
  mounted () {
    createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0);
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-padding: var(--spacer-xl) 0 var(--spacer-base) 0;
  }
}

.payment-method {
  &.hidden {
    display: none;
  }
}

.totals {
  display: flex;
  justify-content: space-between;
  &__element {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-basis: 50%;
    max-width: 18.75rem;

    &:first-child {
      margin-right: var(--spacer-base);
    }
  }
  &__terms {
    &--link {
      margin: 0 0 0 0.4em;
    }
  }
}
.button {
  cursor: pointer;
}
.property {
  margin: 0 0 var(--spacer-base) 0;
  --property-value-font-weight: var(--font-semibold);
  --property-value-font-size: var(--font-base);
  @include for-desktop {
    margin: 0 0 var(--spacer-sm) 0;
    &__total {
      padding: var(--spacer-base) 0 0 0;
    }
  }
}
.divider {
  --divider-border-color: var(--c-white);
  --divider-width: 100%;
  --divider-margin: 0 0 var(--spacer-base) 0;
}
.accordion {
  position: relative;
  margin: 0 calc(var(--spacer-sm) * -1);
}
.accordion {
  --accordion-item-content-padding: 0;
  --collected-product-padding: 0;
  --collected-product-image-background: var(--c-white);
  --heading-padding: 0;
  &__item {
    position: relative;
  }
  &__content {
    flex: 1;
    padding: var(--spacer-sm);
  }
  &__edit {
    flex: unset;
    position: absolute;
    right: var(--spacer-base);
    top: var(--spacer-base);
  }
}
.collected-product {
  padding: var(--spacer-sm) 0;
  &:not(:last-of-type) {
    border: 1px solid var(--_c-light-primary);
    border-width: 0 0 1px 0;
  }
  &__action, &__option {
    font-size: var(--font-sm);
  }
  &__action {
    margin-top: var(--spacer-sm);
  }

  &__option {
    font-size: var(--font-xs);

    &__icon {
      display: inline-block;
    }
  }
}
::v-deep .sf-collected-product {
  &__title {
    --collected-product-title-font-size: var(--font-sm);
    --collected-product-title-font-weight: var(--font-semibold);
  }
}
.content {
  margin: 0 0 var(--spacer-base) 0;
  color: var(--c-text);
  &__label {
    font-weight: 400;
  }
}
.actions {
  margin: var(--spacer-base) 0;
  &__button {
    &:first-child {
      --button-height: 4.0625rem;
    }
    &--secondary {
      margin: var(--spacer-base) 0;
    }
  }
  @include for-desktop {
    display: flex;
  }
}
a {
  color: var(--c-text);
  &:hover {
    color: var(--c-primary);
  }
}
.no-flex {
  flex: unset;
}
.promo-code {
  &.mobile-only {
    max-width: 100%;
    width: 20rem;
  }
}
</style>

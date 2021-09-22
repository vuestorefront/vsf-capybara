<template>
  <div class="o-confirm-order">
    <SfHeading
      :title="`${isVirtualCart ? 3 : 4}. ${$t('Review')}`"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfAccordion :open="$t('Details')" class="accordion mobile-only">
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
            {{ $t("Edit") }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Shipping')">
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
            {{ $t("Edit") }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Payment')">
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
            {{ $t("Edit") }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Payment method')">
        <div class="accordion__item">
          <div class="accordion__content">
            <p class="content">
              {{ paymentMethod }}
            </p>
          </div>
          <SfButton
            class="sf-button--text color-secondary accordion__edit"
            @click="$bus.$emit('checkout-before-edit', 'payment')"
          >
            {{ $t("Edit") }}
          </SfButton>
        </div>
      </SfAccordionItem>
      <SfAccordionItem :header="$t('Order details')">
        <div class="accordion__item">
          <transition name="fade">
            <div class="accordion__content">
              <SfCollectedProduct
                v-for="product in productsInCart"
                :key="product.id + product.checksum"
                v-model="product.qty"
                :image="getThumbnailForProduct(product)"
                :title="product.name | htmlDecode"
                :regular-price="getProductRegularPrice(product)"
                :special-price="getProductSpecialPrice(product)"
                class="collected-product"
              >
                <template #configuration>
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
    </SfAccordion>

    <o-cart-items-table :cart-items="productsInCart" />

    <div class="summary mobile-only">
      <div class="summary__content">
        <SfHeading
          :title="$t('Totals')"
          :level="1"
          class="sf-heading--left sf-heading--no-underline summary__title"
        />
        <MPriceSummary class="summary__total" />
        <SfCheckbox
          v-model="orderReview.terms"
          class="summary__terms"
          name="acceptConditions"
          @blur="$v.orderReview.terms.$touch()"
        >
          <template #label>
            <span class="sf-checkbox__label no-flex">
              {{ $t("I accept ") }}
            </span>
            <SfButton class="sf-button sf-button--text summary__terms--link" @click.prevent="openTermsAndConditionsModal">
              {{ $t("Terms and conditions") }}
            </SfButton>
          </template>
        </SfCheckbox>
      </div>
    </div>
    <APromoCode class="mobile-only" :allow-promo-code-removal="false" />
    <div class="characteristics mobile-only">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        color-icon="green-primary"
        class="characteristics__item"
      />
    </div>
    <div class="totals desktop-only">
      <div class="totals__element">
        <SfCheckbox
          v-model="orderReview.terms"
          class="totals__terms"
          name="acceptConditions"
          @blur="$v.orderReview.terms.$touch()"
        >
          <template #label>
            <span class="sf-checkbox__label no-flex">
              {{ $t("I accept ") }}
            </span>
            <SfButton class="sf-button sf-button--text totals__terms--link" @click.prevent="openTermsAndConditionsModal">
              {{ $t("Terms and conditions") }}
            </SfButton>
          </template>
        </SfCheckbox>
        <APromoCode :allow-promo-code-removal="false" />
      </div>
      <MPriceSummary class="totals__element" />
    </div>
    <div class="_braintree-widget">
      <braintree-dropin v-if="paymentMethod === 'Braintree'" />
    </div>
    <div class="actions">
      <SfButton
        class="sf-button--full-width actions__button place-order-btn"
        :disabled="$v.orderReview.$invalid || !productsInCart.length"
        @click="placeOrder"
      >
        {{ $t("Place the order") }}
      </SfButton>
      <SfButton
        class="sf-button--full-width sf-button--text color-secondary actions__button actions__button--secondary"
        @click="$bus.$emit('checkout-before-edit', 'payment')"
      >
        {{ $t("Edit payment") }}
      </SfButton>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { OrderModule } from '@vue-storefront/core/modules/order';
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview';
import { getProductPrice } from 'theme/helpers';
import {
  SfIcon,
  SfImage,
  SfPrice,
  SfTable,
  SfButton,
  SfHeading,
  SfCheckbox,
  SfAccordion,
  SfCharacteristic,
  SfCollectedProduct,
  SfProperty
} from '@storefront-ui/vue';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
import APromoCode from 'theme/components/atoms/a-promo-code';
import { ModalList } from 'theme/store/ui/modals'
import { createSmoothscroll } from 'theme/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { ProductId } from 'src/modules/budsies';
import BraintreeDropin from 'src/modules/payment-braintree/components/Dropin';

import OCartItemsTable from 'theme/components/organisms/o-cart-items-table';

export default {
  name: 'OConfirmOrder',
  components: {
    APromoCode,
    MPriceSummary,
    OCartItemsTable,
    SfIcon,
    SfImage,
    SfPrice,
    SfTable,
    SfButton,
    SfHeading,
    SfCheckbox,
    SfAccordion,
    SfCharacteristic,
    SfCollectedProduct,
    SfProperty,
    BraintreeDropin
  },
  mixins: [OrderReview],
  data () {
    return {
      characteristics: [
        {
          title: this.$t('Safety'),
          description: this.$t('It carefully packaged with a personal touch'),
          icon: 'safety'
        },
        {
          title: this.$t('Easy shipping'),
          description: this.$t('You’ll receive dispatch confirmation and an arrival date'),
          icon: 'shipping'
        },
        {
          title: this.$t('Changed your mind?'),
          description: this.$t('Rest assured, we offer free returns within 30 days'),
          icon: 'return'
        }
      ]
    };
  },
  validations: {
    orderReview: {
      terms: {
        required
      }
    }
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
    }
  },
  beforeCreate () {
    registerModule(OrderModule);
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    getThumbnailForProduct (product) {
      if (product.thumbnail && product.thumbnail.includes('://')) {
        return product.thumbnail;
      }

      return getThumbnailForProduct(product);
    },
    getProductRegularPrice (product) {
      return getProductPrice(product, {}).regular;
    },
    getProductSpecialPrice (product) {
      return getProductPrice(product, {}).special;
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
    openTermsAndConditionsModal () {
      this.openModal({ name: ModalList.TermsAndConditions })
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
    --heading-padding: var(--spacer-2xl) 0 var(--spacer-base) 0;
  }
}

// .a-promo-code {
//   margin-top: var(--spacer-xl);
// }
.totals {
  display: flex;
  justify-content: space-between;
  &__element {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex: 0 0 18.75rem;
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
.characteristics {
  padding: var(--spacer-sm);
  &__item {
    margin: var(--spacer-base) 0;
  }
}
.summary,
.accordion {
  position: relative;
  left: 50%;
  right: 50%;
  width: 100vw;
  margin-left: -50vw;
  margin-right: -50vw;
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
.summary {
  background: var(--c-light);
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacer-base) var(--spacer-lg);
  }
  &__title {
    margin: 0 0 var(--spacer-xs) 0;
  }
  &__terms {
    margin: var(--spacer-xs) 0;
    &--link {
      margin: 0 0 0 0.4em;
    }
  }
  &__total {
    width: 100%;
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
._braintree-widget {
  margin-top: var(--spacer-base);
}
</style>

<template>
  <div class="o-order-summary">
    <div class="highlighted">
      <SfHeading
        :title="$t('Order Summary')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="total-items">
        <h3>{{ $t("Total items") }}: {{ totalItems }}</h3>
        <SfButton
          class="sf-button--text"
          @click="showProducts = !showProducts"
        >
          {{ showProducts ? $t("Hide products") : $t("Show products") }}
        </SfButton>
      </div>
      <transition name="fade">
        <div v-if="showProducts" class="collected-product-list">
          <SfCollectedProduct
            v-for="product in productsInCart"
            :key="product.id"
            class="collected-product"
            :image="getThumbnailForProduct(product)"
            :title="product.name | htmlDecode"
            :regular-price="getProductRegularPrice(product)"
            :special-price="getProductSpecialPrice(product)"
            :stock="product.stock.qty"
            :qty="product.qty"
            @click:remove="removeProduct(product)"
            @input="changeQuantity(product, $event)"
          >
            <template #configuration>
              <div class="product__properties">
                <SfProperty
                  v-for="property in product.options"
                  :key="property.label"
                  :name="property.label"
                  :value="property.value"
                  class="product__property"
                />
              </div>
            </template>
            <template #actions>
              <div>
                <div class="product__action">
                  {{ product.sku }}
                </div>
                <div class="product__action">
                  {{ $t("Quantity") }}:
                  <span class="product__qty">{{ product.qty }}</span>
                </div>
              </div>
            </template>
          </SfCollectedProduct>
        </div>
      </transition>
    </div>
    <MPriceSummary class="highlighted highlighted--total" />
    <div class="highlighted promo-code">
      <SfButton
        class="promo-code__button"
        @click="showPromoCode = !showPromoCode"
      >
        {{ showPromoCode ? "-" : "+" }} {{ $t("Discount code") }}
      </SfButton>
      <transition name="fade">
        <div v-if="showPromoCode">
          <SfInput
            v-model="promoCode"
            name="promoCode"
            :label="$t('Add a discount code')"
            class="promo-code__input"
            @keyup.enter="applyCoupon"
          />
          <SfButton class="sf-button--full-width" @click="applyCoupon">
            {{ $t("Add discount code") }}
          </SfButton>
        </div>
      </transition>
    </div>
    <div class="highlighted">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import {
  SfInput,
  SfButton,
  SfHeading,
  SfProperty,
  SfCharacteristic,
  SfCollectedProduct
} from '@storefront-ui/vue';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
export default {
  name: 'OOrderSummary',
  components: {
    SfInput,
    SfButton,
    SfHeading,
    SfProperty,
    SfCharacteristic,
    SfCollectedProduct,
    MPriceSummary
  },
  data () {
    return {
      promoCode: '',
      showPromoCode: false,
      showProducts: false,
      characteristics: [
        {
          title: i18n.t('Safety'),
          description: i18n.t('It carefully packaged with a personal touch'),
          icon: 'safety'
        },
        {
          title: i18n.t('Easy shipping'),
          description: i18n.t(
            'You’ll receive dispatch confirmation and an arrival date'
          ),
          icon: 'shipping'
        },
        {
          title: i18n.t('Changed your mind?'),
          description: i18n.t(
            'Rest assured, we offer free returns within 30 days'
          ),
          icon: 'return'
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    }),
    totalItems () {
      return this.productsInCart.reduce((result, product) => {
        return result + product.qty;
      }, 0);
    }
  },
  methods: {
    getThumbnailForProduct (product) {
      return getThumbnailForProduct(product);
    },
    getProductRegularPrice (product) {
      const price = product.original_price_incl_tax || product.price_incl_tax;
      return price ? this.$options.filters.price(price) : '';
    },
    getProductSpecialPrice (product) {
      const price = product.special_price ? product.price_incl_tax : false;
      return price ? this.$options.filters.price(price) : '';
    },
    removeProduct (product) {
      this.$store.dispatch('cart/removeItem', { product });
    },
    changeQuantity (product, qty) {
      this.$store.dispatch('cart/updateQuantity', { product, qty });
    },
    applyCoupon () {
      this.$store.dispatch('cart/applyCoupon', this.promoCode);
    },
    removeCoupon () {
      this.$store.dispatch('cart/removeCoupon');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: #f1f2f3;
  padding: $spacer-extra-big;
  margin-bottom: $spacer-big;
  &:last-child {
    margin-bottom: 0;
  }
  &--total {
    margin-bottom: 1px;
  }
}
.title {
  margin-bottom: $spacer-extra-big;
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacer-big;
}
.collected-product-list {
  margin: 0 -20px;
}
.collected-product {
  &:not(:last-child) {
    margin-bottom: $spacer-big;
  }
}
.characteristic {
  &:not(:last-child) {
    margin-bottom: $spacer-big;
  }
}
.promo-code {
  &__button {
    padding: 0;
    background-color: transparent;
    color: $c-primary;
    font-size: $font-size-big-desktop;
  }
  &__input {
    margin: $spacer-big 0;
    ::v-deep input {
      border-color: $c-gray-variant;
    }
  }
}
.product {
  &__properties {
    margin: $spacer-big 0 0 0;
  }
  &__property,
  &__action {
    font-size: $font-size-extra-small-desktop;
  }
  &__action {
    color: $c-gray-variant;
    font-size: $font-size-extra-small-desktop;
    margin: 0 0 $spacer-small 0;
    &:last-child {
      margin: 0;
    }
  }
  &__qty {
    color: $c-text;
  }
}
</style>

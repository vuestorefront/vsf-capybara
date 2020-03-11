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
                <SfProperty :name="$t('SKU')" :value="product.sku" />
                <SfProperty
                  v-for="property in getProductOptions(product)"
                  :key="property.label"
                  :name="property.label"
                >
                  <template #value>
                    <span class="sf-property__value" v-html="property.value" />
                    <br>
                  </template>
                </SfProperty>
              </div>
            </template>
          </SfCollectedProduct>
        </div>
      </transition>
    </div>
    <MPriceSummary class="highlighted highlighted--total" />
    <APromoCode class="highlighted" />
    <div class="highlighted">
      <SfCharacteristic
        v-for="benefit in orderBenefits"
        :key="benefit.title"
        :title="benefit.title"
        :description="benefit.description"
        :icon="benefit.icon"
        class="characteristic"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import {
  SfButton,
  SfHeading,
  SfProperty,
  SfCharacteristic,
  SfCollectedProduct
} from '@storefront-ui/vue';
import APromoCode from 'theme/components/atoms/a-promo-code';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
export default {
  name: 'OOrderSummary',
  components: {
    SfButton,
    SfHeading,
    SfProperty,
    SfCharacteristic,
    SfCollectedProduct,
    APromoCode,
    MPriceSummary
  },
  data () {
    return {
      showProducts: false
    };
  },
  props: {
    orderBenefits: {
      type: Array,
      required: false,
      default: () => ([
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
      ])
    }
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
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || {};
    },
    removeProduct (product) {
      this.$store.dispatch('cart/removeItem', { product });
    },
    changeQuantity (product, qty) {
      this.$store.dispatch('cart/updateQuantity', { product, qty });
    }
  }
};
</script>
<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: #f1f2f3;
  padding: var(--spacer-extra-big);
  margin-bottom: var(--spacer-big);
  &:last-child {
    margin-bottom: 0;
  }
  &--total {
    margin-bottom: 1px;
  }
}
.title {
  margin-bottom: var(--spacer-extra-big);
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-big);
}
.collected-product-list {
  margin: 0 -20px;
}
.collected-product {
  --collected-product-image-background: var(--c-white);
  &:not(:last-child) {
    margin-bottom: var(--spacer-big);
  }
}
.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-big);
  }
}
.product {
  &__properties {
    margin: var(--spacer-big) 0 0 0;
    --property-name-font-size: 0.8rem;
    --property-value-font-font-size: 0.8rem;
    ::v-deep {
      .sf-property, .sf-property__name {
        display: inline;
      }
    }
  }
}
</style>

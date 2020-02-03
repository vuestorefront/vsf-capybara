<template>
  <div class="o-confirm-order">
    <SfHeading
      :title="`${isVirtualCart ? 3 : 4}. ${$t('Review order')}`"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfAccordion first-open class="accordion mobile-only">
      <SfAccordionItem :header="$t('Personal Details')">
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
            class="sf-button--text accordion__edit"
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
            class="sf-button--text accordion__edit"
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
            class="sf-button--text accordion__edit"
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
            class="sf-button--text accordion__edit"
            @click="$bus.$emit('checkout-before-edit', 'payment')"
          >
            {{ $t("Edit") }}
          </SfButton>
        </div>
      </SfAccordionItem>
    </SfAccordion>
    <SfTable class="sf-table--bordered table desktop-only">
      <SfTableHeading class="table__row">
        <SfTableHeader class="table__header table__image">
          {{ $t("Item") }}
        </SfTableHeader>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="table__header"
        >
          {{ tableHeader }}
        </SfTableHeader>
        <SfTableHeader class="table__action" />
      </SfTableHeading>
      <SfTableRow
        v-for="product in productsInCart"
        :key="product.id"
        class="table__row"
      >
        <SfTableData class="table__image">
          <SfImage :src="getThumbnailForProduct(product)" />
        </SfTableData>
        <SfTableData class="table__data table__data--left">
          <div class="product-title">
            {{ product.name | htmlDecode }}
          </div>
          <div class="product-sku">
            {{ product.sku }}
          </div>
        </SfTableData>
        <SfTableData
          v-for="property in ['Color', 'Size']"
          :key="property"
          class="table__data"
        >
          {{ getProductProperty(product, property) }}
        </SfTableData>
        <SfTableData class="table__data">
          {{ product.qty }}
        </SfTableData>
        <SfTableData class="table__data">
          <SfPrice
            :regular="getProductRegularPrice(product)"
            :special="getProductSpecialPrice(product)"
            class="product-price"
          />
        </SfTableData>
        <SfTableData class="table__action">
          <SfIcon
            icon="cross"
            size="xxs"
            color="#BEBFC4"
            role="button"
            class="button"
            @click="removeProduct(product)"
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
    <SfHeading
      :title="$t('Order details')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="summary">
      <div class="summary__group">
        <MPriceSummary class="summary__total" />
        <SfCheckbox
          v-model="orderReview.terms"
          class="summary__terms"
          name="acceptConditions"
          @blur="$v.orderReview.terms.$touch()"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t("I accept ") }}
            </div>
            &nbsp;
            <a href="#" @click="openTermsAndConditionsModal">
              <span>{{ $t("Terms and conditions") }}</span>
            </a>
            *
          </template>
        </SfCheckbox>
      </div>
      <div class="summary__group">
        <SfButton
          class="sf-button--full-width summary__action-button"
          :disabled="$v.orderReview.$invalid || !productsInCart.length"
          @click="placeOrder"
        >
          {{ $t("Place the order") }}
        </SfButton>
        <SfButton
          class="sf-button--full-width sf-button--text summary__action-button summary__action-button--secondary"
          @click="$bus.$emit('checkout-before-edit', 'payment')"
        >
          {{ $t("Edit payment") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { required } from 'vuelidate/lib/validators';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { OrderModule } from '@vue-storefront/core/modules/order';
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview';
import {
  SfIcon,
  SfImage,
  SfPrice,
  SfTable,
  SfButton,
  SfHeading,
  SfCheckbox,
  SfAccordion
} from '@storefront-ui/vue';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'OConfirmOrder',
  components: {
    SfIcon,
    SfImage,
    SfPrice,
    SfTable,
    SfButton,
    SfHeading,
    SfCheckbox,
    SfAccordion,
    MPriceSummary
  },
  mixins: [OrderReview],
  data () {
    return {
      tableHeaders: [
        i18n.t('Description'),
        i18n.t('Colour'),
        i18n.t('Size'),
        i18n.t('Quantity'),
        i18n.t('Amount')
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
    getProductProperty (product, propertyName) {
      const property = product.options
        ? product.options.find(option => option.label === propertyName)
        : false;
      return property ? property.value : '';
    },
    removeProduct (product) {
      this.$store.dispatch('cart/removeItem', { product });
    },
    onSuccess () {},
    onFailure (response) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(response.result),
        action1: { label: this.$t('OK') }
      });
    },
    openTermsAndConditionsModal () {
      this.openModal({name: ModalList.AccountBenefits})
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
.title {
  margin-bottom: $spacer-extra-big;
}
.table {
  margin-bottom: $spacer-big;
  &__header {
    font-size: $font-size-regular-desktop;
    font-weight: $body-font-weight-primary;
    @include for-desktop {
      text-align: center;
    }
  }
  &__data {
    font-size: $font-size-small-desktop;
    text-align: center;
  }
  &__image {
    @include for-desktop {
      flex: 0 0 5.125rem;
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 2.5rem;
    }
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.accordion {
  margin: 0 0 $spacer-extra-big 0;
  &__item {
    display: flex;
    align-items: flex-start;
  }
  &__content {
    flex: 1;
  }
  &__edit {
    flex: unset;
  }
}
.summary {
  background-color: $c-light;
  margin: 0 -#{$spacer-big};
  padding: $spacer-big;
  @include for-desktop {
    background-color: transparent;
  }
  &__group {
    @include for-desktop {
      display: flex;
      margin: 0 0 $spacer-extra-big 0;
    }
  }
  &__terms {
    flex: 1;
    order: -1;
    margin-bottom: $spacer-big;
  }
  &__total {
    margin: 0 0 $spacer-extra-big 0;
    padding: 0 $spacer-big;
    flex: 0 0 16.875rem;
    @include for-desktop {
      padding: 0;
    }
  }
  &__action-button {
    flex: 1;
    &--secondary {
      margin: $spacer-big 0;
      @include for-desktop {
        order: -1;
        margin: 0;
        text-align: left;
      }
    }
  }
  &__property-total {
    ::v-deep > * {
      margin: $spacer-big 0 0 0;
      text-transform: uppercase;
      font-size: $font-size-regular-desktop;
      line-height: 1.6;
      font-weight: 500;
      color: $c-text;
    }
  }
}
.button {
  cursor: pointer;
}
.content {
  margin: 0 0 $spacer-big 0;
  color: $c-text;
  font-size: $font-size-extra-small-desktop;
  font-weight: 300;
  line-height: 1.6;
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: 400;
  }
}
.product-title,
.product-sku {
  line-height: 1.6;
}
.product-sku {
  color: $c-text-muted;
  font-size: $font-size-extra-small-desktop;
}
.product-price {
  display: flex;
  flex-direction: column;
  font-size: $font-size-small-desktop;
  ::v-deep .sf-price__special {
    order: 1;
    color: $c-text;
  }
}
</style>

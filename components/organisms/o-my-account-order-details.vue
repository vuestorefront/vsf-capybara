<template>
  <div class="o-my-account-order-details">
    <SfHeading
      :title="$t('Order #') + order.increment_id"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    >
      <template #title="{title}">
        <h3 class="order-details__title">
          <SfArrow class="sf-arrow--transparent order-details__back" @click.native="$emit('close')" />
          {{ title }}
          <SfBadge
            class="order-details__status"
            :class="{
              'color-success': order.status === 'complete',
              'color-danger': order.status === 'canceled' || order.status === 'closed',
              'color-warning': order.status !== 'canceled' && order.status !== 'closed' && order.status !== 'complete'
            }"
          >
            {{ order.status | capitalize }}
          </SfBadge>
        </h3>
      </template>
    </SfHeading>
    <div class="order-details__products">
      <SfTable class="sf-table--bordered table">
        <SfTableHeading>
          <SfTableHeader class="table__header table__image">
            {{ $t('Thumbnail') }}
          </SfTableHeader>
          <SfTableHeader class="table__header">
            {{ $t('Product Name') }}
          </SfTableHeader>
          <SfTableHeader class="table__header">
            {{ $t('Quantity') }}
          </SfTableHeader>
          <SfTableHeader class="table__header table__price">
            {{ $t('Subtotal') }}
          </SfTableHeader>
          <SfTableHeader class="table__header table__price">
            {{ $t('Price') }}
          </SfTableHeader>
        </SfTableHeading>
        <SfTableRow v-for="product in products" :key="product.id">
          <SfTableData class="table__header table__image">
            <SfImage :src="getThumbnailForProduct(product)" :alt="product.name | htmlDecode" />
          </SfTableData>
          <SfTableData class="table__header">
            {{ product.name | htmlDecode }}
          </SfTableData>
          <SfTableData class="table__header">
            {{ product.qty_ordered }}
          </SfTableData>
          <SfTableData class="table__header table__price">
            {{ product.row_total_incl_tax | price }}
          </SfTableData>
          <SfTableData class="table__header table__price">
            {{ product.price_incl_tax | price }}
          </SfTableData>
        </SfTableRow>
      </SfTable>
    </div>
    <div class="order-details__summary">
      <div>
        <SfProperty
          :name="$t('Subtotal')"
          :value="order.subtotal | price"
          class="sf-property--full-width property"
        />
        <SfProperty
          :name="$t('Tax')"
          :value="order.tax_amount + order.discount_tax_compensation_amount | price"
          class="sf-property--full-width property"
        />
        <SfProperty
          :name="$t('Shipping')"
          :value="order.shipping_amount | price"
          class="sf-property--full-width property"
        />
        <SfProperty
          v-if="order.discount_amount"
          :name="$t('Discount')"
          :value="order.discount_amount | price"
          class="sf-property--full-width property"
        />
        <SfProperty
          :name="$t('Total')"
          :value="order.grand_total | price"
          class="sf-property--full-width property-total"
        />
      </div>
    </div>
    <div class="order-details__informations">
      <div v-if="shippingAddress">
        <SfHeading
          :title="$t('Shipping address')"
          :level="4"
          class="sf-heading--left sf-heading--no-underline"
        />
        <address>
          <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
          <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
          <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
          <p>{{ shippingAddress.country }}</p>
        </address>
      </div>
      <div v-if="order.shipping_description">
        <SfHeading
          :title="$t('Shipping method')"
          :level="4"
          class="sf-heading--left sf-heading--no-underline"
        />
        <p>{{ order.shipping_description }}</p>
      </div>
      <div>
        <SfHeading
          :title="$t('Billing address')"
          :level="4"
          class="sf-heading--left sf-heading--no-underline"
        />
        <address>
          <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
          <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
          <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
          <p>{{ billingAddress.country }}</p>
        </address>
      </div>
      <div>
        <SfHeading
          :title="$t('Payment method')"
          :level="4"
          class="sf-heading--left sf-heading--no-underline"
        />
        <p>{{ paymentMethod }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchQuery } from 'storefront-query-builder';
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import {
  SfHeading,
  SfArrow,
  SfBadge,
  SfTable,
  SfProperty,
  SfImage
} from '@storefront-ui/vue';

export default {
  name: 'OMyAccountOrderDetails',
  components: {
    SfHeading,
    SfArrow,
    SfBadge,
    SfTable,
    SfProperty,
    SfImage
  },
  props: {
    order: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      products: []
    }
  },
  computed: {
    paymentMethod () {
      return this.order && this.order.payment.additional_information[0]
    },
    billingAddress () {
      return this.order && this.order.billing_address
    },
    shippingAddress () {
      return this.order && this.order.extension_attributes.shipping_assignments[0].shipping.address
    }
  },
  methods: {
    getOrderedProducts () {
      let arrayOfSKUs = []
      this.order.items.forEach(product => {
        if (arrayOfSKUs.indexOf(product.sku) === -1) {
          arrayOfSKUs.push(product.sku)
        }
      })

      let searchQuery = new SearchQuery()
      searchQuery = searchQuery.applyFilter({ key: 'configurable_children.sku', value: { 'in': arrayOfSKUs } })
      this.$store.dispatch('product/findProducts', { query: searchQuery, start: 0, size: this.order.items.length, updateState: false }, { root: true }).then((resp) => {
        resp.items.forEach(responseItem => {
          let relatedProduct = this.order.items.find(item => { return item.sku === responseItem.sku })
          this.products.push(Object.assign({}, relatedProduct, responseItem))
        })
      })
    },
    getThumbnailForProduct (product) {
      const thumbnail = productThumbnailPath(product)
      return getThumbnailPath(thumbnail, 100, 142)
    }
  },
  mounted () {
    this.getOrderedProducts()
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.order-details {
  &__title {
    display: flex;
    align-items: center;
    margin: 0;
  }
  &__back {
    margin-right: var(--spacer-lg);
  }
  &__status {
    margin-left: var(--spacer-lg);
  }
  &__products {
    margin-top: var(--spacer-xl);
    img {
      display: block;
    }
    .sf-table__header--center {
      text-align: center;
    }
  }
  &__summary {
    margin-top: var(--spacer-lg);
    display: flex;
    justify-content: flex-end;
    div {
      width: 10rem;
    }
  }
  &__informations {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include for-desktop {
      margin-top: var(--spacer-xl);
      flex-direction: row;
      justify-content: space-between;
    }
    .sf-heading {
      margin-top: var(--spacer-xl);
    }
    p {
      margin: var(--spacer) 0 0 0;
    }
  }
}
.property {
  margin: 0 0 var(--spacer-base) 0;
  @include for-desktop {
    margin: 0 0 var(--spacer-sm) 0;
    &__total {
      padding: var(--spacer-base) 0 0 0;
    }
  }
}
.property-total {
  --property-name-font-weight: 500;
  --property-value-font-weight: 500;
}
.order-details__summary {
  .sf-property__name {
    min-width: 100px;
  }
  .sf-property__value {
    min-width: 180px;
    text-align: center;
  }
}
.table {
  &__header {
    text-align: center;
    &:last-child {
      text-align: right;
    }
  }
  &__image {
    --image-width: 5.125rem;
    text-align: left;
  }
  &__price {
    text-align: right;
  }
  @include for-mobile {
    &__header,
    &__image,
    &__price {
      text-align: left;
    }
    &__header {
      &:last-child {
        text-align: left;
      }
    }
  }
}
</style>

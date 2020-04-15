<template>
  <div class="o-my-account-order-details">
    <SfHeading
      :title="$t('Order #') + order.increment_id"
      class="sf-heading--left sf-heading--no-underline title"
    >
      <template #title="{title}">
        <h2 class="order-details__title">
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
        </h2>
      </template>
    </SfHeading>
    <div class="order-details__products">
      <SfTable class="sf-table--bordered">
        <SfTableHeading>
          <SfTableHeader>{{ $t('Thumbnail') }}</SfTableHeader>
          <SfTableHeader class="sf-table__header--center">
            {{ $t('Product Name') }}
          </SfTableHeader>
          <SfTableHeader class="sf-table__header--center">
            {{ $t('Price') }}
          </SfTableHeader>
          <SfTableHeader class="sf-table__header--center">
            {{ $t('Quantity') }}
          </SfTableHeader>
          <SfTableHeader class="sf-table__header--center">
            {{ $t('Subtotal') }}
          </SfTableHeader>
        </SfTableHeading>
        <SfTableRow v-for="product in products" :key="product.id">
          <SfTableData>
            <img :src="getThumbnailForProduct(product)" :alt="product.name | htmlDecode">
          </SfTableData>
          <SfTableData class="sf-table__header--center">
            {{ product.name | htmlDecode }}
          </SfTableData>
          <SfTableData class="sf-table__header--center">
            {{ product.price_incl_tax | price }}
          </SfTableData>
          <SfTableData class="sf-table__header--center">
            {{ product.qty_ordered }}
          </SfTableData>
          <SfTableData class="sf-table__header--center">
            {{ product.row_total_incl_tax | price }}
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
          :name="$t('TOTAL')"
          :value="order.grand_total | price"
          class="sf-property--full-width property-total"
        />
      </div>
    </div>
    <div class="order-details__informations">
      <div v-if="shippingAddress">
        <SfHeading
          :title="$t('Shipping address')"
          class="sf-heading--left sf-heading--no-underline"
        >
          <template #title="{title}">
            <h3 class="order-details__title">
              {{ title }}
            </h3>
          </template>
        </SfHeading>
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
          class="sf-heading--left sf-heading--no-underline"
        >
          <template #title="{title}">
            <h3 class="order-details__title">
              {{ title }}
            </h3>
          </template>
        </SfHeading>
        <p>{{ order.shipping_description }}</p>
      </div>
      <div>
        <SfHeading
          :title="$t('Billing address')"
          class="sf-heading--left sf-heading--no-underline"
        >
          <template #title="{title}">
            <h3 class="order-details__title">
              {{ title }}
            </h3>
          </template>
        </SfHeading>
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
          class="sf-heading--left sf-heading--no-underline"
        >
          <template #title="{title}">
            <h3 class="order-details__title">
              {{ title }}
            </h3>
          </template>
        </SfHeading>
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
  SfProperty
} from '@storefront-ui/vue';

export default {
  name: 'OMyAccountOrderDetails',
  components: {
    SfHeading,
    SfArrow,
    SfBadge,
    SfTable,
    SfProperty
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
      searchQuery = searchQuery.applyFilter({key: 'configurable_children.sku', value: {'in': arrayOfSKUs}})
      this.$store.dispatch('product/list', {query: searchQuery, start: 0, size: this.order.items.length, updateState: false}, { root: true }).then((resp) => {
        resp.items.forEach(responseItem => {
          let relatedProduct = this.order.items.find(item => { return item.product_id === responseItem.id })
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
    margin-top: var(--spacer-2xl);
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
  }
  &__informations {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
      flex-direction: row;
      justify-content: space-between;
    }
    .sf-heading {
      margin-top: var(--spacer-2xl);
    }
    p {
      margin: var(--spacer) 0 0 0;
    }
  }
}
.property {
  margin-bottom: var(--spacer);
  ::v-deep .sf-property__name {
    color: var(--c-text-muted);
    text-transform: unset;
  }
}
.property-total {
  margin-top: var(--spacer-2xl);
  font-size: var(--font-xl);
  font-weight: 500;
  ::v-deep .sf-property__name {
    color: var(--c-text);
  }
}
</style>

<style lang="scss">
.order-details__summary {
  .sf-property__name {
    min-width: 100px;
  }
  .sf-property__value {
    min-width: 180px;
    text-align: center;
  }
}
</style>

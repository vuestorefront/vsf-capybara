<template>
  <div class="o-my-account-orders-history">
    <SfTabs :open-tab="1">
      <SfTab :title="$t('My orders')">
        <template v-if="!activeOrder">
          <p class="message">
            {{ $t('Check the details and status of your orders in the online store. You can also cancel your order or request a return.') }}
          </p>
          <div v-if="orders.length === 0" class="no-orders">
            <p class="no-orders__title">
              {{ $t('You currently have no orders') }}
            </p>
            <p class="no-orders__content">
              {{ $t('Best get shopping pronto...') }}
            </p>
            <SfButton class="no-orders__button">
              {{ $t('Start shopping') }}
            </SfButton>
          </div>
          <SfTable v-else class="orders">
            <SfTableHeading>
              <SfTableHeader
                v-for="tableHeader in tableHeaders"
                :key="tableHeader"
              >
                {{ $t(tableHeader) }}
              </SfTableHeader>
              <SfTableHeader>
                <span class="mobile-only">{{ $t('Download') }}</span>
                <SfButton @click.native="downloadAll" class="desktop-only orders__download-all">
                  {{ $t('Download all') }}
                </SfButton>
              </SfTableHeader>
            </SfTableHeading>
            <SfTableRow v-for="order in orders" :key="order.order_id">
              <SfTableData v-for="(data, key) in order" :key="key">
                <template v-if="key === 'status'">
                  <span
                    :class="{
                      'text-success': data === 'Complete',
                      'text-danger': data === 'Canceled' || data === 'Closed',
                      'text-warning': data !== 'Complete' && data !== 'Canceled' && data !== 'Closed'
                    }"
                  >{{ data }}</span>
                </template>
                <template v-else>
                  {{ data }}
                </template>
              </SfTableData>
              <SfTableData class="orders__view">
                <SfButton class="sf-button--text" @click.native="setActiveOrder(order)">
                  {{ $t('VIEW') }}
                </SfButton>
              </SfTableData>
            </SfTableRow>
          </SfTable>
        </template>
        <template v-else>
          <OMyAccountOrderDetails :order="activeOrder" @close="setActiveOrder(null)" />
        </template>
      </SfTab>
      <SfTab :title="$t('Returns')">
        <p class="message">
          {{ $t('This feature is not implemented yet! Please take a look at') }}<br>
          <a href="#">https://github.com/DivanteLtd/vue-storefront/issues {{ $t('for our Roadmap!') }}</a>
        </p>
      </SfTab>
    </SfTabs>
  </div>
</template>

<script>
import UserOrder from '@vue-storefront/core/modules/order/components/UserOrdersHistory';
import OMyAccountOrderDetails from 'theme/components/organisms/o-my-account-order-details'
import { SfTabs, SfTable, SfButton } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'OMyAccountOrdersHistory',
  mixins: [UserOrder],
  components: {
    SfTabs,
    SfTable,
    SfButton,
    OMyAccountOrderDetails
  },
  data () {
    return {
      tableHeaders: [
        'Order ID',
        'Order date',
        'Payment method',
        'Amount',
        'Status'
      ],
      activeOrder: null
    };
  },
  computed: {
    orders () {
      let orders = []
      this.ordersHistory.forEach(item => {
        orders.push({
          'order_id': item.increment_id,
          'order_date': this.$options.filters.date(item.created_at),
          'payment_method': item.payment.additional_information[0],
          'amount': this.$options.filters.price(item.grand_total),
          'status': this.$options.filters.capitalize(item.status)
        })
      })
      return orders
    }
  },
  methods: {
    downloadAll () {
      this.$store.dispatch('ui/openModal', { name: ModalList.FeatureNotImplemented })
    },
    setActiveOrder (order) {
      this.activeOrder = order ? this.ordersHistory.find(item => { return order.order_id.endsWith(item.increment_id) }) : null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.message {
  margin: 0 0 var(--spacer-2xl) 0;
  font-size: var(--font-base);
  font-family: var(--font-family-primary);
  font-weight: var(--font-normal);
  line-height: 1.6;
}
.no-orders {
  &__title,
  &__content {
    font-family: var(--font-family-secondary);
    font-size: var(--font-base);
    line-height: 1.6;
  }
  &__title {
    margin: 0 0 var(--spacer-xl) 0;
    font-weight: 500;
  }
  &__content {
    margin: 0 0 var(--spacer-2xl) 0;
    font-weight: 300;
  }
  &__button {
    width: 100%;
    @include for-desktop {
      width: auto;
    }
  }
}
.orders {
  &__download-all {
    padding: 10px 1.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  &__view {
    @include for-desktop {
      text-align: center;
    }
  }
  ::v-deep .sf-table {
    &__row,
    &__heading {
      margin: 0 -var(--spacer-xl);
      @include for-mobile {
        padding: 5px;
      }
    }
    &__header,
    &__data {
      padding: 5px;
    }
    &__row:last-child {
      @include for-mobile {
        border-bottom: 0;
      }
    }
  }
}
</style>

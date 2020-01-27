<template>
  <div class="o-my-account-orders-history">
    <SfTabs :open-tab="1">
      <SfTab :title="$t('My orders')">
        <p class="message">
          {{ $t('Check the details and status of your orders in the online store. You can also cancel your order or request a return.') }}
        </p>
        <div v-if="orders.length === 0" class="no-orders">
          <p class="no-orders__title">{{ $t('You currently have no orders') }}</p>
          <p class="no-orders__content">{{ $t('Best get shopping pronto...') }}</p>
          <SfButton class="no-orders__button">{{ $t('Start shopping') }}</SfButton>
        </div>
        <SfTable v-else class="orders">
          <SfTableHeading>
            <SfTableHeader
              v-for="tableHeader in tableHeaders"
              :key="tableHeader"
              >{{ tableHeader }}</SfTableHeader
            >
            <SfTableHeader>
              <span class="mobile-only">{{ $t('Download') }}</span>
              <SfButton class="desktop-only orders__download-all">{{ $t('Download all') }}</SfButton>
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow v-for="order in orders" :key="order[0]">
            <SfTableData v-for="(data, key) in order" :key="key">
              <template v-if="key === 4">
                <span
                  :class="{
                    'text-success': data === 'Finalised',
                    'text-warning': data === 'In process'
                  }"
                  >{{ data }}</span
                >
              </template>
              <template v-else>{{ data }}</template>
            </SfTableData>
            <SfTableData class="orders__view">
              <SfButton class="sf-button--text mobile-only">{{ $t('Download') }}</SfButton>
              <SfButton class="sf-button--text desktop-only">{{ $t('VIEW') }}</SfButton>
            </SfTableData>
          </SfTableRow>
        </SfTable>
      </SfTab>
      <SfTab :title="$t('Returns')">
        <p class="message">
          {{ $t('This feature is not implemented yet! Please take a look at') }}<br />
          <a href="#">https://github.com/DivanteLtd/vue-storefront/issues {{ $t('for our Roadmap!') }}</a>
        </p>
      </SfTab>
    </SfTabs>
  </div>
</template>

<script>
import UserOrder from '@vue-storefront/core/modules/order/components/UserOrdersHistory';
import { SfTabs, SfTable, SfButton } from "@storefront-ui/vue";

export default {
  name: "OMyAccountOrdersHistory",
  mixins: [UserOrder],
  components: {
    SfTabs,
    SfTable,
    SfButton
  },
  data() {
    return {
      tableHeaders: [
        "Order ID",
        "Order date",
        "Payment method",
        "Amount",
        "Status"
      ]
    };
  },
  computed: {
    orders () {
      let orders = []
      this.ordersHistory.forEach(item => {
        orders.push({
          'order_id': '#' + item.increment_id,
          'order_date': this.$options.filters.date(item.created_at),
          'payment_method:': item.payment.additional_information[0],
          'amount': this.$options.filters.price(item.grand_total),
          'status': this.$options.filters.capitalize(item.status)
        })
      })
      return orders
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.message {
  margin: 0 0 $spacer-extra-big 0;
  font-size: $font-size-regular-mobile;
  font-family: $body-font-family-primary;
  font-weight: $body-font-weight-primary;
  line-height: 1.6;
  @include for-desktop {
    font-size: $font-size-regular-desktop;
  }
}
.no-orders {
  &__title,
  &__content {
    font-family: $body-font-family-secondary;
    font-size: $font-size-regular-mobile;
    line-height: 1.6;
    @include for-desktop {
      font-size: $font-size-regular-desktop;
    }
  }
  &__title {
    margin: 0 0 $spacer-big 0;
    font-weight: 500;
  }
  &__content {
    margin: 0 0 $spacer-extra-big 0;
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
      margin: 0 -#{$spacer-big};
    }
    &__row:last-child {
      @include for-mobile {
        border-bottom: 0;
      }
    }
  }
}
</style>

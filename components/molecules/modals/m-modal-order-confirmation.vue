<template>
  <div class="m-modal-order-confirmation">
    <SfModal :visible="isVisible" @close="closeModal" class="order-confirmation">
      <SfHeading
        class="sf-heading--left"
        :title="$t('Confirm your order')"
        :subtitle="$t('Please confirm order you placed when you was offline')"
        :level="3"
      />
      <div v-for="(order, key) in modalData.payload" :key="key" class="order-confirmation__order">
        <SfHeading
          :level="3"
          :title="$t('Order #{id}', { id: key + 1 })"
          class="sf-heading--left order-confirmation__order-title"
        />
        <SfTable class="sf-table--bordered">
          <SfTableHeading>
            <SfTableHeader>{{ $t("Product Name") }}</SfTableHeader>
            <SfTableHeader class="table-center">
              {{ $t("Price") }}
            </SfTableHeader>
            <SfTableHeader class="table-center">
              {{ $t("Qty") }}
            </SfTableHeader>
            <SfTableHeader class="table-center">
              {{ $t("Subtotal") }}
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow
            v-for="(product, productKey) in order.products"
            :key="productKey"
          >
            <SfTableData>
              {{ product.name }}
              <span
                v-for="(option, optionKey) in product.options"
                :key="optionKey"
                class="order-confirmation__product-details"
              >
                <strong>{{ option.label }}: </strong> {{ option.value }}
              </span>
            </SfTableData>
            <SfTableData class="table-center">
              {{ product.price_incl_tax | price }}
            </SfTableData>
            <SfTableData class="table-center">
              {{ product.qty }}
            </SfTableData>
            <SfTableData class="table-center">
              {{ (product.price_incl_tax * product.qty) | price }}
            </SfTableData>
          </SfTableRow>
        </SfTable>
      </div>
      <div class="order-confirmation__buttons">
        <SfButton class="sf-button sf-button--text color-secondary" @click.native="cancelOrders">
          {{ $t("Cancel") }}
        </SfButton>
        <SfButton class="sf-button" @click.native="confirmOrders">
          {{ $t("Confirm your order") }}
        </SfButton>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { ConfirmOrders } from '@vue-storefront/core/modules/offline-order/components/ConfirmOrders';
import { CancelOrders } from '@vue-storefront/core/modules/offline-order/components/CancelOrders';
import { SfModal, SfHeading, SfButton, SfTable } from '@storefront-ui/vue';

export default {
  name: 'MModalOrderConfirmation',
  components: { SfModal, SfHeading, SfButton, SfTable },
  mixins: [ConfirmOrders, CancelOrders],
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  methods: {
    confirmOrders () {
      ConfirmOrders.methods.confirmOrders.call(this)
      this.closeModal();
    },
    cancelOrders () {
      CancelOrders.methods.cancelOrders.call(this)
      this.closeModal();
    },
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.order-confirmation {
  --_table-column-width: 4;
  &__order {
    margin-bottom: var(--spacer-xl);
    .sf-table__header {
      white-space: nowrap;
    }
    th, td {
      &.table-center {
        text-align: center;
      }
    }
    &-title {
      margin: var(--spacer-xl) 0 var(--spacer-lg) 0;
      .sf-heading__title {
        font-size: var(--font-base);
      }
    }
  }
  &__product-details {
    margin-top: var(--spacer-sm);
    font-size: var(--font-xs);
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
    .sf-button:not(:first-child) {
      margin-left: 1rem;
    }
  }
  @include for-desktop {
    --modal-width: 700px;
  }
}
</style>

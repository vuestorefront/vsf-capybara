<template>
  <div class="m-modal-order-confirmation">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading
        class="sf-heading--left"
        :title="$t('Confirm your order')"
        :subtitle="$t('Please confirm order you placed when you was offline')"
      />
      <div v-for="(order, key) in modalData.payload" :key="key" class="order-confirmation__order">
        <SfHeading
          level="3"
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
        <SfButton class="color-secondary" @click.native="cancelOrders()">
          {{ $t("Cancel") }}
        </SfButton>
        <SfButton @click.native="confirmOrders()">
          {{ $t("Confirm your order") }}
        </SfButton>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfHeading, SfButton, SfTable } from '@storefront-ui/vue';

export default {
  name: 'MModalOrderConfirmation',
  components: { SfModal, SfHeading, SfButton, SfTable },
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
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>

<style lang="scss" scoped>
.order-confirmation {
  &__order {
    margin-bottom: var(--spacer-big);
    .sf-table__header {
      white-space: nowrap;
    }
    th, td {
      padding: var(--spacer-small);
      &.table-center {
        text-align: center;
      }
    }
  }
  &__product-details {
    margin-top: var(--spacer-small);
    font-size: var(--font-size-extra-small);
  }
  &__buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>

<style lang="scss">
.m-modal-order-confirmation {
  .sf-modal__container {
    width: auto;
  }
  .order-confirmation__order-title {
    margin: var(--spacer-big) 0 var(--spacer-medium) 0;
    .sf-heading__title {
      font-size: var(--font-size-regular);
    }
  }
}
</style>

<template>
  <div class="o-order-review">
    <div class="highlighted">
      <SfHeading
        :title="$t('Order review')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <div class="highlighted__header">
        <h3 class="highlighted__title">
          {{ $t("Personal Details") }}
        </h3>
        <SfButton
          class="sf-button--text"
          @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
        >
          {{ $t("Edit") }}
        </SfButton>
      </div>
      <p class="content">
        {{ personalDetails.firstName }} {{ personalDetails.lastName }}
      </p>
      <p class="content">
        {{ personalDetails.emailAddress }}
      </p>
    </div>
    <div class="highlighted">
      <div class="highlighted__header">
        <h3 class="highlighted__title">
          {{ $t("Shipping") }}
        </h3>
        <SfButton
          class="sf-button--text"
          @click="$bus.$emit('checkout-before-edit', 'shipping')"
        >
          {{ $t("Edit") }}
        </SfButton>
      </div>
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
    <div class="highlighted">
      <div class="highlighted__header">
        <h3 class="highlighted__title">
          {{ $t("Payment") }}
        </h3>
        <SfButton
          class="sf-button--text"
          @click="$bus.$emit('checkout-before-edit', 'payment')"
        >
          {{ $t("Edit") }}
        </SfButton>
      </div>
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
    <div class="highlighted">
      <div class="highlighted__header">
        <h3 class="highlighted__title">
          {{ $t("Payment method") }}
        </h3>
        <SfButton
          class="sf-button--text"
          @click="$bus.$emit('checkout-before-edit', 'payment')"
        >
          {{ $t("Edit") }}
        </SfButton>
      </div>
      <p class="content">
        {{ paymentMethod }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfHeading, SfButton } from '@storefront-ui/vue';
export default {
  name: 'OOrderReview',
  components: {
    SfHeading,
    SfButton
  },
  computed: {
    ...mapGetters({
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
  }
};
</script>
<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: #f1f2f3;
  padding: var(--spacer-2xl);
  margin-bottom: var(--spacer-xl);
  &:last-child {
    margin-bottom: 0;
  }
  &--total {
    margin-bottom: 1px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacer-xl);
  }
  &__title {
    font-family: var(--font-family-primary);
    font-size: var(--font-lg);
    line-height: 1.6;
  }
}
.title {
  margin-bottom: var(--spacer-2xl);
}
.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);
  font-size: var(--font-xs);
  font-weight: 300;
  line-height: 1.6;
  &:last-child {
    margin: 0;
  }
  &__label {
    font-weight: 400;
  }
}
</style>

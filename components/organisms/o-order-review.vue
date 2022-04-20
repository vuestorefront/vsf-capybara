<template>
  <div class="o-order-review">
    <SfHeading
      :title="$t('Details')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />

    <div class="_section">
      <div class="review__header">
        <h3 class="review__title">
          {{ $t('Contact') }}
        </h3>

        <SfButton
          class="sf-button--text color-secondary"
          @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
        >
          {{ $t('Edit') }}
        </SfButton>
      </div>

      <p class="content">
        {{ personalDetails.firstName }} {{ personalDetails.lastName }}
      </p>

      <p class="content">
        {{ personalDetails.emailAddress }}
      </p>
    </div>

    <div class="_section">
      <div class="review__header">
        <h3 class="review__title">
          {{ $t('Shipping') }}
        </h3>

        <SfButton
          class="sf-button--text color-secondary"
          @click="$bus.$emit('checkout-before-edit', 'shipping')"
        >
          {{ $t('Edit') }}
        </SfButton>
      </div>

      <p class="content">
        <span class="content__label">
          {{ shippingMethod }}
        </span>

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

    <div class="_section">
      <div class="review__header">
        <h3 class="review__title">
          {{ $t('Billing address') }}
        </h3>

        <SfButton
          class="sf-button--text color-secondary"
          @click="$bus.$emit('checkout-before-edit', 'payment')"
        >
          {{ $t('Edit') }}
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
      personalDetails: 'checkout/getPersonalDetails'
    }),
    shippingMethod () {
      const shippingMethod = this.shippingMethods.find(
        method => this.shippingDetails.shippingMethod === method.method_code
      );
      return shippingMethod ? shippingMethod.method_title : '';
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  --heading-title-margin: 0 0 var(--spacer-lg) 0;
}

.review {
  box-sizing: border-box;
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    margin: 0 0 var(--spacer-xs);
    font: inherit;
  }
}

._section {
  margin-bottom: var(--spacer-base);

  &:last-child {
    margin-bottom: 0;
  }
}

.content {
  font-family: var(--font-family-primary);
  font-size: var(--font-xs);
  line-height: 1.45;
  font-weight: var(--font-light);
  margin: 0;
  color: var(--c-dark-variant);

  &__label {
    color: var(--c-text);
    font-weight: var(--font-normal);
    margin-bottom: var(--spacer-2xs);
  }
}
</style>

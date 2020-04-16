<template>
  <div class="o-order-review">
    <SfHeading
      :title="$t('Order review')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="review__header">
      <h3 class="review__title">
        {{ $t("Details") }}
      </h3>
      <SfButton
        class="sf-button--text color-secondary"
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
    <div class="review__header">
      <h3 class="review__title">
        {{ $t("Shipping") }}
      </h3>
      <SfButton
        class="sf-button--text color-secondary"
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
    <div class="review__header">
      <h3 class="review__title">
        {{ $t("Payment") }}
      </h3>
      <SfButton
        class="sf-button--text color-secondary"
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
    <div class="review__header">
      <h3 class="review__title">
        {{ $t("Payment method") }}
      </h3>
      <SfButton
        class="sf-button--text color-secondary"
        @click="$bus.$emit('checkout-before-edit', 'payment')"
      >
        {{ $t("Edit") }}
      </SfButton>
    </div>
    <p class="content">
      {{ paymentMethod }}
    </p>
    <div class="characteristics">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        color-icon="green-primary"
        class="characteristics__item"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfHeading, SfButton, SfCharacteristic } from '@storefront-ui/vue';
export default {
  name: 'OOrderReview',
  components: {
    SfHeading,
    SfButton,
    SfCharacteristic
  },
  data () {
    return {
      characteristics: [
        {
          title: this.$t('Safety'),
          description: this.$t('It carefully packaged with a personal touch'),
          icon: 'safety'
        },
        {
          title: this.$t('Easy shipping'),
          description: this.$t('You’ll receive dispatch confirmation and an arrival date'),
          icon: 'shipping'
        },
        {
          title: this.$t('Changed your mind?'),
          description: this.$t('Rest assured, we offer free returns within 30 days'),
          icon: 'return'
        }
      ]
    };
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
    h3 {
      font: inherit;
    }
  }
}
.characteristics {
  margin: var(--spacer-xl) 0 0 var(--spacer-xs);
  &__item {
    margin: var(--spacer-base) 0;
  }
}
.content {
  font-family: var(--font-family-primary);
  font-size: var(--font-xs);
  line-height: 1.6;
  font-weight: var(--font-light);
  margin: 0;
  color: var(--c-dark-variant);
  &__label {
    color: var(--c-text);
    font-weight: var(--font-normal);
  }
}
</style>

<template>
  <div class="gift-card-payment">
    <div class="_notice-message" v-if="showNoticeMessage">
      Gift Cards cannot be used to purchase Gift Card products
    </div>

    <template v-if="showContent">
      <SfCheckbox v-model="useGiftCard" class="_checkbox">
        <template #label>
          <span class="sf-checkbox__label">
            {{ $t('Use gift card to checkout') }}
          </span>
        </template>
      </SfCheckbox>

      <div class="_content" v-if="showForm || showAppliedGiftCards">
        <div class="_applied-gift-cards" v-if="showAppliedGiftCards">
          <MAppliedGiftCard
            class="_applied-gift-card"
            v-for="giftCard in appliedGiftCards"
            :key="giftCard.code"
            :gift-card-code="giftCard.code"
            :gift-card-value="giftCard.value"
          />
        </div>

        <validation-observer
          v-slot="{ passes }"
          tag="div"
          class="_form"
          v-if="showForm"
        >
          <validation-provider
            v-slot="{ errors }"
            mode="passive"
            name="giftCode"
            rules="required"
            ref="giftCardCodeValidator"
            slim
          >
            <div class="_form-field">
              <div class="_code-error" v-show="showCodeError">
                {{ codeError }}
              </div>

              <SfInput
                class="form__element form__element--half"
                name="giftCode"
                :label="$t('Gift card code')"
                :required="true"
                :valid="!errors.length"
                :error-message="errors[0]"
                :value="giftCardCode"
                @input="onGiftCardCodeChangeHandler"
              />
            </div>
          </validation-provider>

          <div class="_loader -gift-card" v-show="isSubmitting">
            <SfLoader class="_sf-loader" :loading="true" />
            <span class="_loader-text"> Adding Gift Card... </span>
          </div>

          <SfButton
            class="color-secondary _apply-button"
            :disabled="isSubmitting"
            @click.native="() => passes(() => onApplyGiftCardCode())"
          >
            {{ $t('Apply Gift Card') }}
          </SfButton>
        </validation-observer>

        <div class="_grand-total-notification" v-if="showGrandTotalNotification">
          <span> Your order’s grand total is now zero. You're all set! </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { SfInput, SfButton, SfCheckbox, SfLoader } from '@storefront-ui/vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

import GiftCardPayment from 'src/modules/gift-card/mixins/Payment';

import MAppliedGiftCard from 'theme/components/molecules/m-applied-gift-card.vue';

export default GiftCardPayment.extend({
  components: {
    MAppliedGiftCard,
    SfButton,
    SfCheckbox,
    SfInput,
    SfLoader,
    ValidationObserver,
    ValidationProvider
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.gift-card-payment {
  display: flex;
  flex-direction: column;

  ._notice-message {
    background-color: var(--c-warning-lighten);
    padding: var(--spacer-xs) var(--spacer-sm);
    position: relative;
    text-align: center;
    font-weight: 700;
    margin-bottom: var(--spacer-sm);
  }

  ._content {
    background-color: var(--c-white-darken);
    padding: var(--spacer-sm);
    margin-bottom: var(--spacer-sm);
  }

  ._applied-gift-cards + ._form {
    margin-top: var(--spacer-sm);
  }

  ._form {
    --input-label-font-size: var(--font-size-base);
  }

  .form__element {
    margin-bottom: var(--spacer-sm);
  }

  ._checkbox {
    margin-bottom: var(--spacer-sm);
    margin-left: var(--spacer-sm);
  }

  ._label {
    margin-bottom: var(--spacer-xs);
  }

  ._applied-gift-card {
    margin-bottom: var(--spacer-xs);
  }

  ._code-error {
    background-color: var(--c-warning);
    margin-bottom: var(--spacer-sm);
    padding: var(--spacer-xs) var(--spacer-sm);
    text-align: center;
  }

  ._grand-total-notification {
    background-color: var(--c-success);
    padding: var(--spacer-xs) var(--spacer-sm);
    font-size: var(--font-lg);
    text-align: center;

    span {
      vertical-align: sub;
    }
  }

  ._loader {
    --loader-overlay-background: rgba(255, 255, 255, 0);

    display: flex;
    align-items: center;

    ._sf-loader {
      width: 2em;
      height: 2em;
    }

    ._loader-text {
      margin-left: var(--spacer-sm);
      line-height: 100%;
    }

    &.-gift-card {
      margin-bottom: var(--spacer-base);
    }
  }

  @include for-desktop {
    ._content {
      margin-left: var(--spacer-xl);
    }
  }
}
</style>

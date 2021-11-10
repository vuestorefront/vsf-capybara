<template>
  <validation-observer
    v-slot="{ passes }"
    class="gift-card-order-form"
    tag="div"
  >
    <div class="_form-block -amount">
      <div class="_form-field" v-if="selectedTemplateId">
        <label> Select style: </label>

        <SfSelect
          v-model="selectedTemplateId"
          name="giftcard_template_id"
          class="_giftcard-template sf-select--underlined"
          :disabled="isDisabled"
        >
          <SfSelectOption
            v-for="template in giftCardTemplatesList"
            :key="template.id"
            :value="template.id"
          >
            {{ template.name }}
          </SfSelectOption>
        </SfSelect>
      </div>

      <validation-provider
        v-slot="{ errors, classes }"
        slim
        rules="required"
        name="Price Amount"
      >
        <div class="_form-field _price-amount-field" :class="classes">
          <label> Select value: </label>

          <SfSelect
            v-model="selectedPriceAmount"
            name="price_amount"
            class="_price-amount sf-select--underlined"
            :class="{ '-slim': isSelectedPriceAmountSlim }"
            :disabled="isDisabled"
            :valid="!errors.length"
            :error-message="errors[0]"
          >
            <SfSelectOption
              v-for="option in priceAmountOptionsList"
              :key="option.id"
              :value="option.id"
            >
              {{ option.value }}
            </SfSelectOption>
          </SfSelect>

          <validation-provider
            v-slot="{ errors }"
            slim
            rules="required"
            name="Price Amount"
            class="_custom-price-amount"
            v-if="showCustomPriceAmountInput"
          >
            <label class="_price-label">$</label>
            <SfInput
              name="custom_price_amount"
              v-model.number="customPriceAmount"
              :disabled="isDisabled"
              :required="true"
              :valid="!errors.length"
              :error-message="errors[0]"
            />
          </validation-provider>
        </div>
      </validation-provider>

      <SfCheckbox
        v-model="shouldSendFriend"
        class="_send-friend"
        :disabled="isDisabled"
      >
        <template #label>
          <span class="_checkbox-label"> Send Gift Card to friend </span>
        </template>
      </SfCheckbox>
    </div>

    <transition name="maxHeight">
      <div v-if="showSendFriendFields" class="_form-block">
        <div class="_form-field">
          <label> Sender name (optional): </label>

          <SfInput
            name="customer_name"
            v-model.trim="customerName"
            :disabled="isDisabled"
          />
        </div>

        <validation-provider
          v-slot="{ errors, classes }"
          rules="required"
          name="'Recipient Name'"
          slim
        >
          <div class="_form-field" :class="classes">
            <label>Recipient name:</label>

            <SfInput
              name="recipient_name"
              v-model.trim="recipientName"
              :required="true"
              :disabled="isDisabled"
              :valid="!errors.length"
              :error-message="errors[0]"
            />
          </div>
        </validation-provider>

        <validation-provider
          v-slot="{ errors, classes }"
          rules="required|email"
          name="'Recipient Email'"
          slim
          v-if="showRecipientEmailInput"
        >
          <div class="_form-field" :class="classes">
            <label>Recipient email address:</label>

            <SfInput
              name="recipient_email"
              v-model.trim="recipientEmail"
              :disabled="isDisabled"
              :required="true"
              :valid="!errors.length"
              :error-message="errors[0]"
            />
          </div>
        </validation-provider>

        <SfCheckbox
          v-model="shouldShipPhysically"
          class="_recipient-ship"
          :disabled="isDisabled"
        >
          <template #label>
            <span class="_checkbox-label">
              Have us send a physical card via post office
            </span>
          </template>
        </SfCheckbox>

        <div class="_ship-description" v-if="!showRecipientEmailInput">
          All physical gift cards in the same order will be sent to the same
          shipping address entered during checkout.
        </div>

        <div class="_custom-message-container">
          <label class="_label"> Custom message </label>

          <textarea
            class="_custom-message"
            name="custom_message"
            rows="4"
            v-model="customMessage"
            :disabled="isDisabled"
          />

          <span class="_characters-remaining">
            Characters Remaining: {{ charactersRemaining }}
          </span>
        </div>
      </div>
    </transition>

    <validation-provider
      v-slot="{ errors, classes }"
      tag="div"
      rules="required"
      class="_form-block"
    >
      <div class="_giftcard-preview" @click="$emit('show-preview')">
        Preview
      </div>

      <div class="_quantity" :class="classes">
        <label> Quantity: </label>

        <ACustomProductQuantity
          v-model="quantity"
          :disabled="isDisabled"
          class="_qty-container"
          ref="quantity-field-anchor"
        />

        <div class="_error-text">
          {{ errors[0] }}
        </div>
      </div>
    </validation-provider>

    <div class="_form-block">
      <SfButton
        class="_add-to-cart color-primary"
        type="submit"
        :disabled="isDisabled"
        @click="(event) => passes(() => submitForm())"
      >
        {{ $t("Add to Cart") }}
      </SfButton>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

import { SfCheckbox, SfButton, SfInput, SfSelect } from '@storefront-ui/vue';

import GiftCardOrderFormData from 'theme/components/interfaces/gift-card-order-form-data.interface';
import GiftCardTemplate from 'src/modules/gift-card/types/GiftCardTemplate.interface';

import ACustomProductQuantity from 'theme/components/atoms/a-custom-product-quantity.vue';

const maxCharactersRemaining = 240;

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

extend('email', {
  ...email,
  message: 'Please, provide the correct email address'
});

export default Vue.extend({
  name: 'OGiftCardOrderForm',
  components: {
    ACustomProductQuantity,
    SfButton,
    SfCheckbox,
    SfInput,
    SfSelect,
    ValidationObserver,
    ValidationProvider
  },
  props: {
    giftCardOrderFormData: {
      type: Object as PropType<GiftCardOrderFormData>,
      required: true
    },
    giftCardTemplatesList: {
      type: Array as PropType<GiftCardTemplate[]>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    charactersRemaining (): number {
      return maxCharactersRemaining - this.customMessage.length;
    },
    customerName: {
      get (): string {
        return this.giftCardOrderFormData.customerName;
      },
      set (value: string) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          customerName: value
        });
      }
    },
    customMessage: {
      get (): string {
        return this.giftCardOrderFormData.customMessage;
      },
      set (value: string) {
        if (value.length >= maxCharactersRemaining) {
          value = value.slice(0, maxCharactersRemaining);
        }

        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          customMessage: value
        });
      }
    },
    customPriceAmount: {
      get (): number {
        return this.giftCardOrderFormData.customPriceAmount;
      },
      set (value: number) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          customPriceAmount: value
        });
      }
    },
    isSelectedPriceAmountSlim () {
      return this.selectedPriceAmount === 0;
    },
    priceAmountOptionsList (): {
      id: number,
      value: string
    }[] {
      const options = [50, 100, 150, 200, 250].map((price) => ({
        id: price,
        value: `$${price} Petsies Gift Card`
      }));

      options.push({
        id: 0,
        value: 'Custom Amount'
      });

      return options;
    },
    recipientEmail: {
      get (): string {
        return this.giftCardOrderFormData.recipientEmail;
      },
      set (value: string) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          recipientEmail: value
        });
      }
    },
    recipientName: {
      get (): string {
        return this.giftCardOrderFormData.recipientName;
      },
      set (value: string) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          recipientName: value
        });
      }
    },
    selectedPriceAmount: {
      get (): number {
        return this.giftCardOrderFormData.priceAmount;
      },
      set (value: number) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          priceAmount: value
        });
      }
    },
    selectedTemplateId: {
      get (): number {
        return this.giftCardOrderFormData.selectedTemplateId || 0;
      },
      set (value: number) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          selectedTemplateId: value
        });
      }
    },
    shouldShipPhysically: {
      get (): boolean {
        return this.giftCardOrderFormData.shouldShipPhysically;
      },
      set (value: boolean) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          shouldShipPhysically: value
        });
      }
    },
    shouldSendFriend: {
      get (): boolean {
        return this.giftCardOrderFormData.shouldSendFriend;
      },
      set (value: boolean) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          shouldSendFriend: value
        });
      }
    },
    showCustomPriceAmountInput (): boolean {
      return this.selectedPriceAmount === 0;
    },
    showRecipientEmailInput (): boolean {
      return !this.shouldShipPhysically;
    },
    showSendFriendFields (): boolean {
      return this.shouldSendFriend;
    },
    quantity: {
      get (): number {
        return this.giftCardOrderFormData.qty;
      },
      set (value: number) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          qty: value
        });
      }
    }
  },
  methods: {
    submitForm () {
      this.$emit('submit-form');
    },
    updateGiftCardOrderFormData (giftCardOrderFormData: GiftCardOrderFormData) {
      this.$emit('update:giftCardOrderFormData', giftCardOrderFormData);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

$send-friend-block-max-height: 500px;

.gift-card-order-form {
  --input-font-size: var(--font-sm);
  --input-padding: 0.7em 0 0.4em;
  --input-error-message-font-size: var(--font-2xs);

  padding-top: var(--spacer-base);
  font-size: var(--font-sm);

  ._checkbox-label {
    padding-left: var(--spacer-sm);
    padding-top: var(--spacer-2xs);
  }

  ._form-block {
    padding: 0 var(--spacer-lg) var(--spacer-lg);

    &.-amount {
      padding-bottom: var(--spacer-base);
    }
  }

  ._price-amount-field {
    ._price-amount {
      &.-slim {
        --select-margin: 0;
      }

      ::v-deep {
        .sf-select__error-message {
          display: none;
        }
      }
    }
  }

  ._custom-price-amount {
    --input-padding: 9px 0;
    --input-height: 2em;

    margin-bottom: var(--spacer-base);
    display: flex;
    align-items: center;

    ._price-label {
      margin-right: var(--spacer-xs);
    }
  }

  ._recipient-ship {
    margin-bottom: var(--spacer-base);
  }

  ._custom-message-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    ._label {
      margin-bottom: var(--spacer-xs);
    }
  }

  ._custom-message {
    margin-bottom: var(--spacer-xs);
    box-sizing: border-box;
    border: 1px solid var(--c-light);
    width: 100%;
    padding: 0.5em;
    font-family: var(--font-family-primary);
    resize: none;
  }

  ._quantity {
    display: flex;
    flex-direction: column;
  }

  ._giftcard-preview {
    text-align: right;
    color: var(--c-link);
    display: none;
    cursor: pointer;
  }

  ._ship-description {
    margin-bottom: var(--spacer-base);
  }

  ::v-deep {
    .sf-select__selected {
      --product-option-font-size: var(--font-sm);
      --select-option-font-size: var(--font-sm);
    }
  }

  .maxHeight-enter-active,
  .maxHeight-leave-active {
    transition: max-height 0.3s linear;
    max-height: $send-friend-block-max-height;
    overflow: hidden;
  }

  .maxHeight-enter,
  .maxHeight-leave-to {
    max-height: 0;
    overflow: hidden;
  }

  @include for-desktop {
    ._giftcard-preview {
      display: block;
    }
  }
}
</style>

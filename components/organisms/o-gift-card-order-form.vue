<template>
  <validation-observer
    v-slot="{ passes }"
    class="gift-card-order-form"
    tag="div"
  >
    <validation-provider
      v-slot="{ errors, classes }"
      slim
      v-if="selectedTemplateId"
    >
      <div class="_form-field" :class="classes">
        <label> Select style: </label>

        <SfSelect
          v-model="selectedTemplateId"
          name="giftcard_template_id"
          class="_giftcard-template sf-select--underlined"
          :disabled="isDisabled"
          :valid="!errors.length"
          :error-message="errors[0]"
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
    </validation-provider>

    <validation-provider v-slot="{ errors, classes }" slim>
      <div class="_form-field _price-amount-field" :class="classes">
        <label> Select value: </label>

        <SfSelect
          v-model="selectedPriceAmount"
          name="price_amount"
          class="_price-amount sf-select--underlined"
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

        <div class="_custom-price-amount" v-if="showCustomPriceAmountInput">
          <label class="_price-label">$</label>
          <SfInput name="price_amount" v-model.number="customPriceAmount" />
        </div>
      </div>
    </validation-provider>

    <SfCheckbox v-model="shouldSendFriend" class="_send-friend">
      <template #label>
        <span class="_checkbox-label"> Send Gift Card to friend </span>
      </template>
    </SfCheckbox>

    <div v-if="showSendFriendFields" class="_send-friend-fields">
      <div class="_form-field">
        <label> Sender name (optional): </label>

        <SfInput name="customer_name" v-model.trim="customerName" />
      </div>

      <validation-provider v-slot="{ errors, classes }" slim>
        <div class="_form-field" :class="classes">
          <label>Recipient name:</label>

          <SfInput
            name="recipient_name"
            v-model.trim="recipientName"
            :valid="!errors.length"
            :error-message="errors[0]"
          />
        </div>
      </validation-provider>

      <validation-provider
        v-slot="{ errors, classes }"
        slim
        v-if="showRecipientEmailInput"
      >
        <div class="_form-field" :class="classes">
          <label>Recipient email address:</label>

          <SfInput
            name="recipient_email"
            v-model.trim="recipientEmail"
            :valid="!errors.length"
            :error-message="errors[0]"
          />
        </div>
      </validation-provider>

      <SfCheckbox v-model="shouldRecipientShip" class="_recipient-ship">
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
          v-model.trim="customMessage"
          :disabled="isDisabled"
        />

        <span class="_characters-remaining">
          Characters Remaining: {{ charactersRemaining }}
        </span>
      </div>
    </div>

    <validation-provider v-slot="{ errors, classes }">
      <div class="_quantity" :class="classes">
        <label> Quantity </label>

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

    <SfButton
      class="_add-to-cart color-primary"
      type="submit"
      :disabled="isDisabled"
      @click="(event) => passes(() => submitForm())"
    >
      {{ $t("Add to Cart") }}
    </SfButton>
  </validation-observer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import {
  SfCheckbox,
  SfHeading,
  SfButton,
  SfModal,
  SfInput,
  SfSelect
} from '@storefront-ui/vue';

import GiftCardOrderFormData from 'theme/components/interfaces/gift-card-order-form-data.interface';
import GiftCardTemplate from 'src/modules/gift-card/types/GiftCardTemplate.interface';

import ACustomProductQuantity from 'theme/components/atoms/a-custom-product-quantity.vue';

const maxCharactersRemaining = 240;

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
          return;
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
    shouldRecipientShip: {
      get (): boolean {
        return this.giftCardOrderFormData.shouldRecipientShip;
      },
      set (value: boolean) {
        this.updateGiftCardOrderFormData({
          ...this.giftCardOrderFormData,
          shouldRecipientShip: value
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
      return this.selectedPriceAmount === 0; // todo
    },
    showRecipientEmailInput (): boolean {
      return !this.shouldRecipientShip;
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
.gift-card-order-form {
  padding-top: var(--spacer-base);
  font-size: var(--font-sm);

  ._checkbox-label {
    padding-left: var(--spacer-sm);
  }

  ._price-amount-field {
    margin-bottom: var(--spacer-base);
  }

  ._custom-price-amount {
    --input-padding: 9px 0;
    --input-height: 2em;

    display: flex;
    align-items: center;

    ._price-label {
      margin-right: var(--spacer-xs);
    }
  }

  ._send-friend {
    margin-bottom: var(--spacer-base);
  }

  ._recipient-ship {
    margin-bottom: var(--spacer-base);
  }

  ._custom-message-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: var(--spacer-base);

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
    resize: vertical;
  }

  ._quantity {
    margin-bottom: var(--spacer-base);
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
}
</style>

<template>
  <div class="applied-gift-card">
    <div class="_code -open">
      GIFT-XXXX-XXXXXX (
    </div>

    <div class="_code-actions">
      <div
        class="_code-amount"
        v-show="!isAmountEditing"
        @click="onEditAmountClick"
      >
        ${{ giftCardValue }}
      </div>

      <SfInput
        class="_code-amount-input"
        name="giftCardValue"
        :disabled="isChangingValue"
        v-model="giftCardValueModel"
        v-show="isAmountEditing"
      />

      <div
        class="_amount-edit"
        @click="onEditAmountClick"
        :disabled="isChangingValue"
      >
        <SfIcon
          icon="check"
          size="xxs"
          :title="editLabel"
          v-show="!isChangingValue && isAmountEditing"
        />

        <SfIcon
          size="xxs"
          :title="editLabel"
          v-show="!isChangingValue && !isAmountEditing"
        >
          <div class="_edit-icon" />
        </SfIcon>

        <div class="_loader" v-show="isChangingValue">
          <SfLoader class="_sf-loader" :loading="true" />
        </div>
      </div>

      <div class="_code -close">
        )
      </div>

      <div
        class="_code-remove"
        @click="removeAppliedGiftCard"
        :disabled="isRemoving"
      >
        <SfIcon icon="cross" size="xxs" title="Remove" v-show="!isRemoving" />

        <div class="_loader" v-show="isRemoving">
          <SfLoader class="_sf-loader" :loading="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppliedGiftCard from 'src/modules/gift-card/mixins/AppliedGiftCard';

export default AppliedGiftCard.extend({});
</script>

<style lang="scss" scoped>
.applied-gift-card {
  font-size: var(--font-lg);
  display: flex;
  align-items: center;

  ._code {
    color: var(--c-success-variant);
    margin: 0 var(--spacer-xs);
    font-weight: var(--font-bold);
    height: 1.4em;
    line-height: 155%;

    &.-open {
      margin-left: 0;
    }
  }

  ._code-actions {
    display: flex;
    align-items: center;
  }

  ._code-remove,
  ._amount-edit,
  ._code-amount {
    cursor: pointer;
  }

  ._code-amount {
    color: var(--c-primary);
    font-weight: var(--font-bold);
    height: 1.4em;
    line-height: 155%;
  }

  ._code-amount-input {
    --input-padding: var(--spacer-2xs);
    --input-height: 1.4em;
    --input-width: 5em;
  }

  ._amount-edit {
    margin-left: var(--spacer-xs);
  }

  ._edit-icon {
    width: 100%;
    height: 100%;
    background: url("/assets/images/edit.svg");
  }

  ._loader {
    display: flex;
    align-items: center;

    ._sf-loader {
      width: 1em;
      height: 1em;
    }
  }
}
</style>

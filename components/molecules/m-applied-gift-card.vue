<template>
  <div class="applied-gift-card">
    <div class="_code -text">
      {{ maskedGiftCardCode }}
    </div>

    <div class="_code -open">
      (
    </div>

    <div class="_code-actions">
      <div
        class="_code-amount"
        v-show="!isAmountEditing"
        @click="startEdit"
      >
        ${{ giftCardValue }}
      </div>

      <SfInput
        class="_code-amount-input"
        :disabled="isSubmitting"
        v-model="newGiftCardValue"
        v-show="isAmountEditing"
      />

      <div
        class="_amount-edit"
        :disabled="isSubmitting"
      >
        <SfIcon
          icon="check"
          size="xxs"
          :title="editLabel"
          @click="changeAppliedGiftCardValue"
          v-show="!isSubmittingNewValue && isAmountEditing"
        />

        <SfIcon
          size="xxs"
          :title="editLabel"
          @click="startEdit"
          v-show="!isSubmittingNewValue && !isAmountEditing"
        >
          <div class="_edit-icon" />
        </SfIcon>

        <div class="_loader" v-show="isSubmittingNewValue">
          <SfLoader class="_sf-loader" :loading="true" />
        </div>
      </div>

      <div class="_code -close">
        )
      </div>

      <div
        class="_code-remove"
        @click="removeAppliedGiftCard"
        :disabled="isSubmitting"
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
import {
  SfInput,
  SfIcon,
  SfLoader
} from '@storefront-ui/vue';

import AppliedGiftCard from 'src/modules/gift-card/mixins/AppliedGiftCard';

export default AppliedGiftCard.extend({
  components: {
    SfIcon,
    SfInput,
    SfLoader
  }
});
</script>

<style lang="scss" scoped>
.applied-gift-card {
  font-size: var(--font-lg);
  display: flex;
  align-items: center;

  ._code {
    color: var(--c-success-variant);
    font-weight: var(--font-bold);
    height: 1.4em;
    line-height: 155%;

    &.-text {
      margin-right: var(--spacer-xs);
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &.-open {
      margin-right: var(--spacer-xs);
    }

    &.-close {
      margin: 0 var(--spacer-xs);
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

  ._code-amount-input,
  ._amount-edit,
  ._code-remove {
    &[disabled] {
      pointer-events: none;
      cursor: default;
      opacity: 0.7;
    }
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
    --loader-overlay-background: rgba(255, 255, 255, 0);

    display: flex;
    align-items: center;

    ._sf-loader {
      width: 1em;
      height: 1em;
    }
  }
}
</style>

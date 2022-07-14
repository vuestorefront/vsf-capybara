<template>
  <div class="m-subscription-form">
    <slot />

    <form @submit.prevent="onSubmitForm" class="_form" v-if="displayForm">
      <SfInput
        v-model="email"
        class="_input"
        :name="emailInputName"
        :label="$t('E-mail address')"
        :disabled="isSubmitting"
        :valid="!$v.email.$error"
        :error-message="validationError"
        @input="onEmailInput"
      />

      <MSpinnerButton :show-spinner="isSubmitting">
        {{ buttonText }}
      </MSpinnerButton>
    </form>

    <div class="_success-message" v-else>
      {{ successMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { required, email } from 'vuelidate/lib/validators';

import { SfInput } from '@storefront-ui/vue';
import Task from '@vue-storefront/core/lib/sync/types/Task';

import MSpinnerButton from 'theme/components/molecules/m-spinner-button.vue';

function serverErrorValidator (value: string, vm: any): boolean {
  return !vm.errorMessage;
}

export default Vue.extend({
  name: 'MSubscriptionForm',
  components: { SfInput, MSpinnerButton },
  props: {
    name: {
      type: String,
      default: 'newsletter-subscription-form'
    },
    buttonText: {
      type: String,
      default: function (): string {
        return this.$t('Join').toString()
      }
    },
    successMessage: {
      type: String,
      default: function (): string {
        return this.$t('Thank you for your subscription!').toString();
      }
    },
    subscribeAction: {
      type: Function as PropType<(email: string) => Promise<Task>>,
      required: true
    }
  },
  data () {
    return {
      email: '',
      errorMessage: '',
      isSuccessSubscribed: false,
      isSubmitting: false
    };
  },
  computed: {
    emailInputName (): string {
      return this.name + '-email-input';
    },
    displayForm (): boolean {
      return !this.isSuccessSubscribed;
    },
    validationError (): string {
      if (this.errorMessage) {
        return this.errorMessage;
      }

      return !this.$v.email.required
        ? this.$t('Field is required.').toString()
        : this.$t('Please provide valid e-mail address.').toString()
    }
  },
  methods: {
    onEmailInput (): void {
      this.errorMessage = '';
    },
    async onSubmitForm (): Promise<void> {
      this.$v.$touch();
      this.errorMessage = '';

      if (this.$v.$invalid) {
        return;
      }

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await this.subscribeAction(this.email);

        if (response.result.errorMessage) {
          this.errorMessage = response.result.errorMessage;
          return;
        }

        if (response.resultCode !== 200) {
          return;
        }

        this.isSuccessSubscribed = true;
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  validations: {
    email: {
      required,
      email,
      serverErrorValidator
    }
  }
});
</script>

<style lang="scss" scoped>
.m-subscription-form {
  --input-background: var(--_c-light-secondary);

  ._form {
    display: flex;
    align-items: flex-start;

    ._input {
      flex: 1;
    }
  }

  ::v-deep .sf-input {
    &__label {
      --input-label-font-size: var(--font-sm);
      --input-label-left: var(--spacer-xs);
    }

    input {
      --input-border: none;
      --input-font-size: var(--font-sm);
      --input-padding: var(--spacer-sm) 0 var(--spacer-xs) var(--spacer-xs);

      &:focus {
        & ~ * {
          --input-label-font-size: var(--font-2xs);
        }
      }
    }

    &--has-text,
    &--filled {
      .sf-input__label {
        --input-label-font-size: var(--font-2xs);
      }
    }
  }

  .m-spinner-button {
    margin-left: var(--spacer-base);
    --button-font-size: var(--font-xs);
    --button-padding: calc(var(--spacer-base) * 0.56) var(--spacer-base);
  }

  ._success-message {
    color: var(--c-text);
    margin-bottom: calc(var(--font-xs) * 1.2);
  }
}
</style>

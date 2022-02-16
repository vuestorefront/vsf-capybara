<template>
  <div class="m-newsletter-subscription">
    <slot />
    <form @submit.prevent="subscribe" class="_subscription-form">
      <SfInput
        v-model="email"
        :name="emailInputName"
        :label="$t('E-mail address')"
        :valid="!$v.email.$error"
        :error-message="
          !$v.email.required
            ? $t('Field is required.')
            : $t('Please provide valid e-mail address.')
        "
      />
      <SfButton class="color-primary">
        Join
      </SfButton>
    </form>
  </div>
</template>

<script lang="ts">
import { getResponseMessage } from '@vue-storefront/core/lib/sync/helpers'
import i18n from '@vue-storefront/i18n';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'MNewsletterSubscription',
  components: { SfInput, SfButton },
  props: {
    name: {
      type: String,
      default: 'newsletter-subscription-form'
    }
  },
  data (): Record<string, any> {
    return {
      email: ''
    };
  },
  computed: {
    emailInputName (): string {
      return this.name + '-email-input';
    }
  },
  methods: {
    subscribe (): void {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch('budsies/createNewsletterSubscription', {
        email: this.email
      }).then(res => {
        if (+res.resultCode !== 200) {
          return;
        }

        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t(getResponseMessage(res)),
          action1: { label: i18n.t('OK') }
        });
      })
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
};
</script>

<style lang="scss" scoped>
.m-newsletter-subscription {
  --input-background: var(--_c-light-secondary);
  ._subscription-form {
    display: flex;
    align-items: flex-start;
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
  .sf-button {
    margin-left: var(--spacer-base);
    --button-font-size: var(--font-xs);
    --button-padding: calc(var(--spacer-base) * 0.56) var(--spacer-base);
  }
}
</style>

<template>
  <div class="m-pets-birthday-form">
    <div class="_text" v-if="isShared">
      {{ $t('Your story has just been broadcast to the design team. Thank you very much for giving us the opportunity to be a part of your family.') }}
    </div>

    <validation-observer v-else tag="form" class="_form" v-slot="{ passes }">
      <p class="_text">
        {{ $t('Whether it makes us laugh, cry, or just gives us butterflies in our stomach... our team loves hearing the stories behind the plush. Sometimes, we handpick stories to share in our Spotlights or with the media.') }}
      </p>

      <validation-provider
        rules="required"
        class="_field"
        :name="$t('Story')"
        tag="div"
        v-slot="{ errors, classes }"
      >
        <textarea
          class="_story-textarea"
          :class="classes"
          v-model="story"
          :disabled="isDisabled"
          :required="true"
          :valid="!errors.length"
        />

        <div class="_error-text">
          {{ errors[0] }}
        </div>
      </validation-provider>

      <div class="_button-container">
        <SfButton
          class="_share-button color-secondary"
          type="submit"
          :disabled="isDisabled"
          @click.prevent="() => passes(() => onSubmit())"
        >
          {{ $t('Share with Petsies') }}
        </SfButton>
      </div>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import get from 'lodash-es/get';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Vue from 'vue'
import { mapState } from 'vuex';
import { SfButton } from '@storefront-ui/vue';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'MPetSpecialStoryForm',
  components: {
    SfButton,
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      story: '' as string,
      isDisabled: false,
      isShared: false
    }
  },
  computed: {
    ...mapState({
      lastOrderConfirmation: (state: any) => get(state, 'order.last_order_confirmation.confirmation') || {}
    })
  },
  methods: {
    async onSubmit () {
      if (this.isDisabled) {
        return;
      }

      this.isDisabled = true;
      try {
        await this.$store.dispatch('budsies/shareCustomerStory', {
          customerStoryText: this.story,
          orderId: this.lastOrderConfirmation.magentoOrderId
        });

        this.isShared = true;
      } catch (error) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({
            type: 'danger',
            message: (this.$t('Something went wrong') as string),
            timeToLive: 10 * 1000
          }),
          { root: true }
        );
      } finally {
        this.isDisabled = false;
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-pet-special-story-form {
  ._text {
    text-align: center;
  }

  ._field {
    margin-bottom: var(--spacer-sm);
  }

  ._story-textarea {
    box-sizing: border-box;
    border: 1px solid var(--c-light);
    width: 100%;
    padding: 0.5em;
    font-family: var(--font-family-primary);
    resize: vertical;
    overflow: hidden;
    min-height: 75px;

    &:focus-visible {
      outline: var(--c-primary-lighten) auto 1px;
    }

    &.invalid {
      border-color: var(--c-danger);
      outline: none;
    }
  }

  ._button-container {
    display: flex;
    justify-content: center;
  }

  ._error-text {
    font-size: var(--font-xs);
    margin-top: 0.5em;
    color: var(--c-danger);
  }

  @include for-desktop {
    ._text {
      text-align: start;
    }

    ._button-container {
      justify-content: flex-end;
    }
  }
}
</style>

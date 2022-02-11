<template>
  <div
    class="sf-dongler-book"
    :class="cssClasses"
    :style="styles"
  >
    <SfHeading
      :level="2"
      :title="$t('Receive a Free Drawing & Storybook')"
    />

    <div class="_sub-title">
      A digital copy of our exclusive children's book "Dongler's Dinner Quest"!
    </div>

    <form @submit.prevent="onSubmit" class="_form" v-show="!isSubmitted">
      <div class="_email-row">
        <SfInput
          v-model="email"
          name="email"
          type="email"
          :label="$t('Email:')"
          :required="true"
          :disabled="isSubmitting"
          :valid="!$v.email.$error"
          :error-message="
            !$v.email.required
              ? $t('Field is required.')
              : $t('Please provide valid e-mail address.')
          "
        />
      </div>

      <div class="sf-input__error-message" v-show="isSubmittedWthError">
        <div>Something went wrong... Please, try again or contact the support.</div>
      </div>

      <div class="_button-row">
        <SfButton
          class="_button color-secondary"
          :disabled="isSubmitting"
        >
          {{ itemData.button_text }}
        </SfButton>
      </div>

      <div class="_description">
        {{ $t("We'll send you a digital copy of the coloring book via email for you to download when ready!") }}
      </div>
    </form>

    <div v-show="isSubmitted">
      <p>
        <strong>
          {{ $t("Success! Your storybook is on it's way") }}
        </strong>
      </p>

      <div class="_description">
        {{ $t("Enjoy over 25 beautifully illustrated color pages, where your child’s drawings will help Dongler get home in time for dinner!") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SfHeading, SfInput, SfButton } from '@storefront-ui/vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { required, email } from 'vuelidate/lib/validators';

import { DonglerBookService } from 'src/modules/dongler-book';

import DonglerBookData from './interfaces/dongler-book-data.interface';

export default Blok.extend({
  name: 'StoryblokDonglerBook',
  components: {
    SfHeading,
    SfInput,
    SfButton
  },
  data () {
    return {
      isSubmitting: false,
      isSubmittedWthError: false,
      email: '',
      isSubmitted: false
    };
  },
  computed: {
    itemData (): DonglerBookData {
      return this.item as DonglerBookData;
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await DonglerBookService.requestBook(this.email);

        if (response.result !== true) {
          throw new Error(response.result);
        }

        this.isSubmitted = true;
        this.email = '';
        this.$v.$reset();
      } catch (error) {
        console.error(error);
        this.isSubmittedWthError = true;
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.sf-dongler-book {
  padding: 1em;
  text-align: center;

  ._form {
    ._email-row {
      max-width: 25em;
      margin-top: 1em;
      margin-left: auto;
      margin-right: auto;
      text-align: left;
    }

    ._button-row {
      margin-top: 1em;
    }

    ._button {
      display: inline-block;
    }
  }

  ._description {
    display: inline-block;
    margin-top: 0.5em;
    width: 100%;
  }

  &.-editor-preview-mode {
    ._button-row {
      pointer-events: none
    }
  }

  @include for-desktop {
    ._description {
      width: 50%;
    }
  }

  @include display-property-handling;
}
</style>

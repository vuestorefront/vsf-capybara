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
    <form @submit.prevent="onSubmit" class="_form">
      <div class="_sub-title">
        A digital copy of our exclusive children’s book “Dongler’s Dinner Quest”!
        <div class="_email-row">
          <SfInput
            v-model="email"
            name="email"
            :label="$t('Email:')"
            :required="true"
            :valid="!$v.email.$error"
            :error-message="
              !$v.email.required
                ? $t('Field is required.')
                : $t('Please provide valid e-mail address.')
            "
          />
        </div>
        <div class="_button-row">
          <SfButton
            class="color-secondary"
          >
            {{ item.dongler_book_btn_text }}
          </SfButton>
        </div>
      </div>
      <div class="_description">
        {{ $t("We’ll send you a digital copy of the coloring book via email for you to download when ready!") }}
      </div>
    </form>
    <div v-show="isShowSuccessMessage">
      <p>
        <strong>
          {{ $t("Success! Your storybook is on it’s way") }}
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

import config from 'config'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import { processURLAddress } from '@vue-storefront/core/helpers'

export default Blok.extend({
  name: 'StoryblokDonglerBook',
  components: {
    SfHeading,
    SfInput,
    SfButton
  },
  data () {
    return {
      email: '',
      fIsShowSuccessMessage: false
    };
  },
  computed: {
    isShowSuccessMessage: {
      set: function (isShow: boolean) {
        this.fIsShowSuccessMessage = isShow;
      },
      get: function (): boolean {
        return this.fIsShowSuccessMessage;
      }
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      const url = processURLAddress(`${config.budsies.endpoint}/dongler-book-requests`);

      const result = await TaskQueue.execute({
        url: url,
        payload: {
          headers: { 'Content-type': 'application/json' },
          mode: 'cors',
          method: 'POST',
          body: JSON.stringify({ email: this.email })
        },
        silent: true
      }).then(response => {
        if (response.result === true) {
          this.isShowSuccessMessage = true;
          this.email = '';
          this.$v.$reset();
        } else {
          console.error(response.result);
        }
      }).catch(error => {
        console.error(error);
      })
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

.sf-dongler-book {
  padding: 1em;
  text-align: center;

  ._form {
    ._email-row {
      margin-top: 1em;
    }

    ._button-row {
      display: inline-block;
    }
  }

  ._description {
    display: inline-block;
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
}
</style>

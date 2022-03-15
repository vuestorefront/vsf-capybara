<template>
  <div class="o-order-success">
    <SfHeading
      class="_main-title"
      :title="$t('Order Complete')"
      :level="1"
    />
    <SfHeading
      class="_main-subtitle"
      :title="$t('Thank you for placing your Petsies order.')"
      :level="3"
    />
    <SfHeading
      :level="4"
    >
      <template #title>
        <h4 class="sf-heading__title sf-heading__title--h4">
          {{ $t('Please feel free to email') }}
          <a href="mailto:support@mypetsies.com">support@mypetsies.com</a>
          {{ $t('if you have any questions.') }}
        </h4>
      </template>
    </SfHeading>

    <p class="_confirmation">
      {{ $t('You\'ll receive a confirmation email with your order number shortly!') }}
    </p>

    <div class="_content">
      <div class="_left">
        <img class="_success-icon" src="/assets/images/success-icon.jpg" alt="">
      </div>

      <div class="_right">
        <div class="_section">
          <div class="_title">
            <div class="_number">
              1
            </div>

            <SfHeading
              :title="$t('Get special birthday savings for your pet(s) (optional)')"
              :level="3"
            />
          </div>

          <MPetsBirthdayForm class="_section_content" />
        </div>

        <div class="_section">
          <div class="_title">
            <div class="_number">
              2
            </div>

            <SfHeading
              :title="$t('Does your pet have a special story?')"
              :level="3"
            />
          </div>

          <m-pet-special-story-form class="m-pet-special-story-form _section_content" />
        </div>

        <div class="_section">
          <div class="_title">
            <div class="_number">
              3
            </div>

            <SfHeading
              :title="$t('Are you a trendsetter?')"
              :level="3"
            />
          </div>

          <div class="_sharing-content _section_content">
            <p class="_text">
              {{ $t('Let your friends know about Petsies so they can make their own amazing custom plushies.') }}
            </p>

            <m-social-sharing
              :sharing-url="sharingData.sharingUrl"
              :sharing-description="sharingData.sharingDescription"
              :e-mail-subject="sharingData.eMailSubject"
              :twitter-description="sharingData.twitterDescription"
              :image="sharingData.image"
            />

            <p class="_text -small">
              {{ $t('Clicking link will open new tab where you can customize your message.') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { SfHeading } from '@storefront-ui/vue';

import MSocialSharing from 'theme/components/molecules/m-social-sharing.vue';

import MPetSpecialStoryForm from './OOrderSuccess/m-pet-special-story-form.vue';
import MPetsBirthdayForm from './OOrderSuccess/m-pets-birthday-form.vue';
import { InjectType } from 'src/modules/shared';

interface NonReactiveState {
  sharingData: {
    sharingUrl: string,
    sharingDescription: string,
    eMailSubject: string,
    twitterDescription: string,
    image: string
  }
}

interface InjectedServices {
  window: Window
}

export default (Vue as VueConstructor<Vue & NonReactiveState & InjectedServices>).extend({
  name: 'OOrderSuccess',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  components: {
    MPetSpecialStoryForm,
    MPetsBirthdayForm,
    MSocialSharing,
    SfHeading
  },
  created () {
    const baseUrl = this.window.location ? `${this.window.location.protocol}//${this.window.location.host}` : ''
    this.sharingData = {
      sharingUrl: baseUrl,
      sharingDescription: `${this.$t('Woah! @Petsies makes a custom plush lookalike of your pet (just send them a photo!). Check out')} ${baseUrl}`,
      eMailSubject: this.$t('Check out Petsies - they make a custom plush lookalike of your pet!') as string,
      twitterDescription: this.$t('Now you can get a custom plush lookalike of your pet from @PetsiesOfficial. Check it out! https://t.co/YxtXW7CYJQ') as string,
      image: 'http://pbs.twimg.com/media/CqFVJ8bVYAI2fK0.jpg'
    };
  },
  destroyed () {
    this.$store.dispatch('checkout/setThankYouPage', false);
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

$number-size: 50px;
$number-margin-right-desktop: var(--spacer-sm);

.o-order-success {
  ._main-title {
    margin-bottom: var(--spacer-lg);
  }

  ._main-subtitle {
    margin-bottom: var(--spacer-base);
  }

  ._confirmation {
    color: var(--c-danger-variant);
    text-align: center;
    font-size: var(--font-base);
    margin-top: var(--spacer-base);
  }

  ._content {
    display: flex;
    flex-direction: column;

    ._left {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacer-xl);
    }
  }

  ._success-icon {
    max-width: 100%;
  }

  ._section {
    padding: 0 var(--spacer-sm);
    margin-bottom: var(--spacer-xl);

    &:last-child {
      margin-bottom: 0;
    }

    ._title {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    ._number {
      flex-shrink: 0;
      background: var(--c-primary);
      border-radius: 25px;
      color: var(--c-white);
      display: inline-block;
      font-size: var(--font-xl);
      height: $number-size;
      line-height: $number-size;
      text-align: center;
      vertical-align: top;
      width: $number-size;
      margin-bottom: var(--spacer-base);
    }
  }

  ._sharing-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ._text {
    text-align: center;

    &.-small {
      font-size: var(--font-sm);
    }
  }

  @include for-desktop {
    ._content {
      flex-direction: row;

      ._left {
        align-items: start;
        flex: 2;
        margin-bottom: 0;
      }

      ._right {
        flex: 3;
      }
    }

    ._section {
      ._title {
        flex-direction: row;

        .sf-heading {
          --heading-text-align: start;
        }
      }

      ._number {
        margin-bottom: 0;
        margin-right: $number-margin-right-desktop;
      }

      ._section_content {
        padding-left: calc(#{$number-size} + #{$number-margin-right-desktop});
      }

      &:first-child {
        margin-top: 3rem;
      }
    }

    ._sharing-content {
      align-items: flex-start;
    }

    ._text {
      text-align: start;
    }
  }
}
</style>

<template>
  <div class="m-pets-birthday-form">
    <validation-observer slim v-slot="{ passes }">
      <div class="_birthday-added" v-if="isBirthdayAdded">
        <p class="_thank-you">
          {{ $t('Thank You') }}
        </p>

        <SfButton
          class="color-secondary"
          type="button"
          @click.prevent="() => isBirthdayAdded = false"
        >
          {{ $t('Add another pet') }}
        </SfButton>
      </div>

      <form class="_form" v-else>
        <p class="_text">
          {{ $t('Enter your pet\'s birthday so we can send you a special gift') }}
        </p>

        <div class="_fields">
          <validation-provider
            rules="required"
            :name="$t('Pet\'s name')"
            tag="div"
            class="_field -input"
            v-slot="{ errors }"
          >
            <SfInput
              class="_input"
              name="petName"
              :required="true"
              v-model="name"
              :valid="!errors.length"
              :error-message="errors[0]"
              :disabled="isDisabled"
              :label="$t('Pet\'s name')"
            />
          </validation-provider>

          <validation-provider
            rules="required-short"
            :name="$t('Month')"
            tag="div"
            class="_field -select"
            v-slot="{ errors, classes }"
          >
            <SfSelect
              v-model="birthMonth"
              :required="true"
              :disabled="isDisabled"
              class="_select sf-select--underlined"
              :class="classes"
            >
              <SfSelectOption value="">
                {{ $t('MM') }}
              </SfSelectOption>

              <SfSelectOption
                v-for="monthItem in monthsOptions"
                :key="monthItem.title"
                :value="monthItem.value"
              >
                {{ monthItem.title }}
              </SfSelectOption>
            </SfSelect>

            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>

          <validation-provider
            rules="required-short"
            :name="$t('Day')"
            tag="div"
            class="_field -select"
            v-slot="{ errors, classes }"
          >
            <SfSelect
              v-model="birthDay"
              :required="true"
              :disabled="isDisabled"
              class="_select sf-select--underlined"
              :class="classes"
            >
              <SfSelectOption value="">
                {{ $t('DD') }}
              </SfSelectOption>

              <SfSelectOption
                v-for="dayItem in daysOptions"
                :key="dayItem.title"
                :value="dayItem.value"
              >
                {{ dayItem.title }}
              </SfSelectOption>
            </SfSelect>

            <div class="_error-text">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="_button-container">
          <SfButton
            class="_submit-button color-secondary"
            type="submit"
            :disabled="isDisabled"
            @click.prevent="() => passes(() => onSubmit())"
          >
            {{ $t('Add Pet') }}
          </SfButton>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Vue, { VueConstructor } from 'vue'
import { mapState } from 'vuex';
import { SfButton, SfInput, SfSelect } from '@storefront-ui/vue';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

extend('required-short', {
  ...required,
  message: 'Field is required'
});

function getOptionsList (length: number): OptionItem[] {
  return Array.from({ length }, (_, i) => {
    const item = i + 1;

    return {
      value: item,
      title: item >= 10 ? item.toString(10) : `0${item}`
    }
  })
}

const monthsOptions = getOptionsList(12);
const daysOptions = getOptionsList(31);

interface OptionItem {
  value: number,
  title: string
}

interface NonReactiveData {
  monthsOptions: OptionItem[],
  daysOptions: OptionItem[]
}

export default (Vue as VueConstructor<Vue & NonReactiveData>).extend({
  name: 'MPetsBirthdayForm',
  components: {
    SfButton,
    SfInput,
    SfSelect,
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      name: '',
      birthMonth: undefined as number | undefined,
      birthDay: undefined as number | undefined,
      isDisabled: false,
      isBirthdayAdded: false
    }
  },
  computed: {
    ...mapState({
      customerEmail: (state: any) => state.checkout.personalDetails.emailAddress
    })
  },
  created () {
    this.monthsOptions = monthsOptions;
    this.daysOptions = daysOptions;
  },
  methods: {
    clearForm () {
      this.name = '';
      this.birthMonth = undefined;
      this.birthDay = undefined;
    },
    async onSubmit () {
      if (this.isDisabled) {
        return;
      }

      this.isDisabled = true;
      try {
        await this.$store.dispatch('budsies/sharePetBirthday', {
          name: this.name,
          birthMonth: this.birthMonth,
          birthDay: this.birthDay,
          email: this.customerEmail
        });

        this.isBirthdayAdded = true;
        this.clearForm();
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

.m-pets-birthday-form {
  ._text {
    text-align: center;
  }

  ._form {
    display: flex;
    flex-direction: column;
  }

  ._fields {
    display: flex;
    margin-bottom: var(--spacer-sm);
  }

  ._field {
    margin-right: var(--spacer-sm);

    &:last-child {
      margin-right: 0;
    }

    &.-input {
      flex: 1;
    }

    &.-select {
      width: 22%;
    }
  }

  ._input {
    ::v-deep {
      input {
        height: auto;
        line-height: 1.2;
      }
    }
  }

  ._select {
    padding: 0;

    &.invalid {
      --select-border-color: var(--c-danger);
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

  ._birthday-added {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--spacer-sm);

    ._thank-you {
      margin-bottom: var(--spacer-sm);
    }
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

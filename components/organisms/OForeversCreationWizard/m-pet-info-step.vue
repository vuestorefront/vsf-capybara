<template>
  <validation-observer
    v-slot="{ passes }"
    class="forevers-wizard-pet-info-step"
    tag="div"
    ref="validation-observer"
  >
    <SfHeading
      class="_step-title -required "
      :level="2"
      :title="$t('Pet Info')"
    />

    <div class="_fields">
      <validation-provider
        v-slot="{ errors }"
        class="_field"
        rules="required"
        :name="$t('Pet Name')"
        tag="div"
      >
        <label>
          {{ $t('Your Pet\'s Name') }}
        </label>

        <SfInput
          name="name"
          v-model="name"
          :placeholder="$t('Name')"
          :disabled="disabled"
          :required="false"
          :valid="!errors.length"
          :error-message="errors[0]"
        />
      </validation-provider>

      <div class="_field" v-show="showBreedStep">
        <label>
          {{ $t('Your Pet\'s Breed') }}
        </label>

        <MMultiselect
          v-model.trim="breed"
          class="form__element form__select"
          name="petsie_breed"
          placeholder="Golden Retriever, Labradoodle, etc."
          :options="breedsList"
          :required="false"
          :allow-free-text="true"
          :disabled="disabled"
        />

        <div class="_helper-text">
          {{ $t('Optional. Leave blank if unsure') }} <br>
          ({{ $t('or make up your own') }} :)
        </div>
      </div>

      <validation-provider
        v-slot="{ errors }"
        class="_field"
        rules="required|email"
        :name="$t('Email')"
        tag="div"
        v-show="showEmailStep"
      >
        <label>
          {{ $t('Enter your email address') }}
        </label>

        <SfInput
          name="email"
          v-model.trim="email"
          placeholder="sample@email.com"
          :disabled="disabled"
          :required="false"
          :valid="!errors.length"
          :error-message="errors[0]"
        />
      </validation-provider>
    </div>

    <SfButton
      class="_button"
      :disabled="disabled"
      @click="(event) => passes(() => submitStep())"
    >
      {{ $t('Continue') }}
    </SfButton>
  </validation-observer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

import ForeversWizardEvents from 'src/modules/shared/types/forevers-wizard-events';

import { SfHeading, SfButton, SfInput } from '@storefront-ui/vue';

import MMultiselect from '../../molecules/m-multiselect.vue';

import ForeversWizardPetInfoStepData from '../../interfaces/forevers-wizard-pet-info-step-data.interface';
import Product from 'core/modules/catalog/types/Product';
import { ProductId } from 'src/modules/budsies';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

extend('email', {
  ...email,
  message: 'Please, provide the correct email address'
});

export default Vue.extend({
  name: 'MPetInfoStep',
  components: {
    SfHeading,
    SfButton,
    SfInput,
    MMultiselect,
    ValidationObserver,
    ValidationProvider
  },
  props: {
    value: {
      type: Object as PropType<ForeversWizardPetInfoStepData>,
      default: () => ({
        name: undefined,
        breed: undefined,
        email: undefined
      })
    },
    plushieId: {
      type: Number,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showEmailStep: true
    }
  },
  computed: {
    breed: {
      get (): string | undefined {
        return this.value.breed;
      },
      set (value: string): void {
        const newValue: ForeversWizardPetInfoStepData = { ...this.value, breed: value };
        this.$emit('input', newValue);
      }
    },
    name: {
      get (): string | undefined {
        return this.value.name;
      },
      set (value: string): void {
        const newValue: ForeversWizardPetInfoStepData = { ...this.value, name: value };
        this.$emit('input', newValue);
      }
    },
    email: {
      get (): string | undefined {
        return this.value.email;
      },
      set (value: string): void {
        const newValue: ForeversWizardPetInfoStepData = { ...this.value, email: value };
        this.$emit('input', newValue);
      }
    },
    breedsList (): string[] {
      return this.$store.getters['budsies/getPlushieBreeds'];
    },
    showBreedStep (): boolean {
      switch (this.product.id) {
        case ProductId.FOREVERS_DOG:
          return true;
        default:
          return false;
      }
    }
  },
  methods: {
    prefillEmail (): void {
      const customerEmail = this.$store.getters['budsies/getPrefilledCustomerEmail'];
      if (customerEmail) {
        this.email = customerEmail;
        this.showEmailStep = false;
      }
    },
    clearBreed (): void {
      this.breed = undefined;
    },
    submitStep (): void {
      EventBus.$emit(ForeversWizardEvents.INFO_FILL);
      this.$emit('next-step');
    }
  },
  beforeMount () {
    this.$bus.$once('budsies-store-synchronized', this.prefillEmail);
  },
  beforeDestroy () {
    this.$bus.$off('budsies-store-synchronized', this.prefillEmail);
  },
  created (): void {
    this.prefillEmail();
    if (!this.showBreedStep) {
      this.$nextTick().then(this.clearBreed);
    }
  }
});

</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.forevers-wizard-pet-info-step {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  ._fields {
    margin-top: var(--spacer-xl);
  }

  ._field + ._field {
    margin-top: var(--spacer-base);
  }

  ._field {
    label {
      font-size: var(--font-xl);
    }
  }

  ._helper-text {
    font-size: var(--font-xs);
  }

  ._button {
    margin-top: var(--spacer-2xl);
  }

  @media (min-width: $tablet-min) {
    min-width: 30em;
  }
}
</style>

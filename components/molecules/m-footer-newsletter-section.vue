<template>
  <div class="d-flex newsletter overflow-y">
    <div class="content_left">
      <img :src="'/assets/images/capitools_newsletter_block.png'" class="payment_image_size">
    </div>
    <div class="content_right">
      <p>
         <b>Newsletter subscription</b>
      </p>
      <p>
        Sign Up for Tips, Reviews & Special Offers
      </p> 
        <form @submit.prevent="subscribeExtend" class="form">
          <div class="d-flex align-start">
            <template>
              <SfInput
              v-model="email"
              name="email"  
              :valid="!$v.email.$error"
              :placeholder="placeholder"
              :error-message="
                !$v.email.required
                  ? $t('Field is required.')
                  : $t('Please provide valid e-mail address.')
              "
              class="form__element"
            /> 
            <SfButton class="btn-primary">
              {{ $t("Register") }}
            </SfButton>
            </template>
          </div>
        </form>  
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'; 
import Subscribe from '@vue-storefront/core/modules/newsletter/mixins/Subscribe'
import { required, email } from 'vuelidate/lib/validators';
import { SfInput,  SfButton } from "@storefront-ui/vue"; 
export default {
  mixins: [Subscribe],
  components: {
    SfInput, SfButton
  },
  data() {
    return {
      value: "",
      type: "email",
      name: "Enter your email",
      errorMessage: "Required.",
      valid: true,
      placeholder: "Enter your email",
      email: ''
    };
  },
  methods: {
    subscribeExtend () {
      this.$v.$touch();
      if (this.$v.$invalid) return
      this.subscribe(this.onSuccesfulSubmission)
    },
    onSuccesfulSubmission (isSubscribed) {
      if (isSubscribed) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('You have been successfully subscribed to our newsletter!'),
          action1: { label: i18n.t('OK') }
        })
      } 
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
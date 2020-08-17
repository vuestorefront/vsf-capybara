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
      <div class="d-flex align-start">
        <template>
          <SfInput
              v-model="value"
              :type="type"
              :label="label"
              :name="name"
              :valid="valid"
              :error-message="errorMessage"
              :class="customClass"
              :placeholder="placeholder"
            />
          <SfButton 
            class="btn-primary"
            :native-button="nativeButton"
            :link="link"
          >
            S'inscrire
          </SfButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { SfInput } from "@storefront-ui/vue";
import { SfButton } from "@storefront-ui/vue";
export default {
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
    };
  },
};
</script>
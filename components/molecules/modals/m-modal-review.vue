<template>
  <div class="m-modal-review modal-content">
    <SfModal :visible="isVisible" @close="closeModal">
      <form @submit.prevent="submit" class="form">
        <SfInput
          v-model="formData.name"
          name="firstName"
          :label="$t('First name')"
          :required="true"
          :valid="!$v.formData.name.$error"
          :error-message="
            !$v.formData.name.required
              ? $t('Field is required.')
              : $t('Name must have at least 2 letters.')
          "
          class="form__element"
        />
        <SfInput
          v-model="formData.email"
          name="email"
          :label="$t('Email address')"
          :required="true"
          :valid="!$v.formData.email.$error"
          :error-message="
            !$v.formData.email.required
              ? $t('Field is required.')
              : $t('Please provide valid e-mail address.')
          "
          class="form__element"
        />
        <SfInput
          v-model="formData.summary"
          name="summary"
          :label="$t('Summary')"
          :required="true"
          :valid="!$v.formData.summary.$error"
          :error-message="$t('Field is required.')"
          class="form__element"
        />
        <SfInput
          v-model="formData.review"
          name="reviewText"
          :label="$t('Review')"
          :required="true"
          :valid="!$v.formData.review.$error"
          :error-message="$t('Field is required.')"
          class="form__element"
        />
        <SfButton class="sf-button--full-width form__submit">
          {{ $t("Add review") }}
        </SfButton>
      </form>
    </SfModal>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';
import { SfModal, SfInput, SfButton } from '@storefront-ui/vue';

export default {
  name: 'MModalReview',
  components: { SfModal, SfInput, SfButton },
  data () {
    return {
      formData: {
        name: '',
        email: '',
        summary: '',
        review: ''
      }
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.current;
    }
  },
  mounted () {
    this.fillInUserData()
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    clearReviewForm () {
      this.formData.name = '';
      this.formData.email = '';
      this.formData.summary = '';
      this.formData.review = '';
      this.$v.$reset();
    },
    fillInUserData () {
      if (this.currentUser) {
        this.formData.name = this.currentUser.firstname;
        this.formData.email = this.currentUser.email;
      }
    },
    async submit () {
      this.$v.$touch();
      if (this.$v.$invalid) return
      const isReviewCreated = await this.$store.dispatch('review/add', {
        product_id: this.modalData.payload,
        title: this.formData.summary,
        detail: this.formData.review,
        nickname: this.formData.name,
        review_entity: 'product',
        customer_id: this.currentUser ? this.currentUser.id : null
      });

      if (isReviewCreated) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: this.$t('You submitted your review for moderation.'),
          action1: { label: this.$t('OK') }
        });
        this.clearReviewForm()
        this.closeModal()
        return;
      }

      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: this.$t('Something went wrong. Try again in a few seconds.'),
        action1: { label: this.$t('OK') }
      });
    }
  },
  validations: {
    formData: {
      name: {
        minLength: minLength(2),
        required
      },
      email: {
        required,
        email
      },
      summary: {
        required
      },
      review: {
        required
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  width: 100%;
  &__element {
    margin: var(--spacer-base) 0;
  }
  &__submit {
    margin: var(--spacer-xl) 0 0 0;
  }
}
</style>

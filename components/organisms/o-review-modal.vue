<template>
  <div class="o-review-modal">
    <SfModal :visible="isModalVisible" @close="closeModal">
      <div class="form">
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
          class="form__input"
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
          class="form__input"
        />
        <SfInput
          v-model="formData.summary"
          name="summary"
          :label="$t('Summary')"
          :required="true"
          :valid="!$v.formData.summary.$error"
          :error-message="
            !$v.formData.summary.required
              ? $t('Field is required.')
              : ''
          "
          class="form__input"
        />
        <SfInput
          v-model="formData.review"
          name="reviewText"
          :label="$t('Review')"
          :required="true"
          :valid="!$v.formData.review.$error"
          :error-message="
            !$v.formData.review.required
              ? $t('Field is required.')
              : ''
          "
          class="form__input"
        />
        <SfButton class="sf-button--full-width form__button" @click.native="submit">
          {{ $t("Add review") }}
        </SfButton>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';
import { SfModal, SfInput, SfButton } from '@storefront-ui/vue';
import { mapState } from 'vuex'

export default {
  name: 'OReviewModal',
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
    productId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapState('ui', {
      activeModals: 'activeModals'
    }),
    currentUser () {
      return this.$store.state.user.current;
    },
    isModalVisible () {
      return this.activeModals.includes('product-review')
    }
  },
  mounted () {
    this.fillInUserData()
  },
  methods: {
    closeModal () {
      this.$store.commit('ui/closeModal', 'product-review');
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
        product_id: this.productId,
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
        type: 'error',
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
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.o-review-modal {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.form {
  &__input {
    margin-bottom: $spacer-extra-big;
  }
  &__checkbox {
    margin-bottom: $spacer-big;
  }
  &__button {
    margin-top: $spacer-big;
  }
}
</style>

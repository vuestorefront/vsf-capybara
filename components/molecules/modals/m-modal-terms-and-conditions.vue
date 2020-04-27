<template>
  <div class="m-modal-terms-and-conditions">
    <SfModal :visible="isVisible" :title="$t('Terms and conditions')" @close="closeModal" class="modal">
      <div class="modal__content">
        <SfHeading
          :title="$t('Terms and conditions')"
          :level="3"
          class="sf-heading--left sf-heading--no-underline"
        />
        <p>
          This website ("website") is operated by Luma Inc., which includes Luma
          stores, and Luma Private Sales. This privacy policy only covers
          information collected at this website, and does not cover any
          information collected offline by Luma. All Luma websites are covered by
          this privacy policy.
        </p>
        <SfHeading
          title="Luma Security"
          :level="3"
          class="sf-heading--left sf-heading--no-underline"
        />
        <p>
          Personal information provided on the website and online credit card
          transactions are transmitted through a secure server. We are committed
          to handling your personal information with high standards of information
          security. We take appropriate physical, electronic, and administrative
          steps to maintain the security and accuracy of personally identifiable
          information we collect, including limiting the number of people who have
          physical access to our database servers, as well as employing electronic
          security systems and password protections that guard against
          unauthorized access.
        </p>
        <SfHeading
          title="Luma Privacy Policy"
          :level="3"
          class="sf-heading--left sf-heading--no-underline"
        />
        <p>
          To help us achieve our goal of providing the highest quality products
          and services, we use information from our interactions with you and
          other customers, as well as from other parties. Because we respect your
          privacy, we have implemented procedures to ensure that your personal
          information is handled in a safe, secure, and responsible manner. We
          have posted this privacy policy in order to explain our information
          collection practices and the choices you have about the way information
          is collected and used.
        </p>
        <p>
          As we continue to develop the Luma website and take advantage of
          advances in technology to improve the services we offer, this privacy
          policy likely will change. We therefore encourage you to refer to this
          policy on an ongoing basis so that you understand our current privacy
          policy.
        </p>
        <SfButton
          class="sf-button--full-width color-secondary modal__button"
          @click="closeModal"
        >
          {{ $t("OK") }}
        </SfButton>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfButton, SfHeading } from '@storefront-ui/vue';

export default {
  name: 'ATermsAndConditions',
  components: {
    SfModal,
    SfButton,
    SfHeading
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>
<style lang="scss" scoped>
.modal {
  &__content {
    max-height: 80vh;
  }
  &__button {
    display: block;
    margin-top: var(--spacer-xl);
    margin-bottom: var(--spacer-xl);
  }
}
</style>

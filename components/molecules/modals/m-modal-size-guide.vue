<template>
  <div class="m-modal-size-guide">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading :title="$t('Size guide')" />
      <AStatic :content="content" />
      <SfButton
        class="sf-button--full-width color-secondary"
        @click="closeModal"
      >
        {{ $t("OK") }}
      </SfButton>
    </SfModal>
  </div>
</template>

<script>
import {
  SfModal,
  SfButton,
  SfHeading
} from '@storefront-ui/vue';
import AStatic from 'theme/components/atoms/a-static';
import i18n from '@vue-storefront/i18n';

export default {
  name: 'MModalSizeGuide',
  components: {
    AStatic,
    SfModal,
    SfButton,
    SfHeading
  },
  data () {
    return {
      content: [
        {
          title: 'Privacy Policy',
          message: `To help us achieve our goal of providing the highest quality products and
      services, we use information from our interactions with you and other
      customers, as well as from other parties. Because we respect your privacy,
      we have implemented procedures to ensure that your personal information is
      handled in a safe, secure, and responsible manner. We have posted this
      privacy policy in order to explain our information collection practices
      and the choices you have about the way information is collected and used.`
        },
        {
          title: 'Security',
          message: `Personal information provided on the website and online credit card
      transactions are transmitted through a secure server. We are committed to
      handling your personal information with high standards of information
      security. We take appropriate physical, electronic, and administrative
      steps to maintain the security and accuracy of personally identifiable
      information we collect, including limiting the number of people who have
      physical access to our database servers, as well as employing electronic
      security systems and password protections that guard against unauthorized
      access.`
        },
        {
          title: 'Additional Information',
          message: `This website ("website") is operated by Luma Inc., which includes Luma
      stores, and Luma Private Sales. This privacy policy only covers
      information collected at this website, and does not cover any information
      collected offline by Luma. All Luma websites are covered by this privacy
      policy.`
        }
      ]
    };
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
.m-modal-size-guide {
  --modal-width: 700px;
}
</style>

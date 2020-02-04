<template>
  <modal name="modal-sizeguide" :width="620">
    <div slot="header">
      {{ $t('Size guide') }}
    </div>
    <div slot="content">
      <AStatic :content="content" />
    </div>
  </modal>
</template>

<script>
import Modal from 'theme/components/core/Modal';
import AStatic from 'theme/components/atoms/a-static';

export default {
  name: 'SizeGuide',
  components: {
    Modal,
    AStatic
  },
  data () {
    return {
      content: {
        message: `To help us achieve our goal of providing the highest quality products and
      services, we use information from our interactions with you and other
      customers, as well as from other parties. Because we respect your privacy,
      we have implemented procedures to ensure that your personal information is
      handled in a safe, secure, and responsible manner. We have posted this
      privacy policy in order to explain our information collection practices
      and the choices you have about the way information is collected and used.`
      }
    };
  }
};
</script>

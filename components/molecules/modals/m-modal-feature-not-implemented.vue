<template>
  <SfModal :visible="isVisible" @close="$emit('close', modalData.name)" class="m-modal-feature-not-implemented">
    <p class="message">
      {{ $t('This feature is not implemented yet! Please take a look at') }}
      <a href="https://github.com/DivanteLtd/vue-storefront"> https://github.com/DivanteLtd/vue-storefront </a>
      {{ $t('for our Roadmap!') }}
    </p>
  </SfModal>
</template>
<script>
import { SfModal } from '@storefront-ui/vue';

export default {
  name: 'MModalNewsLetter',
  props: {
    /**
     * determines if modal is visible
     */
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    /**
     * data that can be used in modal
     * format: { name: string, payload: any }
     */
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  components: {
    SfModal
  }
}
</script>
<style lang="scss" scoped>
.message {
  font-family: var(--font-family-primary);
  line-height: 1.6;
}
</style>

<template>
  <!-- Please add class name to your root element same as filename -->
  <div class="m-modal-example">
    <SfModal :visible="isVisible" @close="$emit('close', modalData.name)">
      {{ modalData }}
    </SfModal>
  </div>
</template>
<script>
/**
 * You need to add this component in 'ModalList' enum and 'modalComponents' map
 * check 'theme/store/ui/modals'
 */

/**
 * How to open modal?
 * import { ModalList } from 'theme/store/ui/modals'
 * this.$store.dispatch('ui/openModal', { name: ModalList.Example, payload: 'optional data' });
 */

import { SfModal } from '@storefront-ui/vue';
export default {
  name: 'MModalExample',
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

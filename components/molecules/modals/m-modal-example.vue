<template>
  <!-- Please add class name to your root element same as filename -->
  <div class="m-modal-example">
    <SfModal :visible="isVisible" @close="closeModal">
      {{ modalData }}
    </SfModal>
  </div>
</template>
<script>
// import modals names and use it in actions
import { ModalList } from 'theme/store/ui/modals'

/**
 * You need to add this component in 'ModalList' enum and 'modalComponents' map
 * check 'theme/store/ui/modals'
 */

export default {
  name: 'MModalExample',
  props: {
    /**
     * determines if modal is visible
     */
    isVisible: {
      type: Boolean,
      default: false
    },
    /**
     * optional data that can be used in modal
     * format: { name: string, payload: any }
     */
    modalData: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  methods: {
    openModal () {
      // open modal - can be used in app
      this.$store.dispatch('ui/openModal', { name: ModalList.Example, payload: 'optional data' });
    },
    closeModal () {
      // close modal - should be mainly used in this component
      this.$store.dispatch('ui/closeModal', { name: ModalList.Example });
    }
  }
}
</script>

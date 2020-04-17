<template>
  <div class="o-modal">
    <transition-group name="fade">
      <component
        class="modal"
        v-for="modal in modals"
        :key="modal.name"
        :is="modal.component"
        :is-visible="modalsNames.includes(modal.name)"
        :modal-data="getModalData(modal.name)"
        @close="closeModal"
      />
    </transition-group>
  </div>
</template>
<script>
import { modalComponents } from 'theme/store/ui/modals'
import { mapGetters } from 'vuex'

export default {
  name: 'OModal',
  computed: {
    ...mapGetters('ui', ['activeModals', 'loadedModals']),
    modals () {
      return this.loadedModals.map(modalName => ({
        name: modalName,
        component: modalComponents.get(modalName)
      }))
    },
    modalsNames () {
      return this.activeModals.map(modal => modal.name)
    }
  },
  methods: {
    getModalData (name) {
      return this.activeModals.find(modal => modal.name === name)
    },
    closeModal (name) {
      this.$store.dispatch('ui/closeModal', { name })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.o-modal {
  position: relative;
  z-index: 2;
}
.modal {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: auto;
  }
}
</style>

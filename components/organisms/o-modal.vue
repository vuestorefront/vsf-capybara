<template>
  <div>
    <transition-group name="fade">
      <component
        class="modal"
        v-for="modal in modals"
        :key="modal.name"
        :is="modal.component"
        :is-visible="modalsNames.includes(modal.name)"
        :modal-data="getModalData(modal.name)"
      />
    </transition-group>
  </div>
</template>
<script>
import { ModalList, modalComponents } from 'theme/store/ui/modals'
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.modal {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
</style>

<template>
  <div class="m-modal-authentication">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade">
        <MLogin v-if="modalData.payload === 'login'" />
        <MRegister v-if="modalData.payload === 'register'" />
        <MResetPassword v-if="modalData.payload === 'forgot-pass'" />
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { SfModal } from '@storefront-ui/vue';
import MLogin from 'theme/components/molecules/m-login'
import MRegister from 'theme/components/molecules/m-register'
import MResetPassword from 'theme/components/molecules/m-reset-password'

export default {
  name: 'MModalAuthentication',
  components: { SfModal, MLogin, MRegister, MResetPassword },
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
.fade-enter-active {
  transition: opacity .5s ease-in;
}
.fade-leave-to {
  transition: opacity 0s ease-out;
}
.fade-enter, .fade-leave-to {
  position: absolute;
  opacity: 0;
}
</style>

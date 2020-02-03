<template>
  <div class="m-modal-authentication">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <MLogin v-if="modalData.payload === 'login'" />
        <MRegister v-if="modalData.payload === 'register'" />
        <MResetPassword v-if="modalData.payload === 'forgot-pass'" />
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SfModal } from '@storefront-ui/vue';
import MLogin from 'theme/components/molecules/m-login'
import MRegister from 'theme/components/molecules/m-register'
import MResetPassword from 'theme/components/molecules/m-reset-password'
import { ModalList } from 'theme/store/ui/modals'

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
  computed: {
    ...mapState({
      activeElem: state => state.ui.authElem
    })
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>

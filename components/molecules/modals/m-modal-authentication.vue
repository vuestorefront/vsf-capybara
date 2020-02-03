<template>
  <div class="m-authentication-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <MLogin v-if="activeElem === 'login'" />
        <MRegister v-if="activeElem === 'register'" />
        <MResetPassword v-if="activeElem === 'forgot-pass'" />
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
    }
  },
  computed: {
    ...mapState({
      activeElem: state => state.ui.authElem
    })
  },
  methods: {
    closeModal () {
      this.$store.commit('ui/setAuthElem', null);
      this.$store.dispatch('ui/closeModal', { name: ModalList.Auth });
    }
  }
};
</script>

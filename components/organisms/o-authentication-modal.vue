<template>
  <div class="o-authentication-modal">
    <SfModal :visible="!!activeElem" @close="switchElem(null)">
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

export default {
  name: 'OAuthenticationModal',
  components: { SfModal, MLogin, MRegister, MResetPassword },
  computed: {
    ...mapState({
      activeElem: state => state.ui.authElem
    })
  },
  methods: {
    switchElem (to) {
      this.$store.commit('ui/setAuthElem', to);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.o-authentication-modal {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
</style>

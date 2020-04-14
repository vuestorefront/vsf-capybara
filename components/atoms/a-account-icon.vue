<template>
  <SfIcon
    icon="profile"
    size="xs"
    class="sf-header__icon a-account-icon"
    :class="{
      'sf-header__icon--is-active': isLoggedIn
    }"
    role="button"
    aria-label="account"
    @click="goToAccount"
  />
</template>

<script>
import { SfIcon } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  components: { SfIcon },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    goToAccount () {
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.openModal({name: ModalList.Auth, payload: 'login'})
      }
    }
  }
};
</script>

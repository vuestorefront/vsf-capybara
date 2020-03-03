<template>
  <SfCircleIcon
    icon="profile"
    icon-size="20px"
    icon-color="black"
    class="sf-header__circle-icon a-account-icon"
    role="button"
    aria-label="account"
    :class="{ 'sf-header__circle-icon--is-active': isLoggedIn }"
    :aria-pressed="isLoggedIn ? 'true' : 'false'"
    @click="goToAccount"
  />
</template>

<script>
import { SfCircleIcon } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  components: { SfCircleIcon },
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

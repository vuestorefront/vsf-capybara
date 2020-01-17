<template>
  <SfCircleIcon
    icon="profile"
    icon-size="20px"
    icon-color="black"
    class="sf-header__icon a-account-icon"
    role="button"
    aria-label="account"
    :class="{ 'sf-header__icon--is-active': isLoggedIn }"
    :aria-pressed="isLoggedIn ? 'true' : 'false'"
    @click="goToAccount"
  />
</template>

<script>
import { SfCircleIcon } from '@storefront-ui/vue';
import AccountIcon from '@vue-storefront/core/compatibility/components/blocks/Header/AccountIcon';
import { mapGetters } from 'vuex';

export default {
  components: { SfCircleIcon },
  mixins: [AccountIcon],
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  }
};
</script>

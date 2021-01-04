<template>
  <div class="o-bottom-navigation">
    <SfBottomNavigation>
      <SfBottomNavigationItem
        v-for="item in navigationItems"
        :key="item.icon"
        :icon="item.icon"
        :label="item.label"
        :is-floating="item.isFloating"
        :is-active="isActive(item.icon)"
        @click.native="item.onClick"
      />
    </SfBottomNavigation>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import AHomeIcon from 'theme/components/atoms/a-home-icon';
import ASearchIcon from 'theme/components/atoms/a-search-icon';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import { SfBottomNavigation } from '@storefront-ui/vue';

export default {
  name: 'OBottomNavigation',
  components: {
    SfBottomNavigation
  },
  data () {
    return {
      navigationItems: [
        { icon: 'home', label: this.$t('Home'), onClick: this.goToHome },
        { icon: 'menu', label: this.$t('Menu'), onClick: this.goToMenu },
        { icon: 'search', label: this.$t('Search'), onClick: this.goToSearch },
        { icon: 'account', label: this.$t('Profile'), onClick: this.goToAccount },
        { icon: 'add_to_cart', label: this.$t('Cart'), onClick: this.goToCart, isFloating: true }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isMobileMenu: state => state.ui.isMobileMenu,
      isSearchPanelVisible: state => state.ui.searchpanel
    }),
    isActive () {
      return (icon) => {
        switch (icon) {
          case 'home': {
            const isHomepage = this.$route.name === this.localizedRoute({ name: 'home', path: '/' }).name
            return isHomepage && !this.isMobileMenu && !this.isSearchPanelVisible
          }
          case 'menu': {
            return this.isMobileMenu
          }
          case 'search': {
            return this.isSearchPanelVisible
          }
          case 'profile': {
            const isProfile = this.$route.name === this.localizedRoute({ name: 'my-account', path: 'my-account' }).name
            return isProfile && !this.isMobileMenu
          }
          default: {
            // we don't need to show active icon for profile and cart, because bottom navigation is below
            return false
          }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      openMicrocart: 'ui/toggleMicrocart'
    }),
    goToHome () {
      this.$store.commit('ui/setSearchpanel', false)
      this.$store.commit('ui/closeMenu')

      this.$router.push(this.localizedRoute('/'));
    },
    goToMenu () {
      this.$store.commit('ui/setSearchpanel', false)

      this.isMobileMenu
        ? this.$store.commit('ui/closeMenu')
        : this.$store.commit('ui/openMenu')
    },
    goToSearch () {
      this.$store.commit('ui/closeMenu')

      this.$store.commit('ui/setSearchpanel', !this.isSearchPanelVisible)
    },
    goToAccount () {
      this.$store.commit('ui/closeMenu')
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.openModal({ name: ModalList.Auth, payload: 'login' })
      }
    },
    goToCart () {
      this.openMicrocart();
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-bottom-navigation {
  position: relative;
  z-index: 1;
  @include for-desktop() {
    display: none;
  }
  ::v-deep .sf-bottom-navigation {
    z-index: inherit;
    .sf-bottom-navigation-item {
      cursor: pointer;
    }
  }
}
</style>

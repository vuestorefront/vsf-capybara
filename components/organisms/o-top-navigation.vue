<template>
  <div class="o-top-navigation">
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
      <ALogo />
      <SfButton>
        Make your own
      </SfButton>
      <ADetailedCartIcon class="sf-header__action" />
    </SfBottomNavigation>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import AHomeIcon from 'theme/components/atoms/a-home-icon';
import ASearchIcon from 'theme/components/atoms/a-search-icon';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import ADetailedCartIcon from 'theme/components/atoms/a-detailed-cart-icon.vue';
import { SfBottomNavigation, SfButton } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo.vue';

export default {
  name: 'OTopNavigation',
  components: {
    SfBottomNavigation,
    SfButton,
    ALogo,
    ADetailedCartIcon
  },
  data () {
    return {
      navigationItems: [
        { icon: 'list', label: '', onClick: this.goToMenu },
        // { icon: 'search', label: '', onClick: this.goToSearch },
        { icon: 'account', label: '', onClick: this.goToAccount }
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
      openModal: 'ui/openModal'
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-top-navigation {
  position: relative;
  min-height: calc(var(--bottom-navigation-height) + var(--spacer-base));
  z-index: 10;

  .a-logo {
    display: none;
  }

  .sf-button {
    --button-font-size: var(--font-2xs);
    --button-font-line-height: 1;
    --button-padding: calc(var(--spacer-2xs) * 3) var(--spacer-sm);
  }
  .a-microcart-icon {
    margin: 0;
    padding: var(--spacer-sm) var(--spacer-xs);
  }
  ::v-deep .sf-header {
      &__logo {
        --header-logo-height: 1.5rem;
      }
    }
  ::v-deep .sf-bottom-navigation {
    top: 0;
    bottom: auto;
    --bottom-navigation-z-index: 11;
    align-items: center;
    justify-content: space-between;
    .sf-bottom-navigation-item {
      cursor: pointer;
    }
  }

  @media (min-width: 375px) {
    .a-logo {
      display: block;
    }
  }

  @include for-desktop() {
    display: none;
  }
}
</style>

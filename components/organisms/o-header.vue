<template>
  <div class="o-header">
    <SfOverlay
      class="overlay"
      :visible="isHoveredMenu || isSearchPanelVisible"
      @click="$store.commit('ui/setSearchpanel', false)"
    />
    <SfHeader
      :active-icon="activeIcon"
      class="_header"
      :class="[
        {
          'sf-header--has-mobile-search': isSearchPanelVisible,
        }
      ]"
    >
      <template #logo>
        <ALogo />
      </template>
      <template #navigation>
        <SfHeaderNavigationItem
          @mouseover="isHoveredMenu = true"
          @mouseleave="isHoveredMenu = false"
        >
          <div class="o-header__submenu">
            Products
          </div>
          <MMenu
            :visible="isHoveredMenu && !isSearchPanelVisible"
            @close="isHoveredMenu = false"
          />
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            :to="{ name: 'gift-cards' }"
          >
            Gift Cards
          </router-link>
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            to="/reviews/"
          >
            Reviews
          </router-link>
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            to="/pricing/"
          >
            Pricing
          </router-link>
        </SfHeaderNavigationItem>

        <MCtaButton />
      </template>
      <template #search>
        <div />
        <!-- <OSearch :class="{'desktop-only': !isSearchPanelVisible}" />
        <SfButton
          v-if="isSearchPanelVisible"
          class="sf-button--text form__action-button form__action-button--secondary mobile-only"
          @click="$store.commit('ui/setSearchpanel', false)"
        >
          {{ $t('Cancel') }}
        </SfButton> -->
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <AAccountIcon class="sf-header__action" />
          <!-- <AMicrocartIcon class="sf-header__action" /> -->
          <ADetailedCartIcon class="sf-header__action" />
        </div>
      </template>
    </SfHeader>
    <MMenu
      v-show="isMobileMenu"
      class="mobile-menu"
      @close="$store.commit('ui/closeMenu')"
    />
  </div>
</template>

<script>
import { SfHeader, SfOverlay } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import ADetailedCartIcon from 'theme/components/atoms/a-detailed-cart-icon';
import OSearch from 'theme/components/organisms/o-search';
import { mapState, mapGetters } from 'vuex';
import MMenu from 'theme/components/molecules/m-menu';
import MCtaButton from 'theme/components/molecules/m-cta-button.vue';

export default {
  name: 'OHeader',
  components: {
    SfHeader,
    ALogo,
    AAccountIcon,
    AMicrocartIcon,
    ADetailedCartIcon,
    OSearch,
    MMenu,
    SfOverlay,
    MCtaButton
  },
  data () {
    return {
      isHoveredMenu: false,
      isDropdownOpen: false,
      dropdownActions: [
        {
          label: 'Custom Petsies',
          url: '/forevers-pet-plush/'
        },
        {
          label: 'Custom Pillows',
          url: '/custom-pillows/'
        },
        {
          label: 'Custom Socks',
          url: {
            name: 'printed-socks-creation-page'
          }
        },
        {
          label: 'Face Masks',
          url: {
            name: 'printed-masks-creation-page'
          }
        },
        {
          label: 'Pet Keychains',
          url: {
            name: 'printed-keychains-creation-page'
          }
        },
        {
          label: 'Felted Magnets',
          url: {
            name: 'felted-magnets-creation-page'
          }
        },
        {
          label: 'Gift Box',
          url: { name: 'giftbox' }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      isSearchPanelVisible: state => state.ui.searchpanel
    }),
    ...mapState('ui', ['isMobileMenu']),
    ...mapGetters('user', ['isLoggedIn']),
    activeIcon () {
      return this.isLoggedIn ? 'account' : '';
    }
  },
  watch: {
    async isMobileMenu (status) {
      if (this.isMobileMenu) {
        // we can't add this style to body because sfui also add/remove overflow to body and there may be conflict
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = ''
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.a-logo {
  margin-right: var(--spacer-lg);
}

.overlay {
  --overlay-z-index: 99;
}

.o-header {
  --header-navigation-item-margin: 0;
  --header-navigation-item-padding: var(--spacer-lg) var(--spacer-xs);
  --header-navigation-item-color: var(--c-dark);
  box-sizing: border-box;

  ._header {
    position: relative;
    z-index: 200;
  }

  &__submenu {
    cursor: pointer;
  }

  a {
    &.active {
      font-weight: bold;
    }
  }

  ::v-deep .sf-menu-item {
    &__label {
      &:hover {
        --menu-item-label-color: var(--c-primary);
      }
    }
  }

  .sf-header-navigation-item {
    &::after {
      bottom: 0;
      width: 0;
    }

    &:hover > *:not(.sf-mega-menu) {
      --header-navigation-item-color: var(--c-primary);
    }

    &:hover {
      .m-menu {
        opacity: 1;
        visibility: visible;
      }

      &::after {
        width: 100%;
      }
    }
  }

  .m-cta-button {
    align-self: center;
  }

  .sf-header {
    display: none;
  }

  ::v-deep .sf-header {
    --header-logo-margin: 0 0 var(--spacer-sm) 0;

    &__navigation {
      --header-navigation-margin: 0 var(--spacer-base);
      justify-content: space-evenly;
      flex-grow: 2;
    }

    &__actions {
      justify-content: space-between;
    }
  }

  .mobile-menu {
    position: relative;
    opacity: 1;
    visibility: visible;
    z-index: 12;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-grow: 1;
    --mega-menu-aside-menu-height: calc(100vh - var(--bottom-navigation-height));

    &::v-deep {
      .sf-mega-menu__menu {
        overflow: visible;
      }
    }
  }

  @include for-desktop {
    --header-box-shadow: 0px -2px 10px rgba(var(--c-dark-base), 0.15);

    .mobile-menu {
      opacity: 0;
      visibility: hidden;
    }

    .sf-header {
      display: block;
      --header-navigation-margin: 0 auto;
    }

    ::v-deep .sf-header {
      &__icons {
        display: flex;

        .sf-header__icon {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

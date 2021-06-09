<template>
  <div class="o-header">
    <SfOverlay
      class="overlay"
      :visible="isHoveredMenu || isSearchPanelVisible"
      @click="$store.commit('ui/setSearchpanel', false)"
    />
    <SfHeader
      :active-icon="activeIcon"
      :class="{
        'sf-header--has-mobile-search': isSearchPanelVisible,
        'sf-header--is-sticky': isSearchPanelVisible
      }"
      :style="{'z-index': isHoveredMenu ? 2 : 1}"
    >
      <template #logo>
        <ALogo />
      </template>
      <template #navigation>
        <SfHeaderNavigationItem
          @mouseover="isHoveredMenu = true"
          @mouseleave="isHoveredMenu = false"
        >
          <div>
            Products
          </div>
          <MMenu
            :visible="isHoveredMenu && !isSearchPanelVisible"
            @close="isHoveredMenu = false"
          />
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            to="/"
          >
            Gift Cards
          </router-link>
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            to="/"
          >
            Reviews
          </router-link>
        </SfHeaderNavigationItem>
        <SfHeaderNavigationItem>
          <router-link
            to="/"
          >
            Pricing
          </router-link>
        </SfHeaderNavigationItem>
        <div
          class="_dropdown-container"
          @mouseover="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false"
        >
          <SfButton>
            Make your own
          </SfButton>
          <SfDropdown
            :is-open="isDropdownOpen"
          >
            <SfList>
              <SfListItem
                v-for="action in dropdownActions"
                :key="action.label"
              >
                <router-link
                  :to="action.url"
                >
                  {{ action.label }}
                </router-link>
              </SfListItem>
            </SfList>
          </SfDropdown>
        </div>
      </template>
      <template #search>
        <div />
        <!-- <OSearch :class="{'desktop-only': !isSearchPanelVisible}" />
        <SfButton
          v-if="isSearchPanelVisible"
          class="sf-button--text form__action-button form__action-button--secondary mobile-only"
          @click="$store.commit('ui/setSearchpanel', false)"
        >
          {{ $t("Cancel") }}
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
import { SfHeader, SfOverlay, SfButton, SfDropdown, SfList } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import ADetailedCartIcon from 'theme/components/atoms/a-detailed-cart-icon';
import OSearch from 'theme/components/organisms/o-search';
import { mapState, mapGetters } from 'vuex';
import MMenu from 'theme/components/molecules/m-menu';

export default {
  name: 'OHeader',
  components: {
    SfHeader,
    SfButton,
    SfDropdown,
    SfList,
    ALogo,
    AAccountIcon,
    AMicrocartIcon,
    ADetailedCartIcon,
    OSearch,
    MMenu,
    SfOverlay
  },
  data () {
    return {
      isHoveredMenu: false,
      isDropdownOpen: false,
      dropdownActions: [
        {
          label: 'Custom Petsies',
          url: '/'
        },
        {
          label: 'Custom Pillows',
          url: '/'
        },
        {
          label: 'Custom Socks',
          url: '/'
        },
        {
          label: 'Face Masks',
          url: '/'
        },
        {
          label: 'Pet Keychains',
          url: '/'
        },
        {
          label: 'Gift Box',
          url: '/'
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
  position: absolute;
  z-index: 1;
}
.o-header {
  --header-navigation-item-margin: 0;
  --header-navigation-item-padding: var(--spacer-lg) var(--spacer-xs);
  --header-navigation-item-color: var(--c-dark);
  box-sizing: border-box;
  a {
    &.active {
      font-weight: bold;
    }
  }
  .sf-header-navigation-item {
    &::after {
      bottom: 0;
      width: 0;
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
  ._dropdown-container {
    position: relative;
    align-self: center;
    .sf-button {
      --button-font-size: var(--font-sm);
      --button-font-line-height: 1;
    }
    .sf-dropdown {
      --dropdown-background: var(--c-primary);
      --c-link: var(--c-light-variant);
      --c-link-hover: var(--c-light-variant);
      --list-item-padding: var(--spacer-xs) var(--spacer-sm);

      .sf-list__item {
        &:hover {
          background-color: var(--c-light);
        }
      }
    }
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
    position: fixed;
    opacity: 1;
    visibility: visible;
    top: var(--bottom-navigation-height);
    z-index: 12;
    --mega-menu-aside-menu-height: calc(100vh - var(--bottom-navigation-height) - var(--bar-height));
  }
  @include for-desktop {
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

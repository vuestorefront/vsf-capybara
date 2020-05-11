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
          v-for="category in categories"
          :key="category.id"
          @mouseover="isHoveredMenu = true"
          @mouseleave="isHoveredMenu = false"
        >
          <router-link
            :class="{active: isCategoryActive(category)}"
            :to="categoryLink(category)"
          >
            {{ category.name }}
          </router-link>
          <MMenu
            :visible="isHoveredMenu && !isSearchPanelVisible"
            :categories-ids="category.children_data"
            :title="category.name"
            @close="isHoveredMenu = false"
          />
        </SfHeaderNavigationItem>
      </template>
      <template #search>
        <div class="search-container">
          <OSearch :class="{'desktop-only': !isSearchPanelVisible}" />
          <SfButton
            v-if="isSearchPanelVisible"
            class="sf-button--text form__action-button form__action-button--secondary mobile-only"
            @click="$store.commit('ui/setSearchpanel', false)"
          >
            {{ $t("Cancel") }}
          </SfButton>
        </div>
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <AAccountIcon class="sf-header__action" />
          <AMicrocartIcon class="sf-header__action" />
        </div>
      </template>
    </SfHeader>
    <MMenu
      v-show="isMobileMenu"
      class="mobile-menu"
      :categories-ids="categories"
      @close="$store.commit('ui/closeMenu')"
    />
  </div>
</template>

<script>
import { SfHeader, SfOverlay, SfButton } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import OSearch from 'theme/components/organisms/o-search';
import { mapState, mapGetters } from 'vuex';
import MMenu from 'theme/components/molecules/m-menu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import { getTopLevelCategories } from 'theme/helpers';

export default {
  name: 'OHeader',
  components: {
    SfHeader,
    SfButton,
    ALogo,
    AAccountIcon,
    AMicrocartIcon,
    OSearch,
    MMenu,
    SfOverlay
  },
  data () {
    return {
      isHoveredMenu: false
    }
  },
  computed: {
    ...mapState({
      isSearchPanelVisible: state => state.ui.searchpanel
    }),
    ...mapState('ui', ['isMobileMenu']),
    ...mapGetters('category', ['getCategories', 'getCurrentCategory']),
    ...mapGetters('user', ['isLoggedIn']),
    activeIcon () {
      return this.isLoggedIn ? 'account' : '';
    },
    categories () {
      return getTopLevelCategories(this.getCategories);
    }
  },
  methods: {
    categoryLink (category) {
      return formatCategoryLink(category);
    },
    isCategoryActive (category) {
      return this.getCurrentCategory.path ? this.getCurrentCategory.path.startsWith(category.path) : false;
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
.overlay {
  position: absolute;
  z-index: 1;
}
.o-header {
  --header-navigation-item-margin: 0 2rem 0 0;
  box-sizing: border-box;
  a {
    &.active {
      font-weight: bold;
    }
  }
  .search-container {
    display: flex;
    .o-search {
      flex-grow: 1;
    }
    @include for-mobile {
      width: 100%;
      padding: 0 var(--spacer-sm);
      .sf-button {
        margin: 0 0 0 var(--spacer-sm);
      }
    }
  }
  @include for-mobile {
    .mobile-menu {
      position: fixed;
      opacity: 1;
      visibility: visible;
      top: 0;
      z-index: 1;
      --mega-menu-aside-menu-height: calc(100vh - var(--bottom-navigation-height) - var(--bar-height));
    }
  }
}
.sf-header {
  @include for-mobile {
    &__icons {
      display: none;
    }
  }
  @include for-desktop {
    &__icons {
      display: flex;
      .sf-header__icon {
        cursor: pointer;
      }
    }
  }
}
</style>

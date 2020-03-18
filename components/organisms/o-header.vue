<template>
  <div class="o-header">
    <SfHeader
      :active-icon="activeIcon"
      :is-sticky="isSearchPanelVisible"
      :has-mobile-search="isSearchPanelVisible"
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
            :categories-ids="category.children_data"
            :title="category.name"
          />
        </SfHeaderNavigationItem>
      </template>
      <template #search>
        <div class="search-container">
          <OSearch class="sf-search-bar sf-header__search" :class="{'desktop-only': !isSearchPanelVisible}" />
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
          <AAccountIcon />
          <AMicrocartIcon />
        </div>
      </template>
    </SfHeader>
    <SfIcon
      v-show="isMobileMenu"
      class="mobile-close-menu"
      icon="cross"
      size="xxs"
      color="black"
      @click="$store.commit('ui/toggleMenu')"
    />
    <MMenu
      v-show="isMobileMenu"
      class="mobile-menu"
      :categories-ids="categories"
    />
    <SfOverlay :visible="isHoveredMenu" style="position:absolute;z-index:1;" />
  </div>
</template>

<script>
import { SfHeader, SfOverlay, SfButton, SfIcon } from '@storefront-ui/vue';
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
    SfOverlay,
    SfIcon
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
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.mobile-close-menu {
  display: none;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 4;
}
.sf-header-navigation-item:hover ::v-deep .m-menu {
  opacity: 1;
  visibility: visible;
}

.o-header {
  box-sizing: border-box;
  ::v-deep {
    .sf-header__container {
      margin: 0;
    }
    .sf-header__navigation {
      margin: 0;
    }
  }
  a {
    &.active {
      font-weight: bold;
    }
  }
  .search-container {
    display: flex;
    .sf-button {
      margin-left: 1rem;
    }
    @include for-mobile {
      width: 100%;
    }
  }
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
  @include for-mobile {
    .sf-header__icons {
      display: none;
    }
    .mobile-menu {
      opacity: 1;
      visibility: visible;
      top: 0;
      z-index: 3;
    }
    .mobile-close-menu {
      display: flex;
    }
  }
  .sf-header {
    position: relative;
    z-index: 2;
  }
}
.ml-auto {
  margin-left: auto;
}
.sf-header-navigation-item:hover ::v-deep .m-menu {
  opacity: 1;
  visibility: visible;
}
</style>

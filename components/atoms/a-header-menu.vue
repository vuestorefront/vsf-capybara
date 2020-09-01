<template>
  <div class="search-container header-menu">
    <div class="menu-list d-flex align-center justify-center">
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
    </div>
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
 import { mapState, mapGetters } from 'vuex';
import MMenu from 'theme/components/molecules/m-menu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import { getTopLevelCategories } from 'theme/helpers';

export default {
  name: 'AHeaderMenu',
  components: {
    SfHeader,
    SfButton,
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
 
.menu_general_style
{
  --link-color: var(--_c-dark-secondary);
  --link-font-line-height: 21px;
  font-family: 'Poppins-Regular';
  --link-font-size : 14px;
  --link-text-decoration:none;
  margin: 0 12px;
}

</style>

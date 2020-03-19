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
        >
          <router-link
            :class="{active: isCategoryActive(category)}"
            :to="categoryLink(category)"
          >
            {{ category.name }}
          </router-link>
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
  </div>
</template>

<script>
import { SfHeader, SfButton } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import OSearch from 'theme/components/organisms/o-search';
import { mapState, mapGetters } from 'vuex';
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
    OSearch
  },
  computed: {
    ...mapGetters({
      getCategories: 'category/getCategories',
      getCurrentCategory: 'category-next/getCurrentCategory',
      isLoggedIn: 'user/isLoggedIn'
    }),
    ...mapState({
      isSearchPanelVisible: state => state.ui.searchpanel
    }),
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
  }
}
</style>

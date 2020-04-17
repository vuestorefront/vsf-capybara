<template>
  <div class="o-search">
    <SfSearchBar
      v-model="search"
      :placeholder="$t('Type what you are looking for...')"
      class="sf-header__search"
      @input="startSearch"
      @click.native="$store.commit('ui/setSearchpanel', true)"
    />
    <component
      v-if="search && isSearchPanelVisible"
      :is="searchPanelAsyncComponent"
      :search="search"
      :page-size="size"
      :products="products"
      :read-more="readMore"
      @see-more="seeMore"
      @close="$store.commit('ui/setSearchpanel', false)"
      @reload="reloadComponent()"
    />
  </div>
</template>

<script>
import { SfSearchBar } from '@storefront-ui/vue';
import { mapState, mapGetters } from 'vuex';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';

const SearchPanel = () =>
  import(/* webpackChunkName: "vsf-search-panel" */ 'theme/components/organisms/o-search-panel');

export default {
  name: 'OSearch',
  components: {
    SfSearchBar
  },
  data () {
    return {
      size: 16,
      searchPanelAsyncComponent: () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    }
  },
  mixins: [SearchPanelMixin],
  computed: {
    ...mapGetters('category', ['getCategories']),
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isSearchPanelVisible: state => state.ui.searchpanel
    })
  },
  methods: {
    startSearch () {
      if (this.search.length >= 3) {
        this.makeSearch();
      }
    },
    reloadComponent () {
      this.searchPanelAsyncComponent = () => ({
        component: SearchPanel(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.sidebar {
  &__search {
    --header-container-height: 5rem;
    --sidebar-content-padding: 0;
    --sidebar-aside-top: var(--header-container-height);
    --sidebar-aside-width: auto;
    @include for-mobile {
      --header-container-height: 7rem;
    }
    ::v-deep {
      .sf-sidebar__content {
        position: fixed;
        background-color: var(--c-white);
        height: auto;
        max-height: calc(66vh - var(--header-container-height));
        right: 0;
        left: 0;
        overflow-y: auto;
        overflow-x: hidden;

        @include for-mobile {
          max-height: calc(100vh - var(--header-container-height) - var(--bottom-navigation-height));
        }

        @include for-desktop {
          max-width: 1272px;
          margin: auto;
        }
      }
    }
  }
}
</style>

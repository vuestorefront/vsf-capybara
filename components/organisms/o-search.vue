<template>
  <div class="o-search">
    <SfSearchBar
      v-model="search"
      :placeholder="$t('Type what you are looking for...')"
      class="sf-header__search"
      @input="startSearch"
      @click.native="$store.commit('ui/setSearchpanel', true)"
    />
    <SfSidebar
      :visible="isSearchPanelVisible"
      :button="false"
      :overlay="false"
      class="sf-sidebar sidebar__search"
    >
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
      <template #modal-bar>
        <div class="hidden" />
      </template>
    </SfSidebar>
  </div>
</template>

<script>
import { SfSearchBar, SfSidebar } from '@storefront-ui/vue';
import { mapState, mapGetters } from 'vuex';
import SearchPanelMixin from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import LoadingSpinner from 'theme/components/theme/blocks/AsyncSidebar/LoadingSpinner';
import LoadingError from 'theme/components/theme/blocks/AsyncSidebar/LoadingError';

const SearchPanel = () =>
  import(/* webpackChunkName: "vsf-search-panel" */ 'theme/components/organisms/o-search-panel');

export default {
  name: 'OSearch',
  components: {
    SfSearchBar,
    SfSidebar
  },
  data () {
    return {
      size: 16,
      searchPanelAsyncComponent: () => ({
        component: SearchPanel(),
        loading: LoadingSpinner,
        error: LoadingError,
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
        loading: LoadingSpinner,
        error: LoadingError,
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
    ::v-deep .sf-overlay {
      top: var(--header-container-height);
    }

    @include for-mobile {
      --header-container-height: 7rem;
    }
  }
}
</style>

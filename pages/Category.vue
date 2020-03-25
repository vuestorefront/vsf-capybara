<template>
  <div id="category">
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link" class="sf-breadcrumbs__link">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <h1 class="navbar__title">
          {{ $t("Categories") }}
        </h1>
      </div>
      <div class="navbar__main">
        <SfButton
          class="sf-button--text navbar__filters-button"
          @click="isFilterSidebarOpen = true"
        >
          <AIconFilter size="15px" styles="margin-right:10px" />
          {{ $t("Filters") }}
          <template v-if="activeFiltersCount">
            ({{ activeFiltersCount }})
          </template>
        </SfButton>
        <template v-if="activeFiltersCount">
          <span>&nbsp;&mdash;&nbsp;</span>
          <button @click="clearAllFilters" class="sf-button sf-button--text navbar__filters-clear-all">
            {{ $t('Clear all') }}
          </button>
        </template>
        <div class="navbar__sort">
          <span class="navbar__label">{{ $t("Sort By") }}:</span>
          <SfSelect
            class="sort-by"
            :selected="sortOrder"
            @change="changeSortOder"
          >
            <SfSelectOption
              v-for="option in sortOptions"
              :key="option.id"
              :value="option.id"
              class="sort-by__option"
            >
              {{ option.label }}
            </SfSelectOption>
          </SfSelect>
        </div>
        <div class="navbar__counter">
          <span class="navbar__label desktop-only">
            {{ $t("Products found") }}:
          </span>
          <strong class="desktop-only">{{ getCategoryProductsTotal }}</strong>
          <span class="navbar__label mobile-only">
            {{ $t("{count} items", { count: getCategoryProductsTotal }) }}
          </span>
        </div>
      </div>
    </div>
    <div class="main section">
      <div class="sidebar desktop-only">
        <SfAccordion :show-chevron="false">
          <SfAccordionItem
            v-for="category in categories"
            :key="category.id"
            :header="category.name"
          >
            <SfList>
              <SfListItem v-for="item in category.items" :key="item.id">
                <router-link :to="item.link" :class="{'sf-menu-item--active': isCategoryActive(item)}">
                  <SfMenuItem :label="item.name" :count="item.count" />
                </router-link>
              </SfListItem>
            </SfList>
          </SfAccordionItem>
        </SfAccordion>
      </div>
      <div class="products">
        <SfHeading
          v-if="isCategoryEmpty"
          :title="$t('No products found!')"
          :subtitle="
            $t(
              'Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!'
            )
          "
        />
        <template v-else>
          <lazy-hydrate :trigger-hydration="!loading">
            <div class="products__list">
              <SfProductCard
                v-for="(product, index) in products"
                :key="product.id"
                :title="product.title"
                :image="getBreadcrumbsCurrent === 'Jackets' ? tempImages[index] : product.image"
                :regular-price="product.price.regular"
                :special-price="product.price.special"
                :max-rating="product.rating.max"
                :score-rating="product.rating.score"
                :link="product.link"
                link-tag="router-link"
                :wishlist-icon="false"
                class="products__product-card"
              />
            </div>
          </lazy-hydrate>
          <SfPagination
            v-if="totalPages > 1"
            class="products__pagination desktop-only"
            :current="currentPage"
            :total="totalPages"
            :visible="3"
            @click="changePage"
          />
        </template>
      </div>
    </div>
    <SfSidebar
      :visible="isFilterSidebarOpen"
      @close="isFilterSidebarOpen = false"
    >
      <div class="filters">
        <template v-for="(filters, filterType) in availableFilters">
          <h3 :key="filterType" class="filters__title">
            {{ $t(filterType) }}
          </h3>
          <SfFilter
            v-for="filter in filters"
            :key="filter.id"
            :label="filter.label"
            :count="filter.count"
            :color="filter.color"
            :selected="isFilterActive(filter)"
            class="filters__item"
            @change="changeFilter(filter)"
          />
        </template>
        <div class="filters__buttons">
          <SfButton
            class="sf-button--full-width"
            @click="isFilterSidebarOpen = false"
          >
            {{ $t("Done") }}
          </SfButton>
          <SfButton
            class="sf-button--full-width filters__button-clear"
            @click="clearAllFilters"
          >
            {{ $t("Clear all") }}
          </SfButton>
        </div>
      </div>
    </SfSidebar>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';
import { mapGetters } from 'vuex';
import castArray from 'lodash-es/castArray';
import config from 'config';
import {
  buildFilterProductsQuery,
  productThumbnailPath,
  isServer
} from '@vue-storefront/core/helpers';
import i18n from '@vue-storefront/i18n';
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll';
import { htmlDecode } from '@vue-storefront/core/filters';
import { quickSearchByQuery } from '@vue-storefront/core/lib/search';
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { getTopLevelCategories } from 'theme/helpers';
import AIconFilter from 'theme/components/atoms/a-icon-filter';
import {
  formatCategoryLink,
  formatProductLink
} from '@vue-storefront/core/modules/url/helpers';
import { prepareCategoryProduct } from 'theme/helpers';
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import {
  SfList,
  SfButton,
  SfSelect,
  SfFilter,
  SfSidebar,
  SfHeading,
  SfMenuItem,
  SfAccordion,
  SfPagination,
  SfBreadcrumbs,
  SfProductCard
} from '@storefront-ui/vue';

const THEME_PAGE_SIZE = 12;
const LAZY_LOADING_ACTIVATION_BREAKPOINT = 1024;

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params);
    const cachedCategory = store.getters['category-next/getCategoryFrom'](
      route.path
    );
    const currentCategory =
      cachedCategory && !forceLoad
        ? cachedCategory
        : await store.dispatch('category-next/loadCategory', { filters });
    await store.dispatch('category-next/loadCategoryProducts', {
      route,
      category: currentCategory,
      pageSize: THEME_PAGE_SIZE
    });
    const breadCrumbsLoader = store.dispatch(
      'category-next/loadCategoryBreadcrumbs',
      {
        category: currentCategory,
        currentRouteName: currentCategory.name,
        omitCurrent: true
      }
    );

    if (isServer) await breadCrumbsLoader;
    catalogHooksExecutors.categoryPageVisited(currentCategory);
  } catch (e) {
    //
  }
};

export default {
  name: 'CategoryPage',
  components: {
    LazyHydrate,
    AIconFilter,
    SfList,
    SfButton,
    SfSelect,
    SfFilter,
    SfSidebar,
    SfHeading,
    SfMenuItem,
    SfAccordion,
    SfPagination,
    SfBreadcrumbs,
    SfProductCard
  },
  mixins: [onBottomScroll],
  data () {
    return {
      loading: true,
      loadingProducts: false,
      currentPage: 1,
      getMoreCategoryProducts: [],
      browserWidth: 0,
      isFilterSidebarOpen: false,
      unsubscribeFromStoreAction: null,
      aggregations: null
    };
  },
  computed: {
    // TEMP
    tempImages () {
      return require('theme/assets/images-temp.json').images
    },
    //
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters',
      getCurrentFilters: 'category-next/getCurrentFilters',
      getSystemFilterNames: 'category-next/getSystemFilterNames',
      getCategories: 'category/getCategories',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products');
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0;
    },
    isLazyLoadingEnabled () {
      return this.browserWidth < LAZY_LOADING_ACTIVATION_BREAKPOINT;
    },
    breadcrumbs () {
      return this.getBreadcrumbsRoutes
        .map(route => ({
          text: htmlDecode(route.name),
          route: {
            link: route.route_link
          }
        }))
        .concat({
          text: htmlDecode(this.getBreadcrumbsCurrent)
        });
    },
    categories () {
      return getTopLevelCategories(this.getCategories)
        .map(category => {
          const viewAllMenuItem = {
            ...category,
            name: i18n.t('View all'),
            position: 0
          };

          const subCategories = category.children_data
            ? category.children_data
              .map(subCategory => this.prepareCategoryMenuItem(
                this.getCategories.find(category => category.id === subCategory.id)
              ))
              .filter(Boolean)
            : [];

          return {
            ...this.prepareCategoryMenuItem(category),
            items: [this.prepareCategoryMenuItem(viewAllMenuItem)]
              .concat(subCategories)
              .sort((a, b) => a.position - b.position)
          };
        })
        .sort((a, b) => a.position - b.position);
    },
    products () {
      // lazy loading is disabled for desktop screen width (>= 1024px)
      // so products from store have to be filtered out because there could
      // be more than THEME_PAGE_SIZE of them - they could be fetched earlier
      // when lazy loading was enabled
      return this.isLazyLoadingEnabled || this.currentPage === 1
        ? this.getCategoryProducts
          .filter((product, i) => {
            return this.isLazyLoadingEnabled || i < THEME_PAGE_SIZE;
          })
          .map(prepareCategoryProduct)
        : this.getMoreCategoryProducts.map(prepareCategoryProduct);
    },
    totalPages () {
      return Math.ceil(this.getCategoryProductsTotal / THEME_PAGE_SIZE);
    },
    sortOrder () {
      return (
        this.getCurrentSearchQuery.sort ||
        `${config.products.defaultSortBy.attribute}:${config.products.defaultSortBy.order}`
      );
    },
    sortOptions () {
      return Object.entries(config.products.sortByAttributes).map(attribute => {
        const [label, id] = attribute;
        return { id, label };
      });
    },
    sortLabel () {
      const selectedSortOrder = this.sortOptions.find(sortOption => sortOption.id === this.sortOrder) || {}
      return selectedSortOrder.label || ''
    },
    availableFilters () {
      return Object.entries(this.getAvailableFilters || {})
        .filter(([filterType, filters]) => {
          return (
            filters.length && !this.getSystemFilterNames.includes(filterType)
          );
        })
        .reduce((result, [filterType, filters]) => {
          result[`${filterType}_filter`] = filters.map(filter => ({
            ...filter,
            count: this.getFilterCount(filter) || '',
            color:
              filterType === 'color'
                ? (config.products.colorMappings &&
                    config.products.colorMappings[filter.label]) ||
                  filter.label
                : undefined
          }));
          return result;
        }, {});
    },
    activeFiltersCount () {
      let counter = 0
      Object.keys(this.getCurrentFilters).forEach(key => {
        counter += this.getCurrentFilters[key].length
      })
      return counter
    },
    isFilterActive () {
      return filter =>
        castArray(this.getCurrentFilters[filter.type]).find(
          variant => variant && variant.id === filter.id
        ) !== undefined;
    }
  },
  watch: {
    sortOrder () {
      if (this.currentPage > 1) {
        this.changePage();
      }
    }
  },
  async asyncData ({ store, route }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route);
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next();
    // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true;
        await composeInitialPageState(vm.$store, to, true);
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }); // await here is because we must wait for the hydration
        vm.loading = false;
      });
    } else {
      // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true;
        vm.$store.dispatch('category-next/cacheProducts', { route: to });
        vm.loading = false;
      });
    }
  },
  mounted () {
    this.unsubscribeFromStoreAction = this.$store.subscribeAction(action => {
      if (action.type === 'category-next/loadAvailableFiltersFrom') {
        this.aggregations = action.payload.aggregations;
      }
    });
    this.$bus.$on('product-after-list', this.initPagination);
    window.addEventListener('resize', this.getBrowserWidth);
    this.getBrowserWidth();
  },
  beforeDestroy () {
    this.unsubscribeFromStoreAction();
    this.$bus.$off('product-after-list', this.initPagination);
    window.removeEventListener('resize', this.getBrowserWidth);
  },
  methods: {
    getBrowserWidth () {
      return (this.browserWidth = window.innerWidth);
    },
    async onBottomScroll () {
      if (!this.isLazyLoadingEnabled || this.loadingProducts) {
        return;
      }

      this.loadingProducts = true;
      await this.$store.dispatch('category-next/loadMoreCategoryProducts');
      this.loadingProducts = false;
    },
    async changePage (page = this.currentPage) {
      const start = (page - 1) * THEME_PAGE_SIZE;

      if (
        start < 0 ||
        start >= this.getCategoryProductsTotal ||
        this.getCategoryProductsTotal < THEME_PAGE_SIZE
      ) {
        return;
      }

      const { includeFields, excludeFields } = config.entities.productList;
      const { filters } = this.getCurrentSearchQuery;
      const filterQuery = buildFilterProductsQuery(
        this.getCurrentCategory,
        filters
      );

      const searchResult = await quickSearchByQuery({
        query: filterQuery,
        sort: this.sortOrder,
        start: start,
        size: THEME_PAGE_SIZE,
        includeFields: includeFields,
        excludeFields: excludeFields
      });

      this.getMoreCategoryProducts = await this.$store.dispatch(
        'category-next/processCategoryProducts',
        {
          products: searchResult.items,
          filters: filters
        }
      );

      this.currentPage = page;
    },
    initPagination () {
      this.currentPage = 1;
    },
    prepareCategoryMenuItem (category) {
      if (!category) return;

      return {
        id: category.id,
        name: category.name,
        path: category.path,
        link: formatCategoryLink(category),
        count: category.product_count || '',
        position: category.position
      };
    },
    changeSortOder (sortOrder) {
      if (this.getCurrentSearchQuery.sort !== sortOrder) {
        this.$store.dispatch('category-next/switchSearchFilters', [
          { id: sortOrder, type: 'sort' }
        ]);
      }
    },
    changeFilter (filter) {
      this.$store.dispatch('category-next/switchSearchFilters', [filter]);
    },
    clearAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters');
    },
    getFilterCount (filter) {
      const aggregations = [
        `agg_range_${filter.type}`,
        `agg_terms_${filter.type}`,
        `agg_terms_${filter.type}_options`
      ];

      return aggregations
        .reduce((result, aggregation) => {
          const bucket =
            this.aggregations &&
            this.aggregations[aggregation] &&
            this.aggregations[aggregation].buckets.find(
              bucket => String(bucket.key) === String(filter.id)
            );

          return bucket ? result + bucket.doc_count : result;
        }, 0);
    },
    isCategoryActive (category) {
      if (!this.getCurrentCategory.path) {
        return false;
      }

      // The 'View all' sub-category (always at position 0) should be marked as active only if it exactly matches current category path,
      // but all other sub-categories will be marked as active when current category path belongs to them.
      return category.position === 0
        ? this.getCurrentCategory.path === category.path
        : this.getCurrentCategory.path.startsWith(category.path);
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    const {
      meta_title,
      meta_description,
      name,
      slug
    } = this.getCurrentCategory;
    const meta = meta_description
      ? [
        {
          vmid: 'description',
          name: 'description',
          content: htmlDecode(meta_description)
        }
      ]
      : [];

    return {
      title: htmlDecode(meta_title || name),
      meta
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.breadcrumbs {
  padding: var(--spacer-big) var(--spacer-extra-big) var(--spacer-extra-big);
}
.main {
  display: flex;
}
.navbar {
  position: relative;
  display: flex;
  font: 300 var(--font-size-small) / 1.6 var(--body-font-family-primary);
  @include for-desktop {
    border-top: 1px solid var(--c-light);
    border-bottom: 1px solid var(--c-light);
  }
  &::after {
    position: absolute;
    bottom: 0;
    left: var(--spacer-big);
    width: calc(100% - calc(var(--spacer-big) * 2));
    height: 1px;
    background-color: var(--c-light);
    content: "";
    @include for-desktop {
      content: none;
    }
  }
  &__aside,
  &__main {
    display: flex;
    align-items: center;
    padding: var(--spacer-medium) 0;
    font-size: var(--font-size-small);
    line-height: 1.6;
    @include for-desktop {
      padding: var(--spacer-big) 0;
    }
  }
  &__aside {
    flex: 0 0 15%;
    padding: var(--spacer-big) var(--spacer-extra-big);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__main {
    flex: 1;
  }
  &__title {
    padding: 0;
    font-size: var(--font-size-big);
    font-family: var(--body-font-family-secondary);
    font-weight: 500;
    line-height: 1.6;
  }
  &__filters-button {
    --button-text-decoration: none;
    --button-font-weight: var(--body-font-weight-secondary);
    --button-color: var(--c-text);
    --button-transition: all 150ms linear;
    display: flex;
    align-items: center;
    @include for-desktop {
      margin: 0 0 0 var(--spacer-extra-big);
    }
    svg {
      fill: var(--c-text-muted);
    }
    &:hover {
      --button-color: var(--c-primary);
      svg {
        fill: var(--c-primary);
      }
    }
  }
  &__filters-clear-all {
    --button-text-decoration: none;
    --button-font-weight: var(--body-font-weight-secondary);
    --button-color: var(--c-text);
    --button-transition: all 150ms linear;
    background: none;
    padding: 0;
    border: none;
    cursor: pointer;
    &:hover {
      --button-color: var(--c-primary);
    }
  }
  &__label {
    color: var(--c-text-muted);
  }
  &__sort {
    display: flex;
    align-items: center;
    margin: 0 auto 0 var(--spacer-extra-big);
    --select-font-size: var(--font-size-small);
    @include for-mobile {
      order: 1;
      margin: 0;
    }
  }
  &__counter {
    margin: auto;
    @include for-desktop {
      margin: auto 0 auto auto;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0 calc(var(--spacer) * -1);
  @include for-desktop {
    margin: var(--spacer-big);
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__product-card {
    --product-card-padding: var(--spacer);
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-padding: var(--spacer-big);
      flex: 1 1 25%;
    }
  }
  &__product-card-horizontal {
    --product-card-horizontal-padding: var(--spacer);
    flex: 0 0 100%;
    @include for-desktop {
      --product-card-horizontal-padding: var(--spacer-big);
    }
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  &__pagination {
    @include for-desktop {
      display: flex;
      justify-content: center;
      margin: var(--spacer-extra-big) 0 0 0;
    }
  }
}
.section {
  padding-left: var(--spacer-big);
  padding-right: var(--spacer-big);
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-extra-big);
  border-right: 1px solid var(--c-light);
  .sf-menu-item {
    font-weight: inherit;
    &--active {
      font-weight: bold;
    }
  }
}
.sort-by {
  flex: unset;
  width: 11.875rem;
  cursor: pointer;
  --select-dropdown-z-index: 10;
  @include for-mobile {
    width: auto;
  }
}
.filters {
  padding: var(--spacer-big);
  &__title {
    margin: calc(var(--spacer-big) * 3) 0 var(--spacer-big) 0;
    font: 400 var(--font-size-extra-big) / 1.6 var(--body-font-family-secondary);
    line-height: 1.6;
    &:first-child {
      margin: 0 0 var(--spacer-big) 0;
    }
  }
  &__colors {
    margin: calc(var(--spacer) * -1);
  }
  &__color {
    margin: var(--spacer);
  }
  &__item {
    margin: var(--spacer) 0;
  }
  &__buttons {
    margin: calc(var(--spacer-big) * 3) 0 0 0;
    @include for-mobile {
      margin: calc(var(--spacer-big) * 3) 0;
    }
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: 0.625rem 0 0 0;
  }
}
</style>

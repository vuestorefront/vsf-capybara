<template>
  <div id="category">
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link" class="sf-breadcrumbs__breadcrumb">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <div class="main section">
      <div class="sidebar desktop-only">
         <div class="navbar__aside desktop-only">
          <SfHeading :level="3" :title="$t('Categories')" class="navbar__title text-primary" />
        </div> 
        <SfAccordion :show-chevron="false" :open="getParentCategoryName">
          <SfAccordionItem
            v-for="category in categories"
            :key="category.id"
            :header="category.name"
          >
            <template #header>
             <router-link  :to="category.link">
                {{ category.name }}
              </router-link>  
            </template>  
            <SfList class="list">
              <SfListItem v-for="item in category.items" :key="item.id" class="list__item">
                <router-link :to="item.link" :class="{'sf-menu-item--active': isCategoryActive(item)}">
                  <SfMenuItem :label="item.name" :count="item.count" />
                </router-link>
              </SfListItem>
            </SfList>
          </SfAccordionItem>
        </SfAccordion>
      </div>
      <div class="products">
         <div class="navbar section">
              <div class="navbar__main">
                <SfButton
                  class="sf-button--text navbar__filters-button"
                  @click="isFilterSidebarOpen = true"
                >
                  <span>
                    {{ $t("Filters") }}
                  </span>
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
                <!--
                  <div class="navbar__sort">
                    <span class="navbar__label">{{ $t("Sort By") }}:</span>
                    <SfSelect
                      class="navbar__select sort-by"
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
                -->
                <div class="navbar__sort d-flex"> 
                  <p><b>Tri:</b></p>
                  <SfButton class="sf-button--text" @click="OrderProducthHightoLow">High to Low</SfButton>
                  <SfButton class="sf-button--text" @click="OrderProducthLowtoHigh">Low to High</SfButton>
                </div>
                <div class="navbar__counter">
                   <span class="navbar__label">
                      {{ getProductDisplayString( getCategoryProductsTotal )}}
                      <strong >{{ getCategoryProductsTotal }}<span>{{ $t(" products)")}}</span></strong>
                   </span>
                </div>

                <div class="product-view d-flex">
                    <SfButton class="sf-button--text product-grid">
                    </SfButton>
                    <SfButton class="sf-button--text product-list">
                    </SfButton>
                </div>
            </div> 
        </div>  
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
            <transition-group
              appear
              name="products__slide"
              tag="div"
              class="products__grid"
            >
              <SfProductCard
                v-for="product in products"
                :key="product.id"  
                :image="product.image"  
                :link="product.link"
                link-tag="router-link"
                :wishlist-icon="wishlistIcon"
                :is-on-wishlist-icon="isOnWishlistIcon"
                :is-on-wishlist="isOnWishlist"
                :show-add-to-cart-button="showAddToCartButton"
                :add-to-cart-disabled="addToCartDisabled"
                :is-added-to-cart="isAddedToCart"
                @click:is-added-to-cart="alert('@click:is-added-to-cart')"
                @click:wishlist="alert('@click:wishlist')"
                @click:reviews="alert('@click:reviews')"
                class="products__product-card">
                <template #title>
                  <h3 class="sf-product-card__title">
                      {{ product.title }}
                  </h3>
                  <p class="reference">
                     Ref : {{ product.sku }}
                  </p> 
                  
                  <AProductRating />
                  <div class="d-flex align-start justify-between">
                      <SfPrice
                        class="sf-product-card__price"
                        :regular="product.price.regular"
                        :special="product.price.special" 
                      />  
                      <p class="stock" v-if="product.is_in_stock">In stock</p>
                      <p class="out-of-stock" v-else>Out of stock</p> 
                  </div>
                </template> 
                 <template #price>
                    <AAddToCart
                    class="sf-add-to-cart__button"
                    :qty="qty"
                    :product="product.obj_product"
                    :disabled="isProductDisabled(product)"
                  />  
                  </template>
                  <template #image>
                      <div class="sf-image sf-product-card__image sf-image--has-size" data-loaded="true" style="--_image-width:216;--_image-height:326;">
                        <img width="216" height="326" alt="" style="" :src="product.image" @error="$event.target.src='assets/placeholder.jpg'"/> 
                      </div>
                  </template>
              </SfProductCard>
            </transition-group>
          </lazy-hydrate>

          <lazy-hydrate :trigger-hydration="!loading">
            <transition-group
              appear
              name="products__slide"
              tag="div"
              class="products-list"
            >
                <SfProductCardHorizontal
                     v-for="product in products"
                    :key="product.id"  
                    :image="product.image"  
                    :title="product.title"
                    :link="product.link"
                    :link-tag="router-link"
                    :regular-price="regularPrice"
                    :special-price="specialPrice"
                    :score-rating="scoreRating"
                    :max-rating="maxRating"
                    :reviews-count="reviewsCount"
                    :description="product.description"
                  >
                  <template #image>
                      <div class="sf-image sf-product-card__image sf-image--has-size" data-loaded="true" style="--_image-width:216;--_image-height:326;">
                        <img width="216" height="326" alt="" style="" :src="product.image" @error="$event.target.src='assets/placeholder.jpg'"/> 
                      </div>
                  </template>
                  <template #title>
                    <h3 class="sf-product-card__title">
                        {{ product.title }}
                    </h3>
                    <p class="reference">
                      Ref : {{ product.sku }}
                    </p> 
                    
                    <AProductRating />
                    <div class="product__description " v-html="product.description" />
                  </template> 
                 <template #price>
                      <p class="stock" v-if="product.is_in_stock">In stock</p>
                      <p class="out-of-stock" v-else>Out of stock</p> 
                      <SfPrice
                        class="sf-product-card__price"
                        :regular="product.price.regular"
                        :special="product.price.special" 
                      />  
                    
                      <AAddToCart
                      class="sf-add-to-cart__button"
                      :qty="qty"
                      :product="product.obj_product"
                      :disabled="isProductDisabled(product)"
                    />  
                  </template>
                    
                  </SfProductCardHorizontal>
            </transition-group>
          </lazy-hydrate>

          <SfPagination
            v-if="totalPages > 1"
            class="products__pagination desktop-only"
            :current="currentPage"
            :total="totalPages"
            :visible="3"
          />
        </template>
      </div>
    </div>
    <SfSidebar
      :visible="isFilterSidebarOpen"
      :title="$t('Filters')"
      class="sidebar-filters"
      @close="isFilterSidebarOpen = false"
    >
      <div class="filters">
        <template v-for="(filters, filterType) in availableFilters">
          <SfHeading :level="4" :title="$t(filterType)" :key="filterType" class="filters__title sf-heading--left" />
          <template v-if="filterType === 'color_filter'">
            <div class="filters__colors" :key="filterType + 'filter'">
              <SfColor
                v-for="filter in filters"
                :key="filter.id"
                :color="filter.color"
                :selected="isFilterActive(filter)"
                class="filters__color"
                @click="changeFilter(filter)"
              />
            </div>
          </template>
          <template v-else>
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
        </template>
      </div>
      <template #content-bottom>
        <div class="filters__buttons">
          <SfButton
            class="sf-button--full-width btn-primary"
            @click="isFilterSidebarOpen = false"
          >
            {{ $t("Done") }}
          </SfButton>
          <SfButton
            class="sf-button--full-width filters__button-clear a-add-to-cart"
            @click="clearAllFilters"
          >
            {{ $t("Clear all") }}
          </SfButton>
        </div>
      </template>
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
import { getTopLevelCategories, prepareCategoryMenuItem, prepareCategoryProduct } from 'theme/helpers';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { getProductPrice } from 'theme/helpers';
import AAddToCart from 'theme/components/atoms/a-add-to-cart';
import AProductRating from 'theme/components/atoms/a-product-rating';


import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import ASortIcon from 'theme/components/atoms/a-sort-icon';
import {
  SfList,
  SfColor,
  SfButton,
  SfIcon,
  SfFilter,
  SfSidebar,
  SfHeading,
  SfMenuItem,
  SfAccordion,
  SfPagination,
  SfBreadcrumbs,
  SfProductCard,
  SfProductCardHorizontal,
  SfPrice,
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
    SfList,
    SfColor,
    SfButton,
    SfIcon,
    SfFilter,
    SfSidebar,
    SfHeading,
    SfMenuItem,
    SfAccordion,
    SfPagination,
    SfBreadcrumbs,
    SfProductCard,
    SfProductCardHorizontal,
    SfPrice,
    AAddToCart,
    AProductRating,
  },
  props: 
  {
    qty: {
      type: Number,
      default: 1
    }
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
      aggregations: null,
      wishlistIcon: "heart",
      isOnWishlistIcon: "heart_fill",
      isOnWishlist: false,
      showAddToCartButton: false,
      isAddedToCart: true,
      addToCartDisabled: false
    };
  },
  computed: {
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
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent',
       getCurrentProduct: 'product/getCurrentProduct',
    }), 
    getParentCategoryName(){ 
      const categoryUrl = this.getCurrentCategory.url_path;      
      if( categoryUrl.includes("gardening/")){
        return "Gardening";
      } 

      if( categoryUrl.includes("gardening-hand-tools")){
        return "Hand Tools";
      } 

      if( categoryUrl.includes("power-tools")){
        return "Power Tools";
      } 

      if( categoryUrl.includes("generators")){
        return "Generators";
      } 
      
      if( categoryUrl.includes("workshop")){
        return "Workshop";
      } 
      
      if( categoryUrl.includes("brands")){
        return "Brands";
      } 
      return "Gardening";
    },
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
              .map(subCategory => prepareCategoryMenuItem(
                this.getCategories.find(category => category.id === subCategory.id)
              ))
              .filter(Boolean)
            : [];

          return {
           ...prepareCategoryMenuItem(category),
            items: [...subCategories]
          };
        })
        .sort((a, b) => a.position - b.position);
    },
    products () {
      // lazy loading is disabled for desktop screen width (>= 1024px)
      // so products from store have to be filtered out because there could
      // be more than THEME_PAGE_SIZE of them - they could be fetched earlier
      // when lazy loading was enabled
      return  this.isLazyLoadingEnabled || this.currentPage === 1
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
    },
    $route: {
      immediate: true,
      handler (to, from) {
        if (to.query.page) {
          this.changePage(parseInt(to.query.page) || 1);
        }
      }
    }
  },
  async asyncData ({ store, route, context }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add('category')
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
    isProductDisabled ( product ) {
      return product.is_in_stock ? false : true ;
    },
    getProductDisplayString( getCategoryProductsTotal )
    {
      if( getCategoryProductsTotal === 0 ) {
      // No Products
        return "(Results 0 - "+getCategoryProductsTotal+" of ";
      }
      else if( getCategoryProductsTotal <= THEME_PAGE_SIZE ) {
      // Product count less than theme_page_size ( 12 )

        return "(Results 1 - "+getCategoryProductsTotal+" of ";
      } else {
      // Product count above theme page size
        if( ( this.currentPage * THEME_PAGE_SIZE ) < getCategoryProductsTotal )
        {
          const ending_count = this.currentPage * THEME_PAGE_SIZE;
          const starting_count = ending_count - ( THEME_PAGE_SIZE - 1 );
          return "(Results "+starting_count+" - "+ending_count+" of ";
        }
        else
        {
          const starting_count = ( ( THEME_PAGE_SIZE * ( this.currentPage - 1 ) ) + 1 );
          return "(Results "+starting_count+" - "+getCategoryProductsTotal+" of ";
        }
      }
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
    OrderProducthHightoLow ()
    {
      this.$store.dispatch('category-next/switchSearchFilters', [
        { id: "final_price:desc", type: 'sort' }
      ]);
    },
    OrderProducthLowtoHigh ()
    {
      this.$store.dispatch('category-next/switchSearchFilters', [
        { id: "final_price", type: 'sort' }
      ]);
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
    max-width: 1700px;
    margin: 0 auto;
  }
}

.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
      margin-bottom: 120px;
    }
  }
}
.breadcrumbs {
  padding: var(--spacer-base) var(--spacer-base) var(--spacer-base) var(--spacer-sm);
}
.navbar {
    position: relative;
    display: flex;
    border: 1px solid var(--c-light);
    border-radius: 5px;
    margin-bottom: var(--spacer-lg);
    &.section {
      padding: var(--spacer-sm);
      @include for-desktop {
        padding: 0;
      }
    }
    &__aside,
    &__main {
      display: flex;
      align-items: center;
      padding: var(--spacer-sm) 0;
    }
    &__aside {
      flex: 0 0 15%;
    }
    &__main {
      flex: 1;
      padding: 0;
      *{
        font-size: 13px!important;
      }
      span{
          font-family: 'Poppins-Bold';
          color: var(--_c-dark-primary);
      }
      @include for-desktop {
        padding: var(--spacer-xs) var(--spacer-sm);
      }
    }
    &__title {
      --heading-title-font-weight: var(--font-light);
      --heading-title-font-size: var(--font-xl);
    }
    &__filters-button {
      display: flex;
      align-items: center;
      font-size: 1rem;
      svg {
        fill: var(--c-text-muted);
        transition: fill 150ms ease;
      }
      &:hover {
        svg {
          fill: var(--c-primary);
        }
      }
      @include for-mobile {
        --button-text-transform: uppercase;
        font-size: var(--font-xs);
        &.sort-by__button {
          order: 1;
        }
      }
    }
    &__filters-icon {
      margin: 0 var(--spacer-sm) 0 0;
    }
    &__label {
      font-family: var(--font-family-secondary);
      font-weight: var(--font-normal);
      color: var(--c-text-muted);
      margin: 0 var(--spacer-2xs) 0 0;
      @include for-mobile {
        font-size: var(--font-xs);
      }
    }
    &__select {
      --select-padding: 0;
      --select-margin: 0;
      --select-selected-padding: 0;
      font-size: 13px!important;
      border: 1px solid var(--c-light);
      border-radius: 3px;
    }
    &__sort {
      display: flex;
      align-items: center;
      margin: 0 auto 0 var(--spacer-2xl);
      @include for-mobile {
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        --select-dropdown-z-index: 2;
        ::v-deep .sf-select__cancel {
          margin: 16px;
          box-shadow: 4px 12px 24px rgba(119, 121, 122, 0.25);
          --button-width: calc(100% - 32px);
        }
      .sf-select__selected.sf-select-option{
        font-size: 13px!important;
      }
    }
    &__counter {
      font-family: var(--font-family-secondary);
      margin: 0;
    }
    &__view {
      display: flex;
      align-items: center;
      margin: 0 var(--spacer-xl);
      @include for-desktop {
        margin: 0 0 0 var(--spacer-2xl);
      }
      &-icon {
        cursor: pointer;
      }
      &-label {
        margin: 0 var(--spacer-sm) 0 0;
        font: var(--font-medium) var(--font-xs) / 1.6 var(--font-family-secondary);
        text-decoration: underline;
      }
    }
  }
}
.sort-by {
  --select-dropdown-z-index: 2;
  flex: unset;
  ::v-deep {
    .sf-select__dropdown {
      min-width: max-content;
    }
    .sf-select-option {
      cursor: pointer;
    }
  }
}
.main {
  display: flex;
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
}
.sidebar-filters {
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
}
.list {
  --menu-item-font-size: var(--font-sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
  }
}
  

.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__grid {
    justify-content: space-between;
  }
  &__product-card {
    --product-card-max-width: 50%;
    flex: 1 1 44%;
    border: 1px solid var(--c-light);
    border-radius: 3px;
    margin: 10px;  
 
  }


 
  &__product-card-horizontal {
    flex: 0 0 100%;
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  @include for-desktop {
    margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    &__pagination {
      display: flex;
      justify-content: center;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 23%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
}
.filters {
  &__title {
    --heading-title-font-size: var(--font-xl);
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
    &:first-child {
      margin: calc(var(--spacer-xl) + var(--spacer-base)) 0 var(--spacer-xs) 0;
    }
  }
  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
  }
  &__item {
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    padding: var(--spacer-sm) 0;
    border-bottom: 1px solid var(--c-light);
    &:last-child {
      border-bottom: 0;
    }
    @include for-desktop {
      --checkbox-padding: 0;
      margin: var(--spacer-sm) 0;
      border: 0;
      padding: 0;
    }
  }
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
} 


</style>

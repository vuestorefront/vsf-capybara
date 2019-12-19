<template>
  <div id="category">
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <h1 class="navbar__title">Categories</h1>
      </div>
      <div class="navbar__main">
        <SfButton class="navbar__filters-button">
          <SfIcon size="15px" style="margin-right: 10px;">
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g clip-icon="url(#clip0)">
                <path
                  d="m2.461 6.9416e-6h-0.1786c-1.113 0.0021094-2.0151 0.90421-2.0173 2.018v0.17859c-0.001406 0.53649 0.21024 1.0512 0.58851 1.4316 0.37829 0.38039 0.89226 0.59414 1.4287 0.59555h0.1786c0.53859 0.0014 1.0547-0.21165 1.4358-0.59204 0.38039-0.38039 0.59344-0.89719 0.59203-1.4351v-0.17859c-0.0014-0.53649-0.21585-1.0505-0.59554-1.4295-0.3804-0.37829-0.89581-0.58991-1.4323-0.58851zm1.452 2.1965c0.00141 0.38531-0.15047 0.75585-0.42329 1.028-0.27281 0.27281-0.64265 0.42539-1.0287 0.42329h-0.1786c-0.3839-7.1e-4 -0.75164-0.15399-1.0223-0.4261-0.27-0.27281-0.42117-0.64125-0.41906-1.0252v-0.1786c7.03e-4 -0.79594 0.64616-1.4407 1.4414-1.4421h0.1786c0.3839-0.00211 0.75305 0.14906 1.0252 0.41976 0.27281 0.27 0.4261 0.63844 0.4268 1.0223v0.1786z"
                />
                <path
                  d="m9.0959 0h-0.19265c-1.1109 0.005625-2.0095 0.90634-2.0117 2.018v0.17859c-0.00281 1.1145 0.89719 2.0214 2.0117 2.0272h0.19265c1.1145-0.00562 2.0144-0.91265 2.0117-2.0272v-0.17859c-0.0021-1.1116-0.9007-2.0124-2.0117-2.018zm1.4421 2.1965h-7e-4c0.0022 0.3839-0.149 0.75235-0.4197 1.0252-0.27001 0.27211-0.63846 0.4254-1.0217 0.4261h-0.19265c-0.79524-0.00141-1.4407-0.64616-1.4414-1.4421v-0.17859c-0.00211-0.3839 0.14907-0.75235 0.41976-1.0252 0.27-0.27211 0.63845-0.4254 1.0216-0.4261h0.19265c0.79524 0.001406 1.4407 0.64616 1.4414 1.4421l7e-4 0.17859z"
                />
                <path
                  d="m15.718 6.9631e-6h-0.1786c-0.5364-0.0014063-1.0518 0.21024-1.4322 0.58851-0.3797 0.37899-0.5942 0.89296-0.5956 1.4295v0.17859c-0.0014 0.5379 0.2117 1.0547 0.5921 1.4351 0.3811 0.38039 0.8972 0.59344 1.4358 0.59204h0.1786c0.5364-0.00141 1.0504-0.21516 1.4287-0.59555s0.5899-0.89509 0.5885-1.4316v-0.17859c-0.0021-1.1138-0.9042-2.0158-2.0172-2.018h-1e-4zm1.4414 2.1965c0.0022 0.3839-0.149 0.75234-0.419 1.0252-0.2707 0.27211-0.6385 0.42539-1.0224 0.4261h-0.1786c-0.386 0.00211-0.7558-0.15047-1.0286-0.42329-0.2728-0.27211-0.4247-0.64265-0.4233-1.028v-0.1786c7e-4 -0.3839 0.154-0.75234 0.4268-1.0223 0.2721-0.2707 0.6412-0.42188 1.0251-0.41976h0.1786c0.7953 0.001406 1.4407 0.64616 1.4414 1.4421v0.1786z"
                />
                <path
                  d="m2.461 6.8921h-0.17859c-1.1138 0.00211-2.0165 0.90562-2.0173 2.0194v0.17859c0.002109 1.1138 0.90421 2.0158 2.0173 2.018h0.17859c0.53719 0.0014 1.0526-0.2103 1.433-0.5892 0.3804-0.379 0.59415-0.89369 0.59485-1.4302v-0.1786c-0.00141-0.53649-0.21586-1.0505-0.59555-1.4294-0.38039-0.37829-0.89579-0.58991-1.4323-0.58851v-7e-5zm1.452 2.1965c-0.0014 0.79524-0.64616 1.4407-1.4421 1.4414h-0.1786c-0.3839 0.0021-0.75305-0.149-1.0252-0.419-0.27211-0.27073-0.4254-0.63847-0.4261-1.0224v-0.1786c7.03e-4 -0.79594 0.64617-1.4407 1.4414-1.4421h0.17859c0.38461-0.00211 0.75375 0.14906 1.0259 0.42046 0.2728 0.2707 0.42609 0.63915 0.42609 1.023v0.17719z"
                />
                <path
                  d="m9.0959 6.8921h-0.19266c-1.1116 0.00562-2.0102 0.90774-2.0117 2.0194v0.17859c0.00211 1.1116 0.9007 2.0124 2.0117 2.018h0.19266c1.1117-0.0056 2.0103-0.9078 2.0117-2.0194v-0.17859c-0.0021-1.1116-0.9007-2.0124-2.0117-2.018zm1.4421 2.1965h-7e-4c0 0.79664-0.64542 1.4421-1.4414 1.4435h-0.19266c-0.79524-0.0014-1.4407-0.64612-1.4414-1.4421v-0.17859c0-0.79664 0.64546-1.4421 1.4414-1.4435h0.19266c0.79524 0.00141 1.4407 0.64616 1.4414 1.4421l7e-4 0.1786z"
                />
                <path
                  d="m15.717 6.8922h-0.1786c-0.5371-0.0014-1.0525 0.21024-1.4329 0.58921-0.3804 0.37899-0.5942 0.89367-0.5949 1.4302v0.17859c0.0014 0.53649 0.2159 1.0505 0.5956 1.4295 0.3804 0.3783 0.8958 0.5899 1.4322 0.5885h0.1786c1.1138-0.0021 2.0166-0.9056 2.0173-2.0194v-0.17859c-0.0021-1.1138-0.9042-2.0158-2.0173-2.018v7e-5zm1.4414 2.1965c-7e-4 0.79524-0.6461 1.4407-1.4414 1.4414h-0.1786c-0.3839 0.0021-0.753-0.1491-1.0251-0.4191-0.2728-0.27065-0.4261-0.63839-0.4268-1.0223v-0.17859c0.0014-0.79594 0.6462-1.4407 1.4421-1.4421h0.1786c0.3839-0.00211 0.753 0.14906 1.0259 0.42046 0.2721 0.27071 0.4253 0.63915 0.4253 1.023v0.17719z"
                />
                <path
                  d="m9.0959 13.786h-0.19266c-1.1109 5e-3 -2.0095 0.9064-2.0117 2.0173v0.1786c0.00211 1.1116 0.9007 2.0124 2.0117 2.018h0.19266c1.111-0.0057 2.0096-0.9064 2.0117-2.018v-0.1786c-0.0021-1.1109-0.9007-2.0124-2.0117-2.0173zm1.4421 2.1966l-7e-4 -7e-4c-7e-4 0.7959-0.64612 1.4407-1.4414 1.4421h-0.19266c-0.79524-0.0014-1.4407-0.6462-1.4414-1.4421v-0.1786c7e-4 -0.7953 0.64616-1.4407 1.4414-1.4414h0.19266c0.79524 7e-4 1.4407 0.6461 1.4414 1.4414l7e-4 0.1793z"
                />
              </g>
            </svg>
          </SfIcon>
          Filters
        </SfButton>
        <div class="navbar__sort desktop-only">
          <span class="navbar__label">Sort by:</span>
        </div>
        <div class="navbar__counter">
          <span class="navbar__label desktop-only">
            Products found:
          </span>
          <strong class="desktop-only">{{ getCategoryProductsTotal }}</strong>
          <span class="navbar__label mobile-only">
            {{ $t("{count} items", { count: getCategoryProductsTotal }) }}
          </span>
        </div>
        <div class="navbar__view desktop-only">
          <span>View </span>
          <SfIcon class="navbar__view-icon" size="10px">
            <svg viewBox="0 0 10 10">
              <rect width="2" height="2" fill="#1D1F22" />
              <rect y="4" width="2" height="2" fill="#1D1F22" />
              <rect y="8" width="2" height="2" fill="#1D1F22" />
              <rect x="4" width="2" height="2" fill="#1D1F22" />
              <rect x="4" y="4" width="2" height="2" fill="#1D1F22" />
              <rect x="4" y="8" width="2" height="2" fill="#1D1F22" />
              <rect x="8" width="2" height="2" fill="#1D1F22" />
              <rect x="8" y="4" width="2" height="2" fill="#1D1F22" />
              <rect x="8" y="8" width="2" height="2" fill="#1D1F22" />
            </svg>
          </SfIcon>
          <SfIcon class="navbar__view-icon" size="11px">
            <svg viewBox="0 0 11 10" fill="none">
              <rect width="11" height="2" fill="#BEBFC4" />
              <rect y="8" width="11" height="2" fill="#BEBFC4" />
              <rect y="4" width="7" height="2" fill="#BEBFC4" />
            </svg>
          </SfIcon>
        </div>
        <SfButton class="navbar__filters-button mobile-only">
          Sort by
          <SfIcon size="15px" style="margin-left: 10px;">
            <svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.32809 15.2897L12 11.7644V12.2892L8.13547 16L4.27094 12.2892V11.7644L7.94285 15.2897V6.83165H8.32809L8.32809 15.2897ZM3.67191 0.710288L0 4.23556V3.71082L3.86453 0L7.72906 3.71082V4.23556L4.05715 0.710288V9.16835H3.67191L3.67191 0.710288Z"
              />
            </svg>
          </SfIcon>
        </SfButton>
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
                <router-link :to="item.link">
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
                v-for="product in products"
                :key="product.id"
                :title="product.title"
                :image="product.image"
                :regular-price="product.price.regular"
                :special-price="product.price.special"
                :max-rating="product.rating.max"
                :score-rating="product.rating.score"
                :link="product.link"
                link-tag="a"
                :is-on-wishlist="isOnWishlist(product.data)"
                class="products__product-card"
                @click:wishlist="toggleWishlist(product.data)"
              />
            </div>
          </lazy-hydrate>
          <SfPagination
            class="products__pagination desktop-only"
            :current="currentPage"
            :total="totalPages"
            :visible="3"
            @click="changePage"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from "vue-lazy-hydration";
import { mapGetters } from "vuex";
import config from "config";
import {
  buildFilterProductsQuery,
  productThumbnailPath,
  isServer
} from "@vue-storefront/core/helpers";
import i18n from "@vue-storefront/i18n";
import { price, htmlDecode } from "@vue-storefront/core/filters";
import { quickSearchByQuery } from "@vue-storefront/core/lib/search";
import { getSearchOptionsFromRouteParams } from "@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers";
import { catalogHooksExecutors } from "@vue-storefront/core/modules/catalog-next/hooks";
import {
  formatCategoryLink,
  formatProductLink
} from "@vue-storefront/core/modules/url/helpers";
import {
  localizedRoute,
  currentStoreView
} from "@vue-storefront/core/lib/multistore";
import {
  SfIcon,
  SfList,
  SfButton,
  SfHeading,
  SfMenuItem,
  SfAccordion,
  SfPagination,
  SfBreadcrumbs,
  SfProductCard
} from "@storefront-ui/vue";

const THEME_PAGE_SIZE = 12;

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params);
    const cachedCategory = store.getters["category-next/getCategoryFrom"](
      route.path
    );
    const currentCategory =
      cachedCategory && !forceLoad
        ? cachedCategory
        : await store.dispatch("category-next/loadCategory", { filters });
    await store.dispatch("category-next/loadCategoryProducts", {
      route,
      category: currentCategory,
      pageSize: THEME_PAGE_SIZE
    });
    const breadCrumbsLoader = store.dispatch(
      "category-next/loadCategoryBreadcrumbs",
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
  components: {
    LazyHydrate,
    SfIcon,
    SfList,
    SfButton,
    SfHeading,
    SfMenuItem,
    SfAccordion,
    SfPagination,
    SfBreadcrumbs,
    SfProductCard
  },
  data() {
    return {
      loading: true,
      currentPage: 1,
      getMoreCategoryProducts: []
    };
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: "category-next/getCurrentSearchQuery",
      getCategoryProducts: "category-next/getCategoryProducts",
      getCurrentCategory: "category-next/getCurrentCategory",
      getCategoryProductsTotal: "category-next/getCategoryProductsTotal",
      getAvailableFilters: "category-next/getAvailableFilters",
      getCategories: "category-next/getCategories",
      categoryList: "category/getCategories",
      getBreadcrumbsRoutes: "breadcrumbs/getBreadcrumbsRoutes",
      getBreadcrumbsCurrent: "breadcrumbs/getBreadcrumbsCurrent",
      isOnWishlist: "wishlist/isOnWishlist"
    }),
    isLazyHydrateEnabled() {
      return config.ssr.lazyHydrateFor.includes("category-next.products");
    },
    isCategoryEmpty() {
      return this.getCategoryProductsTotal === 0;
    },
    breadcrumbs() {
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
    categories() {
      return this.prepareCategories(this.getCategories[0].children_data);
    },
    products() {
      return this.currentPage === 1
        ? this.getCategoryProducts.map(this.prepareCategoryProduct)
        : this.getMoreCategoryProducts.map(this.prepareCategoryProduct);
    },
    totalPages() {
      return Math.ceil(this.getCategoryProductsTotal / THEME_PAGE_SIZE);
    }
  },
  async asyncData({ store, route }) {
    // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route);
  },
  async beforeRouteEnter(to, from, next) {
    if (isServer) next();
    // SSR no need to invoke SW caching here
    else if (!from.name) {
      // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true;
        await composeInitialPageState(vm.$store, to, true);
        await vm.$store.dispatch("category-next/cacheProducts", { route: to }); // await here is because we must wait for the hydration
        vm.loading = false;
      });
    } else {
      // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true;
        vm.$store.dispatch("category-next/cacheProducts", { route: to });
        vm.loading = false;
      });
    }
  },
  mounted() {
    this.$bus.$on("product-after-list", this.initPagination);
  },
  destroyed() {
    this.$bus.$off("product-after-list", this.initPagination);
  },
  methods: {
    toggleWishlist(product) {
      const isProductOnWishlist = this.isOnWishlist(product);
      const message = isProductOnWishlist
        ? "Product {productName} has been removed from wishlist!"
        : "Product {productName} has been added to wishlist!";
      const action = isProductOnWishlist
        ? "wishlist/removeItem"
        : "wishlist/addItem";

      this.$store.dispatch(action, product);
      this.$store.dispatch(
        "notification/spawnNotification",
        {
          type: "success",
          message: i18n.t(message, { productName: htmlDecode(product.name) }),
          action1: { label: i18n.t("OK") }
        },
        { root: true }
      );
    },
    async changePage(page) {
      const start = (page - 1) * THEME_PAGE_SIZE;

      if (
        start < 0 ||
        start >= this.getCategoryProductsTotal ||
        this.getCategoryProductsTotal < THEME_PAGE_SIZE
      ) {
        return;
      }

      const { defaultSortBy } = config.products;
      const { includeFields, excludeFields } = config.entities.productList;
      const { filters, sort } = this.getCurrentSearchQuery;
      const filterQuery = buildFilterProductsQuery(
        this.getCurrentCategory,
        filters
      );
      const searchResult = await quickSearchByQuery({
        query: filterQuery,
        sort: sort || `${defaultSortBy.attribute}:${defaultSortBy.order}`,
        start: start,
        size: THEME_PAGE_SIZE,
        includeFields: includeFields,
        excludeFields: excludeFields
      });

      this.getMoreCategoryProducts = await this.$store.dispatch(
        "category-next/processCategoryProducts",
        {
          products: searchResult.items,
          filters: filters
        }
      );

      this.currentPage = page;
    },
    initPagination() {
      this.currentPage = 1;
    },
    prepareCategories(categories, firstItem = []) {
      return categories
        ? categories
            .reduce((result, subCategory) => {
              const category = this.categoryList.find(
                c => c.id === subCategory.id
              );

              if (!category || !category.is_active) {
                return result;
              }

              return result.concat({
                id: category.id,
                name: category.name,
                link: formatCategoryLink(category),
                count: String(category.product_count),
                position: category.position,
                items: this.prepareCategories(subCategory.children_data, [
                  {
                    id: category.id,
                    name: i18n.t("View all"),
                    link: formatCategoryLink(category),
                    count: String(category.product_count),
                    position: 0
                  }
                ])
              });
            }, firstItem)
            .sort((a, b) => a.position - b.position)
        : firstItem;
    },
    prepareCategoryProduct(product) {
      return {
        data: product,
        id: product.id,
        title: htmlDecode(product.name),
        image: this.getThumbnail(
          productThumbnailPath(product),
          config.products.thumbnails.width,
          config.products.thumbnails.height
        ),
        link: formatProductLink(product, currentStoreView().storeCode),
        price: {
          regular: price(parseFloat(product.priceInclTax)),
          special: price(parseFloat(product.specialPriceInclTax))
        },
        rating: {
          max: 5,
          score: 5
        }
      };
    }
  },
  metaInfo() {
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
            vmid: "description",
            name: "description",
            content: htmlDecode(meta_description)
          }
        ]
      : [];
    const categoryLocaliedLink = localizedRoute(
      {
        name: "category-amp",
        params: { slug }
      },
      storeView.storeCode
    );
    const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href;

    return {
      link: [{ rel: "amphtml", href: ampCategoryLink }],
      title: htmlDecode(meta_title || name),
      meta
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/_variables.scss";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.breadcrumbs {
  padding: $spacer-big $spacer-extra-big $spacer-extra-big;
}
.main {
  display: flex;
}
.navbar {
  position: relative;
  display: flex;
  @include for-desktop {
    border-top: 1px solid $c-light;
    border-bottom: 1px solid $c-light;
  }
  &::after {
    position: absolute;
    bottom: 0;
    left: $spacer-big;
    width: calc(100% - (#{$spacer-big} * 2));
    height: 1px;
    background-color: $c-light;
    content: "";
    @include for-desktop {
      content: none;
    }
  }
  &__aside {
    display: flex;
    align-items: center;
    flex: 0 0 15%;
    padding: $spacer-big $spacer-extra-big;
    border-right: 1px solid $c-light;
  }
  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    padding: $spacer-medium 0;
    font-size: $font-size-small-desktop;
    @include for-desktop {
      padding: $spacer-big 0;
    }
  }
  &__title {
    padding: 0;
    font-size: $font-size-big-desktop;
    line-height: 2.23;
  }
  &__filters-button {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: inherit;
    font-weight: 500;
    @include for-desktop {
      margin: 0 0 0 $spacer-extra-big;
      font-weight: 400;
      text-transform: none;
    }
    svg {
      fill: $c-dark;
      @include for-desktop {
        fill: $c-gray-variant;
      }
    }
    &:hover {
      color: $c-primary;
      svg {
        fill: $c-primary;
      }
    }
  }
  &__label {
    color: $c-gray-variant;
  }
  &__sort {
    display: flex;
    align-items: center;
    margin-left: $spacer-extra-big;
    margin-right: auto;
  }
  &__counter {
    margin: auto;
    @include for-desktop {
      margin-right: 0;
    }
  }
  &__view {
    display: flex;
    align-items: center;
    margin: 0 $spacer-extra-big;
    &-icon {
      margin-left: 10px;
    }
  }
}

.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0 -#{$spacer};
  @include for-desktop {
    margin: $spacer-big;
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1.875rem - 0.5rem;
  }
  &__product-card {
    flex: 0 0 50%;
    padding: $spacer;
    @include for-desktop {
      flex: 0 0 25%;
      padding: $spacer-big;
    }
  }
  &__pagination {
    @include for-desktop {
      display: flex;
      justify-content: center;
      margin-top: $spacer-extra-big;
    }
  }
}
.section {
  padding-left: $spacer-big;
  padding-right: $spacer-big;
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
.sidebar {
  flex: 0 0 15%;
  padding: $spacer-extra-big;
  border-right: 1px solid $c-light;
}
.sort-by {
  flex: unset;
  width: 190px;
  padding: 0 10px;
  font-size: inherit;
  &__option {
    padding: 10px;
    font-size: inherit;
  }
}
.filters {
  &__title {
    margin: $spacer-big * 3 0 $spacer-big;
    font-size: $font-size-big-desktop;
    line-height: 1.6;
    &:first-child {
      margin: 0 0 $spacer-big 0;
    }
  }
  &__item {
    padding: $spacer-small 0;
  }
  &__buttons {
    margin: $spacer-big * 3 0 0 0;
  }
  &__button-clear {
    color: #a3a5ad;
    margin-top: 10px;
    background-color: $c-light;
  }
}
</style>

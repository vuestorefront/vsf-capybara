<template>
  <div class="o-search-panel">
    <div
      v-if="noResultsMessage"
      class="no-results"
    >
      {{ $t(noResultsMessage) }}
    </div>
    <div v-else class="container">
      <div class="categories">
        <SfHeading :level="3" :title="$t('Categories')" class="categories__title sf-heading--left" />
        <SfList v-if="visibleProducts.length && categories.length > 0" class="categories__listing">
          <SfListItem
            v-for="category in categories"
            :key="category.category_id"
          >
            <div class="filter_parent">
              <SfFilter
                :key="category.category_id"
                :selected="isCategorySelected(category)"
                @change="toggleCategory(category)"
              />
              <div>
                <SfMenuItem :label="category.name" />
                <div v-for="(item, index) in category.items" :key="index">
                  <div class="child_container">
                    <SfFilter
                      :key="index"
                      :selected="isCategorySelected(item)"
                      @change="toggleCategory(item)"
                    />
                    <router-link :to="item.link">
                      <SfMenuItem :label="item.name" />
                    </router-link>
                  </div>
                  <div v-for="(subitem, i) in item.items" :key="i">
                    <div class="sub_child_container">
                      <SfFilter
                        :key="i"
                        :selected="isCategorySelected(subitem)"
                        @change="toggleCategory(subitem)"
                      />
                      <router-link :to="subitem.link">
                        <SfMenuItem :label="subitem.name" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SfListItem>
        </SfList>
      </div>
      <div class="products">
        <SfHeading :level="3" :title="$t('Product suggestions')" class="products__title sf-heading--left" />
        <div class="products__listing">
          <SfProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            :title="product.title"
            :image="product.image"
            :regular-price="product.price.regular"
            :special-price="product.price.special"
            :max-rating="product.rating.max"
            :score-rating="product.rating.score"
            :link="product.link"
            link-tag="router-link"
            :wishlist-icon="false"
            class="products__product-card"
            @click.native="$store.commit('ui/setSearchpanel', false)"
          />
        </div>
        <SfButton
          v-if="OnlineOnly && readMore && visibleProducts.length >= pageSize"
          class="sf-button--full-width load-more"
          type="button"
          @click="$emit('see-more')"
        >
          {{ $t("Load more") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
import { htmlDecode } from '@vue-storefront/core/filters';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { prepareCategoryProduct, formatFiltersOptions } from 'theme/helpers';
import VueOfflineMixin from 'vue-offline/mixin';
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { SfHeading, SfButton, SfList, SfMenuItem, SfProductCard, SfFilter } from '@storefront-ui/vue';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  name: 'OSearchPanel',
  components: {
    SfButton,
    SfList,
    SfMenuItem,
    SfProductCard,
    SfHeading,
    SfFilter
  },
  mixins: [VueOfflineMixin],
  data () {
    return {
      selectedCategoryIds: []
    };
  },
  props: {
    search: {
      type: String,
      required: true,
      default: ''
    },
    pageSize: {
      type: Number,
      required: true,
      default: 16
    },
    products: {
      type: Array,
      required: true,
      default: () => ([])
    },
    readMore: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'category/getCategories'
    }),
    visibleProducts () {
      const productList = this.selectedCategoryIds.length
        ? this.products.filter(product => product.category_ids.some(categoryId => this.selectedCategoryIds.includes(categoryId)))
        : this.products;

      return productList.map(product => prepareCategoryProduct(product));
    },
    categories () {
      console.log('Your getCategories user are here =+++++++++>', this.getCategories);
      return formatFiltersOptions(this.getCategories, this.products);
    },
    noResultsMessage () {
      return this.search.length < 3
        ? 'Searched term should consist of at least 3 characters.'
        : !this.visibleProducts.length
          ? 'No results were found.'
          : '';
    }
  },
  methods: {
    isCategorySelected (category) {
      return this.selectedCategoryIds.includes(category.id);
    },
    toggleCategory (category) {
      if (this.isCategorySelected(category)) {
        if (category.children_data) {
          category.children_data.map(value => {
            this.selectedCategoryIds = this.selectedCategoryIds.filter(categoryId => categoryId !== value.id);
          })
        }
        this.selectedCategoryIds = this.selectedCategoryIds.filter(categoryId => categoryId !== category.id);
      } else {
        if (category.children_data) {
          category.children_data.map(value => {
            this.selectedCategoryIds.push(value.id);
          })
        }
        this.selectedCategoryIds.push(category.id);
      }
    }
  },
  watch: {
    categories () {
      this.selectedCategoryIds = [];
    }
  },
  mounted () {
    disableBodyScroll(this.$el)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-search-panel {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--_header-height);
  background: var(--c-white);
  overflow: auto;
  max-height: calc(66vh - var(--_header-height));

  @include for-mobile {
    top: auto;
    max-height: calc(100vh - var(--_header-height) - var(--bottom-navigation-height));
  }

  .container {
    display: flex;
    padding: 0 var(--spacer-sm);
    max-width: 1272px;
    margin: auto;
    @include for-desktop {
      border-top: 1px solid var(--c-light);
    }
    @include for-mobile {
      flex-direction: column;
      padding: 0 var(--spacer-xl);
    }
  }

  .categories {
    @include for-desktop {
      flex: 0 0 20%;
      padding-right: 3rem;
      border-right: 1px solid var(--c-light);
    }

    &__title {
      padding: 0;
      margin-top: var(--spacer-base);
      justify-content: start;
    }
    &__listing {
      @include for-desktop {
        margin-top: 2rem;
      }

      .sf-list__item {
        padding: 0.3rem 0;
      }
      .sf-menu-item.selected {
        --menu-item-font-weight: 500;
        text-decoration: underline;
      }
    }
  }

  .products {
    width: 100%;
    &__title {
      padding: 0;
      justify-content: start;
      margin-top: var(--spacer-base);
    }
    &__listing {
      display: flex;
      flex: 0 1 auto;
      flex-wrap: wrap;
    }
    &__product-card {
      --product-card-max-width: 200px;
      flex: 0 1 25%;
      min-width: calc(var(--product-card-max-width) * 0.8);
    }

    @include for-desktop {
      padding-left: 3rem;
    }
  }

  .no-results {
    height: 5rem;
    line-height: 5rem;
    display: flex;
    justify-content: center;
  }

  .load-more {
    margin: var(--spacer-xl) 0;
  }
  .child_container{
    display: flex;
    margin-top: 10px;
    font-weight: 500;
  }
  .sub_child_container{
    display: flex;
    margin-left: 40px;
    margin-top: 10px;
  }
  .filter_parent{
    display: flex;
  }
  .sf-filter{
    width: auto;
  }
}
</style>

<template>
  <div
    class="searchpanel fixed mw-100 bg-cl-primary cl-accent"
    data-testid="searchPanel"
  >
    <div class="close-icon-row">
      <SfIcon
        class="close-icon"
        icon="cross"
        size="xxs"
        color="#4f4f4f"
        @click="closeSearchpanel"
      />
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12 end-xs">
          <div class="search-input-group">
            <SfIcon
              class="search-icon"
              icon="search"
              size="xxs"
              color="#4f4f4f"
            />
            <input
              id="search"
              ref="search"
              v-model="search"
              class="search-panel-input"
              :placeholder="$t('Type what you are looking for...')"
              type="search"
              autofocus="true"
              @input="makeSearch"
              @blur="$v.search.$touch()"
            >
          </div>
        </div>
      </div>
      <div
        v-if="visibleProducts.length && categories.length > 1"
        class="categories"
      >
        <category-panel
          v-model="selectedCategoryIds"
          :categories="categories"
        />
      </div>
      <div class="product-listing row">
        <product-tile
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          @click.native="closeSearchpanel"
        />
        <transition name="fade">
          <div
            v-if="getNoResultsMessage"
            class="no-results relative center-xs h4 col-md-12"
          >
            {{ $t(getNoResultsMessage) }}
          </div>
        </transition>
      </div>
      <div
        v-show="OnlineOnly"
        v-if="visibleProducts.length >= 18"
        class="buttons-set align-center py35 mt20 px40"
      >
        <button
          v-if="readMore"
          class="no-outline brdr-none py15 px20 bg-cl-mine-shaft :bg-cl-th-secondary cl-white fs-medium-small"
          type="button"
          @click="seeMore"
        >
          {{ $t("Load more") }}
        </button>
        <button
          class="no-outline brdr-none p15 fs-medium-small close-button"
          type="button"
          @click="closeSearchpanel"
        >
          {{ $t("Close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SearchPanel from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel';
import ProductTile from './ProductTile';
import VueOfflineMixin from 'vue-offline/mixin';
import CategoryPanel from './CategoryPanel';
import { minLength } from 'vuelidate/lib/validators';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { SfIcon } from '@storefront-ui/vue';

export default {
  components: {
    SfIcon,
    ProductTile,
    CategoryPanel
  },
  mixins: [SearchPanel, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3)
    }
  },
  data () {
    return {
      selectedCategoryIds: []
    };
  },
  computed: {
    visibleProducts () {
      const productList = this.products || [];
      if (this.selectedCategoryIds.length) {
        return productList.filter(product =>
          product.category_ids.some(categoryId => {
            const catId = parseInt(categoryId);
            return this.selectedCategoryIds.includes(catId);
          })
        );
      }
      return productList;
    },
    categories () {
      const categories = this.products
        .filter(p => p.category)
        .map(p => p.category)
        .flat();

      const discinctCategories = Array.from(
        new Set(categories.map(c => c.category_id))
      ).map(catId => categories.find(c => c.category_id === catId));

      return discinctCategories;
    },
    getNoResultsMessage () {
      let msg = '';
      if (!this.$v.search.minLength) {
        msg = 'Searched term should consist of at least 3 characters.';
      } else if (this.emptyResults) {
        msg = 'No results were found.';
      }
      return msg;
    }
  },
  watch: {
    categories () {
      this.selectedCategoryIds = [];
    }
  },
  mounted () {
    // add autofocus to search input field
    this.$refs.search.focus();
    disableBodyScroll(this.$el);
  },
  destroyed () {
    clearAllBodyScrollLocks();
  }
};
</script>

<style lang="scss" scoped>
.searchpanel {
  height: 100vh;
  width: 800px;
  top: 0;
  right: 0;
  z-index: 3;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  .close-icon-row {
    display: flex;
    justify-content: flex-end;
    padding: 18px;
  }

  .container {
    padding-left: 40px;
    padding-right: 40px;

    @media (max-width: 767px) {
      padding-left: 30px;
      padding-right: 30px;
    }
  }

  .product-listing {
    padding-top: 30px;
  }

  .product {
    box-sizing: border-box;
    width: 33.33%;
  }

  .close-icon {
    cursor: pointer;
  }

  .search-input-group {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #bdbdbd;
  }

  .search-icon {
    margin-right: 18px;
  }

  .search-panel-input {
    width: 100%;
    height: 60px;
    padding-bottom: 0;
    padding-top: 0;
    border: none;
    outline: 0;
    font-size: 18px;
    font-family: 'Roboto';

    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  .no-results {
    top: 80px;
    width: 100%;
  }

  i {
    opacity: 0.6;
  }

  i:hover {
    opacity: 1;
  }

  .close-button {
    background: #fff;
  }

  button {
    @media (max-width: 767px) {
      width: 100%;
      margin-bottom: 15px;
    }
  }
}
</style>

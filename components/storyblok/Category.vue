<template>
  <div class="storyblok-category row" v-if="products.length">
    <div v-for="product in productsList" :key="product.sku" class="col-xs-12" :class="[colSizeLg]">
      <product :product="product" />
    </div>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService'
import { CategoryService } from '@vue-storefront/core/data-resolver/CategoryService'
import { SearchQuery } from 'storefront-query-builder'
import ProductModel from 'core/modules/catalog/types/Product';
import { Category } from 'core/modules/catalog-next/types/Category'

import Product from './Product.vue'
import CategoryData from './interfaces/category-data.interface';

export default Blok.extend({
  name: 'StoryblokCategoryBlock',
  components: {
    Product
  },
  data: function () {
    return {
      products: [] as ProductModel[],
      category: undefined as Category | undefined
    }
  },
  computed: {
    itemData (): CategoryData {
      return this.item as CategoryData;
    },
    productsList (): ProductModel[] {
      if (!this.products) {
        return []
      }

      return this.products
    },
    colSizeLg (): string {
      return 'col-lg-' + Math.floor(12 / parseInt(this.itemData.products_count))
    }
  },
  async created (): Promise<void> {
    if (!this.category) {
      await this.loadCategory()
    }

    if (this.products.length) {
      return
    }

    await this.loadProducts()
  },
  methods: {
    async loadCategory (): Promise<void> {
      let categories = await CategoryService.getCategories({
        filters: {
          id: this.itemData.id
        }
      })

      this.category = categories.shift()
    },
    async loadProducts (): Promise<void> {
      let searchQuery = new SearchQuery()
      searchQuery = searchQuery.applyFilter({ key: 'category_ids', value: { 'in': [this.category.id] } })

      let { items } = await ProductService.getProducts({
        query: searchQuery,
        size: +this.itemData.products_count
      })

      this.products = items
    }
  },
  watch: {
    async item (): Promise<void> {
      await this.loadCategory()
      await this.loadProducts()
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-category {

}
</style>

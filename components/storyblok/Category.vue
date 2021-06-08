<template>
  <div class="storyblok-category row" v-if="products.length">
    <div v-for="product in productsList" :key="product.sku" class="col-xs-12" :class="[colSizeLg]">
      <product :product="product" />
    </div>
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService'
import { CategoryService } from '@vue-storefront/core/data-resolver/CategoryService'
import Product from './Product'
import { SearchQuery } from 'storefront-query-builder'

export default {
  name: 'CategoryBlock',
  extends: Blok,
  components: {
    Product
  },
  computed: {
    productsList () {
      if (!this.products) {
        return []
      }
      return this.products
    },
    colSizeLg: function () {
      return 'col-lg-' + Math.floor(12 / this.item.products_count)
    }
  },
  created: async function () {
    if (!this.category) {
      await this.loadCategory()
    }

    if (this.products.length) {
      return
    }

    await this.loadProducts()
  },
  methods: {
    async loadCategory () {
      let categories = await CategoryService.getCategories({
        filters: {
          id: this.item.id
        }
      })

      this.category = categories.shift()
    },
    async loadProducts () {
      let searchQuery = new SearchQuery()
      searchQuery = searchQuery.applyFilter({ key: 'category_ids', value: { 'in': [this.category.id] } })

      let { items } = await ProductService.getProducts({
        query: searchQuery,
        size: +this.item.products_count
      })

      this.products = items
    }
  },
  watch: {
    item: async function () {
      await this.loadCategory()
      await this.loadProducts()
    }
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    category: {
      type: Object,
      default: undefined
    }
  }
}
</script>

<style lang="scss">
.storyblok-category {

}
</style>

import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'

export const homepageStore = {
  namespaced: true,
  state: {
    new_collection: [],
    bestsellers: [],
    block_one_products: [],
    block_two_products: [],
    block_three_products: []
  },
  actions: {
    async fetchNewCollection({ commit, dispatch }) {
      const newProductsQuery = prepareQuery({ queryConfig: 'newProducts' })

      const newProductsResult = await dispatch('product/list', {
        query: newProductsQuery,
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })
      const configuredProducts = await dispatch(
        'category-next/configureProducts',
        {
          products: newProductsResult.items
        }, { root: true })
      commit('SET_NEW_COLLECTION', configuredProducts)
    },
    async loadBestsellers({ commit, dispatch }) {
      const response = await dispatch('product/list', {
        query: prepareQuery({ queryConfig: 'bestSellers' }),
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })

      commit('SET_BESTSELLERS', response.items)
    },
    async blockOneProducts({ commit, dispatch }) {
      const response = await dispatch('product/findProducts', {
        query: prepareQuery({ filters: { key: "id", value: { 'in': [6705, 1122, 984] } } }),
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })

      commit('SET_BLOCKONEPRODUCTS', response.items)
    },
    async blockTwoProducts({ commit, dispatch }) {
      const response = await dispatch('product/findProducts', {
        query: prepareQuery({ filters: { key: "manufacturer", value: { 'eq': "63" } } }),
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })

      commit('SET_BLOCKTWOPRODUCTS', response.items)
    },
    async blockThreeProducts({ commit, dispatch }) {
      const response = await dispatch('product/findProducts', {
        query: prepareQuery({ filters: { key: "engine_make", value: { 'eq': "115" } } }),
        size: 8,
        sort: 'created_at:desc'
      }, { root: true })

      commit('SET_BLOCKTHREEPRODUCTS', response.items)
    }
  },
  mutations: {
    SET_NEW_COLLECTION(state, products) {
      state.new_collection = products || []
    },
    SET_BESTSELLERS(state, bestsellers) {
      state.bestsellers = bestsellers
    },
    SET_BLOCKONEPRODUCTS(state, products) {
      state.block_one_products = products
    },
    SET_BLOCKTWOPRODUCTS(state, products) {
      state.block_two_products = products
    },
    SET_BLOCKTHREEPRODUCTS(state, products) {
      state.block_three_products = products
    }
  },
  getters: {
    getEverythingNewCollection(state) {
      return state.new_collection
    },
    getBestsellers(state) {
      return state.bestsellers
    },
    getBlockOneProducts(state) {
      return state.block_one_products
    },
    getBlockTwoProducts(state) {
      return state.block_two_products
    },
    getBlockThreeProducts(state) {
      return state.block_three_products
    }
  }
}

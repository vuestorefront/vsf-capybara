import { Logger } from '@vue-storefront/core/lib/logger'

export default interface InstagramImagesState {
  images: any[]
}

export const instagramStore = {
  namespaced: true,
  state: {
    images: []
  },
  getters: {
    getInstagramImages: state => {
      return state.images
    }
  },
  actions: {
    async updateInstagramImages ({ commit, rootState }, data) {
      let mainImageResource = rootState.storeView && rootState.storeView.storeCode ? `banners/${rootState.storeView.storeCode}_instagram-images` : `instagram-images`
      try {
        // Workaround to get jest --watch to work so don't change the import sting to a template string
        const imageModule = await import(/* webpackChunkName: "vsf-head-img-[request]" */ 'theme/resource/' + mainImageResource + '.json')
        commit('SET_INSTAGRAM_IMAGES', imageModule.instagramImages)
      } catch (err) {
        Logger.debug('Unable to load headImage' + err)()
      }
    }
  },
  mutations: {
    SET_INSTAGRAM_IMAGES (state, images) {
      state.images = images
    }
  }
}

import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import config from 'config';
import { getContent } from './homepage';

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
    async updateInstagramImages ({ commit }) {
      try {
        // query the api for banner images
        let url = config.images.baseUrl + 'instagram'
        const images = await getContent(url)
        commit('SET_INSTAGRAM_IMAGES', images.instagramImages)
      } catch (err) {
        Logger.debug('Unable to load instagramImages ' + err)()
      }
    }
  },
  mutations: {
    SET_INSTAGRAM_IMAGES (state, images) {
      state.images = images
    }
  }
}

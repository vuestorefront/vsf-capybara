import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import config from 'config';
import { getContent } from './homepage';

export const defaultContentStore = {
  namespaced: true,
  state: {
    content: []
  },
  getters: {
    getDefaultContent: state => state.content.map(item => ({
      title: item.title,
      message: item.message.join(' ')
    }))
  },
  actions: {
    async updateDefaultContent ({ commit, rootState }, data) {
      try {
        // query the api for promoted images
        let url = config.api.url + '/api/default_content'
        const content = await getContent(url)
        commit('SET_DEFAULT_CONTENT', content.content)
      } catch (err) {
        Logger.debug('Unable to load default content ' + err)()
      }
    }
  },
  mutations: {
    SET_DEFAULT_CONTENT (state, content) {
      state.content = content
    }
  }
}

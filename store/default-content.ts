import { Logger } from '@vue-storefront/core/lib/logger'

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
      let defaultContentResource = rootState.storeView && rootState.storeView.storeCode
        ? `${rootState.storeView.storeCode}_default-content`
        : `default-content`
      try {
        const defultContent = await import(/* webpackChunkName: "vsf-default-content-[request]" */ 'theme/resource/' + defaultContentResource + '.json')
        commit('SET_DEFAULT_CONTENT', defultContent.content)
      } catch (err) {
        Logger.debug(`Unable to load ${defaultContentResource}.json file: ${err}`)()
      }
    }
  },
  mutations: {
    SET_DEFAULT_CONTENT (state, content) {
      state.content = content
    }
  }
}

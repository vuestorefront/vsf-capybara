export enum ModalList {
  Review = 'm-review-modal',
  Auth = 'm-authentication-modal'
}

export const modalComponents = new Map([
  [ModalList.Review, () => import(/* webpackChunkName: "vsf-modal-review" */ 'theme/components/molecules/modals/m-modal-review.vue')],
  [ModalList.Auth, () => import(/* webpackChunkName: "vsf-modal-authentication" */ 'theme/components/molecules/modals/m-modal-authentication.vue')]
])

export const modalPayload = new Map([])

export const modalStore = {
  state: {
    activeModals: [],
    loadedModals: []
  },
  getters: {
    activeModals: state => state.activeModals.map((name) => ({
      name,
      payload: modalPayload.get(name)
    })),
    loadedModals: state => state.loadedModals
  },
  mutations: {
    openModal (state, name) {
      if (!state.loadedModals.includes(name)) {
        state.loadedModals = [...state.loadedModals, name];
      }
      state.activeModals = [...state.activeModals, name];
    },
    closeModal (state, name) {
      state.activeModals = state.activeModals.filter(modal => modal !== name);
    }
  },
  actions: {
    openModal ({ commit }, { name, payload }) {
      modalPayload.set(name, payload)
      commit('openModal', name)
    },
    closeModal ({ commit }, { name }) {
      modalPayload.delete(name)
      commit('closeModal', name)
    }
  }
}

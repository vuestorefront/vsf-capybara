/**
 * List of modal names
 */
export enum ModalList {
  Review = 'm-review-modal',
  Auth = 'm-authentication-modal',
  AccountBenefits = 'm-modal-account-benefits',
  TermsAndConditions = 'm-modal-terms-and-conditions',
  Newsletter = 'm-modal-newsletter'
}

/**
 * List of modal components files
 */
export const modalComponents = new Map([
  [ModalList.Review, () => import(/* webpackChunkName: "vsf-modal-review" */ 'theme/components/molecules/modals/m-modal-review.vue')],
  [ModalList.Auth, () => import(/* webpackChunkName: "vsf-modal-authentication" */ 'theme/components/molecules/modals/m-modal-authentication.vue')],
  [ModalList.AccountBenefits, () => import(/* webpackChunkName: "vsf-modal-account-benefits" */ 'theme/components/molecules/modals/m-modal-account-benefits.vue')],
  [ModalList.TermsAndConditions, () => import(/* webpackChunkName: "vsf-modal-terms-and-conditions" */ 'theme/components/molecules/modals/m-modal-terms-and-conditions.vue')],
  [ModalList.Newsletter, () => import(/* webpackChunkName: "vsf-modal-newsletter" */ 'theme/components/molecules/modals/m-modal-newsletter.vue')]
])

/**
 * Optional payload for modal
 */
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
      commit('closeModal', name)
      commit('openModal', name)
    },
    closeModal ({ commit }, { name }) {
      modalPayload.delete(name)
      commit('closeModal', name)
    }
  }
}

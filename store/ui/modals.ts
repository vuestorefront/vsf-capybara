/**
 * List of modal names
 */
export enum ModalList {
  Review = 'm-modal-review',
  Auth = 'm-modal-authentication',
  SizeGuide = 'm-modal-size-guide',
  TermsAndConditions = 'm-modal-terms-and-conditions',
  FeatureNotImplemented = 'm-modal-feature-not-implemented',
  LanguageSwitcher = 'm-modal-language-switcher',
  OrderConfirmation = 'm-modal-order-confirmation',
  Newsletter = 'm-modal-newsletter'
}

/**
 * List of modal components files
 */
export const modalComponents = new Map([
  [ModalList.Review, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-review.vue')],
  [ModalList.Auth, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-authentication.vue')],
  [ModalList.SizeGuide, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-size-guide.vue')],
  [ModalList.TermsAndConditions, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-terms-and-conditions.vue')],
  [ModalList.FeatureNotImplemented, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-feature-not-implemented.vue')],
  [ModalList.LanguageSwitcher, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-language-switcher.vue')],
  [ModalList.OrderConfirmation, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-order-confirmation.vue')],
  [ModalList.Newsletter, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-newsletter.vue')]
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

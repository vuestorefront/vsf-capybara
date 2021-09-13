<template>
  <component
    v-if="isMicrocartOpen || isMicrocartComponentLoaded"
    :is="theMicrocartAsyncComponent"
    @close="$store.commit('ui/setMicrocart')"
    @reload="reloadComponent()"
  />
</template>

<script>
import { mapState } from 'vuex';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const OMicrocartPanel = () =>
  import(/* webpackChunkName: "vsf-microcart" */ 'theme/components/organisms/o-microcart-panel');

export default {
  data () {
    return {
      isMicrocartComponentLoaded: false,
      theMicrocartAsyncComponent: () => ({
        component: OMicrocartPanel().then(component => {
          this.isMicrocartComponentLoaded = true;
          return component;
        }),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    };
  },
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    })
  },
  // watch: {
  //   isMicrocartOpen (state) {
  //     if (state) {
  //       this.$nextTick(() => {
  //         disableBodyScroll(this.$el)
  //       })
  //     } else {
  //       enableBodyScroll(this.$el)
  //     }
  //   }
  // },
  methods: {
    reloadComponent () {
      this.theMicrocartAsyncComponent = () => ({
        component: OMicrocartPanel().then(component => {
          this.isMicrocartComponentLoaded = true;
          return component;
        }),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      });
    }
  }
};
</script>

<template>
  <div class="m-loader" v-show="isVisible">
    <div class="m-loader--container">
      <SfLoader :loading="true" />
      <div v-if="message" class="m-loader--message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SfLoader } from '@storefront-ui/vue';

export default {
  name: 'MLoader',
  components: { SfLoader },
  data () {
    return {
      message: null
    };
  },
  computed: mapState({
    isVisible: state => state.ui.loader
  }),
  beforeMount () {
    this.$bus.$on('notification-progress-start', this.show);
    this.$bus.$on('notification-progress-stop', this.hide);
  },
  beforeDestroy () {
    this.$bus.$off('notification-progress-start', this.show);
    this.$bus.$off('notification-progress-stop', this.hide);
  },
  methods: {
    show (message = null) {
      this.message = message;
      this.$store.commit('ui/setLoader', true);
    },
    hide () {
      this.$store.commit('ui/setLoader', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-loader {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(#000, 0.65);
  z-index: 1001;
  &--container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .sf-loader {
    width: 38px;
    height: 38px;
    margin: 0 auto;
  }
  &--message {
    color: #fff;
    text-align: center;
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
.m-loader {
  .sf-loader__overlay {
    background-color: transparent;
  }
}
</style>

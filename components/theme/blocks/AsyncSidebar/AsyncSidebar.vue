<template>
  <transition
    :name="
      direction === 'right'
        ? 'slide-right'
        : direction === 'left'
          ? 'slide-left'
          : null
    "
  >
    <div
      v-if="isOpen"
      ref="sidebar"
      class="mw-100 fixed cl-accent bg-cl-primary"
      :class="
        direction === 'left'
          ? 'left-sidebar'
          : direction === 'right'
            ? 'right-sidebar'
            : null
      "
      data-testid="sidebar"
    >
      <component
        :is="component"
        @close="$emit('close')"
        @reload="getComponent"
      />
    </div>
  </transition>
</template>

<script>
import LoadingSpinner from 'theme/components/theme/blocks/AsyncSidebar/LoadingSpinner';
import LoadingError from 'theme/components/theme/blocks/AsyncSidebar/LoadingError';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  props: {
    asyncComponent: {
      type: Function,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    /** "right" or "left"  */
    direction: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      component: null
    };
  },
  watch: {
    isOpen (state) {
      if (state) {
        this.$nextTick(() => {
          disableBodyScroll(this.$refs.sidebar);
        });
      } else {
        clearAllBodyScrollLocks();
      }
    }
  },
  created () {
    this.getComponent();
  },
  methods: {
    getComponent () {
      this.component = () => ({
        component: this.asyncComponent(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.right-sidebar {
  top: 0;
  right: 0;
  z-index: 4;
  height: 100%;
  width: 800px;
  min-width: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.left-sidebar {
  height: 100vh;
  width: 350px;
  top: 0;
  left: 0;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 4;

  @media (max-width: 767px) {
    width: 100vh;
  }
}

.close {
  i {
    opacity: 0.6;
  }
  &:hover,
  &:focus {
    i {
      opacity: 1;
    }
  }
}
</style>

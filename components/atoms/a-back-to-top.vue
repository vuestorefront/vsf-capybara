<template>
  <transition name="back-to-top-fade">
    <div
      v-show="visible"
      class="a-back-to-top"
      :style="{ bottom: bottom, right: right }"
      @click="backToTop"
    >
      <SfCircleIcon
        class="a-back-to-top__icon"
        icon="chevron_down"
        icon-size="20px"
        icon-color="white"
        view-box="0 -4 14 14"
      />
    </div>
  </transition>
</template>

<script>
import { SfCircleIcon } from '@storefront-ui/vue';
export default {
  name: 'BackToTop',
  components: {
    SfCircleIcon
  },
  props: {
    text: {
      type: String,
      default: 'Back to top'
    },
    visibleoffset: {
      type: [String, Number],
      default: 600
    },
    visibleoffsetbottom: {
      type: [String, Number],
      default: 0
    },
    right: {
      type: String,
      default: '30px'
    },
    bottom: {
      type: String,
      default: '40px'
    },
    scrollFn: {
      type: Function,
      default: function () {}
    }
  },
  data () {
    return {
      visible: false
    };
  },
  mounted () {
    window.smoothscroll = () => {
      let currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(window.smoothscroll);
        window.scrollTo(0, Math.floor(currentScroll - currentScroll / 5));
      }
    };
    window.addEventListener('scroll', this.catchScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.catchScroll);
  },
  methods: {
    /**
     * Catch window scroll event
     * @return {void}
     */
    catchScroll () {
      const pastTopOffset = window.pageYOffset > parseInt(this.visibleoffset);
      const pastBottomOffset =
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - parseInt(this.visibleoffsetbottom);
      this.visible =
        parseInt(this.visibleoffsetbottom) > 0
          ? pastTopOffset && !pastBottomOffset
          : pastTopOffset;
      this.scrollFn(this);
    },
    /**
     * The function who make the magics
     * @return {void}
     */
    backToTop () {
      window.smoothscroll();
      this.$emit('scrolled');
    }
  }
};
</script>
<style lang="scss" scoped>
.a-back-to-top {
  cursor: pointer;
  position: fixed;
  z-index: 1000;
  &__icon {
    transform: rotate(180deg);
  }
}
</style>

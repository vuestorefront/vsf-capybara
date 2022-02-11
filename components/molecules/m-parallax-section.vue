<template>
  <div
    class="m-parallax-section"
    ref="block"
  >
    <slot name="content" />

    <div
      class="_parallax"
      :style="{ transform }"
      ref="parallax"
    >
      <div class="_image-container">
        <img :src="imageSrc">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';

import { InjectType } from 'src/modules/shared/types/inject-type';

interface InjectedServices {
  window: Window
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MParallaxSection',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    parallaxSpeed: {
      type: Number,
      default: 0.15
    },
    direction: {
      type: String as PropType<'up' | 'down'>,
      default: 'up'
    },
    initialTopPosition: {
      type: Number,
      default: 100
    },
    imageSrc: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      transform: `translateY(0)`
    }
  },
  computed: {
    directionValue () {
      return this.direction === 'down' ? +1 : -1
    }
  },
  mounted (): void {
    this.animateElement();
    this.init();
  },
  methods: {
    animateElement (): void {
      const parentHeight = this.$refs.block.offsetHeight;
      const parallaxHeight = this.$refs.parallax.offsetHeight;
      const availableOffset = parallaxHeight - parentHeight;
      let animationValue = (this.window.scrollY * this.parallaxSpeed);

      if (animationValue <= availableOffset && animationValue >= 0) { // TODO check condition
        this.transform = `translateY(calc(${-this.initialTopPosition}% - ${animationValue * this.directionValue}px))`;
      }
    },
    getParallaxContainer (): Element | undefined {
      return this.$refs.parallax as Element | undefined;
    },
    scrollHandler () {
      const parallaxContainer = this.getParallaxContainer();

      if (!parallaxContainer) {
        return;
      }

      this.window.requestAnimationFrame(() => {
        if (this.isInView(parallaxContainer)) {
          this.animateElement()
        }
      })
    },
    isInView (el: Element) {
      let rect = el.getBoundingClientRect()
      return (
        rect.bottom >= 0 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight)
      )
    },
    init () {
      this.window.addEventListener('scroll', this.scrollHandler, false);
    }
  },
  beforeDestroy () {
    this.window.removeEventListener('scroll', this.scrollHandler, false);
  }
});
</script>

<style lang="scss">
.m-parallax-section {
  position: relative;
  overflow: hidden;

  ._parallax {
    z-index: -1;
    left: 0;
    position: absolute;
    will-change: transform;
    right: 0;
    top: 0;

    ._image-container {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

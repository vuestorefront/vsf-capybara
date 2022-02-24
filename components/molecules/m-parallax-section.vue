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
    direction: {
      type: String as PropType<'up' | 'down'>,
      default: 'up'
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
    directionValue (): number {
      return this.direction === 'down' ? +1 : -1
    },
    initialValue (): number {
      return this.direction === 'down' ? 0 : -100
    }
  },
  mounted (): void {
    this.init();
    this.animateElement();
  },
  methods: {
    animateElement (): void {
      const componentContainer = this.getComponentContainer();

      const availableHeight = (this.window.innerHeight || document.documentElement.clientHeight) + componentContainer.offsetHeight;

      let componentContainerTopPosition = componentContainer.getBoundingClientRect().top + componentContainer.offsetHeight;

      componentContainerTopPosition = componentContainerTopPosition > 0 ? componentContainerTopPosition : 0;
      componentContainerTopPosition = componentContainerTopPosition > availableHeight ? availableHeight : componentContainerTopPosition;

      let animationValue = Math.floor(((availableHeight - componentContainerTopPosition) / availableHeight) * 100);

      this.transform = `translateY(calc(${this.initialValue}% - ${animationValue * this.directionValue}%))`;
    },
    getComponentContainer (): HTMLElement {
      return this.$refs.block as HTMLElement;
    },
    getParallaxContainer (): HTMLElement {
      return this.$refs.parallax as HTMLElement;
    },
    scrollHandler (): void {
      const componentContainer = this.getComponentContainer();

      this.window.requestAnimationFrame(() => {
        if (this.isInView(componentContainer)) {
          this.animateElement();
        }
      })
    },
    isInView (el: HTMLElement): boolean {
      let rect = el.getBoundingClientRect();

      return (
        rect.bottom >= 0 && rect.top <= (this.window.innerHeight || document.documentElement.clientHeight)
      )
    },
    init (): void {
      this.window.addEventListener('scroll', this.scrollHandler, false);
    }
  },
  beforeDestroy (): void {
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
    transition: transform 0.25s;

    ._image-container {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

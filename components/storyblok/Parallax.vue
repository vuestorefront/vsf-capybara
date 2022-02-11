<template>
  <div class="parallax" :style="styles" :class="cssClasses">
    <m-parallax-section
      :parallax-speed="parallaxSpeed"
      :initial-top-position="initialTopPosition"
      :image-src="itemData.image_src"
    >
      <template #content>
        <div class="_content">
          <sb-render v-for="child in itemData.content" :item="child" :key="child.uuid" />
        </div>
      </template>
    </m-parallax-section>
  </div>
</template>

<script lang="ts">
import { Blok, components } from 'src/modules/vsf-storyblok-module/components';
import MParallaxSection from '../molecules/m-parallax-section.vue';

export default Blok.extend({
  name: 'StoryblokParallax',
  components: {
    Block: components.block,
    MParallaxSection
  },
  computed: {
    itemData (): any { // TODO fix type
      return this.item;
    },
    parallaxSpeed (): number {
      return Number.parseInt(this.itemData.parallax_speed, 10);
    },
    initialTopPosition (): number {
      return Number.parseInt(this.itemData.initial_top_position, 10);
    }
  }
})
</script>

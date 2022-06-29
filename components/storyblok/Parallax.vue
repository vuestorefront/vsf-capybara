<template>
  <div class="parallax" :style="styles" :class="cssClasses">
    <m-parallax-section
      :direction="direction"
      :image-src="itemData.image.filename"
      :image-alt="itemData.image.alt"
      :image-title="itemData.image.title"
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
import ParallaxData from './interfaces/parallax-data.interface';
import MParallaxSection from '../molecules/m-parallax-section.vue';

export default Blok.extend({
  name: 'StoryblokParallax',
  components: {
    Block: components.block,
    MParallaxSection
  },
  computed: {
    itemData (): ParallaxData {
      return this.item as ParallaxData;
    },
    direction (): 'up' | 'down' {
      return this.itemData.direction;
    }
  }
})
</script>

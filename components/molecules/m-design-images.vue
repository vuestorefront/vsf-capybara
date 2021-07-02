<template>
  <div class="m-design-images">
    <ul class="_images-list">
      <li v-for="image in images" :key="image" class="_image">
        <BaseImage
          :src="image"
          :alt="$t('design variant')"
          :aspect-ratio="1"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { BaseImage } from 'src/modules/budsies';

export default Vue.extend({
  name: 'MDesignImages',
  components: {
    BaseImage
  },
  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.m-design-images {
    ._images-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: -3%;
        list-style-image: none;

        ._image {
            flex-shrink: 0;
            flex-grow: 0;
            display: block;
            margin: 3%;
            min-width: 114px;
            width: 44%;
        }

        ._image > img {
          max-width: 100%;
          height: auto;
        }
    }
}
</style>

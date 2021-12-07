<template>
  <div
    class="storyblok-textarea"
    :class="cssClasses"
    :style="styles"
  >
    <sb-rich-text v-if="itemData.content" :text="itemData.content" />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import TextareaData from './interfaces/textarea-data.interface';

export default Blok.extend({
  name: 'StoryblokTextarea',
  computed: {
    itemData (): TextareaData {
      return this.item as TextareaData;
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-textarea {
  ::v-deep ul, ol, dl {
    display: inline-block;
    text-align: left;
  }

  ::v-deep .storyblok-rich-text {
    .-accent-color {
      color: #f78f9e;
    }

    .-action-color {
      color: #43c5e4;
    }

    .-large-text {
      font-size: 24px;
    }

    .-large-accent-text {
      color: #f78f9e;
      font-size: 24px;
    }

    .-large-action-text {
      color: #43c5e4;
      font-size: 24px;
    }

    .-small-text {
      font-size: 10px;
    }
  }
}
</style>

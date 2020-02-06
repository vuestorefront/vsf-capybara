<template>
  <div class="a-images-grid">
    <div v-for="singleRow in row" :key="singleRow" class="a-images-grid__row">
      <div v-for="singleCol in col" :key="singleCol" class="a-images-grid__col">
        <SfImage
          :src="getImage(singleRow, singleCol)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfImage
} from '@storefront-ui/vue';
export default {
  name: 'AImagesGrid',
  props: {
    row: {
      type: Number,
      default: 2,
      validator: (value) => value > 0
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SfImage
  },
  computed: {
    col () {
      const images = this.images.length
      return Math.ceil(images / this.row)
    }
  },
  methods: {
    getImage (row, col) {
      const index = ((row - 1) * this.col) + (col - 1)
      return this.images[index]
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/_variables.scss";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.a-images-grid {
  margin: auto;
  &__row {
    display: flex;
    justify-content: space-between;
    & + & {
      margin-top: $spacer-big / 2;
      @include for-desktop {
        margin-top: $spacer-big;
      }
    }
  }
  &__col {
    margin: 0;
    & + & {
      margin-left: $spacer-big / 2;
      @include for-desktop {
        margin-left: $spacer-big;
      }
    }
  }
}
</style>

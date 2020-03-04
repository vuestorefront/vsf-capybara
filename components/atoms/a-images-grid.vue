<template>
  <div class="a-images-grid">
    <div v-for="singleRow in row" :key="singleRow" class="a-images-grid__row">
      <div v-for="singleCol in col" :key="singleCol" class="a-images-grid__col">
        <SfImage
          :src="getImage(singleRow, singleCol).image"
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
@import "~@storefront-ui/vue/styles";

.a-images-grid {
    max-width: 60rem;
  margin: 0 auto;
  &__row {
    display: flex;
    & + & {
      margin: calc(var(--spacer-big) / 2) 0 0 0;
      @include for-desktop {
        margin: var(--spacer-big) 0 0 0;
      }
    }
  }
  &__col {
    flex: 1;
    margin: 0;
    & + & {
      margin: 0 0 0 calc(var(--spacer-big) / 2);
      @include for-desktop {
        margin: 0 0 0 var(--spacer-big);
      }
    }
  }
}
</style>

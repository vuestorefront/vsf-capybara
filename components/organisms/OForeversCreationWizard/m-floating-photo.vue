<template>
  <div class="m-floating-photo">
    <div class="_content" v-if="showFloatingPhoto">
      <div class="_photo">
        <img class="_image" :src="image.url" alt="">
      </div>

      <SfHeading :title="petName" class="_name" :level="3" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { SfHeading } from '@storefront-ui/vue';

import CustomerImage from '../../interfaces/customer-image.interface';

export default Vue.extend({
  name: 'MFloatingPhoto',
  props: {
    image: {
      type: Object as PropType<CustomerImage | undefined>,
      default: undefined
    },
    petName: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  components: {
    SfHeading
  },
  computed: {
    showFloatingPhoto (): boolean {
      return !!(this.image && this.image.url);
    }
  }
});
</script>

<style lang="scss" scoped>
$floating-content-top: 180px;

.m-floating-photo {
  width: 100%;

  ._content {
    position: sticky;
    top: $floating-content-top;
  }

  ._image {
    width: 100%;
    border-radius: 4px;
  }

  ._name {
      text-align: center;
  }

}
</style>

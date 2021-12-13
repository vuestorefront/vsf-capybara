<template>
  <div class="o-forevers-creation-floating-photo" v-if="showFloatingPhoto">
    <div class="_photo">
      <img :src="image.src" alt="">
    </div>

    <SfHeading :title="petName" class="_name" :level="3" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { SfHeading } from '@storefront-ui/vue';

import CustomerImage from '../interfaces/customer-image.interface';

export default Vue.extend({
  props: {
    image: {
      type: Object as PropType<CustomerImage | undefined>,
      default: undefined
    },
    petName: {
      type: String as PropType<string>,
      default: ''
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
.o-forevers-creation-floating-photo {
  width: 100%;

  ._name {
      text-align: center;
  }
}
</style>

<template>
  <div class="m-floating-photo">
    <div class="_content">
      <div class="_photo">
        <img class="_image" :src="imageUrl" alt="">
      </div>

      <SfHeading :title="petName" class="_name" :level="3" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { SfHeading } from '@storefront-ui/vue';

export default Vue.extend({
  name: 'MFloatingPhoto',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    petName: {
      type: String,
      default: ''
    }
  },
  components: {
    SfHeading
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

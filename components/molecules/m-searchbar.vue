<template>
  <SfSearchBar
    :class="customClass"
    :placeholder="placeholder"
    :size="size"
    aria-label="Search"
    v-model="value"
  />
</template>
<script>
import { SfSearchBar } from '@storefront-ui/vue';
export default {
  components: {
    SfSearchBar
  },
  data () {
    return {
      value: '',
      placeholder: 'Search for items',
      class: 'header-search',
      size: "lg"
    };
  }
};
</script>

<template>
  <span>{{ value | htmlDecode }}</span>
</template>

<script>
import ProductAttribute from '../../ProductAttribute';

export default {
  mixins: [ProductAttribute]
};
</script>

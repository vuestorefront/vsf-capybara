<template>
  <div class="m-form-errors" v-if="formErrors.length">
    <ul>
      <li v-for="error in formErrors" :key="error">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'MFormErrors',
  props: {
    formErrors: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  }
})
</script>

<style lang="scss" scoped>
.m-form-errors {
    color: var(--c-danger-variant);
    margin-top: 1em;
    margin-bottom: 0;
    text-align: left;
}
</style>

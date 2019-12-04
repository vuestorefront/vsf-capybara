<template>
  <div v-if="validations">
    <span
      v-for="(validation, index) in filteredValidations"
      :key="index"
      class="block cl-error h6 mt8"
      data-testid="errorMessage"
    >
      {{ validation.text }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    validations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredValidations() {
      return this.validations.filter(validation => validation.condition);
    }
  }
};
</script>

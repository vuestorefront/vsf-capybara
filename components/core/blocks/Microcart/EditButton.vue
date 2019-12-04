<template>
  <button
    class="brdr-none bg-cl-transparent p0 middle-xs inline-flex cl-secondary"
    @click="$emit('click')"
  >
    <span class="hidden-xs h6">
      {{ $t("Edit") }}
    </span>
    <i class="material-icons h4 p5 pr0">edit</i>
  </button>
</template>

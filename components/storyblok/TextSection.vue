<template>
  <section>
    <h1>{{ item.title }}</h1>
    <p>{{ item.text }}</p>
  </section>
</template>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

section {
  padding: 72px;
  border: 12px solid #ff8c82;
  h1 {
    font-size: 28px;
    text-align: center;
    line-height: 1;
    padding-bottom: 24px;
  }
  p {
    margin: 0;
    font-size: 14px;
  }
}
</style>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'TextSectionBlok',
  extends: Blok
}
</script>

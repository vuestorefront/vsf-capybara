<template>
  <div class="a-home-icon">
    <SfCircleIcon
      icon="home"
      icon-size="20px"
      icon-color="black"
      class="sf-header__circle-icon"
      role="button"
      :aria-label="$t('Return to home')"
      @click="$router.push(localizedRoute('/'))"
    />
  </div>
</template>

<script>
import { SfCircleIcon } from '@storefront-ui/vue';

export default {
  name: 'AHomeIcon',
  components: {
    SfCircleIcon
  }
};
</script>

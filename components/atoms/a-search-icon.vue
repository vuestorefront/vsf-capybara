<template>
  <SfCircleIcon
    icon="search"
    icon-size="20px"
    icon-color="black"
    class="sf-header__circle-icon a-search-icon"
    role="button"
    :aria-label="$t('Open search panel')"
    @click="toggleSearchpanel"
  />
</template>

<script>
import { SfCircleIcon } from '@storefront-ui/vue';
import SearchIcon from '@vue-storefront/core/compatibility/components/blocks/Header/SearchIcon';

export default {
  components: {
    SfCircleIcon
  },
  mixins: [SearchIcon]
};
</script>

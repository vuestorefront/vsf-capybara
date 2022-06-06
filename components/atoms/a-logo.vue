<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <BaseImage
      src="/assets/logo.png"
      :aspect-ratio="3.85"
      :alt="$t(defaultTitle)"
      class="sf-header__logo"
    />
  </router-link>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { BaseImage } from 'src/modules/budsies';

import get from 'lodash-es/get';

export default {
  components: { BaseImage },
  computed: {
    defaultTitle () {
      return get(currentStoreView(), 'seo.defaultTitle', config.seo.defaultTitle);
    }
  }
};
</script>
<style lang="scss" scoped>
.a-logo {
  display: inline-flex;

  .sf-header__logo {
    width: calc(var(--image-height) * 3.85);
  }
}
</style>

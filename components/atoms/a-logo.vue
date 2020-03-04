<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <SfImage
      src="/assets/logo.svg"
      :alt="$t(defaultTitle)"
      class="sf-header__logo"
    />
  </router-link>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { SfImage } from '@storefront-ui/vue';
import get from 'lodash-es/get';

const storeView = currentStoreView();

export default {
  components: { SfImage },
  computed: {
    defaultTitle () {
      return get(storeView, 'seo.defaultTitle', config.seo.defaultTitle);
    }
  }
};
</script>
<style lang="scss" scoped>
.a-logo {
  display: inline-flex;
  ::v-deep .sf-header__logo {
    --header-logo-width: 41px;
    --header-logo-height: 41px;
  }
}
</style>

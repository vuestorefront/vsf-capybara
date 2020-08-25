<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <SfImage
      src="/assets/images/capitools-uk-logo.png"
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
  ::v-deep .sf-header__logo {
    min-width: 200px;  
    --header-logo-height: 66px;
    margin: 0;
    @media screen and (max-width: 767px){
       min-width: auto;
    }
    img{
        width: 100%;
        height: 100%;
        objecet-fit: contain;
    }
  }
}
</style>

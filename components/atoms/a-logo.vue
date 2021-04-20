<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
  >
    <SfImage
      :src="logo.url"
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
import { getContent } from 'theme/store/homepage';
import { Logger } from '@vue-storefront/core/lib/logger';

const storeView = currentStoreView();

export default {
  components: { SfImage },
  computed: {
    defaultTitle () {
      return get(storeView, 'seo.defaultTitle', config.seo.defaultTitle);
    }
  },
  data () {
    return {
      logo: this.getLogo()
    };
  },
  methods: {
    async getLogo () {
      try {
        let url = config.images.baseUrl + 'logo'
        this.logo = await getContent(url)
        if (!this.logo.url) {
          this.logo.url = '/assets/logo.svg'
        }
        return this.logo
      } catch (err) {
        Logger.debug('Unable to load logo ' + err)()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.a-logo {
  display: inline-flex;
}
</style>

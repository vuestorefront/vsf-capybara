<template>
  <router-link :to="localizedRoute('/')" :title="$t('Home Page')" class="logo">
    <SfImage
      :style="{ width, height }"
      src="/assets/logo.svg"
      :alt="$t(defaultTitle)"
      class="sf-header__logo no-underline"
    />
  </router-link>
</template>

<script>
import config from "config";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import { SfImage } from "@storefront-ui/vue";
import get from "lodash-es/get";

const storeView = currentStoreView();

export default {
  components: { SfImage },
  props: {
    width: {
      type: [String, Number],
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    defaultTitle() {
      return get(storeView, "seo.defaultTitle", config.seo.defaultTitle);
    }
  }
};
</script>
<style lang="scss" scoped>
.logo {
  display: inline-flex;
}
</style>

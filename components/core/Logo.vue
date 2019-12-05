<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="no-underline inline-flex"
  >
    <img
      :width="width"
      :height="height"
      src="/assets/logo.svg"
      :alt="$t(defaultTitle)"
    />
  </router-link>
</template>

<script>
import config from "config";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";

export default {
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
  data() {
    const storeView = currentStoreView();
    return {
      defaultTitle: storeView.seo.defaultTitle
        ? storeView.seo.defaultTitle
        : config.seo.defaultTitle
    };
  }
};
</script>

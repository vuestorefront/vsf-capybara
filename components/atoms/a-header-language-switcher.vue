<template>
  <div class="a-header-language-switcher">
    <a
      v-for="(storeView, storeCode) in storeViews"
      :key="storeCode"
      :href="storeView.url"
      class="btn-lang"
      :class="{
        'selected-lang': fullLangName === storeView.i18n.fullLanguageName,
      }"
    >{{ storeView.i18n.fullLanguageName }}
    </a>
  </div>
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

export default {
  computed: {
    fullLangName () {
      const { i18n = config.i18n } = currentStoreView();
      return i18n.fullLanguageName;
    },
    storeViews () {
      let storeViews = Object.keys(config.storeViews).reduce(
        (storeViews, storeCode) => {
          if (this.isValidStoreCode(storeCode)) {
            storeViews[storeCode] = config.storeViews[storeCode];
          }
          return storeViews;
        },
        {}
      );
      storeViews = {
        ...storeViews,
        default: {
          i18n: {
            fullLanguageName: config.i18n.fullLanguageName
          },
          url: '/'
        }
      };
      return storeViews;
    }
  },
  methods: {
    isValidStoreCode (storeCode) {
      const storeView = config.storeViews[storeCode];
      return !!(storeView && typeof storeView === 'object' && storeView.i18n);
    }
  }
};
</script>

<style lang="scss">
.a-header-language-switcher {
  .btn-lang {
    width: 50px;
    height: 50px;
    left: 1129px;
    top: 33px;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 800;
    font-size: 14px;
    line-height: 24px;
    padding: 5px;

    /* identical to box height, or 171% */
    letter-spacing: 0.1px;
    border-radius: 10px;
    background: #f6f6f6;
    color: #030303;
  }
  .selected-lang {
    background-color: #f95835 !important;
    color: #ffffff !important;
  }
}
</style>

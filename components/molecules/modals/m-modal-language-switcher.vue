<template>
  <div class="m-modal-language-switcher">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading class="sf-heading--left" :title="$t('Choose your country')" :level="3" />
      <SfFooter :column="columns" :multiple="true">
        <SfFooterColumn :title="$t(fullCountryName)">
          <SfList>
            <SfListItem>
              <a href="/">
                <SfMenuItem
                  class="sf-footer__menu-item"
                  :label="$t(fullLanguageName)"
                />
              </a>
            </SfListItem>
          </SfList>
        </SfFooterColumn>
        <SfFooterColumn
          v-for="(storeView, storeCode) in storeViews"
          :key="storeCode"
          :title="$t(storeView.i18n.fullCountryName)"
        >
          <SfList>
            <SfListItem>
              <a :href="storeView.url">
                <SfMenuItem
                  class="sf-footer__menu-item"
                  :label="$t(storeView.i18n.fullLanguageName)"
                />
              </a>
            </SfListItem>
          </SfList>
        </SfFooterColumn>
      </SfFooter>
    </SfModal>
  </div>
</template>

<script>
import config from 'config';
import { SfModal, SfHeading, SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';

export default {
  name: 'MModalLanguageSwitcher',
  components: { SfModal, SfHeading, SfFooter, SfList, SfMenuItem },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data () {
    return {
      countryPerColumn: 3
    };
  },
  computed: {
    fullCountryName () {
      return config.i18n.fullCountryName;
    },
    fullLanguageName () {
      return config.i18n.fullLanguageName;
    },
    columns () {
      const viewsCount = Object.keys(this.storeViews).length + 1
      return Math.ceil(viewsCount / this.countryPerColumn)
    },
    storeViews () {
      return Object.keys(config.storeViews).reduce((storeViews, storeCode) => {
        if (this.isValidStoreCode(storeCode)) {
          storeViews[storeCode] = config.storeViews[storeCode];
        }
        return storeViews;
      }, {});
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    isValidStoreCode (storeCode) {
      const storeView = config.storeViews[storeCode];
      return !!(storeView && typeof storeView === 'object' && storeView.i18n);
    }
  }
};
</script>

<style lang="scss">
.m-modal-language-switcher {
  .sf-modal__container {
    width: auto;
  }
  .sf-footer__container {
    margin: var(--spacer-xl) calc(var(--spacer-lg) * -1);
    padding: 0;
  }
  .sf-footer-column {
    padding: 0 var(--spacer-lg)
  }
}
</style>

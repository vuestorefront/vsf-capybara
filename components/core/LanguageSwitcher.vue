<template>
  <div>
    <a href="#" @click.prevent="showLanguagesModal">
      {{ linkName }}
    </a>
    <modal-switcher v-if="loadLanguagesModal" />
  </div>
</template>

<script>
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
const ModalSwitcher = () =>
  import(
    /* webpackChunkName: "vsf-languages-modal" */ "theme/components/core/blocks/Switcher/Language"
  );

const { i18n = {} } = currentStoreView();

export default {
  components: {
    ModalSwitcher
  },
  data() {
    return {
      loadLanguagesModal: false
    };
  },
  computed: {
    linkName() {
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    }
  },
  methods: {
    showLanguagesModal() {
      this.loadLanguagesModal = true;
      this.$bus.$emit("modal-show", "modal-switcher");
    }
  }
};
</script>

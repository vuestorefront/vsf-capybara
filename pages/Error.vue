<template>
  <div id="error">
    <MError :title="errorTitle" :subtitle="errorSubtitle" />
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import MError from 'theme/components/molecules/m-error';

export default {
  name: 'Error',
  components: {
    MError
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    errorTitle () {
      return this.$route.name === 'error'
        ? i18n.t('Something went wrong ...')
        : i18n.t("We can't find the page");
    },
    errorSubtitle () {
      return this.$route.name === 'error'
        ? i18n.t("We've noticed Internal Server Error while rendering this request.")
        : i18n.t("Unfortunately we can't find the page you are looking for.");
    },
    errorMetaTitle () {
      return this.$route.name === 'error'
        ? i18n.t('Internal Server Error 500')
        : i18n.t('404 Page Not Found');
    }
  },
  asyncData ({ store, route, context }) {
    return new Promise((resolve, reject) => {
      Logger.log('Calling asyncData for Error page ' + new Date())();
      if (context) {
        context.output.cacheTags.add(`error`);
      }
      resolve();
    })
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.title || this.errorMetaTitle,
      meta: this.$route.meta.description
        ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }]
        : []
    };
  }
};
</script>

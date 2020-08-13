<template>
  <div>
    <AFooterTopSection />
    <AFooterPaymentSection />
    <MFooterNewsletterSection />
    
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import AFooterTopSection from 'theme/components/atoms/a-footer-top-section';
import AFooterPaymentSection from 'theme/components/atoms/a-footer-payment-section';
import MFooterNewsletterSection from 'theme/components/molecules/m-footer-newsletter-section';


import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import get from 'lodash-es/get';

export default {
  name: 'OFooter',
  components: {
    ABackToTop,
    AFooterTopSection,
    AFooterPaymentSection,
    MFooterNewsletterSection,
    SfFooter,
    SfList,
    SfMenuItem
  },
  data () {
    return {
     
    };
  },  
};
</script>

<style lang="scss" scoped>
 
 
</style>

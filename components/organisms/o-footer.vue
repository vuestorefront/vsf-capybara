<template>
  <div>
    <div class="mask">
      <div style= "display:flex"> 
        <MFooterNewsletterSection />
        <AFooterPaymentSection />
      </div>
      <MFooterMenuSection />  
      <div class="rectangle_copyright">
        <p class="text_copyright">1999-2020 Capitools. All Rights Reserved. Third party trademarks are hereby acknowledged.</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';
  import ABackToTop from 'theme/components/atoms/a-back-to-top';
  import AFooterPaymentSection from 'theme/components/atoms/a-footer-payment-section';
  import MFooterNewsletterSection from 'theme/components/molecules/m-footer-newsletter-section';
  import MFooterMenuSection from 'theme/components/molecules/m-footer-menu-section';
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
      AFooterPaymentSection,
      MFooterNewsletterSection,
      MFooterMenuSection,
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

.newsletter_rectangle
{
  margin-left: 380px;
}

.payment_rectangle
{
  margin-left: 30px;
}
 
 .mask {
  height: 684px;
  width: 1920px;
  background-color: #254E91;
}
.rectangle_copyright
{
  height: 40px;
  width: 1920px;
  background-color: #2D415A;
}

.text_copyright 
{
  height: 20px;
  width: 625px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 21px;
  margin-left: 663px;
  margin-top: 10px;
}

</style>

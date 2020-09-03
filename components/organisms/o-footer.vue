<template>
  <footer id="footer" class="o-footer">
    <div class="container">
        <div class="d-flex footer-overlay justify-between">
          <MFooterNewsletterSection />
          <AFooterPaymentSection />
        </div>
        <SfFooter :column="4" :multiple="true">
          <SfFooterColumn
            v-for="linkGroup in links"
            :key="linkGroup.name"
            :title="$t(linkGroup.name)"
          >
            <SfList>
               <SfListItem v-for="link in linkGroup.children" :key="link.name">
                <template v-if="link.name === 'Logout'">
                  <router-link v-if="link.link" v-on:click.native="changeActivePage" :to="localizedRoute(link.link)" exact>
                    <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
                  </router-link>
                  <SfMenuItem
                      v-else-if="link.clickHandler"
                      class="sf-footer__menu-item"
                      :label="$t(link.name)"
                      @click="link.clickHandler"
                  />
                </template>
                <template v-else>
                  <router-link v-if="link.link" :to="localizedRoute(link.link)" exact>
                    <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
                  </router-link>
                  <SfMenuItem
                    v-else-if="link.clickHandler"
                    class="sf-footer__menu-item"
                    :label="$t(link.name)"
                    @click="link.clickHandler"
                  />
                </template>
              </SfListItem>
            </SfList>
          </SfFooterColumn>
        </SfFooter>
        <div class="social-links d-flex align-center">
          <h4>
            Lets stay in touch!
          </h4>
          <div class="item d-flex">
           <a href="https://www.facebook.com/Capitools-UK-105699067744679" target="_blank">
              <img :src="'/assets/images/facebook_icon.png'" class="icon_facebook"/>
            </a>
            <a href="https://www.youtube.com/channel/UCi6MvXNjvI_Oy02TzXThOMg" target="_blank">
              <img :src="'/assets/images/youtube_icon.png'" class="icon_youtube"/>
            </a>
            <a href="">
              <img :src="'/assets/images/insta_icon.png'" class="icon_instagram"/>
            </a>
          </div>
        </div>

        <!--  <div class="blog d-flex align-center">
          <label>New</label>
          <img :src="'/assets/images/footer_blog.png'" class="image_blog_size">
          <p class="footer_blog_text">
            Ut nonumes noluisse nec, in impetus integre sea. Nec no elitr ignota aeterno. Qui etiam assentior complectitur no. in impetus integre sea. Nec no elitr ignota aeterno.
          </p>
          <SfButton
            class="see-more btn-primary"
            :link="seeMoreLink"
          >
            See more
          </SfButton>
        </div> -->
    </div>
    <ABackToTop bottom="20px" right="20px" visibleoffset="200" class="desktop-only" />
    <div class="copyrights text-center">
      <p>
        <span>&copy;1999  -</span>{{currentDate.getFullYear()}}<span> All Rights Reserved. Third party trademarks are hereby acknowledged.</span>
      </p>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import { SfFooter, SfList, SfMenuItem , SfButton } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import get from 'lodash-es/get';
import AFooterPaymentSection from 'theme/components/atoms/a-footer-payment-section';
import MFooterNewsletterSection from 'theme/components/molecules/m-footer-newsletter-section';

export default {
  name: 'OFooter',
  components: {
    ABackToTop,
    SfFooter,
    SfList,
    SfMenuItem,
    SfButton,
    AFooterPaymentSection,
    MFooterNewsletterSection
  },
  data () {
    return {
      seeMoreLink:"#",
      social: ['facebook', 'pinterest', 'twitter', 'youtube'],
      currentDate: new Date
    };
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    multistoreEnabled () {
      return get(config, 'storeViews.multistore', false);
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    },
    currentLanguage () {
      const { i18n = config.i18n } = currentStoreView();
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    },
    links () {
      return {
        about: {
          name: 'About us',
          children: [
            { name: 'Who We Are?', link: '/pages/about-us' },
            { name: 'Our products', link: '/pages/our-products.html' },
            { name: 'Our expertise', link: '/pages/our-expertise' },
            { name: 'Our partner brands', link: '/pages/capitools-brands-and-partners' },
            { name: 'Our guarantee', link: '/pages/our-guarantee' },
            { name: 'Promotions', link: '/pages/deals-promos' },
            { name: 'New products', link: '/pages/new-products' },
            { name: 'Contact us', link: '/pages/contact-capitools' },
            { name: 'sitemap', link: '/pages/sitemap' },
            { name: 'We are hiring', link: '/pages/we-are-hiring' }
          ]
        },
        product: {
          name: 'The Products',
          children: [
            { name: 'Secure payment', link: '/pages/secure-payment' },
            { name: 'Terms of Sales', link: '/pages/terms-of-sales' },
            { name: 'Legal Notice', link: '/pages/legal-information' },
            { name: 'Payment methods', link: '/pages/payment-info' },
            { name: 'Satisfied or refunded', link: '/pages/satisfied-or-refunded' },
            { name: 'Partners', link: '/pages/partners' },
            { name: 'Cyber ​​Security', link: '/pages/cyber-security' },
            { name: 'Cookie notice information', link: '/pages/cookie-notice-information' }
          ]
        },
        help: {
          name: 'Help & Services',
          children: [
            { name: 'My orders', link: '/pages/my-capitools-order' },
            { name: 'My assets', link: '/pages/my-assets' },
            { name: 'My adresses', link: '/pages/my-address' },
            { name: 'My personal information', link: '/pages/my-personal-details' },
            { name: 'My coupons', link: '/pages/my-coupons' },
            { name: 'Logout', link: '/' }
          ]
        },
        legal: {
          name: 'Legal Information',
          children: [
            { name: 'FAQ', link: '/pages/f-a-q-frequently-asked-questions' },
            { name: 'After-sales service & customer relations', link: '/pages/after-sales-service-and-customer-relations' },
            { name: 'Payment in 3 installments', link: '/pages/payment-in-three-installments' },
            { name: 'Product delivery', link: '/pages/delivery' },
            { name: 'Return Policy', link: '/pages/return-policy' },
            { name: 'The SWAP Europe Guarantee network', link: '/pages/swap-europe-network-warranty' }
          ]
        }
      };
    }
  },
  methods: {
    changeActivePage () {
        this.logout();
        return;
    },
    async logout () {
      await this.$store.dispatch('user/logout', {});
      this.$router.push(this.localizedRoute('/'));
    },
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showLanguageSwitcher () {
      this.openModal({ name: ModalList.LanguageSwitcher })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-footer {
  .sf-footer {
    --footer-width: auto;
    --footer-padding : 0px;
  }
}

</style>

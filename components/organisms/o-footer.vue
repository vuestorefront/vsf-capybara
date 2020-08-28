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
                <router-link v-if="link.link" :to="localizedRoute(link.link)" exact>
                  <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
                </router-link>
                <SfMenuItem
                  v-else-if="link.clickHandler"
                  class="sf-footer__menu-item"
                  :label="$t(link.name)"
                  @click="link.clickHandler"
                />
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

        <div class="blog d-flex align-center">
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
        </div>
    </div>
    <ABackToTop bottom="20px" right="20px" visibleoffset="200" class="desktop-only" />
    <div class="copyrights text-center">
      <p>
        <span>&copy;</span>1999-2020 Capitools. All Rights Reserved. Third party trademarks are hereby acknowledged.
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
      social: ['facebook', 'pinterest', 'twitter', 'youtube']
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
            { name: 'Qui sommes-nous ?', link: '/' },
            { name: 'Nos produits', link: '/' },
            { name: 'Notre expertise', link: '/' },
            { name: 'Nos marques partenaires', link: '/' },
            { name: 'Notre garantie', link: '/' },
            { name: 'Promotions', link: '/' },
            { name: 'Nouveaux produits', link: '/' },
            { name: 'Contactez-nous', link: '/' },
            { name: 'sitemap', link: '/' },
            { name: 'Nous recrutons', link: '/' }
          ]
        },
        product: {
          name: 'The Products',
          children: [
            { name: 'Paiement Sécurisé', link: '/' },
            { name: 'Conditions Générales de Vente', link: '/' },
            { name: 'Mentions Légales', link: '/' },
            { name: 'Modes de paiement', link: '/' },
            { name: 'Satisfait ou remboursé', link: '/' },
            { name: 'Partenaires', link: '/' },
            { name: 'Cyber Sécurité', link: '/' },
            { name: 'Cookie notice information', link: '/' }
          ]
        },
        help: {
          name: 'Help & Services',
          children: [
            { name: 'Mes commandes', link: '/' },
            { name: 'Mes avoirs', link: '/' },
            { name: 'Mes adresses', link: '/' },
            { name: 'Mes informations personnelles', link: '/' },
            { name: 'Mes bons de réduction', link: '/' },
            { name: 'Déconnexion', link: '/' }
          ]
        },
        legal: {
          name: 'Legal Information',
          children: [
            { name: 'FAQ', link: '/' },
            { name: 'SAV & Relation client', link: '/' },
            { name: 'Paiement en 3 fois', link: '/' },
            { name: 'Livraison produits', link: '/' },
            { name: 'Politique de retour des articles', link: '/' },
            { name: 'Le réseau de Garantie SWAP Europe', link: '/' }
          ]
        }
      };
    }
  },
  methods: {
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

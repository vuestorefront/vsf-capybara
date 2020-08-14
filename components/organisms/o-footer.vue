<template>
  <footer class="o-footer">
    <div style="display:flex">
      <MFooterNewsletterSection />
      <AFooterPaymentSection />
    </div>
    <SfFooter :column="5" :multiple="true">
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
      <div>
        <div style="display:flex">
          <SfButton
            class="button_new"
            :disabled="disabled"
            :native-button="nativeButton"
            :link="link"
          >
            New
          </SfButton>
          <p class="text_1">
            Lets stay in touch!
          </p>
          <img :src="'/assets/images/facebook_icon.png'" class="icon_facebook">
          <img :src="'/assets/images/youtube_icon.png'" class="icon_youtube">
          <img :src="'/assets/images/insta_icon.png'" class="icon_instagram">
        </div>
        <div class="rectangle_blog">
          <img :src="'/assets/images/footer_blog.png'" class="image_blog_size">
          <p class="footer_blog_text">
            Ut nonumes noluisse nec, in impetus integre sea.
            <br>Nec no elitr ignota aeterno. Qui etiam assentior
            <br>complectitur no. in impetus integre sea. Nec no elitr
            <br> ignota aeterno.
          </p>
          <SfButton
            class="button_see_more"
            :disabled="disabled"
            :native-button="nativeButton"
            :link="link"
          >
            See more
          </SfButton>
        </div>
      </div>
    </SfFooter>
    <ABackToTop bottom="20px" right="20px" visibleoffset="200" class="desktop-only" />
    <div class="rectangle_copyright">
      <p class="text_copyright">
        1999-2020 Capitools. All Rights Reserved. Third party trademarks are hereby acknowledged.
      </p>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
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
    AFooterPaymentSection,
    MFooterNewsletterSection
  },
  data () {
    return {
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
  @include for-desktop {

        height: 684px;
  width: 1920px;
  background-color: #254E91;

  }
  .sf-footer {
    --footer-width: auto;
    margin-left: 380px;
    --footer-padding : 0px;

  }
}
.social-column {
  flex-basis: auto;
}
.social-icon {
  padding: 20px 40px;
  @include for-desktop {
    padding: 6px 0;
  }
  &__img {
    height: 1.75rem;
    &:not(:last-child) {
      margin-right: 1.25rem;
    }
  }
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

.text_1
{
  height: 25px;
  width: 168px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 27px;
}

.icon_facebook
{
  height: 35px;
  width: 35px;
}

.icon_youtube
{
  height: 35px;
  width: 35px;
}

.icon_instagram
{
  height: 35px;
  width: 35px;
}

.rectangle_blog
{
  height: 110px;
  width: 651px;
  border-radius: 3px;
  background-color: #2D415A;
  display: flex;
}

.image_blog_size
{
  height: 40px;
  width: 145px;
  margin-top: 35px;
  margin-left: 13px;
}

.footer_blog_text
{
  height: 68px;
  width: 310px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  margin-left: 28px;
  margin-top: 21px;
}

.button_new
{
  height: 26px;
  width: 69px;
  border-radius: 12.5px;
  background-color: #FF9843;
  color: #FFFFFF;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
}

.button_see_more
{
  height: 34px;
  width: 98px;
  border-radius: 2px;
  background-color: #3B78DD;
  margin-left: 27px;
  margin-top: 38px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
}

.newsletter_rectangle
{
  margin-left: 380px;
}

.payment_rectangle
{
  margin-left: 30px;
}

</style>

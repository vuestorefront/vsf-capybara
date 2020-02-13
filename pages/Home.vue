<template>
  <div id="home">
    <SfHero class="section">
      <SfHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :title="hero.title"
        :subtitle="hero.subtitle"
        :image="typeof hero.image === 'string' ? hero.image : ''"
      />
    </SfHero>

    <SfBannerGrid :banner-grid="1" class="banners section">
      <template v-for="(banner, i) in banners" v-slot:[banner.slot]>
        <router-link :key="i" :to="banner.link">
          <SfBanner
            :subtitle="banner.subtitle"
            :title="banner.title"
            :description="banner.description"
            :button-text="banner.buttonText"
            :image="banner.image"
            class="sf-banner--slim"
          />
        </router-link>
      </template>
    </SfBannerGrid>

    <SfCallToAction
      title="Subscribe to Newsletters"
      description="Be aware of upcoming sales and events. Receive gifts and special offers!"
      :image="newsletterImage"
      class="call-to-action-newsletter"
    >
      <template #button>
        <SfButton @click="showNewsletterPopup">
          {{ $t("Subscribe") }}
        </SfButton>
      </template>
    </SfCallToAction>

    <newsletter-popup v-if="loadNewsletterPopup" />

    <SfSection title-heading="Best Sellers" class="section">
      <lazy-hydrate :trigger-hydration="!loading">
        <m-product-carousel :products="newCollection" />
      </lazy-hydrate>
    </SfSection>

    <SfSection
      v-if="isOnline"
      title-heading="Share Your Look"
      subtitle-heading="#YOURLOOK"
      class="section"
    >
      <AImagesGrid :images="dummyInstaImages" />
    </SfSection>
    <Onboard />
  </div>
</template>

<script>
import supportsWebP from 'supports-webp';
import { mapGetters } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import { Logger } from '@vue-storefront/core/lib/logger';
import Home from '@vue-storefront/core/pages/Home';
import Onboard from 'theme/components/theme/blocks/Home/Onboard';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed';
import { Wishlist } from '@vue-storefront/core/modules/wishlist/components/Wishlist';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import MProductCarousel from 'theme/components/molecules/m-product-carousel';
import AImagesGrid from 'theme/components/atoms/a-images-grid';
import {
  SfHero,
  SfButton,
  SfSection,
  SfBannerGrid,
  SfCallToAction,
  SfBanner
} from '@storefront-ui/vue';

const NewsletterPopup = () =>
  import(
    /* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup'
  );

export default {
  name: "Home",
  components: {
    Onboard,
    LazyHydrate,
    NewsletterPopup,
    SfHero,
    SfButton,
    SfSection,
    SfBannerGrid,
    SfCallToAction,
    SfBanner,
    MProductCarousel,
    AImagesGrid
  },
  mixins: [Home, Wishlist],
  data () {
    return {
      loading: true,
      loadNewsletterPopup: false,
      dummyInstaImages: [
        {
          webp: { url: `/assets/ig/webp/ig01.webp` },
          fallback: { url: `/assets/ig/jpg/ig01.jpg` }
        },
        {
          webp: { url: `/assets/ig/webp/ig02.webp` },
          fallback: { url: `/assets/ig/jpg/ig02.jpg` }
        },
        {
          webp: { url: `/assets/ig/webp/ig03.webp` },
          fallback: { url: `/assets/ig/jpg/ig03.jpg` }
        },
        {
          webp: { url: `/assets/ig/webp/ig04.webp` },
          fallback: { url: `/assets/ig/jpg/ig04.jpg` }
        },
        {
          webp: { url: `/assets/ig/webp/ig05.webp` },
          fallback: { url: `/assets/ig/jpg/ig05.jpg` }
        },
        {
          webp: { url: `/assets/ig/webp/ig06.webp` },
          fallback: { url: `/assets/ig/jpg/ig06.jpg` }
        }
      ],
      newsletterImage: null,
      banners: [],
      heroes: []
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      heroImages: 'promoted/getHeadImage',
      promotedOffers: 'promoted/getPromotedOffers',
      newCollection: 'homepage/getEverythingNewCollection'
    }),
    isOnline () {
      return onlineHelper.isOnline;
    }
  },
  methods: {
    showNewsletterPopup () {
      this.loadNewsletterPopup = true;
      this.$bus.$emit('modal-show', 'modal-newsletter');
    },
    createBanners (webpSupported) {
      let banners = this.promotedOffers.mainBanners.map((banner) => {
        if (webpSupported) {
          banner.image = banner.image.webp
        } else {
          banner.image = banner.image.fallback
        }
        return banner;
      });
      this.banners = banners
    },
    createHeroes (webpSupported) {
      let heroes = this.heroImages.map((banner) => {
        if (webpSupported) {
          banner.image = banner.image.webp
        } else {
          banner.image = banner.image.fallback
        }
        return banner;
      });
      this.heroes = heroes
    }
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  },
  async asyncData ({ store }) {
    Logger.info('Calling asyncData in Home (theme)')();

    await Promise.all([
      store.dispatch('homepage/fetchNewCollection'),
      store.dispatch('promoted/updateHeadImage'),
      store.dispatch('promoted/updatePromotedOffers')
    ]);
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule);
  },
  async beforeMount () {
    if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch('claims/check', {
        claimCode: 'onboardingAccepted'
      });

      if (!onboardingClaim) {
        this.$bus.$emit('modal-toggle', 'modal-onboard');
        this.$store.dispatch('claims/set', {
          claimCode: 'onboardingAccepted',
          value: true
        });
      }
    }
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) { this.$bus.$emit('modal-show', 'modal-signup'); }
    this.banners = this.promotedOffers.mainBanners
    this.heroes = this.heroImages
    supportsWebP.then(supported => {
      this.createBanners(supported)
      this.createHeroes(supported)
      if (supported) {
        this.newsletterImage = '/assets/newsletter/webp/newsletter.webp';
      } else {
        this.newsletterImage = '/assets/newsletter/png/newsletter.png'
      }
    })
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      next(vm => {
        vm.$store.dispatch('homepage/fetchNewCollection').then(() => {
          vm.loading = false;
        });
      });
    } else {
      next();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/_variables.scss";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

#home {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.call-to-action-newsletter {
  margin: $spacer-big 0;
  box-sizing: border-box;
  @include for-desktop {
    margin: $spacer-extra-big * 2 0;
  }
}

.sf-hero-item {
  background-position: top;
}

.sf-banner-sf-banner-grid {
  margin: $spacer-big 0;
  @include for-desktop {
    margin: $spacer-extra-big 0;
  }
}

.banners {
  margin: $spacer-big 0;
  @include for-desktop {
    margin: $spacer-extra-big 0;
  }
}

.product-card {
  max-width: unset;
  &:hover {
    @include for-desktop {
      box-shadow: 0px 4px 20px rgba(168, 172, 176, 0.19);
    }
  }
}

.product-carousel {
  margin: -20px -#{$spacer-big} -20px 0;
  @include for-desktop {
    margin: -20px 0;
  }
  ::v-deep .sf-carousel__wrapper {
    padding: 20px 0;
    @include for-desktop {
      padding: 20px;
      max-width: calc(100% - 216px);
    }
  }
}

.section {
  padding-left: $spacer-big;
  padding-right: $spacer-big;
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

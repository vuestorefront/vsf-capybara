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
            :image="typeof banner.image === 'string' ? banner.image : ''"
            class="sf-banner--slim"
          />
        </router-link>
      </template>
    </SfBannerGrid>

    <SfCallToAction
      title="Subscribe to Newsletters"
      description="Be aware of upcoming sales and events. Receive gifts and special offers!"
      :image="typeof newsletterImage === 'string' ? newsletterImage : ''"
      class="call-to-action-newsletter"
    >
      <template #button>
        <SfButton @click="showNewsletterPopup">
          {{ $t("Subscribe") }}
        </SfButton>
      </template>
    </SfCallToAction>

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
      <AImagesGrid :images="instagramImages" />
    </SfSection>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import { Logger } from '@vue-storefront/core/lib/logger';
import Home from '@vue-storefront/core/pages/Home';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import MProductCarousel from 'theme/components/molecules/m-product-carousel';
import AImagesGrid from 'theme/components/atoms/a-images-grid';
import { ModalList } from 'theme/store/ui/modals'
import { checkWebpSupport } from 'theme/helpers'

import {
  SfHero,
  SfButton,
  SfSection,
  SfBannerGrid,
  SfCallToAction,
  SfBanner
} from '@storefront-ui/vue';

export default {
  name: 'Home',
  components: {
    LazyHydrate,
    SfHero,
    SfButton,
    SfSection,
    SfBannerGrid,
    SfCallToAction,
    SfBanner,
    MProductCarousel,
    AImagesGrid
  },
  mixins: [Home],
  data () {
    return {
      loading: true,
      loadNewsletterPopup: false
    };
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      heroImages: 'promoted/getHeadImage',
      promotedOffers: 'promoted/getPromotedOffers',
      newCollection: 'homepage/getEverythingNewCollection',
      dummyInstagramImages: 'instagram/getInstagramImages'
    }),
    isOnline () {
      return onlineHelper.isOnline;
    },
    banners () {
      return checkWebpSupport(this.promotedOffers.mainBanners, this.isWebpSupported)
    },
    heroes () {
      return checkWebpSupport(this.heroImages, this.isWebpSupported)
    },
    newsletterImage () {
      return checkWebpSupport([
        {
          image: {
            webp: '/assets/newsletter/webp/newsletter.webp',
            fallback: '/assets/newsletter/png/newsletter.png'
          }
        }
      ], this.isWebpSupported)[0].image
    },
    instagramImages () {
      return checkWebpSupport(this.dummyInstagramImages, this.isWebpSupported)
    }
  },
  methods: {
    showNewsletterPopup () {
      this.$store.dispatch('ui/openModal', { name: ModalList.Newsletter })
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
      store.dispatch('promoted/updatePromotedOffers'),
      store.dispatch('instagram/updateInstagramImages')
    ]);
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) { this.$bus.$emit('modal-show', 'modal-signup'); }
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

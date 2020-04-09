<template>
  <div id="home">
    <SfHero
      class="section"
      :slider-options="{
        animationDuration: 2000,
        rewindDuration: 2000
      }"
    >
      <SfHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :title="hero.title"
        :subtitle="hero.subtitle"
        :button-text="hero.buttonText"
        :background="hero.background"
        :image="hero.image"
        :class="hero.className"
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

    <ONewsletter />

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
import ONewsletter from 'theme/components/organisms/o-newsletter';
import AImagesGrid from 'theme/components/atoms/a-images-grid';
import { checkWebpSupport } from 'theme/helpers'

import {
  SfHero,
  SfSection,
  SfBannerGrid,
  SfBanner
} from '@storefront-ui/vue';

export default {
  name: 'Home',
  components: {
    LazyHydrate,
    SfHero,
    SfSection,
    SfBannerGrid,
    SfBanner,
    MProductCarousel,
    ONewsletter,
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
    instagramImages () {
      return checkWebpSupport(this.dummyInstagramImages, this.isWebpSupported)
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#home {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.sf-hero-item {
  background-position: top;
}

.sf-banner-sf-banner-grid {
  margin: var(--spacer-big) 0;
  @include for-desktop {
    margin: var(--spacer-extra-big) 0;
  }
}

.banners {
  margin: var(--spacer-big) 0;
  @include for-desktop {
    margin: var(--spacer-extra-big) 0;
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
  margin: -20px var(--spacer-big) -20px 0;
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
  padding-left: var(--spacer-big);
  padding-right: var(--spacer-big);
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

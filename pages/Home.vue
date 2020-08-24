<template>
  <section id="home">
    <SfHero
      class="hero"
      :slider-options="{
        animationDuration: 2000,
        rewindDuration: 2000
      }"
    >
      <SfHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :background="hero.background"
        :image="hero.image"
        :class="hero.className"
      />
    </SfHero>
    <MAssurance />

    <MPromoProductBlock />

    <div class="container">
      <SfSection class="section">
        <lazy-hydrate :trigger-hydration="!loading">
          <m-product-carousel :products="newCollection" />
        </lazy-hydrate>
      </SfSection>
    </div>

    <MCodePromotionBlock />

    <div class="container">
      <SfSection class="section">
        <lazy-hydrate :trigger-hydration="!loading">
          <m-product-carousel :products="newCollection" />
        </lazy-hydrate>
      </SfSection>
    </div>

    <MSupportBlock />

    <div class="container">
      <SfSection class="section">
        <lazy-hydrate :trigger-hydration="!loading">
          <m-product-carousel :products="newCollection" />
        </lazy-hydrate>
      </SfSection>
    </div>

    <MAssurance />
    <AAboutUs />
  </section>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import { Logger } from '@vue-storefront/core/lib/logger';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';
import MProductCarousel from 'theme/components/molecules/m-product-carousel';
import MAssurance from 'theme/components/molecules/m-assurance';
import MPromoProductBlock from 'theme/components/molecules/m-promo-product-block';
import MCodePromotionBlock from 'theme/components/molecules/m-code-promotion-block';
import MSupportBlock from 'theme/components/molecules/m-support-block';
import ONewsletter from 'theme/components/organisms/o-newsletter';
import AImagesGrid from 'theme/components/atoms/a-images-grid';
import { checkWebpSupport } from 'theme/helpers'
import AAboutUs from 'theme/components/atoms/a-about-us';

import {
  SfProperty,
  SfHero,
  SfSection,
  SfBannerGrid,
  SfBanner
} from '@storefront-ui/vue';

export default {
  name: 'Home',
  components: {
    SfProperty,
    LazyHydrate,
    SfHero,
    SfSection,
    SfBannerGrid,
    SfBanner,
    MProductCarousel,
    ONewsletter,
    AImagesGrid,
    AAboutUs,
    MAssurance,
    MSupportBlock,
    MPromoProductBlock,
    MCodePromotionBlock
  },
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
  async asyncData ({ store, context }) {
    Logger.info('Calling asyncData in Home (theme)')();
    if (context) context.output.cacheTags.add(`home`)

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
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#home {
  box-sizing: border-box;
  padding: 0;
}

.sf-hero-item {
  --hero-item-height: 25rem;
  height: initial;
}
.banner-grid {
  margin: var(--spacer-base) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
.section {
  padding-left: var(--spacer-xl);
  padding-right: var(--spacer-xl);
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

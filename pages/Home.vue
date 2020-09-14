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
        :image="hero.image"
        :class="hero.className"
      />
    </SfHero>
    <MAssurance />
    <MNosSpecialities />
    <MPromoProductBlock />

    <div class="product-slider">
      <div class="container">
        <div class="d-flex slider-content">
          <SfImage
            src="assets/images/jardin.jpg"
            class="slider-banner"
          />
          <lazy-hydrate :trigger-hydration="!loading">
            <m-product-carousel :products="blockoneproduct" />
          </lazy-hydrate>
        </div>
      </div>
    </div>

    <MCodePromotionBlock />

    <div class="product-slider">
      <div class="container">
        <div class="d-flex slider-content">
          <SfImage
            src="assets/images/hyundai-groupe-electrogene-inverter.jpg"
            class="slider-banner"
          />
          <lazy-hydrate :trigger-hydration="!loading">
            <m-product-carousel :products="blockoneproduct" />
          </lazy-hydrate>
        </div>
      </div>
    </div>

    <MSupportBlock />
    <div class="product-slider">
      <div class="container">
        <div class="d-flex slider-content">
          <SfImage
            src="assets/images/outillage.jpg"
            class="slider-banner"
          />
          <lazy-hydrate :trigger-hydration="!loading">
            <m-product-carousel :products="blockoneproduct" />
          </lazy-hydrate>
        </div>
      </div>
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
import MNosSpecialities from 'theme/components/molecules/m-nos-specialities';
import MProductCarousel from 'theme/components/molecules/m-product-carousel';
import MAssurance from 'theme/components/molecules/m-assurance';
import MPromoProductBlock from 'theme/components/molecules/m-promo-product-block';
import MCodePromotionBlock from 'theme/components/molecules/m-code-promotion-block';
import MSupportBlock from 'theme/components/molecules/m-support-block';
import { checkWebpSupport } from 'theme/helpers'
import AAboutUs from 'theme/components/atoms/a-about-us';

import {
  SfHero,
  SfImage
} from '@storefront-ui/vue';

export default {
  name: 'Home',
  components: {
    LazyHydrate,
    SfHero,
    SfImage,
    MNosSpecialities,
    MProductCarousel,
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
      dummyInstagramImages: 'instagram/getInstagramImages',      
      blockoneproduct: 'homepage/getBlockOneProducts',
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
       store.dispatch('homepage/blockOneProducts'),
        // store.dispatch('homepage/blockTwoProducts'),
        // store.dispatch('homepage/blockThreeProducts'),
        //store.dispatch('homepage/fetchNewCollection'),
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
        vm.$store.dispatch('homepage/blockOneProducts').then(() => {
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
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

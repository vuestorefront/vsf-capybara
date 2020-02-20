<template>
  <div
    id="product"
    class="product"
    itemscope
    itemtype="http://schema.org/Product"
  >
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <OProductDetails
      :product="getCurrentProduct"
      :product-gallery="getProductGallery"
      :product-configuration="getCurrentProductConfiguration"
      :product-custom-options="getCurrentCustomOptions"
      :product-attributes="getCustomAttributes"
      :product-stock="stock"
    />
    <lazy-hydrate when-idle>
      <SfSection
        :title-heading="$t('We found other products you might like')"
        class="section"
      >
        <MRelatedProducts type="upsell" />
      </SfSection>
    </lazy-hydrate>
    <lazy-hydrate when-idle>
      <SfSection class="section" v-show="banners.length">
        <router-link :key="i" :to="banner.link" v-for="(banner, i) in banners">
          <SfBanner
            :subtitle="banner.subtitle"
            :title="banner.title"
            :image="banner.image"
            class="banner sf-banner--slim"
          />
        </router-link>
      </SfSection>
    </lazy-hydrate>
    <lazy-hydrate when-idle>
      <SfSection :title-heading="$t('Similar Products')" class="section">
        <MRelatedProducts type="related" />
      </SfSection>
    </lazy-hydrate>

    <SfSection
      v-if="isOnline"
      title-heading="Share Your Look"
      subtitle-heading="#YOURLOOK"
      class="section"
    >
      <AImagesGrid :images="instagramImages" />
    </SfSection>
    <SizeGuide />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { ReviewModule } from '@vue-storefront/core/modules/review';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import MRelatedProducts from 'theme/components/molecules/m-related-products';
import OProductDetails from 'theme/components/organisms/o-product-details';
import AImagesGrid from 'theme/components/atoms/a-images-grid';
import { checkWebpSupport } from 'theme/helpers'

import { SfSection, SfBanner, SfBreadcrumbs } from '@storefront-ui/vue';

const SizeGuide = () =>
  import(
    /* webpackChunkName: "vsf-modals" */ 'theme/components/core/blocks/Product/SizeGuide'
  );

export default {
  components: {
    SizeGuide,
    LazyHydrate,
    MRelatedProducts,
    SfSection,
    OProductDetails,
    SfBanner,
    AImagesGrid,
    SfBreadcrumbs
  },
  provide () {
    return {
      configurableOptionCallback: this.configurableOptionCallback
    }
  },
  data () {
    return {
      stock: {
        isLoading: false,
        max: 0
      }
    };
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      promotedOffers: 'promoted/getPromotedOffers',
      dummyInstagramImages: 'instagram/getInstagramImages',
      getBreadcrumbsRoutes: 'breadcrumbs/getBreadcrumbsRoutes',
      getBreadcrumbsCurrent: 'breadcrumbs/getBreadcrumbsCurrent'
    }),
    breadcrumbs () {
      return this.getBreadcrumbsRoutes
        .map(route => ({
          text: htmlDecode(route.name),
          route: {
            link: route.route_link
          }
        }))
        .concat({
          text: htmlDecode(this.getBreadcrumbsCurrent)
        });
    },
    isOnline () {
      return onlineHelper.isOnline;
    },
    getCustomAttributes () {
      return Object.values(this.attributesByCode)
        .filter(a => {
          return (
            a.is_visible &&
            a.is_user_defined &&
            (parseInt(a.is_visible_on_front) ||
              a.is_visible_on_front === true) &&
            this.getCurrentProduct[a.attribute_code]
          );
        })
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id;
        });
    },
    banners () {
      return checkWebpSupport(this.promotedOffers.productBanners, this.isWebpSupported)
    },
    instagramImages () {
      return checkWebpSupport(this.dummyInstagramImages, this.isWebpSupported)
    }
  },
  watch: {
    isOnline: {
      handler (isOnline) {
        if (isOnline) {
          this.getQuantity();
        }
      }
    }
  },
  async asyncData ({ store, route }) {
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );
    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  beforeCreate () {
    registerModule(ReviewModule);
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('review/list', { productId: this.getOriginalProduct.id }),
      this.$store.dispatch('promoted/updatePromotedOffers'),
      this.$store.dispatch('instagram/updateInstagramImages')
    ])
  },
  beforeRouteEnter (to, from, next) {
    if (isServer) {
      next();
    } else {
      next(vm => {
        vm.getQuantity();
      });
    }
  },
  methods: {
    configurableOptionCallback (variant) {
      this.$bus.$emit('filter-changed-product', variant)
      this.getQuantity();
    },
    async getQuantity () {
      if (this.stock.isLoading) return; // stock info is already loading
      this.stock.isLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });
        this.stock.max = res.qty;
      } finally {
        this.stock.isLoading = false;
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    return {
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      meta: this.getCurrentProduct.meta_description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(this.getCurrentProduct.meta_description)
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.breadcrumbs {
  padding: $spacer-big $spacer-extra-big $spacer-extra-big;
}
.section {
  padding-left: $spacer-big;
  padding-right: $spacer-big;
  @include for-desktop {
    padding-left: 0;
    padding-right: 0;
  }
}

.banner {
  margin: $spacer-big 0;
  @include for-desktop {
    margin: $spacer-extra-big 0;
  }
}

.product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
</style>

<template>
  <div
    id="product"
    class="product"
    itemscope
    itemtype="http://schema.org/Product"
  >
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
      <AImagesGrid :images="dummyInstaImages" />
    </SfSection>
    <SizeGuide />
  </div>
</template>

<script>
import supportsWebP from 'supports-webp';
import SizeGuide from 'theme/components/core/blocks/Product/SizeGuide';
import { mapGetters, mapState } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import {
  localizedRoute,
  currentStoreView
} from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { ReviewModule } from '@vue-storefront/core/modules/review';
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import MRelatedProducts from 'theme/components/molecules/m-related-products';
import OProductDetails from 'theme/components/organisms/o-product-details';
import AImagesGrid from 'theme/components/atoms/a-images-grid';

import { SfSection, SfBanner } from '@storefront-ui/vue';

export default {
  components: {
    SizeGuide,
    // changed
    LazyHydrate,
    MRelatedProducts,
    SfSection,
    OProductDetails,
    SfBanner,
    AImagesGrid
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
      },
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
      banners: []
    };
  },
  computed: {
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      promotedOffers: 'promoted/getPromotedOffers'
    }),
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
    registerModule(RecentlyViewedModule);
  },
  beforeMount () {
    this.banners = this.promotedOffers.productBanners
  },
  async mounted () {
    supportsWebP.then(supported => {
      this.createBanners(supported)
    })
    await Promise.all([
      this.$store.dispatch('recently-viewed/addItem', this.getCurrentProduct),
      this.$store.dispatch('review/list', { productId: this.getOriginalProduct.id }),
      this.$store.dispatch('promoted/updatePromotedOffers')
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
    },
    createBanners (webpSupported) {
      let banners = this.promotedOffers.productBanners.map((banner) => {
        if (webpSupported) {
          banner.image = banner.image.webp
        } else {
          banner.image = banner.image.fallback
        }
        return banner;
      });
      this.banners = banners
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    return {
      link: [
        {
          rel: 'amphtml',
          href: this.$router.resolve(
            localizedRoute(
              {
                name: this.getCurrentProduct.type_id + '-product-amp',
                params: {
                  parentSku: this.getCurrentProduct.parentSku
                    ? this.getCurrentProduct.parentSku
                    : this.getCurrentProduct.sku,
                  slug: this.getCurrentProduct.slug,
                  childSku: this.getCurrentProduct.sku
                }
              },
              storeView.storeCode
            )
          ).href
        }
      ],
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

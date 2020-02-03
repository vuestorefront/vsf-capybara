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
      <promoted-offers single-banner />
    </lazy-hydrate>
    <lazy-hydrate when-idle>
      <SfSection :title-heading="$t('Similar Products')" class="section">
        <MRelatedProducts type="related" />
      </SfSection>
    </lazy-hydrate>
    <SizeGuide />
  </div>
</template>

<script>
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers';
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

import { SfSection } from '@storefront-ui/vue';

export default {
  components: {
    PromotedOffers,
    SizeGuide,
    // changed
    LazyHydrate,
    MRelatedProducts,
    SfSection,
    OProductDetails
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
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
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
  async mounted () {
    await Promise.all([
      this.$store.dispatch('recently-viewed/addItem', this.getCurrentProduct),
      this.$store.dispatch('review/list', { productId: this.getOriginalProduct.id })
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

.product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
</style>

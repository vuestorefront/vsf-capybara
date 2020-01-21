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
    />
    <lazy-hydrate when-idle>
      <SfSection
        :title-heading="$t('We found other products you might like')"
        class="section"
      >
        <m-related-products type="upsell" />
      </SfSection>
    </lazy-hydrate>
    <lazy-hydrate when-idle>
      <promoted-offers single-banner />
    </lazy-hydrate>
    <lazy-hydrate when-idle>
      <SfSection :title-heading="$t('Similar Products')" class="section">
        <m-related-products type="related" />
      </SfSection>
    </lazy-hydrate>
    <SizeGuide />
  </div>
</template>

<script>
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers';
import focusClean from 'theme/components/theme/directives/focusClean';
import SizeGuide from 'theme/components/core/blocks/Product/SizeGuide';
import { mapGetters } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption.ts';
import {
  getAvailableFiltersByProduct,
  getSelectedFiltersByProduct
} from '@vue-storefront/core/modules/catalog/helpers/filters';
import { isOptionAvailableAsync } from '@vue-storefront/core/modules/catalog/helpers/index';
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
  directives: { focusClean },
  mixins: [ProductOption],
  data () {
    return {
      detailsOpen: false,
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false,
      hasAttributesLoaded: false
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
    getOptionLabel () {
      return option => {
        const configName = option.attribute_code
          ? option.attribute_code
          : option.label.toLowerCase();
        return this.getCurrentProductConfiguration[configName]
          ? this.getCurrentProductConfiguration[configName].label
          : configName;
      };
    },
    isOnline () {
      return onlineHelper.isOnline;
    },
    structuredData () {
      return {
        availability:
          this.getCurrentProduct.stock &&
          this.getCurrentProduct.stock.is_in_stock
            ? 'InStock'
            : 'OutOfStock'
      };
    },
    getProductOptions () {
      if (
        this.getCurrentProduct.errors &&
        Object.keys(this.getCurrentProduct.errors).length &&
        Object.keys(this.getCurrentProductConfiguration).length
      ) {
        return [];
      }
      return this.getCurrentProduct.configurable_options;
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
    getAvailableFilters () {
      return getAvailableFiltersByProduct(this.getCurrentProduct);
    },
    getSelectedFilters () {
      return getSelectedFiltersByProduct(
        this.getCurrentProduct,
        this.getCurrentProductConfiguration
      );
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(
        this.getCurrentProduct.type_id
      );
    },
    isAddToCartDisabled () {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      );
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
    await this.$store.dispatch(
      'recently-viewed/addItem',
      this.getCurrentProduct
    );
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
    showDetails (event) {
      this.detailsOpen = true;
      event.target.classList.add('hidden');
    },
    notifyOutStock () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(
          'The product is out of stock and cannot be added to the cart!'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    notifyWrongAttributes () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'No such configuration for the product. Please do choose another combination of attributes.'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    changeFilter (variant) {
      this.$bus.$emit(
        'filter-changed-product',
        Object.assign({ attribute_code: variant.type }, variant)
      );
      this.getQuantity();
    },
    isOptionAvailable (option) {
      // check if the option is available
      const currentConfig = Object.assign(
        {},
        this.getCurrentProductConfiguration
      );
      currentConfig[option.type] = option;
      return isOptionAvailableAsync(this.$store, {
        product: this.getCurrentProduct,
        configuration: currentConfig
      });
    },
    async getQuantity () {
      if (this.isStockInfoLoading) return; // stock info is already loading
      this.isStockInfoLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });
        this.maxQuantity = res.qty;
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    handleQuantityError (error) {
      this.quantityError = error;
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
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-primary: color(primary);
$color-tertiary: color(tertiary);
$color-secondary: color(secondary);
$color-white: color(white);
$bg-secondary: color(secondary, $colors-background);

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
  &__add-to-compare {
    display: none;
    @media (min-width: 767px) {
      display: block;
    }
  }
}

.breadcrumbs {
  @media (max-width: 767px) {
    margin: 15px 0;
    padding: 15px 0 0 15px;
  }
}

.error {
  color: red;
  font-weight: bold;
  padding-bottom: 15px;
}
.data {
  @media (max-width: 767px) {
    border-bottom: 1px solid $bg-secondary;
  }
}

.image {
  @media (max-width: 1023px) {
    margin-bottom: 20px;
  }
}

.product-name {
  @media (max-width: 767px) {
    font-size: 36px;
  }
}

.price {
  @media (max-width: 767px) {
    color: $color-primary;
  }
}

.variants-label {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.variants-wrapper {
  @media (max-width: 767px) {
    padding-bottom: 30px;
  }

  .sizes {
    @media (max-width: 767px) {
      width: 100%;
    }
  }

  .size-guide {
    height: 40px;
    @media (max-width: 767px) {
      width: 100%;
      margin-left: 0;
    }
  }
}

.product-top-section {
  @media (max-width: 767px) {
    padding: 0;
    background-color: $color-white;
  }
}

.add-to-buttons {
  @media (max-width: 767px) {
    padding-top: 30px;
    margin-bottom: 40px;
  }
}

.details {
  @media (max-width: 767px) {
    padding: 50px 15px 15px;
  }
}

.details-title {
  padding: 0 8px;

  @media (max-width: 767px) {
    font-size: 18px;
    margin: 0;
  }
}

.details-wrapper {
  @media (max-width: 767px) {
    position: relative;
    max-height: 140px;
    overflow: hidden;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  &--open {
    max-height: none;
  }
}

.details-overlay {
  @media (max-width: 767px) {
    position: absolute;
    height: 75%;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 0;
    cursor: pointer;
    background: linear-gradient(rgba($color-white, 0), rgba($color-white, 1));
    &.hidden {
      display: none;
    }
  }
}

.price-original {
  text-decoration: line-through;
}

.action {
  &:hover {
    color: $color-tertiary;
  }
}

.attributes {
  list-style-type: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.product-image {
  mix-blend-mode: multiply;
  width: 460px;
}

.web-share {
  float: right;
}
</style>

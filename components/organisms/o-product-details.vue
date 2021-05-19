<template>
  <div class="o-product-details product" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    <meta itemprop="priceCurrency" :content="$store.state.storeView.i18n.currencyCode">
    <meta itemprop="price" :content="parseFloat(product.price_incl_tax).toFixed(2)">
    <meta itemprop="availability" :content="availability">
    <meta itemprop="url" :content="product.url_path">
    <MZoomGallery
      :images="gallery"
    />
    <div class="product__info">
      <MProductShortInfo
        :product="product"
        :custom-options="productCustomOptions"
      />
      <SfButton
        v-show="sizeOption"
        @click.native="openSizeGuide"
        class="sf-button--text desktop-only product__guide"
      >
        {{ $t('Size guide') }}
      </SfButton>
      <div>
        <MProductOptionsConfigurable
          v-if="product.type_id =='configurable'"
          :product="product"
          :configuration="productConfiguration"
        />
        <MProductOptionsGroup
          v-if="product.type_id =='grouped'"
          :product-options="product.product_links"
        />
        <MProductOptionsBundle
          v-if="product.bundle_options && product.bundle_options.length > 0"
          :product="product"
        />
        <MProductOptionsCustom
          v-else-if="product.custom_options && product.custom_options.length > 0"
          :product="product"
        />
        <MProductAddToCart
          class="product__add-to-cart"
          :product="product"
          :stock="productStock"
        />
      </div>
      <MProductAdditionalInfo
        :product="product"
      />
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import { SfButton } from '@storefront-ui/vue';
import MZoomGallery from 'theme/components/molecules/m-zoom-gallery';
import MProductShortInfo from 'theme/components/molecules/m-product-short-info';
import MProductAddToCart from 'theme/components/molecules/m-product-add-to-cart';
import MProductAdditionalInfo from 'theme/components/molecules/m-product-additional-info';
import MProductOptionsConfigurable from 'theme/components/molecules/m-product-options-configurable';
import MProductOptionsBundle from 'theme/components/molecules/m-product-options-bundle';
import MProductOptionsCustom from 'theme/components/molecules/m-product-options-custom';
import MProductOptionsGroup from 'theme/components/molecules/m-product-options-group';
import { ModalList } from 'theme/store/ui/modals';
import { mapActions } from 'vuex';

export default {
  components: {
    SfButton,
    MZoomGallery,
    MProductShortInfo,
    MProductAddToCart,
    MProductAdditionalInfo,
    MProductOptionsConfigurable,
    MProductOptionsBundle,
    MProductOptionsCustom,
    MProductOptionsGroup
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    productGallery: {
      type: Array,
      default: () => []
    },
    productConfiguration: {
      type: Object,
      default: () => ({})
    },
    productCustomOptions: {
      type: Object,
      default: () => ({})
    },
    productAttributes: {
      type: Array,
      default: () => []
    },
    productStock: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    gallery () {
      return this.productGallery.map(imageObject => ({
        stage: imageObject.src,
        thumb: imageObject.src,
        big: imageObject.src,
        alt: this.product.name,
        title: this.product.name
      }));
    },
    availability () {
      return this.product.stock && this.product.stock.is_in_stock ? 'InStock' : 'OutOfStock'
    },
    sizeOption () {
      return get(this.productConfiguration, 'size', false)
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    openSizeGuide () {
      this.openModal({ name: ModalList.SizeGuide })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-product-details {
  .m-product-additional-info {
    margin-top: var(--spacer-lg);
  }
  .m-zoom-gallery {
    flex: 1 1;
    padding: 0 var(--spacer-sm);

    @media (min-width: $tablet-min) {
      padding: 0 0 0 var(--spacer-sm);
    }

    @include for-desktop {
      max-width: 42%;
    }
  }
}

.product {
  @media (min-width: $tablet-min) {
    display: flex;
    align-items: flex-start;
  }
  &__info {
    margin: var(--spacer-sm) auto var(--spacer-xs);
    padding: 0 var(--spacer-sm);

    @media (min-width: $tablet-min) {
      max-width: 25.625rem;
      margin: 0 0 0 2.5rem;
      padding: 0 var(--spacer-sm) 0 0;
    }

    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__add-to-cart {
    margin: var(--spacer-base) 0 0;
    @media (min-width: $tablet-min) {
      margin-top: var(--spacer-sm);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
}

.section {
  border-bottom: 1px solid #f1f2f3;
  padding-bottom: 10px;
  @media (min-width: $tablet-min) {
    border: 0;
    padding-bottom: 0;
  }
}
</style>

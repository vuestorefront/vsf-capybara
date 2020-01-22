<template>
  <div class="o-product-details" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    <meta itemprop="priceCurrency" :content="$store.state.storeView.i18n.currencyCode">
    <meta itemprop="price" :content="parseFloat(product.price_incl_tax).toFixed(2)">
    <meta itemprop="availability" :content="structuredData.availability">
    <meta itemprop="url" :content="product.url_path">
    <MProductGallery
      :offline-image="offlineImage"
      :gallery="gallery"
      :configuration="productConfiguration"
    />
    <div class="o-product-details__description">
      <SfSticky>
        <MProductShortInfo
          :product="product"
          :custom-options="productCustomOptions"
          :reviews="reviews"
        />
        <ATextAction
          class="o-product-details__text-action"
          text="Size guide"
          @click="openSizeGuide"
        />
        <MProductOptions />
        <MProductCallToAction
          class="o-product-details__section"
          :product="product"
          :stock="productStock"
        />
        <MProductAdditionalInfo
          :product="product"
          :reviews="reviews"
          :attributes="productAttributes"
        />
      </SfSticky>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import config from 'config';
import { mapGetters } from 'vuex';
import { SfSticky } from '@storefront-ui/vue';
import ATextAction from 'theme/components/atoms/a-text-action';
import MProductGallery from 'theme/components/molecules/m-product-gallery';
import MProductShortInfo from 'theme/components/molecules/m-product-short-info';
import MProductOptions from 'theme/components/molecules/m-product-options';
import MProductCallToAction from 'theme/components/molecules/m-product-call-to-action';
import MProductAdditionalInfo from 'theme/components/molecules/m-product-additional-info';

export default {
  components: {
    SfSticky,
    ATextAction,
    MProductGallery,
    MProductShortInfo,
    MProductOptions,
    MProductCallToAction,
    MProductAdditionalInfo
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
    offlineImage () {
      const width = config.products.thumbnails.width;
      const height = config.products.thumbnails.height;
      return {
        mobile: {
          url: this.getThumbnail(this.product.image, width, height),
          alt: this.product.name
        },
        desktop: {
          url: this.getThumbnail(this.product.image, width, height),
          alt: this.product.name
        }
      };
    },
    gallery () {
      return this.productGallery.map(imageObject => ({
        ...imageObject,
        mobile: {
          url: imageObject.loading,
          alt: this.product.name
        },
        desktop: {
          url: imageObject.src,
          alt: this.product.name
        }
      }));
    },
    reviews () {
      const baseReviews = get(this.$store.state.review, 'items.items', [])
      return baseReviews.map((review) => ({
        author: review.nickname,
        date: review.created_at,
        message: `${review.title}: ${review.detail}`,
        rating: 1 // TODO: remove hardcode
      }))
    },
    structuredData () {
      return {
        availability:
          this.product.stock &&
          this.product.stock.is_in_stock
            ? 'InStock'
            : 'OutOfStock'
      };
    }
  },
  methods: {
    openSizeGuide () {
      this.$bus.$emit('modal-show', 'modal-sizeguide');
    }
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

.o-product-details {
  @include for-desktop {
    display: flex;
  }
  &__description {
    flex: 1;
    padding: 0 $spacer-big;
    @include for-desktop {
      margin-left: $spacer-big * 5;
    }
  }
  &__text-action {
    @include for-desktop {
      justify-content: flex-end;
    }
  }
  &__section {
    border-bottom: 1px solid #f1f2f3;
    padding-bottom: 10px;
    @include for-desktop {
      border: 0;
      padding-bottom: 0;
    }
  }
}
</style>

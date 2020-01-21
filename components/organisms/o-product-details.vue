<template>
  <div class="o-product-details">
    <MProductGallery
      :offline-image="offlineImage"
      :gallery="gallery"
      :configuration="productConfiguration"
    />
    <div class="o-product-details__description">
      <SfSticky>
        <MProductShortInfo :product="product" :custom-options="productCustomOptions" />
        <ATextAction
          class="o-product-details__text-action"
          text="Size guide"
          @click="openSizeGuide"
        />
        <MProductOptions />
        <div class="o-product-details__section">
          <SfAlert
            message="Low in stock"
            type="warning"
            class="o-product-details__alert"
          />
          <MProductCallToAction />
        </div>
        <MProductAdditionalInfo />
      </SfSticky>
    </div>
  </div>
</template>
<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { SfAlert, SfSticky } from '@storefront-ui/vue';
import ATextAction from 'theme/components/atoms/a-text-action';
import MProductGallery from 'theme/components/molecules/m-product-gallery';
import MProductShortInfo from 'theme/components/molecules/m-product-short-info';
import MProductOptions from 'theme/components/molecules/m-product-options';
import MProductCallToAction from 'theme/components/molecules/m-product-call-to-action';
import MProductAdditionalInfo from 'theme/components/molecules/m-product-additional-info';

export default {
  components: {
    SfAlert,
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
    }
  },
  computed: {
    offlineImage () {
      const width = config.products.thumbnails.width;
      const height = config.products.thumbnails.height;
      return {
        small: {
          url: this.getThumbnail(this.product.image, width, height),
          alt: this.product.name
        },
        normal: {
          url: this.getThumbnail(this.product.image, width, height),
          alt: this.product.name
        },
        big: {
          url: this.getThumbnail(this.product.image, width, height),
          alt: this.product.name
        }
      };
    },
    gallery () {
      return this.productGallery.map(imageObject => ({
        ...imageObject,
        small: {
          url: imageObject.loading,
          alt: this.product.name
        },
        normal: {
          url: imageObject.src,
          alt: this.product.name
        },
        big: {
          url: imageObject.src,
          alt: this.product.name
        }
      }));
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
  &__alert {
    margin-top: 1.5rem;
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
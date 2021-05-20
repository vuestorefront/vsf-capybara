<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-printed-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      form-action="/"
      :product="getCurrentProduct"
      :product-id="getCurrentProduct.id + ''"
      :product-sku="getCurrentProduct.sku"
      product-type="23"
      :product-price="price.regular"
      :product-special-price="price.special"
      :product-quantity="getCurrentProduct.qty"
      :product-description="getCurrentProduct.description"
      :product-short-description="getCurrentProduct.short_description"
      :product-name="getCurrentProduct.name"
      :product-images="getProductImages"
      initial-style-value="simplePrintedKeychains"
      :available-styles="getAvailableStyles"
    />
  </div>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { getProductPrice } from 'theme/helpers';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import OPrintedProductOrderForm from 'theme/components/organisms/o-printed-product-order-form';

export default {
  name: 'PrintedProduct',
  components: {
    OPrintedProductOrderForm
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      attributesByCode: 'attribute/attributeListByCode'
    }),
    artworkUploadUrl () {
      return config.images.fileuploaderUploadUrl;
    },
    price () {
      return getProductPrice(this.getCurrentProduct, this.getCurrentCustomOptions, false);
    },
    getProductImages () {
      const images = this.getProductGallery.map(imageObject => ({
        stage: imageObject.src,
        thumb: imageObject.src,
        big: imageObject.src,
        alt: this.getCurrentProduct.name,
        title: this.getCurrentProduct.name
      }));

      return [
        {
          sku: this.getCurrentProduct.sku,
          images: images
        }
      ]
    },
    getAvailableStyles () {
      if (!this.getCurrentProduct.bundle_options) {
        throw new Error('The printed product has not bundle options');
      }

      let optionsProducts = [];
      this.getCurrentProduct.bundle_options.forEach(option => {
        option.product_links.forEach(productLink => optionsProducts.push(productLink.product));
      });

      const variantProducts = optionsProducts.filter(product => ['simple', 'bundlePrimaryProduct'].includes(product.type_id));

      if (!variantProducts) {
        throw new Error('The printed product has not available styles');
      }

      return variantProducts.map(variantProduct => ({
        value: variantProduct.sku,
        label: variantProduct.name,
        description: variantProduct.description,
        shortDescription: variantProduct.short_description,
        price: variantProduct.regular_price,
        specialPrice: variantProduct.special_price
      }));
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku: null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );
    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  metaInfo () {
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#printed-product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.o-printed-product-order-form {
  margin-top: var(--spacer-lg);
}

::v-deep {
  .product__colors button {
      border: 1px solid var(--c-light);
  }
}
</style>

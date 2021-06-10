<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-printed-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      :product="getCurrentProduct"
      :product-id="getCurrentProduct.id + ''"
      :product-sku="getCurrentProduct.sku"
      :product-type="getBackendProductId"
      :product-price="price.regular"
      :product-special-price="price.special"
      :product-quantity="getCurrentProduct.qty"
      :product-description="getCurrentProduct.description"
      :product-short-description="getCurrentProduct.short_description"
      :product-name="getCurrentProduct.name"
      :product-images="getProductImages"
      :default-style="getDefaultStyle"
      :available-styles="getAvailableStyles"
      :addons="getAvailableAddons"
    />
  </div>
</template>

<script lang="ts">
import config from 'config';
import { mapGetters } from 'vuex';
import { getProductPrice } from 'theme/helpers';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';
import { ProductValue } from 'src/modules/budsies/models/product.value';

import OPrintedProductOrderForm, { GalleryProductImages, SelectOption } from 'theme/components/organisms/o-printed-product-order-form.vue';
import { AddonOption } from 'theme/components/molecules/m-extra-faces.vue';

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
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    artworkUploadUrl () {
      return config.images.fileuploaderUploadUrl;
    },
    price () {
      return getProductPrice(this.getCurrentProduct, this.getCurrentCustomOptions, false);
    },
    getProductImages (): GalleryProductImages[] {
      const images = this.getProductGallery.map((imageObject: any) => ({
        stage: imageObject.src,
        thumb: imageObject.src,
        big: imageObject.src
      }));

      let result: GalleryProductImages[] = [
        {
          sku: this.getCurrentProduct.sku,
          images: images
        }
      ]

      if (!this.getCurrentProduct.bundle_options) {
        return result;
      }

      for (const option of this.getCurrentProduct.bundle_options) {
        for (const productLink of option.product_links) {
          const gallery = getGalleryByProduct(productLink.product);

          const images = gallery.map((imageObject: any) => ({
            stage: imageObject.src,
            thumb: imageObject.src,
            big: imageObject.src
          }));

          result.push({
            sku: productLink.product.sku,
            images: images
          });
        }
      }

      return result;
    },
    getDefaultStyle () {
      if (this.getBackendProductId === ProductValue.PRINTED_KEYCHAINS) {
        return 'simplePrintedKeychains';
      }

      return '';
    },
    getAvailableStyles () {
      if (!this.getCurrentProduct.bundle_options) {
        throw new Error('The printed product has no bundle options');
      }

      let availableStyles: SelectOption[] = [];
      for (const option of this.getCurrentProduct.bundle_options) {
        for (const productLink of option.product_links) {
          if (!['simple', 'bundlePrimaryProduct'].includes(productLink.product.type_id)) {
            continue;
          }

          availableStyles.push({
            optionId: option.option_id,
            optionValueId: +productLink.id,
            value: productLink.product.sku,
            label: productLink.product.name,
            description: productLink.product.description,
            shortDescription: productLink.product.short_description,
            price: productLink.product.regular_price,
            specialPrice: productLink.product.special_price
          });
        }
      }

      return availableStyles;
    },
    getAvailableAddons (): AddonOption[] {
      const addons = this.$store.getters['budsies/getPrintedProductAddons'](this.getCurrentProduct.id);

      if (!addons.length) {
        return [];
      }

      let addonOptions: Record<string, string|number>[] = [];

      for (const option of this.getCurrentProduct.bundle_options) {
        for (const productLink of option.product_links) {
          if (productLink.product.type_id !== 'plushToyAddon') {
            continue;
          }

          addonOptions.push({
            optionId: option.option_id,
            optionValueId: +productLink.id,
            sku: productLink.product.sku
          });
        }
      }

      return addons.map(
        (addon: any) => {
          const addonOption = addonOptions.find(addonOption => addonOption.sku === addon.id);

          if (!addonOption) {
            throw new Error('The option product of printed product is not found');
          }

          return {
            id: addon.id,
            label: addon.label,
            value: addon.value,
            optionId: addonOption.optionId,
            optionValueId: addonOption.optionValueId
          }
        }
      );
    },
    getBackendProductId (): ProductValue {
      switch (this.getCurrentProduct.id) {
        case 277:
          return ProductValue.PRINTED_SOCKS;
        case 340:
          return ProductValue.PRINTED_MASKS;
        case 353:
          return ProductValue.PRINTED_KEYCHAINS;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.getCurrentProduct.id}' product ID`
          );
      }
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')

    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku: null
    });

    await store.dispatch('budsies/loadPrintedProductAddons', {
      productId: product.id
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
  padding: 0 1rem;

  ::v-deep {
    .product__colors button {
        border: 1px solid var(--c-light);
    }
  }

  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;

    .o-printed-product-order-form {
      margin-top: var(--spacer-lg);
    }
  }
}

</style>

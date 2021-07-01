<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-phrase-pillow-product-order-form
      :product="getCurrentProduct"
      :image-upload-url="imageUploadUrl"
      :upload-product-type="backendProductId"
      :svg-path="svgPath"
      :initial-front-design="initialFrontDesign"
      :initial-back-design="initialBackDesign"
      :front-design-products="frontDesigns"
      :back-design-products="backDesigns"
      :submit-animation-steps="submitAnimationSteps"
      submit-animation-url="/assets/images/phrasePillow/submit-animation.mp4"
      :production-time-options="[]"
      :bodyparts="bodyparts"
    />
  </div>
</template>

<script lang="ts">
import config from 'config';
import { mapGetters } from 'vuex';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { ProductValue } from 'src/modules/budsies';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';

import OPhrasePillowProductOrderForm from 'theme/components/organisms/o-phrase-pillow-product-order-form.vue';
import Bodypart from 'src/modules/budsies/models/bodypart.model';
import Task from 'core/lib/sync/types/Task';
import DesignProduct from 'theme/components/interfaces/design-product.interface';
import ProductImage from 'theme/components/interfaces/product-image.interface';
import Product from 'core/modules/catalog/types/Product';

export default {
  name: 'PhrasePillowProduct',
  components: {
    OPhrasePillowProductOrderForm
  },
  data () {
    return {
      plushieId: undefined as number | undefined,
      submitAnimationSteps: [
        { text: 'Uploading your image. So cute!', value: 33 },
        { text: 'Rendering design to maximize hugs', value: 66 },
        { text: 'Optimizing pillow softness vectors', value: 100 }
      ]
    };
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    svgPath (): string {
      return config.images.baseUrl + '/150/150/resize/phrase_pillow/svg-templates';
    },
    imageUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    frontDesigns (): DesignProduct[] {
      return this.getDesignProducts(true);
    },
    backDesigns (): DesignProduct[] {
      return this.getDesignProducts(false);
    },
    initialFrontDesign (): string {
      if (this.$route.params.parentSku) {
        return this.$route.params.parentSku;
      }

      const designs = this.frontDesigns;
      const design = designs.slice(-1)[0];

      return design ? design.sku : '';
    },
    initialBackDesign (): string {
      const designs = this.backDesigns;
      const design = designs.slice(-1)[0];

      return design ? design.sku : '';
    },
    bodyparts (): Bodypart[] {
      const bodyparts = this.$store.getters['budsies/getProductBodyparts'](this.getCurrentProduct.id);

      if (!bodyparts.length) {
        return [];
      }

      return bodyparts;
    },
    backendProductId (): ProductValue {
      switch (this.getCurrentProduct.id) {
        case 333:
          return ProductValue.PHRASE_PILLOW;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.getCurrentProduct.id}' product ID`
          );
      }
    }
  },
  methods: {
    getDesignProductImages (product: Product): ProductImage[] {
      const gallery = getGalleryByProduct(product);

      return gallery.map((image: any) => ({
        thumb: image.src,
        stage: image.src,
        big: image.src,
        sku: product.sku
      }))
    },
    getDesignProducts (returnFrontDesigns: boolean): DesignProduct[] {
      if (!this.getCurrentProduct.bundle_options) {
        throw new Error('The phrase pillow product has no bundle options');
      }

      let designs: DesignProduct[] = [];
      for (const option of this.getCurrentProduct.bundle_options) {
        for (const productLink of option.product_links) {
          if (!['pillowSideDesign'].includes(productLink.product.type_id)) {
            continue;
          }

          if (productLink.product.sku.includes('Back') === returnFrontDesigns) {
            continue;
          }

          designs.push({
            id: productLink.product.id,
            sku: productLink.product.sku,
            name: productLink.product.name,
            thumbnail: getThumbnailForProduct(productLink.product),
            price: 0,
            defaultOtherSideDesign: productLink.product.default_other_side_design,
            defaultAccentColor: productLink.product.default_accent_color,
            images: this.getDesignProductImages(productLink.product),
            optionId: option.option_id,
            optionValueId: productLink.id
          });
        }
      }

      return designs;
    }
  },
  async mounted (): Promise<void> {
    // TODO check ID in URL and load plushie instead of create a new one

    const result = this.$store.dispatch('budsies/createNewPlushie', { productId: this.getCurrentProduct.id });

    result.then((task: Task) => {
      this.plushieId = task.result;
    });
  },
  async asyncData ({ store, route, context }): Promise<void> {
    if (context) context.output.cacheTags.add('product')

    const product = await store.dispatch('product/loadProduct', {
      parentSku: 'petsiesPhrasePillow_bundle',
      childSku: null
    });

    await store.dispatch('budsies/loadProductBodyparts', { productId: product.id });

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

<template>
  <div id="forevers-product" itemscope itemtype="http://schema.org/Product">
    <o-forevers-creation-wizard
      :artwork-upload-url="artworkUploadUrl"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import config from 'config';
import { mapGetters } from 'vuex';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { ProductValue } from 'src/modules/budsies';
import Product from 'core/modules/catalog/types/Product';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';

import Bodypart from 'src/modules/budsies/models/bodypart.model';
import OForeversCreationWizard from 'theme/components/organisms/o-forevers-creation-wizard.vue';
import AddonOption from '../components/interfaces/addon-option.interface';

type AugumentedProduct = Partial<Product> & {
  meta_title: string | null,
  meta_description: string | null
}

export default Vue.extend({
  name: 'ForeversProduct',
  components: {
    OForeversCreationWizard
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters({
      // getCurrentProduct: 'product/getCurrentProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    getCurrentProduct (): AugumentedProduct | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    artworkUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    bodyparts (): Bodypart[] {
      if (!this.getCurrentProduct) {
        return [];
      }

      const bodyparts = this.$store.getters['budsies/getProductBodyparts'](this.getCurrentProduct.id);

      if (!bodyparts.length) {
        return [];
      }

      return bodyparts;
    },
    backendProductId (): ProductValue {
      switch (this.getCurrentProduct?.id) {
        case 73:
          return ProductValue.FOREVERS_DOG;
        case 74:
          return ProductValue.FOREVERS_CAT;
        case 75:
          return ProductValue.FOREVERS_OTHER;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.getCurrentProduct?.id}' product ID`
          );
      }
    },
    addons (): AddonOption[] {
      if (!this.getCurrentProduct?.bundle_options) {
        return []
      }

      let result: AddonOption[] = [];
      for (const option of this.getCurrentProduct.bundle_options) {
        if (option.title !== 'Addons') {
          continue;
        }

        for (const productLink of option.product_links) {
          if (!productLink.product) {
            continue;
          }

          const images: string[] = getGalleryByProduct(productLink.product).map((i: any) => i.src);

          result.push({
            id: Number(productLink.product.id),
            sku: productLink.product.sku,
            name: productLink.product.name,
            description: productLink.product.description,
            price: productLink.product.final_price,
            images: images,
            optionId: option.option_id,
            optionValueId: productLink.id.toString(),
            videoUrl: (productLink as any).video_url ? (productLink as any).video_url : undefined
          });
        }
      }

      return result;
    }
  },
  async mounted (): Promise<void> {
    // TODO check ID in URL and load plushie instead of create a new one

    // this.plushieId = await this.createPlushie();
  },
  async asyncData ({ store, route, context }): Promise<void> {
    // if (context) context.output.cacheTags.add('product')

    // const product = await store.dispatch('product/loadProduct', {
    //   parentSku: route.params.parentSku,
    //   childSku: null
    // });

    // await store.dispatch('budsies/loadProductBodyparts', { productId: product.id });

    // const loadBreadcrumbsPromise = store.dispatch(
    //   'product/loadProductBreadcrumbs',
    //   { product }
    // );

    // if (isServer) await loadBreadcrumbsPromise;
    // catalogHooksExecutors.productPageVisited(product);
  },
  methods: {
    async onMakeAnother (): Promise<void> {
      this.plushieId = await this.createPlushie();
    },
    async createPlushie (): Promise<number> {
      if (!this.getCurrentProduct) {
        throw new Error('Current product is not set!');
      }

      const task = await this.$store.dispatch('budsies/createNewPlushie', { productId: this.getCurrentProduct.id });
      return task.result;
    }
  },
  metaInfo () {
    return {
      title: htmlDecode(
        this.getCurrentProduct?.meta_title || this.getCurrentProduct?.name
      ),
      meta: this.getCurrentProduct?.meta_description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(this.getCurrentProduct?.meta_description)
          }
        ]
        : []
    };
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#forevers-product {
  //box-sizing: border-box;
  padding: var(--spacer-lg) 1rem 0;

  @include for-desktop {
    max-width: 77.5rem;
    margin: 0 auto;
  }
}

</style>

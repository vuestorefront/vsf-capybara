<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-pillow-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      :product="getCurrentProduct"
      :backend-product-id="backendProductId"
      :plushie-id="plushieId"
      :sizes="sizes"
      :bodyparts="bodyparts"
      @make-another="onMakeAnother"
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

import OPillowProductOrderForm from 'theme/components/organisms/o-pillow-product-order-form.vue';
import BodypartOption from '../components/interfaces/bodypart-option';
import Bodypart from 'src/modules/budsies/models/bodypart.model';
import Task from 'core/lib/sync/types/Task';

export default {
  name: 'PillowProduct',
  components: {
    OPillowProductOrderForm
  },
  data () {
    return {
      plushieId: undefined as number | undefined
    };
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    artworkUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    sizes (): BodypartOption[] {
      if (!this.getCurrentProduct.bundle_options) {
        throw new Error('The pillow product has no bundle options');
      }

      let availableSizes: BodypartOption[] = [];
      for (const option of this.getCurrentProduct.bundle_options) {
        for (const productLink of option.product_links) {
          if (!['bundlePrimaryProduct'].includes(productLink.product.type_id)) {
            continue;
          }

          availableSizes.push({
            id: productLink.product.id,
            label: productLink.product.name + ' - $' + productLink.product.price,
            value: productLink.product.sku,
            isSelected: false,
            contentTypeId: productLink.product.contentTypeId,
            color: productLink.product.color,
            image: productLink.product.image,
            optionId: option.option_id,
            optionValueId: productLink.id
          });
        }
      }

      return availableSizes;
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
        case 253:
          return ProductValue.PILLOW;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.getCurrentProduct.id}' product ID`
          );
      }
    }
  },
  async mounted (): Promise<void> {
    // TODO check ID in URL and load plushie instead of create a new one

    this.plushieId = await this.createPlushie();
  },
  async asyncData ({ store, route, context }): Promise<void> {
    if (context) context.output.cacheTags.add('product')

    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
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
  methods: {
    async onMakeAnother (): Promise<void> {
      this.plushieId = await this.createPlushie();
    },
    async createPlushie (): Promise<number> {
      const task = await this.$store.dispatch('budsies/createNewPlushie', { productId: this.getCurrentProduct.id });
      return task.result;
    }
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
  padding: var(--spacer-lg) 1rem 0;

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

<template>
  <div class="promo-product-block">
    <div class="container">
        <div class="d-flex static-block-type">
             <SfImage
                src="/assets/images/promo_product_1.png"
                class="image_promo_product"
              />
               <SfImage
                src="/assets/images/promo_product_2.png"
                class="image_promo_product"
              />
               <SfImage
                src="/assets/images/promo_product_3.png"
                class="image_promo_product"
              />
        </div>
    </div>
  </div>
</template>

<script>
  import { SfImage } from '@storefront-ui/vue';
  export default { components: { SfImage } };
</script>

<style lang="scss" scoped>

.promo-product-block
{
  margin-top: 10px;
}

.image_promo_product
{
  margin-left: 50px;
}
</style>

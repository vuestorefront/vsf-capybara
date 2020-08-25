<template>
  <div class="promo-product-block">
    <div class="container">
        <div class="d-flex static-block-type">
            <a>
             <SfImage
                src="/assets/images/promo_product_1.png"
                class="image_promo_product"
              />
            </a>
            <a>
               <SfImage
                src="/assets/images/promo_product_2.png"
                class="image_promo_product"
              />
            </a>
            <a>
               <SfImage
                src="/assets/images/promo_product_3.png"
                class="image_promo_product"
              />
            </a>
        </div>
    </div>
  </div>
</template>

<script>
  import { SfImage } from '@storefront-ui/vue';
  export default { components: { SfImage } };
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.promo-product-block{
  marging: 30px 0;
  .static-block-type{
    justify-content: space-between;
    @include for-mobile{
      flex-direction: column;
    }
    .sf-image{
      width: 100%;
    }
    a{
       display: block;
        width: 33%;
        @media screen and (max-width: 480px){
          width: 100%;
        }
        &:nth-child(2){
          margin: 0 30px;
          @include for-mobile{
            margin: 0 auto;
          }
        }
    }
  }
}

</style>

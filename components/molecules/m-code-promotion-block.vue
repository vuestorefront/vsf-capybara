<template>
  <div class="code-promotion-block">
    <div class="container">
        <div class="d-flex code-promotion-block-type">
             <SfImage
                src="/assets/banner/png/full_width_banner.jpg"
                class="image_code_promotio_1"
              />
               <SfImage
                src="/assets/banner/png/full_width_banner.jpg"
                class="image_code_promotio_2"
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
.code-promotion-block
{
  margin-top: 10px;
}
.image_code_promotio_1
{
  --image-height: 187px;
  --image-width: 630px;
}
.image_code_promotio_2
{
  margin-left: 30px;
  --image-height: 187px;
  --image-width: 630px;
}
</style>

<template>
  <div class="code-promotion-block">
    <div class="container">
      <div class="d-flex code-promotion-block-type">
        <a href="">
          <SfImage
            src="/assets/images/black-friday.jpg"
            class="black-friday"
          />
        </a>
        <a href="">
          <SfImage
            src="/assets/images/black-friday.jpg"
            class="black-friday"
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
.code-promotion-block{
    .code-promotion-block-type{
        a{
            width: 50%;
            margin: 0 15px;
            img{
                border-radius: 5px;
            }
        }
    }
}
</style>
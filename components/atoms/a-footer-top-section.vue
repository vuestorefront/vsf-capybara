<template>
  <div style="max-width: 1240px;">
    <SfCallToAction
      :title="title"
      :image="image"
      :background="background"
      class="class_call_to_action"
    >
      <template #title>
        <div class="content_parent">
          <img
            :src="'/assets/images/apropos_Capitools.png'"
            class="image_apropos_capitools"
          >
          <div class="content_right">
            <div class="text_1">
              A few words to get to know more about us ...
            </div>
            <div class="text_2">
              Since 2014, Capitools has made it possible to simplify all your DIY and gardening desires.
            </div>
            <div class="text_3">
              Professionals, amateurs or just a DIY and DIY fan, we offer a wide choice of tools, machines and
              <br>accessories.
              <br>A specific project? Find everything you need from A to Z!
            </div>
            <div class="text_4">
              <b>Our strength ?</b>
              <br>A team of experts at your service
              <br>Professional quality products specially selected for you
              <br>More than 3,000 references in stock
              <br>A price accessible to all wallets!
              <br>Fast delivery in less than 72 hours!
            </div>
            <div class="text_5">
              From generators to mowers, including power tools or even storage and accessories, make your life
              <br>easier with Capitools!
            </div>
            <div class="text_6">
              Psst…. And because we take care of our planet, all of our products are in favor of ecology and
              <br>sustainable development.
            </div>
            <div class="text_7">
              An advice? A question? Do not hesitate to call us!
            </div>
          </div>
        </div>
      </template>
    </SfCallToAction>
  </div>
</template>
<script>
import { SfCallToAction } from '@storefront-ui/vue';
export default {
  components: {
    SfCallToAction
  },
  data () {
    return {
      title: '',
      image: 'assets/images/Bitmap.png',
      background: '#e1e3e2'
    };
  }
};
</script>
<style  lang="scss" scoped>
.class_call_to_action
{
  width : 1920px;
  height : 573px;
}
.content_parent
{
  display: flex;
}
.content_right
{
  height: 361px;
  width: 612px;
  text-align: center;
}
.text_1
{
  height: 28px;
  width: 612px;
  color: #222222;
  font-family: Poppins;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 30px;
  text-align: center;
}
.text_2
{
  height: 17px;
  width: 612px;
  color: #2B2B2B;
  font-family: "Open Sans";
  font-size: 12px;
  letter-spacing: 0;
  line-height: 17px;
  text-align: center;
  margin-top: 14px;
}
.text_3
{
  height: 51px;
  width: 612px;
  color: #2B2B2B;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.text_4
{
  height: 102px;
  width: 612px;
  color: #222222;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.text_5
{
  height: 34px;
  width: 612px;
  color: #2B2B2B;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.text_6
{
  height: 34px;
  width: 612px;
  color: #222222;
  font-family: Poppins;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.text_7
{
  height: 17px;
  width: 612px;
  color: #2B2B2B;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.image_apropos_capitools
{
  height: 369px;
  width: 371px;
}
</style>

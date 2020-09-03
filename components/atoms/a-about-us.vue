<template>
  <div class="about-us">
      <SfCallToAction
        :title="title"
        :image="image"
        :background="background"
        class="class_call_to_action" >
      
            <template #title >
              <div class="container">
                <div class="content d-flex">
                    <img
                      :src="'/assets/images/apropos_Capitools.png'"
                      class="image_apropos_capitools" />
                    <div class="content_right text-center">
                      <h4 class="text_1">
                        A few words to get to know more about us ...
                      </h4>
                      <p>Since 2014, Capitools has made it possible to simplify all your DIY and gardening desires.</p>
                      <p>
                          Professionals, amateurs or just a DIY and DIY fan, we offer a wide choice of tools, machines and
                          accessories.
                          A specific project? Find everything you need from A to Z!
                        </p>
                        <p><b>Our strength ?</b></p>
                        <p>
                          A team of experts at your service
                          Professional quality products specially selected for you
                          More than 3,000 references in stock
                          A price accessible to all wallets!
                          Fast delivery in less than 72 hours!
                        </p>
                        <p>
                         From <a href="/generators">generators</a> to <a href="/gardening/lawn-mowers">mowers</a>, including <a href="/power-tools">power tools</a> or even <a href="/gardening/garden-sheds">storage</a> and <a href="/gardening/gardening-accessories">accessories</a>, make your life
                          easier with Capitools!
                        </p>
                        <p>
                          <b>Psst…. And because we take care of our planet, all of our products are in favor of ecology and
                          sustainable development.</b>
                        </p>
                        <p>
                          An advice? A question? Do not hesitate to <a href="/pages/contact-capitools">call us</a>!
                        </p>
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
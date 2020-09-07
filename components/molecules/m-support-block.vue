<template>
  <div class="support-block">     
    <div class="container">
      <div class="support-block--content d-flex">
        <div class="support-block--item d-flex align-start" >
           <img
            :src="'/assets/images/support-block-querries.jpg'"
            class="support-block-querries" />
            <div> 
               <h3>Are you looking for a particular category of products?</h3>
                <SfButton class="btn-primary-outline-gray" :link="link">
                    See our categories
                  </SfButton> 
            </div>
        </div>
         <div class="support-block--item d-flex align-start">
             <img
            :src="'/assets/images/support-block-contact.jpg'"
            class="support-block-contact" />
            <div class="">
               <h3>Do you have a question ?</h3>
               <p>Our customer service team is at your disposal.</p>
               <p><b>09 70 72 60 00</b> <small>(Non-surcharged call)</small> Monday to Friday (8 am-6pm)</p>
               <p>Or write an email to<b>contact@capitools.com</b></p>
            </div>
        </div>
         <div class="support-block--item d-flex align-start">
           <img
            :src="'/assets/images/support-block-contact.jpg'"
            class="support-block-contact" />
             <div class="">
              <h3>Do you have a question ?</h3>
               <p>Our customer service team is at your disposal.</p>
               <p><b>09 70 72 60 00</b> <small>(Non-surcharged call)</small> Monday to Friday (8 am-6pm)</p>
               <p>Or write an email to<b>contact@capitools.com</b></p>
            </div>
        </div>
      </div>
    </div>     
  </div>
</template> 
<script>
import { SfButton } from "@storefront-ui/vue";
export default {
  components: {
    SfButton,
  },
  data() {
    return {
        link: "",
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.support-block{
        padding: 30px 0;
        background-color: var(--c-white);
        .support-block--content{
            padding: 30px 0;
            @media screen and (max-width: 1320px){
                flex-wrap: wrap;
            }
             @include for-mobile{
                 flex-direction: column;
             }
            .support-block--item{
                padding: 0 30px;
                width: 33%;
                @media screen and (max-width: 1320px){
                    width: 42%;
                }
                @media screen and (max-width: 1024px){
                    margin-bottom: 20px;
                    max-width: 100%;
                    width: 100%;
                    padding: 0;
                }
                @media screen and (max-width: 600px){
                    flex-direction: column;
                    justify-content: center;
                }
                &:nth-child(2){
                    border-left: 2px solid var(--c-light);
                    border-right: 2px solid var(--c-light);
                    @include for-mobile{
                        padding: 20px 0;
                        border: 0;
                        border-top: 2px solid var(--c-light);
                        border-bottom: 2px solid var(--c-light);
                    }
                }
                img{
                    border-radius: 3px;
                    margin-right: 20px;
                    width: 145px;
                    @include for-mobile{
                        display: block;
                    }
                }
                h3, p{
                    margin: 0;
                    margin-bottom: 10px;
                }
                h3{
                    font-family: 'Poppins-Regular';
                    font-size: 20px;
                    font-weight: normal;
                    line-height: 1;
                }
                p{
                    font-size: 14px;
                    b{
                        font-family: 'Poppins-Bold';
                    }
                }
                .btn-primary-outline-gray{
                    padding: 10px 18px;
                    font-size: 14px;
                }
            }
        }
    }
</style>
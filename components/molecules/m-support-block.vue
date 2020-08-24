<template>
  <div class="support-block">     
    <div class="container">
      <div class="support-block--content d-flex">
        <div class="support-block--item d-flex align-start" >
           <img
            :src="'/assets/images/support-block-querries.jpg'"
            class="support-block-querries" />
            <div> 
               <h3>Recherchez-vous une catégorie particulière de produits?</h3>
                <SfButton class="btn-primary-outline-gray" :link="link">
                    Voir nos catégories
                  </SfButton> 
            </div>
        </div>
         <div class="support-block--item d-flex align-start">
             <img
            :src="'/assets/images/support-block-contact.jpg'"
            class="support-block-contact" />
            <div class="">
               <h3>Avez-vous une question ?</h3>
               <p>Notre équipe de service client est à votre écoute.</p>
               <p><b>09 70 72 60 00</b> <small>(Appel non surtaxé)</small> Lundi à Vendredi(8h-18h)</p>
               <p>Ou écrivez un mail à <b>contact@capitools.com</b></p>
            </div>
        </div>
         <div class="support-block--item d-flex align-start">
           <img
            :src="'/assets/images/support-block-contact.jpg'"
            class="support-block-contact" />
             <div class="">
               <h3>Avez-vous une question ?</h3>
               <p>Notre équipe de service client est à votre écoute.</p>
               <p><b>09 70 72 60 00</b> <small>(Appel non surtaxé)</small> Lundi à Vendredi(8h-18h)</p>
               <p>Ou écrivez un mail à <b>contact@capitools.com</b></p>
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
            @include for-mobile{
                flex-direction: column;
            }
            .support-block--item{
                padding: 0 30px;
                @include for-mobile{
                    flex-direction: column;
                    margin-bottom: 20px;
                    text-align: center;
                }
                &:nth-child(2){
                    border-left: 2px solid var(--c-light);
                    border-right: 2px solid var(--c-light);
                    @include for-mobile{
                        border: 0;
                    }
                }
                img{
                    border-radius: 3px;
                    margin-right: 20px;
                    width: 145px;
                    @include for-mobile{
                        display: block;
                        margin: 15px auto;
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
                    @include for-mobile{
                        margin: 0 auto;
                    }
                }
            }
        }
    }
</style>
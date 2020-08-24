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

</style>
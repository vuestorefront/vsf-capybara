<template>
  <div class="support-block">     
    <div class="parent_container">
      <div class="content d-flex">
        <div class="child_container_1" >
           <img
            :src="'/assets/placeholder.jpg'"
            class="image_contact_1" />
            <div> 
               <div class="text_contact_1">Recherchez-vous une catégorie particulière de produits?</div>
                <SfButton class="rectangle_button_1" :link="link">
                    Voir nos catégories
                  </SfButton> 
            </div>
        </div>
        <div class="rectangle_small"> </div>
         <div class="child_container_2">
             <img
            :src="'/assets/placeholder.jpg'"
            class="image_contact_1" />
            <div class="inner_text_container_1">
               <div class="text_contact_2">Avez-vous une question ?</div>
               <div class="text_contact_3">Notre équipe de service client est à votre écoute.</div>
               <div class="text_contact_4">09 70 72 60 00</div>
               <div class="text_contact_5">Lundi à Vendredi(8h-18h)</div>
               <div class="text_contact_6">Ou écrivez un mail à <b>contact@capitools.com</b></div>
            </div>
        </div>
        <div class="rectangle_small"> </div>
         <div class="child_container_3">
            <img
            :src="'/assets/placeholder.jpg'"
            class="image_contact_1" />
            <div class="inner_text_container_1">
               <div class="text_contact_2">Avez-vous une question ?</div>
               <div class="text_contact_3">Notre équipe de service client est à votre écoute.</div>
               <div class="text_contact_4">09 70 72 60 00</div>
               <div class="text_contact_5">Lundi à Vendredi(8h-18h)</div>
               <div class="text_contact_6">Ou écrivez un mail à <b>contact@capitools.com</b></div>
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
.parent_container
{
  height: 303px;
  width: 1920px;
}
.child_container_1
{
  height: 194px;
  width: 380px;
  display: flex;
   border-radius: 3px;
  margin-top: 50px;
  margin-left: 355px;
  margin-bottom: 60px;
}

.child_container_2
{
  height: 194px;
  width: 380px;
  display: flex;
   border-radius: 3px;
  margin-top: 50px;
  margin-bottom: 60px;
}
.child_container_3
{
 height: 194px;
  width: 380px;
  display: flex;
   border-radius: 3px;
  margin-top: 50px;
  margin-bottom: 60px;
}

.inner_text_container_1
{
  height: 28px;
  width: 253px;
  margin-left: 20px;
}

.image_contact_1
{
  height: 183px;
  width: 146px;
} 
.text_contact_1
{
  height: 112px;
  width: 196px;
  color: #222222;
  font-family: Poppins;
  font-size: 20px;
  letter-spacing: 0;
  line-height: 30px;
  margin-left: 20px;
}
.text_contact_2 
{ 
  color: #222222;
  font-family: Poppins;
  font-size: 20px;
  letter-spacing: 0;
  line-height: 30px; 
}
.text_contact_3 
{ 
  color: #484848;
  font-family: Poppins;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: 12px;
}
.text_contact_4
 {
  height: 20px;
  width: 96px;
  color: #222222;
  font-family: Poppins;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: 10px;
}
.text_contact_5 
{
  height: 20px;
  width: 172px;
  color: #222222;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: 5px;
}
.text_contact_6 
{
  height: 40px;
  width: 180px;
  color: #222222;
  font-family: Poppins;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: 10px;
}
.rectangle_small {
  height: 194px;
  width: 2px;
  background-color: #E3E6EA;
  margin-left: 30px;
  margin-top: 50px;
  margin-right: 30px;
} 

.rectangle_button_1
{
  box-sizing: border-box;
  height: 41px;
  width: 171px;
  border: 1px solid #E3E6EA;
  border-radius: 3px;
  background-color: #FFFFFF;
  box-shadow: 0 5px 10px 0 rgba(0,0,0,0.08);
  --button-color:#3B78DD;
  --button-font-size:14px;
  --button-font-family:Poppins;
  --button-font-line-height:21px;
    margin-left: 20px;
}
</style>
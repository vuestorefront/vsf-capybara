<template>
 
  <div class="path-6">
    <span class="text_upper">
      We are specialized in DIY and gardening tools
    </span>
    <SfImage
      src="/assets/images/icon_drill.png"
      width="120px"
      height="96px"
      class="image_drill" /> 

    <div class="group-3">
      <div class="rectangle_text">
        <div class="rectangle_text_number">8.1/10</div>
      </div>
      <SfImage
              src="/assets/images/avis.png"
              width="121px"
              height="27px" 
              class="image_avis"
            />  
    </div>
 </div>      
</template>
<script>
import { SfImage } from '@storefront-ui/vue';
 
export default
 {
  components: 
  {
    SfImage, 
  },

  data() {
    return {};
  },
};
</script>
<style  lang="scss" scoped>
.path-6 
{
  height: 117px;
  width: 349px;
  background: linear-gradient(180deg, #254E91 0%, #3B78DD 100%);
  
}

.group-3 {
  height: 31px;
  width: 206px; 
  display:flex 
} 

.image_avis
{
.sf-image .sf-image--has-size
{
  width: 120px;
  height: 27px;
 
}
 margin-left: 10px; 
}

.image_drill
{
  .sf-image
  {
overflow: inherit;
  }
.sf-image .sf-image--has-size
{
      
    width: 120px;
    height: 96px;
     
 
} 
}



.text_upper 
{
  height: 42px;
  width: 196px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 23px;
  text-shadow: 0 2px 9px 0 rgba(0,0,0,0.5);  
}  

.rectangle_text 
{
  height: 31px;
  width: 69px;
  border-radius: 2px;
  background-color: #FE6610; 
}

.rectangle_text_number 
{
  height: 25px;
  width: 55px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 27px;
  margin-top: 3px; 
  margin-left: 7px;
  margin-right: 7px;
  margin-bottom: 3px;
}
</style>
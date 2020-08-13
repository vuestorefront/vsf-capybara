<template>
 <div class="group-3">
    <div class="rectangle_text">
      <div class="rectangle_text_number">8.1 / 10</div>
    </div>
    <SfImage
      src="/assets/images/avis.png"
      width="121px"
      height="27px" 
      class="image_avis"        
    />  
  </div> 
</template>

<script>
  import { SfImage } from '@storefront-ui/vue';
  export default { components: { SfImage },  };
</script>

<style lang="scss" scoped>
  .group-3 
  {
    height: 31px;
    width: 206px;
    display: flex; 
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

  .image_avis
  {
    margin-left: 10px;
    margin-top: 3px;
    margin-bottom: 1px;
  }

</style>
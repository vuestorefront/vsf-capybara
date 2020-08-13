<template>
  
    <SfBanner
      :class="customClass"
      :title="title"
      :subtitle="subtitle"
      :description="description"
      :button-text="buttonText"
      :image="image"
      :background="background"
    >
    <template #subtitle >
      <div class="text_upper" >
        We are specialized in DIY and gardening tools
      </div>
    </template>
    <template #description >
       <AHeaderAvisIcon />
     
    </template>
    </SfBanner> 
</template>
<script>
import { SfBanner } from "@storefront-ui/vue";
import AHeaderAvisIcon from 'theme/components/atoms/a-header-avis-icon'; 

export default {
  components: {
    SfBanner,
    AHeaderAvisIcon,
  },
  data() {
    return {
      title: "",
      subtitle: "We are specialized in DIY and gardening tools",
      description:
        "",
      buttonText: "",
      image: {
        mobile: "/assets/images/icon_drill.png",
        desktop: "/assets/images/icon_drill.png",
      },
      background: "#3B78DD",
    };
  },
};
 
</script>
<style  lang="scss" scoped>
.sf-banner 
{
   --banner-width : 349px;
   --banner-height : 117px;   
     
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
 
}

</style>
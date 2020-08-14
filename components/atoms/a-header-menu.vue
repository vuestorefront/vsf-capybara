<template>
  <div class="rectangle_menu">
     <SfLink target="_blank" link="/" class="menu_gardening menu_general_style">Gardening</SfLink>
     <SfLink target="_blank" link="/" class="menu_power_tools menu_general_style">Power Tools</SfLink>
     <SfLink target="_blank" link="/" class="menu_hand_tools menu_general_style">Hand Tools</SfLink>
     <SfLink target="_blank" link="/" class="menu_generators menu_general_style">Generators</SfLink>
     <SfLink target="_blank" link="/" class="menu_pressure_washers menu_general_style">Pressure Washers</SfLink>
     <SfLink target="_blank" link="/" class="menu_water_pumps menu_general_style">Water Pumps</SfLink>
     <SfLink target="_blank" link="/" class="menu_workshop menu_general_style">Workshop</SfLink>
  </div>
</template>

<script>
import { SfLink } from "@storefront-ui/vue";
 
export default 
{
  components: 
  {
    SfLink
  }, 
};
</script>

<style lang="scss" scoped>
.rectangle_menu
{
  height: 50px;
  width: 1920px;
  display: flex;
  background-color: #254E91;
}

.menu_gardening 
{
  height: 20px;
  width: 77px;
  margin-left: 506px;
}

.menu_power_tools 
{
  height: 20px;
  width: 86px; 
  margin-left: 48px;
}

.menu_hand_tools 
{
  height: 20px;
  width: 80px; 
  margin-left: 47px;
}

.menu_generators
{
  height: 20px;
  width: 82px; 
  margin-left: 47px;
}

.menu_pressure_washers 
{
  height: 20px;
  width: 130px; 
  margin-left: 48px;
}

.menu_water_pumps 
{
  height: 20px;
  width: 98px; 
  margin-left: 44px;
}

.menu_workshop 
{
  height: 20px;
  width: 74px; 
  margin-left: 46px;
}

.menu_general_style
{
  --link-color: #FFFFFF;
  --link-font-line-height: 21px;
  --link-font-family : Poppins;
  --link-font-weight : bold;
  --link-font-size : 14px;
  --link-text-decoration:none;
  margin-top: 15px;
  letter-spacing: 0;
}

</style>

<template>
  <div class="rectangle_menu d-flex align-center justify-center desktop-only">
    <SfLink target="_blank" link="/" class="menu_gardening menu_general_style">
      Gardening
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_power_tools menu_general_style">
      Power Tools
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_hand_tools menu_general_style">
      Hand Tools
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_generators menu_general_style">
      Generators
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_pressure_washers menu_general_style">
      Pressure Washers
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_water_pumps menu_general_style">
      Water Pumps
    </SfLink>
    <SfLink target="_blank" link="/" class="menu_workshop menu_general_style">
      Workshop
    </SfLink>
  </div>
</template>

<script>
import { SfLink } from '@storefront-ui/vue';

export default
{
  components:
  {
    SfLink
  }
};
</script>

<style lang="scss" scoped>
.rectangle_menu
{
  padding: 15px;
} 

.menu_general_style
{
  --link-color: var(--_c-dark-secondary);
  --link-font-line-height: 21px;
  font-family: 'Poppins-Regular';
  --link-font-size : 14px;
  --link-text-decoration:none;
  margin: 0 12px;
}

</style>

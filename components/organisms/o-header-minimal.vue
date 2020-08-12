<template>
  <div class="o-header-minimal">
    <ALogo />
    <div class="search"></div>
     <MHeaderCompte /> 
     <MHeaderBasket />
    <AHeaderContact />
    <MHeaderDrill />
    
    
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo'; 
import MHeaderCompte from 'theme/components/molecules/m-header-compte'; 
import MHeaderBasket from 'theme/components/molecules/m-header-basket'; 
import AHeaderContact from 'theme/components/atoms/a-header-contact'; 
import MHeaderDrill from 'theme/components/molecules/m-header-drill'; 

import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'OHeaderMinimal',
  components: { ALogo , MHeaderCompte , MHeaderBasket , AHeaderContact , MHeaderDrill }
};
</script>

<style lang="scss" scoped>
.o-header-minimal 
{
  display: flex;
  .a-logo 
  {
    margin: 20px;
  }   
  .search 
  {
  box-sizing: border-box;
  height: 51px;
  width: 797px;
  border: 1px solid #E3E6EA;
  border-radius: 3px;
  background-color: #FFFFFF;
  margin: 20px;
}
}  
  
</style>

<template>
  <div class="o-header-minimal">
    <ALogo />
     <div class="search"></div>
    <div class="rectangle"> <MHeaderCompte /></div>
    <div class="rectangle"> <MHeaderBasket /></div>
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo'; 
import MHeaderCompte from 'theme/components/molecules/m-header-compte'; 
import MHeaderBasket from 'theme/components/molecules/m-header-basket'; 


export default {
  name: 'OHeaderMinimal',
  components: { ALogo , MHeaderCompte , MHeaderBasket }
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

  .rectangle
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

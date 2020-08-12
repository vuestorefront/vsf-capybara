<template>
  <div class="rectangle_panier"> 
    <AMicrocartIcon/>
      <div class="text_panier">Panier
      </div>
  </div>
</template>
<script>
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
 
export default
 {
  components: 
  {
    AMicrocartIcon, 
  },

  data() {
    return {};
  },
};
</script>
<style  lang="scss" scoped>

.rectangle_panier 
{
  box-sizing: border-box;
  height: 64px;
  width: 62px;
  border: 2px solid #EFEFEF;
  border-radius: 3px;
  background-color: #FFFFFF;
} 
 

.text_panier 
 {
  height: 15px;
  width: 32px;
  color: #3B78DD;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
  text-align: center;
}
</style>
<template>
  <div class="icon-button desktop-only">
    <AAccountIcon />
  </div>
</template>
<script>
import AAccountIcon from 'theme/components/atoms/a-account-icon';

export default
{
  components:
  {
    AAccountIcon
  },

  data () {
    return {};
  }
};
</script>
<style  lang="scss" scoped>

.rectangle_compte {
  box-sizing: border-box;
  height: 64px;
  width: 62px;
  border: 2px solid #EFEFEF;
  border-radius: 3px;
  background-color: #FFFFFF;
}

 .text_compte
 {
  height: 15px;
  width: 42px;
  color: #3B78DD;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 16px;
  text-align: center;
}
</style>

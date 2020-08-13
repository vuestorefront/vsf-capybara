<template>
  <div class="payment_rectangle">
    <div class="payment_text"> Secured payment methods
      <div class="payment_icon_row">
        <img :src="'/assets/images/visaDark.png'" class="payment_image_size" />
        <img :src="'/assets/images/visa.png'" class="payment_image_size" />
        <img :src="'/assets/images/masterCardDark.png'" class="payment_image_size" />
        <img :src="'/assets/images/maestroDark.png'" class="payment_image_size" />
        <img :src="'/assets/images/paypal.png'" class="payment_image_size" />
        <img :src="'/assets/images/americanExpressDark.png'" class="payment_image_size" />
      </div> 
    </div> 
  </div>  
</template>

<style lang="scss" scoped>

.payment_rectangle 
{
  height: 132px;
  width: 420px;
  border-radius: 2px;
  background-color: #FFFFFF;
  border: 9px solid #EFEFEF;
  box-shadow: 0 5px 35px 0 rgba(240, 10, 10, 0.1);
}

.payment_text 
{
  height: 17px;
  width: 169px;
  color: #222222;
  font-family: Poppins;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px; 
  margin-top: 22px;
  margin-right: 221px;
  margin-left: 31px;
  margin-bottom: 93px;
}

.payment_icon_row
{
  display: flex;
}

.payment_image_size 
{
  height: 37px;
  width: 52px;
  margin-top: 20px;
  margin-right: 10px;
}
</style>
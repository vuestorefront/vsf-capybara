<template>
  <div class="newsletter_rectangle">
     <div class="content_left"> 
       <img :src="'/assets/images/capitools_newsletter_block.png'" class="payment_image_size" />
    </div> 
    <div class="content_right"> 
       <div class="text_1">Newsletter subscription</div>
       <div class="text_2">Sign Up for Tips, Reviews & Special Offers</div>
       <div style= "display:flex"> 
        <div class="input_rectangle">
          <div class="input_email">Enter your email </div>
        </div>
        <div class="button_rectangle"><span class="button_text">S'inscrire</span></div>
       </div>
        
    </div> 
   
  </div>  
</template>

<style lang="scss" scoped>

.newsletter_rectangle 
{
  height: 132px;
  width: 710px;
  border-radius: 2px;
  background-color: #FFFFFF;
  box-shadow: 0 5px 35px 0 rgba(0,0,0,0.1);
  display: flex;
   
}

.content_left 
{
  height: 97px;
  width: 116px; 
  margin-top: 20px;
  margin-left: 30px; 
  margin-right: 20px;
}

.content_right
{
 height: 88px;
  width: 514px; 
  margin-top: 22px;
} 

.text_1
{
  height: 17px;
  width: 148px;
  color: #222222;
  font-family: Poppins;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
}

.text_2 
{
  height: 16px;
  width: 219px;
  color: #262626;
  font-family: Poppins;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 17px;
  margin-top: 2px;
}

.input_rectangle 
{
  height: 40px;
  width: 377px;
  border-radius: 3px;
  margin-top: 10px;
  background-color: #E3E6EA;
  display: flex;
}

.input_email
{
  height: 17px;
  width: 100px;
  color: #9F9F9F;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  margin-left: 15px;
}

.button_rectangle
{
  height: 40px;
  width: 127px;
  border-radius: 3px;
  background-color: #3B78DD;
}

.button_text {
  height: 17px;
  width: 57px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
  
</style>
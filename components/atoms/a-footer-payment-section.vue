<template>
  <div class="payment overflow-y">
    <div class="payment_text">
      <p>
         <b>Secured payment methods</b>
      </p>
      <div class="payment-types d-flex wrap">
        <a href="">
          <img :src="'/assets/images/visaDark.png'" class="payment_image_size"/>
        </a>
        <a>
          <img :src="'/assets/images/visa.png'" class="payment_image_size"/>
        </a>
        <a>
          <img :src="'/assets/images/masterCardDark.png'" class="payment_image_size"/>
        </a>
        <a>
          <img :src="'/assets/images/maestroDark.png'" class="payment_image_size"/>
        </a>
        <a>
          <img :src="'/assets/images/paypal.png'" class="payment_image_size"/>
        </a>
        <a>
          <img :src="'/assets/images/americanExpressDark.png'" class="payment_image_size"/>
        </a>
      </div>
    </div>
  </div>
</template>


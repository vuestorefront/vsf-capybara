<template>
  <div class="mes-advantage d-flex">
            <SfImage
            src="/assets/images/SWAP-Video.png"
            :alt="$t(defaultTitle)"
            class="sf-heade"
             />
        <div class="description">
            <p class="text-primary">
              <b>Mes avantages Capitools inclus</b>
            </p>
            <p>INSTALLATION / RÉPARATION / PIÈCES
                DÉTACHÉES : UN VRAI SAVOIR-FAIRE
            </p>
            <SfButton class="btn-primary-outline-gray" :disabled="disabled" :link="link">
                Voir les détails
            </SfButton>
        </div>
  </div>
</template>

<script>
import { SfButton, SfImage } from "@storefront-ui/vue";
export default {
  components: {
    SfButton,
    SfImage,
  },
  data() {
    return {
      default: "Shop now",
      disabled: false,
      link: "https://services.swap-europe.com/marketplaces-services",
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
    .mes-advantage{
        padding: 15px;
        border: 1px solid var(--_c-gray-accent);
        border-radius: 5px;
        width: fit-content;
        margin: 15px 0;
       
        @include for-mobile{
          display: inline-flex;
          width: 42vw;
          margin: 15px;
          margin-left: 0;
          align-items: center;
          vertical-align: top;
        }
        @media screen and (max-width: 767px){
             width: auto;
            display: flex;
            margin: 15px 0;
        }
        .sf-image{
            min-width: auto;
            width: 175px;           
            @include for-desktop{
               min-width: 120px;
            }
        }
        p{
            margin: 0;
            font-size: 12px;
            &.text-primary{
                color: var(--_c-green-primary-lighten)!important;
                margin-bottom: 7px;
            }
        }
        .description{
            margin: 0 15px;
            button{
                padding: 7px 10px;
                color: var(--_c-dark-secondary);
                font-size: 12px;
                font-family: 'Poppins-Bold';
            }
        }
    }
</style>
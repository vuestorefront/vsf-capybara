<template>
  <div class="garantie-product d-flex">
            <SfImage
            src="/assets/images/garantie-icon.png"
            :alt="garantie-icon"
            class="sf-heade"
             />
        <div class="description">
            <p class="text-primary">
              <b>Garantie du produit</b>
            </p>
            <p>Ce produit est sous garantie pendant les deux ans à compter de la date d'achat.</p>
            <SfLink target="_blank" :link="link">
                En savoir plus
            </SfLink>
        </div>
  </div>
</template>

<script>
import { SfLink, SfImage } from "@storefront-ui/vue";
export default {
  components: {
    SfLink,
    SfImage,
  },
  data() {
    return {
      link: "#",
    };
  },
};
</script>

<style lang="scss" scoped>
    .garantie-product{
        padding: 15px;
        border: 1px solid var(--_c-gray-accent);
        border-radius: 5px;
        margin: 15px 0;
        .sf-image{
            min-width: 120px;           
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
            a{
               font-family: 'Poppins-Light';
               font-style: italic;
               font-size: 12px; 
               color: var(--_c-green-primary-lighten)!important;
               text-decoration: none;
                font-weight: 600;
            }
        }
    }
</style>
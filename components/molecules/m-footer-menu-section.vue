<template>
  <SfFooter
    :column="column"
    :multiple="multiple"
    :open="open"
    class="sb-footer"
  >
    <SfFooterColumn
      v-for="column in columns"
      :key="column.title"
      :title="column.title"
    >
      <SfList v-if="column.items">
        <SfListItem v-for="item in column.items" :key="item">
          <SfMenuItem :label="item" />
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <div>  
      <div style= "display:flex"> 
        <SfButton
          class="button_new"
          :disabled="disabled"
          :nativeButton="nativeButton"
          :link="link">New
        </SfButton>
        <p class="text_1">Lets stay in touch!</p>
        <img :src="'/assets/images/facebook_icon.png'" class="icon_facebook" />
        <img :src="'/assets/images/youtube_icon.png'" class="icon_youtube" />
        <img :src="'/assets/images/insta_icon.png'" class="icon_instagram" />
      </div> 
      <div class="rectangle_blog">
        <img :src="'/assets/images/footer_blog.png'" class="image_blog_size" />
        <p class="footer_blog_text">Ut nonumes noluisse nec, in impetus integre sea. 
          <br/>Nec no elitr ignota aeterno. Qui etiam assentior 
          <br/>complectitur no. in impetus integre sea. Nec no elitr
          <br/> ignota aeterno.
        </p>
        <SfButton
          class="button_see_more"
          :disabled="disabled"
          :nativeButton="nativeButton"
          :link="link"> See more
        </SfButton>
      </div>
    </div>
  </SfFooter>
 
</template>
<script>
import { SfFooter } from "@storefront-ui/vue";
import { SfHeader } from "@storefront-ui/vue";
import { SfList } from "@storefront-ui/vue";
import { SfImage } from "@storefront-ui/vue";
import { SfButton } from "@storefront-ui/vue";
import { SfMenuItem } from "@storefront-ui/vue";
import {} from "@storefront-ui/vue";
export default {
  components: {
    SfFooter,
    SfHeader,
    SfList,
    SfImage,
    SfButton,
    SfMenuItem,
  },
  data() {
    return {
      columns: [
        {
          title: "About us",
          items: [  " Qui sommes-nous ?", 
                    "Nos produits", 
                    "Notre expertise", 
                    "Nos marques partenaires",
                    "Notre garantie",
                    "Promotions",
                    "Nouveaux produits",
                    "Contactez-nous",
                    "sitemap",
                    "Nous recrutons"
                  ],
        },
        {
          title: "The Products",
          items: [  "Paiement Sécurisé",
                    "Conditions Générales de Vente",
                    "Mentions Légales",
                    "Modes de paiement",
                    "Satisfait ou remboursé",
                    "Partenaires",
                    "Cyber Sécurité",
                    "Cookie notice information"
                  ],
        },
        {
          title: "Help & Services",
          items: [  "Mes commandes",
                    "Mes avoirs",
                    "Mes adresses",
                    "Mes informations personnelles",
                    "Mes bons de réduction",
                    "Déconnexion"
                  ],
        },
        {
          title: "Legal Information",
          items: [  "FAQ",
                    "SAV & Relation client",
                    "Paiement en 3 fois",
                    "Livraison produits",
                    "Politique de retour des articles",
                    "Le réseau de Garantie SWAP Europe"
                  ],
        }, 
      ],
      column: 4,
      multiple: false,
      open: ["About us", "Help", "Social"],
    };
  },
};
</script>
<style lang="scss" scoped>

.sf-footer {
    --footer-width: auto;
    margin-left: 380px;

  }

.text_1
{
  height: 25px;
  width: 168px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 27px;
}

.icon_facebook 
{
  height: 35px;
  width: 35px;
}

.icon_youtube
{
  height: 35px;
  width: 35px;
}

.icon_instagram
{
  height: 35px;
  width: 35px;
}

.rectangle_blog
{
  height: 110px;
  width: 651px;
  border-radius: 3px;
  background-color: #2D415A;
  display: flex;
}

.image_blog_size 
{
  height: 40px;
  width: 145px;
  margin-top: 35px;
  margin-left: 13px;
}

.footer_blog_text
{
  height: 68px;
  width: 310px;
  color: #FFFFFF;
  font-family: Poppins;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  margin-left: 28px;
  margin-top: 21px;
}

.button_new
{
  height: 26px;
  width: 69px;
  border-radius: 12.5px;
  background-color: #FF9843;
  color: #FFFFFF;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
}

.button_see_more 
{
  height: 34px;
  width: 98px;
  border-radius: 2px;
  background-color: #3B78DD;
  margin-left: 27px;
  margin-top: 38px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
}


 
</style>

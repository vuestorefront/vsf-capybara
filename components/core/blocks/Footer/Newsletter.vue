<template>
  <div v-show="!isSubscribed" class="newsletter py25 px15 bg-cl-secondary">
    <div class="container">
      <div class="newsletter-content m0 row middle-sm start-md">
        <div class="col-md-8 col-xs-12">
          <h3 class="h3 cl-accent weight-400 m0">
            {{
              $t("Subscribe to the newsletter and receive a coupon for 10% off")
            }}
          </h3>
        </div>
        <div class="newsletter-button col-md-4 col-xs-12 end-md">
          <button-outline
            color="dark"
            data-testid="openNewsletterButton"
            @click.native="showNewsletterPopup"
          >
            {{ $t("Subscribe") }}
          </button-outline>
        </div>
      </div>
    </div>
    <newsletter-popup v-if="loadNewsletterPopup" />
  </div>
</template>

<script>
import SubscriptionStatus from "@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus";
import ButtonOutline from "theme/components/theme/ButtonOutline";
import { mapState } from "vuex";
const NewsletterPopup = () =>
  import(
    /* webpackChunkName: "vsf-newsletter-modal" */ "theme/components/core/NewsletterPopup"
  );

export default {
  name: "Newsletter",
  components: {
    ButtonOutline,
    NewsletterPopup
  },
  mixins: [SubscriptionStatus],
  data() {
    return {
      loadNewsletterPopup: false
    };
  },
  computed: {
    ...mapState({
      isOpen: state => state.ui.newsletterPopup
    })
  },
  methods: {
    showNewsletterPopup() {
      this.loadNewsletterPopup = true;
      this.$bus.$emit("modal-show", "modal-newsletter");
    }
  }
};
</script>

<style scoped>
@media (min-width: 767px) and (max-width: 1200px) {
  .button-outline {
    min-width: 100%;
  }
}
@media (max-width: 767px) {
  .h3 {
    font-size: 18px;
    text-align: center;
  }
  .newsletter-button {
    padding-top: 25px;
    text-align: center;
  }
}
</style>

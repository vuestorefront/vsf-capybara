<template>
  <section v-if="!singleBanner" class="offers container my30 px15 cl-black">
    <div class="row">
      <div
        v-for="(banner, index) in banners.mainBanners"
        :key="index"
        class="offer-container col-xs-12 col-sm-6 pb15"
      >
        <router-link :to="localizedRoute(banner.link)">
          <div v-lazy:background-image="banner.image" class="offer">
            <h2 class="title m0 h1">
              {{ banner.title }}
            </h2>
            <p class="subtitle m0 serif h3 uppercase">
              {{ banner.subtitle }}
            </p>
          </div>
        </router-link>
      </div>

      <div class="col-xs-12 col-sm-6">
        <div
          v-for="(banner, index) in banners.smallBanners"
          :key="index"
          class="offer-container pb15"
        >
          <router-link :to="localizedRoute(banner.link)">
            <div
              v-lazy:background-image="banner.image"
              class="offer offer-small border-box p5 flex bg-cl-th-accent"
            >
              <h2 class="title m0 h1">
                {{ banner.title }}
              </h2>
              <p class="subtitle m0 serif h3 uppercase">
                {{ banner.subtitle }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="container my30 px15">
    <div class="row">
      <div
        v-for="(banner, index) in banners.productBanners"
        :key="index"
        class="col-xs-12"
      >
        <router-link :to="localizedRoute(banner.link)">
          <div
            v-lazy:background-image="banner.image"
            class="offer offer-product border-box p5 flex bg-cl-th-accent"
          >
            <h2 class="title m0 h1">
              {{ banner.title }}
            </h2>
            <p class="subtitle m0 serif h3 uppercase">
              {{ banner.subtitle }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PromotedOffers",
  props: {
    singleBanner: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      banners: "promoted/getPromotedOffers"
    })
  },
  async created() {
    await this.updatePromotedOffers();
  },
  methods: {
    ...mapActions({
      updatePromotedOffers: "promoted/updatePromotedOffers"
    })
  }
};
</script>

<style lang="scss" scoped>
.offer-container {
  &:last-child {
    padding-bottom: 0;
  }
}
.offer {
  height: 735px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 1;
  transition: 0.3s all;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 767px) {
    height: 200px;
  }

  .title {
    text-align: center;
    margin-top: 2rem;
    @media (max-width: 767px) {
      background-color: rgba(255, 255, 255, 0.4);
      padding: 0.5rem;
      line-height: 2.4rem;
    }
  }

  .subtitle {
    font-family: "Roboto", sans-serif;
    @media (max-width: 767px) {
      background-color: rgba(255, 255, 255, 0.4);
      padding: 0.5rem;
    }
  }
}
.offer-small {
  height: 360px;

  @media (max-width: 767px) {
    height: 200px;
  }
}
.offer-product {
  height: 330px;
  background-position: 50% 20%;

  @media (max-width: 767px) {
    height: 330px;
  }
}
.title {
  @media (max-width: 767px) {
    font-size: 36px;
  }
}
.subtitle {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}
</style>

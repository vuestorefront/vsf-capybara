<template>
  <SfTabs
    class="m-product-additional-info product__tabs"
    id="m-product-additional-info"
    ref="productTabs"  
    @toggle="onToggle"
  >
    <SfTab :title="$t('Description')"> 
      <div class="description" >
        <p itemprop="description" v-html="product.description"> </p>
      </div>
     <!--  <div itemprop="description" v-html="product.description" /> -->
      <AProductAttribute
        v-for="(attribute, i) in attributes"
        :key="i"
        :product="product"
        :attribute="attribute"
        class="product__property"
      />
    </SfTab>
    <SfTab :title="$t('Read reviews')" ref="reviewTab">
      <div class="review-header">
        <SfHeading
          :title="$t('{count} Reviews', { count: reviewsCount })"
          :level="3"
          class="sf-heading--left"
        />
        <AProductRating
          @click="handleOpenReviewModal"
          :reviews="reviews"
        >
          {{ $t('Leave me review') }}
        </AProductRating>
      </div>
      <SfDivider v-show="reviewsCount" />
      <MReviewList v-show="reviewsCount" :reviews="reviews" :visible=10 />
    </SfTab>
    <SfTab :title="$t('Video')" v-if="isShowVideoTab" ref="videoTab"> 
      <youtube v-if="product.youtube_video_code_one"   :video-id="productVideoIdOne" :player-vars="playerVars" @playing="playing"></youtube>
      <youtube v-if="product.youtube_video_code_two"   :video-id="productVideoIdTwo"></youtube>
      <youtube v-if="product.youtube_video_code_three" :video-id="productVideoIdThree"></youtube>
    </SfTab>
  </SfTabs>
</template>

<script>
import { ModalList } from 'theme/store/ui/modals';
import { mapState, mapActions } from 'vuex';
import { SfHeading, SfTabs, SfDivider } from '@storefront-ui/vue';
import AProductRating from 'theme/components/atoms/a-product-rating';
import AProductAttribute from 'theme/components/atoms/a-product-attribute';
import MReviewList from 'theme/components/molecules/m-review-list'; 
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

export default {
  name: 'MProductAdditionalInfo',
  components: {
    SfHeading,
    SfTabs,
    AProductRating,
    SfDivider,
    AProductAttribute,
    MReviewList
  },
  data() {
   return {
      productVideoIdOne: '',
      productVideoIdTwo: '',
      productVideoIdThree: '',
      playerVars: {
        autoplay: 1
      }
    }
   },
   
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    attributes: {
      type: Array,
      default: () => []
    },
    product: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      isReviewProductTab: state => state.ui.isReviewProductTab,
      isVideoProductTab: state => state.ui.isVideoProductTab
    }),
    reviewsCount () {
      return this.reviews.length;
    },
    setYoutubeVideoId(){
       this.productVideoIdOne   = this.$youtube.getIdFromUrl(this.product.youtube_video_code_one);
       this.productVideoIdTwo   = this.$youtube.getIdFromUrl(this.product.youtube_video_code_two);
       this.productVideoIdThree = this.$youtube.getIdFromUrl(this.product.youtube_video_code_three);
    },
    isShowVideoTab(){
      return this.product.youtube_video_code_one != null || this.product.youtube_video_code_two != null || this.product.youtube_video_code_three != null  ? true : false ;
    }
  },
  mounted () {
    this.setYoutubeVideoId();  
  },
  watch: {
    isReviewProductTab (value) {
      if (value && !this.$refs.reviewTab.isActive) {
        this.$refs.productTabs.toggle(this.$refs.reviewTab._uid);
      }
    },
     isVideoProductTab (value) {
      if (value && !this.$refs.videoTab.isActive) {
        this.$refs.productTabs.toggle(this.$refs.videoTab._uid);
      }
    }
  },
  beforeDestroy () {
    this.$store.commit('ui/setReviewProductTab', false);
    this.$store.commit('ui/setVideoProductTab', false);
  }, 
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    handleOpenReviewModal () {
      this.openModal({ name: ModalList.Review, payload: this.product.id })
    },
    onToggle (id) { 
      this.$store.commit('ui/setReviewProductTab', id === this.$refs.reviewTab._uid);
      this.$store.commit('ui/setVideoProductTab', id === this.$refs.videoTab._uid);
    }, 
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.product {
  &__tabs {
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
      --tabs-content-tab-padding: 3.5rem 0 0 0;
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
  }
}

[itemprop="description"] > *:first-child {
  margin-top: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
}
</style>

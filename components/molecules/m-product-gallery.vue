<template>
  <div class="m-product-gallery">
    <SfImage
      v-if="!isOnline"
      :src="offlineImage"
    />
    <SfGallery
      ref="gallery"
      :images="gallery"
      :enable-zoom="enableZoom"
    >
    <template #thumbs="{ images, active: activeIndex, go }"  v-if="isShowVideoTabThumbInGallery" >
       <SfButton
          v-for="(image, index) in images"
          :key="'img-' + index"
          class="sf-button--pure sf-gallery__item"
          :class="{ 'sf-gallery__item--selected': index === activeIndex }"
          @click="go(index)"
        >
          <SfImage
            class="sf-gallery__thumb"
            :src="image.mobile.url"
            :alt="image.alt"
            :width="thumbWidth"
            :height="thumbHeight"
          />
        </SfButton>
        <SfButton
          v-for="(image, index) in videoThumbImages"
          :key="'img-' + index"
          class="sf-button--pure sf-gallery__item"
          :class="{ 'sf-gallery__item--selected': index === activeIndex }"
          v-on:click="openVideosTab()"
        >
          <SfImage
            class="sf-gallery__thumb"
            :src="image.mobile.url"
            :alt="image.alt"
            :width="thumbWidth"
            :height="thumbHeight"
          />
        </SfButton>
    </template>
    </SfGallery> 
  </div>
</template>

<script>
import isEqual from 'lodash-es/isEqual';
import { SfGallery, SfImage, SfButton } from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { createSmoothscroll } from 'theme/helpers'
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

export default {
  name: 'MProductGallery',
  components: {
    SfGallery,
    SfImage,
    SfButton
  },
  data() {
    return { 
      enableZoom: true,
      videoThumbImages: [
        {
          alt: "Video Thumb",
          mobile: { url: "assets/placeholder.jpg" },
          desktop: { url: "assets/placeholder.jpg" },
          zoom: { url: "assets/placeholder.jpg" },
        },
      ],
    };
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    },
    offlineImage: {
      type: Object,
      required: false,
      default: () => ({})
    },
    product: {
      type: Object,
      default: () => ({})
    },
    imageWidth: {
      type: [Number, String],
      default: 422,
    }, 
    imageHeight: {
      type: [Number, String],
      default: 664,
    },
    thumbWidth: {
      type: [Number, String],
      default: 160,
    }, 
    thumbHeight: {
      type: [Number, String],
      default: 160,
    },
  },
  computed: {
    isOnline () {
      return onlineHelper.isOnline;
    },
    variantImage () {
      let variantImage = this.gallery.find(image => {
        let selectThis = true
        for (const [key, value] of Object.entries(this.configuration)) {
          if (
            typeof image.id !== 'undefined' &&
            typeof image.id[key] !== 'undefined' &&
            image.id[key] !== value.id
          ) {
            selectThis = false
          }
        }
        return selectThis || (image.id && image.id.color && String(image.id.color) === String(this.configuration.color.id))
      })

      if (!variantImage) {
        variantImage = this.gallery.find(image => {
          return typeof image.id.color !== 'undefined' &&
            typeof this.configuration.color !== 'undefined' &&
            String(image.id.color) === String(this.configuration.color.id)
        })
      }

      if (!variantImage) {
        variantImage = this.gallery[0];
      }

      return variantImage;
    },
    currentIndex () {
      const index = this.gallery.findIndex(imageObject =>
        isEqual(imageObject.id, this.variantImage.id)
      );

      return index === -1 ? 0 : index;
    },
     isShowVideoTabThumbInGallery(){
      return this.product.youtube_video_code_one != null || this.product.youtube_video_code_two != null || this.product.youtube_video_code_three != null  ? true : false ;
    }
  },
  watch: {
    currentIndex () {
      this.$refs.gallery.go(this.currentIndex)
    }
  },
   methods:{
    openVideosTab() {
      this.$store.commit('ui/setReviewProductTab', false);
      this.$store.commit('ui/setVideoProductTab', true);
      
      const reviewsEl = document.querySelector('#m-product-additional-info');
      if (!reviewsEl) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      createSmoothscroll(scrollTop, scrollTop + reviewsEl.getBoundingClientRect().top);
    }
  }
};
</script>

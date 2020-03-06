<template>
  <SfTabs class="m-product-additional-info" :open-tab="openTab" id="m-product-additional-info">
    <SfTab :title="$t('Description')">
      <div itemprop="description" v-html="product.description" />
      <div class="properties">
        <AProductAttribute
          v-for="(attribute, i) in attributes"
          :key="i"
          :product="product"
          :attribute="attribute"
        />
      </div>
    </SfTab>
    <SfTab :title="$t('Read reviews')">
      <div class="review-header">
        <SfHeading
          :title="$t('{count} Reviews', { count: reviewsCount })"
          :level="3"
          class="sf-heading--left"
        />
        <AProductRating
          @click:stars="handleOpenReviewModal"
          @click:text="handleOpenReviewModal"
          :reviews="reviews"
          :text="$t('Leave me review')"
        />
      </div>
      <SfDivider v-show="reviewsCount" />
      <MReviewList v-show="reviewsCount" :reviews="reviews" />
    </SfTab>
  </SfTabs>
</template>
<script>
import { ModalList } from 'theme/store/ui/modals'
import { mapActions } from 'vuex'
import { SfHeading, SfTabs, SfDivider } from '@storefront-ui/vue';
import AProductRating from 'theme/components/atoms/a-product-rating';
import AProductAttribute from 'theme/components/atoms/a-product-attribute';
import MReviewList from 'theme/components/molecules/m-review-list';
export default {
  components: {
    SfHeading,
    SfTabs,
    AProductRating,
    SfDivider,
    AProductAttribute,
    MReviewList
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
  data () {
    return {
      openTab: 2
    };
  },
  computed: {
    reviewsCount () {
      return this.reviews.length
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    handleOpenReviewModal () {
      this.openModal({name: ModalList.Review, payload: this.product.id})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-product-additional-info {
  margin-top: var(--spacer-big);
  @include for-desktop {
    margin-top: calc(var(--spacer-big) * 5);
  }
  p {
    margin: 0;
  }
}
.properties {
  margin-top: var(--spacer-big);
}
.review-header {
  display: flex;
  @include for-mobile {
    align-items: flex-start;
  }
  ::v-deep {
    .sf-heading {
      flex-shrink: 0;
    }
    .a-product-rating {
      margin-left: 10px;
      width: 100%;
      justify-content: space-between;
    }
    .sf-rating {
      .sf-icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>

<template>
  <SfTabs
    class="m-product-additional-info product__tabs"
    id="m-product-additional-info"
    ref="productTabs"
    @toggle="onToggle"
  >
    <SfTab :title="$t('Description')">
      <div itemprop="description" v-html="product.description" />
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
      <MReviewList v-show="reviewsCount" :reviews="reviews" />
    </SfTab>
    <SfTab v-if="attributes.length" :title="$t('Additional Information')">
      <AProductAttribute
        v-for="(attribute, i) in attributes"
        :key="i"
        :product="product"
        :attribute="attribute"
        class="product__property"
      />
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
      isReviewProductTab: state => state.ui.isReviewProductTab
    }),
    reviewsCount () {
      return this.reviews.length;
    }
  },
  watch: {
    isReviewProductTab (value) {
      if (value && !this.$refs.reviewTab.isActive) {
        this.$refs.productTabs.toggle(this.$refs.reviewTab._uid);
      }
    }
  },
  beforeDestroy () {
    this.$store.commit('ui/setReviewProductTab', false);
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
    }
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
      --tabs-content-tab-padding: var(--spacer-xl) 0 0 0;
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

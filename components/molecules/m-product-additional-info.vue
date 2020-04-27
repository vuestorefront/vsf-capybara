<template>
  <SfTabs
    class="m-product-additional-info product__tabs"
    :open-tab="openTab"
    :key="openTab"
    @toggle="onTabChange"
  >
    <SfTab :title="$t('Description')">
      <div itemprop="description" v-html="product.description" />
      <AProductAttribute
        v-for="(attribute, i) in attributes"
        :key="i"
        :product="product"
        :attribute="attribute"
        class="product__property"
      />
    </SfTab>
    <SfTab :title="$t('Read reviews')">
      <MReviewList v-show="reviewsCount" :reviews="reviews" />
    </SfTab>
  </SfTabs>
</template>

<script>
import { SfTabs } from '@storefront-ui/vue';
import AProductAttribute from 'theme/components/atoms/a-product-attribute';
import MReviewList from 'theme/components/molecules/m-review-list';

export default {
  name: 'MProductAdditionalInfo',
  components: {
    SfTabs,
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
    openTab () {
      return this.$store.state.ui.activeProductTab
    },
    reviewsCount () {
      return this.reviews.length
    }
  },
  methods: {
    onTabChange (index) {
      let counter = 0
      this.$children[0].$children.forEach(tab => {
        counter++
        if (tab._uid === index) {
          this.$store.commit('ui/setActiveProductTab', counter);
        }
      })
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
</style>

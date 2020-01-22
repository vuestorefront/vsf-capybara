<template>
  <SfTabs class="m-product-additional-info" :open-tab="2">
    <SfTab title="Description">
      <div>
        <p>
          The Karissa V-Neck Tee features a semi-fitted shape that's flattering
          for every figure. You can hit the gym with confidence while it hugs
          curves and hides common "problem" areas. Find stunning women's
          cocktail dresses and party dresses.
        </p>
      </div>
      <div class="m-product-additional-info__properties">
        <SfProperty
          v-for="(property, i) in properties"
          :key="i"
          class="m-product-additional-info__property"
          :name="property.name"
          :value="property.value"
        />
      </div>
    </SfTab>
    <SfTab title="Read reviews">
      <SfReview
        v-for="(review, i) in reviews"
        :key="i"
        class="m-product-additional-info__review"
        :author="review.author"
        :date="review.date"
        :message="review.message"
        :rating="review.rating"
        :max-rating="5"
      />
    </SfTab>
    <SfTab title="Additional Information">
      <SfHeading
        title="Brand"
        :level="3"
        class="sf-heading--no-underline sf-heading--left"
      />
      <p>
        <u>Brand name</u> is the perfect pairing of quality and design. This
        label creates major everyday vibes with its collection of modern
        brooches, silver and gold jewellery, or clips it back with hair
        accessories in geo styles.
      </p>
    </SfTab>
  </SfTabs>
</template>
<script>
import { SfProperty, SfHeading, SfTabs, SfReview } from '@storefront-ui/vue';
export default {
  components: {
    SfProperty,
    SfHeading,
    SfTabs,
    SfReview
  },
  data () {
    return {
      properties: [
        {
          name: 'Product Code',
          value: '578902-00'
        },
        {
          name: 'Category',
          value: 'Pants'
        },
        {
          name: 'Material',
          value: 'Cotton'
        },
        {
          name: 'Country',
          value: 'Germany'
        }
      ],
      reviews: [
        {
          author: 'Jane D.Smith',
          date: 'April 2019',
          message:
            "I was looking for a bright light for the kitchen but wanted some item more modern than a strip light. this one is perfect, very bright and looks great. I can't comment on interlation as I had an electrition instal it. Would recommend",
          rating: 4
        },
        {
          author: 'Mari',
          date: 'Jan 2018',
          message:
            'Excellent light output from this led fitting. Relatively easy to fix to the ceiling,but having two people makes it easier, to complete the installation. Unable to comment on reliability at this time, but I am hopeful of years of use with good light levels. Excellent light output from this led fitting. Relatively easy to fix to the ceiling,',
          rating: 5
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.m-product-additional-info {
  margin-top: $spacer-big;
  @include for-desktop {
    margin-top: 5 * $spacer-big;
  }
  p {
    margin: 0;
  }
  &__properties {
    margin-top: $spacer-big;
  }
  &__property {
    padding: $spacer-small 0;
  }
  &__review {
    padding-bottom: $spacer-big;
    @include for-desktop {
      padding-bottom: $spacer-extra-big;
      border-bottom: 1px solid $c-light;
    }
    & + & {
      padding-top: $spacer-extra-big;
      border-top: 1px solid $c-light;
      @include for-desktop {
        border-top: 0;
        padding-top: $spacer-extra-big;
      }
    }
  }
}
</style>

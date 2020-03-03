<template>
  <div class="o-header">
    <SfHeader :active-icon="activeIcon">
      <template #logo>
        <ALogo />
      </template>
      <template #navigation>
        <SfHeaderNavigationItem
          v-for="category in categories"
          :key="category.id"
        >
          <router-link
            class="no-underline"
            :to="categoryLink(category)"
          >
            {{ category.name }}
          </router-link>
        </SfHeaderNavigationItem>
      </template>
      <template #search>
        <div class="hidden" />
      </template>
      <template #header-icons>
        <div class="sf-header__icons ml-auto">
          <ASearchIcon />
          <AAccountIcon />
          <AMicrocartIcon />
        </div>
      </template>
    </SfHeader>
  </div>
</template>

<script>
import { SfHeader } from '@storefront-ui/vue';
import ALogo from 'theme/components/atoms/a-logo';
import ASearchIcon from 'theme/components/atoms/a-search-icon';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import { mapGetters } from 'vuex';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers';
import { getTopLevelCategories } from 'theme/helpers';

export default {
  name: 'OHeader',
  components: {
    SfHeader,
    ALogo,
    AAccountIcon,
    AMicrocartIcon,
    ASearchIcon
  },
  computed: {
    ...mapGetters('category', ['getCategories']),
    ...mapGetters('user', ['isLoggedIn']),
    activeIcon () {
      return this.isLoggedIn ? 'account' : '';
    },
    categories () {
      return getTopLevelCategories(this.getCategories);
    }
  },
  methods: {
    categoryLink (category) {
      return formatCategoryLink(category);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.o-header {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
  @include for-mobile {
    .sf-header__icons {
      display: none;
    }
  }
}
.ml-auto {
  margin-left: auto;
}
</style>

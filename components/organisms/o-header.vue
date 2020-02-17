<template>
  <div class="o-header">
    <SfHeader :active-icon="activeIcon">
      <template #logo>
        <ALogo width="41px" height="41px" />
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
import config from 'config'

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
      return this.getCategories.filter(
        category => (category.level === (config.entities.category.categoriesDynamicPrefetchLevel >= 0 ? config.entities.category.categoriesDynamicPrefetchLevel : 2)) && // display only the root level (level =1 => Default Category), categoriesDynamicPrefetchLevel = 2 by default
        (category.is_active && category.children_count > 0)
      );
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
@import "~@storefront-ui/shared/styles/_variables.scss";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.o-header {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.ml-auto {
  margin-left: auto;
}
</style>

<template>
  <div class="o-header">
    <SfHeader :active-icon="activeIcon">
      <template #logo>
        <Logo width="41px" height="41px" />
      </template>
      <template #navigation>
        <router-link
          v-for="category in categories"
          :key="category.id"
          class="no-underline"
          :to="categoryLink(category)"
        >
          <SfHeaderNavigationItem>{{ category.name }}</SfHeaderNavigationItem>
        </router-link>
      </template>
      <template #search><div class="hidden"></div></template>
      <template #header-icons>
        <div class="sf-header__icons ml-auto">
          <SearchIcon />
          <AccountIcon />
          <WishlistIcon />
          <MicrocartIcon />
        </div>
      </template>
    </SfHeader>
  </div>
</template>

<script>
import { SfHeader } from "@storefront-ui/vue";
import Logo from "theme/components/core/Logo";
import SearchIcon from "theme/components/core/blocks/Header/SearchIcon";
import AccountIcon from "theme/components/core/blocks/Header/AccountIcon";
import WishlistIcon from "theme/components/core/blocks/Header/WishlistIcon";
import MicrocartIcon from "theme/components/core/blocks/Header/MicrocartIcon";
import { mapGetters } from "vuex";
import { formatCategoryLink } from "@vue-storefront/core/modules/url/helpers";

export default {
  name: "Header",
  components: {
    SfHeader,
    Logo,
    AccountIcon,
    WishlistIcon,
    MicrocartIcon,
    SearchIcon
  },
  computed: {
    ...mapGetters("category", ["getCategories"]),
    ...mapGetters("user", ["isLoggedIn"]),
    activeIcon() {
      return this.isLoggedIn ? "account" : "";
    },
    categories() {
      return this.getCategories.filter(
        category => category.is_active && category.children_count > 0
      );
    }
  },
  methods: {
    categoryLink(category) {
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

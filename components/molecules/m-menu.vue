<template>
  <div class="m-menu sf-mega-menu bg-white">
    <SfMegaMenu
      :title="title || currentCategoryTitle"
      :visible="visible"
    >
      <SfMegaMenuColumn
        v-for="category in categories"
        :key="category.id"
        :title="category.name"
      >
        <SfList>
          <SfListItem
            v-for="item in category.items"
            :key="item.id"
          >
            <router-link
              :to="item.link"
              @click.native="$emit('close')"
            >
              <SfMenuItem :label="item.name" />
            </router-link>
          </SfListItem>
        </SfList>
      </SfMegaMenuColumn>
      <template #aside>
        <div class="aside-menu">
          <SfBanner
            v-for="(banner, i) in banners"
            :key="i"
            :title="banner.title"
            :image="banner.image"
            class="aside-banner"
            :class="`aside-banner--${banner.type}`"
          />
        </div>
      </template>
    </SfMegaMenu>
  </div>
</template>
<script>
import { SfMegaMenu, SfList, SfMenuItem, SfBanner } from '@storefront-ui/vue';
import config from 'config'
import get from 'lodash-es/get'
import { prepareCategoryMenuItem } from 'theme/helpers';
import { mapGetters, mapState } from 'vuex';
import { checkWebpSupport } from 'theme/helpers'
export default {
  components: { SfMegaMenu, SfList, SfMenuItem, SfBanner },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    categoriesIds: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    positionSort (a, b) {
      return a.position - b.position;
    }
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters({
      getCategories: 'category/getCategories',
      getCurrentCategory: 'category/getCurrentCategory',
      getPromotedOffers: 'promoted/getPromotedOffers'
    }),
    categories () {
      return this.categoriesIds
        .map(category => {
          const subCategories = category.children_data
            .map(subCategory => prepareCategoryMenuItem(subCategory))
            .sort(this.positionSort)

          const subheader = prepareCategoryMenuItem(category);
          const viewAllMenuItem = {
            ...subheader,
            name: this.$t('View all'),
            position: 0
          };

          return {
            ...subheader,
            items: [viewAllMenuItem, ...subCategories]
          };
        })
        .sort(this.positionSort);
    },
    currentCategoryTitle () {
      return this.getCurrentCategory.name || ''
    },
    banners () {
      return checkWebpSupport(this.getPromotedOffers.menuAsideBanners, this.isWebpSupported)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.m-menu {
  padding: 0;
  position: absolute;
  left: 0;
  width: 100%;
  top: 100%;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s;
  .router-link-exact-active {
    --menu-item-font-weight: var(--font-bold);
  }
}
.aside-menu {
  display: flex;
  justify-content: stretch;
  flex-wrap: wrap;
  @include for-desktop {
     justify-content: space-between;
  }
}
.aside-banner {
  margin-bottom: var(--spacer-sm);
  text-transform: uppercase;
  --banner-height: 300px;
  &--mobile {
    display: none;
    @include for-mobile {
      display: block;
    }
  }
  &--desktop {
    --banner-width: 300px;
    display: none;
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      display: block;
    }
  }
}
</style>

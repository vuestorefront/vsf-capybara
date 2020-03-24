<template>
  <div class="m-menu">
    <SfMegaMenu
      :title="title || currentCategoryTitle"
      :visible="visible"
    >
      <SfMegaMenuColumn
        v-for="category in categories"
        :key="category.id"
        :title="category.name"
      >
        <router-link
          v-for="item in category.items"
          :key="item.id"
          :to="item.link"
          class="sf-menu-item"
          active-class="sf-menu-item--active"
          @click.native="$store.commit('ui/closeMenu')"
        >
          <span class="sf-menu-item__label">{{ item.name }}</span>
          <SfIcon
            class="sf-menu-item__mobile-nav-icon"
            icon="chevron_right"
            size="xxs"
            color="black"
            view-box="0 0 14 14"
          />
        </router-link>
      </SfMegaMenuColumn>
      <template #aside>
        <div class="aside-menu">
          <div
            class="aside-tile"
            :class="`aside-tile--${banner.type}`"
            v-for="banner in banners"
            :key="banner.image"
          >
            <h3 class="aside-title">
              {{ banner.title }}
            </h3>
            <SfImage class="aside-image" :src="banner.image" />
          </div>
        </div>
      </template>
    </SfMegaMenu>
  </div>
</template>
<script>
import { SfMegaMenu, SfIcon, SfImage } from '@storefront-ui/vue';
import config from 'config'
import get from 'lodash-es/get'
import { prepareCategoryMenuItem } from 'theme/helpers';
import { mapGetters, mapState } from 'vuex';
import { checkWebpSupport } from 'theme/helpers'
export default {
  components: { SfMegaMenu, SfIcon, SfImage },
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
        .map(({ id, children_data: childrenData = [] }) => {
          const subCategories = childrenData
            .map(subCategory => prepareCategoryMenuItem(
              this.getCategories.find(category => category.id === subCategory.id)
            ))
            .filter(Boolean)
            .sort((a, b) => a.position - b.position)

          const category = this.getCategories.find(category => category.id === id)
          const viewAllMenuItem = prepareCategoryMenuItem({
            ...category,
            name: this.$t('View all'),
            position: 0
          });

          return {
            ...prepareCategoryMenuItem(category),
            items: [viewAllMenuItem, ...subCategories]
          };
        })
        .sort((a, b) => a.position - b.position);
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
@import "~@storefront-ui/vue/styles";

.m-menu {
  position: absolute;
  left: 0;
  width: 100%;
  top: 100%;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s;
}
.aside-menu {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.aside-tile {
  margin-bottom: 1.25rem;
  &--mobile {
    display: none;
    @include for-mobile {
      display: block;
    }
  }
  &--desktop {
    display: none;
    @include for-desktop {
      display: block;
    }
  }
}
.aside-title {
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}
</style>

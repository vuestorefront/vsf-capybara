<template>
  <div class="m-menu">
    <SfMegaMenu
      :title="title || currentCategoryTitle"
      :visible="true"
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
          @click.native="$store.commit('ui/toggleMenu')"
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
        <!-- <AsidePlaceholder/> -->
      </template>
    </SfMegaMenu>
  </div>
</template>
<script>
import { SfMegaMenu, SfIcon } from '@storefront-ui/vue';
import config from 'config'
import get from 'lodash-es/get'
import { prepareCategoryMenuItem } from 'theme/helpers';
import { mapGetters } from 'vuex';
export default {
  components: { SfMegaMenu, SfIcon },
  props: {
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
    ...mapGetters({
      getCategories: 'category/getCategories',
      getCurrentCategory: 'category/getCurrentCategory'
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
::v-deep .sf-mega-menu__menu {
  --mega-menu-menu-justify-content: flex-start;
}
</style>

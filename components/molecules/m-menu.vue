<template>
  <div class="m-menu sf-mega-menu bg-white">
    <SfMegaMenu
      ref="menu"
      :title="title"
      :visible="visible"
    >
      <SfMegaMenuColumn
        title="Custom Products"
      >
        <SfList>
          <SfListItem
            v-for="item in customProductsItems"
            :key="item.label"
          >
            <router-link
              :to="item.url"
              @click.native="$emit('close')"
            >
              <SfMenuItem :label="item.label" />
            </router-link>
          </SfListItem>
        </SfList>
      </SfMegaMenuColumn>

      <SfMegaMenuColumn
        title="Other Products"
      >
        <SfList>
          <SfListItem
            v-for="item in otherProductsItems"
            :key="item.label"
          >
            <router-link
              class="_item-link"
              :to="item.url"
              :class="{'-active': item.isActive && item.isActive()}"
              @click.native="$emit('close')"
            >
              <SfMenuItem :label="item.label" />
            </router-link>
          </SfListItem>
        </SfList>
      </SfMegaMenuColumn>
    </SfMegaMenu>
  </div>
</template>
<script>
import { SfMegaMenu, SfList, SfMenuItem } from '@storefront-ui/vue';
export default {
  components: { SfMegaMenu, SfList, SfMenuItem },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      customProductsItems: [
        {
          label: 'Petsies Stuffed Animals',
          url: '/forevers-pet-plush/'
        },
        {
          label: 'Pet Shaped Pillows',
          url: '/pet-pillow/'
        },
        {
          label: 'Square Photo Pillows',
          url: {
            name: 'category',
            params: {
              slug: 'custom-photo-pillows-80'
            }
          }
        },
        {
          label: 'Pet Socks',
          url: {
            name: 'printed-socks-creation-page'
          }
        },
        {
          label: 'Face Masks',
          url: {
            name: 'printed-masks-creation-page'
          }
        },
        {
          label: 'Pet Keychains',
          url: {
            name: 'printed-keychains-creation-page'
          }
        },
        {
          label: 'Felted Magnets',
          url: {
            name: 'felted-magnets-creation-page'
          }
        }
      ],
      otherProductsItems: [
        {
          label: 'Gift Boxes',
          url: {
            name: 'giftbox'
          },
          isActive: () => {
            return this.$route.name === 'configurable-product' &&
             this.$route.params?.parentSku === 'gift_box';
          }
        },
        {
          label: 'Accessories',
          url: {
            name: 'category',
            params: {
              slug: 'petsies-accessories-11'
            }
          }
        },
        {
          label: 'Bulk Orders',
          url: '/bulk-custom-stuffed-animal-manufacture/'
        }
      ]
    }
  },
  async mounted () {
    await this.$nextTick();
    this.$refs.menu.active = this.$refs.menu.items;
    this.$refs.menu._computedWatchers.isMobile = undefined;
  }
}
</script>
<style lang="scss">
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

  .router-link-active {
    --menu-item-font-weight: bold;
  }

  ._item-link {
    &.-active {
      --menu-item-font-weight: bold;
    }
  }

  .sf-menu-item {
    --menu-item-label-color: var(--c-dark);
  }

  .sf-mega-menu {
    @include for-mobile {
      overflow: auto;
    }
  }

  .sf-mega-menu__menu {
    @include for-desktop {
      flex-wrap: wrap;
      flex: 0 1 auto;
    }
  }

  .sf-mega-menu__content {
    @include for-desktop {
      --mega-menu-content-padding: var(--spacer-xl) var(--spacer-sm);
    }
  }

  .sf-bar {
    display: none;
  }
}
</style>

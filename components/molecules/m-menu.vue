<template>
  <div class="m-menu sf-mega-menu bg-white">
    <SfMegaMenu
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
              :to="item.url"
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
          url: { name: 'forevers-create' }
        },
        {
          label: 'Pet Shaped Pillows',
          url: {
            name: 'pillow-product',
            params: {
              parentSku: 'customPillow_bundle',
              slug: 'pillow'
            }
          }
        },
        {
          label: 'Square Photo Pillows',
          url: '/c/custom-photo-pillows-80'
        },
        {
          label: 'Pet Socks',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedSocks_bundle',
              slug: 'printed-socks'
            }
          }
        },
        {
          label: 'Face Masks',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedMasks_bundle',
              slug: 'printed-masks'
            }
          }
        },
        {
          label: 'Pet Keychains',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedKeychains_bundle',
              slug: 'face-keychains'
            }
          }
        }
      ],
      otherProductsItems: [
        {
          label: 'Gift Boxes',
          url: '/'
        },
        {
          label: 'Accessories',
          url: '/c/petsies-accessories-11'
        },
        {
          label: 'Bulk Orders',
          url: '/'
        }
      ]
    }
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
  .router-link-exact-active {
    --menu-item-font-weight: bold;
  }
  .sf-menu-item {
    --menu-item-label-color: var(--c-dark);
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
}
</style>

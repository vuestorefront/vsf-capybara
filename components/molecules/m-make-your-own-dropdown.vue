<template>
  <div
    class="m-make-your-own-dropdown"
    :class="{ '-small': size === 'small' }"
    @mouseover="toggleDropdownOnDesktop(true)"
    @mouseleave="toggleDropdownOnDesktop(false)"
  >
    <SfButton @click="toggleDropdownOnMobile(true)">
      Make your own
    </SfButton>
    <SfDropdown
      :is-open="isDropdownOpen"
      @click:close="toggleDropdownOnMobile(false)"
    >
      <SfList>
        <SfListItem v-for="action in dropdownActions" :key="action.label">
          <router-link
            @click.native="toggleDropdownOnMobile(false)"
            :to="action.url"
          >
            {{ action.label }}
          </router-link>
        </SfListItem>
      </SfList>

      <template #cancel>
        <SfButton
          class="sf-button--full-width sf-dropdown__cancel"
          @click="toggleDropdownOnMobile(false)"
        >
          Cancel
        </SfButton>
      </template>
    </SfDropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SfButton, SfDropdown, SfList } from '@storefront-ui/vue';
import {
  mapMobileObserver,
  unMapMobileObserver
} from '@storefront-ui/vue/src/utilities/mobile-observer';

export default Vue.extend({
  name: 'MMakeYourOwnDropdown',
  props: {
    size: {
      type: String,
      default: ''
    }
  },
  components: {
    SfButton,
    SfDropdown,
    SfList
  },
  data () {
    return {
      dropdownActions: [
        {
          label: 'Custom Petsies',
          url: '/forevers-pet-plush/'
        },
        {
          label: 'Custom Pillows',
          url: '/custom-pillows/'
        },
        {
          label: 'Custom Socks',
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
        },
        {
          label: 'Gift Box',
          url: { name: 'giftbox' }
        }
      ],
      isDropdownOpen: false
    };
  },
  computed: {
    ...mapMobileObserver()
  },
  beforeDestroy (): void {
    unMapMobileObserver();
  },
  methods: {
    toggleDropdownOnMobile (shouldOpen: boolean) {
      if (!this.isMobile) {
        return;
      }

      this.isDropdownOpen = shouldOpen;
    },
    toggleDropdownOnDesktop (shouldOpen: boolean) {
      if (this.isMobile) {
        return;
      }

      this.isDropdownOpen = shouldOpen;
    }
  }
});
</script>

<style lang="scss" scoped>
.m-make-your-own-dropdown {
  position: relative;
  align-self: center;

  .sf-button {
    --button-font-size: var(--font-sm);
    --button-font-line-height: 1;
  }

  .sf-dropdown {
    --dropdown-background: var(--c-primary);
    --c-link: var(--c-light-variant);
    --c-link-hover: var(--c-light-variant);
    --list-item-padding: var(--spacer-xs) var(--spacer-sm);

    .sf-list__item {
      &:hover {
        background-color: var(--c-light);
      }

      > a {
        width: 100%;
        display: block;
      }
    }
  }

  &.-small {
    .sf-button {
      --button-font-size: var(--font-2xs);
      --button-font-line-height: 1;
      --button-padding: calc(var(--spacer-2xs) * 3) var(--spacer-sm);
    }

    .sf-dropdown {
      left: 0;
    }
  }
}
</style>

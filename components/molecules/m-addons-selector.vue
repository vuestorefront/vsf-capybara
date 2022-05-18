<template>
  <ul
    class="m-addons-selector"
    :class="[
      {
        '-disabled': disabled,
      },
      skinClass,
    ]"
  >
    <li
      class="_item"
      v-for="addon in addons"
      :key="addon.id"
      :style="getItemStyles(addon)"
    >
      <MCheckbox
        name="upgrades[]"
        class="_addon-input"
        :value="addon.optionValueId"
        v-model="selectedValues"
        :disabled="disabled"
      >
        <template #label>
          <div class="_addon-wrapper">
            <div class="_info-column">
              <div class="_title">
                {{ addon.name }}
              </div>

              <div class="_description" v-html="addon.description" />

              <div class="_price" v-if="addon.price">
                <strong>
                  + {{ addon.price | price() }}
                </strong>
              </div>
            </div>

            <div class="_image-column">
              <div class="_image" v-if="!shouldShowVideo(addon.id)" @click="switchToVideo($event, addon)" />
              <StreamingVideo
                :video-id="getVideoId(addon)"
                :provider="getVideoProvider(addon)"
                :auto-play="true"
                :display-controls="false"
                v-if="shouldShowVideo(addon.id) && getVideoId(addon) && getVideoProvider(addon)"
              />
            </div>
          </div>
        </template>
      </MCheckbox>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import urlParser from 'js-video-url-parser';

import { StreamingVideo } from 'src/modules/shared';

import MCheckbox from './m-checkbox.vue';

import AddonOption from '../interfaces/addon-option.interface';

let instanceId = 0;

export default Vue.extend({
  name: 'MAddonsSelector',
  components: {
    MCheckbox,
    StreamingVideo
  },
  props: {
    addons: {
      type: Array as PropType<AddonOption[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array as PropType<number[]>,
      default: () => []
    }
  },
  data () {
    return {
      instanceId: '',
      // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
      showVideoFlags: {} as Record<number, boolean | undefined>
    };
  },
  computed: {
    skinClass (): string {
      return `-skin-petsies`;
    },
    selectedValues: {
      get: function (): number[] {
        return this.value;
      },
      set: function (value: number[]) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    getInputId (addon: AddonOption): string {
      return `design-product-${this.instanceId}-${addon.id}`;
    },
    getItemStyles (item: AddonOption): Record<string, string> {
      const result: Record<string, string> = {};

      if (!item.images.length) {
        return result;
      }

      result['--addon-image-regular'] = `url(${item.images[0]})`;

      if (item.images.length === 1) {
        return result;
      }

      result['--addon-image-hover'] = `url(${item.images[1]})`;

      return result;
    },
    getVideoId (addon: AddonOption): string | undefined {
      if (!addon.videoUrl) {
        return;
      }

      const info = urlParser.parse(addon.videoUrl);

      if (!info) {
        return;
      }

      return info.id;
    },
    getVideoProvider (addon: AddonOption): string | undefined {
      if (!addon.videoUrl) {
        return;
      }

      const info = urlParser.parse(addon.videoUrl);

      if (!info) {
        return;
      }

      return info.provider;
    },
    shouldShowVideo (addonId: number): boolean {
      return !!this.showVideoFlags[addonId];
    },
    switchToVideo (event: Event, addon: AddonOption): void {
      if (!addon.videoUrl) {
        return;
      }

      event.preventDefault();
      Vue.set(this.showVideoFlags, addon.id, true);
    }
  },
  created (): void {
    this.instanceId = instanceId.toString();

    instanceId += 1;
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-addons-selector {
  padding: 0;
  list-style: none;

  ._item {
    cursor: pointer;

    ._addon-input {
      padding: 1em 1.5em;
      transition: background-color .15s cubic-bezier(0.65, 0.05, 0.35, 1);

      &.sf-checkbox--is-active {
        background: var(--c-secondary);
      }
    }

    ::v-deep .sf-checkbox__container {
      align-items: flex-start;
    }

    ::v-deep .sf-checkbox__checkmark {
      align-items: flex-start;
      flex-shrink: 0;
    }

    ._addon-wrapper {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      justify-content: stretch;
      align-items: stretch;
      margin-left: 1em;
    }

    ._info-column {
      width: 100%;
    }

    ._image-column {
      display: none;
    }

    ._info-column {
      text-align: left;

      ._title {
        font-weight: var(--font-semibold);
        margin-top: calc(var(--checkbox-size, 1.5rem) / 10);
      }

      ._description {
        font-size: var(--font-sm);
        margin-top: 1em;
      }

      ._price {
        color: var(--_c-light-primary);
        font-size: var(--font-base);
        margin-top: 1em;
      }
    }

    ._image-column {
      ._image {
        background: var(--addon-image-regular) no-repeat center center;
        background-size: contain;
        padding-top: calc(min(100%, 250px));
        max-width: 250px;
        margin-left: auto;

        &::after {
          position: absolute; width:0; height:0; overflow:hidden; z-index:-1;
          content: var(--addon-image-hover);
        }
      }

      &:hover {
        ._image {
          background-image: var(--addon-image-hover, var(--addon-image-regular));
        }
      }
    }
  }

  &.-disabled {
    ._item {
      --checkbox-cursor: default;

      opacity: 0.7;
      cursor: default;
    }
  }

  @media (min-width: $tablet-min) {
    ._item {
      ._info-column,
      ._image-column {
        display: block;
        width: 50%;
      }
    }
  }
}
</style>

<template>
  <div
    class="m-design-selector"
    :class="[
      {
        '-disabled': disabled,
      },
      skinClass,
    ]"
  >
    <ul class="_options-list">
      <li
        v-for="design in designProducts"
        :key="design.sku"
        class="_design-option"
        :class="{
          '-selected': design.sku == selectedValue,
          '-accent-color': design.defaultAccentColor,
        }"
      >
        <input
          :id="getInputId(design)"
          v-model.number="selectedValue"
          type="radio"
          :name="fieldName"
          :value="design.sku"
          :disabled="disabled"
        >

        <label class="_option-label" :for="getInputId(design)">
          <div class="_image-wrapper">
            <div class="_accent-color-icon" />
            <BaseImage
              class="_image"
              :src="design.thumbnail"
              :aspect-ratio="1"
            />
          </div>

          <div class="_content-wrapper">
            <div class="_name">
              {{ design.name }}
            </div>

            <div class="_price" v-if="design.price > 0">
              <span>+</span>
              {{ design.price | currency("$", 0) }}
            </div>
          </div>
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DesignProduct from '../interfaces/design-product.interface';

import { BaseImage } from 'src/modules/budsies';

let instanceId = 0;

export default Vue.extend({
  name: 'MDesignSelector',
  components: {
    BaseImage
  },
  props: {
    designProducts: {
      type: Array as PropType<DesignProduct[]>,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  data () {
    return {
      instanceId: ''
    };
  },
  computed: {
    skinClass (): string {
      return `-skin-petsies`;
    },
    selectedDesign (): DesignProduct | undefined {
      if (!this.value) {
        return undefined;
      }

      return this.designProducts.find((item) => item.sku === this.value);
    },
    selectedValue: {
      get: function (): string | undefined {
        return this.value;
      },
      set: function (value: string | undefined) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    getInputId (design: DesignProduct): string {
      return `design-product-${this.instanceId}-${design.sku}`;
    }
  },
  created (): void {
    this.instanceId = instanceId.toString();

    instanceId += 1;
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-design-selector {
  ._options-list {
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    padding: 0;

    ._design-option {
      flex-shrink: 0;
      flex-grow: 0;
      display: block;
      padding: 0.75em;

      > input {
        opacity: 0;
        height: 0;
        width: 0;
        position: absolute;
      }

      ._option-label {
        background: none;
        font-size: 1em;
        line-height: 1.2;
        margin: 0;
        padding: 0;

        ._image-wrapper {
          position: relative;

          ._image {
            width: 100%;
          }
        }

        ._name,
        ._price {
          text-align: center;
        }

        ._name {
          font-size: 0.86em;
          font-weight: 600;
          margin-top: 0.5em;
        }

        ._price {
          font-size: 0.86em;
          margin-top: 0.25em;
        }
      }

      &.-accent-color {
        ._accent-color-icon {
          width: 32px;
          height: 32px;
          background: url("/assets/images/phrasePillow/accent-color-icon.png");
          background-size: cover;
          position: absolute;
          right: 0.25em;
          top: 0.25em;
          z-index: 2;
        }
      }
    }
  }

  &.-disabled {
    opacity: 0.6;
  }

  &.-skin-petsies {
    ._design-option {
      &.-selected {
        background: var(--c-primary);
      }
    }
  }

  @media (min-width: $tablet-min) {
    ._options-list {
      justify-content: flex-start;
      padding: 0;
    }
  }

  @include for-desktop {
    ._options-list {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
}
</style>

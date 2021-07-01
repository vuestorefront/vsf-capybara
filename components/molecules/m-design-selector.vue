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
    <div class="_compact-view" v-if="isCollapsed">
      <div class="_image-wrapper">
        <img class="_image" :src="selectedDesign.thumbnail">
      </div>

      <div
        class="_content-wrapper"
        :class="{ '-has-price': selectedDesign.price }"
      >
        <div class="_name">
          {{ selectedDesign.name }}
        </div>

        <div class="_price" v-if="selectedDesign.price > 0">
          <span>+</span>
          {{ selectedDesign.price | currency("$", 0) }}
        </div>

        <div class="_change-button-wrapper">
          <a
            href="javascript:void(0)"
            class="_change-button"
            :class="{ '-disabled': disabled }"
            @click="expandSelector"
          >Try a different style</a>

          <div class="_helper-text">
            (saves your uploaded photo)
          </div>
        </div>
      </div>
    </div>

    <ul class="_options-list" v-else>
      <li
        v-for="design in designProducts"
        :key="design.sku"
        class="_design-option"
        :class="{
          '-selected': design.sku == selectedValue,
          '-accent-color': design.defaultAccentColor
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

        <label
          class="_option-label"
          :for="getInputId(design)"
        >
          <div class="_image-wrapper">
            <div class="_accent-color-icon" />
            <img class="_image" :src="design.thumbnail">
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

let instanceId = 0;

export default Vue.extend({
  name: 'MDesignSelector',
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
    shouldCollapse: {
      type: Boolean,
      default: true
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  data () {
    return {
      isCollapsed: false,
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

      return this.designProducts.find(item => item.sku === this.value);
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
    },
    expandSelector (): void {
      if (this.disabled) {
        return;
      }

      this.isCollapsed = false;
    }
  },
  created (): void {
    this.isCollapsed = Boolean(this.value) && this.shouldCollapse;

    this.instanceId = instanceId.toString();

    instanceId += 1;
  }
})
</script>

<style lang="scss" scoped>
.m-design-selector {

  ._compact-view {
    align-items: stretch;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;

    ._content-wrapper {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-left: 1em;

      &.-has-price {
        justify-content: space-between;
      }
    }

    ._image-wrapper {
      ._image {
        width: 100px;
      }
    }

    ._name {
      font-weight: 600;
    }

    ._change-button-wrapper {
      margin-top: 0.5em;
    }

    ._change-button {
      margin: 0.5em 0 4px;
    }

    ._helper-text {
      font-size: var(--font-xs);
      font-weight: var(--font-medium);
      margin-top: var(--spacer-xs);
    }
  }

  ._options-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    list-style-image: none;
    padding: 0;

    ._design-option {
      flex-shrink: 0;
      flex-grow: 0;
      display: block;
      padding: 2%;
      min-width: 114px;
      width: 21%;

      > input {
        opacity: 0;
        height: 0;
        width: 0;
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
}
</style>

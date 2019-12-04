<template>
  <li class="row py10 bg-cl-white" :class="{ relative: editMode }">
    <div
      v-if="editMode"
      class="mx10 w-100 py10 mb15 edit-mode flex between-xs middle-xs"
    >
      Edit mode
      <button class="brdr-none bg-cl-transparent" @click="closeEditMode">
        <span class="cl-accent">
          <i class="material-icons cl-accent mr5">
            close
          </i>
        </span>
      </button>
    </div>
    <div class="blend">
      <div class="ml10 bg-cl-secondary">
        <product-image :image="image" />
      </div>
    </div>
    <div class="col-xs pt15 flex pl35 flex-wrap">
      <div class="flex flex-nowrap details">
        <div class="flex w-100 flex-wrap between-xs">
          <div>
            <router-link
              class="serif h4 name"
              :to="productLink"
              data-testid="productLink"
              @click.native="$store.commit('ui/setMicrocart', false)"
            >
              {{ product.name | htmlDecode }}
            </router-link>
            <div class="h6 cl-bg-tertiary pt5 sku" data-testid="productSku">
              {{ product.sku }}
            </div>
            <div v-if="isTotalsActive" class="h6 cl-bg-tertiary pt5 options">
              <div v-for="opt in product.totals.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-text="opt.value" />
              </div>
            </div>
            <div
              v-else-if="!editMode && product.options"
              class="h6 cl-bg-tertiary pt5 options"
            >
              <div v-for="opt in product.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-text="opt.value" />
              </div>
            </div>
            <div v-if="hasProductErrors" class="h6 pt5 cl-error">
              {{ product.errors | formatProductMessages }}
            </div>
            <div
              v-if="hasProductInfo && !hasProductErrors"
              class="h6 pt5 cl-success"
            >
              {{ product.info | formatProductMessages }}
            </div>
          </div>
          <product-quantity
            v-if="product.type_id !== 'grouped' && product.type_id !== 'bundle'"
            class="h5 cl-accent lh25 qty"
            :value="productQty"
            :max-quantity="maxQuantity"
            :loading="isStockInfoLoading"
            :is-simple-or-configurable="isSimpleOrConfigurable"
            @input="updateProductQty"
            @error="handleQuantityError"
          />
        </div>
        <div class="flex mr10 align-right start-xs between-sm prices">
          <div v-if="!displayItemDiscounts || !isOnline" class="prices">
            <span
              v-if="product.special_price"
              class="h4 serif cl-error price-special"
            >
              {{ (product.price_incl_tax * product.qty) | price }}
            </span>
            <span v-if="product.special_price" class="h6 serif price-original">
              {{ (product.original_price_incl_tax * product.qty) | price }}
            </span>
            <span
              v-else
              class="h4 serif price-regular"
              data-testid="productPrice"
            >
              {{
                ((product.original_price_incl_tax
                  ? product.original_price_incl_tax
                  : product.price_incl_tax) *
                  product.qty)
                  | price
              }}
            </span>
          </div>
          <div v-else-if="isOnline && product.totals" class="prices">
            <span
              v-if="product.totals.discount_amount"
              class="h4 serif cl-error price-special"
            >
              {{
                (product.totals.row_total -
                  product.totals.discount_amount +
                  product.totals.tax_amount)
                  | price
              }}
            </span>
            <span
              v-if="product.totals.discount_amount"
              class="h6 serif price-original"
            >
              {{ product.totals.row_total_incl_tax | price }}
            </span>
            <span
              v-if="!product.totals.discount_amount"
              class="h4 serif price-regular"
            >
              {{ product.totals.row_total_incl_tax | price }}
            </span>
          </div>
          <div v-else class="prices">
            <span class="h4 serif price-regular">
              {{
                ((product.regular_price || product.price_incl_tax) *
                  product.qty)
                  | price
              }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="editMode" class="w-100 pb15 flex flex-wrap bottom-xs">
        <div
          v-if="productsAreReconfigurable"
          class="ml0 flex flex-wrap filters"
        >
          <div
            v-for="(option, index) in product.configurable_options"
            :key="index"
            class="h5 pt5 w-100"
          >
            <div class="h6 cl-bg-tertiary mr10">{{ option.label }}:</div>
            <div
              v-if="option.label == 'Color' && editMode"
              class="flex flex-wrap pt5"
            >
              <color-selector
                v-for="filter in getAvailableOptions(option)"
                :key="filter.id"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
            <div
              v-else-if="option.label == 'Size' && editMode"
              class="flex flex-wrap pt5"
            >
              <size-selector
                v-for="filter in getAvailableOptions(option)"
                :key="filter.id"
                class="mr10 mb10"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
          </div>
        </div>
        <button-full
          class="update-button mb10 mr10"
          :disabled="isUpdateCartDisabled"
          @click.native="updateProductVariant"
        >
          {{ $t("Update item") }}
        </button-full>
      </div>
      <div v-if="!editMode" class="w-100 flex middle-xs actions">
        <edit-button
          v-if="productsAreReconfigurable && !editMode"
          class="mx5"
          @click="openEditMode"
        />
        <remove-button class="mx5" @click="removeItem" />
      </div>
    </div>
  </li>
</template>

<script>
import config from "config";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import { formatProductLink } from "@vue-storefront/core/modules/url/helpers";
import Product from "@vue-storefront/core/compatibility/components/blocks/Microcart/Product";

import ProductQuantity from "theme/components/core/ProductQuantity.vue";
import ProductImage from "theme/components/core/ProductImage";
import ColorSelector from "theme/components/core/ColorSelector.vue";
import SizeSelector from "theme/components/core/SizeSelector.vue";
import RemoveButton from "./RemoveButton";
import EditButton from "./EditButton";
import { onlineHelper } from "@vue-storefront/core/helpers";
import { ProductOption } from "@vue-storefront/core/modules/catalog/components/ProductOption";
import {
  getThumbnailForProduct,
  getProductConfiguration
} from "@vue-storefront/core/modules/cart/helpers";
import ButtonFull from "theme/components/theme/ButtonFull";
import EditMode from "./EditMode";

export default {
  components: {
    RemoveButton,
    ProductImage,
    ColorSelector,
    SizeSelector,
    EditButton,
    ButtonFull,
    ProductQuantity
  },
  mixins: [Product, ProductOption, EditMode],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false
    };
  },
  computed: {
    hasProductInfo() {
      return this.product.info && Object.keys(this.product.info).length > 0;
    },
    hasProductErrors() {
      return this.product.errors && Object.keys(this.product.errors).length > 0;
    },
    isTotalsActive() {
      return (
        this.isOnline &&
        !this.editMode &&
        this.product.totals &&
        this.product.totals.options
      );
    },
    isOnline() {
      return onlineHelper.isOnline;
    },
    productsAreReconfigurable() {
      return (
        config.cart.productsAreReconfigurable &&
        this.product.type_id === "configurable" &&
        this.isOnline
      );
    },
    displayItemDiscounts() {
      return config.cart.displayItemDiscounts;
    },
    image() {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      };
    },
    thumbnail() {
      return getThumbnailForProduct(this.product);
    },
    configuration() {
      return getProductConfiguration(this.product);
    },
    productLink() {
      return formatProductLink(this.product, currentStoreView().storeCode);
    },
    editMode() {
      return this.getEditingProductId === this.product.id;
    },
    productQty() {
      return this.editMode ? this.getEditingQty : this.product.qty;
    },
    isSimpleOrConfigurable() {
      return ["simple", "configurable"].includes(this.product.type_id);
    },
    isUpdateCartDisabled() {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      );
    },
    getAvailableOptions(option) {
      return this.getAvailableFilters[option.attribute_code].filter(filter => {
        return this.isOptionAvailable(filter);
      });
    }
  },
  watch: {
    isOnline: {
      async handler(isOnline) {
        if (isOnline) {
          const maxQuantity = await this.getQuantity();
          this.maxQuantity = maxQuantity;
        }
      },
      immediate: true
    }
  },
  methods: {
    updateProductVariant() {
      this.updateVariant();
      this.closeEditMode();
    },
    updateProductQty(qty) {
      if (this.editMode) {
        this.editModeSetQty(qty);
        return;
      }

      this.updateQuantity(qty);
    },
    removeFromCart() {
      this.$store.dispatch("cart/removeItem", { product: this.product });
    },
    updateQuantity(quantity) {
      this.$store.dispatch("cart/updateQuantity", {
        product: this.product,
        qty: quantity
      });
    },
    async getQuantity(product) {
      if (this.isStockInfoLoading) return; // stock info is already loading
      this.isStockInfoLoading = true;
      try {
        const validProduct = product || this.product;
        const res = await this.$store.dispatch("stock/check", {
          product: validProduct,
          qty: this.productQty
        });
        return res.qty;
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    handleQuantityError(error) {
      this.quantityError = error;
    },
    async changeEditModeFilter(filter) {
      const editedProduct = this.getEditedProduct(filter);
      const maxQuantity = await this.getQuantity(editedProduct);
      if (!maxQuantity) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t(
            "The product is out of stock and cannot be added to the cart!"
          ),
          action1: { label: this.$t("OK") }
        });
      } else if (maxQuantity < this.productQty) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t(
            "Only {maxQuantity} products of this type are available!",
            { maxQuantity }
          ),
          action1: { label: this.$t("OK") }
        });
      } else {
        this.maxQuantity = maxQuantity;
        this.editModeSetFilters(filter);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
.blend {
  flex: 0 0 150px;
}

.image {
  mix-blend-mode: multiply;
  vertical-align: top;
  width: 150px;
  @media (max-width: 767px) {
    width: 100px;
  }
}

.details {
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
}

.name {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.options,
.sku {
  @media (max-width: 767px) {
    font-size: 10px;
  }
}

.qty {
  padding-right: 30px;

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

.actions {
  margin: 0 -5px;
}

.prices {
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 0;
    font-size: 12px;
  }
}

.price-special {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.price-original {
  text-decoration: line-through;
}

input {
  width: 30px;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.flex-wrap {
  flex-wrap: wrap;
}

.edit-mode {
  border-bottom: 1px solid color(white-smoke);
}

.filters {
  flex: 1 1 200px;
}

.update-button {
  font-size: 14px;
  min-width: 150px;
  width: 150px;
  padding: 10px;
}
</style>

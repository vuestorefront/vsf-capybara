<template>
  <transition name="fade" mode="out-in">
    <div v-if="totalItems" key="my-cart" class="my-cart">
      <h3 class="my-cart__total-items">
        {{ $t("Total items") }}: {{ totalItems }}
      </h3>
      <transition-group name="fade" tag="div">
        <SfCollectedProduct
          v-for="product in productsInCart"
          :key="product.id"
          v-model="product.qty"
          :image="getThumbnailForProductExtend(product)"
          :title="product.name"
          :regular-price="product.original_price_incl_tax | price"
          :special-price="product.price_incl_tax | price"
          class="collected-product"
          @click:remove="removeHandler(product)"
        >
          <template #configuration>
            <div class="collected-product__properties">
              <SfProperty
                v-for="(property, key) in product.configuration"
                :key="key"
                :name="property.name"
                :value="property.value"
              />
            </div>
          </template>
          <template #actions>
            <div class="collected-product__actions">
              <SfButton class="sf-button--text product__action">
                Save for later
              </SfButton>
              <SfButton class="sf-button--text product__action">
                Add to compare
              </SfButton>
            </div>
          </template>
        </SfCollectedProduct>
      </transition-group>
    </div>
    <div v-else key="empty-cart" class="empty-cart">
      <div class="empty-cart__banner">
        <img
          src="@storefront-ui/shared/icons/empty_cart.svg"
          alt=""
          class="empty-cart__icon"
        />
        <h3 class="empty-cart__label">{{ $t("Your bag is empty") }}</h3>
        <p class="empty-cart__description">
          {{
            $t(
              "Looks like you haven’t added any items to the bag yet. Start shopping to fill it in."
            )
          }}
        </p>
      </div>
      <SfButton
        class="sf-button--full-width color-secondary"
        @click.native="startShopping"
      >
        {{ $t("Start shopping") }}
      </SfButton>
    </div>
    <div class="microcart cl-accent relative">
      <transition name="fade">
        <div v-if="isEditMode" class="overlay" @click="closeEditMode" />
      </transition>
      <div class="row bg-cl-primary px40 actions">
        <div class="col-xs end-xs">
          <button
            type="button"
            class="p0 brdr-none bg-cl-transparent close"
            data-testid="closeMicrocart"
            @click="closeMicrocartExtend"
          >
            <i class="material-icons py20 cl-accent">
              close
            </i>
          </button>
        </div>
      </div>
      <div class="row middle-xs bg-cl-primary top-sm px40 actions">
        <div class="col-xs-12 col-sm">
          <h2 v-if="productsInCart.length" class="cl-accent mt35 mb35">
            {{ $t("Shopping cart") }}
          </h2>
        </div>
        <div class="col-xs-12 col-sm mt35 mb35 mt0 end-sm clearcart-col">
          <clear-cart-button
            v-if="productsInCart.length"
            @click.native="clearCart"
          />
        </div>
      </div>
      <ul
        v-if="productsInCart.length"
        class="bg-cl-primary m0 px40 pb40 products"
      >
        <product
          v-for="product in productsInCart"
          :key="product.checksum || product.sku"
          :product="product"
        />
      </ul>
      <div v-if="productsInCart.length" class="summary px40 cl-accent serif">
        <h3 class="m0 pt40 mb30 weight-400 summary-heading">
          {{ $t("Shopping summary") }}
        </h3>
        <div
          v-for="(segment, index) in notGrandTotals"
          :key="index"
          class="row py20"
        >
          <div class="col-xs">
            {{ segment.title }}
            <button
              v-if="appliedCoupon && segment.code === 'discount'"
              type="button"
              class="p0 brdr-none bg-cl-transparent close delete-button ml10"
              @click="clearCoupon"
            >
              <i class="material-icons cl-accent">
                close
              </i>
            </button>
          </div>
          <div v-if="segment.value != null" class="col-xs align-right">
            {{ segment.value | price }}
          </div>
        </div>
        <div class="row py20">
          <div v-if="OnlineOnly && !addCouponPressed" class="col-xs-12">
            <button
              class="p0 brdr-none serif fs-medium-small cl-accent bg-cl-transparent"
              type="button"
              @click="addDiscountCoupon"
            >
              {{ $t("Add a discount code") }}
            </button>
          </div>
          <div
            v-if="OnlineOnly && addCouponPressed"
            class="col-xs-12 pt30 coupon-wrapper"
          >
            <div class="coupon-input">
              <label class="h6 cl-secondary">{{ $t("Discount code") }}</label>
              <base-input
                id="couponinput"
                v-model.trim="couponCode"
                type="text"
                :autofocus="true"
                @keyup.enter="setCoupon"
              />
            </div>
            <button-outline
              color="dark"
              :disabled="!couponCode"
              @click.native="setCoupon"
            >
              {{ $t("Add discount code") }}
            </button-outline>
          </div>
        </div>

        <div
          v-for="(segment, index) in grandTotals"
          :key="index"
          class="row pt30 pb20 weight-700 middle-xs"
        >
          <div class="col-xs h4 total-price-label">
            {{ segment.title }}
          </div>
          <div class="col-xs align-right h2 total-price-value">
            {{ segment.value | price }}
          </div>
        </div>
      </div>

      <div
        v-if="productsInCart.length && !isCheckoutMode"
        class="row py20 px40 middle-xs actions"
      >
        <div class="col-xs-12 col-sm first-sm">
          <router-link
            :to="localizedRoute('/')"
            class="no-underline cl-secondary link"
          >
            <span @click="closeMicrocartExtend">
              {{ $t("Return to shopping") }}
            </span>
          </router-link>
        </div>
        <div class="col-xs-12 first-xs col-sm-4 end-sm">
          <button-full
            :link="{ name: 'checkout' }"
            @click.native="closeMicrocartExtend"
          >
            {{ $t("Go to checkout") }}
          </button-full>
          <instant-checkout
            v-if="isInstantCheckoutRegistered"
            class="no-outline button-full block brdr-none w-100 px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white sans-serif fs-medium mt20"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import i18n from "@vue-storefront/i18n";
import { isModuleRegistered } from "@vue-storefront/core/lib/modules";
import { localizedRoute } from "@vue-storefront/core/lib/multistore";

import VueOfflineMixin from "vue-offline/mixin";
import onEscapePress from "@vue-storefront/core/mixins/onEscapePress";
import InstantCheckout from "src/modules/instant-checkout/components/InstantCheckout.vue";
import { registerModule } from "@vue-storefront/core/lib/modules";

import BaseInput from "theme/components/core/blocks/Form/BaseInput";
import ClearCartButton from "theme/components/core/blocks/Microcart/ClearCartButton";
import ButtonFull from "theme/components/theme/ButtonFull";
import ButtonOutline from "theme/components/theme/ButtonOutline";
import Product from "theme/components/core/blocks/Microcart/Product";
import EditMode from "./EditMode";
import { getThumbnailForProduct } from "@vue-storefront/core/modules/cart/helpers";
import { InstantCheckoutModule } from "src/modules/instant-checkout";
import { SfButton, SfCollectedProduct, SfProperty } from "@storefront-ui/vue";

export default {
  components: {
    Product,
    ClearCartButton,
    ButtonFull,
    ButtonOutline,
    BaseInput,
    InstantCheckout,
    SfButton,
    SfCollectedProduct,
    SfProperty
  },
  mixins: [VueOfflineMixin, EditMode, onEscapePress],
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data() {
    return {
      addCouponPressed: false,
      couponCode: "",
      componentLoaded: false,
      isInstantCheckoutRegistered: isModuleRegistered("InstantCheckoutModule")
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      appliedCoupon: "cart/getCoupon",
      totals: "cart/getTotals",
      isOpen: "cart/getIsMicroCartOpen"
    }),
    notGrandTotals() {
      return this.totals.filter(total => total.code !== "grand_total");
    },
    grandTotals() {
      return this.totals.filter(total => total.code === "grand_total");
    },
    totalItems() {
      return this.productsInCart.length;
    }
  },
  beforeCreate() {
    registerModule(InstantCheckoutModule);
  },
  mounted() {
    this.$nextTick(() => {
      this.componentLoaded = true;
    });
  },
  methods: {
    ...mapActions({
      applyCoupon: "cart/applyCoupon"
    }),
    addDiscountCoupon() {
      this.addCouponPressed = true;
    },
    clearCoupon() {
      this.$store.dispatch("cart/removeCoupon");
      this.addCouponPressed = false;
    },
    toggleMicrocart() {
      this.$store.dispatch("ui/toggleMicrocart");
    },
    async setCoupon() {
      const couponApplied = await this.applyCoupon(this.couponCode);
      this.addCouponPressed = false;
      this.couponCode = "";
      if (!couponApplied) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "warning",
          message: i18n.t(
            "You've entered an incorrect coupon code. Please try again."
          ),
          action1: { label: i18n.t("OK") }
        });
      }
    },
    closeMicrocartExtend() {
      this.toggleMicrocart();
      this.$store.commit("ui/setSidebar", false);
      this.addCouponPressed = false;
    },
    onEscapePress() {
      this.toggleMicrocart();
    },
    clearCart() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: i18n.t(
          "Are you sure you would like to remove all the items from the shopping cart?"
        ),
        action1: { label: i18n.t("Cancel"), action: "close" },
        action2: {
          label: i18n.t("OK"),
          action: async () => {
            await this.$store.dispatch("cart/clear", {
              recreateAndSyncCart: false
            }); // just clear the items without sync
            await this.$store.dispatch("cart/sync", { forceClientState: true });
          }
        },
        hasNoTimeout: true
      });
    },
    startShopping() {
      this.$router.push(localizedRoute("/"));
      this.closeMicrocartExtend();
    },
    getThumbnailForProductExtend(product) {
      return getThumbnailForProduct(product);
    },
    removeHandler(product) {
      this.$store.dispatch("cart/removeItem", { product: product });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
#cart {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font-family: $body-font-family-secondary;
    font-size: $font-size-big-mobile;
    font-weight: $body-font-weight-secondary;
    @include for-desktop {
      font-size: $font-size-big-desktop;
    }
  }
  &__total-price {
    margin-bottom: $spacer-big;
  }
}
.collected-product-list {
  flex: 1;
  margin: $spacer-big -#{$spacer-big};
}
.collected-product {
  margin: $spacer-big 0;
  &__properties {
    margin-top: $spacer-big;
  }
  &__actions {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
    @at-root.collected-product:hover & {
      @include for-desktop {
        opacity: 1;
      }
    }
  }
}
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__icon {
    width: 18.125rem;
    height: 12.3125rem;
    margin-left: 60%;
    @include for-desktop {
      margin-left: 50%;
    }
  }
  &__label,
  &__description {
    line-height: 1.6;
    text-align: center;
  }
  &__label {
    margin-top: $spacer-extra-big;
    font-size: $font-size-big-desktop;
  }
  &__description {
    margin-top: $spacer-big;
  }
}
</style>

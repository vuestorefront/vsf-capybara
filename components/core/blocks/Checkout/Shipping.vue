<template>
  <div class="pt20">
    <div class="row pl20">
      <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{
            'bg-cl-th-accent': isActive || isFilled,
            'bg-cl-tertiary': !isFilled && !isActive
          }"
        >
          2
        </div>
      </div>
      <div class="col-xs-11 col-sm-9 col-md-11">
        <div class="row mb15">
          <div
            class="col-xs-12 col-md-7"
            :class="{ 'cl-bg-tertiary': !isFilled && !isActive }"
          >
            <h3 class="m0 mb5">
              {{ $t("Shipping") }}
            </h3>
          </div>
          <div class="col-xs-12 col-md-5 pr30">
            <div v-if="isFilled && !isActive" class="lh30 flex end-lg">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5">
                  {{ $t("Edit shipping") }}
                </span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isActive" class="row pl20">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-11 col-sm-9 col-md-10">
        <div class="row">
          <base-checkbox
            v-if="currentUser && hasShippingDetails()"
            id="shipToMyAddressCheckbox"
            v-model="shipToMyAddress"
            class="col-xs-12 mb10"
          >
            {{ $t("Ship to my default address") }}
          </base-checkbox>

          <base-input
            v-model.trim="shipping.firstName"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="first-name"
            :placeholder="$t('First name *')"
            autocomplete="given-name"
            :validations="[
              {
                condition:
                  $v.shipping.firstName.$error &&
                  !$v.shipping.firstName.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.shipping.firstName.minLength,
                text: $t('Name must have at least 2 letters.')
              }
            ]"
            @blur="$v.shipping.firstName.$touch()"
          />

          <base-input
            v-model.trim="shipping.lastName"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="last-name"
            :placeholder="$t('Last name *')"
            autocomplete="family-name"
            :validations="[
              {
                condition:
                  $v.shipping.lastName.$error && !$v.shipping.lastName.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.shipping.lastName.$touch()"
          />

          <base-input
            v-model.trim="shipping.streetAddress"
            class="col-xs-12 mb10"
            type="text"
            name="street-address"
            :placeholder="$t('Street name *')"
            autocomplete="address-line1"
            :validations="[
              {
                condition:
                  $v.shipping.streetAddress.$error &&
                  !$v.shipping.streetAddress.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.shipping.streetAddress.$touch()"
          />

          <base-input
            v-model.trim="shipping.apartmentNumber"
            class="col-xs-12 mb10"
            type="text"
            name="apartment-number"
            :placeholder="$t('House/Apartment number *')"
            autocomplete="address-line2"
            :validations="[
              {
                condition:
                  $v.shipping.apartmentNumber.$error &&
                  !$v.shipping.apartmentNumber.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.shipping.apartmentNumber.$touch()"
          />

          <base-input
            v-model.trim="shipping.city"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="city"
            :placeholder="$t('City *')"
            autocomplete="address-level2"
            :validations="[
              {
                condition:
                  $v.shipping.city.$error && !$v.shipping.city.required,
                text: $t('Field is required')
              },
              {
                condition: $v.shipping.city.$error && $v.shipping.city.required,
                text: $t('Please provide valid city name')
              }
            ]"
            @blur="$v.shipping.city.$touch()"
          />

          <base-input
            v-model.trim="shipping.state"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="state"
            :placeholder="$t('State / Province')"
            autocomplete="address-level1"
          />

          <base-input
            v-model.trim="shipping.zipCode"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="zip-code"
            :placeholder="$t('Zip-code *')"
            autocomplete="postal-code"
            :validations="[
              {
                condition:
                  $v.shipping.zipCode.$error && !$v.shipping.zipCode.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.shipping.zipCode.minLength,
                text: $t('Name must have at least 3 letters.')
              }
            ]"
            @blur="$v.shipping.zipCode.$touch()"
          />

          <base-select
            v-model="shipping.country"
            class="col-xs-12 col-sm-6 mb10"
            name="countries"
            :options="countryOptions"
            :selected="shipping.country"
            :placeholder="$t('Country *')"
            :validations="[
              {
                condition:
                  $v.shipping.country.$error && !$v.shipping.country.required,
                text: $t('Field is required')
              }
            ]"
            autocomplete="country-name"
            @blur="$v.shipping.country.$touch()"
            @change.native="
              $v.shipping.country.$touch();
              changeCountry();
            "
          />

          <base-input
            v-model.trim="shipping.phoneNumber"
            class="col-xs-12 mb10"
            type="text"
            name="phone-number"
            :placeholder="$t('Phone Number')"
            autocomplete="tel"
          />

          <h4 class="col-xs-12">
            {{ $t("Shipping method") }}
          </h4>
          <div
            v-for="(method, index) in shippingMethods"
            :key="index"
            class="col-md-6"
          >
            <label class="radioStyled">
              {{ method.method_title }} | {{ method.amount | price }}
              <input
                v-model="shipping.shippingMethod"
                type="radio"
                :value="method.method_code"
                name="shipping-method"
                @change="
                  $v.shipping.shippingMethod.$touch();
                  changeShippingMethod();
                "
              />
              <span class="checkmark" />
            </label>
          </div>
          <span
            v-if="
              $v.shipping.shippingMethod.$error &&
                !$v.shipping.shippingMethod.required
            "
            class="validation-error"
          >
            {{ $t("Field is required") }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="isActive" class="row">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row">
          <div class="col-xs-12 col-md-8 my30 px20">
            <button-full
              data-testid="shippingSubmit"
              :disabled="$v.shipping.$invalid || shippingMethods.length <= 0"
              @click.native="sendDataToCheckout"
            >
              {{ $t("Continue to payment") }}
            </button-full>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isActive && isFilled" class="row pl20">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row fs16 mb35">
          <div class="col-xs-12 h4" data-testid="shippingAddressSummary">
            <p>{{ shipping.firstName }} {{ shipping.lastName }}</p>
            <p>{{ shipping.streetAddress }} {{ shipping.apartmentNumber }}</p>
            <p>{{ shipping.city }} {{ shipping.zipCode }}</p>
            <p>
              <span v-if="shipping.state">{{ shipping.state }}, </span>
              <span>{{ getCountryName() }}</span>
            </p>
            <div v-if="shipping.phoneNumber">
              <span class="pr15">{{ shipping.phoneNumber }}</span>
              <tooltip>{{
                $t("Phone number may be needed by carrier")
              }}</tooltip>
            </div>
            <div class="col-xs-12">
              <h4>
                {{ $t("Shipping method") }}
              </h4>
            </div>
            <div class="col-md-6 mb15">
              <label class="radioStyled">
                {{ getShippingMethod().method_title }} |
                {{ getShippingMethod().amount | price }}
                <input
                  type="radio"
                  value=""
                  checked
                  disabled
                  name="chosen-shipping-method"
                />
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import {
  unicodeAlpha,
  unicodeAlphaNum
} from "@vue-storefront/core/helpers/validators";
import { Shipping } from "@vue-storefront/core/modules/checkout/components/Shipping";

import BaseCheckbox from "theme/components/core/blocks/Form/BaseCheckbox";
import BaseInput from "theme/components/core/blocks/Form/BaseInput";
import BaseSelect from "theme/components/core/blocks/Form/BaseSelect";
import ButtonFull from "theme/components/theme/ButtonFull";
import Tooltip from "theme/components/core/Tooltip";

export default {
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput,
    BaseSelect
  },
  mixins: [Shipping],
  computed: {
    countryOptions() {
      return this.countries.map(item => {
        return {
          value: item.code,
          label: item.name
        };
      });
    }
  },
  validations: {
    shipping: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required,
        unicodeAlpha
      },
      country: {
        required
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      apartmentNumber: {
        required,
        unicodeAlphaNum
      },
      shippingMethod: {
        required
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      }
    }
  }
};
</script>

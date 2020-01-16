<template>
  <div class="mb35">
    <!-- My shipping details header -->
    <div class="row mb15">
      <div class="col-xs-12 col-sm-6" :class="{ 'cl-accent': !isEdited }">
        <h3 class="m0 mb5">
          {{ $t("My shipping details") }}
        </h3>
      </div>
      <div class="col-xs-12 col-sm-6">
        <div v-if="!isEdited" class="lh30 flex end-md">
          <a href="#" class="cl-tertiary flex" @click.prevent="edit">
            <span class="pr5">
              {{ $t("Edit your shipping details") }}
            </span>
            <i class="material-icons cl-tertiary">edit</i>
          </a>
        </div>
      </div>
    </div>

    <!-- My shipping details body (edit mode) -->
    <div v-if="isEdited" class="row">
      <template>
        <base-input
          v-model.trim="shippingDetails.firstName"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="first-name"
          autocomplete="given-name"
          :placeholder="`${$t('First name')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.firstName.required &&
                $v.shippingDetails.firstName.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.shippingDetails.firstName.minLength,
              text: $t('Name must have at least 2 letters.')
            }
          ]"
          @input="$v.shippingDetails.firstName.$touch()"
        />

        <base-input
          v-model.trim="shippingDetails.lastName"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="last-name"
          autocomplete="family-name"
          :placeholder="`${$t('Last name')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.lastName.required &&
                $v.shippingDetails.lastName.$error,
              text: $t('Field is required')
            }
          ]"
          @input="$v.shippingDetails.lastName.$touch()"
        />

        <base-checkbox
          v-if="hasBillingAddress()"
          id="addCompanyFilled"
          v-model="useCompanyAddress"
          class="col-xs-12 mb10"
        >
          {{ $t("Use my company's address details") }}
        </base-checkbox>

        <base-input
          v-model.trim="shippingDetails.street"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="street-address"
          autocomplete="address-line1"
          :placeholder="`${$t('Street name')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.street.required &&
                $v.shippingDetails.street.$error,
              text: $t('Field is required')
            }
          ]"
          @input="$v.shippingDetails.street.$touch()"
        />

        <base-input
          v-model.trim="shippingDetails.house"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="apartment-number"
          autocomplete="address-line2"
          :placeholder="`${$t('House/Apartment number')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.house.required &&
                $v.shippingDetails.house.$error,
              text: $t('Field is required')
            }
          ]"
          @input="$v.shippingDetails.house.$touch()"
        />

        <base-input
          v-model.trim="shippingDetails.city"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="city"
          autocomplete="address-level2"
          :placeholder="`${$t('City')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.city.required &&
                $v.shippingDetails.city.$error,
              text: $t('Field is required')
            },
            {
              condition:
                $v.shippingDetails.city.$error &&
                $v.shippingDetails.city.required,
              text: $t('Please provide valid city name')
            }
          ]"
          @input="$v.shippingDetails.city.$touch()"
        />

        <base-input
          v-model.trim="shippingDetails.region"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="state"
          autocomplete="address-level1"
          :placeholder="$t('State / Province')"
        />

        <base-input
          v-model.trim="shippingDetails.postcode"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="zip-code"
          autocomplete="postal-code"
          :placeholder="`${$t('Zip-code')} *`"
          :validations="[
            {
              condition:
                !$v.shippingDetails.postcode.required &&
                $v.shippingDetails.postcode.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.shippingDetails.postcode.minLength,
              text: $t('Zip-code must have at least 3 letters.')
            }
          ]"
          @input="$v.shippingDetails.postcode.$touch()"
        />

        <base-select
          v-model="shippingDetails.country"
          class="col-xs-12 col-sm-6 mb10"
          name="countries"
          :options="countryOptions"
          :selected="shippingDetails.country"
          :placeholder="$t('Country *')"
          :validations="[
            {
              condition:
                $v.shippingDetails.country.$error &&
                !$v.shippingDetails.country.required,
              text: $t('Field is required')
            }
          ]"
          autocomplete="country-name"
          @blur="$v.shippingDetails.country.$touch()"
          @change="$v.shippingDetails.country.$touch()"
        />

        <base-input
          v-model.trim="shippingDetails.phone"
          class="col-xs-12 col-sm-6 mb10"
          type="text"
          name="phone-number"
          autocomplete="tel"
          :placeholder="$t('Phone Number')"
        />

        <div class="hidden-xs col-sm-6 mb25" />

        <div class="col-xs-12 col-sm-6">
          <button-full :disabled="$v.$invalid" @click.native="updateDetails">
            {{ $t("Update my shipping details") }}
          </button-full>
        </div>
        <div class="col-xs-12 col-sm-6 flex middle-xs py10">
          <a href="#" class="h4 cl-accent" @click="exitSection">
            {{ $t("Cancel") }}
          </a>
        </div>
      </template>
    </div>

    <!-- My shipping details summary -->
    <div v-else class="row fs16 mb35">
      <div class="col-xs-12 h4">
        <p>{{ shippingDetails.firstName }} {{ shippingDetails.lastName }}</p>
        <base-checkbox
          v-if="useCompanyAddress"
          id="useCompanyAddressFilled"
          v-model="useCompanyAddress"
          class="col-xs-12 mb25"
          disabled
        >
          {{ $t("Use my company's address details") }}
        </base-checkbox>
        <p class="mb25">
          {{ shippingDetails.company }}
        </p>
        <p class="mb25">
          {{ shippingDetails.street }}
          <span v-if="shippingDetails.house"> {{ shippingDetails.house }}</span>
        </p>
        <p class="mb25">
          {{ shippingDetails.city }} {{ shippingDetails.postcode }}
        </p>
        <p class="mb25">
          <span v-if="shippingDetails.region">{{ shippingDetails.region }},
          </span>
          {{ getCountryName() }}
        </p>
        <div class="mb25">
          {{ shippingDetails.phone }}
          <tooltip v-if="shippingDetails.phone">
            {{ $t("Phone number may be needed by carrier") }}
          </tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import MyShippingDetails from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyShippingDetails';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';

import ButtonFull from 'theme/components/theme/ButtonFull';
import Tooltip from 'theme/components/core/Tooltip';
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect';

export default {
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput,
    BaseSelect
  },
  mixins: [MyShippingDetails],
  computed: {
    countryOptions () {
      return this.countries.map(item => {
        return {
          value: item.code,
          label: item.name
        };
      });
    }
  },
  validations: {
    shippingDetails: {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required
      },
      country: {
        required
      },
      street: {
        required,
        unicodeAlphaNum
      },
      house: {
        required,
        unicodeAlphaNum
      },
      postcode: {
        required,
        minLength: minLength(3)
      },
      city: {
        required,
        unicodeAlpha
      }
    }
  }
};
</script>

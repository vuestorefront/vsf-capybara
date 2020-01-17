<template>
  <div class="payment pt20">
    <div class="row pl20">
      <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{
            'bg-cl-th-accent': isActive || isFilled,
            'bg-cl-tertiary': !isFilled && !isActive
          }"
        >
          {{ isVirtualCart ? 2 : 3 }}
        </div>
      </div>
      <div class="col-xs-11 col-sm-9 col-md-11">
        <div class="row mb15">
          <div
            class="col-xs-12 col-md-7"
            :class="{ 'cl-bg-tertiary': !isFilled && !isActive }"
          >
            <h3 class="m0 mb5">
              {{ $t("Payment") }}
            </h3>
          </div>
          <div class="col-xs-12 col-md-5 pr30">
            <div v-if="isFilled && !isActive" class="lh30 flex end-lg">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5">
                  {{ $t("Edit payment") }}
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
        <div v-if="isActive" class="row">
          <base-checkbox
            v-if="!isVirtualCart"
            id="sendToShippingAddressCheckbox"
            v-model="sendToShippingAddress"
            class="col-xs-12 mb15"
          >
            {{ $t("Copy address data from shipping") }}
          </base-checkbox>

          <base-checkbox
            v-if="hasBillingData()"
            id="sendToBillingAddressCheckbox"
            v-model="sendToBillingAddress"
            class="col-xs-12 mb15"
          >
            {{ $t("Use my billing data") }}
          </base-checkbox>

          <base-input
            v-model.trim="payment.firstName"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="first-name"
            :placeholder="$t('First name *')"
            autocomplete="given-name"
            :validations="[
              {
                condition:
                  $v.payment.firstName.$error && !$v.payment.firstName.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.payment.firstName.minLength,
                text: $t('Name must have at least 2 letters.')
              }
            ]"
            @blur="$v.payment.firstName.$touch()"
          />

          <base-input
            v-model.trim="payment.lastName"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="last-name"
            :placeholder="$t('Last name *')"
            autocomplete="family-name"
            :validations="[
              {
                condition:
                  $v.payment.lastName.$error && !$v.payment.lastName.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.payment.lastName.$touch()"
          />

          <base-input
            v-model.trim="payment.streetAddress"
            class="col-xs-12 mb10"
            type="text"
            name="street-address"
            :placeholder="$t('Street name *')"
            autocomplete="address-line1"
            :validations="[
              {
                condition:
                  $v.payment.streetAddress.$error &&
                  !$v.payment.streetAddress.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.payment.streetAddress.$touch()"
          />

          <base-input
            v-model.trim="payment.apartmentNumber"
            class="col-xs-12 mb10"
            type="text"
            name="apartment-number"
            :placeholder="$t('House/Apartment number *')"
            autocomplete="address-line2"
            :validations="[
              {
                condition:
                  $v.payment.apartmentNumber.$error &&
                  !$v.payment.apartmentNumber.required,
                text: $t('Field is required')
              }
            ]"
            @blur="$v.payment.apartmentNumber.$touch()"
          />

          <base-input
            v-model.trim="payment.city"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="city"
            :placeholder="$t('City *')"
            autocomplete="address-level2"
            :validations="[
              {
                condition: $v.payment.city.$error && !$v.payment.city.required,
                text: $t('Field is required')
              },
              {
                condition: $v.payment.city.$error && $v.payment.city.required,
                text: $t('Please provide valid city name')
              }
            ]"
            @blur="$v.payment.city.$touch()"
          />

          <base-input
            v-model.trim="payment.state"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="state"
            :placeholder="$t('State / Province')"
            autocomplete="address-level1"
          />

          <base-input
            v-model.trim="payment.zipCode"
            class="col-xs-12 col-sm-6 mb10"
            type="text"
            name="zip-code"
            :placeholder="$t('Zip-code *')"
            autocomplete="postal-code"
            :validations="[
              {
                condition:
                  $v.payment.zipCode.$error && !$v.payment.zipCode.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.payment.zipCode.minLength,
                text: $t('Zip-code must have at least 3 letters.')
              }
            ]"
            @blur="$v.payment.zipCode.$touch()"
          />

          <base-select
            v-model="payment.country"
            class="col-xs-12 col-sm-6 mb10"
            name="countries"
            :options="countryOptions"
            :selected="payment.country"
            :placeholder="$t('Country *')"
            :validations="[
              {
                condition:
                  $v.payment.country.$error && !$v.payment.country.required,
                text: $t('Field is required')
              }
            ]"
            autocomplete="country-name"
            @blur="$v.payment.country.$touch()"
            @change="
              $v.payment.country.$touch();
              changeCountry();
            "
          />

          <base-input
            v-model.trim="payment.phoneNumber"
            class="col-xs-12 mb10"
            type="text"
            name="phone-number"
            :placeholder="$t('Phone Number')"
            autocomplete="tel"
          />

          <base-checkbox
            id="generateInvoiceCheckbox"
            v-model="generateInvoice"
            class="col-xs-12 mb15"
          >
            {{ $t("I want to generate an invoice for the company") }}
          </base-checkbox>

          <template v-if="generateInvoice">
            <base-input
              v-model.trim="payment.company"
              class="col-xs-12 mb10"
              type="text"
              name="company-name"
              :placeholder="$t('Company name *')"
              autocomplete="organization"
              :validations="[
                {
                  condition:
                    $v.payment.company.$error && !$v.payment.company.required,
                  text: $t('Field is required')
                }
              ]"
              @blur="$v.payment.company.$touch()"
            />

            <base-input
              v-model.trim="payment.taxId"
              class="col-xs-12 mb10"
              type="text"
              name="tax-id"
              :placeholder="$t('Tax identification number *')"
              autocomplete="tax-id"
              :validations="[
                {
                  condition:
                    $v.payment.taxId.$error && !$v.payment.taxId.required,
                  text: $t('Field is required')
                },
                {
                  condition: !$v.payment.taxId.minLength,
                  text: $t(
                    'Tax identification number must have at least 3 letters.'
                  )
                }
              ]"
              @blur="$v.payment.taxId.$touch()"
            />

            <div class="col-xs-12 mb25">
              <label class="fs16">
                {{ $t("We will send you the invoice to given e-mail address") }}
              </label>
            </div>
          </template>

          <div class="col-xs-12">
            <h4>
              {{ $t("Payment method") }}
            </h4>
          </div>
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            class="col-md-6"
          >
            <label class="radioStyled">
              {{ method.title ? method.title : method.name }}
              <input
                v-model="payment.paymentMethod"
                type="radio"
                :value="method.code"
                name="payment-method"
                @change="
                  $v.payment.paymentMethod.$touch();
                  changePaymentMethod();
                "
              >
              <span class="checkmark" />
            </label>
          </div>
          <span
            v-if="!$v.payment.paymentMethod.required"
            class="validation-error"
          >{{ $t("Field is required") }}</span>
        </div>
      </div>
    </div>
    <div v-if="isActive" class="row">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row">
          <div class="col-xs-12 col-md-8 px20 my30">
            <button-full
              data-testid="paymentSubmit"
              :disabled="$v.payment.$invalid"
              @click.native="sendDataToCheckout"
            >
              {{ $t("Go review the order") }}
            </button-full>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isActive && isFilled" class="row pl20">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row fs16 mb35">
          <div class="col-xs-12 h4">
            <p>{{ payment.firstName }} {{ payment.lastName }}</p>
            <p>{{ payment.streetAddress }} {{ payment.apartmentNumber }}</p>
            <p>{{ payment.city }} {{ payment.zipCode }}</p>
            <p>
              <span v-if="payment.state">{{ payment.state }}, </span>
              <span>{{ getCountryName() }}</span>
            </p>
            <div v-if="payment.phoneNumber">
              <span class="pr15">{{ payment.phoneNumber }}</span>
              <tooltip>
                {{
                  $t("Phone number may be needed by carrier")
                }}
              </tooltip>
            </div>
            <p v-if="generateInvoice">
              {{ payment.company }} {{ payment.taxId }}
            </p>
            <div class="col-xs-12">
              <h4>{{ $t("Payment method") }}</h4>
            </div>
            <div class="col-md-6 mb15">
              <label class="radioStyled">
                {{ getPaymentMethod().title }}
                <input
                  type="radio"
                  value=""
                  checked
                  disabled
                  name="chosen-payment-method"
                >
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
import { required, minLength } from 'vuelidate/lib/validators';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment';

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect';
import ButtonFull from 'theme/components/theme/ButtonFull';
import Tooltip from 'theme/components/core/Tooltip';

export default {
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    ButtonFull,
    Tooltip
  },
  mixins: [Payment],
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
  validations () {
    if (!this.generateInvoice) {
      return {
        payment: {
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
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      };
    } else {
      return {
        payment: {
          firstName: {
            required,
            minLength: minLength(2),
            unicodeAlpha
          },
          lastName: {
            required,
            unicodeAlpha
          },
          company: {
            required,
            unicodeAlphaNum
          },
          taxId: {
            required,
            minLength: minLength(3)
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
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      };
    }
  }
};
</script>

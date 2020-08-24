<template>
  <transition name="fade">
    <div class="o-my-account-shipping-details">
      <SfTabs
        v-if="editAddress"
        key="edit-address"
        :open-tab="1"
        class="tab-orphan"
      >
        <SfTab :title="$t('Change the address')">
          <p class="message">
            {{ $t('Keep your addresses and contact details updated.') }}
          </p>
          <div class="form">
            <SfInput
              v-model="editedAddress.firstname"
              name="firstname"
              :label="$t('First Name')"
              required
              :valid="!$v.editedAddress.firstname.$error"
              :error-message="
                !$v.editedAddress.firstname.required
                  ? $t('Field is required.')
                  : $t('Name must have at least 2 letters.')
              "
              class="form__element form__element--half"
            />
            <SfInput
              v-model="editedAddress.lastname"
              name="lastname"
              :label="$t('Last Name')"
              required
              :valid="!$v.editedAddress.lastname.$error"
              :error-message="$t('Field is required.')"
              class="form__element form__element--half form__element--half-even"
            />
            <SfInput
              v-model="editedAddress.streetName"
              name="streetName"
              :label="$t('Street Name')"
              required
              :valid="!$v.editedAddress.streetName.$error"
              :error-message="$t('Field is required.')"
              class="form__element"
            />
            <SfInput
              v-model="editedAddress.apartment"
              name="apartment"
              :label="$t('House/Apartment number')"
              required
              :valid="!$v.editedAddress.apartment.$error"
              :error-message="$t('Field is required.')"
              class="form__element"
            />
            <SfInput
              v-model="editedAddress.city"
              name="city"
              :label="$t('City')"
              required
              :valid="!$v.editedAddress.city.$error"
              :error-message="$t('Field is required.')"
              class="form__element form__element--half"
            />
            <SfInput
              v-model="editedAddress.state"
              name="state"
              :label="$t('State/Province')"
              class="form__element form__element--half form__element--half-even"
            />
            <SfInput
              v-model="editedAddress.postcode"
              name="postcode"
              :label="$t('Zip-code')"
              required
              :valid="!$v.editedAddress.postcode.$error"
              :error-message="
                !$v.editedAddress.postcode.required
                  ? $t('Field is required.')
                  : $t('Zip-code must have at least 3 letters.')
              "
              class="form__element form__element--half"
            />
            <SfSelect
              v-model="editedAddress.country"
              name="country"
              :label="$t('Country')"
              required
              :valid="!$v.editedAddress.country.$error"
              :error-message="$t('Field is required.')"
              class="sf-select--underlined form__select form__element form__element--half form__select form__element--half-even"
            >
              <SfSelectOption
                v-for="country in countries"
                :key="country.code"
                :value="country.name"
              >
                {{ country.name }}
              </SfSelectOption>
            </SfSelect>
            <SfInput
              v-model="editedAddress.telephone"
              name="telephone"
              :label="$t('Phone number')"
              class="form__element"
            />
            <SfButton class="action-button" @click="updateAddress">
              {{ $t('Update the address') }}
            </SfButton>
          </div>
        </SfTab>
      </SfTabs>
      <SfTabs
        v-else
        key="address-list"
        :open-tab="1"
        class="tab-orphan"
      >
        <SfTab :title="$t('Shipping details')">
          <p class="message">
            {{ $t('Manage all the shipping addresses you want (work place, home address ...) This way you won\'t have to enter the shipping address manually with each order.') }}
          </p>
          <transition-group tag="div" name="fade" class="shipping-list">
            <div
              v-for="(address, key) in addresses"
              :key="address.street.join(' ')"
              class="shipping"
            >
              <div class="shipping__content">
                <p class="shipping__address">
                  <span class="shipping__client-name">{{ address.firstname }} {{ address.lastname }}</span><br>
                  {{ address.street.join(' ') }}<br>
                  {{ address.postcode }}
                  {{ address.city }},<br>{{ getCountryById(address.country_id) }}
                </p>
                <p class="shipping__address">
                  {{ address.telephone }}
                </p>
              </div>
              <div class="shipping__actions">
                <SfIcon
                  icon="cross"
                  color="gray"
                  size="14px"
                  role="button"
                  class="mobile-only"
                  @click="deleteAddress(key)"
                />
                <SfButton @click="changeAddress(key)">
                  {{ $t('Change') }}
                </SfButton>
                <SfButton
                  class="shipping__button-delete desktop-only"
                  @click="deleteAddress(key)"
                >
                  {{ $t('Delete') }}
                </SfButton>
              </div>
            </div>
          </transition-group>
          <SfButton class="action-button" @click="changeAddress(-1)">
            {{ $t('Add new address') }}
          </SfButton>
        </SfTab>
      </SfTabs>
    </div>
  </transition>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators';
import { SfTabs, SfInput, SfButton, SfSelect, SfIcon } from '@storefront-ui/vue';
const Countries = require('@vue-storefront/i18n/resource/countries.json')

export default {
  name: 'OMyAccountShippingDetails',
  components: { SfTabs, SfInput, SfButton, SfSelect, SfIcon },
  data () {
    return {
      editAddress: false,
      editedAddressIndex: -1,
      editedAddress: {
        firstname: '',
        lastname: '',
        streetName: '',
        apartment: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        telephone: ''
      },
      countries: Countries
    }
  },
  computed: {
    addresses () {
      return this.$store.state.user.current.addresses
    }
  },
  methods: {
    changeAddress (index) {
      this.clearFields()
      this.$v.$reset();
      if (index > -1) {
        this.editedAddress.firstname = this.addresses[index].firstname
        this.editedAddress.lastname = this.addresses[index].lastname
        this.editedAddress.streetName = this.addresses[index].street[0]
        this.editedAddress.apartment = this.addresses[index].street[1]
        this.editedAddress.city = this.addresses[index].city
        this.editedAddress.state = this.addresses[index].region.region
        this.editedAddress.postcode = this.addresses[index].postcode
        this.editedAddress.country = this.getCountryById(this.addresses[index].country_id)
        this.editedAddress.telephone = this.addresses[index].telephone
      }
      this.editedAddressIndex = index
      this.editAddress = true;
    },
    clearFields () {
      this.editedAddress.firstname = ''
      this.editedAddress.lastname = ''
      this.editedAddress.streetName = ''
      this.editedAddress.apartment = ''
      this.editedAddress.city = ''
      this.editedAddress.state = ''
      this.editedAddress.postcode = ''
      this.editedAddress.country = ''
      this.editedAddress.telephone = ''
    },
    getCountryById (id) {
      let countryObject = this.countries.filter(country => country.code === id)
      return countryObject.length > 0 ? countryObject[0].name : id
    },
    updateAddress () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }

      let userDataToUpdate = this.$store.state.user.current;
      let addressToUpdate = {
        firstname: this.editedAddress.firstname,
        lastname: this.editedAddress.lastname,
        street: [this.editedAddress.streetName, this.editedAddress.apartment],
        city: this.editedAddress.city,
        ...(this.editedAddress.state ? { region: { region: this.editedAddress.state } } : {}),
        country_id: this.countries.find(country => country.name === this.editedAddress.country).code || this.editedAddress.country,
        postcode: this.editedAddress.postcode,
        ...(this.editedAddress.telephone ? { telephone: this.editedAddress.telephone } : {})
      }

      if (this.editedAddressIndex > -1) {
        userDataToUpdate.addresses[this.editedAddressIndex] = Object.assign({}, userDataToUpdate.addresses[this.editedAddressIndex], addressToUpdate)
      } else {
        userDataToUpdate.addresses.push(addressToUpdate)
      }

      this.$store.dispatch('user/update', { customer: userDataToUpdate }).then(() => {
        this.clearFields();
        this.editedAddressIndex = -1;
        this.editAddress = false;
      })
    },
    deleteAddress (index) {
      let userDataToUpdate = this.$store.state.user.current;
      userDataToUpdate.addresses.splice(index, 1)
      this.$store.dispatch('user/update', { customer: userDataToUpdate })
    }
  },
  validations: {
    editedAddress: {
      firstname: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastname: {
        required
      },
      streetName: {
        required,
        unicodeAlphaNum
      },
      apartment: {
        required,
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      },
      postcode: {
        required,
        minLength: minLength(3)
      },
      country: {
        required
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.shipping-list {
  margin: 0 0 var(--spacer-base) 0;
}
.shipping {
  display: flex;
  padding: var(--spacer-base) 0;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &:last-child {
    border-width: 1px 0 1px 0;
  }
  &__content {
    flex: 1;
    color: var(--c-text);
  }
  &__actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    @include for-desktop {
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
  &__button-delete {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    &:hover {
      --button-background: var(--_c-light-primary);
    }
    @include for-desktop {
      margin: 0 0 0 var(--spacer-base);
    }
  }
  &__address {
    margin: 0 0 var(--spacer-base) 0;
    &:last-child {
      margin: 0;
    }
  }
}
.tab-orphan {
  @include for-mobile {
    --tabs-content-border-width: 0;
    --tabs-title-display: none;
    --tabs-content-padding: 0;
  }
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-lg);
        }
      }
    }
  }
  &__select {
    padding-bottom: calc(var(--font-xs) * 1.2);
  }
  --select-dropdown-position: relative;
}
.message {
  margin: 0 0 var(--spacer-base) 0;
}
.action-button {
  --button-width: 100%;
  @include for-desktop {
    --button-width: auto;
  }
}
</style>

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
              class="first-name"
              name="firstname"
              :label="$t('First Name')"
              required
              :valid="!$v.editedAddress.firstname.$error"
              :error-message="
                !$v.editedAddress.firstname.required
                  ? $t('Field is required.')
                  : $t('Name must have at least 2 letters.')
              "
            />
            <SfInput
              v-model="editedAddress.lastname"
              class="last-name"
              name="lastname"
              :label="$t('Last Name')"
              required
              :valid="!$v.editedAddress.lastname.$error"
              :error-message="$t('Field is required.')"
            />
            <SfInput
              v-model="editedAddress.streetName"
              class="street-name"
              name="streetName"
              :label="$t('Street Name')"
              required
              :valid="!$v.editedAddress.streetName.$error"
              :error-message="$t('Field is required.')"
            />
            <SfInput
              v-model="editedAddress.apartment"
              class="apartment"
              name="apartment"
              :label="$t('House/Apartment number')"
              required
              :valid="!$v.editedAddress.apartment.$error"
              :error-message="$t('Field is required.')"
            />
            <SfInput
              v-model="editedAddress.city"
              class="city"
              name="city"
              :label="$t('City')"
              required
              :valid="!$v.editedAddress.city.$error"
              :error-message="$t('Field is required.')"
            />
            <SfInput
              v-model="editedAddress.state"
              class="state"
              name="state"
              :label="$t('State/Province')"
            />
            <SfInput
              v-model="editedAddress.postcode"
              class="postcode"
              name="postcode"
              :label="$t('Zip-code')"
              required
              :valid="!$v.editedAddress.postcode.$error"
              :error-message="
                !$v.editedAddress.postcode.required
                  ? $t('Field is required.')
                  : $t('Zip-code must have at least 3 letters.')
              "
            />
            <SfSelect
              v-model="editedAddress.country"
              class="sf-select--underlined country"
              name="country"
              :label="$t('Country')"
              required
              :valid="!$v.editedAddress.country.$error"
              :error-message="$t('Field is required.')"
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
              class="telephone"
              name="telephone"
              :label="$t('Phone number')"
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

          <transition-group tag="div" name="fade" class="address-list">
            <div
              v-for="(address, key) in addresses"
              :key="address.street.join(' ')"
              class="card"
            >
              <SfButton
                @click="changeAddress(key)"
                class="sf-button--pure sf-button--full-width update"
              >
                <div class="content">
                  <p class="address">
                    {{ address.firstname }} {{ address.lastname }}<br>
                    {{ address.street.join(' ') }}<br>
                    {{ address.postcode }}
                    {{ address.city }},<br>{{ getCountryById(address.country_id) }}
                  </p>
                  <p class="address">
                    {{ address.telephone }}
                  </p>
                </div>
              </SfButton>

              <SfButton
                @click="deleteAddress(key)"
                class="sf-button--pure delete"
              >
                <SfIcon
                  icon="cross"
                  color="gray"
                  size="xxs"
                  role="button"
                  @click="deleteAddress(key)"
                />
              </SfButton>
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
import config from 'config';
import pick from 'lodash-es/pick';
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

      let userDataToUpdate = pick(JSON.parse(JSON.stringify(this.$store.state.user.current)), config.users.allowModification);
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
      let userDataToUpdate = pick(JSON.parse(JSON.stringify(this.$store.state.user.current)), config.users.allowModification);
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


.tab-orphan {
  @include for-mobile {
    --tabs-content-border-width: 0;
    --tabs-title-display: none;
    --tabs-content-padding: 0;
  }
}

// Add/Update Address

.message {
  margin: 0 0 var(--spacer-base) 0;
}

.form {
  display: grid;
  grid-gap: var(--spacer-base) var(--spacer-lg);
  align-items: start;
  --select-dropdown-position: relative;
}

@include for-desktop {
  .form {
    grid: "fn       ln"
          "sn       sn"
          "an       an"
          "city     state"
          "postcode country"
          "phone    phone";
  }

  .first-name { grid-area: fn; }

  .last-name { grid-area: ln; }

  .street-name { grid-area: sn; }

  .apartment { grid-area: an;}

  .city { grid-area: city; }

  .state { grid-area: state; }

  .postcode { grid-area: postcode; }

  .country { grid-area: country; }

  .telephone { grid-area: phone; }

  .action-button {
    width: max-content;
  }
}

::v-deep {
  .sf-select__dropdown {
    overflow-y: scroll;
  }
}

// Shipping Details

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(343px, 1fr));
  grid-gap: var(--spacer-base) var(--spacer-lg);
  margin-bottom: var(--spacer-base);
}

.card {
  position: relative;
  transition: box-shadow 150ms linear;
  padding: var(--spacer-sm);
  border: 1px solid var(--c-light);

  &:hover {
    box-shadow: 0px 4px 35px 0px var(--c-light);
  }
}

.address {
   font: var(--font-normal) var(--font-base) / 1.6 var(--font-family-primary);
   color: var(--c-link);
   margin: 0;
}

.update {
  text-align: unset;
  justify-content: unset;
 }

.delete {
  position: absolute;
  top: var(--spacer-sm);
  right: var(--spacer-sm);

  &:hover {
    .sf-icon{
      fill: var(--c-dark);
    }
  }
}

</style>

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
            {{ $T('Keep your addresses and contact details updated.') }}
          </p>
          <div class="form">
            <SfInput
              v-model="editedAddress.firstName"
              name="firstName"
              label="First Name"
              required
              class="form__element form__element--half"
            />
            <SfInput
              v-model="editedAddress.lastName"
              name="lastName"
              label="Last Name"
              required
              class="form__element form__element--half form__element--half-even"
            />
            <SfInput
              v-model="editedAddress.streetName"
              name="streetName"
              label="Street Name"
              required
              class="form__element"
            />
            <SfInput
              v-model="editedAddress.apartment"
              name="apartment"
              label="House/Apartment number"
              required
              class="form__element"
            />
            <SfInput
              v-model="editedAddress.city"
              name="city"
              label="City"
              required
              class="form__element form__element--half"
            />
            <SfInput
              v-model="editedAddress.state"
              name="state"
              label="State/Province"
              required
              class="form__element form__element--half form__element--half-even"
            />
            <SfInput
              v-model="editedAddress.zipCode"
              name="zipCode"
              label="Zip-code"
              required
              class="form__element form__element--half"
            />
            <SfSelect
              v-model="editedAddress.country"
              name="country"
              label="Country"
              required
              class="sf-select--underlined form__select form__element form__element--half form__element--half-even"
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
              v-model="editedAddress.phoneNumber"
              name="phone"
              label="Phone number"
              required
              class="form__element"
            />
            <SfButton class="form__button" @click="updateAddress">
              {{ $t('Update the address') }}
            </SfButton>
          </div>
        </SfTab>
      </SfTabs>
      <SfTabs v-else key="address-list" :open-tab="1" class="tab-orphan">
        <SfTab :title="$t('Shipping details')">
          <p class="message">
            {{ $t('Manage all the shipping addresses you want (work place, home address ...) This way you won\'t have to enter the shipping address manually with each order.') }}
          </p>
          <transition-group tag="div" name="fade" class="shipping-list">
            <div
              v-for="(address, key) in addresses"
              :key="address.streetName + address.apartment"
              class="shipping"
            >
              <div class="shipping__content">
                <p class="shipping__address">
                  <span class="shipping__client-name">{{ address.firstName }} {{ address.lastName }}</span><br>
                  {{ address.streetName }} {{ address.apartment }}<br>{{
                    address.zipCode
                  }}
                  {{ address.city }},<br>{{ address.country }}
                </p>
                <p class="shipping__address">
                  {{ address.phoneNumber }}
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
        firstName: '',
        lastName: '',
        streetName: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phoneNumber: ''
      },
      countries: Countries
    }
  },
  computed: {
    addresses () {
      return this.$store.state.user.current.addresses
    }
  }
}
</script>

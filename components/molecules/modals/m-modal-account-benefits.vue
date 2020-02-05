<template>
  <div class="m-modal-account-benefits">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading
        :title="$t('Account Benefits')"
        :subtitle="$t('Enjoy these perks with your free account!')"
        class="sf-heading--left sf-heading--no-underline"
      />
      <SfCharacteristic
        v-for="({ description, icon }, index) in characteristics"
        :key="index"
        :description="description"
        :icon="icon"
        size-icon="xxs"
        class="characteristic"
      />
      <SfButton
        class="sf-button--full-width color-secondary"
        @click="closeModal"
      >
        {{ $t("OK") }}
      </SfButton>
    </SfModal>
  </div>
</template>

<script>
import {
  SfModal,
  SfButton,
  SfHeading,
  SfCharacteristic
} from '@storefront-ui/vue';
import i18n from '@vue-storefront/i18n';

export default {
  name: 'MModalAccountBenefits',
  components: {
    SfModal,
    SfButton,
    SfHeading,
    SfCharacteristic
  },
  data () {
    return {
      characteristics: [
        {
          description: i18n.t('Faster checkout'),
          icon: 'clock'
        },
        {
          description: i18n.t('Full rewards program benefits'),
          icon: 'rewards'
        },
        {
          description: i18n.t('Earn credits with every purchase'),
          icon: 'credits'
        },
        {
          description: i18n.t('Manage your wishlist'),
          icon: 'heart'
        }
      ]
    };
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.m-modal-account-benefits {
  line-height: 1;
}
.characteristic {
  margin-top: $spacer-big;
  margin-bottom: $spacer-big;
}
</style>

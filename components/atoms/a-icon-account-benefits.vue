<template>
  <div class="a-icon-account-benefits" @click.prevent>
    <a href="#" @click="showAccountBenefits = true">{{ $t("+info") }}</a>
    <SfModal
      :visible="showAccountBenefits"
      class="modal"
      @close="showAccountBenefits = false"
    >
      <SfHeading
        :title="$t('Account Benefits')"
        :subtitle="$t('Enjoy these perks with your free account!')"
        class="sf-heading--left sf-heading--no-underline modal__heading"
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
        class="sf-button--full-width color-secondary modal__button"
        @click="showAccountBenefits = false"
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
  name: 'AIconshowAccountBenefits',
  components: {
    SfModal,
    SfButton,
    SfHeading,
    SfCharacteristic
  },
  data () {
    return {
      showAccountBenefits: false,
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
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.a-icon-account-benefits {
  line-height: 1;
}
.characteristic {
  margin-top: $spacer-big;
  margin-bottom: $spacer-big;
}
.modal {
  cursor: initial;
}
</style>

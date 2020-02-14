<template>
  <div class="m-modal-newsletter">
    <SfModal :visible="isVisible" @close="$emit('close', modalData.name)">
      <p class="message">
        {{ $t('This feature is not implemented yet! Please take a look at') }}<br>
        <a href="#">https://github.com/DivanteLtd/vue-storefront/issues {{ $t('for our Roadmap!') }}</a>
      </p>
    </SfModal>
  </div>
</template>
<script>
import { SfModal } from '@storefront-ui/vue';

export default {
  name: 'MModalNewsLetter',
  props: {
    /**
     * determines if modal is visible
     */
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    /**
     * data that can be used in modal
     * format: { name: string, payload: any }
     */
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  components: {
    SfModal
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.message {
  margin: 0 0 $spacer-extra-big 0;
  font-size: $font-size-regular-mobile;
  font-family: $body-font-family-primary;
  font-weight: $body-font-weight-primary;
  line-height: 1.6;
  @include for-desktop {
    font-size: $font-size-regular-desktop;
  }
}
</style>

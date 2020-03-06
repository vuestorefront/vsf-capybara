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
.message {
  margin: 0 0 var(--spacer-extra-big) 0;
  font-size: var(--font-size-regular);
  font-family: var(--body-font-family-primary);
  font-weight: var(--body-font-weight-primary);
  line-height: 1.6;
}
</style>

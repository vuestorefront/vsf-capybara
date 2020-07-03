<template>
  <SfCallToAction
    class="o-newsletter"
    :title="$t('Subscribe to Newsletters')"
    :description="$t('Be aware of upcoming sales and events. Receive gifts and special offers!')"
    :image="newsletterImage"
  >
    <template #button>
      <SfButton @click="showNewsletterPopup">
        {{ $t("Subscribe") }}
      </SfButton>
    </template>
  </SfCallToAction>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { SfCallToAction, SfButton } from '@storefront-ui/vue';
import { checkWebpSupport } from 'theme/helpers'
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'ONewsletter',
  components: {
    SfCallToAction,
    SfButton
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    newsletterImage () {
      return checkWebpSupport([
        {
          image: {
            webp: '/assets/newsletter/webp/newsletter.webp',
            fallback: '/assets/newsletter/png/newsletter.png'
          }
        }
      ], this.isWebpSupported)[0].image
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showNewsletterPopup () {
      this.openModal({ name: ModalList.Newsletter })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.o-newsletter {
  margin: var(--spacer-xl) 0;
  box-sizing: border-box;
  @include for-desktop {
    margin: calc(var(--spacer-2xl) * 2) 0;
  }
}
</style>

<template>
  <transition name="fade" appear>
    <div v-show="isOpen" class="m-cookie-notification">
      <div class="cookie">
        <div class="cookie__message">
          {{ message }}
          <router-link
            :to="localizedRoute(detailsLink)"
            :title="detailsLinkText"
            class="cookie__message-link"
          >
            {{ detailsLinkText }}
          </router-link>
        </div>
        <div class="cookie__icon">
          <SfIcon
            icon="cross"
            size="xxs"
            @click="accept"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { SfIcon } from '@storefront-ui/vue';
export default {
  name: 'MCookieNotification',
  components: { SfIcon },
  props: {
    detailsLinkText: {
      type: String,
      default: i18n.t('See details')
    },
    detailsLink: {
      type: String,
      default: '/privacy'
    },
    message: {
      type: String,
      default: i18n.t('We use cookies to give you the best shopping experience.')
    }
  },
  data () {
    return {
      isOpen: false
    };
  },
  beforeMount () {
    this.$store
      .dispatch('claims/check', {
        claimCode: 'cookiesAccepted'
      })
      .then(cookieClaim => {
        if (!cookieClaim) {
          this.isOpen = true;
          this.$store.dispatch('claims/set', {
            claimCode: 'cookiesAccepted',
            value: false
          });
        } else {
          this.isOpen = !cookieClaim.value;
        }
      });
  },
  methods: {
    accept () {
      this.isOpen = false;
      this.$store.dispatch('claims/set', {
        claimCode: 'cookiesAccepted',
        value: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-cookie-notification {
  z-index: 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--c-dark-lighten);
  color: var(--c-light-darken);
  .cookie {
    box-sizing: border-box;
    padding: 0 1.5rem;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1272px;
    max-width: 100%;
    height: 3rem;
    &__message-link {
      padding-left: 1rem;
      --c-link: var(--c-gray);
      --c-link-hover: var(--c-light);
    }
    &__icon {
      cursor: pointer;
      --icon-color: var(--c-gray);
      &:hover {
        --icon-color: var(--c-light);
      }
    }
  }
}
</style>

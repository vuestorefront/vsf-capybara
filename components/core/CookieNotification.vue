<template>
  <transition name="fade" appear>
    <div v-if="isOpen" class="cookie fixed w-100 bg-cl-th-accent cl-tertiary">
      <div class="container">
        <div class="row between-xs middle-xs px15">
          <div class="col-xs-10 start-xs">
            <span class="pr5">
              {{ message }}
            </span>
            <router-link
              :to="localizedRoute(detailsLink)"
              :title="detailsLinkText"
              class="cl-bg-tertiary"
            >
              {{ detailsLinkText }}
            </router-link>
          </div>
          <div class="col-xs-2 end-xs">
            <SfIcon
              class="close-icon"
              icon="cross"
              size="xxs"
              color="#bdbdbd"
              @click="accept"
              @keyup.enter="accept"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { SfIcon } from '@storefront-ui/vue';
export default {
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
      default: i18n.t(
        'We use cookies to give you the best shopping experience.'
      )
    }
  },
  data () {
    return {
      isOpen: false
    };
  },
  created () {
    this.$store
      .dispatch('claims/check', { claimCode: 'cookiesAccepted' })
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
      this.setVisited();
      this.isOpen = false;
    },
    setVisited () {
      this.$store.dispatch('claims/set', {
        claimCode: 'cookiesAccepted',
        value: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/base/global_vars";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-icon: color(black);
$bg-icon: color(suva-gray);
$z-index: map-get($z-index, overlay) - 1;
.cookie {
  z-index: $z-index;
  bottom: 0;
  padding: 15px 0;
}
.icon:hover {
  color: $color-icon;
  background-color: $bg-icon;
}
.start-xs,
.end-xs {
  display: flex;
}
.close-icon {
  cursor: pointer;
}
.pr5 {
  padding-right: 5px;
}
</style>

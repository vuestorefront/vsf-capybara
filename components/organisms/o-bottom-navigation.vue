<template>
  <div class="o-bottom-navigation">
    <SfBottomNavigation>
      <SfBottomNavigationItem
        v-for="(item, index) in navigationItems"
        :key="index"
        :icon="item.icon"
        :label="item.label"
        :is-floating="item.isFloating"
        @click.native="item.onClick"
      />
    </SfBottomNavigation>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'
import AHomeIcon from 'theme/components/atoms/a-home-icon';
import ASearchIcon from 'theme/components/atoms/a-search-icon';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import { SfBottomNavigation } from '@storefront-ui/vue';

export default {
  name: 'OBottomNavigation',
  components: {
    SfBottomNavigation
  },
  data () {
    return {
      navigationItems: [
        { icon: 'home', label: this.$t('Home'), onClick: this.goToHome },
        { icon: 'menu', label: this.$t('Menu'), onClick: this.openMenu },
        { icon: 'profile', label: this.$t('Profile'), onClick: this.goToAccount },
        { icon: 'add_to_cart', label: this.$t('Cart'), onClick: this.goToCart, isFloating: true }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isSearchPanelVisible: state => state.ui.searchpanel
    })
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      openMicrocart: 'ui/toggleMicrocart'
    }),
    goToHome () {
      this.$router.push(this.localizedRoute('/'));
    },
    openMenu () {
      this.$store.commit('ui/toggleMenu')
    },
    goToAccount () {
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.openModal({name: ModalList.Auth, payload: 'login'})
      }
    },
    goToCart () {
      this.openMicrocart();
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-bottom-navigation {
  @include for-desktop() {
    display: none;
  }
  ::v-deep .sf-bottom-navigation {
    z-index: inherit;
    .sf-bottom-navigation-item {
      cursor: pointer;
    }
  }
}
</style>

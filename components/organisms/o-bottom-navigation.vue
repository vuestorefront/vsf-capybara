<template>
  <div class="o-bottom-navigation" :style="{'z-index': isBottomNavigationOnTop ? 1 : 0}">
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
        { icon: 'search', label: this.$t('Search'), onClick: this.goToSearch },
        { icon: 'profile', label: this.$t('Profile'), onClick: this.goToAccount },
        { icon: 'add_to_cart', label: this.$t('Cart'), onClick: this.goToCart, isFloating: true }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapState({
      isSidebarVisible: state => state.ui.sidebar,
      isMicrocartVisible: state => state.ui.microcart,
      isSearchPanelVisible: state => state.ui.searchpanel,
      isOverlayVisible: state => state.ui.overlay,
      isLoaderVisible: state => state.ui.loader,
      isModalVisible: state => state.ui.modal.activeModals.length > 0
    }),
    isBottomNavigationOnTop () {
      return !this.isSidebarVisible &&
        !this.isMicrocartVisible &&
        !this.isSearchPanelVisible &&
        !this.isOverlayVisible &&
        !this.isLoaderVisible &&
        !this.isModalVisible;
    }
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      openMicrocart: 'ui/toggleMicrocart'
    }),
    goToHome () {
      this.$router.push(this.localizedRoute('/'));
    },
    goToSearch () {
      this.$store.commit('ui/setSearchpanel', !this.isSearchPanelVisible)
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
@import "~@storefront-ui/vue/styles";

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

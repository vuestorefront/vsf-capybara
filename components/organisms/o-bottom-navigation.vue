<template>
  <div class="o-bottom-navigation" :style="{'z-index': isBottomNavigationOnTop ? 1 : 0}">
    <SfBottomNavigation>
      <SfBottomNavigationItem v-for="(item, index) in navigationItems" :key="index">
        <component :is="item.component" v-bind="item.props" />
      </SfBottomNavigationItem>
    </SfBottomNavigation>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AHomeIcon from 'theme/components/atoms/a-home-icon';
import ASearchIcon from 'theme/components/atoms/a-search-icon';
import AAccountIcon from 'theme/components/atoms/a-account-icon';
import AMicrocartIcon from 'theme/components/atoms/a-microcart-icon';
import { SfBottomNavigation } from '@storefront-ui/vue';

export default {
  name: 'OBottomNavigation',
  components: {
    SfBottomNavigation,
    AHomeIcon,
    ASearchIcon,
    AAccountIcon,
    AMicrocartIcon
  },
  data () {
    return {
      navigationItems: [
        { component: AHomeIcon },
        { component: ASearchIcon },
        { component: AAccountIcon },
        { component: AMicrocartIcon, props: { floatingIcon: true } }
      ]
    }
  },
  computed: {
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
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/_variables.scss";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.o-bottom-navigation {
  @include for-desktop() {
    display: none;
  }
  ::v-deep .sf-bottom-navigation {
    z-index: inherit;
  }
}
</style>

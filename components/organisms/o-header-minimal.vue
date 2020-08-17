<template>
  <header class="o-header-minimal">
    <div class="header-content d-flex">
      <div class="d-flex align-center">
        <ALogo />
        <MHeaderSearchbar class="desktop-only"/>
        <MHeaderCompte />
        <MHeaderBasket />
        <AHeaderContact />
      </div>
      <MHeaderDrill />
    </div>
  </header>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo';
import MHeaderSearchbar from 'theme/components/molecules/m-searchbar';
import MHeaderCompte from 'theme/components/molecules/m-header-compte';
import MHeaderBasket from 'theme/components/molecules/m-header-basket';
import AHeaderContact from 'theme/components/atoms/a-header-contact';
import MHeaderDrill from 'theme/components/molecules/m-header-drill';

import { SfImage } from '@storefront-ui/vue';

export default {
  name: 'OHeaderMinimal',
  components: { ALogo, MHeaderSearchbar, MHeaderCompte, MHeaderBasket, AHeaderContact, MHeaderDrill }
};
</script>

<style lang="scss" scoped>
.o-header-minimal
{

}

</style>

<template>
  <div id="gift-cards-page">
    <div class="_content">
      <div class="_col -left">
        <GiftCardTemplateComponent
          class="_template"
          :gift-card-template="selectedGiftCardTemplate"
        />

        <div class="_giftcard-banner">
          Multiple styles available! Select your favorite -->
        </div>
      </div>

      <div class="_form _col">
        <input type="text">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { isServer } from '@vue-storefront/core/helpers';

import GiftCardTemplateComponent from 'src/modules/gift-card/components/GiftCardTemplate.vue';
import GiftCardTemplate from 'src/modules/gift-card/types/GiftCardTemplate.interface';
import { ImageHandlerService } from 'src/modules/file-storage';
import { InjectType } from 'src/modules/shared';

interface InjectedServices {
  imageHandlerService: ImageHandlerService
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  components: {
    GiftCardTemplateComponent
  },
  inject: {
    imageHandlerService: { from: 'ImageHandlerService' }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    selectedGiftCardTemplate (): GiftCardTemplate | undefined {
      if (!this.giftCardTemplatesList.length) {
        return undefined;
      }

      const card = this.$store.getters['giftCard/getGiftCardTemplateById'](
        this.giftCardTemplatesList[0].id
      );
      card.backgroundImage =
        'https://petsies.store.anton.office.optimuspro.ru/skin/frontend/petsies/default/images/giftcard/default.png';
      return card; // todo mock
    },
    giftCardTemplatesList (): GiftCardTemplate[] {
      return this.$store.getters['giftCard/giftCardTemplates'];
    }
  },
  mounted (): void {
    void this.$store.dispatch('giftCard/loadGiftCardsTemplates');
  },
  async asyncData ({ store }): Promise<void> {
    await store.dispatch('product/loadProduct', { parentSku: 'GiftCard' });
    if (isServer) {
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#gift-cards-page {
  padding: 3em 0;

  * {
    box-sizing: border-box;
  }

  @media (min-width: $tablet-min) {
    max-width: 71.75rem;
    margin: 0 auto;
  }

  ._content {
    padding: 0 var(--spacer-xs);
    display: flex;
    flex-wrap: wrap;
  }

  ._template {
    // width: 100%;
  }

  ._col {
    padding: 0 var(--spacer-sm);
    width: 100%;

    &.-left {
      display: flex;
      flex-direction: column;
    }
  }

  ._form {
    width: 100%;
  }

  ._giftcard-banner {
    padding: 0.5em 2em;
    margin-top: 1.5em;
    text-align: center;
    background-color: #fce0e1;
    width: 100%;
  }
}
</style>

<template>
  <div id="gift-cards-page">
    <div class="_content">
      <div class="_col -left">
        <GiftCardTemplateComponent
          class="_template"
          :gift-card-template="selectedGiftCardTemplate"
          :recipient-name="giftCardOrderFormData.recipientName"
          :sender-name="giftCardOrderFormData.customerName"
          :price-amount="priceAmount"
          :custom-message="giftCardOrderFormData.customMessage"
        />

        <div class="_giftcard-banner">
          Multiple styles available! Select your favorite -->
        </div>
      </div>

      <div class="_form _col">
        <OGiftCardOrderForm
          :gift-card-order-form-data.sync="giftCardOrderFormData"
          :gift-card-templates-list="giftCardTemplatesList"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { isServer } from '@vue-storefront/core/helpers';

import GiftCardTemplateComponent from 'src/modules/gift-card/components/GiftCardTemplate.vue';
import OGiftCardOrderForm from 'theme/components/organisms/o-gift-card-order-form.vue';

import GiftCardTemplate from 'src/modules/gift-card/types/GiftCardTemplate.interface';
import { ImageHandlerService } from 'src/modules/file-storage';
import { InjectType } from 'src/modules/shared';

import GiftCardOrderFormData from 'theme/components/interfaces/gift-card-order-form-data.interface';

const defaultGiftCardOrderFormData: GiftCardOrderFormData = {
  selectedTemplateId: undefined,
  priceAmount: 250,
  shouldSendFriend: false,
  customerName: '',
  recipientName: '',
  recipientEmail: '',
  shouldRecipientShip: false,
  customMessage: '',
  qty: 1,
  customPriceAmount: 200
};

interface InjectedServices {
  imageHandlerService: ImageHandlerService
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  components: {
    GiftCardTemplateComponent,
    OGiftCardOrderForm
  },
  inject: {
    imageHandlerService: { from: 'ImageHandlerService' }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    priceAmount (): number {
      return (
        this.giftCardOrderFormData.priceAmount ||
        this.giftCardOrderFormData.customPriceAmount
      );
    },
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
    },
    firstGiftCardTemplate (): GiftCardTemplate | undefined {
      return this.giftCardTemplatesList[0];
    }
  },
  data () {
    return {
      giftCardOrderFormData:
        defaultGiftCardOrderFormData as GiftCardOrderFormData
    };
  },
  mounted (): void {
    this.loadData();
  },
  async asyncData ({ store }): Promise<void> {
    await store.dispatch('product/loadProduct', { parentSku: 'GiftCard' });
    if (isServer) {
    }
  },
  methods: {
    async loadData (): Promise<void> {
      await this.$store.dispatch('giftCard/loadGiftCardsTemplates');

      this.giftCardOrderFormData.selectedTemplateId =
        this.firstGiftCardTemplate?.id;
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

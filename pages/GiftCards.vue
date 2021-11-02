<template>
  <div id="gift-cards-page">
    <SfModal
      :visible="showPreviewModal"
      @close="closePreviewModal"
      class="_preview-modal"
    >
      <GiftCardTemplateComponent
        :gift-card-template="selectedGiftCardTemplate"
        :recipient-name="recipientName"
        :sender-name="customerName"
        :price-amount="priceAmount"
        :custom-message="customMessage"
      />

      <template #close>
        <div class="_close-preview" />
      </template>
    </SfModal>
    <div class="_content">
      <div class="_col -left">
        <GiftCardTemplateComponent
          class="_template"
          :gift-card-template="selectedGiftCardTemplate"
          :recipient-name="recipientName"
          :sender-name="customerName"
          :price-amount="priceAmount"
          :custom-message="customMessage"
          @click.native="onGiftCardTemplateClick"
        />

        <div class="_giftcard-banner">
          Multiple styles available! Select your favorite -->
        </div>
      </div>

      <div class="_form _col -right">
        <OGiftCardOrderForm
          :gift-card-order-form-data.sync="giftCardOrderFormData"
          :gift-card-templates-list="giftCardTemplatesList"
          :is-disabled="isSubmitting"
          @submit-form="onFormSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { isServer } from '@vue-storefront/core/helpers';
import Product from '@vue-storefront/core/modules/catalog/types/Product';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { Logger } from '@vue-storefront/core/lib/logger';
import i18n from '@vue-storefront/i18n';

import { SfModal } from '@storefront-ui/vue';

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
    OGiftCardOrderForm,
    SfModal
  },
  inject: {
    imageHandlerService: { from: 'ImageHandlerService' }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    customerName (): string {
      return this.giftCardOrderFormData.shouldSendFriend
        ? this.giftCardOrderFormData.customerName
        : '';
    },
    customMessage (): string {
      return this.giftCardOrderFormData.shouldSendFriend
        ? this.giftCardOrderFormData.customMessage
        : '';
    },
    firstGiftCardTemplate (): GiftCardTemplate | undefined {
      return this.giftCardTemplatesList[0];
    },
    giftCardTemplatesList (): GiftCardTemplate[] {
      return this.$store.getters['giftCard/giftCardTemplates'];
    },
    loggedUser () {
      return this.$store.state.user.current;
    },
    loggedUserFullName (): string {
      if (!this.loggedUser) {
        return '';
      }

      const firstName = this.loggedUser.firstname;
      const lastName = this.loggedUser.lastname;
      let fullName = '';

      if (firstName) {
        fullName = `${firstName} `;
      }

      if (lastName) {
        fullName += lastName;
      }

      return fullName.trim();
    },
    priceAmount (): number {
      return (
        this.giftCardOrderFormData.priceAmount ||
        this.giftCardOrderFormData.customPriceAmount
      );
    },
    product (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },

    recipientEmail (): string {
      return this.giftCardOrderFormData.shouldRecipientShip
        ? this.giftCardOrderFormData.recipientEmail
        : '';
    },
    recipientName (): string {
      return this.giftCardOrderFormData.shouldSendFriend
        ? this.giftCardOrderFormData.recipientName
        : '';
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
    }
  },
  data () {
    return {
      giftCardOrderFormData:
        defaultGiftCardOrderFormData as GiftCardOrderFormData,
      showPreviewModal: false,
      isSubmitting: false
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
    async addCartItem (): Promise<void> {
      if (!this.product) {
        return;
      }

      try {
        await this.$store.dispatch('cart/addItem', {
          productToAdd: {
            ...this.product,
            qty: this.giftCardOrderFormData.qty,
            giftcard_options: {
              product: this.product.id,
              qty: this.giftCardOrderFormData.qty,
              price_amount: this.priceAmount,
              amount: this.priceAmount,
              giftcard_template_id:
                this.giftCardOrderFormData.selectedTemplateId,
              send_friend: this.giftCardOrderFormData.shouldSendFriend ? 1 : 0,
              customer_name: this.customerName,
              recipient_name: this.recipientName,
              recipient_email: this.recipientEmail,
              recipient_ship: this.giftCardOrderFormData.shouldRecipientShip
                ? 'yes'
                : 'no',
              message: this.customMessage
            }
          }
        });

        this.goToCart();
      } catch (err) {
        Logger.error(err, 'budsies')();

        this.onFailure('Unexpected error: ' + err);
      }
    },
    closePreviewModal (): void {
      this.showPreviewModal = false;
    },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    },
    async loadData (): Promise<void> {
      await this.$store.dispatch('giftCard/loadGiftCardsTemplates');

      this.giftCardOrderFormData.customerName = this.loggedUserFullName;
      this.giftCardOrderFormData.selectedTemplateId =
        this.firstGiftCardTemplate?.id;
    },
    onFailure (message: any): void {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    async onFormSubmit (): Promise<void> {
      this.isSubmitting = true;
      await this.addCartItem();
      this.isSubmitting = false;
    },
    onGiftCardTemplateClick (): void {
      this.showPreviewModal = true;
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
    // cursor: pointer;
    // pointer-events: none;
    cursor: pointer;
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

  ._preview-modal {
    --modal-content-padding: 0;
    --modal-close-right: -18px;
    --modal-close-top: -15px;
    --modal-width: 29.375rem;
    --modal-top: 50%;
    --modal-left: 50%;
    --modal-bottom: none;
    --modal-right: none;
    --modal-transform: translate3d(-50%, -50%, 0);
    --modal-height: auto;
    // display: none;

    ._close-preview {
      width: 35px;
      height: 35px;
      background: url("../assets/giftcards/close.png");
      z-index: 15;
      position: relative;
    }

    ::v-deep {
      .sf-modal__container {
        width: 900px;
        max-width: calc(100% - var(--spacer-xl));
      }

      .sf-modal__bar {
        display: none !important;
      }

      .sf-modal__close {
        display: block !important;
      }
    }
  }

  @media (min-width: $mobile-max) {
    ._col {
      &.-left {
        flex: 7;
        width: 58%;
      }

      &.-right {
        flex: 5;
        width: 41%;
      }
    }
  }

  @include for-desktop {
    ._template {
      // cursor: pointer;
      // pointer-events: all;
    }

    // ._preview-modal {
    //   display: block;
    // }

    ._col {
      &.-left {
        flex: 8;
        width: 66%;
      }

      &.-right {
        flex: 4;
        width: 33%;
      }
    }
  }
}
</style>

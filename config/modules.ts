import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { LocalizedRoute } from '@vue-storefront/core/lib/types'
import { CatalogModule } from '@vue-storefront/core/modules/catalog'
import { CatalogNextModule } from '@vue-storefront/core/modules/catalog-next'
import { CartModule } from '@vue-storefront/core/modules/cart'
import { CheckoutModule } from '@vue-storefront/core/modules/checkout'
import { NotificationModule } from '@vue-storefront/core/modules/notification'
import { UrlModule } from '@vue-storefront/core/modules/url'
import { BreadcrumbsModule } from '@vue-storefront/core/modules/breadcrumbs'
import { GoogleTagManagerModule } from 'src/modules/google-tag-manager';
import { findRouteByPath } from '@vue-storefront/core/modules/url/helpers'
import { UserModule } from '@vue-storefront/core/modules/user'
import { NewsletterModule } from '@vue-storefront/core/modules/newsletter'
import { StoryblokModule } from 'src/modules/vsf-storyblok-module'
import { forStoryblok } from 'src/modules/vsf-storyblok-module/mappingFallback'
import { extendStore } from '@vue-storefront/core/helpers'
import { StorefrontModule, registerModule } from '@vue-storefront/core/lib/modules'
import { BudsiesModule } from 'src/modules/budsies'
import { Braintree } from 'src/modules/payment-braintree'
import { PromotionPlatformModule } from 'src/modules/promotion-platform'
import { GiftCardModule } from 'src/modules/gift-card'
import { AmazonPay } from 'src/modules/vsf-amazon-pay'
import { PaymentBackendMethodsModule } from 'src/modules/payment-backend-methods'
import { PaymentAffirm } from 'src/modules/payment-affirm';
import { UrlRewriteModule } from 'src/modules/url-rewrite';
import { mappingFallbackForUrlRewrite } from 'src/modules/url-rewrite/mappingFallback';
import { BackendSettings } from 'src/modules/backend-settings'

import registerStoryblokComponents from 'theme/components/storyblok'

const extendUrlVuex = {
  actions: {
    async mapFallbackUrl (context, payload: any): Promise<LocalizedRoute | undefined> {
      const result = await forStoryblok(context, payload);

      if (result) {
        return result
      }

      const redirectTargetPath = await mappingFallbackForUrlRewrite(context, payload);
      if (!redirectTargetPath) {
        return;
      }

      const routeByPath = findRouteByPath(redirectTargetPath);
      return routeByPath || forStoryblok(context, { url: redirectTargetPath, params: payload.params })
    }
  }
}
const extendUrlModule: StorefrontModule = function ({ store }) {
  extendStore('url', extendUrlVuex);
}

// TODO:distributed across proper pages BEFORE 1.11
export function registerClientModules () {
  registerStoryblokComponents()

  registerModule(UrlModule)
  registerModule(CatalogModule)
  registerModule(CheckoutModule) // To Checkout
  registerModule(CartModule)
  registerModule(NotificationModule)
  registerModule(UserModule) // Trigger on user icon click
  registerModule(CatalogNextModule)
  registerModule(BreadcrumbsModule)
  registerModule(NewsletterModule)
  registerModule(StoryblokModule)
  registerModule(extendUrlModule)
  registerModule(BudsiesModule)
  registerModule(GoogleTagManagerModule)
  registerModule(Braintree)
  registerModule(PromotionPlatformModule)
  registerModule(GiftCardModule)
  registerModule(PaymentBackendMethodsModule)
  registerModule(PaymentAffirm)
  registerModule(UrlRewriteModule)
  registerModule(BackendSettings)
}

// Deprecated API, will be removed in 2.0
export const registerModules: VueStorefrontModule[] = [
  // Example
  AmazonPay
]

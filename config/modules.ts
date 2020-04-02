import { VueStorefrontModule } from '@vue-storefront/core/lib/module'
import { CatalogModule } from '@vue-storefront/core/modules/catalog'
import { CatalogNextModule } from '@vue-storefront/core/modules/catalog-next'
import { CartModule } from '@vue-storefront/core/modules/cart'
import { CheckoutModule } from '@vue-storefront/core/modules/checkout'
import { NotificationModule } from '@vue-storefront/core/modules/notification'
import { UrlModule } from '@vue-storefront/core/modules/url'
import { BreadcrumbsModule } from '@vue-storefront/core/modules/breadcrumbs'
import { UserModule } from '@vue-storefront/core/modules/user'
import { CmsModule } from '@vue-storefront/core/modules/cms'
import { NewsletterModule } from '@vue-storefront/core/modules/newsletter'
import { PaymentBackendMethodsModule } from 'src/modules/payment-backend-methods'
import { PaymentCashOnDeliveryModule } from 'src/modules/payment-cash-on-delivery'

import { registerModule } from '@vue-storefront/core/lib/modules'

// TODO:distributed across proper pages BEFORE 1.11
export function registerClientModules () {
  registerModule(UrlModule)
  registerModule(CatalogModule)
  registerModule(CheckoutModule) // To Checkout
  registerModule(CartModule)
  registerModule(PaymentBackendMethodsModule)
  registerModule(PaymentCashOnDeliveryModule)
  registerModule(NotificationModule)
  registerModule(UserModule) // Trigger on user icon click
  registerModule(CatalogNextModule)
  registerModule(BreadcrumbsModule)
  registerModule(CmsModule)
  registerModule(NewsletterModule)
}

// Deprecated API, will be removed in 2.0
export const registerModules: VueStorefrontModule[] = [
  // Example
]

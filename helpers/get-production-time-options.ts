import { Store } from 'vuex';
import { Logger } from '@vue-storefront/core/lib/logger';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';
import Product from 'core/modules/catalog/types/Product';

import { RushAddon } from 'src/modules/budsies';
import ProductionTimeOption from '../components/interfaces/production-time-option.interface';

export default function getProductionTimeOptions (
  bundleOption: BundleOption,
  product: Product,
  store: Store<any>
): ProductionTimeOption[] {
  const addons: RushAddon[] = store.getters['budsies/getProductRushAddons'](product.id);

  if (!addons.length) {
    return [];
  }

  let addonOptions: Record<string, number> = {};

  for (const productLink of bundleOption.product_links) {
    if (!productLink.product) {
      continue;
    }

    addonOptions[productLink.product.sku] = +productLink.id;
  }

  const result: ProductionTimeOption[] = [];

  for (const addon of addons) {
    const addonOption = addonOptions[addon.id];

    if (!addonOption && addon.id) {
      Logger.warn('The option product of rush addon is not found: ' + addon.id, 'budsies')();
      continue;
    }

    result.push({
      id: addon.id,
      text: addon.text,
      isDomestic: addon.isDomestic,
      optionId: bundleOption.option_id,
      optionValueId: addonOption
    })
  }

  return result;
}

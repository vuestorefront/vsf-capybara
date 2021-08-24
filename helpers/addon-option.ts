import { getProductGallery } from '@vue-storefront/core/modules/catalog/helpers';
import { BundleOption } from 'core/modules/catalog/types/BundleOption';
import AddonOption from 'theme/components/interfaces/addon-option.interface';

export function getAddonOptions (addonsBundleOption?: BundleOption): AddonOption[] {
  if (!addonsBundleOption) {
    return []
  }

  let result: AddonOption[] = [];
  for (const productLink of addonsBundleOption.product_links) {
    if (!productLink.product) {
      continue;
    }

    const images: string[] = getProductGallery(productLink.product).map((i: any) => i.src);

    result.push({
      id: Number(productLink.product.id),
      sku: productLink.product.sku,
      name: productLink.product.name,
      description: productLink.product.description,
      price: productLink.product.final_price,
      images: images,
      optionId: addonsBundleOption.option_id,
      optionValueId: ((typeof productLink.id === 'number') ? productLink.id : Number.parseInt(productLink.id, 10) as number),
      videoUrl: (productLink.product as any).video_url
    });
  }

  return result;
}

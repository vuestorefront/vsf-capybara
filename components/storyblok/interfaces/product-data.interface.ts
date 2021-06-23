import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface ProductData extends ItemData {
  product_id: string,
  product_display: string
}

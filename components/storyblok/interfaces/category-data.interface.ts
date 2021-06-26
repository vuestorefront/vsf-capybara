import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface CategoryData extends ItemData {
  id: string,
  products_count: string
}

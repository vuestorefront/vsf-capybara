import { AssetField, ItemData } from 'src/modules/vsf-storyblok-module';

export default interface ImageData extends ItemData {
  image: AssetField,
  mobile_image: AssetField,
  alt_tag: string,
  title_tag: string,
  has_lightbox?: boolean,
  width: string
}

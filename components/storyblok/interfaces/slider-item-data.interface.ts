import { AssetField, ItemData, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface SliderItem extends ItemData {
  image: AssetField,
  mobile_image: AssetField,
  alt_tag: string,
  title_tag: string,
  link_url: LinkField,
  target_blank: boolean
}

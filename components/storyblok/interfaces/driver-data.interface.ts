import { AssetField, ItemData, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface DriverData extends ItemData {
  image: AssetField,
  mobile_image: AssetField,
  alt_tag: string,
  title_tag: string,
  link_text: string,
  link_url: LinkField,
  target_blank?: boolean
}

import AssetField from './asset-field.interface';
import Item from './item.interface';
import LinkField from './link-field.interface';

export default interface DriverData extends Item {
  image: AssetField,
  mobile_image: AssetField,
  alt_tag: string,
  title_tag: string,
  link_text: string,
  link_url: LinkField,
  target_blank?: boolean
}

import AssetField from './asset-field.interface';
import Item from './item.interface';

export default interface ImageData extends Item {
  image: AssetField,
  mobile_image: AssetField,
  alt_tag: string,
  title_tag: string,
  has_lightbox?: boolean,
  height: string,
  width: string
}

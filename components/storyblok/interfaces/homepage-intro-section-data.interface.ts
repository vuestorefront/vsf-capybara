import AssetField from './asset-field.interface';
import ColorPickerField from './color-picker-field.interface';
import Item from './item.interface';
import LinkField from './link-field.interface';

export default interface HomepageIntroSectionData extends Item {
  image: AssetField,
  mobile_image: AssetField,
  title: string,
  subtitle: string,
  text_color: ColorPickerField,
  button_link: LinkField,
  button_text: string,
  background_color: ColorPickerField
}

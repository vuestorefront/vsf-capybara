import { AssetField, ItemData, ColorPickerField, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface HomepageIntroSectionData extends ItemData {
  image: AssetField,
  mobile_image: AssetField,
  title: string,
  subtitle: string,
  text_color: ColorPickerField,
  button_link: LinkField,
  button_text: string,
  background_color: ColorPickerField
}

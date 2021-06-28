import { ItemData, ColorPickerField } from 'src/modules/vsf-storyblok-module';

export default interface HorizontalRuleData extends ItemData {
  color: ColorPickerField,
  hr_height: number,
  hr_width: string
}

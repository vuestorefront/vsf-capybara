import { Alignment } from './alignment.value';

export default interface Item {
  _uid: string,
  css_classes: string,
  alignment: Alignment,
  spacing_settings: SpacingSettingsField
}

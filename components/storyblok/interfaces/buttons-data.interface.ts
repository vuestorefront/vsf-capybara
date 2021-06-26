import ButtonItemData from './button-item-data.interface';
import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface ButtonsData extends ItemData {
  button_items: ButtonItemData[]
}

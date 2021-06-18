import ButtonItemData from './button-item-data.interface';
import Item from './item.interface';

export default interface ButtonsData extends Item {
  button_items: ButtonItemData[]
}

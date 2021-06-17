import Item from './item.interface';
import LinkField from './link-field.interface';

export default interface ButtonItem extends Item {
  link_text: string,
  link_url: LinkField,
  is_primary: boolean,
  target_blank: boolean
}

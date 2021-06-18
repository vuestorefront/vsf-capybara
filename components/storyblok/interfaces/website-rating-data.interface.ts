import Item from './item.interface';
import LinkField from './link-field.interface';

export default interface WebsiteRatingData extends Item {
  link_url: LinkField,
  link_text: string
}

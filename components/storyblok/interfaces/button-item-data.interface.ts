import { ItemData, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface ButtonItemData extends ItemData {
  link_text: string,
  link_url: LinkField,
  is_primary: boolean,
  target_blank: boolean
}

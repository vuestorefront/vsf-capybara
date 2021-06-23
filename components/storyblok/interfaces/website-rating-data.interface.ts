import { ItemData, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface WebsiteRatingData extends ItemData {
  link_url: LinkField,
  link_text: string
}

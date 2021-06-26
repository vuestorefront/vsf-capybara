import { AssetField, ItemData, LinkField } from 'src/modules/vsf-storyblok-module';

export default interface SharingData extends ItemData {
  sharing_url: LinkField,
  sharing_description: string,
  twitter_description: string,
  sharing_image: AssetField,
  sharing_email_subject: string
}

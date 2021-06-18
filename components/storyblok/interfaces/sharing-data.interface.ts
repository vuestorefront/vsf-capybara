import Item from './item.interface';
import AssetField from './asset-field.interface';
import LinkField from './link-field.interface';

export default interface SharingData extends Item {
  sharing_url: LinkField,
  sharing_description: string,
  twitter_description: string,
  sharing_image: AssetField,
  sharing_email_subject: string
}

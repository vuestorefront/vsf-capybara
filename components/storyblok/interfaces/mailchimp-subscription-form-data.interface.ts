import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface MailchimpSubscriptionFormData extends ItemData {
  list_id: string,
  button_text?: string,
  success_message?: string
}

import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface MailingListSubscriptionFormData extends ItemData {
  list_id: string,
  button_text?: string,
  success_message?: string
}

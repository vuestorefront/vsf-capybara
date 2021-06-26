import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface ExpandableTextData extends ItemData {
  text_content: string,
  max_length: number
}

import { ItemData } from 'src/modules/vsf-storyblok-module';

export default interface TextareaData extends ItemData {
  type: string,
  content: unknown[]
}

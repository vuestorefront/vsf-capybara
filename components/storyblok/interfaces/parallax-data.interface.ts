import { AssetField, ItemData } from 'src/modules/vsf-storyblok-module';

export default interface ParallaxData extends ItemData {
  direction: 'up' | 'down',
  image: AssetField,
  content?: any[]
}

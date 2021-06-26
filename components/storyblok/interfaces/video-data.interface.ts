import { AspectRatio } from './aspect-ratio.value';
import { ItemData, VideoUrlField } from 'src/modules/vsf-storyblok-module';

export default interface VideoData extends ItemData {
  url: VideoUrlField,
  aspect_ratio: AspectRatio,
  display_controls?: boolean
}

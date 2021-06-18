import { AspectRatio } from './aspect-ratio.value';
import Item from './item.interface';
import VideoUrlField from './video-url-field.interface';

export default interface VideoData extends Item {
  url: VideoUrlField,
  aspect_ratio: AspectRatio,
  display_controls?: boolean
}

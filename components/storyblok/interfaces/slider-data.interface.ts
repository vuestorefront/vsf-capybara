import { ItemData } from 'src/modules/vsf-storyblok-module';
import SliderItem from './slider-item-data.interface';
import { ThumbnailsPosition } from './thumbnails-position.value';

export default interface SliderData extends ItemData {
  slider_items: SliderItem[],
  thumbnails_position: ThumbnailsPosition
}

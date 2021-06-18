import Item from './item.interface';
import SliderItem from './slider-item-data.interface';
import { ThumbnailsPosition } from './thumbnails-position.value';

export default interface SliderData extends Item {
  slider_items: SliderItem[],
  thumbnails_position: ThumbnailsPosition
}

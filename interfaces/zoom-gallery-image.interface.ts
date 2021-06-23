import { ImageSourceItem } from 'src/modules/budsies';

export default interface ZoomGalleryImage {
  thumb: string | ImageSourceItem[],
  stage: string | ImageSourceItem[],
  big: string,
  alt?: string,
  title?: string
}

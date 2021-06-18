import Item from './item.interface';

export default interface VideoData extends Item {
  video_url: string,
  video_height: string,
  video_width: string
}

import ImageInterface from './image.interface';

export default interface SliderItemInterface {
  image: ImageInterface,
  mobile_image: ImageInterface,
  alignment: string,
  alt_tag: string,
  css_classes: string,
  link_url: {
    cached_url: string,
    fieldtype: string,
    id: string,
    linktype: string,
    url: string
  },
  margin_bottom: string,
  margin_left: string,
  margin_right: string,
  margin_top: string,
  padding_bottom: string,
  padding_left: string,
  padding_right: string,
  padding_top: string,
  target_blank: boolean,
  title_tag: string
}

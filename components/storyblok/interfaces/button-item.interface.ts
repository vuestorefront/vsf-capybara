import LinkInterface from './link.interface';

export default interface ButtonItemInterface {
  _uid: string,
  link_text: string,
  link_url: LinkInterface,
  is_primary: boolean,
  target_blank: boolean,
  css_classes: string,
  alignment: string,
  margin_bottom: string,
  margin_left: string,
  margin_right: string,
  margin_top: string,
  padding_bottom: string,
  padding_left: string,
  padding_right: string,
  padding_top: string
}

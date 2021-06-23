import Item from './item.interface';

export default interface ExpandableTextData extends Item {
  text_content: string,
  max_length: number
}

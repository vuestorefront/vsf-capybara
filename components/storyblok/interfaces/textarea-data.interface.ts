import Item from './item.interface';

export default interface TextareaData extends Item {
  type: string,
  content: unknown[]
}

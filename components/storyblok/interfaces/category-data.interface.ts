import Item from './item.interface';

export default interface CategoryData extends Item {
  id: string,
  products_count: string
}

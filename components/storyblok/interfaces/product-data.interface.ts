import Item from './item.interface';

export default interface ProductData extends Item {
  product_id: string,
  product_display: string
}

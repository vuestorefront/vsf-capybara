import ProductImage from './product-image.interface';

export default interface DesignProduct {
  id: number,
  sku: string,
  name: string,
  thumbnail: string,
  price: number,
  defaultOtherSideDesign?: number,
  defaultAccentColor?: number,
  images: ProductImage[],
  optionId: string,
  optionValueId: string
}

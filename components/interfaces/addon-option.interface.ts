export default interface AddonOption {
  id: number,
  sku: string,
  name: string,
  description: string,
  price: number | undefined,
  images: string[],
  optionId: number,
  optionValueId: number,
  videoUrl?: string
}

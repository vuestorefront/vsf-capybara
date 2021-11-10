export default interface GiftCardOrderFormData {
  selectedTemplateId?: number,
  priceAmount: number,
  shouldSendFriend: boolean,
  customerName: string,
  recipientName: string,
  recipientEmail: string,
  shouldShipPhysically: boolean,
  customMessage: string,
  qty: number,
  customPriceAmount: number
}

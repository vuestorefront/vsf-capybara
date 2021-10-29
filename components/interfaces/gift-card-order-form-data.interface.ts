export default interface GiftCardOrderFormData {
  selectedTemplateId?: number,
  priceAmount: number,
  shouldSendFriend: boolean,
  customerName: string,
  recipientName: string,
  recipientEmail: string,
  shouldRecipientShip: boolean,
  customMessage: string,
  qty: number,
  customPriceAmount: number
}

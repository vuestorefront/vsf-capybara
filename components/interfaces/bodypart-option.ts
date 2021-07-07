import { BodyPartValueContentType } from 'src/modules/budsies';

export default interface BodypartOption {
  id: string,
  label: string,
  value: string,
  isSelected: boolean,
  contentTypeId: BodyPartValueContentType,
  color?: string,
  image?: string,
  optionId: string,
  optionValueId: string
}

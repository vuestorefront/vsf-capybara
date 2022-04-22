import { BodyPartValueContentType } from 'src/modules/budsies';

export default interface BodypartOption {
  id: string,
  label: string,
  value: string,
  isSelected: boolean,
  contentTypeId: BodyPartValueContentType,
  group: string | 'default',
  color?: string,
  image?: string
}

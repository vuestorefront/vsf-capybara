import { ImageUploadMethod } from 'src/modules/budsies';

export default interface ForeversWizardImageUploadStepData {
  uploadMethod: ImageUploadMethod,
  storageItemsIds: string[]
}

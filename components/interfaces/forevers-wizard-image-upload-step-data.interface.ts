import { ImageUploadMethod } from 'src/modules/budsies';
import { Item } from 'src/modules/file-storage';

export default interface ForeversWizardImageUploadStepData {
  uploadMethod: ImageUploadMethod,
  storageItems: Item[]
}

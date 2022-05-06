import { ImageUploadMethod } from 'src/modules/budsies';
import { CustomerImage } from 'src/modules/shared';

export default interface ForeversWizardImageUploadStepData {
  uploadMethod: ImageUploadMethod,
  customerImages: CustomerImage[]
}

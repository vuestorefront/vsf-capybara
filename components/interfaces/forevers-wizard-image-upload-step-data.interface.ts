import { ImageUploadMethod } from 'src/modules/budsies';
import CustomerImage from './customer-image.interface';

export default interface ForeversWizardImageUploadStepData {
  uploadMethod: ImageUploadMethod,
  customerImages: CustomerImage[]
}

import ForeversWizardImageUploadStepData from './forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from './forevers-wizard-pet-info-step-data.interface';

export default interface ForeversCreationWizardPersistanceState {
  productTypeData?: {
    plushieId: number,
    productSku: string
  },
  imageUploadStepData?: ForeversWizardImageUploadStepData,
  petInfoStepData?: ForeversWizardPetInfoStepData
}

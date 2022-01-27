import ForeversWizardImageUploadStepData from './forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from './forevers-wizard-pet-info-step-data.interface';

export default interface ForeversCreationWizardPersistedState {
  currentStepIndex?: number,
  productTypeData?: {
    plushieId: number,
    productSku: string
  },
  imageUploadStepData?: ForeversWizardImageUploadStepData,
  petInfoStepData?: ForeversWizardPetInfoStepData
}

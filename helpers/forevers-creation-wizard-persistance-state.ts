import { StorageManager } from 'core/lib/storage-manager';
import { SN_BUDSIES } from 'src/modules/budsies/store/mutation-types';

const STORAGE_KEY = 'forevers-creation-wizard-state'

async function getForeversCreationWizardProductTypeStepDataFromLocalStorage (plushieId: number): Promise<any> {
  const budsiesStorage = StorageManager.get(SN_BUDSIES);

  let foreversCreationWizardStateByPlushieId = budsiesStorage.getItem(
    `${STORAGE_KEY}/${plushieId}`
  );

  if (!foreversCreationWizardStateByPlushieId) {
    foreversCreationWizardStateByPlushieId = {};
  }

  return foreversCreationWizardStateByPlushieId;
}

export async function saveForeversCreationWizardProductTypeStepData (plushieId: number, productSku: string): Promise<void> {
  const budsiesStorage = StorageManager.get(SN_BUDSIES);

  let foreversCreationWizardStateByPlushieId = await getForeversCreationWizardProductTypeStepDataFromLocalStorage(plushieId);

  foreversCreationWizardStateByPlushieId.productTypeStepData = {
    plushieId,
    productSku
  }

  await budsiesStorage.setItem(
    `${STORAGE_KEY}/${plushieId}`,
    foreversCreationWizardStateByPlushieId
  )
};

export async function saveForeversCreationWizardImageUploadStepData (plushieId, imageUploadStepData): Promise<void> {
  const budsiesStorage = StorageManager.get(SN_BUDSIES);
  let foreversCreationWizardStateByPlushieId = await getForeversCreationWizardProductTypeStepDataFromLocalStorage(plushieId);

  foreversCreationWizardStateByPlushieId.imageUploadStepData = imageUploadStepData;

  await budsiesStorage.setItem(
    `forevers-creation-wizard-state/${plushieId}`,
    foreversCreationWizardStateByPlushieId
  )
};

export async function saveForeversCreationWizardPetInfoStepData (plushieId, petInfoStepData): Promise<void> {
  const budsiesStorage = StorageManager.get(SN_BUDSIES);
  let foreversCreationWizardStateByPlushieId = await getForeversCreationWizardProductTypeStepDataFromLocalStorage(plushieId);

  foreversCreationWizardStateByPlushieId.petInfoStepData = petInfoStepData;

  await budsiesStorage.setItem(
    `forevers-creation-wizard-state/${plushieId}`,
    foreversCreationWizardStateByPlushieId
  )
};

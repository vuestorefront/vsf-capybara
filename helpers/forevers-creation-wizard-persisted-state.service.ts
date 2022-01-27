import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { SN_BUDSIES } from 'src/modules/budsies/store/mutation-types';
import ForeversCreationWizardPersistanceState from 'theme/components/interfaces/forevers-creation-wizard-persistance-state.interface';
import ForeversWizardImageUploadStepData from 'theme/components/interfaces/forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from 'theme/components/interfaces/forevers-wizard-pet-info-step-data.interface';

const STORAGE_KEY = 'forevers-creation-wizard-state';

class ForeversCreationWizardPersistedStateService {
  private fBudsiesStorage;

  public constructor () {
    debugger;

    this.fBudsiesStorage = StorageManager.get(SN_BUDSIES);
  }

  public async saveProductTypeStepData (plushieId: number, productSku: string): Promise<void> {
    let wizardState = await this.getStateByPlushieId(plushieId);

    if (!wizardState) {
      wizardState = {};
    }

    wizardState.productTypeData = {
      plushieId,
      productSku
    }

    await this.updateStateForPlushie(plushieId, wizardState)
  };

  public async saveImageUploadStepData (plushieId: number, imageUploadStepData: ForeversWizardImageUploadStepData): Promise<void> {
    let wizardState = await this.getStateByPlushieId(plushieId);

    if (!wizardState) {
      wizardState = {};
    }

    wizardState.imageUploadStepData = imageUploadStepData;

    await this.updateStateForPlushie(plushieId, wizardState)
  };

  public async savePetInfoStepData (plushieId: number, petInfoStepData: ForeversWizardPetInfoStepData): Promise<void> {
    let wizardState = await this.getStateByPlushieId(plushieId);

    if (!wizardState) {
      wizardState = {};
    }

    wizardState.petInfoStepData = petInfoStepData;

    await this.updateStateForPlushie(plushieId, wizardState)
  };

  public async getStateByPlushieId (plushieId: number): Promise<ForeversCreationWizardPersistanceState | undefined> {
    let wizardStateDictionary = await this.fBudsiesStorage.getItem(STORAGE_KEY);

    if (!wizardStateDictionary) {
      return;
    }

    return wizardStateDictionary[plushieId];
  }

  public async removeStateByPlushieId (plushieId: number): Promise<void> {
    let wizardStateDictionary = await this.fBudsiesStorage.getItem(STORAGE_KEY);
    if (!wizardStateDictionary || !wizardStateDictionary[plushieId]) {
      return;
    }

    delete wizardStateDictionary[plushieId];

    await this.fBudsiesStorage.setItem(
      STORAGE_KEY,
      wizardStateDictionary
    )
  }

  private async updateStateForPlushie (plushieId: number, state: ForeversCreationWizardPersistanceState): Promise<void> {
    let stateDictionary = await this.fBudsiesStorage.getItem(STORAGE_KEY);

    if (!stateDictionary) {
      stateDictionary = {};
    }

    stateDictionary[plushieId] = state;

    await this.fBudsiesStorage.setItem(
      STORAGE_KEY,
      stateDictionary
    )
  }
}

const foreversCreationWizardPersistedStateService = new ForeversCreationWizardPersistedStateService();

export default foreversCreationWizardPersistedStateService;

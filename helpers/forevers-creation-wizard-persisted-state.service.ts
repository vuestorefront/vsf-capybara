import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { SN_BUDSIES } from 'src/modules/budsies/store/mutation-types';
import ForeversCreationWizardPersistedState from 'theme/components/interfaces/forevers-creation-wizard-persisted-state.interface';
import ForeversWizardImageUploadStepData from 'theme/components/interfaces/forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from 'theme/components/interfaces/forevers-wizard-pet-info-step-data.interface';

const STORAGE_KEY = 'forevers-creation-wizard-state';

class ForeversCreationWizardPersistedStateService {
  private fBudsiesStorage;

  public constructor () {
    this.fBudsiesStorage = StorageManager.get(SN_BUDSIES);
  }

  public async saveCurrentStepIndex (plushieId: number, stepIndex: number): Promise<void> {
    let wizardState = await this.getStateByPlushieId(plushieId);

    if (!wizardState) {
      wizardState = {};
    }

    wizardState.currentStepIndex = stepIndex;

    await this.updateStateForPlushie(plushieId, wizardState);
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

  public async getStateByPlushieId (plushieId: number): Promise<ForeversCreationWizardPersistedState | undefined> {
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

  private async updateStateForPlushie (plushieId: number, state: ForeversCreationWizardPersistedState): Promise<void> {
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

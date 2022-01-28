import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { Dictionary } from 'src/modules/budsies';
import { SN_BUDSIES } from 'src/modules/budsies/store/mutation-types';
import ForeversCreationWizardPersistedState from 'theme/components/interfaces/forevers-creation-wizard-persisted-state.interface';
import ForeversWizardImageUploadStepData from 'theme/components/interfaces/forevers-wizard-image-upload-step-data.interface';
import ForeversWizardPetInfoStepData from 'theme/components/interfaces/forevers-wizard-pet-info-step-data.interface';

const STORAGE_KEY = 'forevers-creation-wizard-state';

class ForeversCreationWizardPersistedStateService {
  private fBudsiesStorage;
  private fLocalState: Dictionary<ForeversCreationWizardPersistedState> = {};

  public constructor () {
    this.fBudsiesStorage = StorageManager.get(SN_BUDSIES);
  }

  public async saveCurrentStepIndex (plushieId: number, stepIndex: number): Promise<void> {
    const newState = {
      currentStepIndex: stepIndex
    };

    await this.updateStateForPlushie(plushieId, newState);
  }

  public async saveProductTypeStepData (plushieId: number, productSku: string): Promise<void> {
    const newState = {
      productTypeData: {
        plushieId,
        productSku
      }
    }

    await this.updateStateForPlushie(plushieId, newState);
  };

  public async saveImageUploadStepData (plushieId: number, imageUploadStepData: ForeversWizardImageUploadStepData): Promise<void> {
    const newState = { imageUploadStepData };

    await this.updateStateForPlushie(plushieId, newState);
  };

  public async savePetInfoStepData (plushieId: number, petInfoStepData: ForeversWizardPetInfoStepData): Promise<void> {
    const newState = { petInfoStepData };

    await this.updateStateForPlushie(plushieId, newState)
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

    let storageWizardState = await this.getStateByPlushieId(plushieId);
    let localWizardState = this.fLocalState[plushieId];

    if (!storageWizardState) {
      storageWizardState = {}
    }

    if (!localWizardState) {
      localWizardState = {};
    }

    const newState = { ...localWizardState, ...storageWizardState, ...state };

    this.fLocalState[plushieId] = newState;

    stateDictionary[plushieId] = newState;

    await this.fBudsiesStorage.setItem(
      STORAGE_KEY,
      stateDictionary
    )
  }
}

const foreversCreationWizardPersistedStateService = new ForeversCreationWizardPersistedStateService();

export default foreversCreationWizardPersistedStateService;

import AddonOption from './addon-option.interface';
import BodypartOption from './bodypart-option';
import ProductionTimeOption from './production-time-option.interface';

export default interface ForeversWizardCustomizeStepData {
  bodypartsValues: Record<string, BodypartOption | BodypartOption[] | undefined>,
  addons: AddonOption[],
  description?: string,
  productionTime?: ProductionTimeOption,
  quantity: number
}
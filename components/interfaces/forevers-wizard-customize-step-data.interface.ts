import BodypartOption from './bodypart-option';

export default interface ForeversWizardCustomizeStepData {
  bodypartsValues: Record<string, BodypartOption | BodypartOption[] | undefined>,
  addons: number[],
  description?: string,
  productionTime?: number,
  quantity: number
}

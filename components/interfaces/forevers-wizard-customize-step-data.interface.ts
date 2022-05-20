import { BodypartOption } from 'src/modules/budsies';

export default interface ForeversWizardCustomizeStepData {
  bodypartsValues: Record<string, BodypartOption | BodypartOption[] | undefined>,
  addons: number[],
  description?: string,
  productionTime?: number,
  quantity: number
}

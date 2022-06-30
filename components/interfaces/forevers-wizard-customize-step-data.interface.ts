import { BodypartOption } from 'src/modules/budsies';

import SizeOption from './size-option';

export default interface ForeversWizardCustomizeStepData {
  bodypartsValues: Record<string, BodypartOption | BodypartOption[] | undefined>,
  addons: number[],
  description?: string,
  productionTime?: number,
  quantity: number,
  size: SizeOption | undefined
}

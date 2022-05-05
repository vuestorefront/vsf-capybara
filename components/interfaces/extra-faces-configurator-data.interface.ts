import { CustomerImage } from 'src/modules/shared';

import ExtraPhotoAddonOption from './extra-photo-addon-option.interface';

export default interface ExtraFacesConfiguratorData {
  addon?: ExtraPhotoAddonOption,
  storageItems: CustomerImage[]
}

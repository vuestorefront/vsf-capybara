import ExtraPhotoAddonOption from './extra-photo-addon-option.interface';
import UploadedArtwork from './uploaded-artwork.interface';

export default interface ExtraFacesConfiguratorData {
  addon?: ExtraPhotoAddonOption,
  storageItems: UploadedArtwork[]
}

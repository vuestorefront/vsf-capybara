<template>
  <div class="m-extra-faces" :class="skinClass">
    <div class="_artwork-upload">
      <div class="_step-title" v-if="isUploadersSubtitleVisible">
        Upload additional photos
      </div>
      <div
        v-for="index in inputsCount"
        :key="'uploader_wrapper_' + index.toString()"
        class="_extra-face-uploader-wrapper"
      >
        <validation-provider
          v-slot="{ errors }"
          :name="'Extra Face ' + index.toString()"
        >
          <input
            name="uploaded_artwork_ids[]"
            type="hidden"
            :value="getUploadedArtworkId(index - 1)"
            required
          >
          <MArtworkUpload
            ref="artwork-upload"
            :product-id="backendProductId"
            :upload-url="uploadUrl"
            :disabled="disabled"
            :file="getInitialArtworkUrl(index - 1)"
            @file-added="(value) => onArtworkAdd(index - 1, value)"
            @file-removed="(storageItemId) => onArtworkRemove(index - 1, storageItemId)"
          />

          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>
      </div>
    </div>

    <div class="_step-description">
      <div class="_step-title">
        Add more pets
      </div>
      <div class="_step-subtitle">
        How many additional faces do you want to add to the same design?
      </div>
    </div>

    <SfSelect
      v-model="selectedVariant"
      v-if="shouldShowAddonSelector"
      name="extra_faces_addon"
      class="_extra-faces-selector sf-select--underlined"
      selected=""
      :disabled="disabled"
    >
      <SfSelectOption value="">
        No extra pets
      </SfSelectOption>

      <SfSelectOption
        v-for="option in availableOptions"
        :key="option.id"
        :value="option"
      >
        {{ option.label }}
      </SfSelectOption>
    </SfSelect>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapMutations } from 'vuex';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { SfSelect } from '@storefront-ui/vue';
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import { Item } from 'src/modules/file-storage';

import MArtworkUpload from './m-artwork-upload.vue';
import ExtraPhotoAddonOption from '../interfaces/extra-photo-addon-option.interface';
import UploadedArtwork from '../interfaces/uploaded-artwork.interface';
import ExtraFacesConfiguratorData from '../interfaces/extra-faces-configurator-data.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'MExtraFaces',
  components: {
    ValidationProvider,
    MArtworkUpload,
    SfSelect
  },
  props: {
    availableOptions: {
      type: Array as PropType<ExtraPhotoAddonOption[]>,
      default: []
    },
    backendProductId: {
      type: String,
      required: true
    },
    uploadUrl: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    initialVariant: {
      type: String,
      default: ''
    },
    initialArtworks: {
      type: Array as PropType<UploadedArtwork[]>,
      default: () => []
    }
  },
  data () {
    return {
      fSelectedVariant: undefined as undefined | ExtraPhotoAddonOption,
      uploaderValues: [] as UploadedArtwork[],
      shouldShowAddonSelector: true
    }
  },
  computed: {
    selectedVariant: {
      get: function (): ExtraPhotoAddonOption | undefined {
        return this.fSelectedVariant;
      },
      set: function (value: ExtraPhotoAddonOption | undefined) {
        this.fSelectedVariant = value;

        let extraPhotosCount = 0;
        if (value) {
          extraPhotosCount = this.inputsCount;
        }

        this.uploaderValues.length = Math.min(
          this.uploaderValues.length,
          extraPhotosCount
        );

        const eventData: ExtraFacesConfiguratorData = {
          addon: value,
          storageItems: [...this.uploaderValues]
        };

        this.$emit('input', eventData)
      }
    },
    skinClass (): string {
      return `-skin-petsies`;
    },
    inputsCount (): number {
      if (!this.selectedVariant) {
        return 0;
      }

      return this.selectedVariant.value;
    },
    isUploadersSubtitleVisible (): boolean {
      return this.inputsCount > 0;
    }
  },
  created (): void {
    for (const artwork of this.initialArtworks) {
      this.uploaderValues.push({
        id: artwork.id,
        url: artwork.url
      });
    }

    const matchingOption = this.availableOptions.find(
      (item) => item.id === this.initialVariant
    );

    if (matchingOption) {
      this.selectedVariant = matchingOption;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: types.PRODUCT_SET_BUNDLE_OPTION
    }),
    clearUploaders (): void {
      const uploaders = this.getUploaders();

      if (!uploaders) {
        return;
      }

      uploaders.forEach(uploader => uploader.clearInput());
    },
    getUploaders (): InstanceType<typeof MArtworkUpload>[] | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload>[] | undefined;
    },
    getUploadedArtworkId (index: number): string | undefined {
      const item = this.uploaderValues[index];
      if (!item) {
        return;
      }

      return item.id;
    },
    getInitialArtworkUrl (index: number): string | undefined {
      const item = this.initialArtworks[index];
      if (!item) {
        return;
      }

      return item.url;
    },
    getFilesIds (): string[] {
      return this.uploaderValues.map(item => item.id);
    },
    reset (): void {
      this.selectedVariant = undefined;
    },
    onArtworkAdd (index: number, value: Item): void {
      Vue.set(this.uploaderValues, index, {
        id: value.id,
        url: value.url
      });

      const eventData: ExtraFacesConfiguratorData = {
        addon: this.selectedVariant,
        storageItems: [...this.uploaderValues]
      };

      this.$emit('input', eventData)
    },
    onArtworkRemove (index: number, storageItemId: string): void {
      this.uploaderValues.splice(index, 1);

      const eventData: ExtraFacesConfiguratorData = {
        addon: this.selectedVariant,
        storageItems: [...this.uploaderValues]
      };

      this.$emit('input', eventData)
    }
  },
  watch: {
    availableOptions: {
      handler (): void {
        // SfSelect doesn't support options updating in the current package version
        this.shouldShowAddonSelector = false;

        this.$nextTick(() => {
          this.shouldShowAddonSelector = true;
        });
      }
    },
    backendProductId: {
      handler (newValue: string, oldValue: string) {
        if (newValue === oldValue) {
          return;
        }

        this.reset();
      },
      immediate: true
    }
  }
})
</script>

<style lang="scss" scoped>
.m-extra-faces {
    margin-top: 1em;

    ._step-description {
        margin: 1em 0;
    }

    ._step-title {
        font-size: var(--font-base);
        font-weight: 800;
        text-align: left;
    }

    ._extra-face-uploader-wrapper {
        margin-top: 0.25em;
        margin-bottom: 0.5em;
    }

    ._error-text {
        font-size: 0.8em;
        margin-top: 0.5em;
    }

    &.-skin-petsies {
        ._error-text {
            color: var(--c-danger-variant);
        }
    }
}
</style>

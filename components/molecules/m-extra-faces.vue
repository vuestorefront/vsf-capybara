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
            :product-id="productId"
            :upload-url="uploadUrl"
            :disabled="disabled"
            :file="getInitialArtworkUrl(index - 1)"
            @input="(value) => onArtworkChange(index - 1, value)"
          />

          <div class="_error-text">
            {{ errors[0] }}
          </div>
        </validation-provider>
      </div>
    </div>

    <div class="_step-description">
      <div class="_step-title">
        Add more faces
      </div>
      <div class="_step-subtitle">
        How many additional faces do you want to add to the same design?
      </div>
    </div>

    <SfSelect
      v-model="selectedVariant"
      name="extra_faces_addon"
      class="_extra-faces-selector"
      selected=""
    >
      <SfSelectOption value="">
        No extra face
      </SfSelectOption>
      <SfSelectOption
        v-for="option in availableOptions"
        :key="option.id"
        :value="option.id"
      >
        {{ option.label }}
      </SfSelectOption>
    </SfSelect>
  </div>
</template>

<script lang="ts">
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Vue, { PropType } from 'vue';
import { SfSelect } from '@storefront-ui/vue';

import FileStorageItem from '../../ts/modules/file-storage/item.model';

import MArtworkUpload from './m-artwork-upload.vue';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export interface AddonOption {
  id: string,
  label: string,
  value: number
}

export interface UploadedAddonArtwork {
  id: string,
  url: string
}

export default Vue.extend({
  name: 'MExtraFaces',
  components: {
    ValidationProvider,
    MArtworkUpload,
    SfSelect
  },
  props: {
    availableOptions: {
      type: Array as PropType<AddonOption[]>,
      default: []
    },
    productId: {
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
      type: Array as PropType<UploadedAddonArtwork[]>,
      default: () => []
    }
  },
  data () {
    return {
      fSelectedVariant: undefined,
      fUploaderValues: []
    }
  },
  computed: {
    selectedVariant: {
      get: function (): string | undefined {
        return this.fSelectedVariant;
      },
      set: function (value: string | undefined) {
        this.fSelectedVariant = value;

        if (!value) {
          return;
        }

        this.fUploaderValues.length = Math.min(
          this.fUploaderValues.length,
          this.inputsCount
        );
      }
    },
    skinClass (): string {
      return `-skin-petsies`;
    },
    inputsCount (): number {
      const matchingOption = this.availableOptions.find(
        (item) => item.id === this.selectedVariant
      );

      return matchingOption ? matchingOption.value : 0;
    },
    isUploadersSubtitleVisible (): boolean {
      return this.inputsCount > 0;
    }
  },
  created (): void {
    for (const artwork of this.initialArtworks) {
      this.fUploaderValues.push({
        id: artwork.id,
        url: artwork.url
      });
    }

    const matchingOption = this.availableOptions.find(
      (item) => item.id === this.initialVariant
    );

    if (matchingOption) {
      this.selectedVariant = matchingOption.id;
    }
  },
  methods: {
    getUploadedArtworkId (index: number): string | undefined {
      const item = this.fUploaderValues[index];
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
    onArtworkChange (index: number, value?: FileStorageItem): void {
      if (!value) {
        this.fUploaderValues[index] = undefined;
        return;
      }

      Vue.set(this.fUploaderValues, index, {
        id: value.id,
        url: value.url
      });
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

<template>
  <div class="m-titled-artwork-upload">
    <div class="_step-title" v-if="title">
      {{ title }}
    </div>

    <validation-provider
      tag="div"
      class="_wrapper"
      v-slot="{ errors }"
      :name="fieldName"
    >
      <input
        :name="`'${title}'`"
        type="hidden"
        :value="uploadedArtworkId"
        required
      >

      <MArtworkUpload
        ref="artwork-upload"
        :allow-multiple="false"
        :product-id="backendProductId"
        :upload-url="uploadUrl"
        :disabled="disabled"
        :initial-items="initialArtworks"
        @file-added="$emit('file-added', $event)"
        @file-removed="$emit('file-removed', $event)"
      />

      <div class="_error-text">
        {{ errors[0] }}
      </div>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import MArtworkUpload from './m-artwork-upload.vue';
import UploadedArtwork from '../interfaces/uploaded-artwork.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'MTitledArtworkUpload',
  components: {
    ValidationProvider,
    MArtworkUpload
  },
  props: {
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
    initialArtworks: {
      type: Array as PropType<UploadedArtwork[]>,
      default: () => []
    },
    fieldName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    uploadedArtwork: {
      type: Object as PropType<UploadedArtwork | undefined>,
      default: undefined
    }
  },
  data () {
    return {
    }
  },
  computed: {
    uploadedArtworkId (): string | undefined {
      return this.uploadedArtwork?.id;
    }
  },
  methods: {
    artworkUploadInitialItems (index: number): UploadedArtwork[] | undefined {
      return this.initialArtworks.length ? [this.initialArtworks[index]] : undefined;
    },
    clearInput (): void {
      const uploader = this.getUploader();
      if (!uploader) {
        return;
      }

      uploader.clearInput();
    },
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    }
  }
})
</script>

<style lang="scss" scoped>

.m-titled-artwork-upload {
  ._step-title {
    font-size: var(--font-base);
    font-weight: 800;
    text-align: left;
  }

  ._wrapper {
    margin-top: var(--spacer-2xs);
  }

  ._error-text {
    color: var(--c-danger-variant);
    font-size: 0.8em;
    margin-top: 0.5em;
  }
}
</style>

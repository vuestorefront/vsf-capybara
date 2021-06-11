<template>
  <div ref="dropzone" class="m-artwork-upload _drop-zone" :class="skinClass">
    <div ref="dropzone-overlay" class="_dropzone-overlay" />

    <slot />

    <div class="_upload-block">
      <file-pond
        ref="file-input"
        class="_uploader"
        :class="{ '-disabled': disabled }"
        :disabled="disabled"
        name="file"
        accepted-file-types="image/gif, image/jpeg, image/png, image/heic, image/heif, application/pdf"
        image-transform-output-mime-type="image/jpeg"
        max-file-size="20MB"
        label-idle="Drag + Drop or <span class='filepond--label-action'> Select File </span>"
        :files="files"
        :allow-multiple="false"
        :allow-drop="true"
        :drop-on-page="true"
        :drop-on-element="false"
        :file-validate-type-detect-type="detectFileType"
        :server="{
          process: processUpload,
          revert: processRevert,
          load: loadExisting,
        }"
        @processfile="onFileProcessed"
        @processfiles="onAllFilesProcessed"
        @addfile="onFileAdded"
        @processfileabort="onFileAbort"
        @removefile="onFileRemoved"
      />
    </div>
  </div>
</template>

<script lang="ts">
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import Vue, { VueConstructor } from 'vue';
import { InjectKey, InjectOptions } from 'vue/types/options';
// Import Vue FilePond
import vueFilePond, { VueFilePondComponent } from 'vue-filepond';
import { File as FilePond, Status } from 'filepond';
// Import image preview and file type validation plugins
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import { ErrorConverterService } from 'src/modules/budsies';
import {
  FileProcessingRepositoryFactory,
  FileProcessingRepository,
  ImageType
} from 'src/modules/file-storage';

// Create component
const FilePondComponent = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview
);

interface FilePondErrorDescription {
  type: string,
  code: number,
  body: string
}

interface FilePondInitialFile {
  source: string,
  options: {
    type: 'input' | 'limbo' | 'local',
    file?: {
      name?: string,
      size?: number,
      type?: string
    },
    metadata?: { [key: string]: any }
  }
}

interface InjectedServices {
  fErrorConverterService: ErrorConverterService,
  fFileProcessingRepositoryFactory: FileProcessingRepositoryFactory
}

type InjectType<T> = Record<keyof T, InjectKey | { from?: InjectKey, default?: any }>;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MArtworkUpload',
  components: {
    FilePond: FilePondComponent
  },
  inject: {
    fErrorConverterService: { from: 'ErrorConverterService' },
    fFileProcessingRepositoryFactory: { from: 'FileProcessingRepositoryFactory' }
  } as unknown as InjectType<InjectedServices>,
  props: {
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
    }
  },
  data () {
    return {
      file: undefined as undefined | string,
      fRemoveRequestsCount: 0,
      fPondStatus: 0,
      fFileProcessingRepository: undefined as undefined | FileProcessingRepository,
      fDragHoverHandler: undefined as undefined | ((e: DragEvent) => void),
      fDragDropHandler: undefined as undefined | ((e: DragEvent) => void)
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    files (): FilePondInitialFile[] | undefined {
      if (!this.file) {
        return undefined;
      }

      return [
        {
          source: this.file,
          options: {
            type: 'local'
          }
        }
      ];
    },
    isBusy (): boolean {
      if (
        [Status.EMPTY, Status.IDLE, Status.ERROR, Status.READY].indexOf(
          this.fPondStatus
        ) === -1
      ) {
        return true;
      }

      return this.fRemoveRequestsCount > 0;
    }
  },
  created () {
    this.fFileProcessingRepository = this.fFileProcessingRepositoryFactory.create(
      this.uploadUrl
    );
    this.fDragHoverHandler = (e: DragEvent) => this.onDropzoneDragHover(e);
    this.fDragDropHandler = (e: DragEvent) => this.onDropzoneDrop(e);
  },
  mounted (): void {
    const dropzone = this.getDropzone();
    const dropzoneOverlay = this.getDropzoneOverlay();

    if (!dropzone || !dropzoneOverlay || !this.fDragHoverHandler || !this.fDragDropHandler) {
      return;
    }

    dropzone.addEventListener('dragover', this.fDragHoverHandler, {
      capture: true
    });

    dropzoneOverlay.addEventListener('dragleave', this.fDragHoverHandler, {
      capture: true
    });

    dropzoneOverlay.addEventListener('drop', this.fDragDropHandler, {
      capture: true
    });
  },
  methods: {
    clearInput (): void {
      const fileInput = this.getFileInput();
      if (!fileInput) {
        return;
      }

      fileInput.removeFiles();
    },
    browseFiles (): void {
      const fileInput = this.getFileInput();
      if (!fileInput || this.disabled) {
        return;
      }

      fileInput.browse();
    },
    async detectFileType (source: File, type: string) {
      if (type) {
        return type;
      }

      return 'image/' + source.name.toLowerCase().split('.').pop();
    },
    async loadExisting (
      source: string,
      load: (file: File | Blob) => void,
      error: (errorText: string) => void,
      progress: (
        lengthComputable: boolean,
        loaded: number,
        total: number
      ) => void,
      abort: () => void
    ) {
      progress(true, 0, 1024);

      const resource = await fetch(source);

      progress(true, 768, 1024);

      const blob = await resource.blob();

      progress(true, 1024, 1024);

      load(blob);

      return {
        abort: () => {
          abort();
        }
      };
    },
    processUpload (
      fieldName: string,
      file: File,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: Record<string, any>,
      load: (id: string) => void,
      error: (errorText: string) => void,
      progress: (
        lengthComputable: boolean,
        loaded: number,
        total: number
      ) => void,
      abort: () => void
      // transfer: (transferId: string) => void,
      // options: any
    ) {
      if (this.disabled || !this.fFileProcessingRepository) {
        error('Operations are disabled!');
        return;
      }

      let isAborted = false;

      this.fFileProcessingRepository
        .uploadFile(
          file,
          ImageType.Artwork,
          this.productId,
          (e: ProgressEvent) => {
            progress(e.lengthComputable, e.loaded, e.total);
          }
        )
        .then((item) => {
          if (isAborted) {
            return;
          }

          load(item.id);
          this.$emit('input', item);
        })
        .catch((e) => {
          const errors = this.fErrorConverterService.describeError(e);
          error(errors[0]);
        });

      return {
        abort: () => {
          isAborted = true;
          abort();
        }
      };
    },
    async processRevert (
      storageItemId: string,
      load: () => void,
      error: (errorText: string) => void
    ) {
      if (this.disabled) {
        return;
      }

      this.fRemoveRequestsCount++;

      try {
        const fileInput = this.getFileInput();
        if (!fileInput) {
          return;
        }

        load();
      } catch (e) {
        const errors = this.fErrorConverterService.describeError(e);
        error(errors[0]);
      } finally {
        this.fRemoveRequestsCount--;
      }
    },
    onFileProcessed (): void {
      this.updateStatus();
    },
    onAllFilesProcessed (): void {
      this.updateStatus();
    },
    onFileAbort (): void {
      this.updateStatus();
    },
    onFileAdded (error: Error): void {
      if (error) {
        return;
      }

      this.updateStatus();
    },
    onFileRemoved (): void {
      this.$emit('input', undefined);
    },
    getDropzone (): HTMLElement | undefined {
      return this.$refs['dropzone'] as HTMLElement;
    },
    getDropzoneOverlay (): HTMLElement | undefined {
      return this.$refs['dropzone-overlay'] as HTMLElement;
    },
    getFileInput (): VueFilePondComponent | undefined {
      return (this.$refs['file-input'] as unknown) as VueFilePondComponent;
    },
    updateStatus (): void {
      const fileInput = this.getFileInput();
      if (!fileInput) {
        this.fPondStatus = 0;
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.fPondStatus = ((fileInput as any)._pond as FilePond).status;
    },
    onDropzoneDragHover (e: DragEvent): void {
      e.preventDefault();
      e.stopPropagation();

      const dropzone = this.getDropzone();
      if (!dropzone) {
        return;
      }

      if (e.type === 'dragover' && !this.disabled) {
        dropzone.classList.add('-drag-hover');
      } else {
        dropzone.classList.remove('-drag-hover');
      }
    },
    async onDropzoneDrop (e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();

      const dropzone = this.getDropzone();
      if (dropzone) {
        dropzone.classList.remove('-drag-hover');
      }

      const fileInput = this.getFileInput();
      if (!e.dataTransfer || !fileInput || this.disabled) {
        return;
      }

      const droppedFiles = [].slice.call(e.dataTransfer.files);

      try {
        await fileInput.addFiles(droppedFiles);
      } catch (e) {
        //
      }
    }
  },
  watch: {
    isBusy: {
      handler (newValue: boolean) {
        this.$emit('is-busy-changed', newValue);
      },
      immediate: false
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/components/atoms/SfButton";
@import "theme/css/components/atoms/SfButton";

.m-artwork-upload {
    &._drop-zone {
        position: relative;

        ._dropzone-overlay {
            bottom: -0.6em;
            display: none;
            left: -0.6em;
            outline: 2px dashed;
            position: absolute;
            right: -0.6em;
            top: -0.6em;
            z-index: 1;
        }

        &.-drag-hover {
            ._dropzone-overlay {
                display: block;
            }
        }
    }

    ._uploader {
        &.-disabled {
            pointer-events: none;
        }
    }

    ::v-deep {
        .filepond--root {
            .filepond--list {
              list-style-image: none;
            }

            .filepond--drop-label {
                .filepond--label-action {
                    @extend .sf-button;
                    @extend .color-secondary;
                    --button-font-size: var(--font-xs);
                    --button-display: inline;
                }
            }

            margin-bottom: 0;
            box-sizing: content-box;

            .filepond--drop-label {
                .filepond--label-action {
                    text-decoration: none;
                    margin-left: 1em;
                }
            }
        }

        .filepond--item {
            &[data-filepond-item-state="processing-complete"] {
                .filepond--file {
                    color: #fefefe;
                }
            }
        }
    }

    &.-skin-petsies {
        ::v-deep {
            .filepond--root {
                .filepond--panel {
                    border: 1px solid #dadad9 !important;
                }

                .filepond--panel-root {
                    background-color: #fafafa;
                }
            }

            .filepond--item {
                &[data-filepond-item-state="processing-complete"] {
                    .filepond--item-panel {
                        background-color: var(--c-text);
                    }

                    .filepond--image-preview-overlay-success {
                        color: var(--c-text);
                    }
                }

                &[data-filepond-item-state*="error"] {
                    .filepond--item-panel {
                        background-color: var(--c-danger-variant);
                    }
                }
            }
        }
    }
}
</style>

<template>
  <div
    class="m-background-uploader"
    :class="[{ '-disabled': disabled }, skinClass]"
  >
    <input
      :id="`background-editor-upload-button-${instanceId}`"
      type="file"
      accept="image/jpeg, image/png, .jpeg, .jpg"
      :style="{
        display: 'none',
      }"
      :disabled="disabled"
      @change="onFileSelect"
    >

    <label
      class="_dropzone"
      :class="{ '-dragover': isDragging }"
      :for="`background-editor-upload-button-${instanceId}`"
      @drop.stop.prevent="onFileDropped"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @dragend.prevent="onDragLeave"
    >
      <span>
        <span class="_drag-label desktop-only">Drag + Drop or</span>
        <span class="sf-button color-secondary _upload-background-button">
          {{ buttonText }}
        </span>
      </span>
    </label>

    <div class="_error-text" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from 'uuid';
import Vue, { VueConstructor } from 'vue';
import { InjectType } from 'src/modules/shared';
import { isServer } from '@vue-storefront/core/helpers';

interface InjectedServices {
  window: Window
}

class UnexpectedReadResultError extends Error {}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MBackgroundUploader',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Select a photo'
    }
  },
  data () {
    return {
      errorMessage: undefined as string | undefined,
      instanceId: uuidv4() as string,
      isDragging: false
    };
  },
  computed: {
    skinClass (): string {
      return `-skin-petsies`;
    },
    scopeId (): string {
      return (this.$options as any)._scopeId;
    }
  },
  methods: {
    readFromDisk (file: File): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const background = reader.result;

          if (!background || typeof background !== 'string') {
            reject(new UnexpectedReadResultError('Unexpected result!'));
            return;
          }

          resolve(background);
        };

        reader.onerror = () => {
          reject(reader.error);
        };
      });
    },
    async readFile (file: File): Promise<void> {
      const userFriendlyErrorMessage = 'Sorry, something went wrong!';

      this.errorMessage = undefined;

      try {
        const background = await this.readFromDisk(file);

        this.$emit('input', true);
        this.$emit('background-uploaded', background);
      } catch (error) {
        this.errorMessage =
          error &&
          error.message &&
          !(error instanceof UnexpectedReadResultError)
            ? error.message
            : userFriendlyErrorMessage;
      }
    },
    onFileDropped (event: DragEvent): void {
      event.preventDefault();

      if (!event.dataTransfer) {
        return;
      }

      const file = event.dataTransfer.files[0];

      if (!file) {
        return;
      }

      this.readFile(file);

      this.isDragging = false;
    },
    onFileSelect (event: Event): void {
      if (!event.target) {
        return;
      }

      const files = (event.target as HTMLInputElement).files as FileList;

      if (!files.length) {
        return;
      }

      this.readFile(files[0]);
    },
    onDragOver (event: DragEvent): void {
      event.preventDefault();
      this.isDragging = true;
    },
    onDragLeave (): void {
      this.isDragging = false;
    },
    dropHandler: function (e: DragEvent) {
      this.onFileDropped(e);
    },
    windowDragOverHandler: (e: DragEvent) => e.preventDefault()
  },
  mounted () {
    if (isServer) {
      return;
    }

    this.window.addEventListener('drop', this.dropHandler, {
      capture: true
    });

    this.window.addEventListener('dragover', this.windowDragOverHandler, {
      capture: true
    });
  },
  beforeDestroy () {
    if (isServer) {
      return;
    }

    this.window.removeEventListener('drop', this.dropHandler);
    this.window.removeEventListener('dragover', this.windowDragOverHandler);
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-background-uploader {
  text-align: center;

  ._dropzone {
    padding: 1.5em;
    text-align: center;
    border: 1px dashed;
    font-size: 1.1em;
    font-weight: 500;
    display: block;

    &.-dragover {
      background-color: rgba(212, 212, 212, 0.6);
    }

    ._drag-label {
      margin-right: 0.5em;
    }

    ._upload-background-button {
      --button-font-size: var(--font-xs);
      display: inline-block;
    }
  }

  ._error-text {
    font-size: 0.8em;
    margin-top: 1em;
    text-align: center;
  }

  &.-disabled {
    opacity: 0.6;
  }

  @media (min-width: $tablet-min) {
    text-align: left;

    ._upload-background-button {
      --button-font-size: var(--font-base);
    }

    ._error-text {
      text-align: left;
    }
  }

  &.-skin-petsies {
    ._error-text {
      color: var(--c-danger-variant);
    }
  }
}
</style>

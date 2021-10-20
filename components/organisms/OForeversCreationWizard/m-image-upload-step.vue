<template>
  <validation-observer
    v-slot="{ passes }"
    class="forevers-wizard-image-upload-step"
    tag="div"
    ref="validation-observer"
  >
    <div class="_upload-now" v-show="isUploadNow">
      <SfHeading
        class="_step-title -required "
        :level="2"
        :title="$t('Upload Photo of Pet')"
      />

      <p>
        {{ $t('Don\'t have your photos? You can finalize your order and') }}
        <a
          class="_popup-link"
          href="javascript:void(0)"
          @click.stop.prevent="switchToUploadLater()"
        >
          {{ $t('send them to us later') }}.
        </a>
      </p>

      <p>
        {{ $t('We recommend 3 photos from different angles. Please try to show your pet\'s special markings') }}.
      </p>

      <validation-provider
        v-slot="{ errors }"
        name="'Artwork'"
        tag="div"
      >
        <input
          type="hidden"
          name="uploaded_artwork_ids[]"
          :value="customerImages"
          :required="isUploadNow"
        >

        <MArtworkUpload
          ref="artwork-upload"
          class="_file-uploader"
          :product-id="backendProductId"
          :disabled="isDisabled"
          :upload-url="artworkUploadUrl"
          :allow-multiple="true"
          :initial-items="initialItems"
          v-if="backendProductId"
          @file-added="onArtworkAdd"
          @file-removed="onArtworkRemove"
          @is-busy-changed="onUploaderIsBusyChanged"
        />
        <div v-else>
          {{ $t('Unable to initialize the uploader control...') }}
        </div>

        <div class="_error-text">
          {{ errors[0] }}
        </div>
      </validation-provider>
    </div>

    <div class="_upload-email" v-show="!isUploadNow">
      <SfHeading
        class="_step-title -required "
        :level="2"
        :title="$t('Provide Photos Later')"
        :subtitle="$t('Please provide within 3 days')"
      />

      <p>
        {{ $t('Want to upload photos now? Please use') }}
        <a
          class="_popup-link"
          href="javascript:void(0)"
          @click.stop.prevent="switchToUploadNow()"
        >
          {{ $t('our uploader') }}.
        </a>
      </p>

      <p>
        {{ $t('When you\'re ready, please email photo to:') }} <br> <a
          class="_popup-link"
          href="mailto:photos@mypetsies.com"
        >photos@mypetsies.com</a>
      </p>

      <p>
        {{ $t('Include this magic word in the subject line of the email') }}:
      </p>
      <p><b>{{ shortcode }}</b></p>

      <p>
        {{ $t('You can do this now or after placing your order') }}.
        {{ $t('We\'ll also send you a reminder email with instructions after you place your order') }}.
      </p>
      <p>
        * <a
          class="_popup-link"
          href="mailto:photos@mypetsies.com"
        >Photos@mypetsies.com</a>
        {{ $t('is an automated inbox used only for receiving images') }}.
      </p>
    </div>

    <div class="_buttons">
      <SfButton
        class="_button"
        :disabled="isDisabled"
        @click="(event) => passes(() => submitStep())"
      >
        {{ $t('Continue') }}
      </SfButton>

      <div class="_second-row">
        <span class="_option-hint">
          Or
        </span>

        <SfButton
          class="_button"
          :disabled="isDisabled"
          @click="toggleUploadMethod()"
        >
          {{ isUploadNow ? $t('Send photos later') : $t('Upload Now') }}
        </SfButton>
      </div>
    </div>

    <p>
      {{ $t('Petsies are not replicas of your pet. They are handcrafted plush works of art. For better or worse, Petsies will not smell, shed, or bite like your pet') }} :)
    </p>
  </validation-observer>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import { SfHeading, SfButton } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';

import {
  ImageUploadMethod,
  ProductId,
  ProductValue
} from 'src/modules/budsies';
import { ImageHandlerService, Item } from 'src/modules/file-storage';
import CustomerImage from 'theme/components/interfaces/customer-image.interface';

import MArtworkUpload from '../../molecules/m-artwork-upload.vue';

import ForeversWizardImageUploadStepData from '../../interfaces/forevers-wizard-image-upload-step-data.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

interface InjectedServices {
  imageHandlerService: ImageHandlerService
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MImageUploadStep',
  components: {
    SfHeading,
    SfButton,
    ValidationObserver,
    ValidationProvider,
    MArtworkUpload
  },
  inject: {
    imageHandlerService: { from: 'ImageHandlerService' }
  },
  props: {
    initialValue: {
      type: Object as PropType<ForeversWizardImageUploadStepData>,
      default: () => ({
        uploadMethod: ImageUploadMethod.NOW,
        customerImages: []
      })
    },
    artworkUploadUrl: {
      type: String,
      required: true
    },
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    plushieId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isUploadProcessingInProgress: false,
      uploadMethod: ImageUploadMethod.NOW,
      customerImages: [] as CustomerImage[],
      initialItems: [] as CustomerImage[]
    }
  },
  computed: {
    backendProductId (): string | undefined {
      if (!this.product) {
        return undefined;
      }

      switch (this.product.id) {
        case ProductId.FOREVERS_DOG:
          return ProductValue.FOREVERS_DOG;
        case ProductId.FOREVERS_CAT:
          return ProductValue.FOREVERS_CAT;
        case ProductId.FOREVERS_OTHER:
          return ProductValue.FOREVERS_OTHER;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.product.id}' product ID`
          );
      }
    },
    isDisabled (): boolean {
      return this.disabled || this.isUploadProcessingInProgress;
    },
    isUploadNow (): boolean {
      if (!this.uploadMethod) {
        return true;
      }

      return this.uploadMethod === ImageUploadMethod.NOW;
    },
    shortcode (): string | undefined {
      return this.$store.getters['budsies/getPlushieShortcode'](this.plushieId);
    }
  },
  methods: {
    switchUploadMethod (method: ImageUploadMethod): void {
      if (this.isDisabled) {
        return;
      }

      this.uploadMethod = method;

      const customerImages = method === ImageUploadMethod.NOW ? [...this.customerImages] : [];

      const newValue: ForeversWizardImageUploadStepData = {
        uploadMethod: method,
        customerImages
      }

      this.$emit('input', newValue);
    },
    switchToUploadNow (): void {
      this.switchUploadMethod(ImageUploadMethod.NOW);
    },
    switchToUploadLater (): void {
      this.switchUploadMethod(ImageUploadMethod.EMAIL);
    },
    onArtworkAdd (value: Item): void {
      this.customerImages.push({
        id: value.id,
        url: this.imageHandlerService.getOriginalImageUrl(value.url)
      });

      const newValue: ForeversWizardImageUploadStepData = {
        uploadMethod: this.uploadMethod,
        customerImages: [...this.customerImages]
      }

      this.$emit('input', newValue);
    },
    onArtworkRemove (storageItemId: string): void {
      const index = this.customerImages.findIndex(({ id }) => id === storageItemId);

      if (index === -1) {
        return;
      }

      this.customerImages.splice(index, 1);

      const newValue: ForeversWizardImageUploadStepData = {
        uploadMethod: this.uploadMethod,
        customerImages: [...this.customerImages]
      }

      this.$emit('input', newValue);
    },
    onUploaderIsBusyChanged (value: boolean): void {
      this.isUploadProcessingInProgress = value;
    },
    submitStep (): void {
      this.$emit('next-step');
    },
    toggleUploadMethod (): void {
      if (this.isDisabled) {
        return;
      }

      const method = this.uploadMethod === ImageUploadMethod.EMAIL ? ImageUploadMethod.NOW : ImageUploadMethod.EMAIL;
      this.switchUploadMethod(method);
    },
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    }
  },
  created (): void {
    this.uploadMethod = this.initialValue.uploadMethod;
    this.customerImages = this.initialValue.customerImages;
    this.initialItems = [ ...this.customerImages ];
  },
  watch: {
    plushieId: {
      handler () {
        if (!this.plushieId) {
          return;
        }

        this.$store.dispatch('budsies/loadPlushieShortcode', { plushieId: this.plushieId });
      },
      immediate: true
    }
  }
});

</script>

<style lang="scss" scoped>
.forevers-wizard-image-upload-step {
  ._file-uploader {
    margin-top: var(--spacer-base);
  }

  ._upload-now {
    margin-bottom: var(--spacer-xl);
  }

  ._error-text {
    color: var(--c-danger-variant);
    font-size: var(--font-xs);
    margin-top: var(--spacer-sm);
    height: calc(var(--font-xs) * 1.2);
  }

  ._buttons {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    margin-top: var(--spacer-xl);
    text-align: right;

    ._button {
      display: inline-block;
    }

    ._second-row {
      margin-top: var(--spacer-base);
    }

    ._option-hint {
      font-size: var(--h3-font-size);
      padding: 0 1em;
    }
  }
}
</style>

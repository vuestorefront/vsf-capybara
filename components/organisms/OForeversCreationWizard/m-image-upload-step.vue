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
          @click.stop.prevent="switchUploadMethod('later')"
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
          :value="value.storageItemId"
          :required="isUploadNow"
        >

        <MArtworkUpload
          ref="artwork-upload"
          class="_file-uploader"
          :product-id="backendProductId"
          :disabled="isSubmitting"
          :upload-url="artworkUploadUrl"
          @input="onArtworkChange"
          v-if="backendProductId"
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
        title="Provide Photos Later"
        :subtitle="$t('Please provide within 3 days')"
      />

      <p>
        {{ $t('Want to upload photos now? Please use') }}
        <a
          class="_popup-link"
          href="javascript:void(0)"
          @click.stop.prevent="switchUploadMethod('now')"
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
import Vue, { PropType } from 'vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

import { SfHeading, SfButton } from '@storefront-ui/vue';
import Product from 'core/modules/catalog/types/Product';

import {
  ProductValue,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';
import { Item } from 'src/modules/file-storage';

import MArtworkUpload from '../../molecules/m-artwork-upload.vue';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

export default Vue.extend({
  name: 'MImageUploadStep',
  components: {
    SfHeading,
    SfButton,
    ValidationObserver,
    ValidationProvider,
    MArtworkUpload
  },
  props: {
    value: {
      type: Object as PropType<any>,
      default: () => ({
        uploadMethod: 'now',
        storageItemId: undefined
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
    }
  },
  data () {
    return {
      isSubmitting: false

    }
  },
  computed: {
    backendProductId (): string | undefined {
      if (!this.product) {
        return undefined;
      }

      switch (this.product.id) {
        case 73:
          return ProductValue.FOREVERS_DOG;
        case 74:
          return ProductValue.FOREVERS_CAT;
        case 75:
          return ProductValue.FOREVERS_OTHER;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.product.id}' product ID`
          );
      }
    },
    isUploadNow (): boolean {
      if (!this.value.uploadMethod) {
        return true;
      }

      return this.value.uploadMethod === 'now';
    },
    shortcode (): string | undefined {
      return this.$store.getters['budsies/getPlushieShortcode'](this.plushieId);
    }
  },
  methods: {
    switchUploadMethod (method: 'later' | 'now'): void {
      const storageItemId = method === 'now' ? this.value.storageItemId : undefined;

      this.$emit('input', {
        uploadMethod: method,
        storageItemId
      });
    },
    onArtworkChange (value?: Item): void {
      let storageItemId;
      if (value) {
        storageItemId = value.id;
      }

      this.$emit('input', {
        uploadMethod: this.value.uploadMethod,
        storageItemId
      });
    },
    submitStep (): void {
      this.$emit('next-step');
    },
    toggleUploadMethod (): void {
      const method = this.value.uploadMethod === 'later' ? 'now' : 'later';
      this.switchUploadMethod(method);
    },
    getUploader (): InstanceType<typeof MArtworkUpload> | undefined {
      return this.$refs['artwork-upload'] as InstanceType<typeof MArtworkUpload> | undefined;
    }
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

<style lang="scss">
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

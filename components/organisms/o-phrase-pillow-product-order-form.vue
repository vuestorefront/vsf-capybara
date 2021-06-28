<template>
  <div class="o-phrase-pillow-product-order-form" :class="skinClass">
    <div class="_header">
      <header class="sf-heading sf-heading--no-underline">
        <h1 class="sf-heading__title">
          Pillow Customizer
        </h1>
      </header>

      <div class="_notes">
        <p>Ships within 7 days | Made & Printed in the USA</p>
      </div>

      <header class="sf-heading sf-heading--no-underline">
        <h3 class="sf-heading__title--h3 desktop-only">
          Your customizations will appear on the left side of the page
        </h3>
        <h4 class="sf-heading__title--h4 _accent-header mobile-only">
          Scroll down for a preview of your customizations
        </h4>
      </header>
    </div>

    <validation-observer v-slot="{ passes }" slim>
      <div class="_page-content">
        <div class="_customization-section">
          <div class="_section-header _h2">
            <h2>Customize Your Pillow</h2>
          </div>

          <form
            method="POST"
            action="url"
            @submit.prevent="
              (event) => passes(() => onSubmit(event))
            "
          >
            <validation-provider
              v-slot="{ errors, classes }"
              :rules="{
                required: {
                  allowFalse: false,
                },
              }"
              :custom-messages="{
                required:
                  'Please, upload the background image!',
              }"
              :name="'Background Image'"
              slim
            >
              <div
                class="_background-image-field"
                :class="classes"
              >
                <label class="_step">
                  <span class="_step-marker">STEP 1:</span>
                  Upload your photo
                </label>

                <m-background-uploader
                  ref="backgroundUploader"
                  v-model="isBackgroundImageLoaded"
                  class="_background-uploader"
                  :button-text="uploadButtonText"
                  :disabled="isDisabled"
                  @background-uploaded="onBackgroundImageUploaded"
                />

                <div
                  class="_background-hint _helper-text"
                  v-show="isBackgroundImageLoaded"
                >
                  Use the move and crop controls in the
                  <a href="#live-preview-section">pillow preview area</a>
                  to adjust the look of your pillow. We
                  recommend adjusting your photo so the text
                  does not obstruct the face(s).
                </div>

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <validation-provider
              v-slot="{ errors, classes }"
              rules="required"
              :name="'Front Design'"
              slim
            >
              <div class="_front-design-field" :class="classes">
                <!-- <design-selector
                  v-model="frontDesign"
                  class="_front-selector"
                  :design-products="frontDesignProducts"
                  :field-name="'front-design-sku'"
                  :disabled="isDisabled"
                  @input="onFrontDesignSelect"
                /> -->

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <div
              class="_custom-text-fields-section"
              v-show="hasCustomFields"
            >
              <label class="_step">
                <span class="_step-marker">STEP 2:</span>
                Add custom text
              </label>

              <div
                v-for="field in customTextFields"
                :key="field.name"
                class="_custom-text-field"
              >
                <validation-provider
                  v-slot="{ errors, classes }"
                  :name="field.label"
                  slim
                >
                  <div :class="classes">
                    <label class="_label">{{
                      field.label
                    }}</label>

                    <input
                      v-model="
                        customTextValues[field.name]
                      "
                      class="_custom-input"
                      type="text"
                      :name="field.name"
                      :disabled="isDisabled"
                      :placeholder="field.placeholder"
                    >

                    <div class="_helper-text">
                      {{ field.helperText }}
                    </div>

                    <div class="_error-text">
                      {{ errors[0] }}
                    </div>
                  </div>
                </validation-provider>
              </div>
            </div>

            <div>
              <validation-provider
                v-slot="{ errors, classes }"
                rules="required"
                :name="'Back Design'"
                slim
              >
                <div
                  class="_back-design-field"
                  :class="classes"
                >
                  <label class="_step"><span class="_step-marker">STEP
                    {{ hasCustomFields ? 3 : 2 }}:</span>
                    Select design for the back of
                    pillow</label>

                  <div class="_helper-text">
                    You can choose a blank back, a standard
                    design, or one of our premium options.
                    Some styles will dynamically change
                    based on the accent color chosen below.
                  </div>

                  <!-- <design-selector
                    v-model="backDesign"
                    class="_back-selector"
                    :design-products="backDesignProducts"
                    :field-name="'back-design-sku'"
                    :disabled="isDisabled"
                    :should-collapse="false"
                    @input="onBackDesignSelect"
                  /> -->

                  <div class="_error-text">
                    {{ errors[0] }}
                  </div>
                </div>
              </validation-provider>
            </div>

            <validation-provider
              v-slot="{ errors, classes }"
              rules="required"
              :name="'Accent Color'"
              slim
              v-if="isAccentColorSelectorVisible"
            >
              <div class="_accent-color-field" :class="classes">
                <label>Accent Color</label>

                <div class="_helper-text">
                  Selected pillow back designs will may be
                  customized with the accent color of your
                  choosing.
                </div>

                <!-- <accent-color-selector
                  v-model="accentColorPartValue"
                  class="_accent-color-selector-container"
                  :accent-color-part-values="
                    accentColorPartValues
                  "
                  :disabled="isDisabled"
                  @input="onAccentColorSelect"
                /> -->

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <validation-provider
              v-slot="{ errors, classes }"
              rules="required"
              :name="'Quantity'"
              slim
            >
              <div class="_quantity-field" :class="classes">
                <label>Quantity</label>

                <!-- <product-quantity
                  v-model="quantity"
                  class="_qty-container"
                  :disabled="isDisabled"
                /> -->

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <div
              class="_final-steps"
              v-if="
                isEmailRequired || isProductionOptionsAvailable
              "
            >
              <label class="_label _step"><span class="_step-marker">STEP {{ hasCustomFields ? 4 : 3 }}:</span>
                <template v-if="isProductionOptionsAvailable">
                  Final Steps
                </template>
                <template v-else>
                  Enter your email address
                </template>
              </label>

              <validation-provider
                v-slot="{ errors, classes }"
                rules="required"
                name="E-mail"
                slim
                v-if="isEmailRequired"
              >
                <div
                  class="_email-field"
                  :class="classes"
                  v-if="isEmailRequired"
                >
                  <label v-if="isProductionOptionsAvailable">
                    Enter your email address
                  </label>
                  <input
                    v-model="customerEmail"
                    class="_email-field-input"
                    type="email"
                    name="customer_email"
                    :disabled="isDisabled"
                  >

                  <div class="_error-text">
                    {{ errors[0] }}
                  </div>

                  <div class="_email-disclaimer _helper-text">
                    Sometimes our team has questions about
                    your design
                  </div>
                </div>
              </validation-provider>

              <validation-provider
                v-slot="{ errors, classes }"
                name="Production time"
                slim
                v-if="isProductionOptionsAvailable"
              >
                <label for="rush_addons">
                  Choose your production time
                </label>
                <div
                  class="_production-time-field"
                  :class="classes"
                >
                  <!-- <production-time
                    ref="productionTime"
                    v-model="productionTime"
                    :production-time-options="
                      productionTimeOptions
                    "
                  /> -->
                </div>

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="_bottom-static-block">
              <slot name="bottom-static-block" />
            </div>

            <div class="_actions-row" v-show="!isSubmitting">
              <SfButton class="color-primary" type="submit" :disabled="isDisabled">
                Add to Cart
              </SfButton>

              <div class="_submit-disclaimer _helper-text">
                I have seen and approve the Live Preview of my
                design.
              </div>
            </div>

            <div class="_animation-row">
              <!-- <submit-animator
                ref="submitAnimator"
                :duration="20000"
                :steps="submitAnimationSteps"
                :animation-url="submitAnimationUrl"
                v-show="isSubmitting"
              /> -->
            </div>

            <m-form-errors :form-errors="submitErrors" />
          </form>
        </div>
        <div
          id="live-preview-section"
          class="_live-preview-section"
        >
          <div class="_section-header _h2">
            <h2>Live Preview</h2>
          </div>

          <div class="_front_design_preview_container">
            <div class="_section-header _h3">
              <h5>Front Side</h5>
            </div>

            <!-- <background-editor
              ref="backgroundEditor"
              class="_front-preview"
              :disabled="isDisabled"
              :background-offset-settings="backgroundOffsetSettings"
            >
              <slot>
                <live-preview
                  ref="frontPreview"
                  :template-fetch-url="svgPath"
                  :design-s-k-u="frontDesign"
                  :accent-color="accentColor"
                  :custom-text-values="customTextValues"
                  @custom-text-fields-prepared="
                    onFrontCustomTextFieldsPrepared
                  "
                  @colored-elements-counted="
                    onFrontAccentColorElementsCounted
                  "
                  @background-offset-settings-prepared="
                    onBackgroundOffsetSettingsPrepared
                  "
                  v-if="frontDesign"
                />
              </slot>
            </background-editor> -->
          </div>

          <div class="_back_design_preview_container">
            <div class="_section-header _h3">
              <h5>Back Side</h5>
            </div>

            <!-- <live-preview
              ref="backPreview"
              class="_back-preview"
              :template-fetch-url="svgPath"
              :design-s-k-u="backDesign"
              :accent-color="accentColor"
              :custom-text-values="customTextValues"
              :is-background-loaded="isBackgroundImageLoaded"
              @custom-text-fields-prepared="
                onBackCustomTextFieldsPrepared
              "
              @colored-elements-counted="
                onBackAccentColorElementsCounted
              "
              v-if="backDesign"
            /> -->
          </div>

          <div
            class="_design-images-container"
            v-if="currentDesignImages.length"
          >
            <div class="_section-header _h3">
              <h3>Examples of finished pillows</h3>
            </div>

            <!-- <design-images
              class="_design-images"
              :images="currentDesignImages"
            /> -->
          </div>
        </div>
      </div>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import axios, { AxiosRequestConfig } from 'axios';
import { SfButton } from '@storefront-ui/vue';

import FileProcessingRepository from 'src/modules/file-storage/file-processing.repository';
import ErrorConverterService from 'src/modules/budsies/services/error-converter.service';
import { ImageType } from 'src/modules/file-storage/image-type.value';
import isAxiosError from 'src/modules/budsies/services/is-axios-error.typeguard';

import MFormErrors from '../molecules/m-form-errors.vue';
import MBackgroundUploader from '../molecules/m-background-uploader.vue';
// import LivePreview from './LivePreview.vue';
// import BackgroundEditor from './BackgroundEditor.vue';
// import SubmitAnimator from './SubmitAnimator.vue';

import CustomTextFieldInterface from '../interfaces/custom-text-field.interface';
import DesignProduct from '../interfaces/design-product.interface';
import AccentColorPart from '../interfaces/accent-color-part.interface';
import SubmitAnimationStepsInterface from '../interfaces/submit-animation-steps.interface';
import ProductionTimeOption from '../interfaces/production-time-option.interface';
import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';
import Vue, { PropType, VueConstructor } from 'vue';
import { InjectKey } from 'vue/types/options';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

configure({
  classes: {
    valid: '-valid',
    invalid: '-invalid',
    dirty: '-dirty',
    required: '-required'
  }
});

const TARGET_IMAGE_SIZE = 2625;

interface InjectedServices {
  fErrorConverterService: ErrorConverterService
}

type InjectType<T> = Record<keyof T, InjectKey | { from?: InjectKey, default?: any }>;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'OPhrasePillowProductOrderForm',
  components: {
    SfButton,
    // BackgroundEditor,
    // LivePreview,
    // DesignSelector,
    // ProductQuantity,
    ValidationObserver,
    ValidationProvider,
    // AccentColorSelector,
    MBackgroundUploader,
    MFormErrors
    // SubmitButton,
    // DesignImages,
    // SubmitAnimator,
    // ProductionTime
  },
  inject: {
    fErrorConverterService: { from: 'ErrorConverterService' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    imageUploadUrl: {
      type: String,
      required: true
    },
    uploadProductType: {
      type: String,
      required: true
    },
    svgPath: {
      type: String,
      required: true
    },
    accentColorPartId: {
      type: Number,
      required: true
    },
    frontDesignProducts: {
      type: Array as PropType<DesignProduct[]>,
      required: true
    },
    backDesignProducts: {
      type: Array as PropType<DesignProduct[]>,
      required: true
    },
    accentColorPartValues: {
      type: Array as PropType<AccentColorPart[]>,
      required: true
    },
    initialFrontDesign: {
      type: String,
      default: undefined
    },
    initialBackDesign: {
      type: String,
      default: undefined
    },
    initialAccentColorPartValue: {
      type: Number,
      default: undefined
    },
    isEmailRequired: {
      type: Boolean,
      default: true
    },
    submitAnimationSteps: {
      type: Array as PropType<SubmitAnimationStepsInterface[]>,
      required: true
    },
    submitAnimationUrl: {
      type: String,
      required: true
    },
    productionTimeOptions: {
      type: Array as PropType<ProductionTimeOption[]>,
      required: true
    }
  },
  data () {
    return {
      customTextValues: {},
      quantity: 1,
      accentColorPartValue: undefined as number | undefined,
      frontDesign: undefined as string | undefined,
      backDesign: undefined as string | undefined,
      customerEmail: undefined as string | undefined,
      backgroundDataUri: undefined as string | undefined,
      isBackgroundImageLoaded: false,
      backgroundOffsetSettings: undefined as BackgroundOffsetSettings | undefined,
      productionTime: undefined as string | undefined,
      fBackCustomTextFields: [] as CustomTextFieldInterface[],
      fFrontCustomTextFields: [] as CustomTextFieldInterface[],
      fFrontAccentColorElementsNumber: 0,
      fBackAccentColorElementsNumber: 0,
      fFileProcessingRepository: undefined as FileProcessingRepository | undefined,
      fIsDisabled: false,
      fIsSubmitting: false,
      fIsAccentColorSelectedByUser: false,
      fIsBackDesignSelectedByUser: false,
      fSubmitErrors: [] as string[]
    }
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    accentColor (): string | undefined {
      if (!this.accentColorPartValue) {
        return undefined;
      }

      const value = this.accentColorPartValues.find(
        (item) => item.id === this.accentColorPartValue
      );

      if (!value) {
        return undefined;
      }

      return value.background;
    },
    customTextFields (): CustomTextFieldInterface[] {
      const fields = [...this.fFrontCustomTextFields];

      this.fBackCustomTextFields.forEach((element) => {
        const field = fields.find((item) => item.name === element.name);

        if (field) {
          field.name = element.name;
          field.label = element.label;
          field.placeholder = element.placeholder;
          field.helperText = element.helperText;
          return;
        }

        fields.push(element);
      });

      return fields;
    },
    hasCustomFields (): boolean {
      return this.customTextFields.length !== 0;
    },
    currentDesignImages (): string[] {
      if (!this.frontDesign) {
        return [];
      }

      const currentDesign = this.frontDesignProducts.find(
        (product) => product.sku === this.frontDesign
      );

      if (!currentDesign) {
        return [];
      }

      return currentDesign.images.map((item) => item.stage);
    },
    isDisabled (): boolean {
      return this.fIsDisabled || this.fIsSubmitting;
    },
    isSubmitting (): boolean {
      return this.fIsSubmitting;
    },
    submitErrors (): string[] {
      return this.fSubmitErrors;
    },
    uploadButtonText (): string {
      return this.isBackgroundImageLoaded ? 'Change photo' : 'Select a photo';
    },
    isAccentColorSelectorVisible (): boolean {
      return (
        this.fFrontAccentColorElementsNumber > 0 ||
            this.fBackAccentColorElementsNumber > 0
      );
    },
    isProductionOptionsAvailable (): boolean {
      return this.productionTimeOptions.length !== 0;
    }
  },
  methods: {
    onAccentColorSelect (): void {
      this.fIsAccentColorSelectedByUser = true;
    },
    onBackDesignSelect (): void {
      this.fIsBackDesignSelectedByUser = true;

      this.selectDefaultAccentColor(this.frontDesign, this.backDesign);
    },
    onFrontDesignSelect (): void {
      this.selectDefaultBackDesignForFront(this.frontDesign);

      this.selectDefaultAccentColor(this.frontDesign, this.backDesign);
    },
    onBackgroundImageUploaded (image: string): void {
      const backgroundEditor = this.getBackgroundEditor();

      if (!backgroundEditor) {
        throw new Error('Unable to get Background editor element!');
      }

      this.backgroundDataUri = image;
      backgroundEditor.setBackgroundImage(this.backgroundDataUri);
    },
    onBackCustomTextFieldsPrepared (
      textFields: CustomTextFieldInterface[]
    ): void {
      this.fBackCustomTextFields = textFields;
    },
    onFrontCustomTextFieldsPrepared (
      textFields: CustomTextFieldInterface[]
    ): void {
      this.fFrontCustomTextFields = textFields;
    },
    onFrontAccentColorElementsCounted (
      coloredElementsNumber: number
    ): void {
      this.fFrontAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackAccentColorElementsCounted (
      coloredElementsNumber: number
    ): void {
      this.fBackAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackgroundOffsetSettingsPrepared (
      settings: BackgroundOffsetSettings
    ): void {
      this.backgroundOffsetSettings = settings;
    },
    async onSubmit (): Promise<void> {
      if (this.isDisabled) {
        return;
      }

      this.fSubmitErrors = [];

      this.fIsSubmitting = true;

      try {
        await this.performSubmit();
      } catch (error) {
        let errorToParse: any = error;

        if (isAxiosError(error) && error.response) {
          errorToParse = error.response.data;
        }

        this.fSubmitErrors = this.fErrorConverterService.describeError(
          errorToParse
        );

        this.fIsSubmitting = false;
      }
    },
    /* getBackgroundEditor (): BackgroundEditor | undefined {
      return this.$refs['backgroundEditor'] as BackgroundEditor | undefined;
    },
    getBackPreview (): LivePreview | undefined {
      return this.$refs['backPreview'] as LivePreview | undefined;
    },
    getFrontPreview (): LivePreview | undefined {
      return this.$refs['frontPreview'] as LivePreview | undefined;
    },
    getSubmitAnimator (): SubmitAnimator | undefined {
      return this.$refs['submitAnimator'] as SubmitAnimator | undefined;
    }, */
    getBackgroundEditor () {
      return this.$refs['backgroundEditor'];
    },
    getBackPreview () {
      return this.$refs['backPreview'];
    },
    getFrontPreview () {
      return this.$refs['frontPreview'];
    },
    getSubmitAnimator () {
      return this.$refs['submitAnimator'];
    },
    getBlobFromDataUri (dataUri: string): Blob {
      const byteString = atob(dataUri.split(',')[1]);
      const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    },
    async performSubmit (): Promise<void> {
      const submitAnimator = this.getSubmitAnimator();
      if (!submitAnimator) {
        throw new Error('Submit animation is not available!');
      }

      submitAnimator.runProgress();

      const backgroundEditor = this.getBackgroundEditor();
      const backPreview = this.getBackPreview();
      const frontPreview = this.getFrontPreview();

      if (!backgroundEditor || !backPreview || !frontPreview) {
        throw new Error('Unable to get preview elements!');
      }

      const image = await backgroundEditor.getCroppedBackground();
      if (!image) {
        throw new Error('Background image is unavailable!');
      }

      const backSvg = backPreview.getCustomizedSVG(
        TARGET_IMAGE_SIZE
      );
      const frontSvg = frontPreview.getCustomizedSVG(
        TARGET_IMAGE_SIZE,
        image
      );

      if (!backSvg || !frontSvg) {
        throw new Error('Unable to get vector images for conversion!');
      }

      if (!this.backgroundDataUri) {
        throw new Error('Unable to get original background photo!');
      }

      if (
        !this.frontDesign ||
            !this.backDesign ||
            (!this.accentColorPartValue && this.isAccentColorSelectorVisible)
      ) {
        throw new Error(
          'Design variants or accent color are not specified!'
        );
      }

      const backDesignBlob = new Blob([backSvg], { type: 'image/svg+xml' });
      const frontDesignBlob = new Blob([frontSvg], { type: 'image/svg+xml' });
      const backgroundBlob = this.getBlobFromDataUri(this.backgroundDataUri);

      const [
        frontStorageItem,
        backStorageItem,
        backgroundOriginalItem
      ] = await Promise.all([
        this.fFileProcessingRepository.uploadFile(
          frontDesignBlob,
          ImageType.Artwork,
          this.uploadProductType
        ),
        this.fFileProcessingRepository.uploadFile(
          backDesignBlob,
          ImageType.Artwork,
          this.uploadProductType
        ),
        this.fFileProcessingRepository.uploadFile(
          backgroundBlob,
          ImageType.Artwork,
          this.uploadProductType
        )
      ]);

      const formData = new FormData();

      formData.append('back_artwork_storage_id', backStorageItem.id);
      formData.append('front_artwork_storage_id', frontStorageItem.id);
      formData.append('background_original', backgroundOriginalItem.id);
      formData.append('front_design_sku', this.frontDesign);
      formData.append('back_design_sku', this.backDesign);
      formData.append('quantity', this.quantity.toString());
      if (this.productionTime !== undefined) {
        formData.append('rush_addons', this.productionTime);
      }

      if (this.isAccentColorSelectorVisible && this.accentColorPartValue) {
        formData.append(
          `body_parts[${this.accentColorPartId}]`,
          this.accentColorPartValue.toString()
        );
      }

      if (
        this.customTextValues &&
            Object.keys(this.customTextValues).length > 0
      ) {
        const customTextValuesToSubmit: Record<
        string,
        string | undefined
        > = {};

        this.customTextFields.forEach((field) => {
          customTextValuesToSubmit[field.name] = this.customTextValues[field.name];
        });

        formData.append(
          'custom_fields_values',
          JSON.stringify(customTextValuesToSubmit)
        );
      }

      if (this.customerEmail) {
        formData.append('customer_email', this.customerEmail);
      }

      const options: AxiosRequestConfig = {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      };

      const result = await axios.post('url', formData, options);

      /* if (result.data.redirectUrl) {
        this.fWindow.location.href = result.data.redirectUrl;
      } */
    },
    selectDefaultBackDesignForFront (frontDesignSku?: string): void {
      if (!frontDesignSku || this.fIsBackDesignSelectedByUser) {
        return;
      }

      const currentDesign = this.frontDesignProducts.find(
        (product) => product.sku === frontDesignSku
      );

      if (!currentDesign || !currentDesign.defaultOtherSideDesign) {
        return;
      }

      const backDesign = this.backDesignProducts.find(
        (product) => product.id === currentDesign.defaultOtherSideDesign
      );

      if (!backDesign) {
        return;
      }

      this.backDesign = backDesign.sku;
    },
    selectDefaultAccentColor (
      frontDesignSku?: string,
      backDesignSku?: string
    ): void {
      if (this.fIsAccentColorSelectedByUser) {
        return;
      }

      if (!frontDesignSku && !backDesignSku) {
        return;
      }

      let accentColorId: number | undefined;

      if (frontDesignSku) {
        const frontDesign = this.frontDesignProducts.find(
          (product) => product.sku === frontDesignSku
        );

        if (frontDesign) {
          accentColorId = frontDesign.defaultAccentColor;
        }
      }

      if (!accentColorId && backDesignSku) {
        const backDesign = this.backDesignProducts.find(
          (product) => product.sku === backDesignSku
        );

        if (backDesign) {
          accentColorId = backDesign.defaultAccentColor;
        }
      }

      if (!accentColorId) {
        return;
      }

      const accentColor = this.accentColorPartValues.find(
        (color) => color.id === accentColorId
      );

      if (!accentColor) {
        return;
      }

      this.accentColorPartValue = accentColor.id;
    }
  },
  created (): void {
    if (this.initialFrontDesign) {
      this.frontDesign = this.initialFrontDesign;
    }

    if (this.initialBackDesign) {
      this.backDesign = this.initialBackDesign;
    }

    if (this.initialAccentColorPartValue) {
      this.accentColorPartValue = this.initialAccentColorPartValue;
    }

    if (this.isProductionOptionsAvailable) {
      this.productionTime = this.productionTimeOptions[0].value;
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-phrase-pillow-product-order-form {
    padding: 2em 0 4em;

    ._notes {
        text-align: center;
    }

    ._page-content {
        margin-top: 1em;
        display: flex;
        flex-direction: column;
    }

    ._section-header {
        margin-top: 1em;
        margin-bottom: 1em;
        text-align: center;
    }

    ._front_design_preview_container,
    ._customization-section {
        ._error-text {
            margin-top: 1em;
        }
    }

    ._front_design_preview_container {
        text-align: center;
    }

    ._back_design_preview_container,
    ._design-images-container {
        margin-top: 5%;
    }

    ._front-preview,
    ._back-preview,
    ._design-images {
        width: 100%;
    }

    ._customization-section {
        label {
            font-size: 1.125em;
            font-weight: 500;
            margin: 1em 0 0.5em;
            width: 100%;
            cursor: auto;

            ._step-marker {
                border-bottom: 4px solid;
                font-size: 1.43em;
                font-weight: bold;
                text-transform: uppercase;
            }
        }

        ._step {
            margin-top: 2em;
        }

        ._error-text {
            display: none;
            font-size: 0.8em;
        }

        ._helper-text {
            margin: 0.5em 0;
        }

        ._background-hint {
            margin: 1em 0;
        }

        .-invalid {
            ._error-text {
                display: block;
            }
        }

        ._quantity-field,
        ._email-field,
        ._actions-row,
        ._animation-row,
        ._accent-color-field,
        ._front-design-field,
        ._back-design-field,
        ._final-steps {
            margin-top: 1.5em;
            text-align: center;
        }

        ._custom-text-fields-section {
            text-align: center;

            ._custom-text-field {
                margin-top: 1em;

                ._helper-text {
                    margin-top: 1em;
                }
            }
        }

        ._back-design-field {
            ._back-selector {
                margin-top: 0.5em;
            }
        }

        ._accent-color-field {
            ._accent-color-selector-container {
                margin-top: 1em;
            }
        }

        ._email-disclaimer,
        ._submit-disclaimer {
            margin-top: 1em;
        }

        ._email-field,
        ._custom-text-field {
            input {
                text-align: center;
            }
        }

        ._background-image-field {
            text-align: center;
        }
    }

    @include for-desktop {
        ._page-content {
            flex-direction: row-reverse;

            ._live-preview-section,
            ._customization-section {
                width: 50%;
            }
        }

        ._section-header,
        ._front_design_preview_container,
        ._back_design_preview_container {
            text-align: left;

            h2,
            h3,
            h5 {
                text-align: left;
            }
        }

        ._header {
            ._section-header {
                text-align: center;

                h3 {
                    text-align: center;
                }
            }

            ._top-static-block {
                text-align: center;
            }
        }

        ._customization-section {
            label {
                margin: 0.5em 0;
            }

            ._background-image-field,
            ._quantity-field,
            ._email-field,
            ._actions-row,
            ._accent-color-field,
            ._front-design-field,
            ._back-design-field,
            ._custom-text-field,
            ._final-steps {
                text-align: left;
            }

            ._email-field,
            ._custom-text-field {
                input {
                    text-align: left;
                }
            }

            ._custom-text-fields-section {
                ._step {
                    text-align: left;
                }
            }

            ._background-image-field {
                ._background-uploader {
                    margin-top: 1em;
                }
            }

            ._email-field {
                ._email-field-input {
                    margin-top: 1em;
                }
            }

            ._bottom-static-block {
                margin-top: 1em;
            }
        }
    }

    &.-skin-petsies {
        ._section-header,
        ._header {
            ._accent-header {
                font-weight: var(--font-bold);
                font-size: var(--font-base);
                color: var(--_c-light-primary);
            }
        }

        ._front_design_preview_container,
        ._customization-section {
            ._error-text {
                color: var(--c-danger-variant);
            }
        }

        ._front_design_preview_container {
            &.-invalid {
                h3 {
                    color: var(--c-danger-variant);
                }
            }
        }

        ._customization-section {
            label {
                ._step-marker {
                    color: var(--_c-light-primary);
                }
            }

            .-invalid {
                label {
                    color: var(--c-danger);
                }

                input[type="text"],
                input[type="email"] {
                    border-color: var(--c-danger-variant);
                }
            }
        }
    }
}
</style>

<template>
  <div class="o-phrase-pillow-product-order-form" :class="skinClass">
    <div class="_header">
      <SfHeading
        :level="1"
        title="Pillow Customizer"
      />

      <div class="_notes">
        <p>Ships within 7 days | Made & Printed in the USA</p>
      </div>

      <SfHeading
        class="desktop-only"
        :level="3"
        title="Your customizations will appear on the left side of the page"
      />

      <SfHeading
        class="mobile-only _accent-header"
        :level="4"
        title="Scroll down for a preview of your customizations"
      />
    </div>

    <validation-observer v-slot="{ passes }" slim>
      <div class="_page-content">
        <div class="_customization-section">
          <SfHeading
            :level="2"
            title="Customize Your Pillow"
          />

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
                required: 'Please, upload the background image!'
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
                <MDesignSelector
                  v-model="frontDesign"
                  class="_front-selector"
                  :design-products="frontDesignProducts"
                  :field-name="'front-design-sku'"
                  :disabled="isDisabled"
                  @input="onFrontDesignSelect"
                />

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

                    <SfInput
                      v-model="customTextValues[field.name]"
                      class="_custom-input"
                      :name="field.name"
                      :disabled="isDisabled"
                      :placeholder="field.placeholder"
                      :valid="!errors.length"
                      :error-message="errors[0]"
                    />

                    <div class="_helper-text">
                      {{ field.helperText }}
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

                  <MDesignSelector
                    v-model="backDesign"
                    class="_back-selector"
                    :design-products="backDesignProducts"
                    :field-name="'back-design-sku'"
                    :disabled="isDisabled"
                    :should-collapse="false"
                    @input="onBackDesignSelect"
                  />

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
                <label class="_label">Accent Color</label>

                <div class="_helper-text">
                  Selected pillow back designs will may be
                  customized with the accent color of your
                  choosing.
                </div>

                <MAccentColorSelector
                  v-model="accentColorPartValue"
                  class="_accent-color-selector-container"
                  :accent-color-part-values="accentColorPartValues"
                  :disabled="isDisabled"
                  @input="onAccentColorSelect"
                />

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
                <label class="_label">Quantity</label>

                <ACustomProductQuantity
                  v-model="quantity"
                  class="_qty-container"
                  :disabled="isDisabled"
                />

                <div class="_error-text">
                  {{ errors[0] }}
                </div>
              </div>
            </validation-provider>

            <div
              class="_final-steps"
              v-show="showEmailStep || isProductionOptionsAvailable"
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
                rules="required|email"
                name="E-mail"
                slim
                v-show="showEmailStep"
              >
                <div
                  class="_email-field"
                  :class="classes"
                >
                  <label v-if="isProductionOptionsAvailable">
                    Enter your email address
                  </label>
                  <SfInput
                    class="_email-field-input"
                    name="customer_email"
                    type="email"
                    v-model="customerEmail"
                    placeholder="sample@email.com"
                    :required="false"
                    :disabled="isDisabled"
                    :valid="!errors.length"
                    :error-message="errors[0]"
                  />

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
              <SfButton class="color-primary _submit-button" type="submit" :disabled="isDisabled">
                Add to Cart
              </SfButton>

              <div class="_submit-disclaimer _helper-text">
                I have seen and approve the Live Preview of my
                design.
              </div>
            </div>

            <div class="_animation-row">
              <MSubmitAnimator
                ref="submitAnimator"
                :duration="20000"
                :steps="submitAnimationSteps"
                :animation-url="submitAnimationUrl"
                v-show="isSubmitting"
              />
            </div>

            <m-form-errors :form-errors="submitErrors" />
          </form>
        </div>
        <div
          id="live-preview-section"
          class="_live-preview-section"
        >
          <SfHeading
            :level="2"
            title="Live Preview"
          />

          <div class="_front_design_preview_container">
            <SfHeading
              :level="3"
              title="Front Side"
            />

            <MBackgroundEditor
              ref="backgroundEditor"
              class="_front-preview"
              :disabled="isDisabled"
              :background-offset-settings="backgroundOffsetSettings"
            >
              <slot>
                <MLivePreview
                  ref="frontPreview"
                  :template-fetch-url="svgPath"
                  :design-sku="frontDesign"
                  :accent-color="accentColor"
                  :custom-text-values="customTextValues"
                  @custom-text-fields-prepared="onFrontCustomTextFieldsPrepared"
                  @colored-elements-counted="onFrontAccentColorElementsCounted"
                  @background-offset-settings-prepared="onBackgroundOffsetSettingsPrepared"
                  v-if="frontDesign"
                />
              </slot>
            </MBackgroundEditor>
          </div>

          <div class="_back_design_preview_container">
            <SfHeading
              :level="3"
              title="Back Side"
            />

            <MLivePreview
              ref="backPreview"
              class="_back-preview"
              :template-fetch-url="svgPath"
              :design-sku="backDesign"
              :accent-color="accentColor"
              :custom-text-values="customTextValues"
              :is-background-loaded="isBackgroundImageLoaded"
              @custom-text-fields-prepared="onBackCustomTextFieldsPrepared"
              @colored-elements-counted="onBackAccentColorElementsCounted"
              v-if="backDesign"
            />
          </div>

          <div
            class="_design-images-container"
            v-if="currentDesignImages.length"
          >
            <SfHeading
              :level="3"
              title="Examples of finished pillows"
            />

            <MDesignImages
              class="_design-images"
              :images="currentDesignImages"
            />
          </div>
        </div>
      </div>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure
} from 'vee-validate';
import { mapMutations } from 'vuex';
import { required, email } from 'vee-validate/dist/rules';
import { SfButton, SfInput, SfHeading } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import { InjectType } from 'src/modules/shared';
import {
  ErrorConverterService,
  Bodypart,
  BodypartValue,
  isAxiosError,
  vuexTypes as budsiesTypes
} from 'src/modules/budsies';

import {
  FileProcessingRepositoryFactory,
  FileProcessingRepository,
  Item,
  ImageType
} from 'src/modules/file-storage';

import MFormErrors from '../molecules/m-form-errors.vue';
import MBackgroundUploader from '../molecules/m-background-uploader.vue';
import MBackgroundEditor from '../molecules/m-background-editor.vue';
import MLivePreview from '../molecules/m-live-preview.vue';
import MDesignSelector from '../molecules/m-design-selector.vue';
import MDesignImages from '../molecules/m-design-images.vue';
import MSubmitAnimator from '../molecules/m-submit-animator.vue';
import MAccentColorSelector from '../molecules/m-accent-color-selector.vue';
import ACustomProductQuantity from '../atoms/a-custom-product-quantity.vue';
import CustomTextFieldInterface from '../interfaces/custom-text-field.interface';
import DesignProduct from '../interfaces/design-product.interface';
import AccentColorPart from '../interfaces/accent-color-part.interface';
import SubmitAnimationStepsInterface from '../interfaces/submit-animation-steps.interface';
import ProductionTimeOption from '../interfaces/production-time-option.interface';
import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';

extend('required', {
  ...required,
  message: 'The {_field_} field is required'
});

extend('email', {
  ...email,
  message: 'Please, provide the correct email address'
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
  errorConverterService: ErrorConverterService,
  fileProcessingRepositoryFactory: FileProcessingRepositoryFactory
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'OPhrasePillowProductOrderForm',
  components: {
    SfButton,
    SfInput,
    SfHeading,
    ValidationObserver,
    ValidationProvider,
    MBackgroundUploader,
    MBackgroundEditor,
    MLivePreview,
    MDesignSelector,
    ACustomProductQuantity,
    MFormErrors,
    MDesignImages,
    MSubmitAnimator,
    MAccentColorSelector
  },
  inject: {
    errorConverterService: { from: 'ErrorConverterService' },
    fileProcessingRepositoryFactory: { from: 'FileProcessingRepositoryFactory' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    product: {
      type: Object,
      required: true
    },
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
    frontDesignProducts: {
      type: Array as PropType<DesignProduct[]>,
      required: true
    },
    backDesignProducts: {
      type: Array as PropType<DesignProduct[]>,
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
    },
    bodyparts: {
      type: Array as PropType<Bodypart[]>,
      default: () => []
    }
  },
  data () {
    return {
      customTextValues: {} as unknown as Record<string, string | undefined>,
      quantity: 1,
      accentColorPartValues: [] as AccentColorPart[],
      accentColorPartValue: undefined as AccentColorPart | undefined,
      frontDesign: undefined as string | undefined,
      backDesign: undefined as string | undefined,
      customerEmail: undefined as string | undefined,
      backgroundDataUri: undefined as string | undefined,
      isBackgroundImageLoaded: false,
      backgroundOffsetSettings: undefined as BackgroundOffsetSettings | undefined,
      productionTime: undefined as string | undefined,
      backCustomTextFields: [] as CustomTextFieldInterface[],
      frontCustomTextFields: [] as CustomTextFieldInterface[],
      frontAccentColorElementsNumber: 0,
      backAccentColorElementsNumber: 0,
      fileProcessingRepository: undefined as FileProcessingRepository | undefined,
      isFormDisabled: false,
      isSubmitting: false,
      isAccentColorSelectedByUser: false,
      isBackDesignSelectedByUser: false,
      submitErrors: [] as string[],
      showEmailStep: true
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

      return this.accentColorPartValue.background;
    },
    customTextFields (): CustomTextFieldInterface[] {
      const fields = [...this.frontCustomTextFields];

      this.backCustomTextFields.forEach((element) => {
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
      return this.isFormDisabled || this.isSubmitting;
    },
    uploadButtonText (): string {
      return this.isBackgroundImageLoaded ? 'Change photo' : 'Select a photo';
    },
    isAccentColorSelectorVisible (): boolean {
      return (
        this.frontAccentColorElementsNumber > 0 ||
            this.backAccentColorElementsNumber > 0
      );
    },
    isProductionOptionsAvailable (): boolean {
      return this.productionTimeOptions.length !== 0;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
    getAccentColorPartValues (bodypart: Bodypart): AccentColorPart[] {
      const bodypartsValues = this.$store.getters['budsies/getBodypartBodypartsValues'](bodypart.id);

      if (!bodypartsValues.length) {
        return [];
      }

      const result: AccentColorPart[] = [];

      bodypartsValues.forEach((bodypartValue: BodypartValue) => {
        result.push({
          id: +bodypartValue.id,
          background: bodypartValue.color + '',
          title: bodypartValue.name,
          optionId: bodypart.id,
          optionValueId: bodypartValue.id
        });
      });

      return result;
    },
    getBackgroundEditor (): InstanceType<typeof MBackgroundEditor> | undefined {
      return this.$refs['backgroundEditor'] as InstanceType<typeof MBackgroundEditor> | undefined;
    },
    getBackPreview (): InstanceType<typeof MLivePreview> | undefined {
      return this.$refs['backPreview'] as InstanceType<typeof MLivePreview> | undefined;
    },
    getFrontPreview (): InstanceType<typeof MLivePreview> | undefined {
      return this.$refs['frontPreview'] as InstanceType<typeof MLivePreview> | undefined;
    },
    getSubmitAnimator (): InstanceType<typeof MSubmitAnimator> | undefined {
      return this.$refs['submitAnimator'] as InstanceType<typeof MSubmitAnimator> | undefined;
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
    getCustomFieldsData (): Record<string, string | undefined> {
      const customTextValuesToSubmit: Record<string, string | undefined> = {};

      if (!this.customTextValues || Object.keys(this.customTextValues).length < 1) {
        return customTextValuesToSubmit;
      }

      this.customTextFields.forEach((field) => {
        customTextValuesToSubmit[field.name] = this.customTextValues[field.name];
      });

      return customTextValuesToSubmit;
    },
    getBodypartsData (): Record<string, string> {
      let data: Record<string, string> = {};

      if (!this.accentColorPartValue) {
        return data;
      }

      data[this.accentColorPartValue.optionId] = this.accentColorPartValue.optionValueId;

      return data;
    },
    selectDefaultBackDesignForFront (frontDesignSku?: string): void {
      if (!frontDesignSku || this.isBackDesignSelectedByUser) {
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
      if (this.isAccentColorSelectedByUser) {
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

      this.accentColorPartValue = accentColor;
    },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    },
    prefillEmail (): void {
      const customerEmail = this.$store.getters['budsies/getCustomerEmail'];

      if (customerEmail) {
        this.customerEmail = customerEmail;
        this.showEmailStep = false;
      }
    },
    async processImages (): Promise<string[]> {
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
        this.fileProcessingRepository.uploadFile(
          frontDesignBlob,
          ImageType.Artwork,
          this.uploadProductType
        ),
        this.fileProcessingRepository.uploadFile(
          backDesignBlob,
          ImageType.Artwork,
          this.uploadProductType
        ),
        this.fileProcessingRepository.uploadFile(
          backgroundBlob,
          ImageType.Artwork,
          this.uploadProductType
        )
      ]);

      return [frontStorageItem, backStorageItem, backgroundOriginalItem].map(
        (item: Item) => item.id
      );
    },
    async onSubmit (): Promise<void> {
      if (this.isDisabled) {
        return;
      }

      this.submitErrors = [];
      this.isSubmitting = true;

      try {
        const submitAnimator = this.getSubmitAnimator();
        if (!submitAnimator) {
          throw new Error('Submit animation is not available!');
        }

        submitAnimator.runProgress();

        const customerImagesIds = await this.processImages();

        await this.$store.dispatch(
          'product/setBundleOptions',
          { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }
        );

        this.$store.commit(
          budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CUSTOMER_EMAIL_SET,
          { email: this.customerEmail }
        );

        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, {
            qty: this.quantity,
            email: this.customerEmail,
            bodyparts: this.getBodypartsData(),
            customFields: JSON.stringify(this.getCustomFieldsData()),
            customerImagesIds: customerImagesIds,
            uploadMethod: 'upload-now'
          })
        });

        this.goToCart();
      } catch (error) {
        let errorToParse: any = error;

        if (isAxiosError(error) && error.response) {
          errorToParse = error.response.data;
        }

        this.submitErrors = this.errorConverterService.describeError(
          errorToParse
        );
        this.isSubmitting = false;
      }
    },
    onAccentColorSelect (): void {
      this.isAccentColorSelectedByUser = true;
    },
    onBackDesignSelect (): void {
      this.isBackDesignSelectedByUser = true;

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
      this.backCustomTextFields = textFields;
    },
    onFrontCustomTextFieldsPrepared (
      textFields: CustomTextFieldInterface[]
    ): void {
      this.frontCustomTextFields = textFields;
    },
    onFrontAccentColorElementsCounted (
      coloredElementsNumber: number
    ): void {
      this.frontAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackAccentColorElementsCounted (
      coloredElementsNumber: number
    ): void {
      this.backAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackgroundOffsetSettingsPrepared (
      settings: BackgroundOffsetSettings
    ): void {
      this.backgroundOffsetSettings = settings;
    }
  },
  beforeMount () {
    this.$bus.$once('budsies-store-synchronized', this.prefillEmail);
  },
  beforeDestroy () {
    this.$bus.$off('budsies-store-synchronized', this.prefillEmail);
  },
  created (): void {
    this.fileProcessingRepository = this.fileProcessingRepositoryFactory.create(
      this.imageUploadUrl
    );

    if (this.initialFrontDesign) {
      this.frontDesign = this.initialFrontDesign;
    }

    if (this.initialBackDesign) {
      this.backDesign = this.initialBackDesign;
    }

    this.accentColorPartValues = this.getAccentColorPartValues(this.bodyparts[0]);

    this.selectDefaultAccentColor(this.frontDesign, this.backDesign);

    this.prefillEmail();

    if (this.isProductionOptionsAvailable) {
      this.productionTime = this.productionTimeOptions[0].value;
    }
  },
  watch: {
    frontDesign: {
      handler () {
        if (!this.frontDesign) {
          return
        }

        const frontDesign = this.frontDesignProducts.find(product => product.sku === this.frontDesign);

        if (!frontDesign) {
          return
        }

        this.setBundleOptionValue({
          optionId: frontDesign.optionId,
          optionQty: 1,
          optionSelections: [frontDesign.optionValueId]
        });
      },
      immediate: false
    },
    backDesign: {
      handler () {
        if (!this.backDesign) {
          return
        }

        const backDesign = this.backDesignProducts.find(product => product.sku === this.backDesign);

        if (!backDesign) {
          return
        }

        this.setBundleOptionValue({
          optionId: backDesign.optionId,
          optionQty: 1,
          optionSelections: [backDesign.optionValueId]
        });
      },
      immediate: false
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

    ._helper-text {
      font-size: var(--font-xs);
      font-weight: var(--font-medium);
      margin-top: var(--spacer-sm);
    }

    ._label {
      display: block;
      text-align: center;
      font-size: var(--font-lg);
      font-weight: var(--font-medium);
    }

    ._customization-section {
        ._step {
            display: block;
            font-size: var(--font-sm);
            font-weight: var(--font-medium);
            margin: 1em 0 0.5em;
            width: 100%;
            cursor: auto;
            text-align: center;

            ._step-marker {
                border-bottom: 4px solid;
                font-size: 1.43em;
                font-weight: bold;
                text-transform: uppercase;
            }
        }

        ._error-text {
            font-size: var(--font-xs);
            font-weight: var(--font-medium);
            height: calc(var(--font-xs) * 1.2);
        }

        ._background-hint {
            margin: 1em 0;
        }

        .-invalid {
            ._error-text {
                display: block;
            }
        }

        ._actions-row {
          ._submit-button {
            margin-left: auto;
            margin-right: auto;
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
            margin-top: 1.5em;

            ._custom-text-field {
                margin-top: 1em;

                ._custom-input {
                  text-align: center;
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
                padding: 0 var(--spacer-sm);
            }
        }

        ._label {
          text-align: left;
        }

        ._front_design_preview_container > .m-background-editor,
        ._back_design_preview_container > .m-live-preview,
        ._design-images-container > .m-design-images {
          width: 80%;
        }

        ._customization-section,
        ._live-preview-section,
        ._front_design_preview_container,
        ._back_design_preview_container {
            text-align: left;

            .sf-heading {
                --heading-text-align: left;
            }
        }

        ._header {
            ._top-static-block {
                text-align: center;
            }
        }

        ._customization-section {
            label {
                margin: 0.5em 0;
                display: block;
            }

            ._actions-row {
              ._submit-button {
                margin-left: 0;
                margin-right: 0 ;
              }
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
            ._custom-text-fields-section {
              ._custom-text-field {
                  ._custom-input {
                    text-align: left;
                  }
              }
            }

            ._step {
                font-size: var(--font-base);
                text-align: left;
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
        ._header {
            ._accent-header {
                --heading-title-font-weight: var(--font-bold);
                --heading-title-font-size: var(--font-base);
                --heading-title-color: var(--_c-light-primary);
            }
        }

        ._front_design_preview_container,
        ._customization-section {
            ._error-text {
                color: var(--c-danger);
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

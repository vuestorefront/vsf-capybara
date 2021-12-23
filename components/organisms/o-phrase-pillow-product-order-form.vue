<template>
  <div class="o-phrase-pillow-product-order-form" :class="skinClass">
    <div class="_header -show-for-medium-up">
      <SfHeading :level="1" title="Pillow Customizer" class="_main-header" />

      <div class="_notes">
        <p>Ships within 7 days | Made & Printed in the USA</p>
      </div>

      <SfHeading
        :level="3"
        title="Your customizations will appear on the left side of the page"
      />
    </div>

    <validation-observer ref="formObserver" class="_form-content" tag="div">
      <div id="live-preview-section" class="_live-preview-section">
        <div class="_front_design_preview_container">
          <MCustomizerPreview
            :is-back-side-focused.sync="isCustomizerPreviewBackSideFocused"
          >
            <template #frontSmall>
              <SfHeading :level="4" title="Front" class="_section-header" />

              <div
                class="_preview-image-small"
                v-if="isCustomizerPreviewBackSideFocused"
              >
                <img
                  class="_background"
                  :style="smallBackgroundImageStyle"
                  :src="croppedBackground"
                  v-if="croppedBackground"
                >

                <MLivePreview
                  ref="frontPreviewSmall"
                  :template-fetch-url="svgPath"
                  :design-sku="frontDesign"
                  :accent-color="accentColor"
                  :custom-text-values="customTextValues"
                  v-if="frontDesign"
                />
              </div>
            </template>

            <template #backSmall>
              <SfHeading :level="4" title="Back" />

              <div
                class="_preview-image-small"
                v-if="!isCustomizerPreviewBackSideFocused"
              >
                <MLivePreview
                  ref="backPreviewSmall"
                  :template-fetch-url="svgPath"
                  :design-sku="selectedBackDesign"
                  :accent-color="accentColor"
                  :custom-text-values="customTextValues"
                  v-if="selectedBackDesign"
                />
              </div>
            </template>

            <template #front>
              <SfHeading :level="4" title="Front" />

              <MBackgroundEditor
                ref="backgroundEditor"
                class="_front-preview"
                :disabled="isDisabled"
                :background-offset-settings="backgroundOffsetSettings"
                @background-image-assigned="onBackgroundImageAssigned"
              >
                <slot>
                  <MLivePreview
                    ref="frontPreview"
                    :template-fetch-url="svgPath"
                    :design-sku="frontDesign"
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
                    v-show="!isCustomizerPreviewBackSideFocused"
                  />
                </slot>
              </MBackgroundEditor>
            </template>

            <template #back>
              <SfHeading :level="4" title="Back" />

              <MLivePreview
                ref="backPreview"
                class="_back-preview"
                :template-fetch-url="svgPath"
                :design-sku="selectedBackDesign"
                :accent-color="accentColor"
                :custom-text-values="customTextValues"
                :is-background-loaded="isBackgroundImageLoaded"
                @custom-text-fields-prepared="onBackCustomTextFieldsPrepared"
                @colored-elements-counted="onBackAccentColorElementsCounted"
                v-if="selectedBackDesign"
              />
            </template>
          </MCustomizerPreview>

          <div
            class="_design-images-container -show-for-medium-up"
            v-if="currentDesignImages.length"
          >
            <SfHeading :level="3" title="Examples of finished pillows" />

            <MDesignImages
              class="_design-images"
              :images="currentDesignImages"
            />
          </div>
        </div>
      </div>

      <div class="_customization-section">
        <form method="POST" class="_form" @submit.prevent="trySubmitForm">
          <SfSteps
            :active="activeStepIndex"
            :steps="customizerSteps"
            class="_customizer-steps"
          >
            <template #steps="props">
              <div
                class="_customizer-step"
                :class="{
                  '-active': props.step.current,
                  '-done': props.step.index <= activeStepIndex,
                  '-add-to-cart':
                    props.step.index === customizerSteps.length - 1,
                  '-invalid': isStepInvalid(props.step.step),
                }"
                @click="onChangeStep(props.step.index)"
              >
                <div
                  class="_step-name"
                  v-html="customizerStepsData[props.step.step].name"
                />
              </div>
            </template>

            <validation-provider
              v-slot="{ errors, classes }"
              :ref="customizerStepsData.frontDesign.id"
              rules="required"
              :name="'Front Design'"
              slim
            >
              <SfStep :name="customizerStepsData.frontDesign.id">
                <div
                  class="_front-design-field _step-container"
                  :class="classes"
                >
                  <SfHeading
                    :level="4"
                    class="_step-title"
                    title="Try a different design for the front"
                  />

                  <div class="_helper-text">
                    (Your uploaded photo and options will be saved)
                  </div>

                  <MDesignSelector
                    :value="frontDesign"
                    class="_front-selector"
                    :design-products="frontDesignProducts"
                    :field-name="'front-design-sku'"
                    :disabled="isDisabled"
                    @input="onFrontDesignSelect"
                  />

                  <div class="_error-text" v-if="errors.length">
                    {{ errors[0] }}
                  </div>
                </div>
              </SfStep>
            </validation-provider>

            <validation-provider
              v-slot="{ errors, classes }"
              :ref="customizerStepsData.uploadPhoto.id"
              :rules="{
                required: {
                  allowFalse: false,
                },
              }"
              :custom-messages="{
                required: 'Please, upload the background image!',
              }"
              :name="'Background Image'"
              slim
            >
              <SfStep
                :name="customizerStepsData.uploadPhoto.id"
                class="_step-container"
              >
                <div class="_background-image-field" :class="classes">
                  <m-background-uploader
                    ref="backgroundUploader"
                    v-model="isBackgroundImageLoaded"
                    class="_background-uploader"
                    :button-text="uploadButtonText"
                    :disabled="isDisabled"
                    @background-uploaded="onBackgroundImageUploaded"
                  />

                  <div class="_helper-text -show-for-medium-up">
                    After uploading your photo, use the (+) and (-) icons (or
                    mouse scroll) to resize your image. Then, click and drag
                    your photo to move the image to the desired position.
                  </div>

                  <div class="_helper-text -show-for-small-only">
                    After uploading your photo, pinch your fingers or use the
                    (+) and (-) icons to resize your image. Then, tap and drag
                    your photo to move the image to the desired position.
                  </div>

                  <div class="_error-text" v-if="errors.length">
                    {{ errors[0] }}
                  </div>
                </div>
              </SfStep>
            </validation-provider>

            <validation-provider
              v-slot="{ errors, classes }"
              rules="required"
              :ref="customizerStepsData.backDesign.id"
              :name="'Back Design'"
              slim
            >
              <SfStep :name="customizerStepsData.backDesign.id">
                <div
                  class="_back-design-field _step-container"
                  :class="classes"
                >
                  <SfHeading
                    :level="4"
                    class="_step-title"
                    title="Select design for the back of pillow"
                  />

                  <div class="_helper-text">
                    You can choose a blank back, a standard design, or one of
                    our premium options. Some styles will dynamically change
                    based on the accent color chosen below.
                  </div>

                  <MDesignSelector
                    :value="selectedBackDesign"
                    class="_back-selector"
                    :design-products="backDesignProducts"
                    :field-name="'back-design-sku'"
                    :disabled="isDisabled"
                    :should-collapse="false"
                    @input="onBackDesignSelect"
                  />

                  <div class="_error-text" v-if="errors.length">
                    {{ errors[0] }}
                  </div>
                </div>
              </SfStep>
            </validation-provider>

            <SfStep
              :name="customizerStepsData.customOptions.id"
              class="_custom-text-fields-section _step-container"
            >
              <div class="_custom-text-fields-section">
                <SfHeading
                  :level="4"
                  class="_step-title"
                  title="Add custom text"
                />

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
                      <label class="_label">{{ field.label }}</label>

                      <SfInput
                        v-model="customTextValues[field.name]"
                        class="_custom-input"
                        :name="field.name"
                        :disabled="isDisabled"
                        :placeholder="field.placeholder"
                        :valid="!errors.length"
                        :error-message="errors[0]"
                      />

                      <div class="_helper-text" v-if="field.helperText">
                        {{ field.helperText }}
                      </div>
                    </div>
                  </validation-provider>
                </div>

                <validation-provider
                  v-slot="{ errors, classes }"
                  rules="required"
                  :ref="customizerStepsData.customOptions.id"
                  :name="'Accent Color'"
                  slim
                  v-if="isAccentColorSelectorVisible"
                >
                  <div class="_accent-color-field" :class="classes">
                    <SfHeading
                      :level="4"
                      class="_step-title"
                      title="Choose Your Accent Color"
                    />

                    <div class="_error-text" v-if="errors.length">
                      {{ errors[0] }}
                    </div>

                    <MAccentColorSelector
                      :value="selectedAccentColorPartValue"
                      class="_accent-color-selector-container"
                      :accent-color-part-values="accentColorPartValues"
                      :disabled="isDisabled"
                      @input="onAccentColorSelect"
                    />
                  </div>
                </validation-provider>
              </div>
            </SfStep>

            <SfStep :name="customizerStepsData.addToCart.id">
              <div
                class="_add-to-cart-container"
                :class="{
                  '_step-container': !isSubmitting,
                }"
              >
                <template v-if="!isSubmitting">
                  <validation-provider
                    v-slot="{ errors, classes }"
                    rules="required"
                    :name="'Quantity'"
                    slim
                  >
                    <div class="_quantity-field" :class="classes">
                      <SfHeading
                        :level="4"
                        class="_step-title"
                        title="Quantity"
                      />

                      <ACustomProductQuantity
                        v-model="quantity"
                        class="_qty-container"
                        :disabled="isDisabled"
                      />

                      <div class="_error-text" v-if="errors.length">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </validation-provider>

                  <div
                    class="_final-steps"
                    v-show="showEmailStep || isProductionOptionsAvailable"
                  >
                    <label class="_label _step">
                      <SfHeading
                        :level="4"
                        class="_step-title"
                        :title="
                          isProductionOptionsAvailable
                            ? 'Final Steps'
                            : 'Enter your email address'
                        "
                      />
                    </label>

                    <validation-provider
                      v-slot="{ errors, classes }"
                      rules="required|email"
                      name="E-mail"
                      slim
                      v-show="showEmailStep"
                    >
                      <div class="_email-field" :class="classes">
                        <label
                          class="_label"
                          v-if="isProductionOptionsAvailable"
                        >
                          Enter your email address
                        </label>

                        <div class="_email-disclaimer _helper-text">
                          (Sometimes our team has questions about your design)
                        </div>

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
                      </div>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors, classes }"
                      name="Production time"
                      v-if="isProductionOptionsAvailable"
                      slim
                    >
                      <div class="_production-time-field" :class="classes">
                        <label class="_label">
                          Choose your production time
                        </label>

                        <SfSelect
                          v-model="productionTime"
                          name="rush_addons"
                          class="_rush-addons"
                          :valid="!errors.length"
                          :error-message="errors[0]"
                        >
                          <SfSelectOption
                            v-for="option in productionTimeOptions"
                            :key="option.id"
                            :value="option.id"
                          >
                            {{ option.text }}
                          </SfSelectOption>
                        </SfSelect>
                      </div>
                    </validation-provider>
                  </div>

                  <div class="_bottom-static-block">
                    <slot name="bottom-static-block">
                      <sup>
                        <em>
                          Your pillow goes straight to print so make sure the
                          image is correct. No cancellations after 24 hours.
                        </em>
                      </sup>
                    </slot>
                  </div>

                  <div class="_actions-row" v-show="!isSubmitting">
                    <SfButton
                      class="color-primary _submit-button"
                      type="submit"
                      :disabled="isDisabled"
                    >
                      Add to Cart
                    </SfButton>

                    <div class="_submit-disclaimer _helper-text">
                      I have seen and approve the Live Preview of my design.
                    </div>
                  </div>
                </template>

                <div class="_animation-row">
                  <MSubmitAnimator
                    ref="submitAnimator"
                    :duration="20000"
                    :steps="submitAnimationSteps"
                    animation-url="/assets/images/phrasePillow/submit-animation.mp4"
                    v-show="isSubmitting"
                  />
                </div>

                <m-form-errors :form-errors="submitErrors" />
              </div>
            </SfStep>
          </SfSteps>
        </form>
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
import {
  SfButton,
  SfInput,
  SfHeading,
  SfSelect,
  SfSteps
} from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import * as catalogTypes from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import Product from 'core/modules/catalog/types/Product';
import { getProductGallery as getGalleryByProduct } from '@vue-storefront/core/modules/catalog/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import {
  BundleOption,
  BundleOptionsProductLink
} from 'core/modules/catalog/types/BundleOption';
import { Logger } from '@vue-storefront/core/lib/logger';

import { InjectType } from 'src/modules/shared';
import {
  ErrorConverterService,
  Bodypart,
  BodypartValue,
  isAxiosError,
  vuexTypes as budsiesTypes,
  ProductValue,
  Dictionary
} from 'src/modules/budsies';

import {
  FileProcessingRepositoryFactory,
  FileProcessingRepository,
  Item,
  ImageType,
  ImageHandlerService
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
import MCustomizerPreview from '../molecules/m-customizer-preview.vue';

import CustomTextFieldInterface from '../interfaces/custom-text-field.interface';
import DesignProduct from '../interfaces/design-product.interface';
import AccentColorPart from '../interfaces/accent-color-part.interface';
import SubmitAnimationStepsInterface from '../interfaces/submit-animation-steps.interface';
import ProductionTimeOption from '../interfaces/production-time-option.interface';
import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';
import ProductImage from '../interfaces/product-image.interface';
import getProductionTimeOptions from '../../helpers/get-production-time-options';
import CustomerImage from '../interfaces/customer-image.interface';
import { ValidationResult } from 'vee-validate/dist/types/types';

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
  fileProcessingRepositoryFactory: FileProcessingRepositoryFactory,
  imageHandlerService: ImageHandlerService
}

interface SideDesignProduct extends Product {
  default_other_side_design?: number,
  default_accent_color?: number
}

interface SideDesignProductLink extends BundleOptionsProductLink {
  product?: SideDesignProduct
}

interface SideDesignBundleOption extends BundleOption {
  product_links: SideDesignProductLink[]
}

interface StepsInterface {
  name: string,
  id: string
}

interface SmallBackgroundImageStyle {
  width: string,
  height: string,
  top: string,
  left: string
}

interface Constants {
  customizerStepsData: Dictionary<StepsInterface>
}

const customizerStepsData: Dictionary<StepsInterface> = {
  frontDesign: { name: 'Front<br>Design', id: 'frontDesign' },
  uploadPhoto: { name: 'Upload<br>Photo', id: 'uploadPhoto' },
  backDesign: { name: 'Back<br>Design', id: 'backDesign' },
  customOptions: { name: 'Custom<br>Options', id: 'customOptions' },
  addToCart: { name: 'Add to<br>Cart', id: 'addToCart' }
};

export interface DesignSelectedEventPayload {
  frontDesign: string | undefined,
  backDesign: string | undefined
}

export default (
  Vue as VueConstructor<Vue & InjectedServices & Constants>
).extend({
  name: 'OPhrasePillowProductOrderForm',
  components: {
    SfButton,
    SfInput,
    SfHeading,
    SfSelect,
    SfSteps,
    MCustomizerPreview,
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
    fileProcessingRepositoryFactory: {
      from: 'FileProcessingRepositoryFactory'
    },
    imageHandlerService: { from: 'ImageHandlerService' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    imageUploadUrl: {
      type: String,
      required: true
    },
    svgPath: {
      type: String,
      required: true
    },
    frontDesign: {
      type: String,
      default: undefined
    },
    backDesign: {
      type: String,
      default: undefined
    }
  },
  data () {
    let stepValidateState: Dictionary<'valid' | 'invalid'> = {
      [customizerStepsData.frontDesign.id]: 'valid'
    };

    return {
      customTextValues: {} as unknown as Record<string, string | undefined>,
      quantity: 1,
      accentColorPartValues: [] as AccentColorPart[],
      accentColorPartValue: undefined as AccentColorPart | undefined,
      customerEmail: undefined as string | undefined,
      backgroundDataUri: undefined as string | undefined,
      isBackgroundImageLoaded: false,
      backgroundOffsetSettings: undefined as
        | BackgroundOffsetSettings
        | undefined,
      productionTime: undefined as string | undefined,
      backCustomTextFields: [] as CustomTextFieldInterface[],
      frontCustomTextFields: [] as CustomTextFieldInterface[],
      frontAccentColorElementsNumber: 0,
      backAccentColorElementsNumber: 0,
      fileProcessingRepository: undefined as
        | FileProcessingRepository
        | undefined,
      isFormDisabled: false,
      isSubmitting: false,
      submitErrors: [] as string[],
      showEmailStep: true,
      isCustomizerPreviewBackSideFocused: false,
      croppedBackground: '',
      activeStepIndex: 1,
      stepValidateState
    };
  },
  computed: {
    skinClass (): string {
      return '-skin-petsies';
    },
    accentColor (): string | undefined {
      if (!this.selectedAccentColorPartValue) {
        return undefined;
      }

      return this.selectedAccentColorPartValue.background;
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
    customizerSteps (): StepsInterface[] {
      const keys: string[] = Object.keys(customizerStepsData).filter(
        (key) =>
          customizerStepsData[key].id !==
            customizerStepsData.customOptions.id ||
          this.hasCustomFields ||
          this.isAccentColorSelectorVisible
      );

      return keys.map((key) => customizerStepsData[key]);
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
    backDesignBundleOption (): SideDesignBundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(
        (item) => item.title.toLowerCase() === 'back design product'
      );
    },
    frontDesignBundleOption (): SideDesignBundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(
        (item) => item.title.toLowerCase() === 'front design product'
      );
    },
    frontDesignProducts (): DesignProduct[] {
      if (!this.frontDesignBundleOption) {
        return [];
      }

      return this.getDesignProducts(this.frontDesignBundleOption);
    },
    backDesignProducts (): DesignProduct[] {
      if (!this.backDesignBundleOption) {
        return [];
      }

      return this.getDesignProducts(this.backDesignBundleOption);
    },
    bodyparts (): Bodypart[] {
      const bodyparts = this.$store.getters['budsies/getProductBodyparts'](
        this.product.id
      );

      if (!bodyparts.length) {
        return [];
      }

      return bodyparts;
    },
    uploadProductType (): ProductValue {
      switch (this.product.id) {
        case 333:
          return ProductValue.PHRASE_PILLOW;
        default:
          throw new Error(
            `Can't resolve Backend product ID for Magento '${this.product.id}' product ID`
          );
      }
    },
    productionTimeBundleOption (): BundleOption | undefined {
      if (!this.product?.bundle_options) {
        return undefined;
      }

      return this.product.bundle_options.find(
        (item) => item.title.toLowerCase() === 'production time'
      );
    },
    productionTimeOptions (): ProductionTimeOption[] {
      if (!this.productionTimeBundleOption || !this.product) {
        return [];
      }

      return getProductionTimeOptions(
        this.productionTimeBundleOption,
        this.product,
        this.$store
      );
    },
    smallBackgroundImageStyle (): SmallBackgroundImageStyle {
      const defaultStyle: SmallBackgroundImageStyle = {
        width: 'calc(100% - 2px)',
        height: 'calc(100% - 2px)',
        top: '1px',
        left: '1px'
      };

      const settings = this.backgroundOffsetSettings;

      if (!settings || !settings.size || !settings.position) {
        return defaultStyle;
      }

      const style = { ...defaultStyle };

      if (settings.position === 'left' || settings.position === 'right') {
        style.width = `calc(${100 - parseFloat(settings.size)}% - 2px)`;
      } else {
        style.height = `calc(${100 - parseFloat(settings.size)}% - 2px)`;
      }

      if (settings.position === 'left') {
        style.left = `calc(${parseFloat(settings.size)}% + 1px)`;
      }

      return style;
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
    },
    submitAnimationSteps (): SubmitAnimationStepsInterface[] {
      return [
        { text: 'Uploading your image. So cute!', value: 33 },
        { text: 'Rendering design to maximize hugs', value: 66 },
        { text: 'Optimizing pillow softness vectors', value: 100 }
      ];
    },
    defaultBackDesign (): string | undefined {
      if (!this.frontDesign || this.backDesign) {
        return;
      }

      const currentDesign = this.frontDesignProducts.find(
        (product) => product.sku === this.frontDesign
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

      return backDesign.sku;
    },
    selectedBackDesign (): string | undefined {
      return this.backDesign ? this.backDesign : this.defaultBackDesign;
    },
    defaultAccentColorPartValue (): AccentColorPart | undefined {
      if ((!this.frontDesign && !this.selectedBackDesign) || this.accentColorPartValue) {
        return;
      }

      let accentColorId: number | undefined;

      if (this.frontDesign) {
        const frontDesign = this.frontDesignProducts.find(
          (product) => product.sku === this.frontDesign
        );

        if (frontDesign) {
          accentColorId = frontDesign.defaultAccentColor;
        }
      }

      if (!accentColorId && this.selectedBackDesign) {
        const backDesign = this.backDesignProducts.find(
          (product) => product.sku === this.selectedBackDesign
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

      return accentColor;
    },
    selectedAccentColorPartValue (): AccentColorPart | undefined {
      return this.accentColorPartValue ? this.accentColorPartValue : this.defaultAccentColorPartValue;
    }
  },
  methods: {
    ...mapMutations('product', {
      setBundleOptionValue: catalogTypes.PRODUCT_SET_BUNDLE_OPTION
    }),
    emitDesignSelectedEvent (payload: DesignSelectedEventPayload): void {
      this.$emit('design-selected', payload);
    },
    isStepInvalid (stepId: string): boolean {
      return (
        this.stepValidateState[stepId] &&
        this.stepValidateState[stepId] === 'invalid'
      );
    },
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
    getDesignProductImages (product: Product): ProductImage[] {
      const gallery = getGalleryByProduct(product);

      return gallery.map((image: any) => ({
        thumb: image.src,
        stage: image.src,
        big: image.src,
        sku: product.sku
      }));
    },
    getDesignProducts (bundleOption: SideDesignBundleOption): DesignProduct[] {
      let designs: DesignProduct[] = [];
      for (const productLink of bundleOption.product_links) {
        if (!productLink.product) {
          continue;
        }

        designs.push({
          id: Number(productLink.product.id),
          sku: productLink.product.sku,
          name: productLink.product.name,
          thumbnail: getThumbnailForProduct(productLink.product as any),
          price: 0,
          defaultOtherSideDesign: productLink.product.default_other_side_design,
          defaultAccentColor: productLink.product.default_accent_color,
          images: this.getDesignProductImages(productLink.product),
          optionId: bundleOption.option_id.toString(),
          optionValueId: productLink.id.toString()
        });
      }

      return designs;
    },
    getBackgroundEditor (): InstanceType<typeof MBackgroundEditor> | undefined {
      return this.$refs['backgroundEditor'] as
        | InstanceType<typeof MBackgroundEditor>
        | undefined;
    },
    getBackPreview (): InstanceType<typeof MLivePreview> | undefined {
      return this.$refs['backPreview'] as
        | InstanceType<typeof MLivePreview>
        | undefined;
    },
    getFrontPreview (): InstanceType<typeof MLivePreview> | undefined {
      return this.$refs['frontPreview'] as
        | InstanceType<typeof MLivePreview>
        | undefined;
    },
    getSubmitAnimator (): InstanceType<typeof MSubmitAnimator> | undefined {
      return this.$refs['submitAnimator'] as
        | InstanceType<typeof MSubmitAnimator>
        | undefined;
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
    getBodypartsData (): Record<string, string> {
      let data: Record<string, string> = {};

      if (!this.selectedAccentColorPartValue) {
        return data;
      }

      data[this.selectedAccentColorPartValue.optionId] =
        this.selectedAccentColorPartValue.optionValueId;

      return data;
    },
    async trySubmitForm (): Promise<void> {
      const isValid = await (
        this.$refs.formObserver as InstanceType<typeof ValidationObserver>
      ).validate();

      if (isValid) {
        await this.onSubmit();
        return;
      }

      let errorStepIndex = this.activeStepIndex;

      for (
        let stepIndex = this.customizerSteps.length - 1;
        stepIndex >= 0;
        stepIndex--
      ) {
        if (
          this.stepValidateState[this.customizerSteps[stepIndex].id] ===
          'invalid'
        ) {
          errorStepIndex = stepIndex;
        }
      }

      this.activeStepIndex = errorStepIndex;
    },
    goToCrossSells (): void {
      this.$router.push(localizedRoute('/cross-sells/p/' + this.product.sku));
    },
    onBackgroundImageAssigned (): void {
      this.updateSmallBackgroundImage();
    },
    prefillEmail (): void {
      const customerEmail = this.$store.getters['budsies/getCustomerEmail'];

      if (customerEmail) {
        this.customerEmail = customerEmail;
        this.showEmailStep = false;
      }
    },
    async processImages (): Promise<CustomerImage[]> {
      const backgroundEditor = this.getBackgroundEditor();
      const backPreview = this.getBackPreview();
      const frontPreview = this.getFrontPreview();

      if (!this.fileProcessingRepository) {
        throw new Error('File processing repository is not available!');
      }

      if (!backgroundEditor || !backPreview || !frontPreview) {
        throw new Error('Unable to get preview elements!');
      }

      const image = await backgroundEditor.getCroppedBackground();
      if (!image) {
        throw new Error('Background image is unavailable!');
      }

      const backSvg = backPreview.getCustomizedSVG(TARGET_IMAGE_SIZE);
      const frontSvg = frontPreview.getCustomizedSVG(TARGET_IMAGE_SIZE, image);

      if (!backSvg || !frontSvg) {
        throw new Error('Unable to get vector images for conversion!');
      }

      if (!this.backgroundDataUri) {
        throw new Error('Unable to get original background photo!');
      }

      if (
        !this.frontDesign ||
        !this.selectedBackDesign ||
        (!this.selectedAccentColorPartValue && this.isAccentColorSelectorVisible)
      ) {
        throw new Error('Design variants or accent color are not specified!');
      }

      const backDesignBlob = new Blob([backSvg], { type: 'image/svg+xml' });
      const frontDesignBlob = new Blob([frontSvg], { type: 'image/svg+xml' });
      const backgroundBlob = this.getBlobFromDataUri(this.backgroundDataUri);

      const [frontStorageItem, backStorageItem, backgroundOriginalItem] =
        await Promise.all([
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
        (item: Item) => ({
          id: item.id,
          url: this.imageHandlerService.getOriginalImageUrl(item.url)
        })
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

        const customerImages = await this.processImages();

        await this.$store.dispatch('product/setBundleOptions', {
          product: this.product,
          bundleOptions: this.$store.state.product.current_bundle_options
        });

        this.$store.commit(
          budsiesTypes.SN_BUDSIES + '/' + budsiesTypes.CUSTOMER_EMAIL_SET,
          { email: this.customerEmail }
        );

        await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, {
            qty: this.quantity,
            email: this.customerEmail,
            bodyparts: this.getBodypartsData(),
            customFields: JSON.stringify(this.customTextValues),
            customerImages: customerImages,
            uploadMethod: 'upload-now'
          })
        });

        this.goToCrossSells();
      } catch (error) {
        let errorToParse: any = error;

        if (isAxiosError(error) && error.response) {
          errorToParse = error.response.data;
        }

        this.submitErrors =
          this.errorConverterService.describeError(errorToParse);
        this.isSubmitting = false;
      }
    },
    onAccentColorSelect (value: AccentColorPart): void {
      Vue.set(
        this.stepValidateState,
        customizerStepsData.customOptions.id,
        'valid'
      );
      this.accentColorPartValue = value;
    },
    onBackDesignSelect (value?: string): void {
      this.emitDesignSelectedEvent({ frontDesign: this.frontDesign, backDesign: value });
    },
    onFrontDesignSelect (value?: string): void {
      this.emitDesignSelectedEvent({ frontDesign: value, backDesign: this.backDesign });
    },
    onBackgroundImageUploaded (image: string): void {
      const backgroundEditor = this.getBackgroundEditor();

      if (!backgroundEditor) {
        throw new Error('Unable to get Background editor element!');
      }

      Vue.set(
        this.stepValidateState,
        customizerStepsData.uploadPhoto.id,
        'valid'
      );

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
    onFrontAccentColorElementsCounted (coloredElementsNumber: number): void {
      this.frontAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackAccentColorElementsCounted (coloredElementsNumber: number): void {
      this.backAccentColorElementsNumber = coloredElementsNumber;
    },
    onBackgroundOffsetSettingsPrepared (
      settings: BackgroundOffsetSettings
    ): void {
      this.backgroundOffsetSettings = settings;
    },
    onChangeStep (nextStep: number) {
      this.activeStepIndex = nextStep;
    },
    async updateSmallBackgroundImage (): Promise<void> {
      if (!this.$refs.backgroundEditor) {
        return;
      }

      if (!this.isCustomizerPreviewBackSideFocused) {
        this.croppedBackground = '';
        return;
      }

      await this.$nextTick();

      const backgroundEditor = this.getBackgroundEditor();

      if (!backgroundEditor) {
        throw new Error('Unable to get background editor!');
      }

      const image = await backgroundEditor.getCroppedBackground();
      if (image) {
        this.croppedBackground = image;
      }
    },
    async validateStepsBeforeIndex (index: number): Promise<void> {
      const keys = Object.keys(customizerStepsData).filter(
        (_, keyIndex) => keyIndex < index
      );

      for (const key of keys) {
        if (!this.$refs[customizerStepsData[key].id]) {
          continue;
        }

        const validationResult: ValidationResult = await (
          this.$refs[customizerStepsData[key].id] as InstanceType<
            typeof ValidationProvider
          >
        ).validate();

        Vue.set(
          this.stepValidateState,
          customizerStepsData[key].id,
          validationResult.valid ? 'valid' : 'invalid'
        );
      }
    }
  },
  beforeMount () {
    this.$bus.$once('budsies-store-synchronized', this.prefillEmail);
  },
  beforeDestroy () {
    this.$bus.$off('budsies-store-synchronized', this.prefillEmail);
  },
  created (): void {
    this.customizerStepsData = customizerStepsData;

    this.fileProcessingRepository = this.fileProcessingRepositoryFactory.create(
      this.imageUploadUrl
    );

    if (!this.frontDesign && this.frontDesignProducts.length) {
      this.onFrontDesignSelect(this.frontDesignProducts[0].sku);
    }

    this.accentColorPartValues = this.getAccentColorPartValues(
      this.bodyparts[0]
    );

    if (this.selectedBackDesign) {
      this.stepValidateState[customizerStepsData.backDesign.id] = 'valid';
    }

    this.prefillEmail();

    if (this.isProductionOptionsAvailable) {
      this.productionTime = this.productionTimeOptions[0].id;
    }
  },
  watch: {
    activeStepIndex: {
      handler (val: number, oldVal: number): void {
        if (val === oldVal) {
          return;
        }

        void this.validateStepsBeforeIndex(val);

        const previousStep = this.customizerSteps[oldVal];
        const currentStep = this.customizerSteps[val];

        if (
          [currentStep.id, previousStep.id].indexOf(
            customizerStepsData.backDesign.id
          ) === -1
        ) {
          return;
        }

        this.isCustomizerPreviewBackSideFocused =
          currentStep.id === customizerStepsData.backDesign.id;
      }
    },
    frontDesign: {
      handler (newValue: string | undefined) {
        if (!this.frontDesignBundleOption) {
          Logger.error(
            'frontDesignBundleOption is not defined while attempt to set it was performed',
            'budsies'
          )();
          return;
        }

        let frontDesign;
        if (newValue) {
          frontDesign = this.frontDesignProducts.find(
            (product) => product.sku === this.frontDesign
          );
        }

        this.setBundleOptionValue({
          optionId: this.frontDesignBundleOption.option_id,
          optionQty: 1,
          optionSelections: frontDesign ? [frontDesign.optionValueId] : []
        });
      },
      immediate: true
    },
    selectedBackDesign: {
      handler (newValue: string | undefined) {
        if (!this.backDesignBundleOption) {
          Logger.error(
            'backDesignBundleOption is not defined while attempt to set it was performed',
            'budsies'
          )();
          return;
        }

        let backDesign;
        if (newValue) {
          backDesign = this.backDesignProducts.find(
            (product) => product.sku === this.selectedBackDesign
          );
        }

        this.setBundleOptionValue({
          optionId: this.backDesignBundleOption.option_id,
          optionQty: 1,
          optionSelections: backDesign ? [backDesign.optionValueId] : []
        });
      },
      immediate: true
    },
    isCustomizerPreviewBackSideFocused: {
      handler (): void {
        void this.updateSmallBackgroundImage();
      }
    },
    productionTime: {
      handler (newValue: string | undefined) {
        if (!this.productionTimeBundleOption) {
          Logger.error(
            'productionTimeBundleOption is not defined while attempt to set it was performed',
            'budsies'
          )();
          return;
        }

        let productionTime;
        if (newValue) {
          productionTime = this.productionTimeOptions.find(
            (product) => product.id === this.productionTime
          );
        }

        this.setBundleOptionValue({
          optionId: this.productionTimeBundleOption.option_id,
          optionQty: 1,
          optionSelections: productionTime?.optionValueId
            ? [productionTime.optionValueId]
            : []
        });
      },
      immediate: false
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-phrase-pillow-product-order-form {
  $color-border: #acacac;
  $color-white: #fff;
  $medium-breakpoint: 641px;

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 14px;

  ._main-header {
    line-height: 100%;
  }

  ._notes {
    text-align: center;
  }

  ._form-content {
    --heading-title-font-weight: 800;
    --heading-title-font-size: var(--font-base);
    --heading-padding: 0;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  ._customizer-steps {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    ::v-deep {
      .sf-steps__header {
        box-shadow: none;
        --steps-border-width: 0 0 2px 0;
      }

      .sf-steps__progress {
        --steps-progress-background: var(--c-dark);
        --steps-progress-height: 2px;
      }

      .sf-steps__content {
        overflow-y: scroll;
        flex: 1 1;
        flex-basis: 0px;
      }
    }
  }

  ._front_design_preview_container,
  ._customization-section {
    ._error-text {
      margin-top: 1em;
    }
  }

  ._front_design_preview_container {
    padding: 0.8em;
    height: 100%;
    text-align: center;

    ._section-header {
      h5 {
        margin: 0.3em 0;
      }
    }
  }

  ._design-images-container {
    padding: 0 0.8em;
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

  ._design-images {
    margin-top: 1em;
  }

  ._helper-text {
    font-size: var(--font-2xs);
    font-weight: var(--font-medium);
    margin: var(--spacer-xs) 0;
    text-align: center;
  }

  ._label {
    display: block;
    text-align: center;
    font-size: var(--font-base);
    font-weight: var(--font-medium);
  }

  ._customization-section {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding-left: 0;
    padding-right: 0;

    ._form {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
    }

    ._customizer-step {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 4em;
      flex: 1;
      padding: 0.6em 0.4em 0.4em;
      text-align: center;
      cursor: pointer;
      user-select: none;

      &.-active {
        cursor: default;
      }

      &.-done {
        &::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          bottom: -3.8px;
        }
      }

      ._validation-icon {
        position: absolute;
        top: 2px;
        right: 2px;
        padding: 1px;
        font-size: 0.8em;
        color: $color-white;
        border-radius: 100%;
      }
    }

    ._step-container {
      padding: 0 0.8em 0;

      ._step-title {
        margin-top: 0;
      }
    }

    ._input-container {
      padding: 0 2.4em;
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

    ._production-time-field,
    ._actions-row,
    ._animation-row,
    ._final-steps {
      margin-top: 1.5em;
      text-align: center;
    }

    ._production-time-field {
      ::v-deep .sf-select__selected {
        justify-content: center;
      }
    }

    ._custom-text-fields-section {
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
      padding: 0;
      text-align: center;

      ._accent-color-selector-container {
        margin-top: 1em;
      }

      ._error-text {
        margin: 1em 0;
      }

      &:first-child {
        margin-top: 0;
      }
    }

    ._email-disclaimer {
      margin-top: var(--spacer-xs);
    }

    ._production-time-field {
      margin-top: 3em;
    }

    ._submit-disclaimer {
      margin-top: 1em;
    }

    ._background-image-field {
      text-align: center;
      padding: 0;

      ._background-uploader {
        padding: 0 2em;
        margin-bottom: 1.2em;
      }
    }

    ._bottom-static-block {
      text-align: center;
      margin-top: var(--spacer-base);

      ::v-deep p:last-child {
        margin-bottom: 0;
      }
    }

    ._front-image-small {
      display: flex;
      position: relative;
      background-color: $color-white;
      width: 100%;

      ::v-deep svg {
        width: 100%;
        height: auto;
      }

      ._background {
        position: absolute;
        width: calc(100% - 2px);
        top: 1px;
        left: 1px;
      }
    }
  }

  ._preview-image-small {
    display: flex;
    position: relative;
    background-color: $color-white;
    width: 100%;

    ::v-deep svg {
      width: 100%;
      height: auto;
    }

    ._background {
      position: absolute;
      width: calc(100% - 2px);
      top: 1px;
      left: 1px;
    }
  }

  ._quantity-field {
    text-align: center;
  }

  .m-live-preview {
    width: 100%;
  }

  @media (max-width: $medium-breakpoint - 1px) {
    .-show-for-medium-up {
      display: none !important;
    }
  }

  @media (min-width: $medium-breakpoint) {
    --h1-font-size: 2.625rem;
    --h3-font-size: 1.625rem;
    --heading-title-font-weight: bold;
    --heading-padding: 0;

    font-size: var(--font-size-base);

    .-show-for-small-only {
      display: none !important;
    }

    ._helper-text {
      font-size: var(--font-xs);
    }

    ._form-content {
      flex-direction: row;
      padding-top: 3.5em;
      --heading-title-font-size: var(--font-lg);
    }

    ._live-preview-section {
      flex: 1;
      height: auto;

      ._front_design_preview_container {
        position: sticky;
        top: 3.4em;
        height: auto;
        padding-bottom: 0;
      }
    }

    ._label {
      text-align: left;
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
      flex: 1;
      height: auto;
      padding: 0 0.8em;
      margin-top: -1.6em;

      ._accent-color-field {
        padding: 0;
      }

      ._form {
        height: auto;
      }

      ._input-container {
        padding: 0;
      }

      ._actions-row {
        ._submit-button {
          margin-left: 0;
          margin-right: 0;
        }
      }

      ._step-title,
      ._background-image-field,
      ._quantity-field,
      ._email-field,
      ._production-time-field,
      ._actions-row,
      ._accent-color-field,
      ._front-design-field,
      ._back-design-field,
      ._custom-text-field,
      ._final-steps,
      ._helper-text,
      ._bottom-static-block {
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

      ._production-time-field {
        ::v-deep .sf-select__selected {
          justify-content: flex-start;
        }
      }

      ._step {
        font-size: var(--font-base);
        text-align: left;
      }

      ._background-image-field {
        ._background-uploader {
          margin-top: 0.4em;
        }
      }
    }

    ._customizer-steps {
      ::v-deep {
        .sf-steps__content {
          overflow-y: visible;
        }
      }
    }
  }

  @include for-desktop {
    ._actions-row {
      text-align: left;
    }

    ._live-preview-section {
      ._front_design_preview_container {
        top: 4.4em;
      }
    }

    ._front-preview {
      ._front-hint {
        ._helper-text {
          font-size: 0.85em;
          margin: 1.5em 0;
        }
      }

      ._hint-image {
        width: 3.5em;
        height: 3.5em;
      }
    }
  }

  &.-skin-petsies {
    $color-customizer-step-background: #ededed;
    $color-add-to-cart-step-background: #43c5e4;
    $color-add-to-cart-step-hover-background: #81d8ed;

    ._customizer-step {
      color: var(--c-dark-variant);
      font-weight: 800;

      &.-done {
        color: var(--c-dark);

        &::after {
          background-color: var(--c-dark);
        }
      }

      &.-invalid {
        color: var(--c-danger-variant);
      }
    }

    ._header {
      padding-left: .9375rem;
      padding-right: .9375rem;
      --heading-title-font-line-height: 100%;
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

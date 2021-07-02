<template>
  <div class="m-submit-animator">
    <video
      id="animation_element"
      autoplay
      loop
      muted
      playsinline="autoplay loop muted playsinline"
      class="_animation"
    >
      <source :src="animationUrl" type="video/mp4">
    </video>

    <div class="_progress-bar">
      <div class="_inner" :style="progressBarStyle" />
    </div>

    <div class="_calculation-steps">
      {{ currentStep.text }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SubmitAnimationStepsInterface from '../interfaces/submit-animation-steps.interface';

export default Vue.extend({
  name: 'MSubmitAnimator',
  props: {
    steps: {
      type: Array as PropType<SubmitAnimationStepsInterface[]>,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    animationUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      currentStepIndex: 0,
      progressPercent: 0
    }
  },
  computed: {
    currentStep (): SubmitAnimationStepsInterface {
      return this.steps[this.currentStepIndex];
    },
    progressBarStyle (): Record<string, string> {
      return {
        width: `${this.progressPercent}%`
      };
    }
  },
  methods: {
    async runProgress (): Promise<void> {
      if (!this.steps.length) {
        return;
      }

      this.currentStepIndex = 0;
      this.progressPercent = 0;
      let initialWidth = 0;

      const stepDuration = Math.round(this.duration / this.steps.length);

      for (let i = 0; i < this.steps.length; i++) {
        await this.animate(
          initialWidth,
          this.currentStep.value,
          stepDuration
        );

        initialWidth = this.currentStep.value;
        this.currentStepIndex += 1;
      }
    },
    async animate (
      startValue: number,
      finishValue: number,
      duration: number
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const limitWidth = finishValue - startValue;

        const timer = setInterval(() => {
          const timePassed = Date.now() - start;

          const progressPercent =
                    startValue + (limitWidth * timePassed) / duration;

          this.progressPercent = Math.min(progressPercent, 100);

          if (timePassed >= duration) {
            clearInterval(timer);
            resolve();
          }
        }, 10);
      });
    }
  }
})
</script>

<style lang="scss" scoped>
$progress-bar-color: #31c1ff;

.m-submit-animator {
    ._animation {
        max-width: 300px;
    }

    ._progress-bar {
        width: 75%;
        margin: 1em auto;
        border: 1px solid $progress-bar-color;
        border-radius: 0.15em;
        height: 1em;

        ._inner {
            background-color: $progress-bar-color;
            height: 100%;
            width: 0%;
        }
    }

    ._calculation-steps {
        margin-top: 1em;
    }
}
</style>

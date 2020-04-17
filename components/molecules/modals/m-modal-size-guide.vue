<template>
  <div class="m-modal-size-guide">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading :title="$t('Size guide')" :level="3" />
      <AStatic :content="defaultContent" />
      <SfButton
        class="sf-button--full-width color-secondary"
        @click="closeModal"
      >
        {{ $t("OK") }}
      </SfButton>
    </SfModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  SfModal,
  SfButton,
  SfHeading
} from '@storefront-ui/vue';
import AStatic from 'theme/components/atoms/a-static';
import i18n from '@vue-storefront/i18n';

export default {
  name: 'MModalSizeGuide',
  components: {
    AStatic,
    SfModal,
    SfButton,
    SfHeading
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  computed: {
    ...mapGetters({
      defaultContent: 'defaultContent/getDefaultContent'
    })
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('defaultContent/updateDefaultContent')
    ])
  }
};
</script>
<style lang="scss" scoped>
.m-modal-size-guide {
  .sf-modal {
    --modal-width: 700px;
  }
}
</style>

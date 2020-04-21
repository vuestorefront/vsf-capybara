<template>
  <div v-if="isContentAvailable" class="a-static">
    <SfTabs v-if="showTabs">
      <SfTab v-for="c in content" :key="c.title" :title="c.title">
        <div v-html="c.message" />
      </SfTab>
    </SfTabs>
    <div v-else class="content">
      <SfHeading :level="1" :title="content.title" />
      <div v-html="content.message" />
    </div>
  </div>
</template>

<script>
import { SfTabs, SfHeading } from '@storefront-ui/vue';

export default {
  name: 'AStatic',
  components: {
    SfTabs,
    SfHeading
  },
  props: {
    content: {
      type: [Object, Array],
      default: () => ({
        title: '',
        message: ''
      })
    }
  },
  computed: {
    showTabs () {
      return Array.isArray(this.content);
    },
    isContentAvailable () {
      return Array.isArray(this.content)
        ? this.content.length
        : this.content.title && this.content.message;
    }
  }
};
</script>

<style lang="scss" scoped>
.a-static {
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  table {
    width: 100%;
    margin: var(--spacer-2xl) 0;
    border-collapse: collapse;
    th, td {
      padding: calc(var(--spacer-sm) * 2);
      border: 1px solid var(--_c-light-primary-darken);
    }
  }
  .content {
    padding: var(--spacer-sm);
  }
}
</style>

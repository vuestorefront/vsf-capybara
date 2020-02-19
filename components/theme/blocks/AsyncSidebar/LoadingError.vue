<template>
  <div class="wrapper">
    <div v-if="OnlineOnly" class="row">
      <SfIcon
        class="icon"
        icon="info_circle"
        size="xxs"
        color="#ffffff"
      />
      <span>An error occured while loading the component. </span>
      <div>
        <span class="link" @click="reload">Try again</span> /
        <span class="link" @click="close"> Close</span>
      </div>
    </div>
    <div v-if="OfflineOnly" class="row">
      <SfIcon
        class="icon"
        icon="info_circle"
        size="xxs"
        color="#ffffff"
      />
      <span>Component couldn't be loaded due to lack of network connectivity.</span>
      <span class="link" @click="close">Close</span>
    </div>
  </div>
</template>

<script>
import VueOfflineMixin from 'vue-offline/mixin';
import { SfIcon } from '@storefront-ui/vue';

export default {
  name: 'LoadingError',
  components: { SfIcon },
  mixins: [VueOfflineMixin],
  mounted () {
    this.$on('online', () => {
      this.reload();
    });
  },
  methods: {
    reload () {
      this.$emit('reload');
    },
    close () {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ff847b;
  color: white;
}
.icon {
  margin-right: 5px;
}
.link {
  text-decoration: underline;
  cursor: pointer;
}
.row {
  justify-content: center;
  text-align: center;
}
</style>

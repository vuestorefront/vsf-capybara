<template>
  <div id="app">
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from './layouts/Default'

export default {
  components: {
    DefaultLayout
  }
};
</script>

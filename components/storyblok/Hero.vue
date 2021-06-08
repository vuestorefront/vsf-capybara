<template>
  <section :style="{ backgroundColor: item.background_color }">
    <img v-if="item.background" :src="item.background" alt="">
    <div class="text">
      <h2 class="heading">
        {{ item.title }}
      </h2>
      <h3 class="subtitle">
        {{ item.subtitle }}
      </h3>
      <div class="cta">
        <a v-if="item.url" :href="item.url">
          <button>{{ item.cta }}</button>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  height: 500px;
  position: relative;
  overflow: hidden;
  a {
    display: block;
    width: 100%;
    text-align: center;
  }
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    min-height: 500px;
    object-fit: cover;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }
  .text {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    color: #fff;
    padding: 0 12px;
  }
  .heading {
    height: 60%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 48px;
    line-height: normal;
    margin: 0;
    text-shadow: 1px 1px 1px rgba(0,0,0,.5);
    padding: 12px;
    text-align: center;
  }
  .subtitle {
    font-size: 17px;
    line-height: normal;
    text-align: center;
    margin: 0;
    text-shadow: 1px 1px 1px rgba(0,0,0,.5);
  }
  .cta {
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
section.box {
  height: 500px;
}
.usp > div {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
}
@media (max-width: 767px) {
  .usp {
    height: 15px;
    font-size: 8px;
    line-height: 0;
    padding: 0 6px;
  }
  .usp > div {
      padding: 0;
  }
}
</style>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'HeroBlok',
  extends: Blok
}
</script>

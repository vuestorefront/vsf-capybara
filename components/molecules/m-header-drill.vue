<template>
  <div class="avis-banner">
    <div class="avis-background" />
    <p class="text_upper">
      We are specialized in DIY and gardening tools
    </p>
    <AHeaderAvisIcon />
  </div>
</template>
<script>

import AHeaderAvisIcon from 'theme/components/atoms/a-header-avis-icon';

export default {
  components: {
    AHeaderAvisIcon
  },
  data () {
    return {
      title: '',
      subtitle: 'We are specialized in DIY and gardening tools',
      description:
        '',
      buttonText: '',
      image: {
        mobile: '/assets/images/icon_drill.png',
        desktop: '/assets/images/icon_drill.png'
      }
    };
  }
};

</script>
<style  lang="scss" scoped>
  .text_upper
  {
    height: 42px;
    width: 196px;
    color: #FFFFFF;
    font-family: Poppins;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 23px;
    text-shadow: 0 2px 9px 0 rgba(0,0,0,0.5);
  }

</style>

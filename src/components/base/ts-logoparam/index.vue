<template>
  <div class="logoParant" :class="isOem ? 'oemLogo' : ''">
    <a v-if="!isOem" :href="jumpAddress" target="_blank" class="imgClick">
      <img :src="imgSrc" alt="销售管理系统" class="logoImg" />
    </a>
    <a v-else href="javaScript:void(0);">
      <img :src="imgSrc" alt="销售管理系统" class="logoImg" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'ts-logoparam',
  props: {
    isOem: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      default: '',
    },
    jumpAddress: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.logoParant {
  position: relative;
  display: inline-block;
  width: 170px;
  height: 60px;
  .logoImg {
    position: absolute;
    top: 0;
    right: auto;
    bottom: 0;
    left: 16px;
    display: block;
    width: auto;
    height: 38px;
    max-height: 100%;
    margin: auto;
  }
  .imgClick {
    display: block;
    height: 60px;
  }
}
</style>

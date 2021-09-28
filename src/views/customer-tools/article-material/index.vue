<!--
 * @Description  : 获客文章 - 文章
 * @Author       : turbo
 * @Date         : 2021-03-17 17:44:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-20 14:30:30
-->

<template>
  <div class="articleMaterial">
    <router-view v-if="isOtherRouter"></router-view>
    <component v-else :is="currentComponent"></component>
  </div>
</template>

<script>
import articleMaterialBox from './components/article-material-box/index.vue';

export default {
  name: 'ArticleMaterial',
  data() {
    return {
      isOtherRouter: false,
      currentComponent: 'articleMaterialBox',
      changeTyle: 0,
    };
  },
  components: {
    articleMaterialBox,
  },
};
</script>

<style lang="scss" scoped></style>

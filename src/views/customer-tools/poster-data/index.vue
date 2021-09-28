<!--
 * @Description  : 获客海报 - 数据
 * @Author       : turbo
 * @Date         : 2021-03-30 13:49:12
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 11:17:52
-->

<template>
  <div class="posterData">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          海报数据
        </div>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <component :is="currentTemp"> </component>
    </div>
  </div>
</template>

<script>
import posterDetail from './components/poster-detail/index.vue';

export default {
  name: 'PosterData',
  components: { posterDetail },
  data() {
    return {
      currentTemp: 'posterDetail',
    };
  },
};
</script>

<style lang="scss" scoped></style>

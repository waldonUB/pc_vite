<!--
 * @Author       : ADI
 * @Date         : 2021-03-22 11:37:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-13 15:27:01
-->
<template>
  <div id="app" :class="{ directSale: !isOem }">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex';
// 多色svg
import '@/utils/version-svg';

export default {
  name: 'App',
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
  },
};
</script>

<style lang="scss">
@import '@/styles/base.scss';
</style>

<!--
 * @Description  : 推广链接
 * @Author       : turbo
 * @Date         : 2021-03-30 14:19:36
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-23 09:54:09
-->

<template>
  <component :is="currentComponent" @toOpenForm="currentComponent = 'openForm'"></component>
</template>

<script>
// components
import proUrlList from './components/pro-url-list.vue';
import OpenForm from './components/open-form.vue';

export default {
  name: 'ProUrl',
  components: { proUrlList, OpenForm },
  data() {
    return {
      currentComponent: 'proUrlList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

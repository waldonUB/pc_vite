<!--
 * @Description  : 获客表单 - 表单
 * @Author       : turbo
 * @Date         : 2021-03-17 17:45:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 15:51:30
-->

<template>
  <div class="formManage">
    <router-view v-if="isOtherRouter"></router-view>
    <component v-else :is="currentComponent"></component>
  </div>
</template>

<script>
import formManageBox from './components/form-manage-box/index.vue';

export default {
  name: 'FormManage',
  components: { formManageBox },
  data() {
    return {
      isOtherRouter: false,
      currentComponent: 'formManageBox',
    };
  },
};
</script>

<style lang="scss" scoped></style>

<!--
 * @Description  : 第三方接入
 * @Author       : turbo
 * @Date         : 2021-03-30 14:19:08
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 13:27:35
-->

<template>
  <component
    :is="currentComponent"
    @toOpenForm="currentComponent = 'openForm'"
    @toCompanyList="currentComponent = 'companyList'"
  ></component>
</template>

<script>
// components
import CompanyList from './components/company-list.vue';
import OpenForm from './components/open-form.vue';

export default {
  name: 'OtherWorker',
  components: { CompanyList, OpenForm },
  data() {
    return {
      currentComponent: 'companyList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

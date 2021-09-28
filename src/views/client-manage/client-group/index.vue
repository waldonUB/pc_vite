<!--
 * @Description  : 客户群
 * @Author       : turbo
 * @Date         : 2021-03-30 14:12:06
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-21 13:33:36
-->

<template>
  <component
    :is="currentComponent"
    @toGroupDetail="currentComponent = 'groupDetail'"
    @backToPrePage="currentComponent = 'groupList'"
  ></component>
</template>

<script>
import GroupList from './components/group-list.vue';
import GroupDetail from './components/group-detail.vue';

export default {
  name: 'ClientGroup',
  components: { GroupList, GroupDetail },
  data() {
    return {
      currentComponent: 'groupList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

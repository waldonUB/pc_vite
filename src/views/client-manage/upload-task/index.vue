<!--
 * @Description  : 同步任务管理
 * @Author       : turbo
 * @Date         : 2021-03-30 14:20:04
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-23 12:38:35
-->

<template>
  <component
    :is="currentComponent"
    @toTaskDetail="currentComponent = 'taskDetail'"
    @backToPrePage="currentComponent = 'taskList'"
  ></component>
</template>

<script>
// components
import TaskList from './components/task-list.vue';
import TaskDetail from './components/task-detail.vue';

export default {
  name: 'UploadTask',
  components: { TaskList, TaskDetail },
  data() {
    return {
      currentComponent: 'taskList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

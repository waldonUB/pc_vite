<!--
 * @Description  : 全部任务
 * @Author       : turbo
 * @Date         : 2021-03-30 15:23:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:03:52
-->

<template>
  <div class="allTask">
    <keep-alive include="allTaskData">
      <component
        :is="currentComponent"
        @changeComponent="change"
        :taskId="taskId"
        :taskType="taskType"
        :pyqChooseItem="pyqChooseItem"
      ></component>
    </keep-alive>
  </div>
</template>

<script>
import { decodeHtml } from '@/utils';
import allTaskData from './components/all-task-data/index.vue';
import taskDetail from './components/task-detail/index.vue';
import taskNewAdd from './components/task-new-add/index.vue';

export default {
  name: 'allTask',
  components: {
    allTaskData, // 全部任务数据
    taskDetail, // 任务详情
    taskNewAdd, // 下发任务
  },
  props: {},
  data() {
    return {
      currentComponent: 'allTaskData',
      taskId: 0, // 任务id 用于跳转任务详情
      pyqChooseItem: null,
      taskType: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getFromParams();
    if (this.$route.params.chooseItem) {
      this.currentComponent = this.$route.params.componentName ? this.$route.params.componentName : 'allTaskData';
      this.pyqChooseItem = JSON.parse(decodeHtml(this.$route.params.chooseItem));
      this.taskType = this.$route.params.taskType;
      this.$route.params.chooseItem = null;
    }
  },
  mounted() {},
  methods: {
    /**
     * 根据路由参数做对应操作
     * @author waldon
     * @date 2020/11/29
     */
    getFromParams() {
      if (this.$route.params.fromPage === 'videoCenter') {
        this.currentComponent = 'taskNewAdd';
      }
    },
    /**
     * 切换组件
     * @author lymn
     * @date 2020-08-24
     * @param {String} component 组件名称
     * @param {Number} taskId 任务id 可选，跳转任务详情会传过来
     */
    change(component, taskId) {
      this.currentComponent = component;
      this.taskId = taskId;
    },
  },
};
</script>

<style lang="scss" scoped>
.allTask {
  height: 100%;
}
</style>

<style lang="scss">
.allTask {
  .operateBtn {
    cursor: pointer;
    &.red {
      color: $error-color;
    }
  }

  .tshu_select {
    &.taskType {
      .tshu_select_option {
        max-height: 342px;
      }
    }
  }
}
.articlePoupBox {
  height: auto !important;
  padding: 0 !important;
  overflow-y: unset !important;
  .el-table--scrollable-x {
    .el-table__body-wrapper {
      overflow-x: hidden;
    }
  }
}
</style>

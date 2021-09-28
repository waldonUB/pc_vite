<!--
 * @Description  : 我的任务
 * @Author       : turbo
 * @Date         : 2021-03-30 15:26:04
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:37
-->

<template>
  <div class="myTask">
    <keep-alive include="myTaskData">
      <component :is="currentComponent" @changeComponent="change" :taskId="taskId"></component>
    </keep-alive>
  </div>
</template>

<script>
import myTaskData from './components/my-task-data/index.vue';
import taskDetail from './components/task-detail/index.vue';

export default {
  name: 'myTask',
  components: {
    myTaskData,
    taskDetail,
  },
  props: {},
  data() {
    return {
      currentComponent: 'myTaskData',
      taskId: 0, // 任务id 用于跳转任务详情
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
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

<style lang="scss">
.shareTask {
  &.el-popover {
    padding: 10px;
    &.popover-shareBtn {
      .popoverContent {
        text-align: center;
      }
      .popoverContent-desc {
        height: auto;
        margin-top: 10px;
      }
    }
  }
  &.tanshu-qrTip {
    .popoverContent {
      display: flex;
      flex-direction: column;
      .qrCode {
        float: none;
        width: 160px;
        height: 160px;
      }
    }
  }
}

.myTaskContianer {
  .qrTipWrap {
    .el-popover__reference {
      display: inline-block;
    }
  }
  .el-table__fixed-right {
    &::before {
      background: none;
    }
  }
  .operateBtn {
    cursor: pointer;
  }
}
.myTaskContianer .el-table,
.myTaskContianer .el-table__body-wrapper,
.myTaskContianer .el-table .cell {
  overflow: visible;
}
</style>

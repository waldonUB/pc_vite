<!--
 * @Description  : 任务详情
 * @Author       : turbo
 * @Date         : 2021-07-23 12:18:15
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-25 16:23:15
-->

<template>
  <global-ts-card-box class="task-detail" :need-bottom="false">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
        <template #leftPart>任务管理</template>
        <template #rightPart>任务详情</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="task-content">
        <div>任务序号：{{ taskInfo.id }}</div>
        <div>任务状态：{{ taskInfo.statusName }}</div>
        <div class="task-info">
          <span class="label">总数量</span>
          <span class="num blue">{{ taskInfo.count }}</span>
          <span class="label">成功数量</span>
          <span class="num blue">{{ taskInfo.sucCnt }}</span>
          <span class="label">失败数量</span>
          <span class="num red">{{ taskInfo.errCnt }}</span>
        </div>
        <global-ts-button v-if="taskInfo.canDownloadInvalid" type="primary" size="small" @click="exportInvalidList">
          导出错误详情
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
// utils
import { exportExcel } from '@/utils';

// api
import { task } from '@/api';

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskInfo: {
        id: 0, // 任务ID
        statusName: '', // 任务状态
        count: 0, // 数据总数
        sucCnt: 0, // 成功条数
        errCnt: 0, // 失败条数
        canDownloadInvalid: false, // 是否可以导出错误详情
      },
    };
  },
  created() {
    this.$pubsub.emit('toTaskDetail', taskId => {
      this.getTaskResult(taskId);
    });
  },
  methods: {
    async getTaskResult(id) {
      const { getTaskResult } = task;
      const [err, res] = await getTaskResult({ id });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.taskInfo = res.data;
    },
    async exportInvalidList() {
      const { exportInvalidList } = task;
      const [err, res] = await exportInvalidList({ id: this.taskInfo.id });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { invalidList = [], keyJson = {} } = res.data;
      exportExcel(invalidList, '同步任务失败记录', keyJson);
    },
  },
};
</script>

<style lang="scss" scoped>
.task-detail {
  ::v-deep {
    .tanshu-cardBox-body {
      @include flex-column-top-center;
    }
  }

  .task-content {
    width: 450px;
    margin-top: 40px;
    color: $color-53;

    > div {
      margin-bottom: 30px;
    }
  }

  .task-info {
    color: $color-89;

    .label {
      padding-left: 10px;
      margin: 0 10px;
      border-left: 1px solid $error-color-bg;

      &:first-child {
        padding: 0;
        margin-left: 0;
        border: 0 none;
      }
    }

    .num {
      font-size: 20px;
    }

    .blue {
      color: $primary-color;
    }

    .red {
      color: $error-color;
    }
  }
}
</style>

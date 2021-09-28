<!--
 * @Description  : 释放线索对话框
 * @Author       : turbo
 * @Date         : 2021-06-23 17:09:40
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 15:30:36
-->

<template>
  <global-ts-dialog
    class="releas-clue-dialog"
    dialog-title="放弃线索"
    dialog-size="medium"
    :dialog-visible.sync="dialogVisible"
    :lock-dialog-body-height="false"
    @sure="sure"
    @cancel="cancel"
  >
    <div class="releas-clue-dialog-content">
      <div class="release-item">
        <div class="release-item-title">已选中线索：</div>
        <div class="release-item-content">{{ ids.length }}</div>
      </div>
      <div class="release-item">
        <div class="release-item-title">
          <global-ts-svg-icon class="icon" name="icon-icon-17" :size="8" color="#ff4d4d"></global-ts-svg-icon>
          <span>放弃到公海：</span>
        </div>
        <div class="release-item-content">线索公海</div>
      </div>
      <div class="release-item">
        <div class="release-item-title">
          <global-ts-svg-icon class="icon" name="icon-icon-17" :size="8" color="#ff4d4d"></global-ts-svg-icon>
          <span>放弃原因：</span>
        </div>
        <div class="release-item-content">
          <global-ts-select
            type="large"
            v-model="requestParam.releaseReasonId"
            placeholder="请选择原因"
            :width="300"
            :list="reasonList"
            :selectkey="{ label: 'name', value: 'id' }"
          >
          </global-ts-select>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
// utils
import { clueCommTip } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'ReleaseClueDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      requestParam: {
        idListJson: '',
        releaseReasonId: 0, // 放弃的原因
      },
      reasonList: [],
    };
  },
  created() {
    this.getReasonList();
  },
  methods: {
    async getReasonList() {
      const { getListByTypeWithInsert } = client;
      const [err, res] = await getListByTypeWithInsert({
        type: 19, // 线索公海废弃原因
        onlyAble: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.reasonList = res.data;
    },
    async sure() {
      if (!this.requestParam.releaseReasonId) {
        this.$utils.postMessage({
          type: 'error',
          message: '请选择原因',
        });
        return;
      }
      const { batchRelease } = client;
      this.requestParam.idListJson = JSON.stringify(this.ids);
      const [err, res] = await batchRelease(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject();
      }
      clueCommTip(res.data);
      this.$emit('sure');
      this.cancel();
    },
    cancel() {
      // 初始化
      const initData = this.$options.data();
      this.requestParam = { ...initData.requestParam };
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.releas-clue-dialog {
  .releas-clue-dialog-content {
    @include flex-column-left;

    margin-top: 12px;
  }

  .release-item {
    @include flex-center;

    margin-bottom: 20px;
    color: $color-53;

    &:first-child {
      margin-bottom: 28px;
    }
  }

  .release-item-title {
    @include flex-right;

    width: 169px;
    margin-right: 20px;

    .icon {
      margin-right: 5px;
    }
  }
}
</style>

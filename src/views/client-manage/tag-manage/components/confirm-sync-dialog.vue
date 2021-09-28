<!--
 * @Description  : 确认同步对话框
 * @Author       : turbo
 * @Date         : 2021-07-21 15:08:29
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-21 16:07:54
-->

<template>
  <global-ts-dialog
    class="confirm-sync-dialog"
    dialog-title="提示"
    dialog-size="small"
    title-center
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="content">
      <div>是否将企业微信标签同步到当前系统中</div>
      <div>（同步将覆盖当前系统标签）</div>
      <div class="confirm-tip">
        <fa-checkbox v-model="synced">同时将系统标签同步到企业微信</fa-checkbox>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
export default {
  name: 'ConfirmSyncDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      synced: false,
    };
  },
  watch: {
    dialogVisible(newVal) {
      newVal && (this.synced = false);
    },
  },
  methods: {
    sure() {
      this.$emit('sure', this.synced);
      this.cancel();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/1
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-sync-dialog {
  .content {
    text-align: center;
  }

  .confirm-tip {
    margin-top: 10px;
  }
}
</style>

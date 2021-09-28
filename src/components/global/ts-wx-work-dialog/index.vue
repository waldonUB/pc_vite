<template>
  <el-dialog
    class="wxWorkDialog flex flex-vc"
    :class="dialogSize"
    :title="dialogTitle"
    :visible="tsDialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    :width="dialogWidthCal"
    :append-to-body="appendToBody"
  >
    <span v-if="withTitle" slot="title" class="dialogTitle">
      <slot name="title"></slot>
    </span>
    <slot></slot>
    <span v-if="withFooter" slot="footer" class="dialogFooter">
      <div v-if="withNormalFooter" class="normalFooter">
        <global-ts-button
          :class="['sureBtn', { disabled: disabledSureBtn }]"
          type="primary"
          :size="btnSizeCal"
          @click="sure"
        >
          {{ sureName }}
        </global-ts-button>
        <global-ts-button v-if="withReset" class="cancel" type="others" :size="btnSizeCal" @click="reset">
          {{ resetName }}
        </global-ts-button>
        <global-ts-button v-else class="cancel" type="others" :size="btnSizeCal" @click="cancel">
          {{ cancelName }}
        </global-ts-button>
      </div>
      <slot name="diyFooter"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ts-wx-work-dialog',
  props: {
    tsDialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    dialogWidth: {
      type: String,
      default: '',
    },
    dialogSize: {
      type: String,
      default: '',
    },
    withFooter: {
      type: Boolean,
      default: true,
    },
    withTitle: {
      type: Boolean,
      default: false,
    },
    withNormalFooter: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    withReset: {
      type: Boolean,
      default: false,
    },
    sureName: {
      type: String,
      default: '确认',
    },
    cancelName: {
      type: String,
      default: '取消',
    },
    resetName: {
      type: String,
      default: '重置',
    },
    disabledSureBtn: {
      // 是否禁用确认按钮
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * 按钮计算
     * @author waldon
     * @date 2020-07-13
     */
    btnSizeCal() {
      if (this.dialogSize === 'small') {
        return 'small';
      } else {
        return 'medium';
      }
    },
    /**
     * 计算的对话框width属性
     * 优先取传进来的值，否则取默认的size
     * */
    dialogWidthCal() {
      if (this.dialogWidth) {
        return this.dialogWidth;
      }
      switch (this.dialogSize) {
        case 'large':
          return '1000px';
        case 'medium':
          return '620px';
        case 'small':
          return '320px';
        default:
          return '620px';
      }
    },
  },
  methods: {
    beforeClose() {
      this.cancel();
    },
    cancel() {
      this.$emit('cancel');
    },
    sure() {
      this.$emit('sure');
    },
    reset() {
      this.$emit('reset');
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkDialog {
  color: $color-53;
}
</style>

<style lang="scss">
.wxWorkDialog {
  .dialogContent {
    .fitBox {
      width: 100%;
    }
  }
  .el-dialog {
    margin: 0 auto !important;
    .el-dialog__title {
      font-size: 16px;
      color: $color-00;
    }
    .el-dialog__body {
      padding: 20px 30px 30px 30px;
      background: #ffffff;
      border-top: 1px solid $border-disabled-color;
      border-radius: 4px;
    }
    .el-dialog__footer {
      .global-button {
        min-width: 140px;
      }
      .rightPartBtn {
        margin-right: 10px;
      }
    }
  }
  &.large {
    .el-dialog__body {
      padding: 0;
    }
  }
  .el-dialog__footer {
    display: flex;

    /* height: 100px; */

    /* turbo modify */
    height: 80px;
    padding: 0;
    border-top: 1px solid $border-disabled-color;
    align-items: center;
    justify-content: center;
    .sureBtn {
      margin-right: 10px;
    }
  }
  &.small {
    .el-dialog__header {
      height: 20px;
      padding: 20px 30px;
      line-height: 20px;
      .el-dialog__title {
        font-size: 16px;
        line-height: 16px;
      }
      .el-dialog__headerbtn {
        top: 15px;
        right: 20px;
        width: 30px;
        height: 30px;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 20px 20px 30px 20px;
    }
    .el-dialog__footer {
      height: 64px;
    }
  }
}
</style>

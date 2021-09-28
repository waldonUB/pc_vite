<template>
  <fa-modal
    :wrapClassName="wrapClassNameCal"
    :title="dialogTitle"
    :centered="centered"
    :closable="closable"
    :mask="mask"
    :maskClosable="maskClosable"
    :width="dialogWidthCal"
    v-model="dialogVisibleCal"
    :z-index="zIndex"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot></slot>
    <template slot="footer">
      <div class="tsFaiModalFooter" v-if="isUseNormalFooter">
        <fa-button class="tsLarge" key="submit" type="primary" @click="handleOk" :disabled="submitBtnDisabled">
          确定
        </fa-button>
        <fa-button class="tsLarge" key="back" type="default" @click="handleCancel">取消</fa-button>
      </div>
      <div class="tsFaiModalFooter footerSet" v-else>
        <slot name="footer"></slot>
      </div>
    </template>
  </fa-modal>
</template>

<script>
import { Modal } from '@fk/faicomponent';
export default {
  name: 'ts-fai-modal',
  components: {
    [Modal.name]: Modal,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    dialogSize: {
      type: String,
      default: 'medium',
    },
    dialogWidth: {
      type: String,
      default: '',
    },
    withFooter: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    centered: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    keyboard: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    isUseNormalFooter: {
      // 是否使用通用的footer
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 3000,
    },
    wrapClassName: {
      type: String,
      default: 'tsFaiModal',
    },
    submitBtnDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    wrapClassNameCal() {
      return `tsFaiModal ${this.wrapClassName}`;
    },
    /**
     * 返回对话框宽度
     * @author waldon
     * @date 2020/10/20
     * @returns {String} 返回对话框宽度
     */
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
    dialogVisibleCal: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('getDialogVisible', newVal);
      },
    },
  },
  methods: {
    handleOk() {
      this.$emit('handleOk');
    },
    handleCancel() {
      this.$emit('handleCancel');
    },
  },
};
</script>

<style lang="scss">
/* 通用对话框组件 */
.tsFaiModal {
  .tsFaiModalTitleTip {
    margin-left: 5px;
    font-size: 12px;
    line-height: 1;
    color: #666666;
  }

  .fa-modal-header {
    padding: 20px 30px;
    .fa-modal-title {
      font-size: 16px;
      line-height: 21px;
      color: $color-00;
    }
  }
  .fa-modal-close-x {
    width: 61px;
    height: 61px;
    line-height: 61px;
  }
  .fa-modal-body {
    position: relative;
    padding: 20px 30px;
  }
  .tsFaiModalFooter {
    display: flex;
    height: 60px;
    justify-content: center;
    align-items: center;
    .tsLarge {
      &.fa-btn {
        width: 140px;
        height: 40px;
        font-size: 16px;
      }
    }
  }
  &.noFooter {
    .fa-modal-footer {
      height: 0;
      padding: 0;
      overflow: hidden;
      border-top: none;
    }
  }
}
</style>

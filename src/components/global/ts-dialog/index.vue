<template>
  <fa-modal
    v-model="dialogVisibleCal"
    :forceRender="true"
    :wrapClassName="wrapClassNameCal"
    :width="dialogWidthCal"
    :title="dialogTitleCal"
    :footer="dialogFooterCal"
    :centered="centered"
    :closable="closableCal"
    :maskClosable="maskClosable"
    :z-index="zIndex"
    @ok="handleSure"
    @cancel="handleCancel"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- title -->
    <template slot="title">
      <div class="tsFaiModal-title">
        <slot name="title"></slot>
      </div>
    </template>
    <global-ts-svg-icon slot="closeIcon" name="icon-guanbi1616"></global-ts-svg-icon>
    <!-- body -->
    <template v-if="dialogSize === 'smallText'">
      <div :class="['smallTextBody', hasSmallDialogTitle ? 'hasSmallDialogTitle' : 'notSmallDialogTitle']">
        <div class="smallTextBody__title" v-if="hasSmallDialogTitle">
          <slot name="title">{{ dialogTitle }}</slot>
        </div>
        <div class="smallTextBody__content">
          <slot></slot>
        </div>
      </div>
    </template>
    <div class="defaultBody" :class="{ noBodyPadding }" v-else>
      <slot></slot>
    </div>
    <!-- footer -->
    <template slot="footer">
      <div class="tsFaiModal-footer" v-if="isUseNormalFooter">
        <global-ts-button
          :class="`button-${dialogSize}`"
          key="submit"
          type="primary"
          size="small"
          @click="handleSure"
          :disabled="sureBtnDisabled"
          :loading="sureBtnLoading"
        >
          {{ sureBtnName }}
        </global-ts-button>
        <global-ts-button
          v-if="withCancelBtn"
          :class="`button-${dialogSize}`"
          type="greyOther"
          size="small"
          @click="handleCancel"
        >
          {{ cancelBtnName }}
        </global-ts-button>
        <global-ts-button
          v-if="withResetBtn"
          :class="`button-${dialogSize}`"
          type="greyOther"
          size="small"
          @click="handleReset"
        >
          {{ resetBtnName }}
        </global-ts-button>
      </div>
      <div class="tsFaiModal-footer" v-else>
        <slot name="footer"></slot>
      </div>
    </template>
  </fa-modal>
</template>

<script>
import { Modal } from '@fk/faicomponent';
import { debounce } from 'lodash';

export default {
  name: 'ts-dialog',
  inheritAttrs: false,
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
    // size: large / medium / small / smallText width: 1000px 620px 320px 320px
    dialogSize: {
      type: String,
      default: 'medium',
    },
    dialogWidth: {
      type: String,
      default: '',
    },
    // 弹窗内容高度限制
    lockDialogBodyHeight: {
      type: Boolean,
      default: true,
    },
    withTitle: {
      type: Boolean,
      default: true,
    },
    withFooter: {
      type: Boolean,
      default: true,
    },
    withCancelBtn: {
      type: Boolean,
      default: true,
    },
    withResetBtn: {
      type: Boolean,
      default: false,
    },
    sureBtnName: {
      type: String,
      default: '确定',
    },
    cancelBtnName: {
      type: String,
      default: '取消',
    },
    resetBtnName: {
      type: String,
      default: '重置',
    },
    sureBtnDisabled: {
      type: Boolean,
      default: false,
    },
    sureBtnLoading: {
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
    maskClosable: {
      type: Boolean,
      default: false,
    },
    keyboard: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    wrapClassName: {
      type: String,
      default: '',
    },
    noBodyPadding: {
      type: Boolean,
      default: false,
    },
    titleCenter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    hasSmallDialogTitle() {
      return this.dialogTitle || this.hasTitleSlot;
    },
    dialogVisibleCal: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('getDialogVisible', newVal);
      },
    },
    /**
     * @description : 1. withTitle控制title节点显示/隐藏。2. title插槽存在展示插槽内容。
     * @author      : ADI
     * @Date        : 2021-04-09 15:00:06
     */
    dialogTitleCal() {
      const isSmallText = this.dialogSize === 'smallText'; // 小弹窗title放在body里
      if (!this.withTitle || isSmallText) return null; // 返回 null 移除 title slot
      return this.hasTitleSlot ? undefined : this.dialogTitle; // 返回 undefined 启用 title slot
    },
    hasTitleSlot() {
      return !!this.$slots.title;
    },
    /**
     * @description : withFooter控制footer节点显示/隐藏。
     * @author      : ADI
     * @Date        : 2021-04-09 15:00:06
     */
    dialogFooterCal() {
      if (!this.withFooter) return null;
      return undefined;
    },
    isUseNormalFooter() {
      return !this.$slots.footer;
    },
    wrapClassNameCal() {
      let baseClassName = `tsFaiModal-wrap ${this.dialogSize}`;
      if (this.lockDialogBodyHeight) {
        baseClassName += ' lockDialogBodyHeight';
      }
      if (this.titleCenter) {
        baseClassName += ' titleCenter';
      }
      return `${baseClassName} ${this.wrapClassName}`;
    },
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
        case 'smallText':
          return '320px';
        default:
          return '620px';
      }
    },
    closableCal() {
      if (this.dialogSize === 'smallText') return false; // smallText hide
      return this.closable;
    },
  },
  methods: {
    handleSure: debounce(function() {
      this.$emit('sure', 'sure');
    }, 100),
    handleCancel: debounce(function() {
      this.$emit('cancel', 'cancel');
    }, 100),
    handleReset: debounce(function() {
      this.$emit('reset', 'reset');
    }, 100),
  },
};
</script>

<style lang="scss">
/* 通用对话框组件 */
.tsFaiModal-wrap {
  .fa-modal-header {
    padding: 16px 24px;
    .fa-modal-title {
      font-size: 16px;
      line-height: 1;
      color: $color-00;

      .main-title {
        display: inline-block;
        font-size: 16px;
        line-height: 21px;
        color: $color-00;
      }

      .sub-des {
        font-size: 14px;
        color: $color-89;
      }
    }
  }
  .fa-modal-close-x {
    width: 64px;
    height: 49px;
    line-height: 49px;
  }

  /* large medium small */
  &.large {
    .fa-modal-content {
      min-width: 1000px;
    }
  }
  &.medium {
    .fa-modal-content {
      min-width: 620px;
    }
  }
  &.small {
    .fa-modal-content {
      min-width: 320px;
    }
  }
  &.smallText {
    .fa-modal-content {
      min-width: 320px;
    }
  }
  .fa-modal-body {
    position: relative;
    max-height: 100%;
    padding: 0;
    overflow: visible;
    font-size: 14px;
    .defaultBody {
      padding: 20px 24px;

      &.noBodyPadding {
        padding: 0;
      }
    }
    .smallTextBody {
      &.hasSmallDialogTitle {
        padding: 32px 24px;
      }
      &.notSmallDialogTitle {
        padding: 40px 24px;
      }
      .smallTextBody__title {
        height: 24px;
        margin-bottom: 12px;
        font-size: 18px;
        line-height: 1;
        color: $color-00;
        text-align: center;
      }
      .smallTextBody__content {
        max-height: 200px;
        max-height: 25vh;
        max-height: max(25vh, 200px);
        overflow: auto;
      }
    }
  }
  .fa-modal-footer {
    padding: 12px;
    & button + button {
      margin-left: 12px;
    }
    .tsFaiModal-footer {
      display: flex;
      justify-content: center;
      align-items: center;

      /* hack: 解决按钮文字抖动问题 */
      .global-button > span {
        vertical-align: baseline;
      }
      .button-large {
        &.fa-btn {
          min-width: 140px;
        }
      }
      .button-medium {
        &.fa-btn {
          min-width: 140px;
        }
      }
      .button-small {
        &.fa-btn {
          min-width: 88px;
        }
      }
      .button-smallText {
        &.fa-btn {
          min-width: 88px;
        }
      }
    }
  }
  &.lockDialogBodyHeight {
    .fa-modal-body {
      max-height: 550px;
      max-height: 68vh;
      max-height: max(68vh, 550px);
      overflow: auto;
    }
  }
  &.titleCenter {
    .fa-modal-header {
      @include flex-center;
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

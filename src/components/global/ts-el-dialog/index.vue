<template>
  <el-dialog
    :visible.sync="isShowDialog"
    :title="title"
    :width="width"
    top="0px"
    :modal="modal"
    :close-on-click-modal="clickModalClose"
    :close-on-press-escape="pressEscapeClose"
    :show-close="showClose"
    :before-close="hadleClose"
    :center="center"
    class="flex flex-vc"
    custom-class="tanshu-dialog"
  >
    <slot name="title"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'ts-el-dialog',
  components: {},
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    title: String,
    width: {
      type: String,
      default: '50%',
    },
    //是否显示遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
    // 点击遮罩层关闭
    clickModalClose: {
      type: Boolean,
      default: true,
    },
    //按下ESC键关闭
    pressEscapeClose: {
      type: Boolean,
      default: true,
    },
    //显示右上角关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
    //关闭回调
    beforeClose: {
      type: Function,
      default: null,
    },
    //标题和底部是否居中显示
    center: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hadleClose() {
      const done = () => {
        this.$emit('update:isShowDialog', false);
      };
      if (this.beforeClose) {
        this.beforeClose(done);
      } else {
        done();
      }
    },
  },
};
</script>

<style lang="scss">
/* 探鼠dialog弹窗组件 */
.tanshu-dialog {
  &.el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: $zindex-dialog;
    margin: 0;
    background: #ffffff;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.24);
    .el-dialog__header {
      position: relative;
      height: 48px;
      padding: 0;
      padding-left: 21px;
      line-height: 48px;
      color: $color-00;

      /* box-sizing: border-box; */
      border-bottom: 1px solid $border-disabled-color;
      .el-dialog__title {
        display: inline-block;
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        color: $color-00;
      }
      .el-dialog__headerbtn {
        top: 50%;
        height: 16px;
        vertical-align: top;
        transform: translate(0%, -50%);
        .el-dialog__close {
          color: $color-b2;
          vertical-align: top;
        }
      }
    }
    .el-dialog__headerbtn {
      &:hover {
        .el-dialog__close {
          color: $color-89 !important;
        }
      }
    }
    .el-dialog__body {
      padding: 30px;
      .pro_listBox {
        padding: 0;
      }
    }
  }
}
</style>

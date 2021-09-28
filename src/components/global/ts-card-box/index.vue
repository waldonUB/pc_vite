<template>
  <div class="tanshu-cardBox" :class="bindClass">
    <div class="tanshu-cardBox-bg">
      <slot name="card-box-bg"></slot>
    </div>
    <div class="tanshu-cardBox-head">
      <slot name="card-box-head"></slot>
    </div>
    <div class="tanshu-cardBox-body" :class="bodyClass" ref="tanshu-cardBox-body">
      <slot name="card-box-body"> </slot>
    </div>
    <div class="tanshu-cardBox-bottom" v-if="needBottom">
      <slot name="card-box-bottom"> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-card-box',
  data() {
    return {
      bindClass: this.bottomTips ? 'buttonTips' : '',
    };
  },
  computed: {
    bodyClass() {
      let styleClass = '';
      if (!this.needBottom) {
        styleClass += ' noBottom';
      }
      return styleClass;
    },
  },
  props: {
    bottomTips: {
      type: Boolean,
      default: false,
    },
    needBottom: {
      // 是否需要底部操作栏
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.tanshu-cardBox {
  position: relative;
  width: 100%;
  height: 100%;
  .tanshu-cardBox-head {
    height: 20px;
    padding-bottom: 30px;
  }
  .tanshu-cardBox-body {
    position: absolute;
    top: 56px;
    right: 0;
    bottom: 0;
    left: 0;
    margin-bottom: 48px;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 4px;
    opacity: 1;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
    &.noBottom {
      margin-bottom: 0;
    }
  }
  .tanshu-cardBox-bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding: 12px 0;
    text-align: center;
    background-color: $color-ff;
    border-top: 1px solid #eeeeee;
    border-radius: 4px;
    opacity: 1;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
/* 表单 */
.tanshu-cardBox-body {
  .el-form.el-form--label-top {
    margin: 10px 0;
  }
  .el-form-item {
    padding-top: 30px;
    margin-bottom: 0;
  }
  .el-form-item__label {
    line-height: inherit;
  }
  .el-form-item__content {
    line-height: inherit;
  }
}
</style>

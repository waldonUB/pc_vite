<!--
 * @Author       : ADI
 * @Date         : 2021-04-27 15:18:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 16:36:24
-->
<template>
  <div class="tshu-bubble" :class="isFixed ? 'fixed' : ''" v-show="isShow" v-tsclickoutside="cancelFun">
    <div class="contentBox">
      <slot name="boxContent" v-if="isShow"></slot>
    </div>
    <div class="bottomBtn">
      <global-ts-button class="sureBtn" type="primary" size="small" :disabled="isDisabled" @click="sureFun">
        确认
      </global-ts-button>
      <global-ts-button class="cancel" type="others" size="small" @click="cancelFun">取消 </global-ts-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-bubble',
  methods: {
    sureFun: function() {
      this.$emit('sure', this);
    },
    cancelFun: function() {
      this.$emit('update:isShow', false);
      this.$emit('cancel');
    },
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
/* 不带红星的提示 */

/* 小弹窗 */
#templateIdPopup {
  &.tshu-bubble {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 189px;
    margin: auto;
  }
}
.tshu-bubble {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $zindex-mutual;
  width: 320px;
  background: #ffffff;
  border-bottom: 1px solid $border-disabled-color;
  border-radius: 4px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.24);
  &.fixed {
    position: fixed;
    z-index: $zindex-dialog;
  }
  .contentBox {
    padding: 30px 20px 0;
  }
  .bottomBtn {
    width: 100%;
    height: 64px;
    padding-top: 15px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    border-top: 1px solid $border-disabled-color;
    box-sizing: border-box;
    .sureBtn {
      height: 34px;
      min-width: 88px;
      margin-right: 10px;
      font-size: 14px;
      line-height: 1;
    }
    .cancel {
      width: 100px;
      height: 34px;
      font-size: 14px;
      line-height: 1;
    }
  }
}

.tshu-bubble {
  .contentBox {
    .warning_alert {
      float: left;
      width: 280px;
      height: 32px;
      padding-left: 11px;
      margin: 20px 0;
      font-size: 14px;
      line-height: 32px;
      text-align: left;
      background: #fff8ed;
      border: 1px solid #ffc96a;
      border-radius: 4px;
      box-sizing: border-box;
      .icon {
        font-size: 16px;
        color: #ffbc48;
      }
    }
  }
}
</style>

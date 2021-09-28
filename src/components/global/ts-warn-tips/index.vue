<!--
 * @Author       : ADI
 * @Date         : 2021-04-22 14:04:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:46:21
-->
<template>
  <div class="warnTips" :class="warnClass">
    <global-ts-svg-icon v-if="isShowIcon" class="icon tanshu_tips" name="icon-icon-1" />
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'ts-warn-tips',
  props: {
    isCenter: {
      type: Boolean,
      default: true,
    },
    isShowIcon: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'middle',
    },
    tipType: {
      type: String,
      default: 'warn',
    },
  },
  computed: {
    warnClass() {
      return [this.isCenter ? 'isMiddle' : '', this.size, this.tipType];
    },
  },
};
</script>

<style lang="scss" scoped>
/* 警告提示封装 */
.warnTips {
  position: relative;
  height: 40px;
  padding: 0 11px 0 13px;
  margin-bottom: 15px;
  font-size: 14px;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: 0;
  color: $color-53;
  background: rgba(255, 191, 0, 0.1);
  border: 1px solid rgba(255, 191, 0, 0.3);
  border-radius: 4px;
  box-sizing: border-box;
  &.isMiddle {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
  &.info {
    background: $primary-color-bg;
    border: 1px solid $primary-color;
    .tanshu_tips {
      &.icon {
        color: $primary-color;
      }
    }
  }
  .tanshu_tips {
    margin-right: 8px;
    font-size: 15px;
    color: $warning-color;
  }
  &.small {
    height: 32px;
    line-height: 32px;
  }
}
</style>

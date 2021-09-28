<!--
 * @Author       : ADI
 * @Date         : 2021-04-28 15:12:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:32:53
-->
<template>
  <el-tooltip
    :effect="effect"
    :content="content"
    :placement="placement"
    :value="value"
    :disabled="disabled"
    :offset="offset"
    :transition="transition"
    :popper-class="popperClass"
    :hide-after="hideAfter"
    v-windowBlur="pageBlur"
    :manual="manual"
    v-if="showToolTip"
  >
    <slot></slot>
    <div slot="content">
      {{ content }}
      <slot name="content"></slot>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'ts-tool-tips',
  data() {
    return {
      showToolTip: true,
    };
  },
  methods: {
    pageBlur() {
      // 页面不可见（最小化或者切换其他标签页时），需要销毁重置组件，不然如果点击了按钮之后，重新切回页面会自动出提示
      this.showToolTip = false;
      this.$nextTick(() => {
        this.showToolTip = true;
      });
    },
  },
  props: {
    effect: {
      type: String,
      default: 'dark',
    },
    content: String,
    placement: {
      type: String,
      default: 'top',
    },
    value: Boolean,
    disabled: Boolean,
    offset: [Number, String],
    transition: String,
    // 添加类名
    popperClass: {
      type: String,
    },
    // Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏
    hideAfter: {
      type: Number,
      default: 0,
    },
    manual: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
/* 探鼠slide插件 */
.tanshu_toolTips {
  &.el-tooltip__popper {
    &.is-dark {
      max-width: 480px;
      padding: 10px;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #ffffff;
      background: #303133;
      border-radius: 4px;
      box-sizing: border-box;
      a {
        color: #ffffff;
      }
      .el-tooltip:focus {
        outline: none;
      }
    }

    cursor: pointer;
  }
}
</style>

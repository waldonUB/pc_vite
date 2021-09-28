<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 10:51:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 11:02:32
-->
<template>
  <div :class="['tanshu-ellipsis-tip', bindClass]">
    <el-tooltip :effect="effect" :disabled="isHideElTooltip" :placement="placement" :content="contentText">
      <div class="contentCls" :style="{ width: width }">
        <span @mouseenter="hanldeElTooltip($event)">{{ contentText }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui';

export default {
  name: 'ts-ellipsis-tip',
  components: {
    [Tooltip.name]: Tooltip,
  },
  props: {
    bindClass: {
      type: String,
      default: '',
    },
    effect: {
      // 默认提供的主题
      type: String,
      default: 'dark',
    },
    placement: {
      // Tooltip 出现位置。位置汇总：top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
      type: String,
      default: 'top',
    },
    outerShellWidth: {
      // Tooltip 外层壳的宽度,default自定义设置
      type: Number,
      default: 0,
    },
    contentText: {
      // 文本内容
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isHideElTooltip: true, // Tooltip 是否可用 true不可用 false可用
    };
  },
  computed: {
    width() {
      return `${this.outerShellWidth}px`;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    hanldeElTooltip(event) {
      // 作比较：文本实际的宽度与外层壳的宽度
      this.isHideElTooltip = event.target.offsetWidth <= this.outerShellWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-ellipsis-tip {
}
</style>

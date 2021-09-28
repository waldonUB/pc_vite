<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 10:29:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:31:58
-->
<template>
  <div class="tanshu-selectClick" :class="bingClassStyle" @click="clickHandle">
    <span class="tagListStr " :class="tagTipStyle">{{ selectListStr || placeholder }}</span>
    <i class="el-icon-arrow-down"></i>
  </div>
</template>

<script>
export default {
  name: 'ts-select-click',
  components: {},
  props: {
    bindClass: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: Boolean,
    },
    selectListStr: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'small', //small medium
    },
  },
  data() {
    return {};
  },
  computed: {
    bingClassStyle() {
      let className = this.bindClass + ' ' + 'size-' + this.size;
      if (this.disabled === 'disabled') {
        className += ' isDisabled';
      }
      return className;
    },
    tagTipStyle() {
      return !this.selectListStr ? 'tagTipStyle' : '';
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    clickHandle() {
      this.$emit('clickHandle');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 可点击的选择框 */
.tanshu-selectClick {
  position: relative;
  z-index: 2;
  width: 254px;
  height: 34px;
  padding: 0 16px 0 10px;
  margin-right: 10px;
  overflow: hidden;
  font-size: 14px;
  line-height: 34px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid $color-da;
  border-radius: 4px;
  box-sizing: border-box;
  &.isDisabled {
    cursor: not-allowed !important;
    background: #f6f6f6 !important;
    border: 1px solid #eeeeee !important;
  }
  &.size-medium {
    height: 40px;
    line-height: 40px;
  }
  .tagListStr {
    &.tagTipStyle {
      color: #c0c4cc;
    }
  }
  &.errorTip {
    border: 1px solid $error-color;
  }
}

/* 可点击的选择框 */
</style>

<style lang="scss">
.tanshu-selectClick {
  .el-icon-arrow-down {
    position: absolute;
    top: 50%;
    right: 6px;
    color: $color-b2;
    transform: translateY(-50%);
  }
}
</style>

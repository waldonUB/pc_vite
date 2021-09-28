<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 11:10:02
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-05 16:01:30
-->
<template>
  <div class="studyTip lookStudy">
    <global-ts-svg-icon class="icon icon_16" name="icon-icon-1"></global-ts-svg-icon>
    <span class="lookStudy-desc" @click="handleClick">查看配置教程</span>
  </div>
</template>

<script>
export default {
  name: 'study-tip',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      this.$emit('handleClick');
    },
  },
};
</script>

<style lang="scss" scoped>
.studyTip {
  display: flex;
  width: 100%;
  height: 40px;
  margin-bottom: 24px;
  font-size: 14px;
  color: $primary-color;
  cursor: pointer;
  background: $primary-color-bg;
  border: 1px solid $primary-color;
  border-radius: 2px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  &:hover {
    color: $primary-color-hover;
  }
  .icon {
    margin-right: 8px;
  }
}
</style>

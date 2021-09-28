<!--
 * @Author       : ADI
 * @Date         : 2021-05-08 17:47:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:39:10
-->
<template>
  <div class="tanshu_err">
    <global-ts-svg-icon class="icon tanshu_erricon" name="icon-icon-1" />
    <slot name="errorTips"></slot>
  </div>
</template>

<script>
export default {
  name: 'ts-error',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.tanshu_err {
  height: 20px;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: $error-color;
  color: $error-color;
  .tanshu_erricon {
    width: 12px;
    height: 12px;
    margin-right: 6px;
  }
}
</style>

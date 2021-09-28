<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:45:36
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-18 16:23:30
-->
<template>
  <div class="twoColumnsThreeItemByFlex flex flex-vc">
    <div class="leftBox">
      <slot name="left"></slot>
    </div>
    <div class="middleBox flex1">
      <slot></slot>
    </div>
    <div class="rightBox">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-two-columns-three-item-by-flex',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.twoColumnsThreeItemByFlex {
  padding: 20px;
  margin-bottom: 20px;
  background: $color-ff;
  border: 1px solid $border-disabled-color;
  border-radius: 4px;
  box-sizing: border-box;
  flex: 0 0 49.4%;
  .middleBox {
    padding: 14px 20px 14px 16px;
    .middle__box_title {
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
      color: $color-00;
    }
    .middle__box_des {
      margin-top: 12px;
      font-size: 14px;
      line-height: 22px;
      color: $color-b2;
    }
  }
}
</style>

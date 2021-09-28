<!--
 * @Author       : ADI
 * @Date         : 2021-04-28 15:12:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-14 16:30:36
-->
<template>
  <div class="ts-tabguide" :class="{ noMargin }">
    <div class="goManage" @click="backManage($event)">
      <slot name="leftPart"></slot>
      <global-ts-svg-icon class="icon guideArrowIcon" name="icon-xiangyou1616" :size="16" />
    </div>
    <div class="ourPage">
      <slot name="rightPart"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-tabguide',
  props: {
    noMargin: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    backManage: function(event) {
      this.$emit('backToPrePage', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-tabguide {
  @include flex-left;

  height: 34px;
  margin-bottom: 20px;
  font-size: 16px;

  &.noMargin {
    margin: 0;
  }

  .goManage {
    font-weight: normal;
    color: $color-89;
    cursor: pointer;

    .guideArrowIcon {
      margin: 0 8px;
    }
  }

  .ourPage {
    font-weight: bold;
    color: $color-00;
  }
}
</style>

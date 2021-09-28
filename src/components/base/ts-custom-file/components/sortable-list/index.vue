<!--
 * @Author       : ADI
 * @Date         : 2021-04-06 10:47:50
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-06 14:30:26
-->
<template>
  <div class="infoBox SortableList">
    <slot />
  </div>
</template>

<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

export default {
  name: 'sortable-list',
  mixins: [ContainerMixin],
};
</script>

<style lang="scss" scoped>
.customFiledDialog {
  .customFiledDialogContent {
    .infoPart {
      .infoBox {
        display: flex;
        flex-flow: row wrap;
        margin-top: 20px;
        &.SortableList {
          max-width: 100%;
          padding: 4px;
          overflow: hidden;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>

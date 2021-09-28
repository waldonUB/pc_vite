<!--
 * @Author       : ADI
 * @Date         : 2021-04-06 14:35:41
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-06 14:38:11
-->
<template>
  <div class="sorList">
    <slot></slot>
  </div>
</template>

<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

export default {
  name: 'ts-slicksort-list',
  mixins: [ContainerMixin],
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.ts-slicksort-list {
}
</style>

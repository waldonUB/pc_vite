<!--
 * @Author       : ADI
 * @Date         : 2021-07-01 09:40:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-01 09:41:20
-->
<template>
  <div class="sorList">
    <slot></slot>
  </div>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort';

export default {
  name: 'slicksort-list',
  mixins: [ContainerMixin],
  components: {},
  props: {
    dragType: {
      // 类型
      type: String,
      default: 'drag',
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.slicksort-list {
}
</style>

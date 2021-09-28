<template>
  <div class="tanshu_table_nodata">
    <global-ts-versionfunctip v-if="isDefaultText" :funcText="topVersion"></global-ts-versionfunctip>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'ts-nodata',
  props: {
    isDefaultText: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      topVersion: '当前版本暂不支持该功能',
    };
  },
};
</script>

<style lang="scss" scoped>
.ts-nodata {
}
</style>

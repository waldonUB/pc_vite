<!--
 * @Author       : ADI
 * @Date         : 2021-04-28 15:12:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:36:49
-->
<template>
  <global-ts-svg-icon class="icon questionMark" name="icon-bianzu" @click="showBar" />
</template>

<script>
export default {
  name: 'ts-question-mark',
  methods: {
    showBar() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-question-mark {
}
</style>

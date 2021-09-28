<!--
 * @Description  : 商品列表
 * @Author       : turbo
 * @Date         : 2021-03-30 15:27:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:35:36
-->
<template>
  <div class="index-wrap" v-if="isHaveVersion && showOperateBox">
    indexManage
    <global-ts-button
      v-for="name in compNameList"
      :type="name === compName ? '' : 'mainText'"
      @click="handleToggle(name)"
      :key="name"
    >
      Toggle {{ name }}
    </global-ts-button>
    <component :is="compName"></component>
  </div>
</template>

<script>
import CGlobal from '@/views/index-manage/components/test-global.vue';
import CBase from '@/views/index-manage/components/test-base.vue';
import CEdit from '@/views/index-manage/components/test-edit.vue';

export default {
  name: 'IndexManage',
  components: { CGlobal, CBase, CEdit },
  data() {
    return {
      compNameList: ['CGlobal', 'CBase', 'CEdit'],
      compName: 'CGlobal',
      isHaveVersion: true,
      showOperateBox: true,
    };
  },
  methods: {
    handleToggle(name) {
      this.compName = name;
    },
  },
};
</script>

<style lang="scss" scoped>
.index-wrap {
  height: 2000px;
}
</style>

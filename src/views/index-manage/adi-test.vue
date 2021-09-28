<!--
 * @Description  : 首页
 * @Author       : turbo
 * @Date         : 2021-02-23 16:18:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-11 11:57:07
-->

<template>
  <div class="index-wrap">
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
import CGlobal from './components/test-global.vue';
import CBase from './components/test-base.vue';
import CEdit from './components/test-edit.vue';

export default {
  name: 'IndexManage',
  components: { CGlobal, CBase, CEdit },
  data() {
    return {
      compNameList: ['CGlobal', 'CBase', 'CEdit'],
      compName: 'CGlobal',
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

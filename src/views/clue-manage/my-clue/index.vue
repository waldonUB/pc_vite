<!--
 * @Description  : 我的线索
 * @Author       : turbo
 * @Date         : 2021-05-20 09:27:17
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 11:57:33
-->

<template>
  <component
    :is="currentComponent"
    page-name="我的线索"
    :page-value="0"
    @editClue="currentComponent = 'editClue'"
    @importClue="currentComponent = 'importClue'"
    @backToPrePage="currentComponent = 'cluePoolList'"
  ></component>
</template>

<script>
// components
import CluePoolList from '../components/clue-pool-list.vue';
import EditClue from '../components/edit-clue.vue';
import ImportClue from '../components/import-clue.vue';

export default {
  name: 'MyClue',
  components: { CluePoolList, EditClue, ImportClue },
  data() {
    return {
      currentComponent: 'cluePoolList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

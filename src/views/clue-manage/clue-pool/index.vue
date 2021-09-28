<!--
 * @Description  : 线索公海
 * @Author       : turbo
 * @Date         : 2021-03-30 14:10:44
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 14:10:04
-->

<template>
  <component
    :is="currentComponent"
    page-name="线索公海"
    :page-value="2"
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
  name: 'CluePool',
  components: { CluePoolList, EditClue, ImportClue },
  data() {
    return {
      currentComponent: 'cluePoolList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

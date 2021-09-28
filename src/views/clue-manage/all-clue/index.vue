<!--
 * @Description  : 全部线索
 * @Author       : turbo
 * @Date         : 2021-05-20 09:25:18
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 14:25:45
-->

<template>
  <component
    :is="currentComponent"
    page-name="全部线索"
    :page-value="1"
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
  name: 'AllClue',
  components: { CluePoolList, EditClue, ImportClue },
  data() {
    return {
      currentComponent: 'cluePoolList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

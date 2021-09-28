<!--
 * @Description  : 企业查询
 * @Author       : turbo
 * @Date         : 2021-03-30 13:56:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-27 13:47:16
-->

<template>
  <div class="corpSearch">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc" v-if="currentTemp === 'corpSearchList'">
          企业查询
        </div>
        <div class="operateList" v-else-if="currentTemp === 'corpSearchDetail'">
          <global-ts-tabguide @backToPrePage="backManage">
            <template v-slot:leftPart>企业查询</template>
            <template v-slot:rightPart>企业详情</template>
          </global-ts-tabguide>
        </div>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="contentWrapper">
        <keep-alive>
          <component
            :currentDetailId.sync="currentDetailId"
            :isManager="isManager"
            ref="corpSearchTemp"
            :is="currentTemp"
            :key="currentTemp"
          >
          </component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import corpSearchList from './components/corp-search-list/index.vue';
import corpSearchDetail from './components/corp-search-detail/index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'CorpSearch',
  components: {
    corpSearchList,
    corpSearchDetail,
  },
  computed: {
    ...mapGetters({
      isManager: 'user/isManage',
    }),
  },
  data() {
    return {
      currentTemp: '', // corpSearchList corpSearchDetail
      currentDetailId: '', // 详情id
    };
  },
  created() {
    this.currentTemp = 'corpSearchList';
  },
  methods: {
    backManage() {
      this.currentTemp = 'corpSearchList';
    },
  },
};
</script>

<style lang="scss" scoped></style>

<!--
 * @Description  : 角色管理
 * @Author       : turbo
 * @Date         : 2021-03-30 15:49:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 17:34:39
-->

<template>
  <div class="roleManage">
    <global-ts-header v-if="currentTemp === 'roleManageList'">
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          角色管理
        </div>
      </template>
      <template v-slot:rightPart>
        <global-ts-button class="em_header_addEm" type="primary" size="small" icon="icon-icon-11" @click="addRole">
          添加角色
        </global-ts-button>
      </template>
    </global-ts-header>
    <component
      :currentRowData="currentRowData"
      @changeTemp="changeTemp"
      ref="roleManageTemp"
      :is="currentTemp"
      :key="currentTemp"
    >
    </component>
  </div>
</template>

<script>
import roleManageDetail from './components/role-manage-detail/index.vue';
import roleManageList from './components/role-manage-list/index.vue';
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { postLimitVer } from '@/utils';

export default {
  name: 'roleManage',
  components: {
    roleManageList,
    roleManageDetail,
  },
  props: {},
  data() {
    return {
      currentTemp: '', // roleManageList roleManageDetail
      currentDetailId: '', // 详情id
      currentRowData: {},
    };
  },
  computed: {
    ...mapGetters({
      isManager: 'user/isManage',
    }),
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    isHaveVersion() {
      if (this.isOem) {
        return versionDef.checkVersion(versionDef.NotDirectVersionDef.VersionList.MID);
      } else {
        return versionDef.checkVersion(versionDef.DirectVersionDef.VersionList.PROFESSIONNAL);
      }
    },
  },
  watch: {},
  created() {
    this.currentTemp = 'roleManageList';
  },
  mounted() {},
  methods: {
    /**
     * 添加角色
     * @author waldon
     * @date 2021/1/5
     */
    addRole() {
      if (!this.isHaveVersion) {
        postLimitVer('当前版本角色管理功能未开放', 0, 3);
        return;
      }
      this.changeTemp({}, 'add');
    },
    /**
     * 改变组件
     * @author waldon
     * @date 2021/1/5
     * @param {Object} rowData - 行数据
     * @param {String} type - 类型
     */
    changeTemp(rowData, type) {
      this.currentRowData = { ...rowData };
      if (type === 'list') {
        this.currentTemp = 'roleManageList';
      } else {
        this.currentTemp = 'roleManageDetail';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.roleManage {
  height: 100%;
}
</style>

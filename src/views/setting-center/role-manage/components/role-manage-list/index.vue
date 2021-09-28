<!--
 * @Author       : ADI
 * @Date         : 2021-07-07 16:30:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 10:47:06
-->
<template>
  <div class="roleManageList pro_listBox">
    <div class="showTabList">
      <el-table
        row-key="id"
        ref="sortTable"
        :data="staffRoleList"
        border
        header-row-class-name="employeeHeader"
        min-width="1010px"
        box-sizing="border-box"
        cell-class-name="cellStyle"
      >
        <el-table-column
          :label="item.name"
          :min-width="item.width + 'px'"
          v-for="item of initAllFiledList"
          :key="item.field"
        >
          <template slot-scope="scope">
            <div>{{ scope.row[item.field] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120px">
          <template slot-scope="scope">
            <span :class="['text_but1', { disabled: scope.row.isBaseRole }]" @click="addUpdateRole(scope.row, 'edit')">
              编辑
            </span>
            <span
              :class="['tanshu_deleteColor', 'text_but1', { disabled: scope.row.isBaseRole }]"
              @click="deleteRole(scope.row)"
            >
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-fai-pagination @changePage="changePage" :pageOption.sync="pages"> </global-ts-fai-pagination>
    </div>
  </div>
</template>

<script>
import commData from '../../mixins/comm-data/index.vue';
import { newFiledList } from '../../config';
import { mapState } from 'vuex';
import { confirm } from '@/utils';
import { getRoleList, delRole } from '@/api/modules/views/setting-center/role-manage';

export default {
  name: 'role-manage-list',
  mixins: [commData],
  components: {},
  props: {},
  data() {
    return {
      requestParam: {},
      staffRoleList: [],
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
        total: 20,
      },
      initAllFiledList: newFiledList(),
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl, // 升级链接
    }),
  },
  watch: {},
  created() {
    this.getStaffRoleList();
  },
  mounted() {},
  methods: {
    /**
     * 添加/更新角色
     * @author waldon
     * @date 2021/1/5
     * @param {Object} rowData - 行数据
     * @param {String} type - 类型
     */
    addUpdateRole(rowData, type) {
      if (rowData.isBaseRole) {
        // 基础角色不操作
        return;
      }
      this.$emit('changeTemp', rowData, type);
    },
    /**
     * 删除角色
     * @author waldon
     * @date 2021/1/5
     * @param {Object} rowData - 行数据
     */
    async deleteRole(rowData) {
      if (rowData.isBaseRole || rowData.editSys) {
        // 基础角色不操作
        return;
      }
      confirm('确认删除该角色吗，删除后该角色下的所有帐户的职务都变成”无“', '删除确认').then(async () => {
        const params = {
          id: rowData.id,
          del: true,
        };
        await this.deleteStaffRole(rowData.id);
        this.getStaffRoleList();
      });
    },
    /**
     * 改变分页回调
     * @author waldon
     * @date 2020/10/21
     * @param {String} type - 改变分页的类型
     */
    changePage(type) {
      this.getStaffRoleList();
    },
    /**
     * 查询pc的列表
     * @author waldon
     * @date 2020/10/23
     */
    async getStaffRoleList() {
      const params = { ...this.pages, ...this.requestParam };
      const [err, res] = await getRoleList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.staffRoleList = res.data;
      this.pages.total = res.total;
    },
    /**
     * 删除角色
     * @author lymn
     * @date 2021-03-09
     * @param {Number} id 角色id
     */
    async deleteStaffRole(id) {
      const [err, res] = await delRole({ id });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: '删除成功！',
      });
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.role-manage-list {
}
</style>

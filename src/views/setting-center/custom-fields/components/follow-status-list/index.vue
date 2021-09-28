<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:38:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:23:59
-->
<template>
  <div class="followStage">
    <el-table
      :class="'tshu-tableset'"
      :data="statusList"
      :fit="true"
      border
      header-row-class-name="employeeHeader"
      cell-class-name="cellStyle"
      min-width="1010px"
    >
      <el-table-column prop="name" label="跟进阶段"></el-table-column>
      <el-table-column prop="description" label="阶段描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operateBox" v-if="!version">
            <global-ts-version :hasButton="true">
              <div slot="button">
                <span class="tanshu_color operateBtn banBtn">
                  编辑
                </span>
                <span class="tanshu_color operateBtn banBtn" v-if="!scope.row.isBanDel">
                  删除
                </span>
              </div>
            </global-ts-version>
          </div>
          <div v-else>
            <span class="tanshu_color operateBtn" @click="editStatus(scope.row)">
              编辑
            </span>
            <span v-if="!scope.row.isBanDel">
              <global-ts-tool-tips
                offset="10"
                class="item"
                effect="dark"
                content="自定义跟进阶段至少保留一个，不允许删除"
                placement="top-start"
                v-if="statusList.length == 4"
              >
                <span class="tanshu_color operateBtn banBtn" v-if="!scope.row.isBanDel">
                  删除
                </span>
              </global-ts-tool-tips>
              <span class="tanshu_color operateBtn" @click="deleteStatus(scope.row)" v-else>
                删除
              </span>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <editDialog
      :editType="editType"
      :showDialog.sync="showEditDialog"
      :editData="editData"
      :fid="fid"
      @updateList="getStatusList"
    ></editDialog>
  </div>
</template>

<script>
import editDialog from '../edit-dialog/index.vue';
import versionDef from '@/config/version-def';
import { confirm } from '@/utils';
import { getTsUserFollowStatusList, delTsUserFollowStatus } from '@/api/modules/views/setting-center/custom-fields';

export default {
  name: 'follow-status-list',
  components: {
    editDialog,
  },
  props: {},
  data() {
    return {
      statusList: [], // 跟进阶段列表
      fid: null, // fid，用于操作字段
      editType: '',
      showEditDialog: false, // 是否显示编辑字段弹窗
      editData: {},
    };
  },
  computed: {
    version() {
      // 是否为试用版（包括七天试用版）
      return versionDef.getFunctionLimit('crmFollowStatus').condition;
    },
  },
  watch: {},
  created() {
    this.getStatusList();
  },
  mounted() {},
  methods: {
    /**
     * 获取字段列表
     * @author lymn
     * @date 2020-09-24
     */
    async getStatusList() {
      const [err, res] = await getTsUserFollowStatusList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.statusList = res.data.optionList;
      this.fid = res.data.fid;
      console.log(this.statusList, 'statusList==');
    },
    /**
     * 修改字段
     * @author lymn
     * @date 2020-09-27
     * @param {Boolean} param
     * @return {Boolean} return
     */
    editStatus(data) {
      this.editType = 'edit';
      this.showEditDialog = true;
      this.editData = data;
      console.log(data, '编辑项');
    },
    /**
     * 删除字段
     * @author lymn
     * @date 2020-09-27
     */
    deleteStatus(data) {
      console.log(data, '需要删除的');
      const params = {
        fid: data.fid,
        id: data.id,
      };
      confirm(
        '删除后处于该跟进阶段的客户阶段数据将丢失且无法找回（如业务变动，建议修改阶段名称）确认删除吗',
        '删除确认',
      ).then(async () => {
        const [err, res] = await delTsUserFollowStatus(params);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '删除成功',
        });
        this.getStatusList();
      });
    },
    /**
     * 添加字段
     * @author lymn
     * @date 2020-09-27
     */
    addNewStatus() {
      this.editType = 'add';
      this.showEditDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.followStage {
  .banBtn {
    color: $color-b2;
    cursor: no-drop;
  }
  .operateBox {
    display: inline-block;
  }
  .operateBtn {
    &:first-child {
      margin-right: 14px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

<style lang="scss">
.followStage,
.confirmDialog {
  .inputGroup {
    margin-bottom: 20px;
    .inputLabel {
      padding-bottom: 10px;
      font-size: 14px;
      color: $color-53;
    }
  }
}
.followStage .el-table .cell {
  word-wrap: break-word;
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:37:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:16:41
-->
<template>
  <div class="fieldsList">
    <el-table
      :class="'tshu-tableset'"
      :data="fieldsList"
      :fit="true"
      border
      header-row-class-name="employeeHeader"
      cell-class-name="cellStyle"
      min-width="1010px"
    >
      <el-table-column label="序号" type="index" width="50">
        <template slot-scope="scope">
          <span>{{ (nowPage - 1) * 10 + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="字段" min-width="244px"> </el-table-column>
      <el-table-column prop="fieldTypeName" label="类型" min-width="100px"> </el-table-column>
      <el-table-column prop="groupName" label="分类" min-width="100px"> </el-table-column>
      <el-table-column prop="isAble" label="是否启用" min-width="244px">
        <template #header>
          <span class="nextTimeBaby">是否启用</span>
          <global-ts-tool-tips
            offset="10"
            class="item"
            effect="dark"
            content="关闭后客户详情将隐藏该字段，但不会删除已有数据"
            placement="top-start"
          >
            <svg class="icon ts-tabel-header-icon" aria-hidden="true">
              <use xlink:href="#icon-wenhao1616"></use>
            </svg>
          </global-ts-tool-tips>
        </template>
        <template slot-scope="scope">
          <global-ts-version :hasButton="true" v-if="!version">
            <el-switch slot="button" v-model="scope.row.isAble" :disabled="true" :active-color="mainColor"> </el-switch>
          </global-ts-version>
          <el-switch
            v-else
            v-model="scope.row.isAble"
            :disabled="scope.row.isBanUnable"
            :active-color="mainColor"
            @change="openFields(scope.row.id, scope.row.unable)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160px">
        <template slot-scope="scope">
          <div class="bottomBar">
            <span
              class="text_but1"
              :class="scope.row.isSystemField ? 'gray' : ''"
              @click="editFields(scope.row.id, scope.row.isSystemField)"
              >编辑
            </span>
            <global-ts-button
              :class="scope.row.isSystemField ? 'gray' : ''"
              class="text_but1 em_delete"
              type="default"
              size="mini"
              @click="deleteFields(scope.row.id, scope.row.isSystemField)"
              :ref="'button' + scope.row.id"
              >删除
            </global-ts-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <global-ts-pagination
      :tableData="fieldsList"
      :requestParam="requestParam"
      :isReload.sync="isReload"
      @getData="changeTable"
      @sendPageInfo="sendPageInfo"
      :httpurl="ajaxUrl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { CRM_FIELD } from '../../config';
import { confirm } from '@/utils';
import { Switch } from 'element-ui';
import { setAbleForTsUserField, delTsUserField } from '@/api/modules/views/setting-center/custom-fields';

export default {
  name: 'fields-list',
  components: { [Switch.name]: Switch },
  props: {},
  data() {
    return {
      isReload: false,
      fieldsList: [],
      ajaxUrl: '/ajax/userField/tsUserField_h.jsp?cmd=getTsUserFieldList',
      nowPage: 1,
      limit: 10,
      requestParam: {
        type: CRM_FIELD,
      },
    };
  },
  computed: {
    mainColor() {
      // return tanShuApp.isOem ? '#00BB72' : '#247AF3'
      return '#247AF3';
    },
    version() {
      // 是否为试用版（包括七天试用版）
      return versionDef.getFunctionLimit('crmUserFields').condition;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    sendPageInfo(obj) {
      this.nowPage = obj.pageNow;
      this.limit = obj.limit;
    },
    addNewFields() {
      this.$parent.goFieldsSetting({
        isAddType: true,
        editId: -1,
      });
    },
    async openFields(id, unable) {
      const unableValue = unable == 0 ? 1 : 0;
      const [err, res] = await setAbleForTsUserField({
        id: id,
        unable: unableValue,
        type: CRM_FIELD,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isReload = true;
    },
    editFields(id, isSystemField) {
      if (isSystemField) {
        return;
      }
      this.$parent.goFieldsSetting({
        isAddType: false,
        editId: id,
      });
    },
    deleteFields(id, isSystemField) {
      if (isSystemField) {
        return;
      }
      confirm('删除后该字段下的所有数据将被同步删除且无法找回，确认删除吗？', '删除确认')
        .then(async action => {
          if (action == 'confirm') {
            const [err, res] = await delTsUserField({
              id: id,
              type: CRM_FIELD,
            });
            if (err) {
              this.$utils.postMessage({
                type: 'error',
                message: err.msg || '系统错误，请稍候重试',
              });
              return Promise.reject(err);
            }
            this.$utils.postMessage({
              type: 'success',
              message: '删除成功！',
            });
            this.reloadDataList();
          }
        })
        .catch(() => {});
    },
    reloadDataList() {
      this.isReload = true;
    },
    changeTable(res) {
      this.fieldsList = res;
    },
  },
};
</script>

<style lang="scss" scoped>
.fieldsList {
  .gray {
    color: $color-b2;
    cursor: auto;
    cursor: no-drop;
  }
  .nextTimeBaby {
    margin-right: 8px;
  }
}
</style>

<style lang="scss">
.em_delete {
  &.global-button.global-button-type-default {
    height: 16px;
    color: #2882ff;
    border: none;
    & > span {
      vertical-align: baseline;
    }
    &.gray {
      color: $color-b2;

      /* cursor: auto;
      cursor: no-drop; */
    }
  }
}
</style>

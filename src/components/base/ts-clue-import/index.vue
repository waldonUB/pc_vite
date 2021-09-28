<!--
 * @Author       : ADI
 * @Date         : 2021-07-15 10:16:41
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:24:03
-->
<template>
  <div class="ts_extends_clueImport clueImport">
    <div class="showTabList">
      <el-table
        ref="sortTable"
        :data="clueImportList"
        border
        header-row-class-name="employeeHeader"
        min-width="1010px"
        box-sizing="border-box"
        cell-class-name="cellStyle"
      >
        <el-table-column prop="staffName" label="导入人" min-width="200px" class-name="contacts"> </el-table-column>
        <el-table-column prop="timeName" label="导入时间" min-width="200px" class-name="contacts"> </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="300px" class-name="contacts"> </el-table-column>
        <el-table-column prop="designatedMember" label="分配到" min-width="300px" class-name="contacts">
          <template slot-scope="scope">
            <global-ts-tool-tips
              popper-class="popper-ellipsis2-clueImport"
              :disabled="scope.row.designatedType !== 1"
              class="item"
              effect="dark"
              placement="top"
              :content="scope.row.designatedMember"
            >
              <p class="ellipsis2">{{ scope.row.designatedMember }}</p>
            </global-ts-tool-tips>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态" min-width="300px" class-name="contacts"> </el-table-column>
        <el-table-column prop="resultStatus" label="结果" min-width="300px" class-name="contacts"> </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="150px">
          <template slot-scope="scope">
            <span
              class="tanshu_linkColor editCustom"
              v-if="scope.row.status !== 2 && scope.row.status !== 0"
              @click="downloadDetail(scope.row.id)"
              >下载详情
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        v-model="clueImportList"
        :httpurl="ajaxUrl"
        :isReload.sync="isReload"
        :requestParam="requestParam"
        @getData="changeTable"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { post, exportExcel } from '@/utils';
import { exportInvalidList } from '@/api/modules/utils/task';

export default {
  name: 'clue-import',
  components: {},
  props: {
    isManager: {
      type: Boolean,
      default: false,
    },
    workList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      requestParam: {
        isSearchClue: true, // 默认0 1是查询线索
      },
      sourceList: [],
      clueImportList: [],
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      initSelectedList: [],
      ajaxUrl: '/rest/manage/uploadTask/getTaskList',
      isReload: false,
      multipartImportDialogVisible: false, // 批量导入弹窗
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 上传成功的回调
     * @author waldon
     * @date 2020-06-23
     * @param {*} res
     */
    batchImportSuccess(res) {
      this.reloadTable();
    },
    reloadTable() {
      this.isReload = true;
    },
    changeTable(data) {
      this.clueImportList = data;
    },
    /**
     * 下载详情
     * @author waldon
     * @date 2020-07-03
     * @param {*} id - id
     */
    async downloadDetail(id) {
      const [err, response] = await exportInvalidList({
        id,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = response.data.invalidList || [];
      const keyJson = response.data.keyJson || {};
      exportExcel(excelList, '同步任务失败记录', keyJson);
    },
  },
};
</script>

<style lang="scss">
/* ts_extends_clueImport start */
.ts_extends_clueImport {
  .showTabList {
    .ellipsis2 {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
}

/* ts_extends_clueImport end */

/* popper-ellipsis2-clueImport start */
.popper-ellipsis2-clueImport {
  &.el-tooltip__popper {
    &.is-dark {
      div {
        &:first-child {
          max-width: 350px;
          max-height: 144px;
          overflow-y: scroll;
          line-height: 22px;
        }
      }
    }
  }
}

/* popper-ellipsis2-clueImport end */
</style>

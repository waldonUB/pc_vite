<!--
 * @Description  : 批量导入线索
 * @Author       : turbo
 * @Date         : 2021-06-17 16:39:51
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-18 10:00:52
-->

<template>
  <div class="import-clue">
    <global-ts-header>
      <template #leftPart>
        <global-ts-tabguide no-margin @backToPrePage="$emit('backToPrePage')">
          <template #leftPart>全部线索</template>
          <template #rightPart>批量导入</template>
        </global-ts-tabguide>
      </template>
      <template #rightPart>
        <global-ts-button type="outLine" size="small" @click="multipartImport">
          批量导入
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <el-table border min-width="1010px" cell-class-name="cellStyle" :data="clueImportList">
        <el-table-column prop="staffName" label="上传人" min-width="200px"></el-table-column>
        <el-table-column prop="timeName" label="上传时间" min-width="200px"></el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="300px"></el-table-column>
        <el-table-column prop="statusName" label="状态" min-width="300px"></el-table-column>
        <el-table-column prop="resultStatus" label="结果" min-width="300px"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="150px">
          <template slot-scope="scope">
            <span
              class="tanshu_linkColor"
              v-if="scope.row.status !== 2 && scope.row.status !== 0"
              @click="downloadDetail(scope.row.id)"
              >下载详情
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :table-data="clueImportList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParam"
        @getData="changeTable"
      >
      </global-ts-pagination>
      <ts-batch-import-dialog
        upload-url="/ajax/upload_h.jsp?cmd=uploadExcelTmpFile&isClue=true"
        :upload-data="uploadData"
        :download-temp-url="downloadTempUrl"
        :dialog-visible.sync="multipartImportDialogVisible"
        @batchImportSuccess="batchImportSuccess"
      ></ts-batch-import-dialog>
    </div>
  </div>
</template>

<script>
// components
import TsBatchImportDialog from '@/components/base/ts-batch-import-dialog/index.vue';

// utils
import { downloadTempUrl, exportExcel, ActLog } from '@/utils';

// config
import ManagerDef from '@/config/manager-def';

// api
import { task } from '@/api';

export default {
  name: 'ImportClue',
  components: { TsBatchImportDialog },
  data() {
    return {
      requestParam: {
        isSearchClue: 1, // 默认为0，1是查询线索
      },
      isReload: false,
      ajaxUrl: '/ajax/uploadTask/tsUploadTask_h.jsp?cmd=getTaskList',
      clueImportList: [],
      multipartImportDialogVisible: false, // 批量导入弹窗
      downloadTempUrl: '',
      uploadData: {
        isClue: true, // 标记是线索池导入
      },
    };
  },
  async created() {
    this.downloadTempUrl = await downloadTempUrl(ManagerDef.DOWNLOAD_TEMP_TYPE.CLUE_POOL);
  },
  methods: {
    changeTable(data) {
      this.clueImportList = data;
    },
    /**
     * 批量导入
     * @author waldon
     * @date 2020-06-16
     */
    multipartImport() {
      this.$utils.logDog('multipartImport_click');
      this.multipartImportDialogVisible = true;
    },
    /**
     * 上传成功的回调
     * @author waldon
     * @date 2020-06-23
     * @param {*} res
     */
    async batchImportSuccess(res) {
      const { addUploadTask } = task;
      const [err] = await addUploadTask({
        type: 4, // 4为线索池导入
        fileId: res.data.id,
        fileName: res.data.name,
      });
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '录入成功',
      });
      if (!err) {
        ActLog('ADD_VIEWER');
        this.reloadTable();
      }
    },
    reloadTable() {
      this.isReload = true;
    },
    /**
     * 下载详情
     * @author waldon
     * @date 2020-07-03
     * @param {*} id - id
     */
    async downloadDetail(id) {
      const { exportInvalidList } = task;
      const [err, res] = await exportInvalidList({ id });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { invalidList = [], keyJson = {} } = res.data;
      exportExcel(invalidList, '同步任务失败记录', keyJson);
    },
  },
};
</script>

<style lang="scss" scoped></style>

<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:47:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 11:17:57
-->
<template>
  <global-ts-dialog
    class="batchImportDialog"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="batchImportContent">
      <p class="inputTip">
        <span>{{ modelTip }}</span>
        <global-ts-button type="textGreen" size="small" @click="downloadTemp">
          {{ modelFileName }}
        </global-ts-button>
      </p>
      <el-upload
        :data="uploadData"
        ref="batchImport"
        :on-change="handleChange"
        :file-list="fileList"
        :action="uploadUrlCal"
        :accept="fileAccept"
        :multiple="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :limit="limitNum"
        :auto-upload="false"
        @submit="sure"
        :on-remove="removeMaterial"
        :before-upload="beforeUpload"
      >
        <global-ts-button icon="icon-icon-11" class="uploadDocBtn" type="primary" size="small">
          选择文件
        </global-ts-button>
      </el-upload>
    </div>
  </global-ts-dialog>
</template>

<script>
import { getUrL, postMessage, postLimitVer } from '@/utils';
import { Upload } from 'element-ui';

export default {
  name: 'ts-batch-import-dialog',
  components: {
    [Upload.name]: Upload,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 目前的上传逻辑是，先上传临时文件拿到fileId和name
    uploadUrl: {
      type: String,
      default: '/ajax/upload_h.jsp?cmd=uploadExcelTmpFile',
    },
    downloadTempUrl: {
      type: String,
      default: '',
    },
    dialogTitle: {
      type: String,
      default: '导入弹窗',
    },
    // 上传时附带的额外参数
    uploadData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modelTip: {
      type: String,
      default: '按模板格式填写后上传',
    },
    modelFileName: {
      type: String,
      default: '下载模板',
    },
    limitSize: {
      // 默认10M的上传限制
      type: [Number, String],
      default: 10,
    },
  },
  data() {
    return {
      limitNum: 1,
      fileAccept: '.xls,.xlsx',
      fileList: [], // excel列表
      isUploading: false, // 是否有文件上传，用于提示判断
    };
  },
  watch: {
    /**
     * 对话框显示
     * @author waldon
     * @date 2020/4/10
     * @param {*} newVal -
     */
    dialogVisible(newVal) {
      // if (newVal) {
      // } else {
      // }
    },
  },
  computed: {
    uploadUrlCal() {
      return getUrL(this.uploadUrl);
    },
  },
  methods: {
    /**
     * 下载导入模板
     * @author waldon
     * @date 2020/06/16
     */
    downloadTemp() {
      window.open(this.downloadTempUrl);
    },
    /**
     * 移除文件
     * @author waldon
     * @date 2020/4/10
     * @param {*} file - 当前文件数据
     */
    removeMaterial(file, fileList) {
      this.isUploading = !!fileList.length;
      this.isShowUploadBtn('show');
    },
    /**
     * 文件列表改变
     * @author waldon
     * @date 2020/4/10
     * @param {*} file - 当前文件数据
     * @param {*} fileList - 当前文件上传的文件列表
     */
    handleChange(file, fileList) {
      if (fileList && fileList.length) {
        this.isShowUploadBtn('hidden');
      } else {
        this.isShowUploadBtn('show');
      }
      this.isUploading = !!fileList.length;
    },
    /**
     * 是否显示上传按钮
     * @author waldon
     * @date 2020/4/10
     * @param {*} type - 显示/隐藏
     */
    isShowUploadBtn(type) {
      this.$nextTick(() => {
        const batchImport = this.$refs.batchImport.$el;
        if (type === 'hidden') {
          batchImport.classList.add('uploadBtn_hidden');
        } else {
          batchImport.classList.remove('uploadBtn_hidden');
        }
      });
    },
    /**
     * 触发上传
     * @author waldon
     * @date 2020/4/10
     */
    sure() {
      if (!this.isUploading) {
        postMessage({
          type: 'error',
          message: '请先选择文件',
        });
        return;
      }
      this.$refs.batchImport.submit();
    },
    /**
     * 上传前操作
     * 限制上传文件的格式
     * @author waldon
     * @date 2020/4/10
     * @param {*} file - 文件数据
     */
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAccept.includes(suffixName)) {
          postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传xls/xlsx格式的文件',
          });
          return false;
        }
        if (fileSize > this.limitSize) {
          postMessage({
            type: 'error',
            message: `不能上传超过${this.limitSize}M的文件`,
          });
          return false;
        }
      } else {
        postMessage({
          type: 'error',
          message: '文件类型不符合规范，请上传xls/xlsx格式的文件',
        });
      }
    },
    /**
     * 上传失败的回调
     * @author waldon
     * @date 2020/4/10
     * @param {Object} res - 后端返回数据
     * @param {Object} file - 文件数据
     * */
    uploadError(res, file) {
      if (res && res.msg) {
        postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      } else {
        postMessage({
          type: 'error',
          message: '上传失败',
        });
      }
    },
    /**
     * 完成上传的回调
     * @author waldon
     * @date 2020/4/10
     * @param {Object} res - 后端返回数据
     * @param {Object} file - 文件数据
     * */
    uploadSuccess(res, file) {
      if (res && res.success) {
        this.cancel();
        this.$emit('batchImportSuccess', res);
      } else if (res && res.rt === 6038) {
        postLimitVer(res.msg);
      } else if (res && !res.success) {
        postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      } else {
        postMessage({
          type: 'error',
          message: '网络错误，请稍候重试',
        });
      }
      this.$refs.batchImport.clearFiles();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.fileList = [];
      this.isShowUploadBtn('show');
      this.$emit('update:dialogVisible', false);
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
/* 批量导入弹窗 */
.batchImportDialog {
  .batchImportContent {
    .inputTip {
      display: flex;
      margin-bottom: 20px;

      .global-button {
        height: 19px;
        margin-left: 5px;
        border: 0 none;
      }
    }
    .tanshu-button {
      &.tanshu-button-type-textGreen {
        height: auto;
        line-height: initial;
      }
    }
    .uploadBtn_hidden {
      .uploadDocBtn {
        display: none;
      }
    }
  }
}
</style>

<style lang="scss">
.batchImportDialog {
  .batchImportContent {
    .uploadBtn_hidden {
      .el-upload {
        display: block;
      }
    }
  }
}
</style>

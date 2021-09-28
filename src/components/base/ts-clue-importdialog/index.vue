<!--
 * @Author       : ADI
 * @Date         : 2021-07-15 14:21:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 15:21:43
-->
<template>
  <global-ts-dialog
    class="tanshu-clueImportDialog"
    dialog-title="批量导入线索"
    :dialog-visible="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="clueImportDialog-content">
      <div class="clueImportDialog-content-item">
        <div class="number-sort">1</div>
        <div class="content-item downLoad">
          <fa-tooltip
            overlayClassName="downLoad_tip"
            placement="topLeft"
            title="线索模板已更新，请下载新模板填写"
            :visible="showTip"
            trigger="hover"
            :defaultVisible="showTip"
            :destroyTooltipOnHide="true"
            arrowPointAtCenter
            :getPopupContainer="trigger => trigger.parentNode"
          >
            <p class="mainColor downBtn" @click="downloadTemp">
              下载线索模板
            </p>
          </fa-tooltip>
          <p>，按照模板格式填写；</p>
        </div>
      </div>
      <div class="gap"></div>
      <div class="clueImportDialog-content-item">
        <div class="number-sort">2</div>
        <div class="content-item upload">
          <p class="title">上传文件：</p>
          <el-upload
            name="filedata"
            :data="uploadData"
            ref="batchImport"
            :on-change="handleChange"
            :file-list="fileList"
            :action="uploadUrlCal"
            :accept="fileAccept"
            :multiple="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :limit="1"
            :auto-upload="false"
            @submit="sure"
            :on-remove="removeMaterial"
            :before-upload="beforeUpload"
          >
            <global-ts-button icon="icon-tianjia1616" class="uploadDocBtn" type="primary" size="small">
              选择文件
            </global-ts-button>
            <div slot="file" slot-scope="{ file }">
              <span class="el-upload-list__item-actions">
                <svg class="icon icon_16 fileIcon" aria-hidden="true">
                  <use xlink:href="#icon-wendang1616"></use>
                </svg>
                <span class="file_name">
                  {{ file.name }}
                </span>
                <svg class="icon icon_16 deleteIcon" aria-hidden="true" @click="removeMaterial">
                  <use xlink:href="#icon-shanchu1616"></use>
                </svg>
              </span>
            </div>
          </el-upload>
        </div>
      </div>
      <div class="gap"></div>
      <div class="clueImportDialog-content-item">
        <div class="number-sort">3</div>
        <div class="content-item">
          <p class="title">分配到：</p>
          <div class="selectRadio">
            <div class="select-list">
              <span class="typeRadio" v-for="(item, index) in selectTypeList" :key="index">
                <input
                  v-model="selectType"
                  type="radio"
                  :id="'rule' + index"
                  :value="item.key"
                  @change="changeType(item.key)"
                />
                <label :for="'rule' + index">{{ item.value }}</label>
              </span>
            </div>
            <transition name="el-fade-in-linear">
              <div class="select-wrap" v-show="selectType === 1">
                <ts-select-list
                  class="headSelect"
                  :width="436"
                  :isStrParam="true"
                  :depIdList.sync="depIdList"
                  :sids.sync="sids"
                  :needUpdate.sync="needUpdate"
                >
                </ts-select-list>
                <p class="desc">如果选择多个成员，系统将线索平均分配给每个成员</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="goToRecord" @click="goToRecord">
        <svg class="icon icon_16" aria-hidden="true">
          <use xlink:href="#icon-a-daorujilu16"></use>
        </svg>
        查看导入记录
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { Tooltip } from '@fk/faicomponent';
import { Upload } from 'element-ui';
import ManagerDef from '@/config/manager-def';
import { getUrL, getGuideList, saveGuide, downloadTempUrl, postLimitVer } from '@/utils';
import { addUploadTask } from '@/api/modules/component/clue-importdialog';

export default {
  name: 'clue-importdialog',
  components: { TsSelectList, [Tooltip.name]: Tooltip, [Upload.name]: Upload },
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
    uploadData: {
      // 上传时附带的额外参数
      type: Object,
      default: () => {
        return {
          isClue: true, // 标记是线索池导入
        };
      },
    },
    limitSize: {
      // 默认10M的上传限制
      type: [Number, String],
      default: 10,
    },
  },
  data() {
    return {
      fileAccept: '.xls,.xlsx',
      fileList: [], // excel列表
      isUploading: false, // 是否有文件上传，用于提示判断
      selectTypeList: [
        {
          key: 1,
          value: '指定成员',
        },
        {
          key: 2,
          value: '线索公海',
        },
      ],
      selectType: 1,
      depIdList: '',
      sids: '',
      downloadTempUrl: '',
      needUpdate: false, // 是否重置员工组件
      showTip: false,
    };
  },
  computed: {
    uploadUrlCal() {
      return getUrL(this.uploadUrl);
    },
  },
  watch: {
    /**
     * 对话框显示
     * @author waldon
     * @date 2020/4/10
     * @param {*} newVal -
     */
    dialogVisible(newVal) {
      if (newVal) {
        console.log('显示弹窗');
        downloadTempUrl(ManagerDef.DOWNLOAD_TEMP_TYPE.CLUE_POOL).then(url => {
          this.downloadTempUrl = url;
        });
        getGuideList().then(guideList => {
          this.showTip = !guideList[19];
          if (this.showTip) {
            const timer = setTimeout(() => {
              this.showTip = false;
              clearTimeout(timer);
            }, 5000);
          }
        });
      }
    },
  },
  created() {
    this.downloadTempUrl = this.$store.state.globalData.resRoot + '/doc/线索批量导入模板.xlsx?v=202106301715';
  },
  mounted() {},
  methods: {
    changeType(key) {
      this.selectType = key;
    },
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
      this.fileList = [];
      this.isUploading = false;
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
      console.log('fileList----->', fileList);
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
      this.$emit('update:dialogVisible', false);
      if (!this.isUploading) {
        this.$utils.postMessage({
          type: 'error',
          message: '请先选择文件',
        });
        return;
      }
      if (this.selectType === 1) {
        if (!this.sids && !this.depIdList) {
          this.$utils.postMessage({
            type: 'error',
            message: '请选择成员',
          });
          return;
        }
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
          this.$utils.postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传xls/xlsx格式的文件',
          });
          return false;
        }
        if (fileSize > this.limitSize) {
          this.$utils.postMessage({
            type: 'error',
            message: `不能上传超过${this.limitSize}M的文件`,
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
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
        this.$utils.postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      } else {
        this.$utils.postMessage({
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
        this.batchImportSuccess(res);
      } else if (res && res.rt === 6038) {
        postLimitVer(res.msg);
      } else if (res && !res.success) {
        this.$utils.postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '网络错误，请稍候重试',
        });
      }
      console.log('clearFilesclearFilesclearFiles---');
      this.$refs.batchImport.clearFiles();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
      this.fileList = [];
      this.needUpdate = true; // 重置员工组件
      saveGuide(19);
      this.isShowUploadBtn('show');
      this.$emit('update:dialogVisible', false);
    },
    goToRecord() {
      this.$emit('handle-record');
      this.cancel();
    },
    async batchImportSuccess(res) {
      const params = {
        type: 4, // 4为线索池导入
        fileId: res.data.id,
        fileName: res.data.name,
        distributeWay: this.selectType,
      };
      if (this.selectType === 1) {
        Object.assign(params, {
          depIdList: this.depIdList,
          sidList: this.sids,
        });
      }
      const [err, response] = await addUploadTask(params);
      this.cancel();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '录入成功',
      });
      this.$utils.ActLog('ADD_VIEWER');
      this.$emit('upload-success', res);
    },
  },
};
</script>

<style lang="scss">
.tanshu-clueImportDialog {
  .uploadBtn_hidden {
    display: flex;
    height: 34px;
    align-items: center;
    .uploadDocBtn {
      display: none;
    }
    .el-upload-list__item {
      &:first-child {
        margin-top: 0;
      }
      &:hover {
        background-color: transparent;
      }
    }
  }
  .clueImportDialog-content {
    .clueImportDialog-content-item {
      display: flex;
      .number-sort {
        display: flex;
        width: 32px;
        height: 32px;
        margin-right: 12px;
        font-size: 14px;
        color: #707070;
        background: $color-ff;
        border: 1px solid $color-b2;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
      }
      .content-item {
        display: flex;
        font-size: 14px;
        color: $color-53;
        flex: 1;
        &.upload {
          height: 34px;
          line-height: 34px;
        }
        &.downLoad {
          display: flex;
          align-items: center;
          .downBtn {
            color: #247af3;
            cursor: pointer;
            &:hover {
              color: #206dda;
            }
          }
        }
        .title {
          height: 34px;
          margin-right: 20px;
          font-size: 14px;
          line-height: 34px;
          color: $color-53;
        }
        .selectRadio {
          min-height: 96px;
          margin-left: 14px;
          flex: 1;
          .select-list {
            display: flex;
            height: 34px;
            align-items: center;
          }
        }
        .select-wrap {
          display: flex;
          margin-top: 6px;
          flex-direction: column;
          .headSelect {
            &.tanshu-selectList {
              .tagBox {
                width: 436px;
                margin-right: 0;
              }
            }
          }
          .desc {
            margin-top: 6px;
            font-size: 12px;
            color: $color-b2;
          }
        }
      }
    }
    .goToRecord {
      display: inline-flex;
      align-items: center;
      margin-top: 32px;
      font-size: 14px;
      color: $color-89;
      cursor: pointer;
      .icon {
        margin-right: 8px;
        font-size: 16px;
      }
      &:hover {
        color: #535353;
      }
    }
    .gap {
      width: 1px;
      height: 24px;
      margin: 4px 16px;
      background: $border-disabled-color;
    }
    .el-upload-list__item-actions {
      display: flex;
      height: 34px;
      font-size: 14px;
      color: $color-53;
      align-items: center;
      .fileIcon {
        margin-right: 8px;
        font-size: 16px;
        color: $color-89;
      }
      .deleteIcon {
        margin-left: 12px;
        font-size: 16px;
        color: $color-b2;
        cursor: pointer;
        &:hover {
          color: $color-53;
        }
      }
    }
  }
}
</style>

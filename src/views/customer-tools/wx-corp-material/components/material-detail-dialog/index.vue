<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 14:58:50
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-02 14:39:29
-->
<template>
  <global-ts-dialog
    :class="['materialDetailDialog', { docDetailDialog: materialType == 'doc' }]"
    wrap-class-name="fileResourceWrap"
    :dialog-title="funcTypeCal + typeNameCal"
    :dialog-visible.sync="dialogVisible"
    :lock-dialog-body-height="false"
    dialog-size="medium"
    @cancel="cancelImgDetail"
    @sure="saveImgDetail"
  >
    <div class="imgDetailContent">
      <fa-form-model ref="imgDetailContentRuleForm" layout="vertical" :model="requestParam" :rules="rules">
        <fa-form-model-item :label="typeNameCal + '位置'" prop="groupId">
          <selectFolderList
            :showInputFolderIcon="true"
            v-if="dialogVisible"
            @select="selectFolder"
            :defaultSelectId="requestParam.groupId"
          >
          </selectFolderList>
        </fa-form-model-item>
        <fa-form-model-item :label="typeNameCal + '名称'" prop="commName">
          <fa-input
            size="large"
            :disabled="materialType === 'doc'"
            :maxLength="maxLength"
            v-model="requestParam.commName"
            :showCount="true"
            class="display-block"
            placeholder="请输入名称"
          >
          </fa-input>
        </fa-form-model-item>
      </fa-form-model>
      <div v-if="materialType == 'doc'">
        <global-ts-point-upload
          :class="['materialTextUploadBox', { materialReplaceBox: materialFuncType === 'edit' }]"
          :multiple="false"
          :limitSize="200"
          :sizeCheckTip="fileSizeCheckTip"
          :typeCheckTip="fileTypeCheckTip"
          :accept="fileAcceptCal"
          :isShowFileList="true"
          :fileList="uploadFileList"
          :removeDisabled="true"
          :fix-icon="true"
          @breakUpload="breakUploadFile"
        >
          <div class="replaceIcon" v-if="materialFuncType === 'edit'">
            <global-ts-svg-icon class="icon" name="icon-tihuan-copy"></global-ts-svg-icon>
          </div>
        </global-ts-point-upload>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import selectFolderList from '../select-folder-list/index.vue';
import { GROUPTYPE } from '../../config';
import { confirm, loading, getFileName } from '@/utils';
import { cloneMaterial } from '@/api/modules/views/customer-tools/file-resource';
import { setTsWxWorkMaterial } from '@/api/modules/views/customer-tools/pyq-material';
import TsCommDef from '@/config/ts-comm-def';

export default {
  name: 'material-detail-dialog',
  components: { selectFolderList },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentMaterialData: {
      // 文档/图片对象
      type: Object,
      required: true,
      default: () => {},
    },
    materialType: {
      // 编辑的文件类型 doc：文档 img：图片
      type: String,
      default: 'img',
    },
    materialFile: {
      // 文档的上传内容
      type: Array,
      default: () => [],
    },
    materialFuncType: {
      // 功能类型 edit：编辑 copy：复制
      type: String,
      default: 'edit',
    },
  },
  data() {
    return {
      requestParam: {
        id: '', // 文件id
        groupId: 0, // 文件夹id 默认为企业文件
        commName: '', //文件名(去掉扩展名后缀)
        typeGroup: GROUPTYPE, // 12：企业文件夹
        content: '', // 文档可以替换内容
        isCorp: true, // 是否为企业文件
      },
      uploadFileList: [],
      fileSuffixName: '', // 文件的扩展后缀名
      hasReplaceDoc: false, // 是否替换了文档
      maxLength: 45, // 名称字数限制
    };
  },
  computed: {
    rules() {
      return {
        commName: [
          { required: true, message: `请输入${this.materialType == 'doc' ? '文档' : '图片'}名称`, trigger: 'blur' },
          {
            min: 0,
            max: this.maxLength,
            message: `名称不能超过${this.maxLength}个字符`,
            trigger: 'blur',
          },
        ],
      };
    },
    /**
     * 区分文案
     * @author lymn
     * @date 2021-01-05
     */
    typeNameCal() {
      return this.materialType === 'doc' ? '文档' : '图片';
    },
    /**
     * 功能类型
     * @author lymn
     * @date 2021-02-05
     */
    funcTypeCal() {
      return this.materialFuncType === 'edit' ? '编辑' : '复制';
    },
    /**
     * 对话框标题
     * @author waldon
     * @date 2020/4/10
     * @returns {*} 对话框标题
     */
    dialogTitleCal() {
      return this.materialType === 'doc' ? '编辑文档' : '编辑图片';
    },
    /**
     * 文件上传标题
     * @author waldon
     * @date 2020/4/10
     * @returns {*} 文件上传标题
     */
    materialNameCal() {
      return this.materialType === 'doc' ? '文档名称' : '图片名称';
    },
    fileSizeCheckTip() {
      return '上传失败，请上传200m以内的文件';
    },
    fileTypeCheckTip() {
      return '文件类型不符合规范，请上传excel/ppt/word/pdf文件';
    },
    fileAcceptCal() {
      return '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx';
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
        console.log(this.currentMaterialData, '复制的文件');
        this.requestParam = {
          id: this.currentMaterialData.id || '',
          groupId: this.currentMaterialData.groupId || 0,
          commName: this.currentMaterialData.commName || '',
          typeGroup: GROUPTYPE, // 12：企业文件夹
          isCorp: true,
        };
        // let fileName = Ts_util.getFileName(this.currentMaterialData.name)
        // this.fileSuffixName = fileName[1]
        // this.maxLength = 50 - this.fileSuffixName.length
        this.hasReplaceDoc = false;
      } else {
        this.requestParam = {
          id: '',
          groupId: 0,
          commName: '名称',
          typeGroup: GROUPTYPE, // 12：企业文件夹
          isCorp: true,
        };
        this.uploadFileList = [];
        this.$refs.imgDetailContentRuleForm?.resetFields();
      }
    },
    materialFile(newVal) {
      if (newVal && newVal.length > 0) {
        this.uploadFileList = newVal;
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 保存文件详情
     * @author waldon
     * @date 2020/4/10
     */
    saveImgDetail() {
      this.$refs.imgDetailContentRuleForm.validate(async valid => {
        console.log('valid', valid);
        if (!valid) {
          // 检查是否有错误
          return;
        }
        // this.requestParam.name = this.requestParam.commName + this.fileSuffixName
        if (this.materialFuncType == 'edit') {
          delete this.requestParam.isCorp;
        } else {
          delete this.requestParam.typeGroup;
        }
        const ajaxFun = this.materialFuncType == 'edit' ? setTsWxWorkMaterial : cloneMaterial;

        const [err, res] = await ajaxFun(this.requestParam);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: this.materialFuncType == 'edit' ? '修改成功！' : '复制成功！',
        });
        this.$emit('editSuccess');
        this.$emit('update:dialogVisible', false);
      });
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/4/10
     */
    cancelImgDetail() {
      if (this.hasReplaceDoc) {
        confirm('新文件未保存，确定取消替换吗').then(() => {
          this.$emit('update:dialogVisible', false);
        });
      } else {
        this.$emit('update:dialogVisible', false);
      }
    },
    /**
     * 替换文档成功
     * @author lymn
     * @date 2020-10-14
     * @param {Boolean} param
     * @return {Boolean} return
     */
    breakUploadFile(res) {
      const fileName = getFileName(res.name);
      this.requestParam.commName = fileName[0];
      this.fileSuffixName = fileName[1];
      this.uploadFileList = [res];
      this.requestParam.content = res.id;
      this.hasReplaceDoc = true;
      loading.poupQuene('breakUploadLoading');
      this.$emit('replaceDocumentSuccess');
    },
    /**
     * 禁止删除
     * @author lymn
     * @date 2020-10-14
     * @param {Boolean} param
     * @return {Boolean} return
     */
    beforeRemove() {
      return false;
    },
    /**
     * 选择文件夹
     * @author lymn
     * @date 2020-11-10
     * @param {Number} selectId 文件夹idm
     */
    selectFolder(selectId, selectItem) {
      this.requestParam.groupId = selectId;
      this.requestParam.isCorp = selectItem.isCorp;
      console.log(selectItem, '是否为企业文件');
      this.requestParam.typeGroup = selectItem.isCorp
        ? TsCommDef.TypeGroupDef.CORP_FOLDER
        : TsCommDef.TypeGroupDef.PERSON_FOLDER;
    },
  },
};
</script>

<style lang="scss" scoped>
.materialDetailDialog {
  .replaceIcon {
    width: 20px;
    height: 20px;
    padding: 3px;
    box-sizing: border-box;
    &:hover {
      background: #f5f7fa;
      border-radius: 2px;
      .icon {
        color: #247af3;
      }
    }
    .icon {
      width: 14px;
      height: 14px;
      color: $color-89;
      vertical-align: top;
    }
  }
  .materialTextUploadBox {
    .image-upload-pic {
      position: relative;
    }
  }
}
</style>

<style lang="scss">
.materialDetailDialog .materialTextUploadBox .image-upload-pic .el-upload {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  margin: auto 0;
}

.materialDetailDialog .el-input__inner,
.videoEditDialog .el-input__inner {
  padding: 0 55px 0 10px;
}

.materialDetailDialog .el-dialog__body .imgDetailContent .inputGroupBox .selectBox .tshu_select_input input {
  height: 34px;
  line-height: 34px;
}

.materialDetailDialog .el-dialog__body .imgDetailContent .inputGroupBox .selectBox .tshu_select_input .motivate {
  height: 34px;
  line-height: 34px;
}

.materialDetailDialog .materialTextUploadBox .image-upload-pic {
  position: relative;
}
.materialDetailDialog .materialReplaceBox .el-upload-list {
  width: 500px;
}
</style>

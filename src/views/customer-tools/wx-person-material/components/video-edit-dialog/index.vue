<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:03:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 09:56:25
-->
<template>
  <global-ts-dialog
    class="videoEditDialog"
    wrap-class-name="fileResourceWrap"
    :dialog-title="funcTypeCal + '视频'"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    :lock-dialog-body-height="false"
    @cancel="cancelVideoDetail"
    @sure="saveVideoDetail"
  >
    <div class="videoContent">
      <fa-form-model ref="videoContentRuleForm" layout="vertical" :model="requestParam" :rules="rules">
        <fa-form-model-item label="视频位置" prop="groupId">
          <selectFolderList
            :showInputFolderIcon="true"
            v-if="dialogVisible"
            @select="selectFolder"
            :defaultSelectId="requestParam.groupId"
          ></selectFolderList>
        </fa-form-model-item>
        <fa-form-model-item label="视频名称" prop="commName">
          <fa-input
            size="large"
            :maxLength="maxLength"
            minlength="1"
            style="width: 100%;"
            :showCount="true"
            class="display-block"
            v-model="requestParam.commName"
            placeholder="请输入名称"
          >
          </fa-input>
        </fa-form-model-item>
        <fa-form-model-item label="视频简介" prop="description">
          <fa-input
            v-if="dialogVisible"
            type="textarea"
            :maxLength="500"
            :showCount="true"
            class="intro display-block"
            v-model="requestParam.description"
            placeholder="介绍一下这个视频吧"
          >
          </fa-input>
        </fa-form-model-item>
        <fa-form-model-item label="视频封面" prop="fileList">
          <global-ts-fai-img-upload-style-box
            name="filedata"
            class="materialUploadBox"
            :fileList="fileList"
            size="large"
            @upload-click="
              () => {
                tanshuFileSelectUploadVisible = true;
              }
            "
            @remove="removeMaterial"
          >
          </global-ts-fai-img-upload-style-box>
          <global-ts-file-select-upload-dialog
            :dialog-visible.sync="tanshuFileSelectUploadVisible"
            :limit-num="1"
            accept-type="img"
            @success="uploadSuccess"
          >
          </global-ts-file-select-upload-dialog>
          <p class="uploadTip">建议从视频中截取相同尺寸的图片，支持jpg/jpeg/png格式，不超过10M</p>
        </fa-form-model-item>
      </fa-form-model>
    </div>
  </global-ts-dialog>
</template>

<script>
import { getUrL, getFileName } from '@/utils';
import selectFolderList from '../select-folder-list/index.vue';
import TsCommDef from '@/config/ts-comm-def';
import { GROUPTYPE } from '../../config';
import { cloneMaterial } from '@/api/modules/views/customer-tools/file-resource';
import { setTsWxWorkMaterial } from '@/api/modules/views/customer-tools/pyq-material';

export default {
  name: 'video-edit-dialog',
  components: {
    selectFolderList,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    groupTagList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentVideoData: {
      type: Object,
      required: true,
      default: () => {},
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
        groupId: 0, // 文件夹id
        commName: '', // 文件名(去除后缀)
        // name: '',
        coverImg: '', // 视频封面图
        description: '', // 视频描述
        typeGroup: GROUPTYPE, // 类型 12:企业文件 13：个人文件
        content: '',
        isCorp: false, // 是否为企业文件
      },
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      uploadUrl: getUrL(`/ajax/upload_h.jsp?cmd=uploadTmpFile&folderType=${TsCommDef.FolderType.PERSON_SYS_VIDEO}`),
      fileList: [],
      isMax: false,
      suffixName: '', //视频后缀格式名
      maxLength: 45, // 名称字数限制（包括后缀）
      videoFolderType: TsCommDef.FolderType.PERSON_SYS_VIDEO,
      tanshuFileSelectUploadVisible: false,
    };
  },
  computed: {
    rules() {
      return {
        commName: [
          { required: true, message: '请输入视频名称', trigger: 'blur' },
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
     * 功能类型
     * @author lymn
     * @date 2021-02-05
     */
    funcTypeCal() {
      return this.materialFuncType === 'edit' ? '编辑' : '复制';
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
        this.requestParam = {
          id: this.currentVideoData.id || '',
          groupId: this.currentVideoData.groupId || 0,
          commName: this.currentVideoData.commName || '',
          // name: '',
          description: this.currentVideoData.description || '',
          coverImg: this.currentVideoData.coverImg || '',
          content: this.currentVideoData.content || '',
          typeGroup: GROUPTYPE,
          isCorp: false, // 是否为企业文件
        };
        this.fileList = this.currentVideoData.coverImgUrl
          ? [
              {
                name: this.currentVideoData.name,
                url: this.currentVideoData.coverImgUrl,
                uid: -1,
              },
            ]
          : [];
        if (this.currentVideoData.coverImgUrl) {
          this.isMax = true;
        } else {
          this.isMax = false;
        }
        const fileName = getFileName(this.currentVideoData.name);
        // this.suffixName = fileName[1]
        // this.maxLength = 50 - this.suffixName.length
        // this.textAreaRows = 2
      } else {
        this.isMax = false;
        this.requestParam = {
          id: '',
          groupId: 0,
          commName: '名称',
          // name: '',
          coverImg: '',
          description: '',
          typeGroup: GROUPTYPE,
          content: '',
          isCorp: false, // 是否为企业文件
        };
        this.fileList = [];
        this.$refs.videoContentRuleForm?.resetFields();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     *保存视频编辑
     *
     * @author guoyijie
     * @date 2020-05-12
     */
    saveVideoDetail() {
      this.$refs.videoContentRuleForm.validate(async valid => {
        console.log('valid', valid);
        if (!valid) {
          // 检查是否有错误
          return;
        }
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
        this.cancelVideoDetail();
        this.$emit('editSuccess');
        this.$utils.postMessage({
          type: 'success',
          message: this.materialFuncType == 'edit' ? '修改成功！' : '复制成功！',
        });
      });
    },
    /**
     *取消视频编辑
     *
     * @author guoyijie
     * @date 2020-05-12
     */
    cancelVideoDetail() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     *删除图片
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} file
     */
    removeMaterial(file) {
      this.requestParam.coverImg = '';
      this.fileList = [];
      this.isMax = false;
    },
    /**
     *上传前校验
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} file
     * @returns
     */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 2) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败，请上传2m以内的图片',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
    },
    /**
     *上传前校验
     *
     * @author ADI
     */
    videoBeforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败：格式错误，请上传jpg、png格式的图片',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败：单个文件的大小超过10M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
    },
    /**
     * 完成上传的回调
     * @author ADI
     * @param {*} res
     */
    uploadSuccess(res) {
      const file = res[0];
      const flag = this.videoBeforeUpload(file);
      if (flag) {
        return false;
      }
      this.isMax = true;
      this.requestParam.coverImg = file.resId;
      this.fileList = [
        {
          uid: -1,
          name: this.currentVideoData.name,
          url: file.content,
        },
      ];
    },
    /**
     * 选中文件夹
     * @author lymn
     * @date 2020-11-10
     * @param {Number} selectId 选中的文件id
     */
    selectFolder(selectId, selectItem) {
      this.requestParam.groupId = selectId;
      this.requestParam.isCorp = selectItem.isCorp;
      this.requestParam.typeGroup = selectItem.isCorp
        ? TsCommDef.TypeGroupDef.CORP_FOLDER
        : TsCommDef.TypeGroupDef.PERSON_FOLDER;
    },
  },
};
</script>

<style lang="scss" scoped>
.videoEditDialog {
  .uploadTip {
    color: $color-b2;
  }
}
</style>

<style lang="scss">
.videoEditDialog {
  .intro {
    textarea.fa-input {
      min-height: 100px;
    }
  }
}
</style>

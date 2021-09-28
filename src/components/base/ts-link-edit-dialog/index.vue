<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 11:03:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-18 14:46:42
-->
<template>
  <global-ts-dialog
    class="editLinkDialog center"
    dialog-title="编辑链接"
    :lock-dialog-body-height="false"
    :dialog-visible.sync="isShowlinkDialog"
    dialog-size="medium"
    @sure="sureEditLink"
    @cancel="cancelShowLink"
  >
    <fa-form-model ref="linkEditRuleForm" layout="vertical" :model="linkInfo" :rules="rules">
      <fa-form-model-item label="标题" prop="linkTitle">
        <fa-input :maxLength="64" v-model="linkInfo.linkTitle" placeholder="64个字符内"> </fa-input>
      </fa-form-model-item>
      <fa-form-model-item label="描述" prop="linkDesc">
        <fa-input :maxLength="120" v-model="linkInfo.linkDesc" placeholder="120个字符内"> </fa-input>
      </fa-form-model-item>
      <fa-form-model-item label="链接" prop="linkUrl">
        <fa-input v-model="linkInfo.linkUrl" placeholder="必须以https或http开头"> </fa-input>
      </fa-form-model-item>
      <fa-form-model-item label="封面">
        <global-ts-fai-img-upload-style-box
          id="uploadBox"
          :limit="1"
          name="filedata"
          class="UploadBox"
          :file-list="linkInfo.linkImgFile"
          size="small"
          uploadText="添加"
          @upload-click="
            () => {
              tanshuFileSelectUploadVisible = true;
            }
          "
          @remove="removeMaterial"
        >
        </global-ts-fai-img-upload-style-box>

        <!-- 选择图片文件夹弹窗 start -->
        <global-ts-file-select-upload-dialog
          :dialog-visible.sync="tanshuFileSelectUploadVisible"
          :limit-num="1"
          accept-type="img"
          @success="uploadSuccess"
        >
        </global-ts-file-select-upload-dialog>
        <!-- 选择图片文件夹弹窗 end -->
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
const validatorLinkUrl = (rule, value, callback) => {
  const reg = /^http:|https:/;
  if (!reg.test(value)) {
    callback(new Error('必须以https或http开头'));
  } else {
    callback();
  }
};
export default {
  name: 'ts-link-edit-dialog',
  components: {},
  props: {
    isShowlinkDialog: {
      // 是否显示弹窗
      type: Boolean,
      default: false,
    },
    defaultLinkInfo: {
      // 默认要编辑的链接信息
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      linkInfo: {
        linkTitle: '', // 标题
        linkDesc: '', // 描述
        linkUrl: '', // 链接
        linkImgFile: [], // 图片 [{uid: 图片文件id, name: 图片名称, url: 图片链接}]
      },
      tanshuFileSelectUploadVisible: false, // 是否显示选择图片文件夹弹窗
      // fileList: [], // 上传列表
      fileAccept: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
    };
  },
  computed: {
    rules() {
      return {
        linkTitle: [
          { required: true, message: '请输入链接', trigger: 'blur' },
          { min: 0, max: 64, message: '标题不能超过64个字符', trigger: 'blur' },
        ],
        linkUrl: [
          { required: true, message: '请输入链接', trigger: 'blur' },
          {
            validator: validatorLinkUrl,
            trigger: 'blur',
          },
        ],
      };
    },
  },
  watch: {
    // defaultLinkInfo: {
    // 	handler(newVal) {
    // 		this.linkInfo = true
    // 	},
    // 	deep: true
    // },
    isShowlinkDialog(newVal) {
      if (newVal && Object.keys(this.defaultLinkInfo).length) {
        this.linkInfo = { ...this.defaultLinkInfo };
      } else {
        this.linkInfo = this.$options.data().linkInfo;
        console.log(this.$options.data(), '初始化linkInfo');
        this.$refs.linkEditRuleForm?.resetFields();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    sureEditLink() {
      this.$refs.linkEditRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        this.$emit('update:isShowlinkDialog', false);
        this.$emit('confirm', this.linkInfo);
        // console.log(this.linkInfo, '链接信息')
      });
    },
    cancelShowLink() {
      this.$emit('update:isShowlinkDialog', false);
    },
    removeMaterial() {
      this.linkInfo.linkImgFile = [];
    },
    /**
     * 上传前操作
     * 限制图片大小，保存上传顺序，限制上传文件的格式
     * 文件的uid是唯一的，根据这个来作为排序
     * @author waldon
     * @date 2020/4/10
     * @param {*} file - 文件数据
     * */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAccept.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
          });
          return false;
        }
        const limit2M = file.size / 1024 / 1024;
        if (limit2M > 2) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件大小不能超过2M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
        });
        return false;
      }
    },
    uploadSuccess(res) {
      console.log(res, '获取到的结果');
      const file = res[0];
      const flag = this.beforeUpload(file);
      if (flag === false) {
        return;
      }
      this.linkInfo.linkImgFile = [
        {
          uid: file.id,
          name: file.name,
          url: file.content,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-link-edit-dialog {
}
</style>

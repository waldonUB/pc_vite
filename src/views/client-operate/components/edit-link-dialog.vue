<!--
 * @Description  : 编辑链接对话框
 * @Author       : turbo
 * @Date         : 2021-07-31 21:48:04
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-02 11:59:04
-->

<template>
  <div>
    <global-ts-dialog
      class="edit-link-dialog"
      dialog-size="medium"
      dialog-title="编辑链接"
      :dialog-visible.sync="dialogVisible"
      @cancel="cancel"
      @sure="sure"
    >
      <fa-form-model ref="editLinkForm" layout="vertical" :model="form" :rules="rules">
        <fa-form-model-item label="标题" prop="linkTitle">
          <global-ts-input
            size="large"
            placeholder="64个字符内"
            :max-length="64"
            v-model="form.linkTitle"
          ></global-ts-input>
        </fa-form-model-item>
        <fa-form-model-item label="描述">
          <global-ts-input
            size="large"
            placeholder="120个字符内"
            :max-length="120"
            v-model="form.linkDesc"
          ></global-ts-input>
        </fa-form-model-item>
        <fa-form-model-item label="链接" prop="linkUrl">
          <global-ts-input size="large" placeholder="必须以https或http开头" v-model="form.linkUrl"></global-ts-input>
        </fa-form-model-item>
        <fa-form-model-item label="封面">
          <global-ts-fai-img-upload-style-box
            size="small"
            name="filedata"
            upload-text="添加"
            :limit="1"
            :file-list="form.fileList"
            @upload-click="fileSelectUploadDialogVisible = true"
            @remove="removeMaterial"
          ></global-ts-fai-img-upload-style-box>
        </fa-form-model-item>
      </fa-form-model>
    </global-ts-dialog>
    <global-ts-file-select-upload-dialog
      accept-type="img"
      :limit-num="1"
      :dialog-visible.sync="fileSelectUploadDialogVisible"
      @success="uploadSuccess"
    ></global-ts-file-select-upload-dialog>
  </div>
</template>

<script>
// utils
import { beforeUpload } from '../utils';

export default {
  name: 'EditLinkDialog',
  props: {
    linkInfo: {
      type: Object,
      default: () => {},
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      form: {
        linkTitle: '',
        linkDesc: '',
        linkUrl: '',
        linkPicurl: '',
        fileList: [],
      },
      rules: {
        linkTitle: [{ required: true, message: '请输入标题' }],
        linkUrl: [
          { required: true, message: '请输入链接' },
          { type: 'url', trigger: 'blur', message: '请输入正确的链接格式' },
        ],
      },
      fileSelectUploadDialogVisible: false,
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.form = {
          linkTitle: this.linkInfo.linkTitle,
          linkDesc: this.linkInfo.linkDesc,
          linkUrl: this.linkInfo.linkUrl,
          linkPicurl: this.linkInfo.linkPicurl,
          fileList: this.linkInfo.fileList,
        };
      }
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    async sure() {
      const valid = await this.$refs.editLinkForm.validate();
      if (!valid) return;

      this.$emit('sureEditLinkInfo', this.form);
      this.cancel();
    },
    uploadSuccess(res) {
      const file = res[0];
      const flag = beforeUpload(file);
      if (!flag) return;
      this.form.linkPicurl = file.content; // 封面的srcid
      this.form.fileList = [
        {
          uid: file.id,
          name: file.name,
          url: file.content,
        },
      ];
    },
    removeMaterial() {
      this.form.linkPicurl = '';
      this.form.fileList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-link-dialog {
  .fa-form-item {
    &:last-child {
      margin: 0;
    }
  }
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 17:31:47
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:09:38
-->
<template>
  <div class="tanshu-cropper">
    <el-upload
      name="filedata"
      :file-list="list"
      class="nowUpload"
      action=""
      :accept="accept"
      :multiple="false"
      :limit="1"
      list-type="picture-card"
      :on-change="handleCrop"
      :before-upload="beforeUpload"
      :on-remove="removeMaterial"
      :show-file-list="true"
    >
      <el-image v-if="cropperData.iconUrl && false" :src="cropperData.iconUrl" fit="contain" class="avatar"></el-image>
      <i class="el-icon-plus" v-if="list.length <= 0"></i>
    </el-upload>
    <!-- 剪裁组件弹窗 -->
    <croper
      :dialogVisible="showCropper"
      :cropper-option="cropperOption"
      :file-size="fileSize"
      :cropper-style="cropperStyle"
      @close="showCropper = false"
      @uploadCropper="uploadImg"
    >
    </croper>
  </div>
</template>

<script>
import { Upload, Image } from 'element-ui';
import Croper from './components/croper/index.vue';
import { postMessage, loading, fixImgUrl, batchAdd, tsFaiUpload } from '@/utils';

export default {
  name: 'tanshu-cropper',
  props: {
    list: {
      // 上传的文件列表
      type: Array,
      default: () => {
        return [];
      },
    },
    action: {
      // 必选参数，上传的地址
      type: String,
      require: true,
    },
    accept: {
      // 接受上传的文件类型（thumbnail-mode 模式下此参数无效
      type: String,
      default: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG', //上传图片限定格式
    },
    autoCropWidth: {
      type: Number,
      default: 686,
    },
    autoCropHeight: {
      type: Number,
      default: 348,
    },
    maxImgSize: {
      type: Number,
      default: 686,
    },
    cropperStyle: {
      type: Object,
      default: () => {
        return {
          width: '700px',
          height: '400px',
        };
      },
    },
    mode: {
      type: String,
      default: 'container',
    },
    infoTrue: {
      type: Boolean,
      default: false,
    },
    isBatchAdd: {
      // 上传后是否存储到系统资源文件，注意只有用新架构接口才需要单独调用存储接口（此组件用的是新架构接口），旧的上传图片接口后端直接处理了
      type: Boolean,
      default: false,
    },
    folderType: {
      // 所存储的系统资源文件夹分类,isBatchAdd为true才需要传
      type: Number,
      default: 0,
    },
    customFileName: {
      // 自定义图片名称
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cropperData: {
        iconUrl: '',
      },
      showCropper: false, // 显示裁剪弹窗
      canCropper: false,
      fileSize: 5, // 限制文件上传大小
      cropperOption: {
        img: '',
        autoCropWidth: this.autoCropWidth,
        autoCropHeight: this.autoCropHeight,
        maxImgSize: this.maxImgSize,
        mode: this.mode,
        infoTrue: this.infoTrue,
      },
      fileTypeTip: '上传失败：格式错误，请上传jpg、png格式的图片',
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG', //上传图片限定格式
    };
  },
  watch: {
    autoCropWidth(val) {
      this.cropperOption = {
        ...this.cropperOption,
        autoCropWidth: val,
      };
    },
    autoCropHeight(val) {
      this.cropperOption = {
        ...this.cropperOption,
        autoCropHeight: val,
      };
    },
  },
  components: {
    [Upload.name]: Upload,
    [Image.name]: Image,
    Croper,
  },
  methods: {
    handleCrop(file) {
      // 点击弹出剪裁框
      this.$nextTick(() => {
        if (this.canCropper) {
          this.cropperOption.img = window.URL.createObjectURL(file.raw);
          this.showCropper = this.canCropper;
        }
      });
    },
    /**
     * 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
     */
    beforeUpload(file) {
      this.canCropper = false;
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          postMessage({
            type: 'error',
            message: this.fileTypeTip,
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          postMessage({
            type: 'error',
            message: '图片大小不能超过10M',
          });
          return false;
        }
        this.canCropper = true; // 校验通过后显示裁剪框
        return false;
      } else {
        postMessage({
          type: 'error',
          message: this.fileTypeTip,
        });
        return false;
      }
    },
    /**
     * 文件列表移除文件时的钩子 function(file, fileList)
     */
    removeMaterial(file, fileList) {
      this.$emit('remove');
    },
    /**
     *  自定义上传图片方法
     */
    uploadImg(blob, data) {
      const fd = new FormData();
      fd.append('file', blob);
      let fileName = 'img.png';
      console.log(this.customFileName, '自定义名称');
      if (this.customFileName) {
        // 自定义名称
        const nameList = this.customFileName.split('.');
        const fileType = nameList[nameList.length - 1];
        console.log(this.accept.indexOf(fileType.toLowerCase()), 'index索引值');
        fileName =
          this.accept.indexOf(fileType.toLowerCase()) == -1 ? this.customFileName + '.png' : this.customFileName;
      }
      console.log(fileName, '图片名称');
      fd.append('filedata', blob, fileName);
      return new Promise(resolve => {
        loading.addQuene(
          {
            key: 'cropperUploadImg',
          },
          '上传中...',
        );
        const uploadComplete = res => {
          if (res && res.id) {
            console.log('uploadComplete-res----》', res);
            this.cropperData.iconUrl = fixImgUrl(res.fullViewUrl, true);
            loading.poupQuene('cropperUploadImg');
            this.showCropper = false;
            if (this.isBatchAdd) {
              console.log(this.folderType, res, '文件类型？？？');
              batchAdd(res, this.folderType).then(data => {
                this.$emit('success', data[0]);
                resolve();
              });
            } else {
              this.$emit('success', res);
              resolve();
            }
          } else {
            postMessage({
              type: 'error',
              message: (res && res.msg) || '网络错误，请稍候重试',
            });
          }
        };
        const uploadError = res => {
          console.log('uploadError-res----》', res);
          this.showCropper = false;
          loading.poupQuene('cropperUploadImg');
          postMessage({
            type: 'error',
            message: res || '网络错误，请稍候重试',
          });
        };
        const uploadOption = {
          tempFilePath: blob,
          isComm: false, // 走业务逻辑，业务逻辑才有返回encodeSize和type等字段
          putExtra: {
            fileName,
          },
          fileSize: blob.size,
          complete: uploadComplete,
          error: uploadError,
        };
        tsFaiUpload(uploadOption);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

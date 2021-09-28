<template>
  <div :class="['breakpointFile', { hideDeleteFile: removeDisabled }]">
    <el-upload
      class="image-upload-pic"
      ref="upload"
      :multiple="multiple"
      :accept="acceptStr"
      :file-list="fileList"
      :show-file-list="isShowFileList"
      :list-type="listType"
      action="fakeaction"
      :limit="limit"
      :on-remove="removeFile"
      :on-progress="uploadProgress"
      :before-upload="beforeUpload"
      :http-request="getFileInfo"
      :before-remove="beforeMove"
    >
      <slot></slot>
      <div v-if="fixIcon" slot="file" slot-scope="{ file, disabled }">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="file.url"
          alt=""
        />
        <a class="el-upload-list__item-name"> <i class="el-icon-document"></i>{{ file.name }} </a>
        <label class="el-upload-list__item-status-label">
          <i
            :class="{
              'adi': true,
              'el-icon-upload-success': true,
              'el-icon-success': listType === 'text',
              'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1,
            }"
          ></i>
        </label>
        <i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>
        <!-- <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> -->
        <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        >
        </el-progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="$emit('remove', file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { postMessage, loading, tsFaiUpload, batchAdd, encodeUrl } from '@/utils';
import { Upload } from 'element-ui';
import { advanceUploadFile } from '@/api/modules/component/point-upload';

export default {
  name: 'ts-point-upload',
  components: {
    [Upload.name]: Upload,
  },
  props: {
    chunkSize: {
      type: Number,
      default: 1024 * 1024 * 8,
    },
    accept: {
      // 上传类型，如果不同类型的文件大小限制不一样，则可以传数组，数组格式示例：['.doc,.docx', '.mp4', '..jpg,.jpeg']
      type: [String, Array],
      default: '',
    },
    fileList: {
      type: Array,
      default: () => {},
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    sizeCheckTip: {
      // 大小超出限制提示，如果不同类型的文件大小限制不一样，则可以传数组，数组顺序和上传类型顺序一致
      type: [String, Array],
      default: '',
    },
    typeCheckTip: {
      type: String,
      default: '',
    },
    isShowFileList: {
      type: Boolean,
      default: false,
    },
    limitSize: {
      // 大小限制，如果不同类型的文件大小限制不一样，则可以传数组，数组顺序和上传类型顺序一致
      type: [Number, Array],
      default: 2,
    },
    removeDisabled: {
      // 是否禁止删除
      type: Boolean,
      default: false,
    },
    isShowLoading: {
      // 是否显示加载动画，默认显示
      type: Boolean,
      default: true,
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
    isCustomBeforeUpload: {
      type: Boolean,
      default: false,
    },
    customBeforeUpload: {
      // 上传文件限制，函数必须返回布尔值，true:允许上传 false:禁止上传
      type: Function,
    },
    extraUploadOption: {
      // 另外要传的uploadOption配置
      type: Object,
      default: () => {},
    },
    limit: {
      // 最大允许上传个数
      type: Number,
    },
    listType: {
      // 文件列表的类型
      type: String,
      default: 'text',
    },
    fixIcon: {
      // 修改filelist erroricon样式, 不推荐使用这一选项, elementui不支持替换icon的, 使用了会导致事件失效
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileObj: null,
      running: false,
      fileMd5: '',
      currentUpload: 0,
      uid: '',
      length: 0,
      acceptStr: '', // 上传类型字符串
    };
  },
  watch: {
    /**
     * 转换上传类型为字符串
     * @author lymn
     * @date 2021-01-12
     */
    accept(newVal) {
      if (Array.isArray(newVal)) {
        this.acceptStr = newVal.join(',');
      } else {
        this.acceptStr = newVal;
      }
    },
  },
  created() {
    if (Array.isArray(this.accept)) {
      this.acceptStr = this.accept.join(',');
    } else {
      this.acceptStr = this.accept;
    }
  },
  methods: {
    /**
     * 上传文件限制
     * @author lymn
     * @date 2021-01-20
     * @param {Object} file
     */
    beforeUpload(file) {
      console.log(file, 'beforeUpload==');
      const nameList = file.name.split('.');
      const fileType = nameList[nameList.length - 1];

      if (!file.size) return false; // 空文件禁止上传

      // 上传类型是否符合要求
      let acceptIdx = -1;
      if (Array.isArray(this.accept)) {
        acceptIdx = this.accept.findIndex((item, index) => {
          return item.indexOf(fileType.toLowerCase()) !== -1;
        });
        if (acceptIdx < 0) {
          // 不符合上传类型
          postMessage({
            type: 'error',
            message: this.typeCheckTip,
          });
          this.$emit('beforeUploadError', file);
          return false;
        }
      } else if (this.accept.indexOf(fileType.toLowerCase()) == -1) {
        postMessage({
          type: 'error',
          message: this.typeCheckTip,
        });
        this.$emit('beforeUploadError', file);
        return false;
      }

      // 文件大小是否符合大小
      const limitSize = Array.isArray(this.limitSize) && acceptIdx > -1 ? this.limitSize[acceptIdx] : this.limitSize;
      const sizeCheckTip =
        Array.isArray(this.sizeCheckTip) && acceptIdx > -1 ? this.sizeCheckTip[acceptIdx] : this.sizeCheckTip;
      if (file.size / 1024 / 1024 > limitSize) {
        console.log('是否超过限制');
        postMessage({
          type: 'error',
          message: sizeCheckTip,
        });
        this.$emit('beforeUploadError', file);
        return false;
      }

      if (this.customBeforeUpload) {
        // 自定义上传限制
        const isCanUpload = this.customBeforeUpload(file);
        if (!isCanUpload) return false;
      }
      this.$emit('beforeUpload', file);
      return true;

      // if (file.size / 1024 / 1024 > this.limitSize) {
      // 	console.log('是否超过限制')
      // 	postMessage({
      // 		type: "error",
      // 		message: this.sizeCheckTip
      // 	});
      // 	return false;

      // } else if (this.accept.indexOf(fileType.toLowerCase()) == -1) {
      // 	postMessage({
      // 		type: "error",
      // 		message: this.typeCheckTip
      // 	});
      // 	return false;
      // } else {
      // 	this.$emit('beforeUpload', file)
      // 	return true
      // }
    },
    /**
     *
     *
     * @author guoyijie
     * @date 2020-05-17
     */
    async getFileInfo(option) {
      console.log('获取到上传的文档');
      if (this.isShowLoading) {
        loading.addQuene(
          {
            key: 'breakUploadLoading',
          },
          '上传中...',
        );
      }
      this.fileObj = option.file;
      if (this.fileObj.uid) {
        this.uid = this.fileObj.uid;
      } else {
        var timestamp = new Date().getTime();
        var random = Math.floor(Math.random() * 99) + 1;
        this.uid = timestamp + random;
      }

      const uploadOption = {
        tempFilePath: this.fileObj,
        fileSize: option.file.size, // 多传一个fileSize给后端校验剩余容量 2021年1月14日 waldon
        isComm: false, // 文件夹的上传全部走业务模式
        putExtra: {
          fileName: this.fileObj.name,
        },
        next: this.uploadNext(option),
        complete: this.uploadComplete(option),
        error: this.uploadError(option),
      };
      Object.assign(uploadOption, this.extraUploadOption);
      tsFaiUpload(uploadOption);
    },
    /**
     * 上传成功回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} option -
     */
    uploadComplete(option) {
      return res => {
        const params = {
          name: res.fileName,
          size: res.encodeSize, // batchAddMaterialInfo这个接口的全是用编码后的size
        };
        // this.$emit('breakUpload', {...res, ...params}, option.file)
        if (this.isBatchAdd) {
          batchAdd(res, this.folderType)
            .then(() => {
              this.$emit('breakupload', { ...res, ...params }, option.file);
            })
            .catch(() => {
              this.uploadError(option)('', true);
            });
        } else {
          this.$emit('breakupload', { ...res, ...params }, option.file);
        }
      };
    },
    /**
     * 上传错误回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} option
     * @param {Boolean} hideMessage 是否隐藏提示
     */
    uploadError(option) {
      /**
       * @param {Object} err - 参数 err 为一个包含 code、message、isRequestError 三个属性的 object
       * err.isRequestError: 用于区分是否 xhr 请求错误；当 xhr 请求出现错误并且后端通过 HTTP 状态码返回了错误信息时，该参数为 true；否则为 undefined
       * err.code: number，请求错误状态码，只有在 err.isRequestError 为 true 的时候才有效
       * err.message: string，错误信息，包含错误码，当后端返回提示信息时也会有相应的错误信息
       */
      return (err, isHideMessage) => {
        if (!isHideMessage) {
          if (err && err.message) {
            postMessage({
              type: 'error',
              message: err.message || '网络错误，请稍候重试',
            });
          } else {
            postMessage({
              type: 'error',
              message: '上传失败',
            });
          }
        }
        this.$emit('uploadError', option.file);
      };
    },
    /**
     * 上传进度回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} option -
     */
    uploadNext(option) {
      /**
       * @param {Object} res - res 是一个带有 total 字段的 object，包含loaded、total、percent三个属性，提供上传进度信息
       * total.loaded: number，已上传大小，单位为字节
       * total.total: number，本次上传的总量控制信息，单位为字节，注意这里的 total 跟文件大小并不一致
       * total.percent: number，当前上传进度，范围：0 ～ 100
       */
      return res => {
        this.$emit('uploadProgress', { percent: parseInt(res.total.percent) }, option.file);
      };
    },
    /**
     * 文件上传
     * @date 2020-10-28
     * @param {Object} list
     * @param {Number} currentUpload
     * @param {Object} option 自定义上传的参数
     */
    async upload(list, currentUpload, option) {
      let iscomplete = false;
      if (currentUpload == this.length - 1) {
        iscomplete = true;
      } else if (currentUpload >= this.length) {
        return;
      }
      var formData = new FormData();
      formData.append('fileName', encodeUrl(this.fileObj.name));
      formData.append('fileSplitSize', this.chunkSize);
      formData.append('initSize', this.fileObj.size);
      formData.append('fileMd5', this.fileMd5);
      formData.append('complete', iscomplete);
      formData.append('uid', this.uid);
      formData.append('filedata', list[currentUpload].file);
      const name = this.fileObj.name.replace(/&/g, '%26');
      const params = { name, ts_hideLoading: this.isShowLoading ? 'true' : 'false' };
      const [err, res] = await advanceUploadFile(params, formData);
      if (err) {
        if (this.isShowLoading) {
          loading.poupQuene('breakUploadLoading');
        }
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        // loading.poupQuene("breakUploadLoading");
        option.onError('上传文件失败');
        this.$emit('uploadError', option.file);
        return err;
      }
      currentUpload++;
      this.$emit('uploadProgress', { percent: parseInt((currentUpload / this.length) * 100) }, option.file);
      if (currentUpload == this.length) {
        this.$emit('breakupload', res.data.data, option.file);
      } else {
        this.upload(list, currentUpload, option);
      }
    },
    removeFile(file) {
      this.$emit('removefile', file);
    },
    /**
     * 禁止删除
     * @author lymn
     * @date 2020-10-14
     */
    beforeMove() {
      if (this.removeDisabled) {
        return false;
      }
    },
    /**
     * 更新进度
     * @author lymn
     * @date 2020-10-29
     */
    uploadProgress() {
      console.log(arguments, '断点续传进度');
    },
  },
};
</script>

<style lang="scss">
/* 断点续传组件 start */
.breakpointFile.hideDeleteFile .el-upload-list__item .el-icon-close,
.breakpointFile.hideDeleteFile .el-upload-list__item .el-icon-close-tip {
  width: 0;
  height: 0;
  overflow: hidden;
}

/* 断点续传组件 end */
</style>

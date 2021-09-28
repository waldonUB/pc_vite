<template>
  <div :class="['imgUploadWrapper', 'tsFaiImgUpload-' + size]">
    <fa-upload
      name="filedata"
      listType="picture-card"
      class="tsImgUpload"
      :fileList="realFileList"
      :showUploadList="showFileList"
      :accept="fileAcceptCal"
      action=""
      :customRequest="customRequest"
      :disabled="disabled"
      :beforeUpload="beforeUpload"
      :remove="removeImg"
    >
      <div v-if="realFileList.length < limit" class="">
        <fa-icon type="plus" />
        <div class="fa-upload-text">上传图片</div>
      </div>
    </fa-upload>
  </div>
</template>

<script>
import { tsFaiUpload, batchAdd, postMessage } from '@/utils';
import { Upload, Icon } from '@fk/faicomponent';
export default {
  name: 'ts-fai-img-upload',
  components: {
    [Upload.name]: Upload,
    [Icon.name]: Icon,
  },
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showFileList: {
      // 是否显示图片列表
      type: Boolean,
      default: true,
    },
    // imageUrl: {
    //     type: String,
    //     required: true
    // },
    disabled: {
      type: Boolean,
      default: false,
    },
    isComm: {
      type: Boolean,
      default: false,
    },
    limit: {
      // 上传个数限制
      type: Number,
      default: 1,
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
    size: {
      // 尺寸 mini:80 small：108 medium: 125 large: 146
      type: String,
      defualt: 'small',
    },
  },
  data() {
    return {
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      loading: false,
      uid: 1,
      realFileList: [], // 图片列表
    };
  },
  computed: {},
  created() {
    this.realFileList = [...this.fileList];
  },
  watch: {
    fileList(newVal) {
      this.realFileList = [...newVal];
    },
    folderType(newVal) {
      console.log(newVal, 'folderType--new');
    },
  },
  methods: {
    /**
     * 自定义上传
     * @author waldon
     * @date 2020/12/15
     * @param {Object} fileInfo - 文件信息
     */
    customRequest(fileInfo) {
      const uploadOption = {
        tempFilePath: fileInfo.file,
        isComm: this.isComm, // 文件夹的上传全部走业务模式
        putExtra: {
          fileName: fileInfo.file.name,
          tmp: false, // 这种保存后就立即转正的，不使用临时缓存
        },
        fileSize: fileInfo.file.size,
        next: this.uploadNext,
        complete: this.uploadComplete(fileInfo),
        error: this.uploadError,
      };
      tsFaiUpload(uploadOption);
    },
    /**
     * 上传成功回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} res - 接收上传完成后的后端返回信息，具体返回结构取决于后端配置
     */
    uploadComplete(option) {
      return res => {
        this.loading = false;
        if (this.isBatchAdd) {
          batchAdd(res, this.folderType)
            .then(() => {
              console.log('res, option.file', res, option.file);
              this.$emit('uploadcomplete', res, option.file);
              this.realFileList.push({
                uid: option.file.uid,
                name: res.fileName,
                url: res.fullViewUrl,
              });
            })
            .catch(() => {
              this.uploadError({}, true);
            });
        } else {
          this.$emit('uploadcomplete', res, option.file);
          this.realFileList.push({
            uid: option.file.uid,
            name: res.fileName,
            url: res.fullViewUrl,
          });
        }
      };
    },
    /**
     * 上传错误回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} err - 参数 err 为一个包含 code、message、isRequestError 三个属性的 object
     * @param {Boolean} isHideMessage 是否隐藏提示
     * err.isRequestError: 用于区分是否 xhr 请求错误；当 xhr 请求出现错误并且后端通过 HTTP 状态码返回了错误信息时，该参数为 true；否则为 undefined
     * err.code: number，请求错误状态码，只有在 err.isRequestError 为 true 的时候才有效
     * err.message: string，错误信息，包含错误码，当后端返回提示信息时也会有相应的错误信息
     */
    uploadError(err, isHideMessage) {
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
      this.$emit('uploadError', err);
    },
    /**
     * 上传进度回调
     * @author waldon
     * @date 2020/12/20
     * @param {Object} res - res 是一个带有 total 字段的 object，包含loaded、total、percent三个属性，提供上传进度信息
     * total.loaded: number，已上传大小，单位为字节
     * total.total: number，本次上传的总量控制信息，单位为字节，注意这里的 total 跟文件大小并不一致
     * total.percent: number，当前上传进度，范围：0 ～ 100
     */
    uploadNext(res) {
      this.$emit('uploadNext', res);
      this.loading = true;
    },
    /**
     * 上传前校验
     * @author waldon
     * @date 2020-05-20
     * @param {*} file
     */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          postMessage({
            type: 'error',
            message: '上传失败，请上传10m以内的图片',
          });
          return false;
        }
      } else {
        postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
    },
    /**
     * 移除图片
     * @author lymn
     * @date 2021-01-13
     */
    removeImg(file) {
      this.realFileList.find((item, index) => {
        if (item.uid == file.uid) {
          this.realFileList.splice(index, 1);
          return true;
        }
      });
      this.$emit('remove', file);
      console.log(arguments);
    },
  },
};
</script>

<style lang="scss" scoped>
.imgUploadWrapper .uploadPreviewImg {
  width: 88px;
  height: 88px;
  border-radius: 2px;
  object-fit: cover;
}
</style>

<style lang="scss"></style>

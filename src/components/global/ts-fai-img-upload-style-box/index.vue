<template>
  <div :class="['tsFaiImgUploadStyleWrapper', 'imgUploadWrapper', 'tsFaiImgUpload-' + size]">
    <fa-upload
      name="filedata"
      listType="picture-card"
      class="tsImgUpload"
      :file-list="realFileList"
      :show-upload-list="showFileList"
      action=""
      :disabled="disabled"
      :remove="removeImg"
    >
      <div v-if="realFileList.length < limit" class="fileUploadSelect_pictureCardWrapper" @click="uploadClick">
        <fa-icon type="plus" />
        <div class="fa-upload-text">{{ uploadText }}</div>
      </div>
    </fa-upload>
  </div>
</template>

<script>
import { Upload, Icon } from '@fk/faicomponent';
export default {
  name: 'ts-fai-img-upload-style-box',
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
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      // 上传个数限制
      type: Number,
      default: 1,
    },
    size: {
      // 尺寸 small：108 medium: 125 mini:80 large: 140
      type: String,
      defualt: 'small',
    },
    uploadText: {
      type: String,
      defualt: '上传图片',
    },
  },
  data() {
    return {
      realFileList: [], // 图片列表
    };
  },
  created() {
    this.realFileList = [...this.fileList];
  },
  watch: {
    fileList(newVal) {
      this.realFileList = [...newVal];
    },
  },
  methods: {
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
    },
    /**
     * 替换上传事件
     * @author: ADI
     * @Date: 2021-01-28 15:42:06
     */
    uploadClick(event) {
      console.log('event', event);
      event && event.stopPropagation() && event.preventDefault();
      this.$emit('upload-click', event);
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.fileUploadSelect_pictureCardWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.tsFaiImgUploadStyleWrapper {
  /* 适配部分页面tanshu_errorSubmit 样式层级问题 */
  position: relative;
}
.imgUploadWrapper .uploadPreviewImg {
  width: 88px;
  height: 88px;
  border-radius: 2px;
  object-fit: cover;
}
</style>

<style lang="scss">
.tsFaiImgUploadStyleWrapper .fa-upload.fa-upload-select-picture-card .fa-upload {
  padding: 0;
}
</style>

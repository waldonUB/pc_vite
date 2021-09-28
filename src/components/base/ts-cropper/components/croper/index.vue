<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 14:30:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 10:01:57
-->
<template>
  <el-dialog
    title="图片裁切"
    class="tanshu-cropper-dialog"
    :close-on-click-modal="false"
    :visible="dialogVisible"
    center
    @close="close"
  >
    <div class="cropper-wrap">
      <div class="cropper-ability">
        <span class="toLeft iconCom" @click="rotateLeft">
          <global-ts-svg-icon class="icon" name="icon-zuozhuan" />
        </span>
        <span class="toRight iconCom" @click="rotateRight">
          <global-ts-svg-icon class="icon" name="icon-youzhuan" />
        </span>
        <el-input-number class="inputNumber" v-model="num" @change="handleChange" :min="1" :max="10"></el-input-number>
      </div>
      <div class="cropper-box" :style="cropperStyle">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="option.info"
          :full="option.full"
          :canScale="option.canScale"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed="option.fixed"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          :max-img-size="option.maxImageSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          :maxImgSize="option.maxImgSize"
          @realTime="realTime"
        />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <global-ts-button class="sureBtn" type="primary" @click="finish">确认 </global-ts-button>
      <global-ts-button class="cancel" type="others" @click="close">取消 </global-ts-button>
    </div>
  </el-dialog>
</template>

<script>
import { Dialog, InputNumber } from 'element-ui';
import { dataURLtoBlob } from '@/utils';
import { VueCropper } from 'vue-cropper';

export default {
  name: 'ts-croper',
  components: {
    [Dialog.name]: Dialog,
    [InputNumber.name]: InputNumber,
    VueCropper,
  },
  data() {
    return {
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        full: false, // 是否输出原图比例的截图
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        canMove: true, // 上传图片是否可以移动
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        enlarge: 2, // 图片根据截图框输出比例倍数
        mode: 'container', // 图片默认渲染方式
        maxImgSize: 686, // 限制图片最大宽度和高度
      },
      // 防止重复提交
      loading: false,
      preview: {},
      previewStyle: {},
      num: 1,
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    cropperOption: {
      type: Object,
      default: () => {},
    },
    cropperStyle: {
      type: Object,
      default: () => {},
    },
    fileSize: {
      type: Number,
      default: 5,
    },
    // 裁剪预览图片缩放比例
    zoom: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    cropperOption: {
      handler(value) {
        this.option = Object.assign(this.option, value);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    upload() {
      // 点击上传
      this.$refs.upload.value = null;
      this.$refs.upload.click();
    },
    uploadImg(e) {
      // 上传图片
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error(file.name + '不是图片格式文件');
        return false;
      }
      if (file.size > 1024 * 1024 * this.fileSize) {
        // 图片不大于2M
        this.$message.error(`请上传小于${this.fileSize}M的图片`);
        return false;
      }
      const reader = new FileReader();
      // 转化为blob
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.$set(this.option, 'img', data);
      };
    },
    realTime(preview) {
      // 实时预览
      this.preview = preview;
      this.previewStyle = {
        width: preview.w + 'px',
        height: preview.h + 'px',
        overflow: 'hidden',
        margin: '0',
        zoom: this.zoom,
      };
    },
    // 将base64转换为png文件图片
    finish() {
      this.$refs.cropper.getCropData(data => {
        // data - 截图的base64 数据
        const blob = dataURLtoBlob(data);
        this.$emit('uploadCropper', blob, data);
      });
    },
    close() {
      this.$emit('close');
    },
    /***
     * 放大 or 放小
     */
    changeScale(num) {
      this.$refs.cropper.changeScale(num);
    },
    /**
     * 左转
     */
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    /**
     * 右转
     */
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    handleChange(currentValue, oldValue) {
      if (currentValue > oldValue) {
        this.changeScale(1);
      } else {
        this.changeScale(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-cropper 裁剪框组件样式 start */
.tanshu-cropper-dialog {
  .cropper-wrap {
    display: flex;
    flex-direction: column;
    .cropper-ability {
      margin-bottom: 20px;
      text-align: right;
    }
    .iconCom {
      margin-right: 12px;
      font-size: 16px;
      color: rgb(195, 195, 195);
      &:hover {
        color: $primary-color;
      }
    }
    .preview-box {
      padding-left: 20px;
      .preview-title {
        display: flex;
        height: 32px;
        min-width: 100px;
        color: #1e2330;
        justify-content: space-between;
        align-items: center;
      }
      .preview-img {
        border-radius: 2px;
      }
    }
  }
}
.directSale {
  .tanshu-cropper-dialog {
    .cropper-wrap {
      .iconCom {
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
}

/* tanshu-cropper 裁剪框组件样式 end */
</style>

<style lang="scss">
.tanshu-cropper-dialog {
  .el-dialog {
    width: max-content;
  }
  .el-dialog__body {
    padding: 30px;
    padding-top: 20px;
  }
  .cropper-wrap {
    .cropper-ability {
      .inputNumber {
        .el-input {
          input {
            pointer-events: none;
          }
        }
      }
    }
    .el-input-number__increase {
      height: 38px;
    }
  }
  .el-dialog__footer {
    height: 80px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: 1px solid #eeeeee;
    box-sizing: border-box;
    .cancel {
      margin-left: 10px;
    }
  }
  .el-dialog__header {
    font-size: 16px;
    color: $color-00;
    text-align: left;
    border-bottom: 1px solid #eeeeee;
  }
}
.tanshu-cropper-dialog .cropper-wrap .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: $primary-color;
  border-color: $primary-color;
}
.tanshu-cropper-dialog .el-input-number__decrease:hover,
.tanshu-cropper-dialog .el-input-number__increase:hover {
  color: $primary-color;
}
.tanshu-cropper-dialog
  .el-input-number__decrease:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled),
.tanshu-cropper-dialog
  .el-input-number__increase:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled) {
  border-color: $primary-color;
  border-color: $primary-color;
}
</style>

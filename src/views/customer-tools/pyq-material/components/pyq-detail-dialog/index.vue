<!--
 * @Author       : ADI
 * @Date         : 2021-06-02 11:45:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-22 10:12:41
-->
<template>
  <div>
    <global-ts-wx-work-dialog
      class="pyqDetailDialog"
      dialogTitle="朋友圈素材详情"
      :tsDialogVisible.sync="dialogVisible"
      dialogSize="medium"
      @cancel="cancel"
      :withFooter="false"
    >
      <div class="pyqDetailDialogContent">
        <div class="contentItem">
          <div class="title">内容</div>
          <div class="content">{{ pyqMaterialInfo.description }}</div>
        </div>
        <div class="contentItem">
          <div class="title">图片</div>
          <div class="contentImgBox">
            <div v-for="imgItem in pyqMaterialInfo.contentList" :key="imgItem.regId" class="contentImg">
              <img :src="imgItem.regUrl" @click="previewImg(imgItem.regUrl)" />
              <ts-img-gfw-tip :gfwStatus="imgItem.gfwStatus" :gfwStatusReason="imgItem.gfwStatusReason">
              </ts-img-gfw-tip>
            </div>
          </div>
        </div>
      </div>
    </global-ts-wx-work-dialog>
    <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
  </div>
</template>

<script>
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';

export default {
  name: 'pyqDetailDialog',
  components: { TsPreviewPicture, TsImgGfwTip },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    pyqMaterialInfo: {
      type: Object,
      default: () => {
        return {
          description: '',
          contentList: [],
        };
      },
    },
  },
  data() {
    return {
      previewVisible: false,
      previewImgUrl: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    previewImg(img) {
      this.previewImgUrl = img;
      this.previewVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.pyqDetailDialog {
  .contentItem {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    color: $color-53;
    .title {
      min-width: 28px;
      margin-right: 30px;
    }
    .contentImgBox {
      display: flex;
      flex-wrap: wrap;
      margin-top: 4px;
      .contentImg {
        position: relative;
        width: 120px;
        height: 120px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 4rpx;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          cursor: pointer;
          border: 1px solid $border-color;
          border-radius: 4px;
          transform: translate(-50%, -50%);
          box-sizing: border-box;
        }
      }
      .gfwBox {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 120px;
        height: 34px;
        margin: auto;
        font-size: 12px;
        line-height: 34px;
        color: $error-color;
        text-align: center;
        background: #fef0f0;
        .helpIcon {
          &.icon {
            width: 12px;
            height: 12px;
            margin: 0 2px 0 0;
            color: $error-color;
          }
        }
      }
    }
  }
  .pyqDetailDialogContent {
    .contentItem {
      .content {
        word-break: break-all;
      }
    }
  }
}
</style>

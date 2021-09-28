<!--
 * @Author       : ADI
 * @Date         : 2021-06-24 11:25:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 14:58:17
-->
<template>
  <div class="posterPreview">
    <div class="posterBox">
      <img class="posterImg" :style="posterStyleDef['type_' + index].style" :src="posterImg" alt="海报图片" />
      <div class="posterInfo" v-if="index == 1">
        <div class="userInfo ellipsis">
          姓名 职位
        </div>
        <div class="userPost ellipsis">
          <global-ts-svg-icon class="icon post" name="icon-gongsi"></global-ts-svg-icon>
          <span class="text">公司</span>
        </div>
        <div class="userPhone">
          <global-ts-svg-icon class="icon phone" name="icon-dianhua"></global-ts-svg-icon>
          <span class="text">手机号码</span>
        </div>
      </div>
      <img
        class="qrCodeImg"
        :src="posterStyleDef.qrCodeImg"
        :style="posterStyleDef['type_' + index].qrCodeInfo.style"
      />
    </div>
  </div>
</template>

<script>
import qrcodeIMG from '@/assets/image/createPoster/qrcode.png';
import posterImg_1IMG from '@/assets/image/createPoster/posterImg_1.png';
import posterImg_2IMG from '@/assets/image/createPoster/posterImg_2.png';

export default {
  name: 'preview-poster',
  components: {},
  props: {
    index: {
      // 选中的样式 1：样式一 2：样式二 ...依次类推
      type: Number,
      default: 3,
    },
    uploadImgUrl: {
      // 上传的图片
      type: String,
      default: '',
    },
    posterInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      posterStyleDef: {
        // 不同海报样式的属性变动
        qrCodeImg: qrcodeIMG,
        type_1: {
          // 样式一
          posterImgDef: posterImg_1IMG, // 默认海报图
          style: {
            // 海报图样式
            width: '210px',
            height: '306px !important',
          },
          qrCodeInfo: {
            // 二维码样式
            style: {
              left: '156px',
              top: '323px',
            },
          },
        },
        type_2: {
          // 样式二
          posterImgDef: posterImg_2IMG, // 默认海报图
          style: {
            // 海报图样式
            width: '210px',
            height: '375px !important',
          },
          qrCodeInfo: {
            // 二维码样式
            style: {
              left: '156px',
              top: '323px',
            },
          },
        },
        type_3: {
          // 样式三
          posterImgDef: posterImg_2IMG, // 默认海报图
          style: {
            // 海报图样式
            width: '210px',
            height: '375px !important',
          },
          qrCodeInfo: {
            // 二维码样式
            style: {
              left: '89px',
              top: '323px',
            },
          },
        },
      },
    };
  },
  computed: {
    posterImg() {
      // 预览海报图
      if (this.uploadImgUrl) {
        return this.uploadImgUrl;
      } else {
        return this.posterStyleDef['type_' + this.index].posterImgDef;
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.posterPreview {
  position: absolute !important;
  top: 85px;
  right: 0;
  left: 0;
  width: 230px;
  height: 394px;
  min-height: 394px !important;
  margin: auto;
  background: $color-ff;
  .posterImg {
    display: inline-block;
  }
  .posterInfo {
    width: 210px;
    height: 68px;
    padding: 6px 12px;
    margin: 0 auto;
    font-size: 14px;
    box-sizing: border-box;
    .icon {
      font-size: 14px;
    }
    .userInfo {
      width: 134px;
      font-size: 12.5px;
      color: $color-53;
    }
    .userName {
      display: inline-block;
      height: 14px;
      margin-right: 4px;
      font-size: 14px;
      line-height: 14px;
      color: $color-53;
    }
  }
  .posterBox {
    width: 210px;
    height: 374px;
    margin: 9px 10px 0;
    overflow: hidden;
    border: 1px solid #eeeeee;
  }
  .qrCodeImg {
    position: absolute;
    width: 52px;
    height: 52px;
  }
}
.posterPreview .posterInfo .userPost,
.posterPreview .posterInfo .userPhone {
  width: 134px;
  height: 14px;
  margin-top: 6px;
  font-size: 0;
  line-height: 14px;
  color: $color-b2;
}
.posterPreview .posterInfo .userPost .text,
.posterPreview .posterInfo .userPhone .text {
  font-size: 12px;
}
</style>

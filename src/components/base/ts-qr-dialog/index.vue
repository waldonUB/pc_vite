<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:45:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-25 18:18:01
-->
<template>
  <div class="ts-qr-dialog">
    <global-ts-dialog
      :dialog-visible.sync="isShowDialog"
      class="tanshu-qrDialog"
      :dialog-title="title"
      :modal="modal"
      :mask-closable="clickModalClose"
      :closable="showClose"
      wrap-class-name="tanshu-dialog"
      @sure="close"
      @cancel="close"
    >
      <div class="qrCodeBox flex-v flex-vc">
        <img class="qrCodeBox__img" :src="qrUrl" />
        <p class="qrCodeBox__desc">{{ desc }}</p>
      </div>
    </global-ts-dialog>
  </div>
</template>

<script>
import { postMessage } from '@/utils';
import { getTsUserWxAuthAppQr } from '@/api/modules/views/user';

export default {
  name: 'ts-qr-dialog',
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    showBottomBar: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '分享指引',
    },
    desc: {
      type: String,
      default: '立即扫码登录小程序， 即可通过文章或名片获取意向客户',
    },
    // 点击遮罩层关闭
    clickModalClose: {
      type: Boolean,
      default: true,
    },
    //显示右上角关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
    //是否显示遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      qrUrl: '',
    };
  },
  created() {
    this.getqrCode();
  },
  methods: {
    async getqrCode() {
      const [err, res] = await getTsUserWxAuthAppQr();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return err;
      }
      this.qrUrl = res.data.qrUrl;
    },
    close() {
      this.$emit('update:isShowDialog', false);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 二维码弹出组件 start */
.tanshu-qrDialog {
  .qrCodeBox {
    padding: 30px;
    .qrCodeBox__img {
      width: 280px;
      height: 280px;
      border: 1px solid #eeeeee;
      border-radius: 10px;
    }
    .qrCodeBox__desc {
      margin-top: 10px;
    }
  }
}

/* 二维码弹窗组件 end */
</style>

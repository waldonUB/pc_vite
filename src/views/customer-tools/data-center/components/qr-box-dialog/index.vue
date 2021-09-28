<!--
 * @Author       : ADI
 * @Date         : 2021-05-24 11:54:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-25 15:59:43
-->
<template>
  <global-ts-dialog
    class="shareBox"
    width="620px"
    :dialog-visible.sync="isDialog"
    dialog-title="分享指引"
    @sure="close"
    @cancel="close"
  >
    <div class="qrCodeBox">
      <img class="qrImg" :src="imageUrl" />
      <p>立即扫码登录小程序， 获取意向客户</p>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import { getTsUserWxAuthAppQr } from '@/api/modules/views/user';

export default {
  name: 'qr-box-dialog',
  components: {},
  props: {},
  data() {
    return {
      imageUrl: '',
      isDialog: true,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getqrCode();
  },
  mounted() {},
  methods: {
    async getqrCode() {
      const [err, res] = await getTsUserWxAuthAppQr();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.imageUrl = res.data.qrUrl;
    },
    close() {
      this.isDialog = false;
    },
    open() {
      this.isDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.shareBox {
  .qrCodeBox {
    display: flex;
    padding: 30px;
    flex-direction: column;
    align-items: center;
    .qrImg {
      width: 280px;
      height: 280px;
      border: 1px solid #eeeeee;
      border-radius: 10px;
    }
    p {
      margin-top: 10px;
    }
  }
}
</style>

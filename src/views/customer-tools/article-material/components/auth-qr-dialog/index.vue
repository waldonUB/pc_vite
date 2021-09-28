<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:33:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-24 10:49:03
-->
<template>
  <global-ts-dialog
    class="authQrDialog wxCorpDialog center"
    dialog-title="授权公众号"
    :dialog-visible="dialogVisible"
    dialog-size="medium"
    :append-to-body="true"
    @cancel="cancel"
    :with-footer="false"
  >
    <div class="dialogContent">
      <div class="infoPart">
        <div class="infoTitle">
          微信公众号授权
        </div>
        <div class="imgWrapper">
          <div class="imgBox">
            <global-ts-svg-icon v-if="isFinishScan" class="icon finishIcon" name="icon-icon-16" />
            <img v-else :src="qrImg" alt="" />
            <div v-if="!isFinishScan && isExpireQr" class="refreshQrBox" @click="getBindQr">
              <div class="refreshTip">二维码已过期点击刷新</div>
            </div>
          </div>
        </div>
        <div class="infoTip">
          <span v-if="isFinishScan">扫描成功，请在手机上进行授权</span>
          <span v-else>请使用微信公众号绑定的管理员个人微信号扫描</span>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { getUrlParam, postMessage } from '@/utils';
import { getCheckCache, bindingWx } from '@/api/modules/views/customer-tools/article-material';

export default {
  name: 'auth-qr-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      isFinishScan: false, // 是否完成扫码
      isFinishAuth: false, // 是否完成授权
      qrImg: '',
      isExpireQr: false, // 二维码是否过期
      expireQrTimer: 0, // 二维码过期计时
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getBindQr();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * @description : 轮询检查是否授权二维码
     * @author      : ADI
     * @Date        : 2021-05-21 17:25:25
     * @param        {*}
     * @return       {Promise}
     */
    async getCheckCache() {
      const params = {
        type: 1,
        key: getUrlParam(this.qrImg, 'v'), // 时间戳来校验，旧逻辑
      };
      const [err, res] = await getCheckCache(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isFinishScan = res.data.status && res.data.status === 1;
      if (this.isFinishScan) {
        clearTimeout(this.expireQrTimer);
      }
      this.isFinishAuth = res.data.status && res.data.status === 2;
      if (this.isFinishAuth) {
        this.$emit('finishAuth', res.data);
        this.cancel();
      }
      if (this.dialogVisible && !this.isFinishAuth) {
        setTimeout(this.getCheckCache, 1000);
      }
    },
    /**
     * 获取授权二维码
     * @author waldon
     * @date 2020/9/17
     */
    /**
     * @description : 获取授权二维码
     * @author      : ADI
     * @Date        : 2021-05-21 17:26:35
     * @param        {*}
     * @return       {Promise}
     */
    async getBindQr() {
      this.isExpireQr = false;
      const params = {
        type: 1, // 公众号
        userType: 1,
      };
      const [err, res] = await bindingWx(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.qrImg = res.data.authPath;
      const expireTime = (5 * 60 - 5) * 1000; // 过期时间，增加5秒钟的误差
      this.expireQrTimer = setTimeout(() => {
        this.isExpireQr = true;
      }, expireTime);
      this.getCheckCache();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.isFinishScan = false;
      this.isFinishAuth = false;
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.authQrDialog {
  .infoPart {
    font-size: 16px;
    .infoTitle {
      font-weight: bold;
      color: $color-00;
      text-align: center;
    }
    .imgBox {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 20px auto;
      color: #247af3;
      img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
      .finishIcon {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 100px;
        height: 100px;
        margin-right: 0;
        fill: currentColor;
      }
      .refreshQrBox {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        display: flex;
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: white;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.6);
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        .refreshTip {
          width: 6em;
          text-align: center;
          flex: 0 0 auto;
        }
      }
    }
    .infoTip {
      color: $color-53;
      text-align: center;
    }
  }
}
</style>

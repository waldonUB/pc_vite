<!--
 * @Author       : ADI
 * @Date         : 2021-06-16 15:55:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:28:11
-->
<template>
  <div class="getPrice_poup" v-if="isShowPricePoup">
    <div class="price_poupBox">
      <global-ts-svg-icon class="icon closeIcon" name="icon-shanchu" @click="close(1)"></global-ts-svg-icon>
      <p class="title">产品调价通知函</p>
      <div class="toBuyBtn" @click="close(3)">前往购买</div>
      <div class="knowBtn" @click="close(2)">我知道了</div>
    </div>
  </div>
</template>

<script>
import { format } from '@/utils';
import { checkPriceNotify, confirmPriceNotify } from '@/api/modules/component/get-price-poup';

export default {
  name: 'get-price-poup',
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  async created() {
    const date = new Date();
    if (!format.isOverDate('2021/6/17')) {
      this.getPricePoup();
    }
  },
  mounted() {},
  methods: {
    /**
     * 获取提价弹窗
     * @author guoyijie
     * @date 2021-06-07
     * @returns
     */
    async getPricePoup() {
      const [err, res] = await checkPriceNotify();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.resolve(err);
      }
      this.isShowPricePoup = res.data.notify;
      if (this.isShowPricePoup) {
        this.$utils.FdpLog('yx_portal_popup_expo', {
          yx_free_text_0: '增加：2021.6提价通知弹窗',
          yx_app_terminal: 1,
        });
      } else {
        return Promise.resolve(res);
      }
    },
    /**
     * 记录提价弹窗
     * @author guoyijie
     * @date 2021-06-07
     * @param {*} type(1:点击关闭；2.我知道了；3.点击跳转)
     * @returns
     */
    async close(type) {
      const [err, res] = await confirmPriceNotify();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isShowPricePoup = false;
      if (type === 3) {
        window.open('https://i.fkw.com/marketing/yx.jsp', '_blank');
      } else {
        this.$utils.FdpLog('yx_portal_popup_click', {
          yx_free_text_0: '增加：2021.6提价通知弹窗',
          yx_app_terminal: 1,
          yx_free_text_1: type === 1 ? '点击关闭' : '我知道了',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.getPrice_poup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  .price_poupBox {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 825px;
    height: 567px;
    margin-top: -283px;
    margin-left: -412px;
    background: url('~@/assets/image/comm/operateTip/pricePoup.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin-top: 58px;
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      text-align: center;
    }
    .closeIcon {
      position: absolute;
      top: 22px;
      right: 22px;
      width: 2.2em;
      height: 2.2em;
      vertical-align: -0.15em;
      cursor: pointer;
      fill: #6eb7f6;
    }
    .toBuyBtn {
      position: absolute;
      bottom: 78px;
      left: 293px;
      width: 240px;
      height: 50px;
      font-size: 16px;
      font-weight: bold;
      line-height: 50px;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
      background: linear-gradient(-90deg, #319af2, #368df2);
      border-radius: 25px;
      box-shadow: 0 3px 10px 0 rgba(52, 139, 243, 0.4);
      &:hover {
        background: linear-gradient(-90deg, #44a8fe, #3897ff);
      }
    }
    .knowBtn {
      position: absolute;
      bottom: 42px;
      left: 380px;
      margin-top: 20px;
      font-size: 16px;
      color: #bebebe;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #368df2;
      }
    }
  }
}
</style>

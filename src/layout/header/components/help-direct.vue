<!--
 * @Author       : ADI
 * @Date         : 2021-05-13 14:42:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 15:58:53
-->
<template>
  <div class="helpBox">
    <div class="tooltipsBox" v-if="!isHideMoreTip && isShowCrmCode">了解更多功能</div>
    <div class="contentBox">
      <div class="iconBox" @mouseenter="hideMoreTip">
        <global-ts-svg-icon class="icon helpIcon" name="icon-dingbudaohang_kefu" />
      </div>
      <div class="helpInfo helpInfoBox">
        <div class="helpArrow"></div>
        <div class="acountBox flex">
          <!-- 销售二维码start -->
          <div class="crmCodeImgBox flexItem" v-if="isShowCrmCode">
            <div class="crmMoreTip">了解更多功能<br />可咨询您的产品顾问</div>
            <img :src="crmCodeImg" />
            <div class="crmTip">微信扫一扫立即咨询</div>
          </div>
          <!-- 销售二维码end -->
          <div class="featureList flexItem">
            <div class="feature-item commNav" @click="toURL('qiyuChatUrl', 'ask_click')">
              <global-ts-svg-icon class="icon tShuuserName" name="icon-zaixianzixun" />
              在线咨询
            </div>
            <div class="feature-item commNav" @click="toURL('functionalSuggestionUrl', 'suggest_click')" v-if="!isOem">
              <global-ts-svg-icon class="icon tShuuserName" name="icon-gongnengjianyi" />
              功能建议
            </div>
            <div class="feature-item commNav" @click="toURL('portalHelpUrl', 'help_click')" v-if="!isOem">
              <global-ts-svg-icon class="icon tShuuserName" name="icon-bangzhuzhongxin" />
              帮助中心
            </div>
            <div class="feature-item commNav" @click="toURL('allianceUrl')" v-if="!isOem">
              <global-ts-svg-icon class="icon tShuuserName" name="icon-dailizixun" />
              代理咨询
            </div>
            <div class="feature-item commNav showqrCode" @mouseenter="showPublicCode">
              <global-ts-svg-icon class="icon tShuuserName" name="icon-guanzhu" />
              微信关注
              <div :class="[isShowCrmCode ? 'nearQrCodeBox' : 'qrcodeBox']">
                <div class="qrcode">
                  <img :src="publicCode" />
                  <p class="qrcodeTip">微信扫描二维码</p>
                  <p class="qrcodeTip">关注客户通资讯</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { FdpLog, logDog, postMessage } from '@/utils';
import { toURL } from '../utils/index.js';
import { getCrmServiceCode } from '@/api/modules/utils/sale';

export default {
  name: 'help-box',
  components: {},
  props: {},
  data() {
    return {
      isHideMoreTip: false, // 是否隐藏直销的帮助按钮气泡提示，这里的逻辑是，如果用户有销售二维码，并且hover过帮助按钮，则隐藏
      isShowCrmCode: false, // 是否显示销售二维码
      isHasSale: false, // 是否有绑定销售，注意：未绑定销售时，也有可能会显示销售二维码
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      addressUrl: state => state.globalData.addressUrl,
      logoSrc: state => state.globalData.logoSrc,
      publicCode: state => state.globalData.publicCode,
    }),
    toURL() {
      return toURL;
    },
    isShowHelp() {
      return !!this.addressUrl.portalHelpUrl;
    },
  },
  watch: {},
  created() {
    this.getShowMoreTip();
    this.getShowCrmCode().then(() => {
      if (this.isShowCrmCode && !this.isHideMoreTip) {
        // 曝光气泡
        FdpLog('yx_helptips_expo', {
          yx_free_text_0: this.isHasSale ? '有绑定销售' : '无绑定销售',
        });
      }
    });
    this.$store.dispatch('user/getTsStaffExtraListByParam');
  },
  mounted() {},
  methods: {
    /**
     * 判断是否显示销售二维码，并获取二维码图
     * @author lymn
     * @date 2020-11-30
     */
    async getShowCrmCode() {
      const [err, res] = await getCrmServiceCode();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err.msg);
      }
      this.isShowCrmCode = res.data.isShowCrmCode;
      this.crmCodeImg = res.data.crmCode;
      this.isHasSale = res.data.isHasSale;
      return Promise.resolve(res.data);
    },
    /**
     * 隐藏显示更多气泡提示
     * @author lymn
     * @date 2020-11-26
     */
    hideMoreTip() {
      FdpLog('yx_portal_topservice_expo');
      this.isHideMoreTip = true;
      localStorage.setItem('isHideMoreTip', true);
      let freeText = '';
      if (this.isShowCrmCode) {
        freeText = this.isHasSale ? '有绑定销售' : '无绑定销售';
      } else {
        freeText = '不显示二维码';
      }
      FdpLog('yx_helpicon_hover', {
        yx_free_text_0: freeText,
      });
    },
    /**
     * 是否显示更多气泡提示
     * @author lymn
     * @date 2020-11-26
     * @param {Boolean} param
     * @return {Boolean} return
     */
    getShowMoreTip() {
      const isHideMoreTip = localStorage.getItem('isHideMoreTip');
      if (isHideMoreTip != null) {
        // 不显示气泡
        this.isHideMoreTip = true;
      }
    },
    /**
     *显示易销二维码
     *
     * @author guoyijie
     * @date 2020-04-27
     */
    showPublicCode() {
      FdpLog('yx_portal_topservice_click', {
        yx_free_text_0: '微信关注',
      });
      logDog('notice_yx_show');
    },
  },
};
</script>

<style lang="scss" scoped>
$helpInfoAbsoluteRight: -15px;

/* 帮助中心 */
.helpBox {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 40px;
  line-height: 24px;
  color: $color-b2;
  text-align: center;
  :hover {
    .helpIcon {
      color: #247af3;
    }
  }
  .icon {
    cursor: pointer;
  }
  .tooltipsBox {
    position: absolute;
    top: -3px;
    right: 35px;
    width: auto;
    padding: 8px;
    font-size: 14px;
    line-height: 14px;
    color: $color-ff;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 2px;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.07);
    &::after {
      position: absolute;
      right: -7px;
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 7px solid rgba(0, 0, 0, 0.8);
      content: '';
    }
  }
  .iconBox {
    position: relative;
    width: 24px;
    height: 100%;
    &::before {
      /* extra hover area */
      position: absolute;
      top: 100%;
      right: $helpInfoAbsoluteRight;
      width: 55px;
      height: 14px;
      cursor: pointer;
      content: '';
    }
  }
  .helpIcon {
    font-size: 24px;
    color: #999999;
  }
  .feature-item {
    display: flex;
    align-items: center;
    margin-top: 16px;
    font-size: 14px;
    line-height: 14px;
    color: $color-53;
    &:nth-last-child(1) {
      padding-bottom: 24px;
    }
    .num {
      font-size: 14px;
      color: #ff0000;
      align-items: center;
    }
    &:first-child {
      margin-top: 0;
    }
  }
  .commNav {
    &:hover {
      color: #247af3;
      cursor: pointer;
    }
    .icon {
      font-size: 20px;
    }
  }
  .contentBox {
    &:hover {
      .helpInfo {
        height: 244px;
        overflow: visible;
      }
    }
  }
  .helpInfo {
    position: absolute;
    right: $helpInfoAbsoluteRight;
    z-index: $zindex-base;
    width: auto;
    height: 0;
    padding: 0 8px;
    margin-top: 6px;
    overflow: hidden;
    transition: all 0.3s;
    .helpArrow {
      position: relative;
      top: 1px;
      z-index: $zindex-base;
      float: right;
      width: 18px;
      height: 9px;
      margin-right: 10px;
      background: url('~@/assets/image/comm/arrow.png') no-repeat;
      background-size: 100% 100%;
    }
    .acountBox {
      position: relative;
      float: left;
      padding: 0;
      font-size: 14px;
      font-weight: 400;
      color: #535353;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      .crmCodeImgBox {
        width: 144px;
        padding-top: 24px;
        overflow: hidden;
        cursor: default;
        background: #e9f1fd;
        border-radius: 4px 0 0 4px;
        img {
          width: 110px;
          height: 110px;
          margin: 12px auto;
        }
        .crmMoreTip {
          font-size: 13px;
          line-height: 20px;
        }
        .crmTip {
          font-size: 12px;
          line-height: 12px;
        }
      }
      .featureList {
        width: 134px;
      }
    }
  }
  .nearQrCodeBox {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 144px;
    height: 100%;
    cursor: default;
    background: #e9f1fd;
    border-radius: 4px 0 0 4px;
    box-sizing: border-box;
    .qrcode {
      img {
        width: 110px;
        height: 110px;
        margin: 40px auto 12px;
      }
      .qrcodeTip {
        line-height: 20px;
      }
    }
  }
  .showqrCode {
    &:hover {
      .nearQrCodeBox {
        display: block;
      }
      .qrcodeBox {
        .qrcode {
          height: 180px;
        }
      }
    }
  }
  .qrcodeBox {
    position: absolute;
    top: 90px;
    left: -150px;
    width: 100%;
    height: 80%;
    padding: 0 10px;
    cursor: default;
    .qrcode {
      position: absolute;
      top: 0;
      left: 0;
      width: 144px;
      height: 0;
      overflow: hidden;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      box-shadow: 0 5px 20px 0 rgba(51, 57, 85, 0.25);
      transition: all 0.3s;
    }
  }
  .qrcode {
    img {
      width: 120px;
      height: 120px;
      margin: 12px 12px 0;
    }
  }
  p {
    font-size: 12px;
    line-height: 16px;
    color: rgba(102, 102, 102, 1);
    text-align: center;
  }
}
.directSale {
  .helpBox {
    .feature-item {
      padding: 24px 24px 0;
      margin: 0;
      &:nth-last-child(1) {
        padding-bottom: 24px;
      }
    }
  }
}
</style>

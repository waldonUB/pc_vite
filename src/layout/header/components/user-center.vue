<!--
 * @Author       : ADI
 * @Date         : 2021-05-13 14:58:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-05 10:01:57
-->
<template>
  <div class="userInfoHead" v-if="!showPanel">
    <div class="headImg">
      <global-ts-svg-icon class="icon userIcon" name="icon-dingbudaohang_yonghu" />
    </div>
    <div class="accoutInfo accoutInfoBox" v-if="isOem">
      <div class="aountArrow"></div>
      <div class="acountBox">
        <div class="nameInfoWrap">
          <div class="conpanyName ellispsis">企业帐号: {{ userInfo.acctInfo.aacct }}</div>
          <div class="staffName ellispsis">成员帐号: {{ userInfo.staffInfo.sacct }}</div>
        </div>
        <div class="featureList">
          <div class="feature-item commNav" @click="toURL('portalHost')">
            <global-ts-svg-icon class="icon tShuuserName" name="icon-qiye" />
            <span>企业中心</span>
          </div>
        </div>
        <div class="signOut commNav" @click="logOutAccout">
          <global-ts-svg-icon class="icon tShuuserName" name="icon-likai" />
          <span>退出登录</span>
        </div>
      </div>
    </div>
    <div class="accoutInfo accoutInfoBox" v-show="isDev">
      <div class="aountArrow"></div>
      <div class="acountBox">
        <div class="nameInfoWrap">
          <div class="conpanyName ellispsis">{{ userInfo.acctInfo.aacct }}</div>
          <div class="staffName ellispsis">{{ userInfo.staffInfo.sacct }}</div>
        </div>
        <div class="featureList">
          <div class="feature-item commNav" @click="toURL('portalHost', 'companyCenter_click')">
            <div>
              <global-ts-svg-icon class="icon tShuuserName" name="icon-qiyezhongxin" />
              进入企业中心
            </div>
          </div>
          <div
            class="feature-item commNav"
            @click="$router.push({ name: 'employeeMange' })"
            v-if="isSuperUpperAdmAndNotOem"
          >
            <div>
              <global-ts-svg-icon class="icon tShuuserName" name="icon-yuangongguanli" />
              成员管理
            </div>
          </div>
          <div
            class="feature-item commNav"
            @click="toURL('orderManagerUrl', 'order_click')"
            v-if="isSuperUpperAdmAndNotOem"
          >
            <div>
              <global-ts-svg-icon class="icon tShuuserName" name="icon-dingdan" />
              我的订单
            </div>
            <span class="num">{{ orderCount }}</span>
          </div>
          <div
            class="feature-item commNav"
            @click="toURL('couponUrl', 'coupUrl_click')"
            v-if="isSuperUpperAdmAndNotOem"
          >
            <div>
              <global-ts-svg-icon class="icon tShuuserName" name="icon-xianjinquan" />
              现金券
            </div>
            <span class="num">{{ couponCount }}</span>
          </div>
        </div>
        <div class="signOut commNav" @click="logOutAccout">
          <global-ts-svg-icon class="icon tShuuserName" name="icon-likai" />
          退出登录
        </div>
      </div>
    </div>
  </div>
  <div class="opPanel" v-else></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { toURL } from '../utils/index.js';
import { postMessage, confirm } from '@/utils';
import { getOrderInfo } from '@/api/modules/utils/sale';
import importJsCss from 'import-js-css';

export default {
  name: 'user-center',
  components: {},
  props: {},
  data() {
    return { couponCount: 0, orderCount: '', isDev: process.env.NODE_ENV !== 'production' };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
      addressUrl: state => state.globalData.addressUrl,
    }),
    ...mapGetters({
      isSuperUpperAdm: 'user/isSuperUpperAdm',
    }),
    toURL() {
      return toURL;
    },
    isSuperUpperAdmAndNotOem() {
      return !this.isOem && this.isSuperUpperAdm;
    },
    showPanel() {
      return !(this.isOem || this.isDev);
    },
  },
  watch: {},
  created() {
    this.isSuperUpperAdm && this.getOrderInfo();
    this.loadDirectHeader();
  },
  mounted() {},
  methods: {
    /**
     *获取点单和优惠卷数
     *
     * @author guoyijie
     * @date 2020-04-27
     */
    async getOrderInfo() {
      const [err, res] = await getOrderInfo();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return;
      }
      this.orderCount = res.data.orderCount;
      this.couponCount = res.data.couponCount;
    },
    /**
     *退出当前账号
     * @author tomato
     * @date 2020-04-10
     */
    logOutAccout() {
      confirm('是否退出当前帐号？', '退出登录').then(async action => {
        if (action == 'confirm') {
          this.$store.dispatch('user/logout');
        }
      });
    },
    /**
     * @description : 直销公司公共组件。todo: 现在dev用不了，公司组件是jsp文件，后续看看有没有提供npm包提供给dev用
     * @author      : ADI
     * @Date        : 2021-06-23 14:23:25
     * @param        {*}
     * @return       {*}
     */
    loadDirectHeader() {
      if (!this.showPanel) {
        return;
      }
      // window.HOME_DOMAIN = 'fff.com';
      const jqUrl = `${this.$utils.host}/js/jquery-core.src.js`;
      importJsCss(
        'header',
        {
          header: {
            script: [jqUrl, 'http://fe.aaadns.com/header_1_1/js/header.src.js?v=202011041447'],
            link: 'http://fe.aaadns.com/header_1_1/css/header.src.css?v=202102251404',
          },
        },
        true,
      )
        .then(() => {
          console.log('ADI-LOG => load success');
        })
        .catch(e => {
          console.log('ADI-LOG => error', e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.userInfoHead {
  position: relative;
  display: inline-block;
  height: 24px;
  margin-right: 40px;
  &:hover {
    .userIcon {
      color: #247af3;
    }
  }

  /* extra hover area */
  &::before {
    position: absolute;
    top: 100%;
    right: -15px;
    width: 55px;
    height: 14px;
    cursor: pointer;
    content: '';
  }
  .headImg {
    display: inline-block;
    width: 24px;
    height: 24px;
    overflow: hidden;
    color: $color-b2;
    cursor: pointer;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .userIcon {
      font-size: 24px;
    }
  }
  .accoutInfo {
    position: absolute;
    right: -15px;
    z-index: $zindex-base;
    width: 120px;
    height: 0;
    padding: 0 8px;
    margin-top: 6px;
    overflow: hidden;
    transition: all 0.3s;
    &.isShowTime {
      height: auto;
    }
    .aountArrow {
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
      float: left;
      padding: 5px 16px;
      font-size: 14px;
      font-weight: 400;
      color: #535353;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      .nameInfo {
        position: relative;
        width: 62px;
        height: 40px;
        padding-left: 26px;
        overflow: hidden;
        line-height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-bottom: 1px solid #eeeeee;
        .tShuuserName {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0%, -50%);
        }
        &:hover {
          color: #247af3;
        }
      }
      .logOut {
        position: relative;
        height: 40px;
        padding-left: 26px;
        overflow: hidden;
        line-height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        .tShuLogOut {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(0%, -50%);
        }
        &:hover {
          color: #247af3;
        }
      }
    }
    &.accoutInfoBox {
      .commNav {
        cursor: pointer;
        &:hover {
          color: #247af3;
        }
        .icon {
          font-size: 20px;
        }
      }
      .acountBox {
        width: 100%;
        padding: 23px 0 0;
        box-sizing: border-box;
      }
      .nameInfoWrap {
        position: relative;
        width: 100%;
        padding: 0 20px 24px;
        overflow: hidden;
        // font-family: 'Microsoft YaHei';
        border-bottom: 1px solid $color-ee;
        box-sizing: border-box;
        .conpanyName {
          // font-family: 'Microsoft YaHei';
          font-size: 14px;
          color: $color-53;
        }
        .staffName {
          margin-top: 11px;
          font-size: 14px;
          color: $color-b2;
        }
      }
      .signOut {
        display: flex;
        padding: 16px 20px;
        font-size: 14px;
        line-height: 14px;
        color: $color-53;
        align-items: center;
      }
      .featureList {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid $color-ee;
      }
    }
  }
  &:hover {
    .accoutInfo {
      height: 109px;
      &.accoutInfoBox {
        width: 210px;
        height: 295px;
      }
    }
  }
  .feature-item {
    display: flex;
    align-items: center;
    margin-top: 16px;
    font-size: 14px;
    line-height: 14px;
    color: $color-53;
    .num {
      font-size: 14px;
      color: #ff0000;
      align-items: center;
    }
    &:first-child {
      margin-top: 0;
    }
  }
}
.directSale {
  .userInfoHead {
    .accoutInfo {
      &.accoutInfoBox {
        .acountBox {
          padding: 17px 0 0;
        }
        .nameInfoWrap {
          padding: 0 25px 20px;
        }
        .featureList {
          padding: 24px;
        }
      }
    }
    &:hover {
      .accoutInfo.accoutInfoBox,
      .helpInfo.helpInfoBox {
        height: 380px;
      }
    }
    .feature-item {
      display: flex;
      margin-top: 24px;
      justify-content: space-between;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}

/* 直销顶部组件样式 */
.opPanel {
  .topbar-item-manageCenter {
    .topbar_btn {
      .topbar_btn_text {
        display: none;
      }
    }
    &.topbar-item {
      .f-portrait {
        width: auto;
        height: 36px;
        margin-right: 20px;
        line-height: 0;
      }
    }
  }
}

/* 直销顶部组件样式 */
</style>

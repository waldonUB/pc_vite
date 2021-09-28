<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:37:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 09:58:42
-->
<template>
  <global-ts-card-box>
    <template v-slot:card-box-head>
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="topTitle">
            <global-ts-tool-tips
              offset="10"
              class="item"
              effect="dark"
              content="拥有带企业品牌LOGO和名称的小程序，打造属于您自己的品牌"
              placement="top-start"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bianzu"></use>
              </svg>
            </global-ts-tool-tips>
            微信授权
          </div>
        </template>
      </global-ts-header>
    </template>
    <template v-slot:card-box-body>
      <global-ts-warn-tips v-if="!isAuthToClick">
        <p class="warnTipsContent" slot="content">
          由于微信将在春节期间暂停小程序代码审核，本平台将于2020年1月19日起停止审核提交，并于2月1日早上10:00恢复，如有带来不便，望见谅。
        </p>
      </global-ts-warn-tips>
      <div class="authorizeBox">
        <div class="">
          <p>公众号</p>
          <div class="headInfo flex flex-vc">
            <a class="headImg refreshWrap">
              <a class="refreshBox">
                <el-button class="refreshBtn" icon="el-icon-refresh" @click="refreshAuth(1)">刷新授权信息</el-button>
              </a>
              <img :src="officialHeadImg" />
            </a>
            <div class="authorize_detail_info" v-if="hasBindOfficial">
              <p class="detail_info">{{ officialInfo.mpName }}</p>
              <div class="flex flex-vc setDomains">
                <global-ts-dropdown
                  v-if="showUnbind"
                  bindClass="bactchBtnBox"
                  placement="bottom"
                  @handleClick="downItemClick"
                  :downData="downData"
                >
                  <template v-slot:link>
                    <global-ts-button class="materialBtn operateBtn" type="others" size="small" @click="choose(1)">
                      解除授权
                    </global-ts-button>
                  </template>
                </global-ts-dropdown>
                &nbsp;
                <global-ts-button size="small" @click="sureSubmitRecord">配置域名 </global-ts-button>
                <span class="yourTxt" v-if="mpTxtName">({{ mpTxtName }})</span>
              </div>
            </div>
            <div class="authorize_detail_info" v-else>
              <p class="detail_info">您尚未授权公众号</p>
              <global-ts-button size="small" @click="sureSubmitRecord">立即授权 </global-ts-button>
            </div>
          </div>
        </div>
        <div class="">
          <p>小程序</p>
          <div class="headInfo flex flex-vc">
            <a class="headImg refreshWrap">
              <a class="refreshBox">
                <el-button class="refreshBtn" icon="el-icon-refresh" @click="refreshAuth(2)">刷新授权信息</el-button>
              </a>
              <img :src="mpHeadImg" />
            </a>
            <div class="authorize_detail_info" v-if="hasBindMp">
              <p class="detail_info">{{ mpInfo.appName }}</p>
              <div class="buttonBox flex flex-vc">
                <global-ts-button v-if="false" size="small" @click="sureSubmitRecord">修改信息 </global-ts-button>
                <global-ts-dropdown
                  v-if="showUnbind"
                  bindClass="bactchBtnBox"
                  placement="bottom"
                  @handleClick="downItemClick"
                  :downData="downData"
                >
                  <template v-slot:link>
                    <global-ts-button class="materialBtn operateBtn" type="others" size="small" @click="choose(2)">
                      解除授权
                    </global-ts-button>
                  </template>
                </global-ts-dropdown>
                &nbsp;
                <global-ts-button
                  class="syncchronBtn ml_10"
                  size="small"
                  v-if="isShowSyncMsgBtn"
                  :type="synchrizeStatus == 1 ? 'black' : 'primary'"
                  :disabled="synchrizeStatus == 3 || synchrizeStatus == 1"
                  @click="syncMsgTemp"
                  >同步消息模板
                </global-ts-button>
                <div class="syncchronResult flex flex-vc" v-if="synchrizeStatus != 0 && isShowSyncMsgBtn">
                  <span :class="{ noFailReason: !isShowFailReason }" class="ml_10">{{ synchrizeStatusInfo }}</span>
                  <global-ts-tool-tips :content="synchrizeReason" v-if="isShowFailReason" class="ml_10">
                    <global-ts-button type="textGreen" size="small">查看原因</global-ts-button>
                  </global-ts-tool-tips>
                </div>
              </div>
            </div>
            <div class="authorize_detail_info" v-else>
              <p class="detail_info">您尚未授权小程序</p>
              <global-ts-button size="small" @click="sureSubmitRecord">立即授权 </global-ts-button>
            </div>
          </div>
        </div>
        <div class="">
          <p>开放平台</p>
          <div class="headInfo flex flex-vc">
            <div class="headImg">
              <img :src="plantFormHeadImg" />
            </div>
            <div class="authorize_detail_info" v-if="hasBindPlantform">
              <p class="detail_info">{{ bindPlantFormStatus }}</p>
              <global-ts-button size="small" @click="reAuth">重新绑定 </global-ts-button>
            </div>
            <div class="authorize_detail_info" v-else-if="showBindBtn">
              <p class="detail_info">您尚未绑定开放平台</p>
              <global-ts-button size="small" @click="reAuth">立即绑定 </global-ts-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-button v-if="isShowCommitBtn" @click="publishMp">发布小程序 </global-ts-button>
      <div v-else>
        <global-ts-button v-if="!hasPublish" @click="submitCheck">提交审核 </global-ts-button>
        <global-ts-button v-if="!showUpdateApp && hasPublish" :disabled="true" type="black">
          已完成发布
        </global-ts-button>
        <global-ts-tool-tips
          v-if="showUpdateApp && hasPublish"
          class="item"
          effect="dark"
          content="当前小程序不是最新版，请更新（更新中不会影响现在小程序的使用）"
          placement="top"
          :manual="tooltipMmanual"
          :value="tooltipMmanual"
        >
          <global-ts-button @click="submitCheck">发布新版小程序 </global-ts-button>
        </global-ts-tool-tips>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import defaultIMG from '@/assets/image/defaultImg.png';
import plantFormIMG from '@/assets/image/plantForm.png';
import authComm from '../../mixins/auth-comm/index.vue';
import { verfifyDefault, getVerifyStatus } from '../../config';
import { mapGetters, mapState } from 'vuex';
import { confirm, format, getUrlParam, cookie, poll, newVersionMinAppPopupCookie } from '@/utils';
import {
  getTsUserWxAuth,
  releaseApp,
  submitCheck,
  unbindAuthInfo,
  syncUserWxTemp,
  checkSyncStatusNow,
  refreshWxAuth,
  bindingWxOpen,
} from '@/api/modules/views/setting-center/bind-mp';
import { Button } from 'element-ui';

export default {
  name: 'main-frame',
  mixins: [authComm],
  components: { [Button.name]: Button },
  props: {
    isAuthToClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showUpdateApp: false, // 是否有新版小程序还没有发布
      tooltipMmanual: false, // el-tooltip 手动控制模式
      hasPublish: false,
      showUnbind: false,
      synchrizeStatus: 0, //同步状态,0表示未同步，1同步成功，2同步失败，3同步中
      verifyStatus: verfifyDefault.verfuifyFail.value, //审核状态
      synchrizeReason: '',
      officialInfo: {
        mpName: '',
        mpHeadImg: '',
        mpAppid: '',
      },
      mpInfo: {
        appName: '',
        appHeadImg: '',
        appAppid: '',
      },
      plantFormInfo: {
        isBindOpen: false,
      },
      mpTxtName: '',
      appId: '', //小程序的appId
      mpAppid: '',
      choosing: 1, //正在选择 1.公众号  2.小程序
      downData: [
        // 批量按钮列表
        {
          type: 1,
          name: '正常解绑',
        },
        {
          type: 2,
          name: '强制解绑',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userTicket: state => state.globalData?.userTicket,
      addressUrl: state => state.globalData.addressUrl,
    }),
    isShowCommitBtn() {
      return this.$parent.isBackToPublish && this.verifyStatus == verfifyDefault.success.value;
    },
    isShowSyncMsgBtn() {
      return this.verifyStatus == verfifyDefault.success.value || this.verifyStatus == verfifyDefault.publish.value;
    },
    showSyncBtn() {
      return this.hasBindOfficial && this.hasBindMp && this.hasBindPlantform;
    },
    showBindBtn() {
      return this.isShowBindBtn;
    },
    isShowFailReason() {
      return this.synchrizeStatus == 2 && this.synchrizeReason;
    },
    synchrizeStatusInfo() {
      switch (this.synchrizeStatus) {
        case 0:
          return '未同步';
        case 1:
          return '同步成功';
        case 2:
          return '同步失败';
        case 3:
          return '同步中';
        default:
          return '';
      }
    },
    isShowBindBtn() {
      const isAvoidCheck = getUrlParam(document.URL, 'isAvoidCheck');
      return !isAvoidCheck;
    },
    hasBindOfficial() {
      if (this.officialInfo.mpAppid) {
        return true;
      }
      return false;
    },
    hasBindMp() {
      if (this.mpInfo.appAppid) {
        return true;
      }
      return false;
    },
    hasBindPlantform() {
      if (this.plantFormInfo.isBindOpen) {
        return true;
      }
      return false;
    },
    officialHeadImg() {
      return this.hasBindOfficial ? this.officialInfo.mpHeadImg : defaultIMG;
    },
    mpHeadImg() {
      return this.hasBindMp ? this.mpInfo.appHeadImg : defaultIMG;
    },
    plantFormHeadImg() {
      return this.hasBindPlantform ? plantFormIMG : defaultIMG;
    },
    bindPlantFormStatus() {
      return this.hasBindPlantform ? '已绑定' : '未绑定';
    },
  },
  watch: {},
  async created() {
    this.officialInfo = {
      ...{
        mpName: '',
        mpHeadImg: '',
        mpAppid: '',
      },
    };
    this.mpInfo = {
      ...{
        appName: '',
        appHeadImg: '',
        appAppid: '',
      },
    };
    this.plantFormInfo = {
      ...{
        isBindOpen: false,
      },
    };
    this.mpTxtName = '';
    this.hasPublish = false;
    this.showUnbind = false;
    const [err, response] = await getTsUserWxAuth();
    if (err) {
      this.$utils.postMessage({
        type: 'error',
        message: err.msg || '网络错误，请稍候重试',
      });
      return Promise.reject(err);
    }
    this.showUpdateApp = response.data.showUpdateApp;
    const judgeData = response.data.tsUserWxInfo || {};
    this.appId = judgeData.appAppid || '';
    this.mpAppid = judgeData.mpAppid || '';
    this.mpTxtName = judgeData.mpTxtName;
    if (Object.keys(judgeData).length > 0) {
      ['officialInfo', 'mpInfo', 'plantFormInfo'].forEach(ele => {
        const targetSet = this[ele];
        const keys = Object.keys(targetSet);
        keys.forEach(ele_2 => {
          targetSet[ele_2] = judgeData[ele_2];
        });
      });
      if (judgeData.appStatus == 1) {
        this.hasPublish = true;
      }

      this.showUnbind = true;
      this.synchrizeStatus = judgeData.tempSyncStatus;
      if (response.data.needHint) {
        this.synchrizeReason = response.data.hintMsg;
      }
      // 获取审核状态
      this.verifyStatus = getVerifyStatus(judgeData);
    }

    if (this.showUpdateApp && !cookie(`ts_showUpdateApp${this.userTicket}`)) {
      this.tooltipMmanual = true;
      cookie(`ts_showUpdateApp${this.userTicket}`, true, {
        expires: format.addDate(new Date(), 7, 'days'),
      });

      // 和pc默认的消息弹窗一致(this.$utils.postMessage)，5s后隐藏
      setTimeout(() => {
        this.tooltipMmanual = false;
      }, 5000);
    }
  },
  mounted() {},
  methods: {
    /**
     * 解除绑定下拉
     * @author han
     * @date 2021-02-05
     */
    downItemClick(item) {
      if (item.type == 1) {
        this.dissAuth(this.choosing);
      } else {
        confirm('强制解绑仅适用于您的公众号或小程序已注销的场景，建议您慎重操作', '强制解绑确认').then(() => {
          this.forceToUnbind(this.choosing);
        });
      }
    },
    /**
     * 正在选择的属性
     * @author han
     * @date 2021-02-05
     * @param {Number} type - 1. 公众号  2. 小程序
     */
    choose(type) {
      this.choosing = type;
    },
    /**
     * 强制解绑
     * @author han
     * @date 2021-02-05
     * @param {Number} type - 1：小程序、2：公众号
     */
    async forceToUnbind(choose) {
      const params = {
        type: choose,
        appId: choose == 1 ? this.mpAppid : this.appId,
      };
      const [err, res] = await unbindAuthInfo(params);
      let message = '',
        type = '';
      if (err) {
        message = err.msg || '网络错误，请稍候重试';
        type = 'error';
        return Promise.reject(err);
      } else {
        message = '操作成功';
        type = 'success';
        this.plantFormInfo.isBindOpen = false;
        this.isShowBindBtn = true;
        this.hasPublish = false;
        choose == 1 ? (this.officialInfo.mpAppid = '') : (this.mpInfo.appAppid = '');
      }
      this.$utils.postMessage({
        type,
        message,
      });
    },
    /**
     *发布小程序
     * @author tomato
     * @date 2020-04-10
     */
    async publishMp() {
      const [err, res] = await releaseApp();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.setAuthTip();
      window.location.reload(true);
    },
    /**
     *切换页面到授权显示页
     * @author tomato
     * @date 2020-04-10
     */
    sureSubmitRecord() {
      this.$parent.changePage(2);
    },
    /**
     * 同步消息模板
     * @author tomato
     * @date 2020-05-19
     */
    async syncMsgTemp() {
      this.synchrizeStatus = 3;
      const [err, res] = await syncUserWxTemp();
      if (err) {
        this.synchrizeStatus = 2;
        return Promise.reject(err);
      }
      poll({
        name: 'getIsFinishBindMsgTmp',
        time: 1000,
        delay: 500,
        poll: async (next, step) => {
          const [err, response] = await checkSyncStatusNow();
          if (err) {
            return Promise.reject(err);
          }
          const judgeData = response.data;
          // 同步中
          if (judgeData.tempSyncStatus == 3) {
            next(1000);
          } else {
            this.synchrizeStatus = judgeData.tempSyncStatus;
            if (judgeData.needHint) {
              this.synchrizeReason = response.data.needMsg;
            } else {
              this.synchrizeReason = '';
            }
          }
        },
      });
    },
    /**
     *提交审核
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    submitCheck() {
      const isAvoidCheck = getUrlParam(document.URL, 'isAvoidCheck');
      if (!this.hasBindOfficial || !this.hasBindMp) {
        this.$utils.postMessage({
          type: 'error',
          message: '请授权完毕后再进行审核操作!',
        });
        return;
      }
      confirm('提交后，将无法修改当前已授权的信息', '确认提交审核？').then(async () => {
        const [err, res] = await submitCheck({
          isAvoidCheck: isAvoidCheck,
          loadingType: 'han',
        });
        if (err) {
          return Promise.reject(err);
        }
        cookie(`${newVersionMinAppPopupCookie}`, null);
        this.$parent.changePage(3);
      });
    },
    /**
     *解除授权
     * @author tomato
     * @date 2020-04-10
     * @param {number} [type=1]1为公众号，2为小程序
     */
    dissAuth(type = 1) {
      // 公众号
      let openUrl = this.addressUrl.unbindMpHelpUrl;

      // 小程序
      if (type === 2) {
        openUrl = this.addressUrl.unbindAppHelpUrl;
      }

      window.open(openUrl);
    },
    /**
     * 刷新授权信息
     * @author tomato
     * @date 2020-04-10
     * @param {*} type
     */
    async refreshAuth(type) {
      const [err, response] = await refreshWxAuth({
        type,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      switch (type) {
        case 1:
          console.log('this.officialInfo', this.officialInfo);
          this.$set(this.officialInfo, 'mpName', response.data.name);
          this.$set(this.officialInfo, 'mpHeadImg', response.data.headImg);
          break;
        case 2:
          console.log('this.mpInfo', this.mpInfo);
          this.$set(this.mpInfo, 'appName', response.data.name);
          this.$set(this.mpInfo, 'appHeadImg', response.data.headImg);
          break;
      }
      this.$utils.postMessage({
        type: 'success',
        message: '刷新成功',
      });
    },
    /**
     *开放平台重新授权
     * @author tomato
     * @date 2020-04-10
     */
    async reAuth() {
      const [err, res] = await bindingWxOpen();
      if (err) {
        // adi add
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.plantFormInfo.isBindOpen = true;

      this.$utils.postMessage({
        type: 'success',
        message: '已重新绑定开放平台！',
      });
      this.active = 2;
    },
  },
};
</script>

<style lang="scss" scoped>
.syncchronResult .noFailReason {
  white-space: nowrap;
}
.ml_10 {
  margin-left: 10px;
}
.authorizeBox {
  width: 600px;
  padding-top: 73px;
  margin: 0 auto;
  font-size: 14px;
  color: $color-53;
  .headInfo {
    margin-top: 20px;
    .headImg {
      display: block;
      width: 110px;
      height: 110px;
      margin: 0 10px;
      overflow: hidden;
      background: #eeeeee;
      border: none;
      border-radius: 50%;
      flex: 0 0 auto;
      &.refreshWrap {
        position: relative;
        &:hover {
          .refreshBox {
            display: flex;
          }
        }
      }
      .refreshBox {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        margin-left: 0;
        background: rgba(34, 34, 34, 0.7);
        justify-content: center;
        align-items: center;
        .refreshBtn {
          padding: 5px;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
          background-color: #5874d8;
          border: none;
        }
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .authorize_detail_info {
      margin-left: 20px;
      p {
        margin-bottom: 20px;
      }
      .setDomains {
        .yourTxt {
          margin-left: 10px;
        }
        .global-button {
          &:nth-child(n + 2) {
            margin-left: 10px;
          }
        }
      }

      /* .buttonBox {
        div {
          &:nth-child(n + 2) {
            margin-left: 10px;
          }
        }
      } */
    }
  }
  & > div {
    &:nth-child(n + 2) {
      margin-top: 40px;
    }
  }
}
</style>

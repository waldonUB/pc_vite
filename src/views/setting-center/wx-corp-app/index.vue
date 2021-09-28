<!--
 * @Description  : 企微设置
 * @Author       : turbo
 * @Date         : 2021-03-30 15:46:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 15:02:20
-->

<template>
  <div class="wxCorpApp">
    <global-ts-header v-if="currentTemp === 'wxCorpAppList'">
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          企微设置
        </div>
      </template>
    </global-ts-header>
    <component
      @completeSet="completeSet"
      :isPublishApp="isPublishApp"
      :hasSetCal="hasSetCal"
      :wxWorkCorpData.sync="wxWorkCorpData"
      :currentTemp.sync="currentTemp"
      ref="wxCorpAppTemp"
      :is="currentTemp"
      :key="currentTemp"
    >
    </component>
    <ts-sync-wx-corp-customer-dialog
      :isSetPwd.sync="isSetPwd"
      :pwd="initPwd"
      @sure="confirmSyncWxCorp"
      @syncWxWorkUserSuccess="syncWxWorkUserSuccess"
      :dialogVisible.sync="syncWxCorpCustomerDialogVisible"
    >
    </ts-sync-wx-corp-customer-dialog>
    <setPwdDialog @sure="setPwdSuccess" :dialogVisible.sync="setPwdDialogVisible"> </setPwdDialog>
  </div>
</template>

<script>
import wxCorpAppList from './components/wx-corp-app-list/index.vue';
import wxCorpAppDetail from './components/wx-corp-app-detail/index.vue';
import wxCorpAppDetail_oem from './components/wx-corp-app-detail-oem/index.vue';
import chatToolDetail from './components/chat-tool-detail/index.vue';
import wxWorkMsgDetail from './components/wx-work-msg-detail/index.vue';
import setAppDetail from './components/set-app-detail/index.vue';
import setPwdDialog from '@/components/base/ts-set-pwd-dialog/index.vue';
import { mapState } from 'vuex';
import { getUrlParam, getWxWorkCorp } from '@/utils';
import TsSyncWxCorpCustomerDialog from '@/components/base/ts-sync-wx-corp-customer-dialog/index.vue';
import { getTsUserWxAuth } from '@/api/modules/views/setting-center';

export default {
  name: 'WxCorpApp',
  components: {
    wxCorpAppList,
    wxCorpAppDetail,
    wxCorpAppDetail_oem,
    chatToolDetail,
    wxWorkMsgDetail,
    setAppDetail,
    setPwdDialog,
    TsSyncWxCorpCustomerDialog,
  },
  props: {},
  data() {
    return {
      currentTemp: '', // wxCorpAppList wxCorpAppDetail chatToolDetail wxWorkMsgDetail
      wxWorkCorpData: {}, // 授权信息
      registerUrl: '', // 获取注册链接
      appAuthUrl: '', // 企业微信应用授权地址
      syncWxCorpCustomerDialogVisible: false, // 企微客户同步弹窗
      setPwdDialogVisible: false,
      isSetPwd: false, // 是否设置密码
      initPwd: '', // 初始化的密码
      isPublishApp: false, // 小程序是否发布状态
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      isOem: state => state.user.info.isOem,
    }),
    /**
     * 是否设置过
     * finishStep > 1
     * 或finishStep为0但已绑定第三方都为设置过
     * @author waldon
     * @date 2021/1/26
     * @returns {Boolean} - 是否设置过
     */
    hasSetCal() {
      const { finishStep, corpSetSuccessRel } = this.wxWorkCorpData;
      return finishStep > 1 || corpSetSuccessRel;
    },
  },
  watch: {},
  async created() {
    let resultStr = getUrlParam(document.URL, 'result');
    let isToDetail = false; // 可能进详情的场景
    if (resultStr) {
      // 从安装回调回来的
      resultStr = resultStr.replace(/\\/g, ''); // 暂时处理多出来的斜杠
      const result = JSON.parse(resultStr);
      if (result.success) {
        isToDetail = true;
      } else {
        // 安装失败
        if (result.rt === -6) {
          this.$utils.postMessage({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: `<p>${result.msg}，<a href="${this.addressUrl?.wxWorkCorpSetting_5}" target="_blank">查看教程</a>`,
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: result.msg || '网络错误，请稍候重试',
          });
        }
      }
      const refreshUrl = document.URL.split('?')[0]; // 清除提示的url参数，刷新后不再提示第二次
      if (window.history.pushState) {
        window.history.replaceState({}, '', refreshUrl);
      }
    } else if (this.$route.params && ['topTip', 'chatTool'].includes(this.$route.params.fromType)) {
      // 其他页面顶部栏跳转
      isToDetail = true;
    } else if (this.$route.query && ['wxWorkMsgDetail'].includes(this.$route.query.fromType)) {
      isToDetail = true;
    }
    if (isToDetail) {
      this.wxWorkCorpData = await getWxWorkCorp();
      if (this.$route.params.fromType === 'chatTool' && this.wxWorkCorpData.corpSetSuccessRel) {
        // 从聊天工具页面来且设置完成第三方应用的，进入聊天工具设置页
        this.currentTemp = 'chatToolDetail';
        return;
      } else if (this.$route.query.fromType === 'wxWorkMsgDetail' && this.wxWorkCorpData.corpSetSuccessRel) {
        this.currentTemp = 'wxWorkMsgDetail';
        if (this.$route.query.isShowTip) {
          this.$utils.postMessage({
            type: 'error',
            message: '完成会话存档配置后方可使用该功能',
          });
        }
        this.$router.replace(this.$route.path);
        return;
      } else if (this.wxWorkCorpData.finishStep > 1) {
        // 未完成设置的
        if (resultStr && JSON.parse(resultStr).success) {
          this.$utils.postMessage({
            type: 'success',
            message: '安装成功，为了更好的体验，请完成剩余相关信息设置',
          });
        }
        this.currentTemp = this.isOem ? 'wxCorpAppDetail_oem' : 'wxCorpAppDetail';
        return;
      }
    }
    this.currentTemp = 'wxCorpAppList';
    this.getTsUserWxAuth();
    this.wxWorkCorpData = await getWxWorkCorp();
  },
  mounted() {},
  methods: {
    /**
     * 获取用户授权信息。
     * @author jane
     * @date 2020-5-12
     * @modify waldon 从授权页复制
     */
    async getTsUserWxAuth() {
      const [err, res] = await getTsUserWxAuth();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const judgeData = res.data.tsUserWxInfo || {};
      this.isPublishApp = judgeData.appStatus === 1; // 1为发布成功
    },
    /**
     * 完成设置
     * @author waldon
     * @date 2021/3/4
     */
    completeSet() {
      // 最后一步完成设置，就打开企微同步
      this.syncWxCorpCustomerDialogVisible = true;
    },
    /**
     * 设置密码成功回调
     * @author waldon
     * @date 2020/7/23
     * @param {*} pwd - 设置的密码
     */
    setPwdSuccess(pwd) {
      this.initPwd = pwd;
      this.isSetPwd = true;
    },
    /**
     * 同步成功回调
     * @author waldon
     * @date 2020/7/23
     */
    syncWxWorkUserSuccess() {
      this.isSetPwd = false;
    },
    /**
     * 确定提交同步
     * @author waldon
     * @date 2020/7/23
     */
    confirmSyncWxCorp() {
      this.setPwdDialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.wxCorpApp {
  height: 100%;
}
</style>

<style lang="scss">
.wxCorpApp .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
.wxCorpApp .pro_listBox {
  min-height: 724px;
  padding: 0;
}

.wxCorpApp {
  .mainWrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 565px;
    margin: 0 auto;
    .inputWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      .input-content-wrapper {
        position: relative;
      }
      .idChangeTip {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        line-height: 34px;
        color: #ffffff;
        text-align: center;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
      .text {
        width: 8em;
        margin-right: 20px;
        font-size: 14px;
        line-height: 19px;
        color: $color-53;
        text-align: right;
        flex: 0 0 auto;
      }
      .fa-input {
        width: 400px;
      }
      &.copyInput {
        .fa-input {
          width: 326px;
        }
      }
      .copyBtn {
        min-width: 60px;
        margin-left: 12px;
      }
      .reloadIcon {
        margin-right: 0;
        margin-left: 12px;
        color: #b2b2b2;
        &:hover {
          color: #535353;
        }
      }
    }
    .stadyWrapper {
      display: flex;
      align-items: center;
      width: 534px;
      margin-bottom: 24px;
    }
  }
  .stepBox {
    flex: 0 0 auto;
    width: 565px;
    margin: 60px auto;
    .inStallBox {
      position: relative;
      top: 0;
      left: 26px;
      width: 64px;
      height: 16px;
      font-size: 16px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
      &:hover {
        color: #247af3;
      }
    }
  }
}
</style>

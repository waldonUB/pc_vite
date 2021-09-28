<!--
 * @Description  : 会话管理
 * @Author       : turbo
 * @Date         : 2021-06-02 16:40:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:34:46
-->

<template>
  <div class="wxWorkMsgList">
    <keep-alive :exclude="['wxWorkMsgDetail']">
      <component
        :sendUserInfo="sendUserInfo"
        :hasWxWorkMsgApp="hasWxWorkMsgApp"
        :hasWxWork="hasWxWork"
        :hasClick="hasClick"
        :is="currentComponent"
        @changeComponent="change"
      >
      </component>
    </keep-alive>
  </div>
</template>

<script>
import { gotoWxCorpSet, getGuideList, getWxWorkConfInfo } from '@/utils';
import wxWorkMsgData from './components/wx-work-msg-data/index.vue';
import wxWorkMsgDetail from './components/wx-work-msg-detail/index.vue';
import wxWorkMsgIntro from './components/wx-work-msg-intro/index.vue';
import { mapState } from 'vuex';
import { checkSettingInfoComplete } from '@/api/modules/views/wx-work-msg-manager/wx-work-msg-list';

export default {
  name: 'wxWorkMsgList',
  components: {
    wxWorkMsgData,
    wxWorkMsgDetail,
    wxWorkMsgIntro,
  },
  props: {},
  data() {
    return {
      currentComponent: '',
      sendUserInfo: {}, // 发送人的信息
      hasWxWorkMsgApp: false, // 是否接入了企微会话设置
      hasWxWork: false, // 是否配置好了企微
      hasClick: false, // 是否点击过立即使用
    };
  },
  computed: {
    ...mapState({
      hasVersionCondition: state => state.globalData?.functionInfo?.wxWorkChatData?.condition, // 版本是否达到要求
    }),
    /**
     * @description
     * 1 如果用户完成了企微设置，并点击了立即使用按钮，后续进来直接进入到数据页
     * 2 如果用户完成了企微设置后，因版本到期/企微解绑等原因导致会话存档功能没办法使用，回退到介绍页面
     * @author enson
     * @date 2021-04-25
     * @returns
     */
    showIntroduct() {
      // 没有点击过 + 没有配置完成企微会话配置 + 不符合版本要求 则显示介绍页 + 没有配置企微
      return !this.hasClick || !this.hasWxWorkMsgApp || !this.hasVersionCondition || !this.hasWxWork;
    },
  },
  watch: {},
  created() {
    Promise.all([getGuideList(), getWxWorkConfInfo(), this.checkWxWorkMsgAblity()]).then(
      ([guideList, info, resData]) => {
        this.hasWxWork = info.wxWorkGroupConf.available; // 通用的判断，是否完成了企微设置
        console.log('resData', resData);
        if (guideList) {
          this.hasClick = guideList[14];
        }
        if (this.showIntroduct) {
          this.currentComponent = 'wxWorkMsgIntro';
          return;
        }
        this.currentComponent = 'wxWorkMsgData';
        if (resData.isShowErr) {
          // 如果是显示介绍页就不需要出提示了
          const wxSettingPath = gotoWxCorpSet(false, false);
          let errorMessage = resData.errMsg;
          if (wxSettingPath) {
            const href = `${location.origin}/#/${wxSettingPath}?fromType=wxWorkMsgDetail`;
            errorMessage = errorMessage + `&nbsp;&nbsp;&nbsp;<a href="${href}" target="_blank">去设置</a>`;
          }
          this.$utils.postMessage({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: `<p>${errorMessage}</p>`,
          });
        }
      },
    );
  },
  mounted() {},
  methods: {
    change(currentComponent, payLoad = {}) {
      this.currentComponent = currentComponent;
      this.sendUserInfo = payLoad.sendUserInfo || {};
    },
    /**
     * @description 获取是否完成了企微会话设置
     * @author enson
     * @date 2021-04-25
     */
    async checkWxWorkMsgAblity() {
      const [err, res] = await checkSettingInfoComplete();
      if (err) {
        return Promise.reject(err);
      }
      const resData = res.data;
      this.hasWxWorkMsgApp = resData.isComplete;
      return Promise.resolve(resData);
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkMsgList {
  height: 100%;
}
</style>

<style lang="scss">
.wxWorkMsgList_visitDataTitlteTip {
  line-height: 20px;
}
.wxWorkMsgData .versionIcon.tanshu-iconVer,
.wxWorkMsgIntro .tanshu-header-comm .tipIcon.icon {
  margin-left: 6px;
}
</style>

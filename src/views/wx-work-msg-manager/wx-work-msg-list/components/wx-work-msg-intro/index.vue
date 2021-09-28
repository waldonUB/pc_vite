<!--
 * @Author       : ADI
 * @Date         : 2021-07-22 15:43:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:57:46
-->
<template>
  <div class="wxWorkMsgIntro">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          会话存档
          <global-ts-version class="versionIcon" :limitVer="showVer"></global-ts-version>
          <svg class="icon tipIcon icon_16 icon_tipIconStyle" aria-hidden="true" @click="toHelpCenter">
            <use xlink:href="#icon-wenhao1616"></use>
          </svg>
        </div>
      </template>
    </global-ts-header>
    <ts-introduce-page
      :showVersionTip="showVersionTip"
      :hasFinishWxWork="hasWxWorkMsgApp"
      :isDisabled="!hasVersionCondition"
      :icon="introductIcon"
      :introductBg="introductBg"
      title="会话存档"
      explain="在线查看企业成员和客户的聊天记录，该功能需要额外付费给企业微信官方"
      :buttonTxt="buttonTxt"
      @gotoSet="gotoSet"
    >
    </ts-introduce-page>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import wxMsgSendIconIMG from '@/assets/image/wxWorkMsg/wxMsgSendIcon.png';
import wxWorkMsgIntroBgIMG from '@/assets/image/wxWorkMsg/wxWorkMsgIntroBg.png';
import { saveGuide, gotoWxCorpSet } from '@/utils';
import TsIntroducePage from '@/components/base/ts-introduce-page/index.vue';

export default {
  name: 'wx-work-msg-intro',
  components: { TsIntroducePage },
  props: {
    hasWxWorkMsgApp: {
      // 是否接入了企微会话设置
      type: Boolean,
      default: false,
    },
    hasWxWork: {
      // 是否配置好了企微
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showVer: versionDef.getLimitVer('MID', 'PROFESSIONNAL'), // 直销：专业版 分销：高级版
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
      hasVersionCondition: state => state.globalData?.functionInfo?.wxWorkChatData?.condition, // 版本是否达到要求
      addressUrl: state => state.globalData.addressUrl,
    }),
    introductIcon() {
      return wxMsgSendIconIMG;
    },
    introductBg() {
      return wxWorkMsgIntroBgIMG;
    },
    buttonTxt() {
      return this.hasWxWork ? '立即使用' : '接入企微';
    },
    showVersionTip() {
      // 是免费版 或者 (高级版、专业版) 以上的版本才显示
      return (!this.userInfo.msg.isTry && this.userInfo.msg.realVer === 0) || this.isHaveVersion;
    },
    isHaveVersion() {
      if (this.isOem) {
        return versionDef.checkVersion(versionDef.NotDirectVersionDef.VersionList.MID);
      } else {
        return versionDef.checkVersion(versionDef.DirectVersionDef.VersionList.PROFESSIONNAL);
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 跳转教程内容
     * @author wuying
     * @date 2021-07-08
     */
    toHelpCenter() {
      window.open(this.addressUrl.wxChatDataListCount, '_blank');
    },
    gotoSet() {
      if (!this.hasWxWork || !this.hasWxWorkMsgApp) {
        // 未接入企微 || 没有接入企微会话
        const path = gotoWxCorpSet(false);
        path &&
          this.$router.push({
            name: path,
            query: {
              fromType: 'wxWorkMsgDetail',
              isShowTip: this.hasWxWork, // 接入企微没有接入企微会话才出错误提示
            },
          });
        return;
      }

      if (!this.hasVersionCondition) {
        // 不符合版本要求
        this.$utils.postMessage({
          type: 'error',
          message: '当前版本无法使用此功能',
        });
        return;
      }

      this.changeContent();
    },
    /**
     * @description 显示列表
     * @author enson
     * @date 2021-04-22
     */
    changeContent() {
      saveGuide(14).then(() => {
        this.$emit('changeComponent', 'wxWorkMsgData');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wx-work-msg-intro {
}
</style>

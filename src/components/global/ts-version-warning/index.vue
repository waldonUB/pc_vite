<template>
  <div class="ts-version-warning">
    <global-ts-tip :showVersionTip="experienceTipsShowIsOem" bindClass="versionTip">
      <template class="versionTip" slot="content">
        <span class="restDay"> 付费功能体验倒计时: {{ restDay }}天{{ restHour }}小时 </span>
        <span class="remind"> （到期将自动失效） </span>
        <a class="updateBtn" target="_blank" :href="addressUrl.updateVersionUrl">立即升级</a>
      </template>
    </global-ts-tip>
    <global-ts-tip :showVersionTip="experienceTipsShow" bindClass="versionTip discount">
      <template class="versionTip" slot="content">
        <span class="restDay"> 限时优惠：买二送二 </span>
        <a class="updateBtn" target="_blank" :href="addressUrl.updateVersionUrl">立即升级</a>
      </template>
    </global-ts-tip>
    <global-ts-tip :showVersionTip="renewTipsShow" bindClass="versionTip">
      <template class="versionTip" slot="content">
        <div>
          <span class="restDay"> 您的版本将于{{ userInfo.versionInfo.verRestDayTime }}天后到期 </span>
          <span class="remind"> （为确保正常使用，请及时续费） </span>
        </div>
        <a class="updateBtn" target="_blank" :href="addressUrl.updateVersionUrl">立即续费</a>
      </template>
    </global-ts-tip>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import store from '@/store';

export default {
  name: 'ts-version-warning',
  props: {
    bindClass: {
      type: String,
      default: '',
    },
    inTroClass: {
      // 默认是首页的样式，传入freeWrap则是介绍页的样式
      type: String,
      default: 'countTimeTip',
    },
  },
  data() {
    return {
      deadlineSecond: 0,
    };
  },
  watch: {
    'userInfo.msg.deadlineSecond': {
      handler(val) {
        this.deadlineSecond = val;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      versionInfo: state => state.user.info.versionInfo,
      userInfo: state => state.user.info,
      addressUrl: state => state.globalData.addressUrl,
    }),
    canUseVersion() {
      // 是否是标准版/专业版以上
      return versionDef.getIsProfessionnal();
    },
    restDay() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'day');
    },
    restHour() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'hour');
    },
    tipClass() {
      return this.bingClass;
    },
    experienceTipsShowIsOem() {
      return this.userInfo.msg.isTry && this.userInfo.msg.realVer === 0;
    },
    experienceTipsShow() {
      return !this.userInfo.msg.isTry && this.userInfo.msg.realVer === 0 && !this.isOem;
    },
    renewTipsShow() {
      return this.userInfo.versionInfo.verRestDayTime < 30 && this.canUseVersion;
    },
  },
  methods: {
    upGrade() {
      this.$emit('upGrade');
    },
    transTime(time, key) {
      const dayUnit = 24 * 60 * 60;
      const hourUnit = 60 * 60;
      const day = Math.floor(time / dayUnit);
      const remain = time % dayUnit;
      const hour = Math.floor(remain / hourUnit);
      if (key == 'day') {
        return day > 9 ? day : '0' + day;
      } else if (key == 'hour') {
        return hour > 9 ? hour : '0' + hour;
      }
    },
    /**
     * 添加移除触发时机处理
     * @author: ADI
     * @Date: 2021-03-26 15:59:46
     * @param {*}
     * @return {*}
     */
    startCount() {
      let timer = setInterval(() => {
        if (this.userInfo.msg.deadlineSecond > 1) {
          this.userInfo.msg.deadlineSecond--;
        } else {
          this.userInfo.msg.isTry = false;
        }
      }, 1000);

      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
        timer = -1;
      });
    },
  },
  mounted() {
    this.startCount();
  },
};
</script>

<style lang="scss">
.ts-version-warning {
  .tanshuTip.versionTip.discount {
    width: 262px;
  }
}
</style>

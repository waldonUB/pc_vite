<template>
  <div class="ts-version-tip" :class="tipClass">
    <div :class="inTroClass" class="flex flex-vc" v-if="userInfo.msg.isTry && userInfo.msg.realVer === 0">
      <div class="versionWrap">
        <div class="version-name free-text">付费功能体验倒计时: {{ restDay }}天{{ restHour }}小时</div>
        <div class="version-time free-time">到期将自动失效</div>
      </div>
      <div class="upgrade toUpBtn" @click="upGrade">立即升级</div>
    </div>
    <div class="discount flex flex-hc flex-vc" v-if="!userInfo.msg.isTry && userInfo.msg.realVer === 0 && !isOem">
      <div>限时优惠：买二送二</div>
      <div class="upgrade" @click="upGrade">立即升级</div>
    </div>
    <div
      class="discount canUseVersion flex flex-hc flex-vc"
      v-if="userInfo.versionInfo.verRestDayTime < 30 && canUseVersion"
    >
      <div class="versionWrap">
        <div class="version-name free-text">您的版本将于{{ userInfo.versionInfo.verRestDayTime }}天后到期</div>
        <div class="version-time free-time">（为确保正常使用，请及时续费）</div>
      </div>
      <div class="upgrade" @click="upGrade">立即续费</div>
    </div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import store from '@/store';

export default {
  name: 'ts-version-tip',
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
      userInfo: state => state.user.info,
    }),
    versionInfo() {
      return versionDef.getVersionInfo();
    },
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

<style lang="scss" scoped>
/* ts-version-tip组件样式 start */
.ts-version-tip {
  .countTimeTip {
    position: relative;
    display: flex;
    width: 100%;
    height: 52px;
    padding: 8px 12px;
    margin-bottom: 20px;
    overflow: hidden;
    // font-family: 'Microsoft YaHei';
    font-size: 14px;
    color: #ffffff;
    background: url('~@/assets/image/indexManage/freeBg_index.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 4px;
    box-sizing: border-box;
    align-items: center;
    .upgrade {
      position: absolute;
      top: 0;
      right: 12px;
      bottom: 0;
      width: 76px;
      height: 30px;
      margin: auto;
      // font-family: 'Microsoft YaHei';
      line-height: 30px;
      color: #ffffff;
      text-align: center;
      background: linear-gradient(81deg, #ff7c59 0%, #ffbc90 100%);
      border-radius: 4px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .noTry {
    .upgrade {
      width: 120px;
    }
    .version-name {
      margin-bottom: 0;
    }
    .toUpBtn {
      width: 120px;
    }
  }
  .discount {
    display: flex;
    width: 100%;
    height: 52px;
    padding: 10px 12px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #f5ad82;
    background: linear-gradient(203deg, rgba(67, 55, 47, 1) 0%, rgba(31, 35, 41, 1) 100%);

    /* background: url('~@/assets/image/indexManage/versionBg.png') no-repeat; */
    border-radius: 4px;
    box-sizing: border-box;
    align-items: center;
    justify-content: censpace-betweenter;
    .upgrade {
      width: 76px;
      height: 30px;
      margin-left: 48px;
      line-height: 30px;
      color: #562b0c;
      text-align: center;
      background: linear-gradient(90deg, #ff793d 0%, #ffc595 100%);
      border-radius: 4px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .canUseVersion {
    padding: 8px 12px;
  }
  .freeWrap {
    position: relative;
    display: flex;
    width: 290px;
    height: 52px;
    padding: 9px 12px;
    font-size: 14px;
    color: #ffffff;
    background: linear-gradient(23deg, #8ba4ca 0%, #a8bcdc 100%);
    border-radius: 4px;
    box-shadow: 0 4px 8px 0 rgba(2, 5, 31, 0.06);
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    .free-text {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 14px;
    }
    .free-time {
      width: 180px;
      overflow: hidden;
      font-size: 12px;
      line-height: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .upgrade {
      width: 76px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: linear-gradient(81deg, #ff7c59 0%, #ffbc90 100%);
      border-radius: 4px;
      box-shadow: 0 4px 8px 0 rgba(2, 5, 31, 0.06);
      box-sizing: border-box;
      &:hover {
        cursor: pointer;
      }
    }
    &.noTry {
      .upgrade {
        width: 120px;
      }
    }
  }
}
.ts-version-tip .countTimeTip .versionWrap,
.ts-version-tip .discount .versionWrap {
  width: 215px;
  overflow: hidden;
}

/* .ts-version-tip .countTimeTip .version-name{
    font-size:14px;
    line-height:14px;
    margin-bottom: 8px;
} */
.ts-version-tip .countTimeTip .version-time,
.ts-version-tip .discount .version-time {
  overflow: hidden;
  font-size: 12px;
  line-height: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ts-version-tip组件样式 end */
</style>

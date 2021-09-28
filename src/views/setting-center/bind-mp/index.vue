<!--
 * @Description  : 微信授权
 * @Author       : turbo
 * @Date         : 2021-03-30 15:47:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 16:53:11
-->

<template>
  <div class="bindMp">
    <component :is="currentComponent" :isAuthToClick="isAuthToClick"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import authorizeGuide from './components/authorize-guide/index.vue';
import mainFrame from './components/main-frame/index.vue';
import mpbinding from './components/mpbinding/index.vue';
import customOperate from './components/custom-operate/index.vue';
import noAuth from './components/no-auth/index.vue';
import { refreshAll, getTsUserWxAuth, checkWxFunction } from '@/api/modules/views/setting-center/bind-mp';

export default {
  name: 'bindMp',
  components: {
    authorizeGuide,
    mainFrame,
    mpbinding,
    customOperate,
    noAuth,
  },
  props: {},
  data() {
    return {
      currentComponent: '',
      authData: null,
      isAuthToClick: true, // 是否允许点击。因为微信将于01.24-01.30期间暂停小程序代码审核，防止用户点击
      isBackToPublish: false, //是否是已经通过审核待发布，然后点了返回按钮，回来同步消息模板。如果是这种情况，下面的按钮要换成发布小程序。
    };
  },
  computed: {
    ...mapState({
      functionInfo: state => state.globalData?.functionInfo,
    }),
  },
  watch: {},
  created() {
    this.isBackToPublish = false;
    this.authData = null;
    if (!this.functionInfo.bindWxFunction.condition) {
      this.changePage(4);
      return;
    }
    this.getAuthToClick();
    this.getTsUserWxAuth();
  },
  async mounted() {
    // 加载了页面后先刷新一遍授权信息
    const [err, response] = await refreshAll();
    if (err) {
      this.$utils.postMessage({
        type: 'error',
        message: err.msg || '网络错误，请稍候重试',
      });
      return Promise.reject(err);
    }
  },
  methods: {
    /**
     * 获取用户授权信息。
     * @author jane
     * @date 2020-5-12
     */
    async getTsUserWxAuth() {
      const [err, response] = await getTsUserWxAuth();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const judgeData = response.data.tsUserWxInfo || {};
      this.authData = Object.assign({}, judgeData);
      if (Object.keys(judgeData).length <= 0 || (!judgeData.appAppid && !judgeData.mpAppid && !judgeData.isBindOpen)) {
        this.changePage();
      } else {
        this.appStatus = judgeData.appStatus;
        this.codeStatus = judgeData.codeStatus;
        this.secondAudit = judgeData.secondAudit; // 目前只用在审核页面
        // 审核不通过，展示原因，改为优先级最高
        if (this.codeStatus == 7) {
          this.changePage(3);
        } else {
          if (this.appStatus == 0) {
            switch (this.codeStatus) {
              case 0:
              case 1:
                this.changePage(1);
                break;
              default:
                this.changePage(3);
                break;
            }
          } else {
            // judgeData.secondAudit - true 代表在审核中/审核失败
            if (this.secondAudit) {
              this.changePage(3);
            } else {
              // 旧逻辑
              // 发布成功
              this.changePage(1);
            }
          }
        }
      }
    },

    /**
     *切换当前显示页面。'authorizeGuide', 'mainFrame', 'mpbinding', 'customOperate', 'noAuth'，分别代表，授权指引、授权信息页面、授权绑定过程页、没有权限页
     * @author tomato
     * @date 2020-04-10
     * @param {number} [index=0]
     */
    changePage(index = 0) {
      var componetList = ['authorizeGuide', 'mainFrame', 'mpbinding', 'customOperate', 'noAuth'];
      this.currentComponent = componetList[index];
    },
    async getAuthToClick() {
      const [err, res] = await checkWxFunction();
      if (err) {
        return Promise.reject(err);
      }
      this.isAuthToClick = res.data.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.bindMp {
  height: 100%;
}
</style>

<style lang="scss">
.bindMp {
  .el-step__icon {
    &.is-text {
      width: 28px;
      height: 28px;
      border: none;
      svg {
        margin: 0;
        color: $color-53;
      }
    }
  }
  .el-step__head {
    &.is-wait {
      .el-step__icon {
        &.is-text {
          svg {
            color: $color-b2;
          }
        }
      }
    }
    &.is-finish {
      .iconWrap {
        svg {
          color: #247af3;
        }
      }
    }
  }
  .el-step__main {
    .is-finish {
      color: #247af3;
    }
  }
  .el-steps {
    padding-top: 60px;
  }

  .iconWrap {
    position: relative;
    svg {
      display: block;
      font-size: 28px;
    }
    .topIcons {
      position: absolute;
      top: -60px;
      left: 50%;
      font-size: 44px;
      transform: translate(-50%, 0%);
    }
  }
  .warnTips.isMiddle {
    margin: 20px 20px 0 20px;
  }
  .tanshu-header-comm .leftPart .headerTip {
    padding-left: 0;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    opacity: 0.5;
  }
  .tanshu-cardBox {
    .tanshu-cardBox-bottom {
      text-align: center;
    }
    .boldContent {
      font-size: 20px;
      font-weight: bold;
      color: #000000;
    }
    a {
      display: inline-block;
      margin: 0 10px;
      text-decoration: underline;
    }
  }
  .topTitle .icon {
    width: 1.2em;
    height: 1.2em;
    overflow: hidden;
    color: #247af3;
    vertical-align: -0.15em;
  }
}
</style>

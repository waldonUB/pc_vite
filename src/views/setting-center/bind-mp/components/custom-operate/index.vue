<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:56:43
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 14:06:32
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
      <div class="startBox">
        <div class="bindSuccess" v-if="hasPass">
          <p class="title_bolder">恭喜您，审核成功</p>
          <div class="mp_imgCodeBox" v-if="false">
            <img class="" :src="shareQrcode" />
          </div>
          <p class="detail_info" v-if="false">扫描二维码体验效果</p>
        </div>
        <div class="bindOperation" v-if="onVerifing">
          <p class="title_bolder">正在审核中</p>
          <p class="detail_info">
            审核中，预计3-7个工作日返回审核结果<a target="_blank" :href="wxAuditHelpUrl">帮助教程</a>
          </p>
        </div>
        <div class="bindFail" v-if="verfifyFail">
          <p class="title_bolder">审核不通过</p>
          <div>
            <p class="detail_info">原因如下：<a target="_blank" :href="wxAuditFailHelpUrl">帮助教程</a></p>
            <p class="refuseReason detail_info" v-html="repulseAudit"></p>
            <div v-if="false">
              <p class="detail_info">1.公众号消息模板同步失败：数量达到上限。</p>
              <p class="detail_info">2.网页授权域名没有设置。</p>
              <p class="detail_info">3.请处理后，点击【重新提交】，重新审核。</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div v-if="hasPublish">
        <global-ts-button type="others" :disabled="true" @click="backAuthorize">返回 </global-ts-button>
      </div>
      <div v-if="hasPass">
        <global-ts-button @click="publishMp">发布小程序 </global-ts-button>
        <global-ts-button type="others" @click="backCheckInfo">返回 </global-ts-button>
      </div>
      <div v-if="onVerifing">
        <global-ts-button type="others" :disabled="true" @click="backAuthorize">返回 </global-ts-button>
      </div>
      <div v-if="verfifyFail">
        <global-ts-button @click="reVerfify">提交审核 </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import authComm from '../../mixins/auth-comm/index.vue';
import { verfifyDefault } from '../../config';
import { mapState } from 'vuex';
import { confirm } from '@/utils';
import { getTsUserWxAuth, releaseApp, submitCheck } from '@/api/modules/views/setting-center/bind-mp';

export default {
  name: 'custom-operate',
  mixins: [authComm],
  components: {},
  props: {
    isAuthToClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      verifyStatus: verfifyDefault.verfifIng.value, //1代表审核成功，2代表审核中，3代表审核失败
      repulseAudit: '',
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      isDebug: state => state.globalData?.isDebug,
    }),
    // 已发布小程序
    hasPublish() {
      return this.verifyStatus == verfifyDefault.publish.value;
    },
    // 已审核通过
    hasPass() {
      return this.verifyStatus == verfifyDefault.success.value;
    },
    // 审核中
    onVerifing() {
      return this.verifyStatus == verfifyDefault.verfifIng.value;
    },
    verfifyFail() {
      return this.verifyStatus == verfifyDefault.verfuifyFail.value;
    },
    shareQrcode() {
      return `${this.isDebug ? 'http' : 'https'}://${this.addressUrl.nowHost}/shareQr.jsp`;
    },
    wxAuditHelpUrl() {
      return this.addressUrl.wxAuditHelpUrl;
    },
    wxAuditFailHelpUrl() {
      return this.addressUrl.wxAuditFailHelpUrl;
    },
  },
  watch: {},
  async created() {
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
    if (Object.keys(judgeData).length > 0) {
      if (judgeData.codeStatus == 7 || judgeData.codeStatus == 4) {
        this.verifyStatus = verfifyDefault.verfuifyFail.value;
        this.repulseAudit = judgeData.repulseAudit;
        return;
      }
      // secondAudit 目前的话只是在审核页用到
      // judgeData.secondAudit - true 代表在审核中/审核失败
      if (judgeData.appStatus == 1 && !judgeData.secondAudit) {
        this.verifyStatus = verfifyDefault.publish.value;
      } else {
        if (judgeData.codeStatus == 3) {
          this.verifyStatus = verfifyDefault.success.value;
          return;
        } else if (judgeData.codeStatus == 7 || judgeData.codeStatus == 4) {
          this.verifyStatus = verfifyDefault.verfuifyFail.value;
          this.repulseAudit = judgeData.repulseAudit;
          return;
        }
        this.verifyStatus = verfifyDefault.verfifIng.value;
      }
    }
  },
  mounted() {},
  methods: {
    /**
     *刷新当前页，返回授权页
     * @author tomato
     * @date 2020-04-10
     */
    backAuthorize() {
      window.location.reload(true);
    },
    /**
     *返回检查个人授权信息
     * @author tomato
     * @date 2020-05-20
     */
    backCheckInfo() {
      this.$parent.isBackToPublish = true;
      this.$parent.changePage(1);
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
     *重新提交发起审核
     * @author tomato
     * @date 2020-04-10
     */
    reVerfify() {
      confirm('是否根据微信要求修改调整了小程序？', '确认提交审核？').then(async () => {
        const [err, res] = await submitCheck();
        if (err) {
          return Promise.reject(err);
        }
        window.location.reload(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.startBox {
  padding-top: 85px;
  .title_bolder {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  .detail_info {
    font-size: 14px;
    color: $color-53;
  }
  .bindSuccess {
    .mp_imgCodeBox {
      position: relative;
      width: 240px;
      height: 240px;
      margin: 20px auto;
      background: #d8d8d8;
      border: 1px solid $border-disabled-color;
      border-radius: 4px;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
      }
    }
    .detail_info {
      text-align: center;
    }
  }
  .bindOperation {
    .detail_info {
      margin-top: 20px;
      text-align: center;
    }
    a {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .bindFail {
    & > div {
      width: 600px;
      margin: 20px auto;
    }
    .detail_info {
      text-align: left;
      &:nth-child(n + 2) {
        margin-top: 8px;
      }
    }
  }
}
</style>

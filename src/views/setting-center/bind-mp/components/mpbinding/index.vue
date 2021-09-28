<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:47:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 11:14:15
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
      <div class="step_wrap_box">
        <el-steps
          :active="active"
          finish-status="wait"
          process-status="finish"
          :align-center="true"
          :class="'activeBind_' + active"
        >
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-gongzhonghaoshouquan"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="bindOfficial"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">公众号授权</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-dangqian2"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="bindMpprogramer"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">小程序授权</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-dangqian"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="bindPlantFormImg"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">绑定开放平台</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-peizhiyuming"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="bindAcrossName"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">绑定域名</span>
          </el-step>
        </el-steps>
      </div>
      <div class="authorizeContent">
        <div class="authorize_official" v-if="active == 0">
          <div v-if="!authFail">
            <p class="boldContent">您尚未授权公众号</p>
            <p class="authorTip">
              为了您顺利完成授权，请先查看<a
                :href="authGuideUrl"
                @click="this.$utils.logDog('mp_authGuide_click')"
                target="_blank"
              >
                授权指引
              </a>
            </p>
            <div class="bindQrcode">
              <div class="authorQr">
                <div class="authorizeImg">
                  <img class="authorQrcode" :src="binMpUrl" @click="reflashQrcode(1)" />
                </div>
                <p>
                  <span class="tanshu_linkColor" @click="reflashQrcode(1)">刷新二维码</span>
                </p>
              </div>
              <div class="authorGuide"></div>
            </div>
          </div>
          <div v-else>
            <p class="boldContent">授权失败</p>
            <p class="authorTip textLeft">
              您授权的权限不够:开放平台权限未授权或已授权给其他平台。<a
                target="_blank"
                :href="authFailUrl"
                @click="this.$utils.logDog('mp_authFail_guide')"
              >
                查看指引
              </a>
            </p>
            <p class="authorTip textLeft">
              请前往<a href="https://mp.weixin.qq.com" target="_blank">
                微信公众平台
              </a>
              解绑授权了该权限的第三方平台后，点击【重新授权】按钮再次授权。
            </p>
          </div>
        </div>
        <div class="authorize_mp" v-if="active == 1">
          <div v-if="!authFail">
            <p class="boldContent">您尚未授权小程序</p>
            <p class="authorTip">
              为了您顺利完成授权，请先查看<a
                :href="authGuideUrl"
                @click="this.$utils.logDog('app_authGuide_click')"
                target="_blank"
              >
                授权指引
              </a>
            </p>
            <div class="authorize_info" v-if="!isHaveBindmp">
              <p class="detail_info">
                1.微信官方规定：用户必须自己进行小程序注册。然后才可以将小程序授权给任意第三方进行设计和代码管理。<a
                  target="_blank"
                >
                  自行注册
                </a>
              </p>
              <p class="detail_info">
                2.微信官方规定：小程序个人开放的服务类目是有严格规定的，内容不在服务类目的中的，是审核不通过的。
              </p>
              <p class="detail_info">3.您可以选择【点击授权】，直接授权您的小程序。</p>
              <p class="detail_info">
                4.您也可以选择【快速注册】，我们将复用您的公众号资质快速帮您创建小程序。 <a target="_blank">查看详情</a>
              </p>
            </div>
            <div class="bindQrcode" v-else>
              <div class="authorQr">
                <div class="authorizeImg">
                  <img class="authorQrcode" :src="binMpUrl" @click="reflashQrcode(2)" />
                </div>
                <p>
                  <span class="tanshu_linkColor" @click="reflashQrcode(2)">刷新二维码</span>
                </p>
              </div>
              <div class="authorGuide"></div>
            </div>
          </div>
          <div v-else-if="isBindOtherPlatform">
            <p class="boldContent">授权失败</p>
            <p class="authorTip textLeft">
              您授权的权限不够:当前小程序已绑定其他平台<a
                :href="authFailUrl"
                @click="this.$utils.logDog('app_otherGuide_click')"
                target="_blank"
              >
                查看指引
              </a>
            </p>
            <p class="authorTip textLeft">建议更换其他小程序在重新授权</p>
          </div>
          <div v-else>
            <p class="boldContent">授权失败</p>
            <p v-if="!isBindOtherPlatform" class="authorTip textLeft">
              您授权的权限不够:开放平台权限未授权<a
                :href="authFailUrl"
                @click="this.$utils.logDog('app_openGuide_click')"
                target="_blank"
              >
                查看指引
              </a>
            </p>
            <p v-if="!isBindOtherPlatform" class="authorTip textLeft">
              请前往<a target="_blank" href="https://mp.weixin.qq.com">微信公众平台</a>解绑后，重新授权
            </p>
          </div>
        </div>
        <div class="authorize_plantform" v-if="active == 2">
          <div class="bindSucess" v-if="bindPlantForm">
            <p class="boldContent">恭喜您，绑定成功！</p>
            <p class="boldContent">请点击下一步</p>
          </div>
          <div class="bindFail" v-else-if="isForeign">
            <p class="boldContent">绑定失败</p>
            <p class="detail_info">
              很抱歉，您授权的是境外主体小程序，无法完成绑定<a
                :href="authFailUrl"
                target="_blank"
                @click="this.$utils.logDog('oversea_Guide_click')"
              >
                查看指引
              </a>
            </p>
            <p class="detail_info">
              请前往<a href="https://mp.weixin.qq.com" target="_blank">微信公众平台</a>解绑后，重新授权其他小程序
            </p>
          </div>
          <div class="bindFail" v-else>
            <p class="boldContent">绑定失败</p>
            <p class="detail_info">
              {{ errorBindMsg }}<a href="https://open.weixin.qq.com/" target="_blank" v-show="isShowUnbind">去解绑</a>
            </p>
          </div>
        </div>
        <div class="uploadTxt" v-if="active == 3">
          <p class="boldContent">您尚未配置域名</p>
          <div class="detail_item">
            <p>
              1.配置JS接口安全域名、网页授权域名<span>(必须) </span>
              <a :href="mpDomainHelpUrl" target="_blank">查看教程</a>
            </p>
          </div>
          <p class="detail_info">
            1.请登录微信公众平台，将以下域名填写到网页授权域名、JS接口安全域名。<a
              href="https://mp.weixin.qq.com"
              target="_blank"
            >
              去登录
            </a>
          </p>
          <p class="detail_info">
            2.位置：【微信公众平台】-【公众号设置】-【功能设置】-【JS接口安全域名】和【网页授权域名】。
          </p>
          <p class="detail_info">
            3.下载txt授权文件并提交。<!-- <a target="_blank" :href="mpDomainHelpUrl">查看详情</a> -->
          </p>
          <p class="detail_info">域名1：{{ articleDomain }}</p>
          <p class="detail_info">域名2：{{ articleBackupDomain }}</p>
          <div class="uploadComponent flex flex-vc">
            <el-upload
              class="upload-demo"
              name="filedata"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              :on-error="uploadError"
              :show-file-list="false"
              :multiple="false"
              accept=".txt"
              :action="uploadUrl"
              ref="upload"
            >
              <global-ts-button size="small">点击上传</global-ts-button>
            </el-upload>
            <span class="fileName">{{ uploadFileName }}</span>
          </div>
          <div class="detail_item">
            <global-ts-tool-tips
              offset="10"
              class="item"
              effect="dark"
              content="配置后，您主动对文章访客发起IM会话，访客将收到提醒"
              placement="top-start"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bianzu"></use>
              </svg>
            </global-ts-tool-tips>
            <p>
              2.配置业务域名<span>(必须) <a :href="appDomainHelpUrl" target="_blank">查看教程</a></span>
            </p>
          </div>
          <p class="detail_info">
            1.请登录微信公众平台，将上述域名填写到业务域名，位置：【微信公众平台】-【公众号设置】-【功能设置】。<a
              href="https://mp.weixin.qq.com"
              target="_blank"
            >
              去登录
            </a>
          </p>
          <p class="detail_info">2.填写一次性订阅消息模版ID，获取位置：【微信公众平台】-【接口权限】。</p>
          <div class="uploadComponent flex flex-vc">
            <global-ts-button size="small" @click="setTempId">{{ tempIdBtn }}</global-ts-button>
            <span class="fileName">{{ tempIdText }}</span>
          </div>
        </div>
      </div>
      <getTemplateIdPopup
        v-show="isShowTemplateIdPopup"
        :tempId="tempId"
        @changeTempId="changeTempId"
      ></getTemplateIdPopup>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-button v-if="isNeedRebind" @click="bindOpenPlantform">重新绑定 </global-ts-button>
      <global-ts-button v-else-if="authFail" @click="delAuth">重新授权 </global-ts-button>
      <global-ts-button v-else @click="nextStep">{{ finishBinding ? '完成' : '下一步' }} </global-ts-button>
      <global-ts-button type="others" @click="backAuthorize">返回 </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import { loading, getUrL, getUrlParam } from '@/utils';
import { mapState } from 'vuex';
import getTemplateIdPopup from '../get-template-id-popup/index.vue';
import { Steps, Step, Upload } from 'element-ui';
import {
  getTsUserWxAuth,
  bindingWxOpen,
  delAuthorizeErrMsg,
  getTxtList,
  getMpOneTimeSubMsgTempId,
} from '@/api/modules/views/setting-center/bind-mp';

export default {
  name: 'mpbinding',
  components: { getTemplateIdPopup, [Steps.name]: Steps, [Step.name]: Step, [Upload.name]: Upload },
  props: {
    isAuthToClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      active: -1, //当前授权步骤，共有三步，公众号、小程序、开放平台
      isHaveBindmp: true, //是否有小程序登记注册了。
      mpTxtName: '', //实际上传的文件名
      bindPlantForm: false, //是否已经成功绑定开放平台
      // bindOfficialUrl: '', //绑定公众号二维码
      // bindMpUrl: '', //绑定小程序
      binMpUrl: '',
      uploadUrl: getUrL('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=uploadTxt'),
      errorBindMsg: '',
      isShowUnbind: false, //是否显示去解绑绑定
      isShowTemplateIdPopup: false,
      tempId: '',
      authFail: false,
      isBindOtherPlatform: false, //授权失败类型 判断是否是其他平台的授权失败
      isForeign: false, //是否是境外小程序
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    uploadFileName() {
      return this.mpTxtName ? this.mpTxtName : '未上传文件';
    },
    bindOfficial() {
      return this.active <= 0 ? '#icon-dangqian1' : '#icon-yiwancheng';
    },
    bindMpprogramer() {
      if (this.active == 1) {
        return '#icon-dangqian1';
      } else if (this.active < 1) {
        return '#icon-weiwancheng1';
      }
      return '#icon-yiwancheng';
    },
    bindPlantFormImg() {
      if (this.active == 2) {
        return '#icon-dangqian1';
      } else if (this.active < 2) {
        return '#icon-weiwancheng1';
      }
      return '#icon-yiwancheng';
    },
    isNeedRebind() {
      return this.active == 2 && !this.bindPlantForm;
    },
    // 配置域名
    bindAcrossName() {
      return this.active == 3 ? '#icon-dangqian1' : '#icon-weiwancheng1';
    },
    finishBinding() {
      return this.active == 3 && this.mpTxtName && this.tempId;
    },
    tempIdText() {
      return this.tempId ? this.tempId : '未填写';
    },
    tempIdBtn() {
      return this.tempId ? '修改模板Id' : '填写模板Id';
    },
    articleDomain() {
      return this.addressUrl.articleDomain;
    },
    articleBackupDomain() {
      return this.addressUrl.articleBackupDomain;
    },
    mpDomainHelpUrl() {
      return this.addressUrl.mpDomainHelpUrl;
    },
    appDomainHelpUrl() {
      return this.addressUrl.appDomainHelpUrl;
    },
    authGuideUrl() {
      return this.addressUrl.authorizeGuideUrl;
    },
    authFailUrl() {
      return this.addressUrl.viewAuthorizeUrl;
    },
  },
  watch: {
    active(val) {
      switch (val) {
        // 授权公众号
        case 0:
          this.getBindUrl(1);
          break;
        case 1:
          this.getBindUrl(2);
          break;
      }
    },
  },
  created() {
    this.active = -1;
    this.getHasBindInfo();
    this.getTempId();
  },
  mounted() {},
  methods: {
    /**
     *重新授权：删除授权缓存
     *
     * @author guoyijie
     * @date 2020-04-14
     */
    async delAuth() {
      this.active == 0 ? this.$utils.logDog('mp_auth_show') : this.$utils.logDog('app_auth_show');
      const [err, res] = await delAuthorizeErrMsg();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.authFail = false;
    },
    /**
     *绑定开放平台
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    async bindOpenPlantform() {
      const [err, response] = await bindingWxOpen({ ts_hideMessage: true });
      if (err) {
        this.bindPlantForm = false;
        this.errorBindMsg = err.msg;
        this.isShowUnbind = err.rt == 3030;
        this.isForeign = err.rt == 89008;
        this.isForeign && this.$utils.logDog('oversea_Fail_show');
        return Promise.resolve(err);
      } else {
        this.bindPlantForm = true;
        return Promise.resolve(response);
      }
    },
    /**
     *上传文件之前的回调
     * @author tomato
     * @date 2020-04-10
     */
    beforeUpload() {
      loading.addQuene({
        key: 'beforeUploadFile',
      });
    },
    /**
     *上传文件失败的回调
     * @author tomato
     * @date 2020-04-10
     * @param {*} err
     */
    uploadError(err) {
      loading.poupQuene('beforeUploadFile');
      this.$utils.postMessage({
        type: 'error',
        message: err || '上传失败',
      });
    },
    /**
     *上传成功的回调
     * @author tomato
     * @date 2020-04-10
     * @param {*} response
     */
    uploadSuccess(response) {
      loading.poupQuene('beforeUploadFile');
      if (response && response.success) {
        this.mpTxtName = response.name;
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: response.msg || '上传失败',
        });
      }
    },
    /**
     *授权完成之后点击下一步
     * @author tomato
     * @date 2020-04-10
     */
    nextStep() {
      const nowIsFirst = this.active == 0;
      this.getHasBindInfo().then(data => {
        console.log(this.active);
        switch (this.active) {
          case 0:
            if (!data.tsUserWxInfo.mpAppid) {
              if (data.isAuthorizeMsg) {
                this.authFail = true;
                this.$utils.logDog('mp_authFail_show');
              } else {
                this.$utils.postMessage({
                  type: 'error',
                  message: '请先完成公众号授权，再进行下一步操作！',
                });
              }
              return;
            } else {
              this.active = 1;
            }
            break;
          case 1:
            // 绑定了小程序后，点击下一步自动绑定开放平台
            if (data.tsUserWxInfo.appAppid) {
              this.bindOpenPlantform();
            } else {
              if (data.isAuthorizeMsg) {
                this.isBindOtherPlatform = data.isBindOtherPlatform;
                this.isBindOtherPlatform
                  ? this.$utils.logDog('app_otherFail_show')
                  : this.$utils.logDog('app_openFail_show');
                this.authFail = true;
              } else if (!nowIsFirst) {
                this.$utils.postMessage({
                  type: 'error',
                  message: '请先完成小程序授权，再进行下一步操作！',
                });
              }
            }
            break;
          case 3:
            if (this.finishBinding) {
              window.location.reload();
            } else if (!this.mpTxtName) {
              this.$utils.postMessage({
                type: 'error',
                message: '请上传文件后，再进行下一步操作！',
              });
            } else if (!this.tempId) {
              this.$utils.postMessage({
                type: 'error',
                message: '请填写模板id',
              });
            }
            break;
        }
      });
    },
    /**
     * 返回上一页
     * @description 用location.reload方法的话,导航也会闪一下,因此改为changeRouter的方式
     * @author tomato
     * @date 2020-04-10
     */
    backAuthorize() {
      this.$store.commit('router/setNeedReload', true);
      // this.$router.push(this.$route.name);
    },
    /**
     *看用户是否已经上传了txt文件，在授权域名的时候，微信那边要用到
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    async getHasUploadTxt() {
      const [err, response] = await getTxtList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const fileList = response.data;
      if (fileList.length > 0) {
        this.mpTxtName = fileList[0].name;
      } else {
        this.mpTxtName = '';
      }
      return Promise.resolve();
    },
    /**
     *获取绑定信息
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    getHasBindInfo() {
      return this.getHasUploadTxt().then(async () => {
        const isAvoidCheck = getUrlParam(document.URL, 'isAvoidCheck');
        const [err, response] = await getTsUserWxAuth();
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        const judgeData = response.data || {};
        if (Object.keys(judgeData.tsUserWxInfo).length <= 0 || !judgeData.tsUserWxInfo.mpAppid) {
          this.active = 0;
          this.$utils.logDog('mp_auth_show');
        } else {
          // 没有授权小程序
          if (!judgeData.tsUserWxInfo.appAppid) {
            this.active = 1;
            this.$utils.logDog('app_auth_show');
          } else if (!judgeData.tsUserWxInfo.isBindOpen && !isAvoidCheck) {
            // 没有授权开放平台
            this.bindOpenPlantform().then(res => {
              if (res && res.success) {
                this.appOpenAppid = 'xxxx';
              }
            });
          } else {
            this.active = 3;
          }
        }
        return Promise.resolve(judgeData);
      });
    },
    /**
     *获取绑定的二维码
     * @author tomato
     * @date 2020-04-10
     * @param {number} [type=1]
     */
    getBindUrl(type = 1) {
      const timestamp = new Date().getTime();
      const isAvoidCheck = getUrlParam(document.URL, 'isAvoidCheck') || false;
      this.binMpUrl = `/rest/manage/wxopen/getAuthWxQr?authType=${type}&isAvoidCheck=${isAvoidCheck}&v=${timestamp}`;
    },
    /**
     *刷新二维码
     * @author tomato
     * @date 2020-04-10
     */
    reflashQrcode(type) {
      this.getBindUrl(type);
    },
    /**
     *点击设置模板Id
     * @author tomato
     * @date 2020-04-10
     */
    setTempId() {
      this.isShowTemplateIdPopup = true;
    },
    /**
     *改变模板Id
     * @author tomato
     * @date 2020-04-10
     * @param {*} tempId
     */
    changeTempId(tempId, isSave) {
      if (isSave) {
        this.tempId = tempId;
      }
      this.isShowTemplateIdPopup = false;
    },
    /**
     *获取消息模板Id
     * @author tomato
     * @date 2020-04-10
     */
    async getTempId() {
      const that = this;
      const [err, res] = await getMpOneTimeSubMsgTempId();
      if (err) {
        return Promise.reject(err);
      }
      const data = res;
      if (data?.data?.template_id) {
        that.tempId = data.data.template_id;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.step_wrap_box {
  width: 650px;
  padding-top: 46px;
  margin: 0 auto;
  .titleSet {
    display: block;
    width: 100%;
    padding-top: 8px;
    font-size: 14px;
  }
}

.authorizeContent {
  width: 650px;
  margin: 40px auto;
  .uploadTxt {
    width: 690px;
    margin: 0 auto;
    margin-top: 20px;
    p {
      text-align: left;
      &.boldContent {
        text-align: center;
      }
      &:nth-child(n + 2) {
        margin-top: 8px;
      }
    }
    .uploadComponent {
      margin-top: 20px;
      .fileName {
        margin-left: 16px;
      }
    }
  }
  p {
    text-align: center;
  }
  .detail_info {
    font-size: 14px;
    color: $color-53;
  }
  .authorize_official {
    width: 650px;
    margin: 0 auto;
  }
  .authorize_mp {
    display: flex;
    justify-content: center;
    .authorize_info {
      width: 900px;
      margin: 0 auto;
      margin-top: 20px;
      .detail_info {
        text-align: left;
        &:nth-child(n + 2) {
          margin-top: 8px;
        }
      }
    }
  }
  .authorTip {
    margin-bottom: 8px;
    // font-family: MicrosoftYaHei;
    font-size: 14px;
    line-height: 19px;
    color: $color-53;
    &.textLeft {
      text-align: center;
    }
  }
  .bindQrcode {
    display: flex;
    margin-top: 14px;
    justify-content: center;
    align-items: center;
  }
  .authorQr {
    margin-right: 26px;
    margin-left: 48px;
    font-size: 14px;
  }
  .authorizeImg {
    position: relative;
    width: 162px;
    height: 162px;
    margin: 20px auto;
    border: 1px solid $border-disabled-color;
  }
  .authorQrcode {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 150px;
    transform: translate(-50%, -50%);
  }
  .authorGuide {
    width: 325px;
    height: 192px;
    background: url('~@/assets/image/comm/authGuide.png') no-repeat;
    background-size: cover;
  }
  .authorize_plantform {
    .bindFail {
      .detail_info {
        margin-top: 20px;
      }
    }
    .bindSucess p:nth-child(2) {
      margin-top: 12px;
    }
  }
  .authorize_official .boldContent,
  .authorize_mp .boldContent {
    margin-bottom: 20px;
  }
}

.detail_item {
  position: relative;
  margin-top: 1rem;
  font-size: 16px;
  color: #247af3;
  .icon {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    margin-left: -1.5rem;
  }
  p {
    color: $color-00;
    span {
      margin-left: 10px;
      color: $error-color;
    }
  }
}
</style>

<style lang="scss">
.step_wrap_box {
  .el-steps {
    &.activeBind_1 {
      .el-step {
        &:nth-child(1) {
          .el-step__line {
            background-image: linear-gradient(to right, #eeeeee, #247af3);
          }
        }
      }
    }
    &.activeBind_2 {
      .el-step {
        &:nth-child(2) {
          .el-step__line {
            background-image: linear-gradient(to right, #eeeeee, #247af3);
          }
        }
      }
    }
  }
  .el-step__title {
    color: $color-53;
  }
  .el-step__head {
    &.is-wait {
      .el-step__title {
        color: $color-b2;
      }
    }
  }
  .el-step__line {
    color: $border-disabled-color;
    background: $border-disabled-color;
    border: none;
  }
}
</style>

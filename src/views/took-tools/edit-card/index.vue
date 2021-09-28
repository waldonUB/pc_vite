<!--
 * @Description  : 我的名片
 * @Author       : turbo
 * @Date         : 2021-03-04 16:33:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-11 15:13:02
-->

<template>
  <div class="editCardSetting_now">
    <global-ts-header>
      <template v-slot:leftPart> 我的名片<ts-question-mark @click="showBigImg"></ts-question-mark> </template>
    </global-ts-header>
    <div class="header">
      <ts-big-img :imgSrc="bigTitleImg" :isOpen.sync="isOpenImg" imgKey="1" ref="tanshuBigImg"></ts-big-img>
      <div class="myCardData flexBox" v-show="!isOpenImg">
        <div class="leftPart cardInGrey">
          <div class="innerBox flexBox">
            <div>
              <p class="dataTitle">今日名片访问数</p>
              <p class="dataNumber">{{ pageData.todayClickViewer }}</p>
            </div>
            <div>
              <p class="dataTitle">累计名片访问人数</p>
              <p class="dataNumber">{{ pageData.totalClickViewer }}</p>
            </div>
          </div>
        </div>
        <div class="rightPart cardInGrey">
          <div class="innerBox flexBox">
            <div>
              <p class="dataTitle">今日名片转发人数</p>
              <p class="dataNumber">{{ pageData.todayShares }}</p>
            </div>
            <div>
              <p class="dataTitle">累计名片转发人数</p>
              <p class="dataNumber">{{ pageData.totalShares }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="showBody flexBox pro_listBox cardInGrey">
      <div class="iframeTarget">
        <global-ts-phoneiframe
          ref="phoneIframe"
          ref-name="phoneIframe"
          :src="iframeUrl"
          :fill-scroll="true"
          :iframeType="2"
          :title-color="getThemeColor"
          @loaded="loading"
        >
          <template #header>
            <div>标题</div>
          </template>
        </global-ts-phoneiframe>
      </div>
      <div class="textIntroduce">
        <div class="cardTargetInfo">
          <p class="introduce">
            <span>你好，这是专属于你的</span>
            <span class="bluePart">智能名片</span>
          </p>
          <p class="littleTips">扫描下方小程序码，将你的名片装进口袋</p>
          <div class="yourCardPic">
            <img :src="previewQrcode" />
          </div>
          <div class="downLoadQrcode">
            <a :href="downloadAddress" @click="fpdLogDown">
              <global-ts-svg-icon class="icon icon_16" name="icon-xiazai1616" />
              下载小程序码
            </a>
          </div>
          <div class="flex buttonBox">
            <global-ts-button type="primary" style="margin-right: 12px;" size="medium" ref="button" @click="editMyself">
              编辑我的名片
            </global-ts-button>
            <el-popover placement="top" trigger="hover">
              <div class="editCade_imgBox">
                <p class="text">效果预览</p>
                <img class="helpGif" :src="helpGif" />
              </div>
              <el-button class="helpButton" slot="reference" plain @click="jumptoHelp">
                配置到企业微信
              </el-button>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tree, Popover, Button } from 'element-ui';
import bigTitleImg from '@/assets/image/directSale/myCard.png';
import helpGif from '@/assets/image/editCard.gif';
import { mapState } from 'vuex';
import { post, loading } from '@/utils';
import TsQuestionMark from '@/components/base/ts-question-mark/index.vue';
import TsBigImg from '@/components/base/ts-big-img/index.vue';
import {
  getNowCardStatData,
  getPreviewQr,
  getTsGuideList,
  saveTsGuide,
  getCardTempPreviewData,
  getMyCardPreviewData,
} from '@/api/modules/views/customer-tools/edit-card';

export default {
  name: 'EditCard',
  components: {
    [Tree.name]: Tree,
    [Popover.name]: Popover,
    [Button.name]: Button,
    TsQuestionMark,
    TsBigImg,
  },
  data() {
    return {
      isNeedSendFlag: false,
      isOpenImg: false,
      pageData: {
        todayClickViewer: 0,
        totalClickViewer: 0,
        todayShares: 0,
        totalShares: 0,
      },
      previewQrcode: '',
      downloadAddress: '',
      contentWindow: null,
      mainWindow: null,
      cacheInfo: {
        appName: '',
        isOpenApp: false,
        articleList: [],
        clickCardViewerCount: '',
        clickViewers: [],
        viewStat: {
          clickCardViewerCount: '',
          isViewerClickCard: false,
          likeCardViewerCount: '',
        },
        corpImgList: [],
        isShowChat: true,
        isViewerClickCard: false,
        likeCardViewerCount: [],
        productList: [],
        tsCard: {
          name: '',
          headImgUrl: '',
          mobile: '',
          wx: '',
          qq: '',
          email: '',
          background: 0,
          brief: '',
          briefModuleName: '',
          cardBackgroundType: 0,
          cardBackgroundUrl: '',
          cardFontColorType: 0,
          chatModuleName: '',
          company: '',
          companyModuleName: '',
          fontColor: '',
          informationModuleName: '',
          pattern: 0,
          position: '',
          productModuleName: '',
          showBriefModule: 'open',
          showImModule: 'open',
          showMyArticle: 'open',
          showMyCompanyModule: 'open',
          showMyProductModule: 'open',
        },
        moduleList: [],
        labelList: [],
        addLabelInfoList: [],
        delLabelList: [],
        nowImgIdList: [],
        delImgIdList: [],
        navigationBarList: [],
      },
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    iframeUrl() {
      return this.$store.getters.tsportalUrlProxy + '/preview.jsp';
    },
    bigTitleImg() {
      return bigTitleImg;
    },
    getThemeColor() {
      if (this.cacheInfo.tsCard.cardThemeColorType === 0) {
        // return this.isOem ? 'rgba(53,156,83,1)' : 'rgba(36,122,243,1)';
        return 'rgba(36,122,243,1)';
      }
      return this.cacheInfo.tsCard.themeColor;
    },
    helpGif() {
      return helpGif;
    },
  },
  created() {
    this.getNowCardStatData();
    this.getPreviewQr();
    this.getTsGuideList();

    loading.addQuene({
      key: 'loadingPreviewWindow',
    });
    Promise.all([this.getCardData(), this.checkIframeLoading()]).then(res => {
      // 首次需要等待window onload之后才能操作分
      this.contentWindow.loading = false;
      this.contentWindow.shareTicket = this.ticket;
      this.contentWindow.bottomLineInfo = {
        appName: this.cacheInfo.appName,
        isOpenApp: this.cacheInfo.isOpenApp,
      };
      window.exposeApi = {
        updatePosition: () => {},
      };
      this.contentWindow.nowProduct = 1;
      this.contentWindow.mainStore.customVist.commit('injectRequest', {
        ticket: this.ticket,
      });
      const userBaseInfo = this.contentWindow.mainStore.userBaseInfo;
      userBaseInfo.commit(
        'updateViewStat',
        Object.assign(
          {
            clickViewers: this.cacheInfo.clickViewers,
          },
          this.cacheInfo.viewStat,
        ),
      );
      userBaseInfo.commit('updateBaseInfo', this.cacheInfo.tsCard);
      userBaseInfo.commit('updateTagList', this.cacheInfo.labelList);
      userBaseInfo.commit('updatePhotoList', this.cacheInfo.corpImgList);
      userBaseInfo.commit('updateProductList', this.cacheInfo.productList);
      userBaseInfo.commit('updateMyArticleList', this.cacheInfo.articleList);
      this.contentWindow.productTotal = this.cacheInfo.productList.length;
      this.contentWindow.mainStore.productDetail.commit('setNowProduct', 1);
      this.contentWindow.$store.commit('setModuleNameByModuleList', this.cacheInfo.moduleList);
      this.contentWindow.moduleList = this.cacheInfo.moduleList;
      this.contentWindow.navigationBarList = this.cacheInfo.navigationBarList;

      setTimeout(() => {
        this.$refs.phoneIframe.updateScroll();
      }, 100);
    });
  },
  methods: {
    async getCardData() {
      const _ajax = this.isModel ? getCardTempPreviewData : getMyCardPreviewData;
      const [err, res] = await _ajax();
      if (err) {
        return Promise.reject(err);
      }
      const realCacheInfo = {};
      const responseData = res.data;
      Object.keys(this.cacheInfo).forEach(ele => {
        if (responseData[ele]) {
          realCacheInfo[ele] = responseData[ele];
        } else {
          realCacheInfo[ele] = this.cacheInfo[ele];
        }
      });
      this.cacheInfo = { ...realCacheInfo };
    },
    async getNowCardStatData() {
      const [err, res] = await getNowCardStatData();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.pageData = { ...res.data };
    },
    async getPreviewQr() {
      const [err, res] = await getPreviewQr();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.previewQrcode = res.data.previewUrl;
      this.downloadAddress = res.data.downloadAddress;
    },
    async getTsGuideList() {
      const [err, response] = await getTsGuideList({
        // 因为articleMaterial页面create的时候以及监听路由跳转的时候都会调用这个方法
        // 因此加参数区分
        unique: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isOpenImg = !response.data.guideList[10];
      if (this.isOpenImg) {
        this.saveTsGuide();
      }
    },
    async saveTsGuide() {
      const [err, res] = await saveTsGuide({
        step: 10,
      });
      if (err) {
        return Promise.reject(err);
      }
    },
    jumptoHelp() {
      if (this.isOem) {
        window.open('https://adm.webportal.top/sys/view.jsp?id=1807', '_blank');
      } else {
        window.open('https://kht.fkw.com/blog/56854/', '_blank');
      }
    },
    fpdLogDown() {
      this.$utils.FdpLog('yx_djxzewm');
    },
    editMyself() {
      window.open(`${this.$store.getters.tsportalUrl}/editCard.jsp?type=mySelf`);
    },
    showBigImg() {
      this.isOpenImg = !this.isOpenImg;
    },
    loading() {
      this.hasLoadContent = true;
      loading.poupQuene('loadingPreviewWindow');
      console.log(this.$refs.phoneIframe);
      this.mainWindow = this.$refs.phoneIframe.$refs.phoneIframe.contentWindow;
      this.contentWindow = this.mainWindow.getCurrentPages()[0];
    },
    checkIframeLoading() {
      const chekStatus = resloveFn => {
        if (this.hasLoadContent) {
          resloveFn();
        } else {
          setTimeout(() => {
            chekStatus(resloveFn);
          }, 100);
        }
      };
      return new Promise(reslove => {
        chekStatus(reslove);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.editCardSetting_now {
  .header {
    .myCardData {
      justify-content: space-between;
      .leftPart {
        margin-right: 20px;
      }
      & > div {
        position: relative;
        width: 49%;
        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: 48px;
          background: $border-disabled-color;
          content: ' ';
          transform: translate(-50%, -50%);
        }
        .dataTitle {
          font-size: 14px;
          color: $color-53;
          text-align: center;
        }
        .dataNumber {
          padding-top: 12px;
          font-size: 24px;
          color: $color-00;
          text-align: center;
        }
      }
      .innerBox {
        & > div {
          width: 50%;
          padding: 30px 0;
        }
      }
    }
  }
  .pro_listBox {
    padding: 40px 20px;
  }
  .showBody {
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    .iframeTarget {
      width: 320px;
      height: 570px;
      margin-right: 100px;
      .ts-phoneIframe {
        &.phoneBox {
          &.iframeTyle_2 {
            border: 1px solid $border-disabled-color;
            border-radius: 4px;
            opacity: 1;
          }
        }
      }
    }
    .cardTargetInfo {
      .introduce {
        font-size: 28px;
        font-weight: bold;
        color: $color-00;
        .bluePart {
          color: #247af3;
        }
      }
      .littleTips {
        margin-top: 16px;
        font-size: 14px;
        color: $color-53;
        text-align: center;
      }
      .yourCardPic {
        width: 220px;
        height: 220px;
        margin: 0 auto;
        margin-top: 30px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .downLoadQrcode {
        margin-top: 12px;
        color: $color-89;
        text-align: center;
        text-decoration: none;
        a {
          color: $color-89;
          text-decoration: none;
          &:hover {
            color: #247af3;
          }
        }
        .icon {
          margin-right: 0;
          font-size: 14px;
        }
        &:hover {
          color: #247af3;
        }
      }
    }
    .buttonBox {
      margin-top: 30px;
      .tanshu-button {
        &.tanshu-button-size-medium {
          width: 160px;
        }
        &.tanshu-button-type-others {
          &:hover {
            color: #247af3;
            background-color: #ffffff;
            border: 1px solid #247af3;
            span {
              color: #247af3;
            }
          }
        }
      }
    }
  }
  .cardTargetInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .helpButton {
    width: 160px;
  }
}
.editCade_imgBox {
  width: 225px;
  height: 431px;
  text-align: center;
  .text {
    margin-bottom: 12px;
  }
  .helpGif {
    width: 225px;
    height: 400px;
    border: 1px solid $border-disabled-color;
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
.editCardSetting_now .helpButton.el-button.is-plain:focus,
.editCardSetting_now .helpButton.el-button.is-plain:hover {
  color: #4297ff;
  border-color: #4297ff;
}
</style>

<!--
 * @Description  : 首页内容
 * @Author       : turbo
 * @Date         : 2021-05-27 17:32:27
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-21 10:12:06
-->

<template>
  <div class="index-manage-box">
    <div class="index-manage-box__left">
      <div class="index-manage-box__workspace">
        <div class="index-manage-box__workspace__title">
          <div>
            <global-ts-header auto-height no-margin>
              <template #leftPart>
                <div>工作台</div>
              </template>
            </global-ts-header>
            <div v-if="isOpenIntegralCal" class="index-manage-box__workspace__time">
              <p>
                排名：{{ myPointInfo.ranking }}
                <span v-html="'\u00a0\u00a0'"></span>
                积分：{{ myPointInfo.total }}
              </p>
            </div>
          </div>
          <div class="index-manage-box__workspace__search">
            <ts-select-list
              v-if="isNoOneSelfDataAuth"
              :width="120"
              :select-type="1"
              :dep-id-list.sync="requestParam.depIdList"
              :sids.sync="requestParam.sidListStr"
            >
            </ts-select-list>
            <global-ts-date-picker default-start-time="week" @updateTime="getSearchTime"></global-ts-date-picker>
            <global-ts-button class="searchBtn" type="primary" size="small" icon="icon-icon-4" @click="getIndexData">
              搜索
            </global-ts-button>
          </div>
        </div>
        <div class="index-manage-box__workspace__content">
          <div class="content">
            <div class="content-item">
              <div class="item-name">新增线索</div>
              <div class="item-data">{{ newTsVisitorsTotal }}</div>
            </div>
            <div class="content-item">
              <div class="item-name">新增客户</div>
              <div class="item-data">{{ newTsClientTotal }}</div>
            </div>
            <div class="content-item">
              <div class="item-name">新增订单</div>
              <div class="item-data">{{ newTsOrderTotal }}</div>
            </div>
            <div class="content-item">
              <div class="item-name">订单金额</div>
              <div class="item-data">{{ orderTotalPrice }}</div>
            </div>
          </div>
          <div class="work-man"></div>
        </div>
      </div>
      <div class="index-manage-box__features">
        <global-ts-header auto-height no-margin>
          <template #leftPart>
            <div>常用功能</div>
          </template>
        </global-ts-header>
        <div class="index-manage-box__features__card">
          <feature-card
            v-for="(item, index) in cardData"
            :key="index"
            :type="item.type"
            :img-src="item.imgSrc"
            :title="item.title"
            :main-desc="item.mainDesc"
            :bottom-desc="item.bottomDesc"
            :card-row-data="item"
            @toIntroductPage="toIntroductPage"
          >
          </feature-card>
        </div>
      </div>
      <div class="index-manage-box__features">
        <global-ts-header auto-height no-margin>
          <template #leftPart>
            <div>更多功能</div>
          </template>
        </global-ts-header>
        <div class="index-manage-box__features__card">
          <feature-card
            v-for="(item, index) in moreCardData"
            :key="index"
            :type="item.type"
            :img-src="item.imgSrc"
            :title="item.title"
            :main-desc="item.mainDesc"
            :bottom-desc="item.bottomDesc"
            :card-row-data="item"
            @toIntroductPage="toIntroductPage"
          >
          </feature-card>
        </div>
      </div>
    </div>
    <div class="index-manage-box__right">
      <global-ts-version-tip @upGrade="upGrade"></global-ts-version-tip>
      <div class="index-manage-box__message">
        <div class="qr-box" :class="{ noHelpUrl: !isShowHelp }">
          <img class="qr-img" :src="realMpQr" />
          <div class="qr-desc">
            <div class="qr-desc-title">扫码使用小程序</div>
            <div class="qr-desc-item">创建和转发文章获客</div>
            <div class="qr-desc-item">打造销售名片获客</div>
            <div class="qr-desc-item">雷达实时提醒</div>
            <div class="qr-desc-item">全员营销赋能</div>
          </div>
        </div>
        <div v-if="!isOem" class="dynamic-box">
          <global-ts-header auto-height>
            <template #leftPart>
              <div>最新动态</div>
            </template>
            <template #rightPart>
              <a href="javascript:;" @click="toMore('dynamic')">更多动态</a>
            </template>
          </global-ts-header>
          <ts-carousel v-if="!isOem" height="120px" :list="imgList" :interval="5000" @change="carouselChange">
            <template #imgItem>
              <img :src="imgItem.item.img" @click="clickImg(imgItem.item)" />
            </template>
          </ts-carousel>
          <div class="com-desc-list">
            <div class="com-desc-item" v-for="(item, index) in dynamicList" :key="index" @click="articleJump(item)">
              <global-ts-svg-icon v-if="item.addLab" name="icon-xin" color="#FF4D4D"></global-ts-svg-icon>
              {{ item.title }}
            </div>
          </div>
        </div>
        <div v-if="otherBoxList && otherBoxList.length && isShowHelp" class="other-box">
          <global-ts-header auto-height>
            <template #leftPart>
              <div>常见问题和使用技巧</div>
            </template>
            <template #rightPart>
              <a href="javascript:;" @click="toMore('other')">查看更多</a>
            </template>
          </global-ts-header>
          <div class="com-desc-list">
            <div class="com-desc-item" v-for="(item, index) in otherBoxList" :key="index" @click="hotArticleJump(item)">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

// components
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsCarousel from '@/components/base/ts-carousel/index.vue';
import FeatureCard from './feature-card.vue';

// utils
import { recordClick, getConfInfo } from '@/utils';

// api
import { indexManage, integral } from '@/api';

export default {
  name: 'IndexManageBox',
  components: { TsSelectList, TsCarousel, FeatureCard },
  props: {
    realMpQr: {
      // 二维码
      type: String,
    },
  },
  data() {
    return {
      isOpenIntegral: false, // 是否开启了销售积分
      myPointInfo: {
        ranking: 1, // 排名
        total: 1, // 积分
      },
      cardData: [], // 卡片
      moreCardData: [], // 更多卡片
      requestParam: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        sidListStr: '[]', // 多名员工
        depIdList: '', // 部门
      },
      newTsVisitorsTotal: 0, // 新增访客
      newTsClientTotal: 0, // 新增客户
      newTsOrderTotal: 0, // 新增订单
      orderTotalPrice: 0, // 订单金额
      imgList: [], // 轮播图
      dynamicList: [], // 最新动态文章
      otherBoxList: [], // 使用技巧文章
      articleTypeMap: new Map([
        [
          'dynamic',
          {
            logDogKey: 'home_clickMoreActive',
            url: this.functionUpdateUrl,
          },
        ],
        [
          'other',
          {
            logDogKey: 'home_clickMoreArticle',
            url: this.portalHelpUrl,
          },
        ],
      ]),
    };
  },
  computed: {
    ...mapState({
      sid: state => state.user.info.sid,
      isOem: state => state.user.info.isOem,
      isShowTreeTry: state => state.user.info.isShowTreeTry,
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl,
      portalHelpUrl: state => state.globalData.addressUrl?.portalHelpUrl,
      functionUpdateUrl: state => state.globalData.addressUrl?.functionUpdateUrl,
    }),
    ...mapGetters({
      isManage: 'user/isManage',
      isShowHelp: 'user/isShowHelp',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    isOpenIntegralCal() {
      let hasIntegralPermission = true;
      const integralItem = this.moreCardData.find(item => item.type === 'integral');
      if (integralItem) {
        hasIntegralPermission = integralItem.auth && integralItem.auth.isCanJump;
      }
      return this.isOpenIntegral && !!hasIntegralPermission;
    },
  },
  mounted() {
    this.initData();
    this.isShowTreeTry && this.$utils.logDog('index_Open_show');
  },
  methods: {
    /**
     * 页面初始化加载的方法
     * @author enson
     * @date 2020-04-10
     */
    initData() {
      this.requestParam.sid = this.isManage ? -1 : this.sid; // 跟进员工
      this.getPointInfo();
      this.getIndexCardData();
      this.$nextTick(() => {
        this.getIndexDataStatList();
        this.getImgList();
        this.getIndexArticle();
      });
      try {
        for (const item of [...this.dynamicList, ...this.otherBoxList]) {
          recordClick({
            dogId: item.exposureJson.dogId,
            srcId: item.exposureJson.srcId,
          });
        }
      } catch (e) {
        console.error(`打曝光的log报错：${e}`);
      }
    },
    /**
     * @description 获取销售积分相关信息
     * @author enson
     * @date 2020-11-03
     */
    async getPointInfo() {
      const confInfo = await getConfInfo();
      this.isOpenIntegral = confInfo.isOpenIntegral;
      if (!this.isOpenIntegral) return;
      this.getMyPointInfo();
    },
    async getMyPointInfo() {
      const { getIntegralInfo } = integral;
      const [err, res] = await getIntegralInfo();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.myPointInfo = res.data;
    },
    /**
     *
     * 获取卡片数据
     * @author enson
     * @date 2020-04-10
     */
    async getIndexCardData() {
      const { getPortalIndexConfList } = indexManage;
      const [err, res] = await getPortalIndexConfList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { cardData, moreCardData } = res.data;
      this.cardData = cardData;
      this.moreCardData = moreCardData;
    },
    /**
     * 点击搜索 获取工作台数据
     * @author enson
     * @date 2020-04-10
     */
    getIndexData() {
      this.$utils.logDog('home_clickSearch');
      if (!this.requestParam.startTime || !this.requestParam.endTime) {
        this.$utils.postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.getIndexDataStatList();
      }
    },
    async getIndexDataStatList() {
      const { getIndexDataStatList } = indexManage;
      const [err, res] = await getIndexDataStatList(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { newTsClientTotal, newTsOrderTotal, newTsVisitorsTotal, orderTotalPrice } = res.data;
      this.newTsClientTotal = newTsClientTotal;
      this.newTsOrderTotal = newTsOrderTotal;
      this.newTsVisitorsTotal = newTsVisitorsTotal;
      this.orderTotalPrice = parseFloat(orderTotalPrice).toFixed(2);
    },
    /**
     * 重置时间
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.startTime = val ? val[0] : '';
      this.requestParam.endTime = val ? val[1] : '';
    },
    toIntroductPage(type) {
      this.$emit('toIntroductPage', type);
    },
    upGrade() {
      window.open(this.updateVersionUrl);
    },
    toMore(type) {
      const articleType = this.articleTypeMap.get(type);
      this.$utils.logDog(articleType.logDogKey);
      window.open(articleType.url);
    },
    /*
     * 获取首页轮播图
     * @author: enson
     * @date: 2020-06-19 14:31:03
     */
    async getImgList() {
      if (this.isOem) return;

      const { getAdvertisementList } = indexManage;
      const [err, res] = await getAdvertisementList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.imgList = res.data;
    },
    /**
     * @description : 获取首页右侧文章
     * @author      : turbo
     * @Date        : 2021-06-02 10:24:31
     */
    async getIndexArticle() {
      const { getIndexArticle } = indexManage;
      const [err, res] = await getIndexArticle();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { dynamicList, otherBoxList } = res.data;
      this.dynamicList = dynamicList;
      this.otherBoxList = otherBoxList;
    },
    /**
     * 轮播图切换的回调
     * @author enson
     * @date 2020-06-19
     * @param {*} newKey - 当前的轮播图index
     * @param {*} oldKey - 之前的轮播图index
     * @param {*} currentItem - 当前的数据
     */
    carouselChange(newKey, oldKey, currentItem) {
      if (!currentItem.remark.isShowed) {
        currentItem.remark.isShowed = true;
        recordClick(currentItem.remark.exposure);
      }
    },
    /**
     * 点击了轮播图片
     * @author enson
     * @date 2020-06-19
     */
    clickImg(item) {
      window.open(item.url);
      recordClick(item.remark.click);
    },
  },
};
</script>

<style lang="scss" scoped>
.index-manage-box {
  display: flex;

  .index-manage-box__left {
    width: calc(100% - 320px);
  }

  .index-manage-box__workspace {
    padding-right: 20px;
  }

  .index-manage-box__workspace__title {
    @include flex-between;

    position: relative;
    z-index: 10;
    height: 54px;
  }

  .index-manage-box__workspace__time {
    margin-top: 20px;
    font-size: 14px;
    color: $color-53;
  }

  .index-manage-box__workspace__search {
    display: flex;

    ::v-deep .tanshu-selectList {
      margin-right: 10px;
    }
  }

  .index-manage-box__workspace__content {
    @include flex-left;
    @include card-in-gray;

    position: relative;
    height: 143px;
    margin-top: 20px;

    .content {
      display: flex;
      width: calc(100% - 273px);
      min-width: 550px;
    }

    .content-item {
      text-align: center;
      border-right: 1px solid $color-ee;
      box-sizing: border-box;
      flex: 1;
    }

    .item-name {
      font-size: 16px;
      color: $color-53;
    }

    .item-data {
      @include ellipsis;

      margin-top: 12px;
      font-size: 24px;
      line-height: 24px;
      color: $color-00;
    }

    .work-man {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 273px;
      height: 263px;
      background: url('~@/assets/image/indexManage/workMan.png') no-repeat bottom right;
    }
  }

  .index-manage-box__features {
    margin-top: 30px;

    &:last-child {
      .index-manage-box__features__card {
        flex-wrap: wrap;
      }
    }
  }

  .index-manage-box__features__card {
    display: flex;
  }

  .index-manage-box__right {
    width: 320px;
  }

  .index-manage-box__message {
    @include card-in-gray;

    padding: 20px;

    .qr-box {
      @include flex-center;

      padding-bottom: 20px;
      border-bottom: 1px solid $color-ee;

      &.noHelpUrl {
        padding: 0;
        border: 0 none;
      }
    }

    .qr-img {
      width: 140px;
      height: 140px;
    }

    .qr-desc {
      margin-left: 20px;
      line-height: 16px;
      text-align: left;
    }

    .qr-desc-title {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: bold;
      color: $color-00;
    }

    .qr-desc-item {
      margin-bottom: 8px;
      font-size: 12px;
      color: $color-89;
    }

    .dynamic-box {
      padding: 20px 0;
      border-bottom: 1px solid $color-ee;
    }

    .other-box {
      padding-top: 20px;
    }

    .com-desc-item {
      @include ellipsis;

      margin-top: 12px;
      font-size: 14px;
      line-height: 20px;
      color: $color-89;
      cursor: pointer;

      &:hover {
        color: $primary-color;
      }

      &:first-child {
        margin-top: 20px;
      }
    }
  }
}
</style>

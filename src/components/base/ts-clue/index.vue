<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:44:47
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-20 12:32:25
-->
<template>
  <div id="clue" class="clue" :class="clueClassCal" v-tsDebounce="[ieScroll, 'scroll', 50]">
    <span class="nothingText" v-if="nothingPageShowCal && !isCustomAnalysis">{{ emptyTips }}</span>
    <a v-if="!isHaveVersion && !isFollow" :href="updateVersionUrl" target="_blank">立即升级</a>
    <div class="nothingText nothingShop" v-if="nothingPageShowCal && isCustomAnalysis">
      <img class="imgNoShop" v-if="noshop && isCustomAnalysis" :src="noshop" />
      <span class="textColor">{{ emptyTips }}</span>
    </div>
    <a v-if="!isHaveVersion && !isFollow" :href="updateVersionUrl" target="_blank">立即升级</a>
    <div id="topFlag" class="topFlag"></div>
    <div class="cluePartWrapper" v-if="(slideVal === 0 && actionList.length) || isFollow">
      <div class="cluePart" v-for="(item, index) in actionList" :key="index">
        <div class="splitDay">
          <span class="date">{{ item.date }}</span>
          <span :class="getDateTip(item.date) ? 'dateTip' : ''">{{ getDateTip(item.date) }}</span>
        </div>
        <div class="splitDayWrapper">
          <div class="subItem" v-for="(subItem, subIndex) in item.list" :key="subIndex">
            <div class="actionBox" v-if="!isFollow">
              <div class="mainActionBox" :class="subItem.list && subItem.list.length ? 'withSubAction' : ''">
                <div class="mainLine">
                  <div class="typeName">{{ subItem.typeName }}</div>
                  <div class="actionFrom">{{ subItem.sidName }}</div>
                  <div class="createTimeName">{{ subItem.createTimeName }}</div>
                </div>
                <div class="subLine title" v-if="subItem.dataTitle">
                  <div class="labelTip">标题：</div>
                  <div class="content" :class="subItem.isImg ? 'imgContent' : ''" @click.stop="previewImg(subItem)">
                    {{ subItem.dataTitle }}
                  </div>
                </div>
                <div
                  class="subLine duration"
                  v-if="getIsShowDuration(subItem.type)"
                  :class="subItem.dataTitle ? '' : 'withoutTitle'"
                >
                  <div class="labelTip">时长：</div>
                  <div class="content">{{ subItem.visitTimeName }}</div>
                </div>
              </div>
              <div class="subActionBox" v-if="subItem.list && subItem.list.length">
                <div class="subTitle">TA还做了以下行为</div>
                <div class="subActionWrapper">
                  <div class="subActionLine" v-for="(thirdItem, thirdIndex) in subItem.list" :key="thirdIndex">
                    <div class="actionTag">{{ thirdItem.typeName.slice(0, 2) }}</div>
                    <div class="actionText">{{ thirdItem.typeName }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="actionBox" v-else>
              <div class="mainActionBox">
                <div class="titleBox mainLine">
                  <div class="typeName">{{ subItem.typeName }}</div>
                  <div class="actionFrom">{{ subItem.sidName }}</div>
                  <div class="createTimeName">{{ subItem.createTimeName }}</div>
                </div>
                <div class="explainBox">
                  <!-- 签到的状态为5 -->
                  <div class="explain" v-if="subItem.type === 5">
                    <span class="no-break">定位：</span>
                    <div class="remark">{{ subItem.location }}</div>
                  </div>
                  <!-- 签到的状态为5，且无备注时隐藏 -->
                  <div class="explain" v-if="!(subItem.type === 5 && !subItem.remark)">
                    <span class="no-break">{{ followSubTypeNameCal(subItem.type) }}</span>
                    <span class="remark">{{ subItem.remark }}</span>
                  </div>
                  <div class="explain" v-if="subItem.visitTimeName">
                    下次跟进时间：
                    <span>{{ subItem.visitTimeName }}</span>
                  </div>
                  <div class="attachment-box explain" v-if="subItem.attachment.length">
                    <span class="no-break">附件：</span>
                    <!--这里的判断比较多，先跟着以前的逻辑加-->
                    <div class="attach-list-box">
                      <div
                        class="attach-list"
                        :class="[
                          {
                            'attach-list-doc-wrapper':
                              !(attachItem.isImg && attachItem.del === 0) &&
                              !(attachItem.isImg && [1, 2].includes(attachItem.del)),
                          },
                        ]"
                        v-for="attachItem in subItem.attachment"
                        :key="attachItem.size"
                      >
                        <img
                          class="attach-img"
                          v-if="attachItem.isImg && attachItem.del === 0"
                          :src="attachItem.content"
                          @click="previewImg(attachItem)"
                        />
                        <div
                          v-else-if="attachItem.isImg && [1, 2].includes(attachItem.del)"
                          class="lose-img"
                          @click="previewImg(attachItem)"
                        >
                          <svg class="err-img" aria-hidden="true">
                            <use xlink:href="#icon-tupiancuowu"></use>
                          </svg>
                        </div>
                        <el-tooltip v-else class="item" effect="dark" content="下载文件" placement="bottom">
                          <span
                            :class="['attach-list-doc', { 'del-doc': [1, 2].includes(attachItem.del) }]"
                            @click.stop="previewDoc(attachItem)"
                          >
                            {{ attachItem.name }}
                          </span>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="productWrapper" v-else-if="slideVal === 1">
      <div class="productPart">
        <div class="titleBox">
          <p class="title">意向商品TOP10</p>
        </div>
        <div class="intentionProduct" v-if="allMallRelList.length && !isFollow">
          <div class="productInfo" v-for="item in allMallRelList" :key="item.id">
            <div>
              <span class="productName">{{ item.productName }}</span>
              <span class="countNum">浏览次数</span>
              <span class="num">{{ item.visitCnt }}</span>
            </div>
            <div class="progressWrapper">
              <div class="progress" :style="{ width: (item.visitCnt / maxCnt) * 100 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="productWrapper" v-if="isCustomAnalysis && slideVal === 1 && !allMallRelList.length && !isFollow">
      <div class="productPart cusProductPart">
        <div class="titleBox">
          <p class="title">意向商品TOP10</p>
        </div>
      </div>
    </div>
    <div id="showInfoFlag" class="showInfoFlag"></div>
    <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
    <div class="nothingText nothingShop" v-if="nothingPageShowCal && isCustomAnalysis">
      <img class="imgNoShop" v-if="noshop && isCustomAnalysis" :src="noshop" />
      <span class="textColor">{{ emptyTips }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { Browser, format, postMessage } from '@/utils';
import tsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import { getViewerMallRelList } from '@/api/modules/component/clue';

export default {
  name: 'ts-clue',
  components: { tsPreviewPicture },
  props: {
    actionList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    slideVal: {
      type: Number,
      default: 0,
    },
    isFollow: {
      type: Boolean,
      default: false,
    },
    isCustomAnalysis: {
      type: Boolean,
      default: false,
    },
    noshop: {
      type: String,
      default: '',
    },
    viewerId: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      maxCnt: 0,
      allMallRelList: [], // 所有商品
      listObserve: null, // 上拉观察者
      showInfoFlag: null, // 更多数据
      topFlag: null, // 滑到顶部标识
      previewVisible: false, //显示预览图片弹窗
      previewImgUrl: '', //预览图片链接
    };
  },
  watch: {
    viewerId(newVal) {
      if (newVal) {
        this.unConnect();
        this.getMallRelList();
      }
    },
    actionList(newVal) {
      if (this.showInfoFlag && newVal.length) {
        this.$nextTick(() => {
          if (this.listObserve && !Browser.isIE) {
            // 兼容ie
            this.listObserve.observe(this.showInfoFlag);
          }
        });
      }
    },
  },
  computed: {
    ...mapState({
      updateVersionUrl: state => state.globalData?.addressUrl?.updateVersionUrl,
      isOem: state => state.user.info.isOem,
    }),
    isHaveVersion() {
      return versionDef.getFunctionLimit('clueAnalyse').condition;
    },
    clueClassCal() {
      return [this.nothingPageShowCal ? 'nothingClass' : '', this.isFollow ? 'withFollow' : ''];
    },
    emptyTips() {
      if (!this.isHaveVersion && !this.isFollow) {
        if (this.isOem) {
          return `当前版本无法使用此功能，请升级至${versionDef.getVersionName(
            versionDef.NotDirectVersionDef.VersionList.STANDARD,
          )}`;
        } else {
          return `当前版本无法使用此功能，请升级至${versionDef.getVersionName(
            versionDef.DirectVersionDef.VersionList.PROFESSIONNAL,
          )}`;
        }
      }
      if (this.isFollow) {
        return '暂无跟进记录';
      }
      switch (this.slideVal) {
        case 0:
          return 'TA还没有访问行为';
        case 1:
          return 'TA还没访问过商品';
      }
      return '';
    },
    /**
     * 是否显示缺省页
     * @author waldon
     * @date 2020/7/3
     * @returns {Boolean} - 是否显示缺省页
     */
    nothingPageShowCal() {
      if (!this.isHaveVersion && !this.isFollow) {
        return true;
      }
      if (this.isFollow) {
        return !this.actionList.length;
      }
      switch (this.slideVal) {
        case 0:
          return !this.actionList.length;
        case 1:
          return !this.allMallRelList.length;
        default:
          return true;
      }
    },
  },
  methods: {
    /**
     * 下载文档
     * @author han
     * @date 2021-03-22
     * @param {*} param - param
     */
    async previewDoc(item) {
      if ([1, 2].includes(item.del)) {
        const errMessage = item.del === 1 ? '文档已被删除' : '含违规信息，该附件已被删除';
        this.$utils.postMessage({
          type: 'error',
          message: errMessage,
        });
        return;
      }
      window.location.href = item.appDownloadPath;
    },
    /**
     * 预览图片
     * @author guoyijie
     * @date 2021-01-20
     * @param {Object} item
     */
    previewImg(item) {
      if ([1, 2].includes(item.del)) {
        const errMessage = item.del === 1 ? '图片已被删除' : '含违规信息，该附件已被删除';
        this.$utils.postMessage({
          type: 'error',
          message: errMessage,
        });
        return;
      }
      if (!item.isImg) {
        return;
      } else {
        this.previewVisible = true;
        this.previewImgUrl = item.imgUrl || item.content;
      }
    },
    /**
     * 二级跟进记录类型名
     * @author waldon
     * @date 2020-09-15
     * @param {String} type - 跟进类型
     */
    followSubTypeNameCal(type) {
      switch (type) {
        case 0:
          return '跟进内容：';
        case 1:
          return '修改字段：';
        case 2:
          return '短信内容：';
        case 5:
          return '备注：';
        default:
          return '跟进内容：';
      }
    },
    unConnect() {
      if (this.listObserve) {
        // 兼容ie
        this.listObserve.unobserve(this.showInfoFlag);
      }
    },
    /**
     * 初始化标识点
     * @author waldon
     * @date 2020-07-06
     */
    getScrollFlag() {
      this.$nextTick(() => {
        if (!this.showInfoFlag) {
          this.showInfoFlag = document.getElementById('showInfoFlag');
        }
        if (!this.topFlag) {
          this.topFlag = document.getElementById('topFlag');
        }
      });
    },
    /**
     * 是否显示时长
     * @author waldon
     * @date 2020/7/3
     * @param {*} type -
     * @returns {*} 是否显示时长
     */
    getIsShowDuration(type) {
      const hideTypeList = [
        501, // 下单商品
        502, // 购买商品
        503, // 退款商品
      ];
      return !hideTypeList.includes(type);
    },
    /**
     * 显示今天、昨天
     * @author waldon
     * @date 2020/7/2
     * @param {*} date -
     * @returns {*}
     */
    getDateTip(date) {
      if (format.date(new Date(), 'yyyy-MM-dd') === date) {
        return '今天';
      } else if (format.date(format.addDate(new Date(), -1, 'days'), 'yyy-MM-dd') === date) {
        return '昨天';
      } else {
        return '';
      }
    },
    /**
     * 获取意向商品
     * @author waldon
     * @date 2020/7/3
     */
    async getMallRelList() {
      if (!this.isHaveVersion) {
        return;
      }
      let viewerIdList = this.viewerId;
      if (typeof viewerIdList === 'number') {
        viewerIdList = JSON.stringify([viewerIdList]);
      }
      const params = {
        viewerIds: viewerIdList,
        // pageNow: 1,
        // limit: 10,
      };
      const [err, res] = await getViewerMallRelList(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return err;
      }
      this.allMallRelList = res.data;
      this.maxCnt = this.allMallRelList.length > 0 ? this.allMallRelList[0].visitCnt : 0;
    },
    /**
     * ie简单兼容的滚动方法
     * 后续再根据标志位判断显示加载
     * @author waldon
     * @date 2020/8/10
     */
    ieScroll() {
      if (Browser.isIE) {
        this.$emit('getNextPage');
      }
    },
  },
  mounted() {
    this.getScrollFlag();
    if (this.viewerId) {
      this.getMallRelList();
    }
    if (!Browser.isIE) {
      // 兼容ie
      this.listObserve = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio > 0 || entries[0].isIntersecting) {
          // 显示时判断当前页是否超出最大页
          this.$emit('getNextPage');
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
/* 线索组件 */
.clue {
  height: 418px;
  overflow: auto;
  &.withFollow {
    height: 228px;
  }
  .nothingText {
    margin-right: 6px;
    font-size: 14px;
    color: #151716;
    &.nothingShop {
      display: flex;
      height: 227px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .textColor {
        padding-top: 8px;
        font-size: 14px;
        line-height: 14px;
        color: #b2b2b2;
      }
    }
  }
  &.nothingClass {
    display: flex;
    height: 418px;
    overflow: hidden;
    line-height: 418px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  .cluePart {
    width: 100%;
    padding: 0 14px;
    box-sizing: border-box;
    .splitDay {
      position: relative;
      display: flex;
      padding: 10px 0;
      padding-left: 14px;
      font-size: 12px;
      font-weight: normal;
      line-height: 18px;
      color: #011128;
      flex-flow: row nowrap;
      align-items: center;
      &::before {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 100%;
        height: 50%;
        background-color: #b2b7be;
        content: '';
        transform: translateX(-50%);
      }
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 9;
        width: 6px;
        height: 6px;
        background: #f7f7f7;
        background: #b8b9b9;
        border: 1px solid #b2b7be;
        border-radius: 50%;
        content: '';
        transform: translate(-50%, -50%);
      }
      .articleTitle {
        width: 85%;
        overflow: hidden;
        font-size: 14px;
        font-weight: bold;
        color: #011128;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 0 0 auto;
      }
      .dateTip {
        position: relative;
        margin-left: 13px;
        &::after {
          position: absolute;
          top: 50%;
          left: -7px;
          width: 1px;
          height: 10px;
          background-color: #b8b9b9;
          border-radius: 1px;
          content: '';
          transform: translateY(-50%);
        }
      }
    }
    .splitDayWrapper {
      display: flex;
      flex-direction: column;
      .subItem {
        position: relative;
        display: flex;
        display: block;
        padding-left: 15px;
        padding-left: 16px;
        flex-flow: row nowrap;
        align-items: center;
        &::before {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 1px;
          height: 100%;
          background-color: #b8b9b9;
          content: '';
          transform: translateX(-50%);
        }
        &::after {
          position: absolute;
          top: 50%;
          top: 12px;
          left: 0;
          z-index: 9;
          width: 6px;
          height: 6px;
          background: #f7f7f7;
          border: 1px solid #b8b9b9;
          border-radius: 50%;
          content: '';
          transform: translate(-50%, -50%);
        }
        .articleTitle {
          overflow: hidden;
          font-size: 16px;
          font-size: 12px;
          font-weight: bold;
          color: #151716;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 0 0 250px;
        }
        &.productBox {
          &::after {
            background: none;
            border: none;
          }
        }
        .createTimeName {
          font-size: 14px;
          font-size: 12px;
          font-weight: normal;
          line-height: 0;
          color: #737473;
        }
        .actionBox {
          width: auto;
          padding: 12px;
          margin-bottom: 16px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 8px 24px 0 rgba(7, 1, 38, 0.07);
          .explainBox {
            position: relative;
            margin-top: 4.5px;
            box-sizing: border-box;
            .no-break {
              white-space: nowrap;
            }
            .attach-list-box {
              display: flex;
              flex-flow: row wrap;
            }
            .attach-list-doc {
              /* line-height: 1; */

              /* font-size: 28px; */
            }
            .attach-list {
              width: 48px;
              height: 48px;
              margin-right: 16px;
              margin-bottom: 16px;
              font-size: 12px;
              color: $primary-color;
              flex: 0 0 auto;
              &.attach-list-doc-wrapper {
                width: 830px;
                height: auto;
                margin-right: 0;
                flex: 1 0 auto;
              }
            }
            .attach-img {
              display: block;
              width: 100%;
              height: 100%;
              cursor: pointer;
              border: 1px solid $border-disabled-color;
              border-radius: 4px;
            }

            .explain {
              font-size: 12px;
              font-weight: normal;
              line-height: 18px;
              color: #67707e;
              word-break: break-all;
              .mainColorWorld {
                color: $primary-color;
              }
              .split {
                margin: 0 4px;
              }
            }

            .attachment-box {
              display: flex;
              margin-top: 6px;
            }

            .attach-list {
              @include flex-center;

              .attach-item {
                width: 48px;
                height: 48px;
                margin-right: 16px;
                margin-bottom: 16px;
                font-size: 12px;
                color: $primary-color;
                cursor: pointer;

                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .mainActionBox {
            line-height: 16px;

            &.withSubAction {
              margin-bottom: 8px;
            }
            .mainLine {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              .typeName {
                margin-right: 8px;
                overflow: hidden;
                font-size: 14px;
                font-weight: bold;
                line-height: 44px;
                line-height: 16px;
                color: #151716;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .actionFrom {
                overflow: hidden;
                font-size: 12px;
                font-weight: normal;
                color: #737473;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 0 0 20em;
              }
              .createTimeName {
                margin-left: auto;
                font-size: 12px;
                font-weight: normal;
                color: #737473;
              }
            }
            .subLine {
              display: flex;
              font-size: 12px;
              font-weight: normal;
              color: #737473;
              word-break: break-all;
              flex-flow: row nowrap;
              align-items: center;
              &.title {
                margin: 4.5px 0;
              }
              &.withoutTitle {
                margin-top: 4.5px;
              }
              &.duration {
                font-size: 12px;
              }
              .content {
                max-width: 450px;
                overflow: hidden;
                font-weight: bold;
                color: $primary-color;
                text-overflow: ellipsis;
                white-space: nowrap;
                &.imgContent {
                  cursor: pointer;
                }
              }
            }
          }
          .subActionBox {
            position: relative;
            margin-top: 8px;
            overflow: hidden;
            font-size: 12px;
            font-size: 12px;
            font-weight: normal;
            color: #737473;
            &::after {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 1px;
              background-color: #eeeeee;
              content: '';
            }
            .subTitle {
              margin-top: 8px;
            }
            .subActionWrapper {
              .subActionLine {
                display: flex;
                margin-top: 8px;
                align-items: center;
                .actionTag {
                  display: flex;
                  height: 16px;
                  padding: 0 4px;
                  margin-right: 4px;
                  font-size: 12px;
                  font-weight: normal;
                  font-weight: bold;
                  line-height: 18px;
                  color: $primary-color;
                  background: #eaf5ed;
                  border-radius: 4px;
                  align-items: center;
                }
              }
            }
          }
          .titleBox {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }
  .productWrapper {
    margin-bottom: 20px;
    .productPart {
      padding: 16px 16px 0;

      /* &.cusProductPart {
        position: absolute;
        top: 0;
        left: 0;
      } */
      .titleBox {
        display: flex;
        .title {
          display: flex;

          /* padding-left: 5px; */
          font-size: 14px;
          font-weight: bold;
          line-height: 22px;
          line-height: 16px;
          color: #151716;

          /* border-left: 3px solid $primary-color; */
          align-items: center;
        }
      }
      .intentionProduct {
        margin-top: 16px;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0 8px 24px 0 rgba(7, 1, 38, 0.07);
        .productInfo {
          padding: 12.5px 16px 0 16px;
          font-size: 12px;
          font-weight: normal;
          color: #737473;
          vertical-align: middle;
          &:last-child {
            padding-bottom: 16px;
          }
          div {
            display: flex;
            align-items: center;
            .productName {
              display: inline-block;
              max-width: 196px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .countNum {
              margin: 0 4px 0 auto;
            }
            .num {
              font-weight: bold;
              color: $primary-color;
            }
          }
          .progressWrapper {
            width: 100%;
            height: 4px;
            margin-top: 4.5px;
            background: #eeeeee;
            border-radius: 3px;
            .progress {
              height: 100%;
              background: $primary-color;
              border-radius: 3px;
            }
          }
        }
        .more {
          display: flex;
          height: 28px;
          margin-top: 16px;
          font-size: 12px;
          font-weight: normal;
          line-height: 18px;
          color: $primary-color;
          justify-content: center;
          align-items: center;
          img {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
  .showInfoFlag {
    width: 1px;
    height: 1px;
  }
  .topFlag {
    width: 1px;
    height: 1px;
  }
}
.directSale {
  .clue {
    .cluePart {
      .splitDayWrapper {
        .subItem {
          .actionBox {
            .explainBox {
              .explain {
                display: flex;
                font-size: 12px;
                font-weight: normal;
                line-height: 18px;
                color: #67707e;
                word-break: break-all;
                flex-flow: row nowrap;
                .remark {
                  flex: 1;
                }
                .mainColorWorld {
                  color: $primary-color;
                }
              }
            }
            .mainActionBox {
              .subLine {
                .content {
                  color: $primary-color;
                }
              }
            }
            .subActionBox {
              .subActionWrapper {
                .subActionLine {
                  .actionTag {
                    color: $primary-color;
                  }
                }
              }
            }
          }
        }
      }
    }
    .productWrapper {
      .productPart {
        .titleBox {
          .title {
            border-left: 3px solid $primary-color;
          }
        }
        .intentionProduct {
          .productInfo {
            div {
              .num {
                color: $primary-color;
              }
            }
            .progressWrapper {
              .progress {
                background: $primary-color;
              }
            }
          }
          .more {
            color: $primary-color;
          }
        }
      }
    }
  }
}
</style>

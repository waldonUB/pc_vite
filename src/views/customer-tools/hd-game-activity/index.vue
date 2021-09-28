<!--
 * @Description  : 互动活动
 * @Author       : turbo
 * @Date         : 2021-03-30 13:54:10
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-02 18:13:32
-->

<template>
  <div class="hdGameActivity">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="topTitle">
          互动活动
          <global-ts-tool-tips placement="bottom-start">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bianzu"></use>
            </svg>
            <div slot="content">
              <p class="tooltipContent">仅展示正在进行中的互动活动（暂不支持互动小程序活动）</p>
            </div>
          </global-ts-tool-tips>
        </div>
      </template>
      <template v-slot:rightPart>
        <global-ts-button v-if="isManage" type="primary" size="small" icon="icon-icon-11" @click="createActivity">
          创建活动
        </global-ts-button>
      </template>
    </global-ts-header>
    <div id="pro_listBox" class="pro_listBox">
      <div class="pro_line">
        <fa-input
          class="searchItem"
          v-model="requestParam.name"
          placeholder="活动名称"
          @keyup.enter.native="getHdGameList"
        >
        </fa-input>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="getHdGameList">搜索 </global-ts-button>
      </div>
      <div class="contentWrapper">
        <div class="activityCardWrapper" v-if="hdGameList.length">
          <div class="activityBox cardInWhite" v-for="(item, index) of hdGameList" :key="index">
            <div class="mainInfo">
              <div class="titleBox">
                <div class="imgBox">
                  <img class="titleImg" :src="item.img" alt="" />
                </div>
                <div class="titleContent">
                  <p class="activityNum">{{ item.idStr }}</p>
                  <p class="activityTitle">{{ item.name }}</p>
                </div>
              </div>
              <div class="des">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shijian"></use>
                </svg>
                <span>
                  结束时间：<span class="value">{{ item.endTimeStr }}</span>
                </span>
              </div>
              <div class="des">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-canyurenshu"></use>
                </svg>
                <span>
                  参与人数：<span class="value">{{ item.player }}/{{ item.ljn }}</span>
                </span>
              </div>
            </div>
            <div class="operateBox">
              <fa-popover
                :getPopupContainer="getPopupContainer"
                @visibleChange="popoverVisibleChange($event, item, index)"
                :visible="item.isShowPopover"
                placement="bottomLeft"
                trigger="click"
                overlayClassName="activity ts-fa-popover no-arrow"
              >
                <template slot="content">
                  <div class="contentWrapper">
                    <div class="imgContent">
                      <div class="previewImgBox">
                        <img class="previewImg" :src="activityCardPreviewIMG" alt="" />
                      </div>
                      <div class="operateBottom left">
                        <span class="desc">展示名片</span>
                        <fa-switch v-model="simpleCardInfo.showCardTopBar" defaultChecked @change="changeCardVisible" />
                        <global-ts-button type="textGreen" size="small" @click="openCardSetModal">
                          设置
                        </global-ts-button>
                      </div>
                    </div>
                    <div class="rightQrBox">
                      <div class="imgQrBox">
                        <div class="imgQrWrapper">
                          <img
                            class="imgQr"
                            :src="$store.getters.tsportalUrlProxy + currentActivity.h5CodeUrl"
                            alt=""
                          />
                        </div>
                        <p class="tips">微信扫码后</p>
                        <p class="tips">点击右上角分享</p>
                      </div>
                      <div class="operateBottom">
                        <global-ts-button type="textGreen" size="small" @click="downloadQrImg">
                          下载二维码
                        </global-ts-button>
                        <div class="splitBox"></div>
                        <global-ts-button type="textGreen" size="small" @click="copyH5Link">
                          复制分享链接
                        </global-ts-button>
                      </div>
                    </div>
                  </div>
                </template>
                <global-ts-button class="cardBtn left" type="greyText" size="small" icon="icon-fenxiang">
                  分享
                </global-ts-button>
              </fa-popover>
              <global-ts-button
                class="cardBtn"
                type="greyText"
                size="small"
                icon="icon-bianji1"
                @click="gotoPcEdit(item)"
                >编辑
              </global-ts-button>
            </div>
          </div>
        </div>
        <div class="emptyWrapper" v-else>
          {{ emptyTipCal }}
        </div>
      </div>
      <global-ts-fai-pagination
        :showSizeChanger="false"
        @changePage="changePage"
        :withMargin="false"
        :pageOption.sync="pages"
      >
      </global-ts-fai-pagination>
    </div>
    <ts-activity-dialog :activityDialogVisible.sync="activityDialogVisible" :simpleCardInfo.sync="simpleCardInfo">
    </ts-activity-dialog>
  </div>
</template>

<script>
import TsActivityDialog from '@/components/base/ts-activity-dialog/index.vue';
import { mapGetters, mapState } from 'vuex';
import { FdpLog, clipboard, downloadImg } from '@/utils';
import { Popover, Switch } from '@fk/faicomponent';
import {
  changeShowCardTopBar,
  getHdGameList,
  getHdPcUrl,
  getSimpleCardInfo,
} from '@/api/modules/views/customer-tools/hd-game-activity';
import activityCardPreviewIMG from '@/assets/image/directSale/hd_microFlyer/activityCardPreview.png';

export default {
  components: { TsActivityDialog, [Popover.name]: Popover, [Switch.name]: Switch },
  name: 'HdGameActivity',
  data() {
    return {
      activityDialogVisible: false,
      requestParam: {
        name: '',
      },
      pages: {
        pageNow: 1,
        limit: 12, // 这里特殊要求是12个一页
        maxPage: 2,
        total: 20,
      },
      hdGameList: [],
      hdPcUrl: '',
      simpleCardInfo: {
        headImgUrl: '', // 头像
        name: '', // 姓名
        position: '', // 职位
        mobile: '', // 手机
        wx: '', // 微信号
        company: '', // 公司
        wxQrUrl: '', // 个人二维码
        showCardTopBar: false, // 是否展示名片
        showCard: false, // 是否展示名片小程序二维码
        showWxQr: false, // 是否展示个人二维码
        wxWorkQrUrl: '', // 企微二维码
        isOpenWxWorkCard: false, // 是否开启企微
      },
      currentActivity: {
        // 当前点击的活动
        name: '',
        h5CodeUrl: '',
        gameUrl: '',
        shareUrl: '',
      },
      isShowPopover: false, // 是否显示popover
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    emptyTipCal() {
      return this.isManage ? '暂无进行中的互动活动，马上点击右上角【创建活动】按钮创建吧' : '暂无进行中的互动活动';
    },
    activityCardPreviewIMG() {
      return activityCardPreviewIMG;
    },
  },
  created() {
    this.getHdGameList();
    this.getHdPcUrl();
    FdpLog('yx_dkhd', {
      yx_app_terminal: 1,
      yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
      yx_free_text_0: '页面曝光',
    });
  },
  methods: {
    /**
     * 必须要设置popover的挂载节点，滚动有问题
     * @author waldon
     * @date 2020/10/23
     * @returns {Object} - 挂载节点
     */
    getPopupContainer() {
      return document.getElementById('pro_listBox');
    },
    /**
     * 是否显示popover
     * @author waldon
     * @date 2020/10/23
     * @param {Boolean} value - 显示状态
     * @param {Object} rowData - 行数据
     * @param {Number} index - 行
     */
    popoverVisibleChange(value, rowData, index) {
      if (this.activityDialogVisible) {
        rowData.isShowPopover = true;
      } else {
        rowData.isShowPopover = value;
      }
      if (value) {
        this.getSimpleCardInfo(rowData);
      }
      this.$set(this.hdGameList, index, rowData);
    },
    /**
     * 下载二维码
     * @author waldon
     * @date 2020/10/23
     */
    downloadQrImg() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '互动',
        yx_free_text_1: '下载二维码',
      });
      downloadImg(this.currentActivity.h5CodeUrl, this.currentActivity.name, false);
    },
    /**
     * 复制链接
     * @author waldon
     * @date 2020/10/23
     */
    copyH5Link() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '互动',
        yx_free_text_1: '复制链接',
      });
      clipboard(this.currentActivity.shareUrl, '活动链接已复制', '当前浏览器不支持');
    },
    /**
     * 打开设置对话框
     * @author waldon
     * @date 2020/10/23
     */
    openCardSetModal() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '互动',
        yx_free_text_1: '点击设置',
      });
      FdpLog('yx_dkhd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '设置',
      });
      this.activityDialogVisible = true;
    },
    /**
     * 跳到对应的活动编辑页
     * @author waldon
     * @date 2020/10/23
     * @param {Object} rowData -
     */
    async gotoPcEdit(rowData) {
      await FdpLog('yx_dkhd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '搜索',
      });
      window.open(rowData.pcEditUrl);
    },
    /**
     * 修改是否展示名片的开关
     * @author waldon
     * @date 2020/10/23
     */
    async changeCardVisible() {
      const params = {
        showCardTopBar: this.simpleCardInfo.showCardTopBar,
      };
      if (this.simpleCardInfo.showCardTopBar) {
        FdpLog('yx_dkfxtc', {
          yx_free_text_0: '互动',
          yx_free_text_1: '开启名片',
        });
      } else {
        FdpLog('yx_dkfxtc', {
          yx_free_text_0: '互动',
          yx_free_text_1: '关闭名片',
        });
      }
      const [err, res] = await changeShowCardTopBar(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '修改成功',
      });
    },
    /**
     * 改变分页回调
     * @author waldon
     * @date 2020/10/21
     * @param {String} type - 改变分页的类型
     */
    changePage(type) {
      this.getHdGameList();
    },
    /**
     * 查询pc的列表
     * @author waldon
     * @date 2020/10/23
     */
    async getHdGameList() {
      const params = { ...this.pages, ...this.requestParam };
      if (this.requestParam.name) {
        FdpLog('yx_dkhd', {
          yx_app_terminal: 1,
          yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          yx_free_text_0: '搜索',
        });
      }
      const [err, res] = await getHdGameList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.hdGameList = res.data;
      this.hdGameList.forEach(item => {
        item.isShowPopover = false;
      });
      this.pages.total = res.total;
    },
    /**
     * 获取创建活动地址
     * @author waldon
     * @date 2020/10/23
     */
    async getHdPcUrl() {
      const [err, res] = await getHdPcUrl();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.hdPcUrl = res.data.hdPcUrl;
    },
    /**
     * 跳转到创建活动的页面
     * @author waldon
     * @date 2020/10/23
     */
    async createActivity() {
      await FdpLog('yx_dkhd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '搜索',
      });
      this.hdPcUrl && window.open(this.hdPcUrl);
    },
    /**
     * 获取简易名片信息
     * @author waldon
     * @date 2020/10/23
     * @param {Object} rowData - 行数据
     */
    async getSimpleCardInfo(rowData) {
      this.currentActivity = { ...rowData };
      FdpLog('yx_dkhd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '分享',
      });
      const [err, res] = await getSimpleCardInfo();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.simpleCardInfo = { ...this.simpleCardInfo, ...res.data };
    },
  },
};
</script>

<style lang="scss" scoped>
.hdGameActivity {
  .topTitle {
    .icon {
      width: 1.7em;
      height: 1.2em;
      margin: 0 2px 0 -0.25em;
      overflow: hidden;
      color: #247af3;
      vertical-align: -0.15em;
    }
  }
  .pro_listBox {
    .pro_line {
      .searchItem {
        width: 200px;
      }
    }
    .contentWrapper {
      .emptyWrapper {
        width: 100%;
        height: 60px;
        line-height: 60px;
        color: #909399;
        text-align: center;
      }
      .activityBox {
        display: inline-block;
        width: calc(25% - 15px);
        height: 208px;
        min-width: 288px;
        margin-right: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        .mainInfo {
          padding: 20px;
          box-sizing: border-box;
          .titleBox {
            display: flex;
            align-items: center;
            flex-flow: row nowrap;
            .imgBox {
              width: 108px;
              height: 60px;
              margin-right: 10px;
              border-radius: 2px;
              flex: 0 0 auto;
              .titleImg {
                width: 100%;
                height: 100%;
                border-radius: 2px;
                object-fit: cover;
              }
            }
            .titleContent {
              display: flex;
              width: calc(100% - 118px);
              flex-direction: column;
              justify-content: center;
              .activityNum {
                font-size: 14px;
                line-height: 1;
                color: $color-b2;
              }
              .activityTitle {
                width: 100%;
                margin-top: 6px;
                overflow: hidden;
                font-size: 16px;
                line-height: 1.5;
                color: $color-00;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .des {
            margin-top: 10px;
            font-size: 14px;
            line-height: 1;
            color: $color-b2;
            .value {
              color: $color-53;
            }
            .icon {
              width: 16px;
              height: 16px;
              margin-right: 0;
            }
          }
        }
        .operateBox {
          display: flex;
          height: 56px;
          background: #f6f6f6;
          border-top: 1px solid $border-disabled-color;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          .cardBtn {
            &.left {
              margin-right: 44px;
            }
            &.global-button {
              padding: 0;
              &:hover {
                ::v-deep span,
                ::v-deep .icon {
                  color: #247af3 !important;
                }
              }
            }
            ::v-deep .icon {
              font-size: 24px !important;
              color: $color-53 !important;
              vertical-align: middle;

              /* vertical-align: -0.5em; */
            }
            ::v-deep span {
              color: $color-53;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1580px) {
  .hdGameActivity .pro_listBox .contentWrapper .activityBox:nth-child(3n) {
    margin-right: 0;
  }
  .hdGameActivity .pro_listBox .contentWrapper .activityBox {
    width: calc(33.33% - 14px);
  }
}
@media screen and (min-width: 1581px) and (max-width: 1920px) {
  .hdGameActivity .pro_listBox .contentWrapper .activityBox:nth-child(4n) {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
.hdGameActivity {
  .fa-popover {
    &.activity {
      width: 467px;
      .fa-popover-inner-content {
        padding: 0;
      }
      .contentWrapper {
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        flex-flow: row nowrap;
        .imgContent {
          width: 205px;
          margin-right: 20px;
          flex: 0 0 auto;
          .previewImgBox {
            height: 260px;
            .previewImg {
              width: 100%;
              height: 100%;
            }
          }
        }
        .rightQrBox {
          width: 202px;
          flex: 0 0 auto;
        }
        .imgQrBox {
          height: 260px;
          padding: 10px;
          border: 1px solid $border-color;
          border-radius: 2px;
          box-sizing: border-box;
          .imgQrWrapper {
            width: 182px;
            height: 182px;
            .imgQr {
              width: 100%;
              height: 100%;
            }
          }
          .tips {
            margin-top: 10px;
            font-size: 14px;
            line-height: 1;
            color: $color-53;
            text-align: center;
          }
        }
        .operateBottom {
          display: flex;
          height: 22px;
          margin-top: 10px;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          .fa-switch {
            margin-right: 16px;
          }
          .global-button {
            &.global-button-size-small {
              height: auto;
              line-height: 1;
            }
          }
          .desc {
            margin-right: auto;
            font-size: 14px;
            line-height: 1;
            color: $color-53;
          }
          .splitBox {
            width: 1px;
            height: 12px;
            margin: 0 8px;
            background-color: $border-disabled-color;
          }
        }
      }
    }
  }
}
</style>

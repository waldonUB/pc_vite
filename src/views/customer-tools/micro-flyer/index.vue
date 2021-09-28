<!--
 * @Description  : 微传单
 * @Author       : turbo
 * @Date         : 2021-03-30 13:55:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 11:41:26
-->

<template>
  <div class="microFlyer">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="topTitle">
          微传单
        </div>
      </template>
      <template v-slot:rightPart>
        <global-ts-button v-if="isManage" type="primary" size="small" icon="icon-icon-11" @click="createActivity">
          创建微传单
        </global-ts-button>
      </template>
    </global-ts-header>
    <div id="pro_listBox" class="pro_listBox">
      <div class="contentWrapper">
        <div class="activityCardWrapper" v-if="microFlyerList.length">
          <div class="activityBox cardInWhite" v-for="(item, index) of microFlyerList" :key="index">
            <div class="mainInfo">
              <div class="titleBox">
                <div class="imgBox">
                  <img class="titleImg" :src="item.flyerCoverPath" alt="" />
                </div>
                <div class="titleContent">
                  <p class="activityTitle">{{ item.flyerTitle }}</p>
                </div>
              </div>
            </div>
            <div class="operateBox">
              <fa-popover
                v-if="item.isPublish"
                :getPopupContainer="getPopupContainer"
                @visibleChange="popoverVisibleChange($event, item, index)"
                :visible="item.isShowPopover"
                placement="bottomLeft"
                trigger="click"
                overlayClassName="microFlyerActivity ts-fa-popover no-arrow"
              >
                <template slot="content">
                  <div class="contentWrapper">
                    <div class="imgContent">
                      <div class="previewImgBox">
                        <img class="previewImg" :src="flyerCardPreviewImgCal" alt="" />
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
                <global-ts-button class="cardBtn left normal" type="greyText" size="small" icon="icon-fenxiang">
                  分享
                </global-ts-button>
              </fa-popover>
              <global-ts-tool-tips
                v-else
                offset="0"
                class="item"
                effect="dark"
                content="该传单已下线，无法分享"
                placement="top"
              >
                <global-ts-button class="cardBtn left isDisabled" type="greyText" size="small" icon="icon-fenxiang">
                  分享
                </global-ts-button>
              </global-ts-tool-tips>
              <global-ts-button
                class="cardBtn normal"
                type="greyText"
                size="small"
                icon="icon-bianji1"
                @click="gotoPcEdit(item)"
              >
                编辑
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
import { mapGetters } from 'vuex';
import { FdpLog, clipboard, downloadImg } from '@/utils';
import { Popover, Switch } from '@fk/faicomponent';
import flyerCardPreviewIMG from '@/assets/image/directSale/hd_microFlyer/flyerCardPreview.png';
import {
  getFlyerList,
  getFlyerPcUrl,
  changeShowCardTopBar,
  getSimpleCardInfo,
} from '@/api/modules/views/customer-tools/micro-flyer';

export default {
  name: 'MicroFlyer',
  components: { TsActivityDialog, [Popover.name]: Popover, [Switch.name]: Switch },
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
      microFlyerList: [],
      flyerPcUrl: '',
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
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    emptyTipCal() {
      return this.isManage ? '暂无微传单，马上点击右上角【创建微传单】按钮创建吧' : '暂无微传单';
    },
    flyerCardPreviewImgCal() {
      // let dir = initTsParam.isOem ? 'notDirectSale' : 'directSale'
      // return `${initTsParam.resRoot}/image/${dir}/hd_microFlyer/flyerCardPreview.png`
      return flyerCardPreviewIMG;
    },
  },
  created() {
    this.getFlyerList();
    this.getFlyerPcUrl();
    FdpLog('yx_dkcd', {
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
      this.$set(this.microFlyerList, index, rowData);
    },
    /**
     * 下载二维码
     * @author waldon
     * @date 2020/10/23
     */
    downloadQrImg() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '传单',
        yx_free_text_1: '下载二维码',
      });
      downloadImg(this.currentActivity.h5CodeUrl, this.currentActivity.flyerTitle, false);
    },
    /**
     * 复制链接
     * @author waldon
     * @date 2020/10/23
     */
    copyH5Link() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '传单',
        yx_free_text_1: '复制链接',
      });
      clipboard(this.currentActivity.shareUrl, '微传单链接已复制', '当前浏览器不支持');
    },
    /**
     * 打开设置对话框
     * @author waldon
     * @date 2020/10/23
     */
    openCardSetModal() {
      FdpLog('yx_dkfxtc', {
        yx_free_text_0: '传单',
        yx_free_text_1: '点击设置',
      });
      FdpLog('yx_dkcd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '设置',
      });
      this.activityDialogVisible = true;
    },
    /**
     * 跳到对应的微传单编辑页
     * @author waldon
     * @date 2020/10/23
     * @param {Object} rowData -
     */
    async gotoPcEdit(rowData) {
      await FdpLog('yx_dkcd', {
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
          yx_free_text_0: '传单',
          yx_free_text_1: '开启名片',
        });
      } else {
        FdpLog('yx_dkfxtc', {
          yx_free_text_0: '传单',
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
      this.getFlyerList();
    },
    /**
     * 查询pc的列表
     * @author waldon
     * @date 2020/10/23
     */
    async getFlyerList() {
      const params = { ...this.pages, ...this.requestParam };
      if (this.requestParam.name) {
        FdpLog('yx_dkcd', {
          yx_app_terminal: 1,
          yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          yx_free_text_0: '搜索',
        });
      }
      const [err, res] = await getFlyerList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.microFlyerList = res.data;
      this.microFlyerList.forEach(item => {
        item.isShowPopover = false;
      });
      this.pages.total = res.total;
    },
    /**
     * 获取创建微传单地址
     * @author waldon
     * @date 2020/10/23
     */
    async getFlyerPcUrl() {
      const [err, res] = await getFlyerPcUrl();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.flyerPcUrl = res.data.flyerPcUrl;
    },
    /**
     * 跳转到创建微传单的页面
     * @author waldon
     * @date 2020/10/23
     */
    async createActivity() {
      await FdpLog('yx_dkcd', {
        yx_app_terminal: 1,
        yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
        yx_free_text_0: '搜索',
      });
      this.flyerPcUrl && window.open(this.flyerPcUrl);
    },
    /**
     * 获取简易名片信息
     * @author waldon
     * @date 2020/10/23
     * @param {Object} rowData - 行数据
     */
    async getSimpleCardInfo(rowData) {
      this.currentActivity = { ...rowData };
      FdpLog('yx_dkcd', {
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
.microFlyer {
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
        height: 204px;
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
              height: 108px;
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
              .activityTitle {
                width: 100%;
                overflow: hidden;
                font-size: 16px;
                line-height: 1.5;
                color: $color-00;
                word-break: break-all;
                @include line-clamp(4);
              }
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
          ::v-deep .cardBtn {
            &.left {
              margin-right: 44px;
            }
            &.isDisabled {
              cursor: not-allowed;
            }
            .icon {
              width: 24px;
              height: 24px;
              color: $color-53;
              vertical-align: -0.5em;
            }
            &.normal {
              &:hover {
                .icon {
                  color: #247af3;
                }
                span {
                  color: #247af3;
                }
              }
            }
            span {
              color: $color-53;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1580px) {
  .microFlyer .pro_listBox .contentWrapper .activityBox:nth-child(3n) {
    margin-right: 0;
  }
  .microFlyer .pro_listBox .contentWrapper .activityBox {
    width: calc(33.33% - 14px);
  }
}
@media screen and (min-width: 1581px) and (max-width: 1920px) {
  .microFlyer .pro_listBox .contentWrapper .activityBox:nth-child(4n) {
    margin-right: 0;
  }
}

.microFlyerActivity {
  &.fa-popover {
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
        .tanshu-button {
          &.tanshu-button-size-small {
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
</style>

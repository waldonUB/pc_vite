<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:54:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:07:00
-->
<template>
  <div id="pro_listBox" class="pro_listBox" @click="showAppTip = false">
    <div class="appWrapper">
      <ts-corp-install-model
        from-page="企微设置页"
        :corpInstallDialogVisible.sync="corpInstallDialogVisible"
      ></ts-corp-install-model>
      <div class="tip-box" v-if="wxWorkCorpData.finishStep">
        <global-ts-warn-tips>
          <p class="warnTipsContent" slot="content">未完成企业微信接入，部分功能无法使用</p>
        </global-ts-warn-tips>
      </div>
      <div class="appBox">
        <div class="appContentBox">
          <img :src="wxCorpIcon_bigIMG" class="imgContent" alt="" />
          <div class="textBox">
            <div class="corpName">{{ showCorpInfoCal.corpName }}</div>
            <div class="desc" v-if="showCorpInfoCal.corpDesc">{{ showCorpInfoCal.corpDesc }}</div>
          </div>
        </div>
        <global-ts-button class="setBtn min_width_88" size="small" @click="toSetApp">{{ setTextCal }}</global-ts-button>
      </div>
      <div class="tableBox" v-if="!isShowSelfAppCal">
        <div class="titleBox">
          <img :src="title_leftIMG" class="imgContent" alt="" />
          <div class="titleText">接入企业微信的优势</div>
          <img :src="title_rightIMG" class="imgContent" alt="" />
        </div>
        <el-table
          row-key="id"
          ref="sortTable"
          :data="sceneList"
          border
          header-row-class-name="employeeHeader"
          min-width="1010px"
          box-sizing="border-box"
          cell-class-name="cellStyle"
        >
          <el-table-column label="" min-width="200px" prop="scene"> </el-table-column>
          <el-table-column min-width="320px" prop="wx">
            <template #header>
              <span>个人微信</span>
              <img :src="wxIcon_miniIMG" class="wxIcon" alt="" />
            </template>
          </el-table-column>
          <el-table-column min-width="490px" prop="corpWx">
            <template #header>
              <span>企业微信</span>
              <img :src="wxCorpIcon_miniIMG" class="wxIcon" alt="" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tableBox" v-else>
        <div class="infoPart">
          <div class="infoTitle">特色功能</div>
          <div class="infoContent">
            <div class="partBox left">
              <img :src="chartToolIMG" class="funcImg" alt="" />
              <div class="textBox">
                <div class="textTitle">
                  聊天工具栏
                  <global-ts-tool-tips placement="top" content="功能介绍">
                    <global-ts-svg-icon
                      class="icon base-icon-fill"
                      name="icon-wenhao1616"
                      :size="16"
                      @click="gotoChatTool"
                    ></global-ts-svg-icon>
                  </global-ts-tool-tips>
                </div>
                <div class="textDesc">快速查看客户动态，一键发送营销资料</div>
              </div>
              <global-ts-button class="funcBtn min_width_88" size="small" @click="toDetail('chatToolDetail')">{{
                isClickSetTextCal
              }}</global-ts-button>
            </div>
            <div class="partBox">
              <img :src="msgSettingIMG" class="funcImg" alt="" />
              <div class="textBox">
                <div class="textTitle">会话存档</div>
                <div class="textDesc">在线查看企业成员和客户聊天记录</div>
              </div>
              <global-ts-button class="funcBtn min_width_88" size="small" @click="toDetail('wxWorkMsgDetail')">
                {{ wxWorkMsgText }}
              </global-ts-button>
            </div>
          </div>
        </div>
        <div class="infoPart">
          <div class="infoTitle">小程序</div>
          <div v-if="showMiniProgramBox" class="infoContent">
            <div class="partBox left">
              <img :src="miniProgramBoxData.logo" class="funcImg" alt="" />
              <div class="textBox">
                <div class="textTitle">{{ miniProgramBoxData.name }}</div>
                <div class="textDesc">{{ miniProgramBoxData.desc }}</div>
              </div>
              <global-ts-button
                class="funcBtn min_width_88"
                size="small"
                @click="toDetail('setAppDetail')"
                :type="finishBtnCal"
              >
                {{ finishAppTextCal }}
              </global-ts-button>
            </div>
            <div class="partBox hide"></div>
          </div>
          <div v-else class="infoContent set-content">
            <div class="partBox" @click.stop="toDetail('setAppDetail')">
              <fa-popover :getPopupContainer="getPopupContainer" :visible="showAppTip" overlayClassName="ts-fa-popover">
                <template slot="content">
                  <global-ts-svg-icon class="icon set-info" name="icon-icon-1"></global-ts-svg-icon>
                  <span>
                    请先完成微信授权
                    <a @click="gotoAuthorization('bindMp')">去授权</a>
                  </span>
                </template>
                <div class="set-title-box">
                  <global-ts-svg-icon class="icon title-icon" name="icon-tianjia1616"></global-ts-svg-icon>
                  <span class="title">添加小程序</span>
                </div>
              </fa-popover>
              <div class="set-desc">
                将小程序安装到企业微信，在企微上做营销
              </div>
            </div>
            <div class="partBox hide"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getGuideList, getUploadFile, saveGuide } from '@/utils';
import tsCorpInstallModel from '@/components/base/ts-corp-install-model/index.vue';
import wxCorpIcon_bigIMG from '@/assets/image/comm/wxWork/wxCorpApp/wxCorpIcon_big.png';
import title_leftIMG from '@/assets/image/comm/wxWork/wxCorpApp/title_left.png';
import title_rightIMG from '@/assets/image/comm/wxWork/wxCorpApp/title_right.png';
import wxIcon_miniIMG from '@/assets/image/comm/wxWork/wxCorpApp/wxIcon_mini.png';
import wxCorpIcon_miniIMG from '@/assets/image/comm/wxWork/wxCorpApp/wxCorpIcon_mini.png';
import chartToolIMG from '@/assets/image/comm/wxWork/wxCorpApp/chartTool.png';
import msgSettingIMG from '@/assets/image/comm/wxWork/wxCorpApp/msgSetting.png';
import {
  getAppAuthUrlByApplet,
  getUserWxAuth,
  checkWxAuthIsOk,
  checkSettingInfoComplete,
} from '@/api/modules/views/setting-center';
import { isEmpty } from 'lodash';

export default {
  name: 'wx-corp-app-list',
  components: { tsCorpInstallModel },
  props: {
    currentTemp: {
      type: String,
      default: '',
    },
    wxWorkCorpData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    hasSetCal: {
      type: Boolean,
      default: false,
    },
    isPublishApp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sceneList: [
        {
          scene: '员工离职',
          wx: '资产属于个人，客户资源被带走',
          corpWx: '资产属于企业、管理员可将离职员工的客户资源一键分配给其他员工',
        },
        {
          scene: '客户数量',
          wx: '5千',
          corpWx: '最高5万（可持续扩容）',
        },
        {
          scene: '对外形象',
          wx: '无任何标志',
          corpWx: '有企业认证标识，专业靠谱',
        },
        {
          scene: '社群运营',
          wx: '无辅助工具',
          corpWx: '入群欢迎语、自动踢人、违规发言监控',
        },
        {
          scene: '监控聊天',
          wx: '不支持',
          corpWx: '支持管理员在线监控员工聊天记录',
        },
        {
          scene: '消息群发',
          wx: '200人/次',
          corpWx: '不限制单次群发人数',
        },
        {
          scene: '营销风险',
          wx: '过度营销容易被举报或封号',
          corpWx: '官方支持营销，风险低',
        },
        {
          scene: '硬件成本',
          wx: '需要配备手机和电话卡进行养号',
          corpWx: '不需要',
        },
      ],
      corpInstallDialogVisible: false, // 接入弹窗
      miniAppAuthUrl: '', // 企微小程序链接
      fileName: '', // 校验文件
      showAppTip: false, //没有微信授权的显示微信授权
      isClickSet: false, // 是否点击过聊天工具栏设置
      hastUserWxAuth: false, // 用户已完成微信授权
      userWxAuthData: null, // 用户微信授权信息
      isHasWxWorkMsg: false, // 是否已经配置好了会话存档
    };
  },
  computed: {
    ...mapGetters({
      isUpperAdm: 'user/isUpperAdm',
    }),
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    isClickSetTextCal() {
      return this.isClickSet ? '已开启' : '立即更新';
    },
    wxWorkMsgText() {
      return this.isHasWxWorkMsg ? '已开启' : '开启';
    },
    /**
     * @description : 完成的按钮状态
     * @author      : ADI
     * @Date        : 2021-04-25 10:58:51
     */

    finishBtnCal() {
      return this.finishAppTextCal === '已安装' ? 'black' : 'primary';
    },
    /**
     * @description : 完成小程序设置的文案
     * @author      : ADI
     * @Date        : 2021-04-25 10:58:30
     */

    finishAppTextCal() {
      if (this.isInstallByMiniProgram) {
        // 已安装
        return this.isOem ? '修改' : '已安装';
      } else {
        // 未安装
        return '安装';
      }
    },
    showCorpInfoCal() {
      if (this.wxWorkCorpData.corpSetSuccessRel) {
        return {
          corpName: this.wxWorkCorpData.corpName,
          corpDesc: '',
        };
      } else {
        const corpDesc = this.wxWorkCorpData.corpId
          ? `企业ID：${this.wxWorkCorpData.corpId}`
          : '企业微信私域流量运营神器';
        return {
          corpName: this.wxWorkCorpData.corpName || '企业微信',
          corpDesc,
        };
      }
    },
    setTextCal() {
      return this.wxWorkCorpData.corpSetSuccessRel ? '修改' : '立即接入';
    },
    /**
     * 自建应用名称
     * @author waldon
     * @date 2021/1/23
     * @returns {String} - 自建应用名称
     */
    selfAppSetTextCal() {
      return this.wxWorkCorpData.corpAgentOk && this.fileName ? '修改' : '立即开启';
    },
    /**
     * 自建应用名称
     * @author waldon
     * @date 2021/1/23
     * @returns {String} - 自建应用名称
     */
    isShowSelfAppCal() {
      return this.wxWorkCorpData.corpSetSuccessRel;
    },
    /**
     * @description : 小程序已安装
     * @author      : ADI
     * @Date        : 2021-04-25 10:56:06
     */

    isInstallByMiniProgram() {
      return !!this.wxWorkCorpData.appleAgentId;
    },
    /**
     * @description : 是否显示小程序管理盒子
     * @author      : ADI
     * @Date        : 2021-04-25 10:06:30
     */

    showMiniProgramBox() {
      return this.hastUserWxAuth || this.isInstallByMiniProgram;
    },
    miniProgramBoxData() {
      let { appleAgentLogo: logo = '', appleAgentName: name = '', appleAgentDescription: desc = '客户运营专家' } =
        this.wxWorkCorpData || {};
      if (!this.isInstallByMiniProgram && this.userWxAuthData) {
        // 授权完未发布状态,显示授权信息
        const { appHeadImg = '', appName = '' } = this.userWxAuthData || {};
        logo = appHeadImg;
        name = appName;
        desc = `扫码授权过后请选择“${name}”小程序进行安装`;
      }
      return {
        logo,
        name,
        desc,
      };
    },
    wxCorpIcon_bigIMG() {
      return wxCorpIcon_bigIMG;
    },
    title_leftIMG() {
      return title_leftIMG;
    },
    title_rightIMG() {
      return title_rightIMG;
    },
    wxIcon_miniIMG() {
      return wxIcon_miniIMG;
    },
    wxCorpIcon_miniIMG() {
      return wxCorpIcon_miniIMG;
    },
    chartToolIMG() {
      return chartToolIMG;
    },
    msgSettingIMG() {
      return msgSettingIMG;
    },
  },
  watch: {},
  async created() {
    this.checkWxWorkMsgAblity();
    this.getAppAuthUrlByApplet();
    this.getUserWxAuth();
    getGuideList().then(guideList => {
      if (guideList) {
        this.isClickSet = guideList['13'];
      }
    });
    this.fileName = await getUploadFile();
  },
  mounted() {},
  methods: {
    /**
     * 获取企微小程序链接
     * @author waldon
     * @date 2021/1/21
     */
    async getAppAuthUrlByApplet() {
      const [err, res] = await getAppAuthUrlByApplet();
      if (err) {
        return Promise.reject(err);
      }
      this.miniAppAuthUrl = res.data;
    },
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
     * 跳转到聊天工具页
     * @author waldon
     * @date 2021/2/7
     */
    gotoChatTool() {
      this.$router.push({
        path: 'wxChatFunction',
      });
    },
    /**
     * 设置企微应用
     * @author waldon
     * @date 2021/1/21
     */
    toSetApp() {
      const { corpFinishCorp } = this.wxWorkCorpData;
      if (corpFinishCorp || this.isOem) {
        this.toDetail('wxCorpAppDetail');
      } else {
        this.corpInstallDialogVisible = true;
      }
    },
    /**
     * 跳转微信授权页
     * @author wuying
     * @date 2021/5/7
     * @param {String} routerName - 跳转路由名字
     */
    gotoAuthorization(routerName) {
      this.$router.push(routerName);
    },
    /**
     * 设置企微应用
     * @author waldon
     * @date 2021/1/21
     * @param {String} type -
     * @modify wuying 加多一层判断，微信授权 & 分销 & 超管，条件符合判断是否微信授权
     */
    async toDetail(type) {
      if (type === 'setAppDetail' && !this.isPublishApp && !this.isOem) {
        // 未发布小程序并且点击了小程序且是直销的
        if (!this.wxWorkCorpData.appleAgentId) {
          window.open(this.miniAppAuthUrl);
        }
        return;
      }
      if (type === 'setAppDetail' && this.isOem && this.isUpperAdm && !this.wxWorkCorpData.appleAgentId) {
        const [err, res] = await checkWxAuthIsOk();
        if (err) {
          return Promise.reject(err);
        }
        if (!res.data) {
          // 用户没微信授权情况
          this.showAppTip = true;
        } else {
          // 用户微信授权情况
          this.$emit('update:currentTemp', type);
        }
      } else {
        let detailTemp = '';
        switch (type) {
          case 'wxCorpAppDetail':
            detailTemp = this.isOem ? 'wxCorpAppDetail_oem' : 'wxCorpAppDetail';
            break;
          case 'chatToolDetail':
            saveGuide(13).then(() => {
              this.isClickSet = true;
            });
            detailTemp = 'chatToolDetail';
            break;
          case 'setAppDetail':
            detailTemp = 'setAppDetail';
            break;
          case 'wxWorkMsgDetail':
            detailTemp = 'wxWorkMsgDetail';
            break;
        }
        this.$emit('update:currentTemp', detailTemp);
      }
    },
    /**
     * @description : 获取用户自己授权的第三方信息
     * @author      : ADI
     * @Date        : 2021-04-23 17:58:33
     */

    async getUserWxAuth() {
      const [err, res] = await getUserWxAuth();
      if (err) {
        return Promise.reject(err);
      }
      console.log(
        'data, this.wxWorkCorpData.appleAgentId, this.isPublishApp :>> ',
        res.data,
        !!this.wxWorkCorpData.appleAgentId,
        this.isPublishApp,
      );
      const isEmptyData = isEmpty(res.data);
      this.hastUserWxAuth = !isEmptyData;
      if (!isEmptyData) {
        this.userWxAuthData = res.data;
      }
    },
    /**
     * @description 获取是否完成了企微设置
     * @author enson
     * @date 2021-04-25
     */
    async checkWxWorkMsgAblity() {
      const [err, res] = await checkSettingInfoComplete();
      if (err) {
        return Promise.reject(err);
      }
      this.isHasWxWorkMsg = res.data.isComplete;
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.appWrapper {
  .tip-box {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    .warnTips {
      margin-bottom: 0;
    }
  }
  .appBox {
    position: relative;
    display: flex;
    height: 180px;
    padding: 20px;
    border-bottom: 1px solid $border-disabled-color;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    .appContentBox {
      display: flex;
      flex: 1;
      align-items: center;
      flex-flow: row nowrap;
      .imgContent {
        width: 140px;
        height: 140px;
        margin-right: 16px;
        border-radius: 4px;
        flex: 0 0 auto;
      }
      .textBox {
        .corpName {
          font-size: 16px;
          font-weight: bold;
          line-height: 21px;
          color: $color-00;
        }
        .desc {
          max-width: 28em;
          margin-top: 7px;
          overflow: hidden;
          font-size: 14px;
          line-height: 19px;
          color: $color-89;
          text-overflow: ellipsis;
        }
      }
    }
    .setBtn {
      flex: 0 0 auto;
      &.left {
        margin-right: 12px;
        color: $color-53;
      }
    }
  }
  .tableBox {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .titleBox {
      display: flex;
      margin-bottom: 20px;
      flex-flow: row nowrap;
      align-items: center;
      .imgContent {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
      }
      .titleText {
        margin: 0 8px;
        font-size: 20px;
        font-weight: bold;
        line-height: 26px;
        color: #247af3;
      }
    }
    .wxIcon {
      width: 16px;
      height: 16px;
      margin-left: 6px;
      vertical-align: -0.2em;
    }
    .infoPart {
      width: 100%;
      margin-bottom: 32px;
      .infoTitle {
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: bold;
        line-height: 19px;
        color: $color-00;
      }
      .infoContent {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .partBox {
          display: flex;
          height: 120px;
          max-width: 770px;
          min-width: 496px;
          padding: 20px;
          background: $color-ff;
          border: 1px solid $border-disabled-color;
          border-radius: 4px;
          box-sizing: border-box;
          flex: 1;
          align-items: center;
          flex-flow: row nowrap;
          &.hide {
            cursor: auto;
            opacity: 0;
          }
          &.left {
            margin-right: 20px;
          }
          .funcImg {
            width: 80px;
            height: 80px;
            margin-right: 16px;
            border-radius: 4px;
            flex: 0 0 auto;
          }
          .textBox {
            .textTitle {
              margin-right: 8px;
              font-size: 16px;
              font-weight: bold;
              line-height: 21px;
              color: $color-00;
            }
            .textDesc {
              margin-top: 10px;
              margin-right: 20px;
              font-size: 14px;
              line-height: 19px;
              color: $color-b2;
            }
          }
          .funcBtn {
            margin-left: auto;
          }
        }
        &.set-content {
          .partBox {
            cursor: pointer;
            border: 1px dashed $border-color;
            justify-content: center;
            flex-flow: column wrap;
            &.hide {
              cursor: auto;
            }
            &:hover {
              border: 1px dashed #247af3;
              .set-title-box {
                color: #247af3;
              }
              .set-desc {
                color: #247af3;
              }
            }
            .set-title-box {
              font-size: 16px;
              font-weight: bold;
              line-height: 21px;
              color: $color-00;
            }
            .set-desc {
              margin-top: 10px;
              font-size: 14px;
              line-height: 19px;
              color: $color-b2;
            }
          }
        }
      }
    }
  }
}
.set-info.icon {
  color: #247af3;
}
</style>

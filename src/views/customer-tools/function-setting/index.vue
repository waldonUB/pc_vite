<!--
 * @Description  : 获客文章 - 设置
 * @Author       : turbo
 * @Date         : 2021-03-30 13:36:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-09 17:47:16
-->

<template>
  <div class="settingBox">
    <div class="functionSetting">
      <div class="title">
        <global-ts-header>
          <template v-slot:leftPart>
            <div class="flex flex-vc">
              功能设置
            </div>
          </template>
        </global-ts-header>
      </div>
      <div class="contentBox">
        <h3 class="contentBox_title">文章相关设置</h3>
        <div class="twoColumnsThreeItemWrapper flex flex-hw justify-content_flex-justify">
          <!-- 文章展示模块 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="articleModuleIMG" alt="article-module" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">文章展示模块</h5>
                <p class="middle__box_des">设置后，小程序端分享文章的编辑页将不再显示被选中的模块</p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <a @click.stop="showCardModuleDialog(true)" class="right__box_setting">设置</a>
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
          <!-- 统一设置推荐文章模块 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="goodIMG" alt="good" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">
                  <span class="vertical_align_middle">统一设置推荐文章模块</span><global-ts-version></global-ts-version>
                </h5>
                <p class="middle__box_des">开启后，所有文章显示相同的推荐文章，无需单独设置</p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <fa-switch v-model="openAdmRecommend" @change="setArticleRecommend" />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
          <!-- 统一设置显示“创建我的文章” -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="articleIMG" alt="article" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">统一设置显示“创建我的文章”</h5>
                <p class="middle__box_des">开启后，所有文章的底部都将显示“创建我的文章”按钮</p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <fa-switch v-model="showCreateMyArticleForH5" @change="setCreateBtn" />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
          <!-- 不可见文章分类 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="checkIMG" alt="check" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">不可见文章分类</h5>
                <p class="middle__box_des">开启后，选中的素材文章分类将不会在小程序端对销售员显示</p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <a v-show="libraryForm.open" @click.stop="showTypeBox(true, false)" class="right__box_setting">设置</a>
                <fa-switch v-model="libraryForm.open" @change="showTypeBox" />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
          <!-- 访客关注公众号设置 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="settingIMG" alt="setting" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">
                  <span class="vertical_align_middle">访客关注公众号设置</span>
                  <global-ts-version></global-ts-version>
                </h5>
                <p class="middle__box_des">
                  <span>开启后，访客阅读文章时将引导关注公众号 </span>
                  <global-ts-tool-tips
                    popper-class="articlePublic"
                    effect="light"
                    offset="10"
                    class="item"
                    placement="right"
                  >
                    <global-ts-svg-icon class="icon iconGray iconWenhao1616" name="icon-wenhao1616" />
                    <div slot="content" class="articleGifBox">
                      <img class="imgContent" :src="articlePublicIMG" alt="" />
                      <div class="articleTipBox">
                        说明：由于微信不允许强制关注行为，访客点击取消按钮后，也能够阅读全文
                      </div>
                    </div>
                  </global-ts-tool-tips>
                </p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <fa-switch
                  v-model="publicConf.isOpenViewerBindWxMp"
                  @change="status => etRadioStateGroup(status, 'articleSetPublic')"
                />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
        </div>
        <h3 class="contentBox_title">其他设置</h3>
        <div class="twoColumnsThreeItemWrapper flex flex-hw justify-content_flex-justify">
          <!-- 公众号提醒 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="promptIMG" alt="prompt" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">公众号提醒</h5>
                <p class="middle__box_des">
                  开启后，有新访客时将通过公众号进行提醒，在【小程序】-【个人中心】绑定后可用
                </p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <fa-switch v-model="publicSettingOpen" @change="status => handlePublicSettingStatusChange(status)" />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
          <!-- 优质访客定义 -->
          <ts-two-columns-three-item-by-flex>
            <template v-slot:left>
              <img class="cardBox-left__icon" :src="qualityManIMG" alt="quality-man" />
            </template>
            <template>
              <div class="cardBox-middle__box">
                <h5 class="middle__box_title">优质访客定义</h5>
                <p class="middle__box_des">设置后，系统根据设置的条件自动判断是否属于优质访客</p>
              </div>
            </template>
            <template v-slot:right>
              <div class="cardBox-right__box flex flex-vc">
                <a
                  v-show="viewForm.isOpenQualityViewer"
                  @click="toggleQualityViewerDialogShow(true)"
                  class="right__box_setting"
                  >设置
                </a>
                <fa-switch
                  v-model="viewForm.isOpenQualityViewer"
                  @change="status => handleQualityViewerOpenStatusChange(status)"
                />
              </div>
            </template>
          </ts-two-columns-three-item-by-flex>
        </div>
        <quality-viewer-dialog
          ref="qualityViewerDialog"
          :qualityOriginFormData="qualityOriginFormData"
          @confirm="handleQualityViewerDialogConfirm"
        />
        <select-type-box @onselectHandle="addType" ref="child"></select-type-box>
        <card-module-dialog ref="cardModule"></card-module-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import QualityViewerDialog from './components/quality-viewer-dialog/index.vue';
import SelectTypeBox from './components/select-type-box/index.vue';
import CardModuleDialog from './components/card-module-dialog/index.vue';
import { postMessageByMultiInstance } from './utils';
import { postMessage } from '@/utils';
import { functionSettingSaveTsConf } from '@/api/modules/views/customer-tools/funtions-setting';
import { Switch } from '@fk/faicomponent';
import { mapState } from 'vuex';
import { logDog, getLimitTips, postLimitVer, topTip, filterData, confirm } from '@/utils';
import versionDef from '@/config/version-def';
import TsTwoColumnsThreeItemByFlex from '@/components/base/ts-two-columns-three-item-by-flex/index.vue';
import { getTsConf, getTsTypeConf } from '@/api/modules/views/customer-tools/funtions-setting';
import articleModuleIMG from '@/assets/image/functionSetting/article-module.png';
import goodIMG from '@/assets/image/functionSetting/good.png';
import articleIMG from '@/assets/image/functionSetting/article.png';
import checkIMG from '@/assets/image/functionSetting/check.png';
import settingIMG from '@/assets/image/functionSetting/setting.png';
import articlePublicIMG from '@/assets/image/customList/articlePublic.gif';
import promptIMG from '@/assets/image/functionSetting/prompt.png';
import qualityManIMG from '@/assets/image/functionSetting/quality-man.png';

export default {
  name: 'FunctionSetting',
  components: {
    QualityViewerDialog,
    SelectTypeBox,
    CardModuleDialog,
    TsTwoColumnsThreeItemByFlex,
    [Switch.name]: Switch,
  },
  data() {
    return {
      version: versionDef.checkIsFree(),
      checked: true,
      openSettingList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      seeSettingList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      createBtnList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      publicSettingList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      articleSettingList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      showCreateMyArticleForH5: false, //文章底部创建文章按钮
      publicSettingOpen: true,
      openAdmRecommend: false,
      viewForm: {
        qualityMinClicks: '',
        qualityMinReadTimeSecond: '',
        isOpenQualityViewer: false,
      },
      libraryForm: {
        open: false,
        restrictTypes: [],
      },
      hasData: false,
      Rules: {
        click: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入最小点击次数',
              topTips: '最小点击次数为空',
            },
            max: {
              limitNum: 6,
              tips: '最小点击次数不能超过6位数',
              topTips: '最小点击次数超过上限',
            },
          },
        ],
        time: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入最少阅读时间',
              topTips: '最少阅读时间为空',
            },
            max: {
              limitNum: 6,
              tips: '最少阅读时间不能超过6位数',
              topTips: '最少阅读时间超过上限',
            },
          },
        ],
        defindErrType: {},
      },
      typeList: '',
      restrictTypeList: {},
      notSetArticle: true, //免费版|个人版 + 销售员不可点击/不显示
      publicConf: {
        isBindMp: false, // 是否绑定公众号
        viewerBindMpVer: false, // 版本校验是否通过
        isOpenViewerBindWxMp: false, // 是否开启了访客关注公众号指引
      },
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    /**
     * 免费版或没有授权公众号
     * @author waldon
     * @date 2020/12/14
     * @returns {Boolean} - 返回值说明
     */
    isOpenArticleSetPublicCal() {
      if (!this.publicConf.viewerBindMpVer || !this.publicConf.isBindMp) {
        // 不满足条件自动关闭开启选项，和disabled不一样
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.publicConf.isOpenViewerBindWxMp = false;
      }
      return !this.publicConf.viewerBindMpVer || !this.publicConf.isBindMp;
    },
    // 优质访客表单数据[最小点击数，最少阅读时间]
    qualityOriginFormData() {
      const { qualityMinClicks = '', qualityMinReadTimeSecond = '' } = this.viewForm;
      return {
        qualityMinClicks,
        qualityMinReadTimeSecond,
      };
    },
    goodIMG() {
      return goodIMG;
    },
    articleIMG() {
      return articleIMG;
    },
    checkIMG() {
      return checkIMG;
    },
    settingIMG() {
      return settingIMG;
    },
    articlePublicIMG() {
      return articlePublicIMG;
    },
    promptIMG() {
      return promptIMG;
    },
    qualityManIMG() {
      return qualityManIMG;
    },
    articleModuleIMG() {
      return articleModuleIMG;
    },
  },
  watch: {
    'viewForm.isOpenQualityViewer'(nVal) {
      if (nVal) {
        // 开启精准用户定义
        logDog('openQualityViewer');
      } else {
        // 关闭
        this.tanshu_firstSubmit = true;
        logDog('closeQualityViewer');
      }
    },
    'publicSettingOpen'(nVal) {
      if (nVal) {
        // 开启公众号提醒
        logDog('publicSettingOpen');
      } else {
        // 关闭
        logDog('publicSettingClose');
      }
    },
    'libraryForm.open'(nVal) {
      if (nVal) {
        // 开启不可见文章
        logDog('libraryFormOpen');
      } else {
        // 关闭
        logDog('libraryFormClose');
      }
    },
  },
  created() {
    this.getSetting();
    logDog('showFunctionSetting');
    getLimitTips('adRecommend').then(res => {
      this.notSetArticle = !res.condition;
    });
  },
  methods: {
    /**
     * 后续所有的改状态的方法放这里写，
     * 无需另起方法写重复的代码
     * @author waldon
     * @date 2020/12/14
     * @param {Object} rowData - 行数据
     * @param {String} type - 类型
     */
    setRadioState(rowData, type) {
      switch (type) {
        case 'articleSetPublic':
          this.publicConf.isOpenViewerBindWxMp = rowData.key;
          break;
      }
    },
    /**
     * 后续所有的点击的方法放这里写，
     * 无需另起方法写重复的代码
     * @author waldon
     * @date 2020/12/14
     * @param {Object} rowData - 行数据
     * @param {String} type - 类型
     */
    operateRadio(rowData, type) {
      switch (type) {
        case 'articleSetPublic':
          if (rowData.key) {
            if (!this.publicConf.viewerBindMpVer) {
              // 版本提示
              const isOem = this.isOem;
              const versionList = isOem
                ? versionDef.NotDirectVersionDef.VersionList
                : versionDef.DirectVersionDef.VersionList;
              const limitVer = isOem ? versionList.STANDARD : versionList.PROFESSIONNAL;
              postLimitVer(`该功能为${versionDef.getVersionName(limitVer)}功能`, 0, 2);
            } else if (!this.publicConf.isBindMp) {
              // 未授权提示
              topTip({
                msg: '授权公众号后才能开启',
                btnText: '去授权',
                fn: this.gotoAuth,
              });
            }
          }
          break;
        case 'openAdmRecommend':
          if (rowData.key) {
            if (!this.publicConf.viewerBindMpVer || this.notSetArticle) {
              // 版本提示
              const isOem = this.isOem;
              const versionList = isOem
                ? versionDef.NotDirectVersionDef.VersionList
                : versionDef.DirectVersionDef.VersionList;
              const limitVer = isOem ? versionList.STANDARD : versionList.PROFESSIONNAL;
              postLimitVer(`该功能为${versionDef.getVersionName(limitVer)}功能`, 0, 2);
            }
          }
      }
    },
    /**
     * 组合访客关注公众号设置业务逻辑
     * 授权公众号后才能开启
     * @description: ADI呀
     * @param {Boolean} enable - 开关状态
     * @param {String} type - 类型
     */

    etRadioStateGroup(enable, type) {
      const rowData = { key: enable };
      if (this.isOpenArticleSetPublicCal) {
        this.operateRadio(rowData, type);
        this.publicConf.isOpenViewerBindWxMp = false;
        return false;
      }
      this.setRadioState(rowData, type);
      this.saveSetting();
    },
    /**
     * 跳到授权页
     * @author waldon
     * @date 2020/12/14
     */
    gotoAuth() {
      this.$router.push({
        path: '/bindMp',
      });
    },
    async showCardModuleDialog() {
      const [err, res] = await getTsConf();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return;
      }
      this.$refs.cardModule.parentControl(true, res.data.profConf);
    },
    /**
     *点击设置是否开启H5端的创建文章按钮
     *
     * @author tomato
     * @date 2020-05-21
     * @param {*} open
     */
    setCreateBtn(open) {
      this.showCreateMyArticleForH5 = open;
      this.saveSetting();
    },
    /**
     *点击分类设置
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} open
     * @param {Boolean} useUpdateSetting - 是否更新设置
     */

    async showTypeBox(open, useUpdateSetting = true) {
      const [err, res] = await getTsTypeConf();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return false;
      }
      this.restrictTypeList = Object.assign({}, res.data.restrictTypeList);
      useUpdateSetting && this.saveSetting();
      if (open) {
        this.$refs.child.parentMsg(open, this.restrictTypeList, res.data.isShow);
      }
    },
    /**
     *保存热文分类回调
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} e
     */
    addType(e) {
      const len = e.length;
      this.typeList = [].concat(e);
      this.libraryForm.restrictTypes = JSON.stringify(this.typeList);
    },
    async getSetting() {
      const [err, res] = await getTsConf();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return;
      }
      const getTsConfData = res.data;
      //精准用户定义
      this.hasData = JSON.stringify(getTsConfData.viewerConf) == '{}' ? false : true;
      if (this.hasData) {
        Object.assign(
          this.viewForm,
          filterData(getTsConfData.viewerConf, ['qualityMinClicks', 'qualityMinReadTimeSecond', 'isOpenQualityViewer']),
        );
        this.viewForm.isOpenQualityViewer = getTsConfData.viewerConf.isQualityViewer;
      }
      this.showCreateMyArticleForH5 = getTsConfData.profConf.showCreateMyArticleForH5;
      //不可见分类
      this.libraryForm.open = Boolean(getTsConfData.libraryConf.open);
      this.libraryForm.restrictTypes = getTsConfData.libraryConf.restrictTypes;
      this.restrictTypeList = Object.assign({}, getTsConfData.libraryConf.restrictTypeList);
      this.$refs.cardModule.cardModuleData = { ...getTsConfData.profConf };
      //公众号提醒
      this.publicSettingOpen = getTsConfData.profConf.isOpenMpPush;
      // 统一推荐文章设置
      this.openAdmRecommend = getTsConfData.profConf.openAdmRecommend;
      for (const key in this.publicConf) {
        this.publicConf[key] = getTsConfData.profConf[key];
      }
    },
    /**
     *设置公众号提醒
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} index
     */
    setPublicTip(index) {
      if (index == 0) {
        confirm('关闭后，小程序里该选项将隐藏，所有人都无法收到公众号提醒，保存后生效。', '关闭确认', '我知道了')
          .then(action => {
            if (action == 'confirm') {
              this.publicSettingOpen = false;
            }
          })
          .catch(() => {
            this.publicSettingOpen = true;
          });
      }
    },
    // 设置推荐文章
    setArticleRecommend(enable) {
      const rowData = { key: enable };
      // 原逻辑是通过判断notSetArticle 进行 disable，测试(少华)反馈添加升级弹窗
      if (!this.publicConf.viewerBindMpVer || this.notSetArticle) {
        this.operateRadio(rowData, 'openAdmRecommend');
        return (this.openAdmRecommend = !enable);
      }
      this.openAdmRecommend = enable;
      this.saveSetting();
    },
    /**
     * 优质访客定义
     */
    // 优质访客定义-状态改变
    handleQualityViewerOpenStatusChange(status) {
      this.saveSetting();
      status && this.toggleQualityViewerDialogShow(true);
    },
    // 优质访客定义弹窗-显示/隐藏
    toggleQualityViewerDialogShow(show = true) {
      this.$refs.qualityViewerDialog && this.$refs.qualityViewerDialog.parentControl(show);
    },
    // 优质访客定义弹窗-确定操作
    handleQualityViewerDialogConfirm(formData) {
      const { qualityMinClicks, qualityMinReadTimeSecond } = formData;
      Object.assign(this.viewForm, {
        qualityMinClicks,
        qualityMinReadTimeSecond,
      });
      this.saveSetting().then(
        res => {
          this.toggleQualityViewerDialogShow(false);
        },
        err => {
          // console.log('err');
        },
      );
    },
    /**
     * 公众号提醒
     */
    // 公众号提醒-状态改变
    handlePublicSettingStatusChange(show) {
      this.saveSetting();
    },
    //保存设置
    async saveSetting() {
      const data = {
        viewerConf: JSON.stringify(this.viewForm),
        libraryConf: JSON.stringify(this.libraryForm),
        profConf: JSON.stringify(
          Object.assign(
            this.$refs.cardModule.cardModuleData,
            {
              isOpenMpPush: this.publicSettingOpen,
              openAdmRecommend: this.openAdmRecommend,
              showCreateMyArticleForH5: this.showCreateMyArticleForH5,
            },
            this.publicConf,
          ),
        ),
      };
      const [err, res] = await functionSettingSaveTsConf(data);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg,
          duration: 1500,
          multiInstance: true,
        });
        return Promise.reject(err.msg);
      }
      const message = res.msg || '修改成功';
      postMessageByMultiInstance({
        type: 'success',
        message,
      });
      this.getSetting();
      this.hasData = true;
      return Promise.resolve(message);
    },
  },
};
</script>

<style lang="scss" scoped>
.settingBox {
  .functionSetting {
    .contentBox {
      min-height: 65vh;
      padding: 20px;
      padding-bottom: 10vh;
      background: $color-ff;
      border-radius: 4px;
      .contentBox_title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;
        line-height: 21px;
        color: $color-00;
      }
    }
    .icon {
      float: none;
      width: 1.2em;
      height: 1.2em;
      margin-left: 8px;
      overflow: hidden;
      color: #247af3;
      vertical-align: -0.15em;
      &.iconGray {
        color: $color-b2;
      }
      &.iconWenhao1616 {
        width: 16px;
        height: 16px;
      }
    }
    .tanshu_err {
      line-height: 15px;
      .icon {
        float: left;
        width: 1em;
        height: 1em;
        overflow: hidden;
        color: $error-color;
        vertical-align: -0.15em;
      }
    }
  }
}
.articlePublic {
  .articleGifBox {
    display: flex;
    width: 265px;
    height: 485px;
    padding: 20px;
    background: $color-ff;
    border-radius: 8px;
    box-shadow: 0 8px 24px 0 rgba(7, 1, 38, 0.07);
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    .imgContent {
      display: block;
      width: 225px;
      height: 400px;
      margin-bottom: 9px;
      flex: 0 0 auto;
    }
    .articleTipBox {
      width: 204px;
      font-size: 12px;
      line-height: 18px;
      color: #67707e;
      word-break: break-all;
      flex: 0 0 auto;
    }
  }
}
</style>

<style lang="scss">
.articlePublic {
  &.el-tooltip__popper {
    &.is-light {
      padding: 0;
      border: none;
    }
  }
  .popper__arrow {
    display: none;
  }
}
.settingBox {
  .el-checkbox {
    font-size: 0;
  }
  .el-checkbox__label {
    display: inline;
    padding-left: 8px;
    vertical-align: middle;
  }
  .el-checkbox__input {
    font-size: 0;
  }
}
</style>

<!--
 * @Description  : 接入商城
 * @Author       : turbo
 * @Date         : 2021-03-30 15:28:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 18:04:25
-->

<template>
  <div class="bindMall">
    <global-ts-dialog
      class="bindDialog"
      :dialog-visible.sync="isShowDialog"
      :closable="false"
      dialog-size="small"
      :dialog-title="popupTitle"
    >
      <div>
        <div class="bindBox">
          <global-ts-fai-select
            :selectkey="{ label: 'label', value: 'value' }"
            class="cooperation width_full-max"
            type="large"
            :class="{ mainSite: !isOldVer }"
            v-model="siteValue"
            :list="mallSiteList"
          >
          </global-ts-fai-select>
          <p class="bindInfo" v-if="selectHasAuth && isOldVer">
            待授权商城小程序:<span>{{ selectAppName }}</span>
          </p>
          <p class="bindInfo" v-if="!selectHasAuth">站点未授权小程序，请更换站点或【去授权】</p>
        </div>
      </div>
      <div slot="footer" class="buttonBox">
        <global-ts-button v-if="selectHasAuth" type="primary" size="small" @click="toRelated">
          {{ setMainSite ? '确定' : '添加关联授权' }}
        </global-ts-button>
        <global-ts-button v-if="!selectHasAuth" type="primary" size="small" @click="toBind">去授权 </global-ts-button>
        <global-ts-button class="min_width_88" type="others" size="small" @click="cancelShow">取消 </global-ts-button>
      </div>
    </global-ts-dialog>

    <global-ts-header>
      <template v-slot:leftPart>接入商城</template>
    </global-ts-header>
    <div class="mallSettingBox cardInGrey" :class="hasVersionBox ? 'hasVersionBox' : ''">
      <div class="mallImg"></div>
      <div class="rightPart" :class="!isShowVersion ? 'free' : 'vip'">
        <div class="mymall">
          <p>我的商城</p>
          <global-ts-version :limitVer="showVer"></global-ts-version>
        </div>
        <p class="mallexplain">社交电商、流量变现</p>
        <div class="isOpenH5Mall">
          <span v-for="(item, index) in openSettingList" :key="index">
            <input
              v-model="isOpen"
              type="radio"
              :disabled="!isShowVersion"
              @change="openMall"
              :id="'phoneMall' + index"
              :value="item.key"
            />
            <label :for="'phoneMall' + index">{{ item.value }}</label>
          </span>
        </div>
        <global-ts-version-warning v-if="!isOem"></global-ts-version-warning>
      </div>
    </div>
    <div class="pro_listBox" v-if="isOpen">
      <el-table class="tshu-tableset" border header-row-class-name="employeeHeader" :data="bindInfoList">
        <el-table-column v-if="!isOldVer" prop="h5MallStatus" label="手机微商城状态"></el-table-column>
        <el-table-column v-if="!isOldVer" prop="appMallStatus" label="小程序商城状态"></el-table-column>
        <el-table-column v-if="isOldVer" prop="codeStatusName" label="小程序商城状态"></el-table-column>
        <el-table-column prop="companyName" label="关联的商城站点"></el-table-column>
        <el-table-column prop="mallAppName" label="关联的小程序名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operateBtn" v-if="hasAuthTsMallSite && hasAuthTsMallApp">
              <div v-if="isOldVer">
                <global-ts-button
                  v-if="needCommitApp"
                  class="text_but1"
                  style="margin-right: 10px;"
                  type="textGreen"
                  size="small"
                  @click="commitCheck(scope.id)"
                  >提交审核
                </global-ts-button>
                <global-ts-button class="text_but1" type="textGreen" size="small" @click="deleteBind('isOld')">
                  删除关联
                </global-ts-button>
              </div>
              <div v-if="!isOldVer">
                <global-ts-button
                  class="text_but1"
                  v-if="siteList.length > 1"
                  type="textGreen"
                  size="small"
                  @click="setSite()"
                  >设置主站点
                </global-ts-button>
                <global-ts-button
                  class="text_but1"
                  v-if="siteList.length > 1"
                  type="textGreen"
                  size="small"
                  @click="deleteBind('isNew')"
                  >取消主站点
                </global-ts-button>
                <global-ts-button
                  class="text_but1"
                  v-if="!isBindWx"
                  type="textGreen"
                  size="small"
                  @click="addBind('toBindAuth')"
                  >去授权
                </global-ts-button>
                <global-ts-button
                  class="text_but1"
                  v-if="!hasReleaseMallApp && isBindWx"
                  type="textGreen"
                  size="small"
                  @click="toBind"
                  >去发布
                </global-ts-button>
              </div>
            </div>
            <div class="operateBtn" v-if="hasAuthTsMallSite && !hasAuthTsMallApp">
              <div v-if="isOldVer">
                <global-ts-button class="text_but1" type="textGreen" size="small" @click="addBind('toBindAuth')">
                  立即授权
                </global-ts-button>
              </div>
              <div v-if="!isOldVer">
                <global-ts-button
                  class="text_but1"
                  v-if="siteList.length > 1"
                  type="textGreen"
                  size="small"
                  @click="setSite()"
                  >设置主站点
                </global-ts-button>
                <global-ts-button
                  class="text_but1"
                  v-if="siteList.length > 1"
                  type="textGreen"
                  size="small"
                  @click="deleteBind('isNew')"
                  >取消主站点
                </global-ts-button>
                <global-ts-button class="text_but1" type="textGreen" size="small" @click="addBind('toBindAuth')">
                  去授权
                </global-ts-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <template slot="empty">
          您尚未关联商城站点，无法使用商城功能。<a class="addBindBtn" @click="addBind('isLink')">添加关联</a>
        </template>
      </el-table>
      <ol class="help">
        <li>H5文章中的推荐商品，支持跳转到手机微商城进行购买（开启后可用）</li>
        <li>小程序名片中的主推商品，支持跳转到小程序商城进行购买</li>
        <li v-if="isOldVer">
          小程序商城功能，需要关联商城小程序，并通过微信审核后才能使用<a
            class="helpLink"
            target="_blank"
            :href="helpLink"
            >查看帮助
          </a>
        </li>
        <li v-else>
          小程序商城功能，需要完成微信授权后才能使用<a class="helpLink" target="_blank" :href="helpLink">查看帮助</a>
        </li>
      </ol>
    </div>
    <div class="introduction cardInGrey" v-if="!isOpen"></div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import { post, confirm, format, cookie } from '@/utils';
import { submitCheck } from '@/api/modules/views/mall-manage/bind-mall';

export default {
  name: 'bindMall',
  components: {},
  props: {},
  data() {
    return {
      // 从2020年4月24日起，使用跳转其他小程序功能将无需在全局配置中声明跳转名单，调用此接口时将不再校验所跳转的 AppID 是否在 navigateToMiniProgramAppIdList 中
      // 如果用户还是需要配置白名单，那么就在链接上带上isOldVer即可
      isOldVer: this.$route.query.isOldVer, // 默认为false 即使用新版
      mallSiteList: [], //站点列表
      bindInfoList: [], //授权信息
      isBindWx: false, //是否微信授权
      canUseMallWithoutMP: false, // 是否能非微信授权就使用商城功能
      isInCheck: false, //是否在审核种
      hasAuthTsMallSite: false, //是否关联站点
      hasAuthTsMallApp: false, //是否授权商城小程序
      isShowDialog: false, //是否显示弹窗
      siteValue: '', //选择的关联站点
      selectAppName: '', //授权的小程序名称
      selectAppId: '', //授权的小程序id
      selectHasAuth: true, //选择的站点是否授权
      manageFrameMallAppUrl: '', //小程序去授权地址
      siteList: [], //站点列表
      needCommitApp: false, //是否需要提交审核
      hasCreatedMallSite: false, //是否创建站点
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
      isOpen: false, // 是否开启商城 20200729版本将俩个字段isOpenH5Mall + isOpenAppMall合成一个
      version: versionDef.checkIsFree(),
      versionInfo: versionDef.getVersionInfo(),
      setMainSite: false, // 是否设置主站点
      currentSiteAuth: true, // 当前站点是否已经授权了
      hasReleaseMallApp: false, // 判断商城小程序是否已经发布了
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      addressUrl: state => state.globalData.addressUrl,
      userInfo: state => state.user.info,
      functionInfo: state => state.globalData?.functionInfo,
    }),
    showVer() {
      return this.isOem
        ? versionDef.NotDirectVersionDef.VersionList.MID
        : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL;
    },
    helpLink() {
      return this.addressUrl.mallHelpUrl;
    },
    restDay() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'day');
    },
    restHour() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'hour');
    },
    isShowVersion() {
      return this.functionInfo.mallFunction.condition;
    },
    popupTitle() {
      let title = '关联商城站点并授权';
      if (this.setMainSite) {
        title = '设置主站点';
      }
      return title;
    },
    /**
     * @description 有限时优惠或者有版本倒计时
     * @author enson
     * @date 2020-08-06
     */
    hasVersionBox() {
      return this.version && !this.userInfo.isShowTreeTry && !this.isOem;
    },
  },
  watch: {
    //监听站点选择
    siteValue: {
      handler() {
        console.log(this.siteValue);
        const selectInfo = this.siteList.find(item => {
          return item.siteid == this.siteValue;
        });
        if (selectInfo != undefined) {
          this.selectAppName = selectInfo.mallAppInfo.nickName || '无';
          this.selectAppId = selectInfo.mallAppInfo.authappid;
          this.selectHasAuth = selectInfo.mallAppInfo.hasAuth;
          this.currentSiteAuth = selectInfo.mallAppInfo.hasAuth;
          if (!this.isOldVer) {
            this.selectHasAuth = true;
          }
          this.manageFrameMallAppUrl = selectInfo.manageFrameMallAppUrl;
        }
      },
      immediate: true,
    },
    isShowDialog(nVal) {
      console.log('nVal', nVal);
      if (!nVal) {
        setTimeout(() => {
          this.setMainSite = false;
        }, 300);
      }
    },
  },
  async created() {
    if (this.userInfo.isShowTreeTry) {
      this.$utils.logDog('mall_Open_show');
    }
    //获取授权信息
    this.$utils.logDog('product_setting');
    await this.getMallConf();
    await this.getTsUserAuthMallInfo();
    await this.getMallSiteList().then(() => {
      this.isShowDialog = Boolean(this.$route.query.isShow);
      if (this.$route.query.siteId !== undefined) {
        this.siteValue = this.$route.query.siteId == -1 ? this.mallSiteList[0].value : this.$route.query.siteId;
      }
      const selectInfo = this.siteList.find(item => {
        return item.siteid == this.siteValue;
      });
      if (selectInfo != undefined) {
        this.selectAppName = selectInfo.mallAppInfo.nickName || '无';
        this.selectAppId = selectInfo.mallAppInfo.authappid;
        this.selectHasAuth = selectInfo.mallAppInfo.hasAuth;
        this.currentSiteAuth = selectInfo.mallAppInfo.hasAuth;
        // 如果是新版的授权页面的话，授权和关联站点逻辑分开，可以给他直接关联站点，无需再次判断是否需要站点授权
        if (!this.isOldVer) {
          this.selectHasAuth = true;
        }
        this.manageFrameMallAppUrl = selectInfo.manageFrameMallAppUrl;
      }
    });
    this.$utils.logDog('showBindMall');
  },
  mounted() {},
  methods: {
    transTime(time, key) {
      const dayUnit = 24 * 60 * 60;
      const hourUnit = 60 * 60;
      const day = Math.floor(time / dayUnit);
      const remain = time % dayUnit;
      const hour = Math.floor(remain / hourUnit);
      if (key == 'day') {
        return day > 9 ? day : '0' + day;
      } else if (key == 'hour') {
        return hour > 9 ? hour : '0' + hour;
      }
    },
    /**
     *立即升级
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    jumpUrl() {
      window.open(this.addressUrl.updateVersionUrl);
    },
    /**
     * @description 开通/关闭商城
     * @author enson
     * @date 2020-07-20
     */
    openMall() {
      // 产品说保留H5的开通记录
      if (this.isOpen) {
        this.$utils.logDog('product_H5_open');
      } else {
        this.$utils.logDog('product_H5_close');
      }
      this.$utils.FdpLog('yx_sckg', {
        // 打开/关闭商城开关
        yx_free_bool_0: this.isOpen ? true : false,
      });
      this.saveMallConf();
    },
    /**
     *获取设置信息
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    getMallConf() {
      post('/ajax/mall/tsMall_h.jsp?cmd=getMallConf').then(response => {
        if (response && response.success) {
          this.isOpen = response.data.isOpenMall;
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * 快速创建站点
     *
     * @author guoyijie
     * @date 2020-05-07
     * @returns
     */
    createSiteId() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=createFirstSiteId').then(response => {
          if (response && response.success) {
            this.getTsUserAuthMallInfo();
            this.hasCreatedMallSite = true;
            resolve();
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
    /**
     * 保存设置信息
     *
     * @author guoyijie
     * @date 2020-05-07
     * @param {*} type
     */
    async saveMallConf(type) {
      await post('/ajax/mall/tsMall_h.jsp?cmd=saveMallConf', {
        openMall: this.isOpen,
      }).then(response => {
        if (response && response.success) {
          this.$utils.postMessage({
            type: 'success',
            message: this.isOpen ? '开启成功' : '关闭成功',
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });

      await this.getMallConf();
      await this.getTsUserAuthMallInfo();
    },
    /**
     * 提交审核
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    commitCheck() {
      confirm('审核通过后，商城功能才可用', '是否确认提交审核?').then(async () => {
        const [err, res] = await submitCheck();
        if (err) {
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '提交审核成功',
        });
        this.getTsUserAuthMallInfo();
      });
    },
    /**
     * 删除授权
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    deleteBind(type) {
      let popupContent = ['确定删除该商城关联（同时会删除小程序授权）？删除后需重新授权', '删除确认'];
      if (type === 'isNew') {
        popupContent = ['确认取消主站点？', '取消确认'];
      }
      confirm(popupContent[0], popupContent[1]).then(() => {
        post('/ajax/mall/tsMall_h.jsp?cmd=delMallTsUser').then(response => {
          if (response && response.success) {
            this.getTsUserAuthMallInfo();
            this.$utils.postMessage({
              type: 'success',
              message: response.msg,
            });
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
    /**
     * 立即关联 / 立即授权
     *
     * @author guoyijie
     * @params type - isLink 用户点击添加关联, 不判断是否微信授权了, 可以先添加站点
     *              - toBindAuth 用户点击去授权 此时不仅要判断是否是否已经微信授权，还需要判断是否需要授权站点
     * @date 2020-05-07
     * @returns
     */

    addBind(type) {
      // 没微信授权并且不是点击去关联：给提示
      // 新旧版页面同步 如果点击关联, 不判断是否微信授权了，可以先关联，然后在微信授权
      if (type !== 'isLink' && !this.isBindWx && !this.canUseMallWithoutMP) {
        if (!this.isOldVer) {
          this.$router.push({
            path: '/bindMp',
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: '微信授权未完成或正在审核中',
          });
        }
        return;
      }

      // 如果点击的是去授权，需要判断当前站点是否有
      if (type === 'toBindAuth' && !this.currentSiteAuth) {
        this.toBind();
        return;
      }

      // 创建站点
      if (!this.hasCreatedMallSite) {
        confirm('', '您尚未开通商城，是否快速开通?').then(() => {
          // 用于创建商城站点时，记录来源
          cookie('openMallSourceId', 70900, {
            expires: format.addDate(new Date(), 1, 'days'),
          });

          this.createSiteId().then(() => {
            this.getMallSiteList();
            this.bind(true);
          });
        });

        return;
      }

      // 关联商城站点
      this.bind(false, type);
    },
    /**
     * 关联商城站点
     *
     * @author guoyijie
     * @date 2020-05-07
     * @param {boolean} isFromCreateSite
     * @returns
     */
    bind(isFromCreateSite, type) {
      if (this.isBindWx || this.canUseMallWithoutMP || type === 'isLink') {
        this.isShowDialog = true;
        return;
      }
      // 没微信授权：给提示
      this.$utils.postMessage({
        type: 'error',
        message: isFromCreateSite
          ? '创建站点成功，可是微信授权未完成或正在审核中；请完成后再继续'
          : '微信授权未完成或正在审核中',
      });
    },
    /**
     * 关闭授权弹窗
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    cancelShow() {
      this.isShowDialog = false;
    },
    /**
     * 添加关联授权
     * */
    toRelated() {
      const obj = {
        siteId: this.siteValue,
        mallAppId: this.selectAppId,
      };
      post('/ajax/mall/tsMall_h.jsp?cmd=relatedMallTsUser', obj).then(response => {
        if (response && response.success) {
          this.isShowDialog = false;
          this.getTsUserAuthMallInfo();
          this.$utils.postMessage({
            type: 'success',
            message: response.msg,
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     *去商城授权
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    toBind() {
      window.open('http://' + this.manageFrameMallAppUrl, '_blank');
    },
    /**
     * 获取用户授权以及站点关联信息
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    getTsUserAuthMallInfo() {
      post('/ajax/mall/tsMall_h.jsp?cmd=getTsUserAuthMallInfo').then(response => {
        if (response && response.success) {
          const res = response.data;
          this.isBindWx = res.hasAuthTsUserApp; //是否微信授权
          this.canUseMallWithoutMP = res.canUseMallWithoutMP;
          this.isInCheck = res.codeStatus == 2; //审核状态（2为审核中）
          this.hasAuthTsMallSite = res.hasAuthTsMallSite; //是否关联站点
          this.hasAuthTsMallApp = res.hasAuthTsMallApp; //是否授权商城小程序
          this.needCommitApp = res.needCommitApp; //是否需要提交审核
          this.hasCreatedMallSite = res.hasCreatedMallSite; //是否创建站点
          this.currentSiteAuth = res.hasAuthTsMallApp; // 当前站点是否已经授权
          this.hasReleaseMallApp = res.hasReleaseMallApp; // 商城小程序是否已经发布
          if (this.hasAuthTsMallSite) {
            this.siteValue = res.siteId;
            this.$set(this.bindInfoList, 0, {
              siteId: res.siteId,
              companyName: res.companyName,
              mallAppName: res.mallAppName,
              codeStatusName: res.codeStatusName,
              appMallStatus: res.appMallStatus,
              h5MallStatus: res.h5MallStatus,
            });
          } else {
            this.bindInfoList = [];
          }
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * 获取商城站点列表
     *
     * @author guoyijie
     * @date 2020-05-07
     * @returns
     */
    getMallSiteList() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=getMallSiteList').then(response => {
          if (response && response.success) {
            this.siteList = response.data;
            this.mallSiteList = [];
            this.siteList.forEach(item => {
              this.mallSiteList.push({
                value: item.siteid,
                label: item.companyName,
              });
            });

            if (this.siteValue === '' && this.siteList.length > 0) {
              this.siteValue = this.siteList[0].siteid;
            }

            resolve();
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
    /**
     * @description 设置主站点 关联站点
     * @author enson
     * @date 2020-06-11
     * @param {*} id 站点id
     */
    setSite() {
      this.setMainSite = true;
      this.addBind('isLink'); // 设置主站点时看是否存在站点，如果站点不存在则需要创建站点
    },
  },
};
</script>

<style lang="scss" scoped>
.bindMall {
  .mallSettingBox {
    display: flex;
    width: calc(100% - 40px);
    min-height: 180px;
    padding: 0 20px;
    padding-bottom: 0;
    font-size: 14px;
    color: $color-53;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    border-radius: 4px;
    align-items: center;
    &.hasVersionBox {
      padding-bottom: 24px;
    }
    .mallImg {
      width: 140px;
      height: 140px;
      background: url('~@/assets/image/comm/mallIcon.png') no-repeat;
      background-size: cover;
    }
    .rightPart {
      margin-left: 20px;
      &.free {
        margin-top: 20px;
      }
      &.vip {
        margin-top: 20px;
      }
    }
    .mymall {
      display: flex;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      color: #000000;
      align-items: center;
    }
    .isOpenH5Mall {
      margin-top: 16px;
      margin-bottom: 16px;
    }
  }
  .introduction {
    width: 100%;
    padding-bottom: 150%;
    background: url('~@/assets/image/comm/introduction.png') top center no-repeat;
    background-size: cover;
  }
  .pro_listBox {
    .addBindBtn {
      font-size: 14px;
      font-weight: 400;
      color: #247af3;
      text-decoration: none;
    }
    .help {
      margin-top: 14px;
      font-size: 14px;
      color: $color-53;
      li {
        line-height: 30px;
      }
    }
  }
  .helpLink {
    color: #247af3;
  }
  .bindDialog {
    .bindBox {
      .bindInfo {
        margin: 10px 0 20px;
        font-size: 14px;
        color: $color-53;
        text-align: center;
        span {
          margin-left: 10px;
          color: #247af3;
        }
      }
    }
    .buttonBox {
      padding: 15px 0 16px;
      text-align: center;
    }
  }
  .cooperation {
    &.mainSite {
      margin-bottom: 24px;
    }
  }
}
.bindMall .mallSettingBox .isOpenH5Mall .title,
.bindMall .mallSettingBox .isOpenAppMall .title {
  margin-right: 16px;
}
.directSale {
  .bindMall {
    .introduction {
      background: url('~@/assets/image/comm/direct/introduction.jpg') top center no-repeat;
      background-size: cover;
    }
    .pro_listBox {
      .addBindBtn {
        color: #247af3;
      }
    }
    .helpLink {
      color: #247af3;
    }
    .bindDialog {
      .bindBox {
        .bindInfo {
          span {
            color: #247af3;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.bindMall {
  .mallSettingBox {
    .tanshuTip {
      &.versionTip {
        margin-bottom: 0;
      }
    }
    .versionBox {
      display: flex;
      width: 260px;
      height: 52px;
      padding: 0 15px;
      color: #f5ad82;
      background: url('~@/assets/image/comm/vip_bg.png') no-repeat;
      background-size: cover;
      align-items: center;
      justify-content: space-between;
      .versionWrap {
        width: 200px;
        overflow: hidden;
      }
      .version-name {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 14px;
      }
      .version-time {
        overflow: hidden;
        font-size: 12px;
        line-height: 12px;
        text-overflow: ellipsis;
        word-wrap: normal;
        white-space: nowrap;
      }
      .button {
        width: 76px;
        height: 30px;
        line-height: 30px;
        color: #562b0c;
        text-align: center;
        cursor: pointer;
        background: linear-gradient(90deg, #ff793d 0%, #ffc595 100%);
        border-radius: 4px;
      }
      &.free_bg {
        color: #ffffff;
        background: url('~@/assets/image/comm/free_bg.png') no-repeat;
        background-size: cover;
        .button {
          color: #ffffff;
        }
      }
      &.noTry {
        .button {
          width: 170px;
        }
        .version-name {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>

<!--
 * @Description  : 接入官网
 * @Author       : turbo
 * @Date         : 2021-03-18 15:08:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-08 15:13:06
-->

<template>
  <div class="cardWebsite">
    <global-ts-header>
      <template v-slot:leftPart>接入官网<global-ts-version :limitVer="showVer"></global-ts-version> </template>
    </global-ts-header>
    <div class="cardInGrey">
      <div class="cardSettingBox">
        <div class="cardImg"></div>
        <div class="rightPart">
          <div class="mycard">
            <p>名片官网</p>
          </div>
          <p class="cardexplain">名片接入官网，进行品牌曝光</p>
          <div class="isOpenweb">
            <span v-for="(item, index) in openSettingList" :key="index">
              <input
                v-model="accessInfo.isOpenWebsite"
                type="radio"
                :disabled="!isHaveVersion"
                @change="opencard"
                :id="'cardweb' + index"
                :value="item.key"
              />
              <label :for="'cardweb' + index">{{ item.value }}</label>
            </span>
          </div>
          <global-ts-version-warning v-if="!isOem"></global-ts-version-warning>
        </div>
      </div>
      <div class="contentBox">
        <div class="introductBox" v-if="!accessInfo.isOpenWebsite">
          <div class="introductText">
            <div class="title">功能介绍</div>
            <p class="explain">在名片底部曝光企业官网，持续传播品牌价值</p>
          </div>
          <div class="introductImg"></div>
        </div>
        <div class="infoBox" v-else>
          <div class="infoItem">
            <div class="content-header">
              设置导航名称
            </div>
            <fa-input
              class="content-item"
              v-model="accessInfo.websiteMenuName"
              placeholder="请输入导航名称"
              :maxLength="4"
              size="large"
              :showCount="true"
            >
            </fa-input>
          </div>
          <div class="infoItem">
            <div class="content-header">
              选择接入方式
            </div>
            <div class="isAbleSetting">
              <span v-for="(item, index) in typeList" :key="index">
                <input
                  v-model="accessInfo.websiteUseOutside"
                  type="radio"
                  :id="'type' + index"
                  :value="item.key"
                  @change="changeType(item.key)"
                />
                <label :for="'type' + index">{{ item.value }}</label>
              </span>
            </div>
            <svg class="icon helpIcon_1" aria-hidden="true" @click="jumpUrl">
              <use xlink:href="#icon-wenhao"></use>
            </svg>
          </div>
          <div
            class="infoItem"
            :class="accessInfo.isOpenFaiApp ? 'siteInfoItem' : 'openInfoItem'"
            v-if="accessInfo.websiteUseOutside === 0"
          >
            <div class="content-header">
              选择小程序站点
            </div>
            <a :href="accessInfo.urlParam.openUrl" target="_blank" v-if="!accessInfo.isOpenFaiApp">去开通</a>
            <global-ts-select
              v-else
              type="large"
              class="content-item"
              v-model="accessInfo.websiteFaiAppId"
              placeholder="请选择"
              :selectkey="{ label: 'name', value: 'id' }"
              @onSelect="fdpLog(1)"
              :list="accessInfo.faiAppList"
            >
            </global-ts-select>
            <global-ts-tool-tips offset="10" effect="dark" content="仅展示已授权且已发布的小程序" placement="top-start">
              <svg class="icon helpIcon_2" aria-hidden="true">
                <use xlink:href="#icon-wenhao"></use>
              </svg>
            </global-ts-tool-tips>
          </div>
          <div class="infoItem" v-if="accessInfo.websiteUseOutside === 1">
            <div class="content-header">
              小程序APPID
            </div>
            <fa-input
              class="content-item"
              v-model="accessInfo.websiteAppid"
              placeholder="请输入小程序APPID"
              @input="fdpLog(3)"
              size="large"
            >
            </fa-input>
          </div>
          <div class="infoItem urlInfo" v-if="accessInfo.websiteUseOutside === 1">
            <div class="content-header">
              小程序跳转路径
            </div>
            <fa-input
              class="content-item"
              v-model="accessInfo.websiteAppPath"
              placeholder="请输入小程序跳转路径"
              @input="fdpLog(4)"
              size="large"
            >
            </fa-input>
          </div>
          <global-ts-button class="saveBtn" slot="button" type="primary" size="medium" @click="save">
            保存
          </global-ts-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { getWebsite, changeWebsiteOpenStatus, setWebsite } from '@/api/modules/views/customer-tools/card-website';

export default {
  name: 'CardWebsite',
  data() {
    return {
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
      unoemtypeList: [
        {
          key: 0,
          value: '接入凡科轻站',
        },
        {
          key: 1,
          value: '接入外部小程序',
        },
      ],
      oemTypeList: [
        {
          key: 0,
          value: '接入轻应用小程序',
        },
        {
          key: 1,
          value: '接入外部小程序',
        },
      ],
      isShowVersionTip: true,
      accessInfo: {
        isOpenWebsite: false, //是否开通官网功能
        websiteMenuName: '', //导航名称
        websiteAppid: '', //外部小程序 appid
        websiteAppPath: '', //外部小程序 跳转路径
        isOpenFaiApp: false, //凡科轻站是否开通
        websiteUseOutside: false, //是否使用外部小程序。0：使用凡科轻站； 1：使用外部小程序
        websiteFaiAppId: 0, //凡科轻站站点ID
        urlParam: {
          openUrl: '', //轻站开通地址
          authUrl: '', //轻站授权小程序地址
        },
        faiAppList: [], //faiAppList
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
      addressUrl: state => state.globalData.addressUrl,
      isOem: state => state.user.info.isOem,
    }),
    isHaveVersion() {
      return versionDef.getFunctionLimit('crmUserFields').condition;
    },
    typeList() {
      return this.isOem ? this.oemTypeList : this.unoemtypeList;
    },
    httpUrl() {
      return this.addressUrl.cardWebsiteHelpUrl;
    },
    showVer() {
      return this.isOem
        ? versionDef.NotDirectVersionDef.VersionList.STANDARD
        : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL;
    },
  },
  created() {
    //页面曝光量
    this.$utils.FdpLog('yx_jrgw', {
      yx_free_text_0: '页面曝光',
    });
    this.getInitInfo();
  },
  methods: {
    async getInitInfo() {
      const [err, res] = await getWebsite();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.accessInfo = Object.assign(this.accessInfo, res.data);
    },
    jumpUrl() {
      window.open(this.httpUrl, '_blank');
    },
    fdpLog(type) {
      let text = '';
      switch (type) {
        case 1:
          text = '点击接入外部小程序';
          break;
        case 2:
          text = '点击选择小程序站点';
          break;
        case 3:
          text = '输入APPID';
          break;
        case 4:
          text = '输入跳转路径';
      }
      this.$utils.FdpLog('yx_jrgw', {
        yx_free_text_1: text,
      });
    },
    changeType(key) {
      this.fdpLog(1);
      this.accessInfo.websiteUseOutside = key;
    },
    async opencard() {
      const [err, res] = await changeWebsiteOpenStatus({
        isOpenWebsite: this.accessInfo.isOpenWebsite,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      } else {
        if (this.accessInfo.isOpenWebsite) {
          this.$utils.postMessage({
            type: 'success',
            message: '开通成功',
          });
          this.$utils.FdpLog('yx_jrgw', {
            yx_free_text_0: '开启功能',
          });
        } else {
          this.$utils.postMessage({
            type: 'success',
            message: '关闭成功',
          });
          this.$utils.FdpLog('yx_jrgw', {
            yx_free_text_0: '关闭功能',
          });
        }
      }
      this.getInitInfo();
    },
    async save() {
      let checkList = [];
      if (this.accessInfo.websiteUseOutside === 1) {
        checkList = [
          { key: 'websiteMenuName', label: '导航名称' },
          { key: 'appId', label: '小程序APPID' },
          { key: 'url', label: '小程序跳转路径' },
        ];
      } else {
        checkList = [{ key: 'websiteMenuName', label: '导航名称' }];
      }
      for (const item of checkList) {
        if (this.accessInfo[item.key] === '') {
          this.$utils.postMessage({
            type: 'error',
            message: `保存失败，请输入${item.label}`,
          });
          return;
        }
      }
      const [err, res] = await setWebsite(this.accessInfo);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: '保存成功',
      });
      const text = this.accessInfo.websiteUseOutside == 0 ? '成功接入轻站' : '成功接入外部小程序';
      this.$utils.FdpLog('yx_jrgw', {
        yx_free_text_2: text,
      });
      this.getInitInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.cardWebsite {
  height: 100%;
  .cardSettingBox {
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
      padding-bottom: 40px;
    }
    .cardImg {
      width: 140px;
      height: 140px;
      background: url('~@/assets/image/cardWebsite/logo.png') no-repeat;
      background-size: cover;
    }
    .rightPart {
      margin-top: 24px;
      margin-left: 20px;
      &.free {
        margin-top: 20px;
      }
      &.vip {
        margin-top: 20px;
      }
    }
    .mycard {
      display: flex;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      color: #000000;
      align-items: center;
    }
    .isOpenweb {
      margin-top: 16px;
      margin-bottom: 16px;
      .title {
        margin-right: 16px;
      }
    }
  }
  .contentBox {
    height: 585px;
    background: #ffffff;
  }
  .introductBox {
    position: relative;
    display: flex;
    width: 100%;
    height: calc(100% - 201px);
    min-height: 585px;
    padding-right: 149px;
    padding-left: 128px;
    background: url('~@/assets/image/introductionPage/bg.png') center bottom no-repeat;
    background-color: #f4f7fb;
    box-sizing: border-box;
    .introductText {
      margin-top: 206px;
    }
    .title {
      position: relative;
      font-size: 24px;
      font-weight: bold;
      color: $color-00;
      &::before {
        position: absolute;
        bottom: -16px;
        left: 0;
        width: 48px;
        height: 4px;
        background: #247af3;
        border-radius: 2px;
        content: '';
      }
    }
    .explain {
      margin-top: 28px;
      font-size: 16px;
      color: $color-53;
    }
    .introductImg {
      position: absolute;
      top: 40px;
      right: 109px;
      bottom: 0;
      width: 610px;
      height: 591px;
      margin: auto;
      background: url('~@/assets/image/cardWebsite/dir_introduct.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .infoBox {
    width: 600px;
    margin: 0 auto;
    font-size: 14px;
    color: $color-53;
  }
  .infoItem {
    position: relative;
    display: flex;
    padding-top: 33px;
    line-height: 14px;
    align-items: center;
    .content-header {
      width: 126px;
      margin-right: 20px;
      text-align: right;
    }
    .content-item {
      width: 400px;
    }
    &.openInfoItem {
      padding-top: 46px;
    }
  }
  .urlInfo {
    padding-top: 20px;
  }
  .helpIcon_1 {
    position: absolute;
    right: 140px;
    margin: 0;
    color: $color-b2;
    cursor: pointer;
  }
  .helpIcon_2 {
    margin: 0;
    margin-left: 8px;
    color: $color-b2;
    cursor: pointer;
  }
  .saveBtn {
    width: 80px;
    min-width: 80px;
    margin-top: 30px;
    margin-left: 146px;
  }
}
.directSale {
  .cardWebsite {
    .helpIcon_1 {
      right: 166px;
    }
  }
}
.cardWebsite .helpIcon_1:hover,
.cardWebsite .helpIcon_2:hover {
  color: #247af3;
}

@media (max-width: 1600px) {
  .cardWebsite .introductBox {
    padding-left: 40px !important;
  }
}
@media (min-width: 1760px) {
  .cardWebsite .introductBox .introductText {
    margin-left: 200px !important;
  }
}
@media (max-width: 1480px) {
  .cardWebsite .introductBox .introductImg {
    left: 448px !important;
  }
}
</style>

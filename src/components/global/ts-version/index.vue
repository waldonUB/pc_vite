<!--
 * @Author       : ADI
 * @Date         : 2021-04-28 15:12:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:49:04
-->
<template>
  <global-ts-tool-tips
    popper-class="tanshu_verisonTips"
    placement="top"
    :disabled="(isHaveVersion || hideHoverText) && isShowTip"
  >
    <slot v-if="hasButton" name="button"></slot>
    <global-ts-icon-ver v-else :showver="getLimitVer"></global-ts-icon-ver>
    <div slot="content">
      该功能为 功能，升级后才能使用&nbsp;&nbsp;&nbsp;
      <global-ts-versionicon :limitVer="getLimitVer"> </global-ts-versionicon>
      <a :href="jumpUrl" target="_blank">立即升级</a>
    </div>
  </global-ts-tool-tips>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';

export default {
  name: 'ts-version',
  props: {
    limitVer: {
      type: Number,
    },
    hideHoverText: {
      default: false,
      type: Boolean,
    },
    isShowTip: {
      // 是否显示升级提示，会存在判断7天试用和个人版的情况
      default: true, // enson: true的话不可用 false可用
      type: Boolean,
    },
    hasButton: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      globalData: state => state.globalData,
    }),
    getLimitVer() {
      if (this.limitVer === undefined) {
        if (this.isOem) {
          return versionDef.NotDirectVersionDef.VersionList.STANDARD;
        }
        return versionDef.DirectVersionDef.VersionList.BASE;
      } else {
        return this.limitVer;
      }
    },
    isHaveVersion() {
      return versionDef.checkVersion(this.getLimitVer);
    },
    jumpUrl() {
      return this.globalData.addressUrl.updateVersionUrl;
    },
    topVersion() {
      return versionDef.getVersionName(this.getLimitVer);
    },
  },
};
</script>

<style lang="scss" scoped>
.tanshu_verisonTips {
  font-size: 14px;
  a {
    color: $primary-color;
    text-decoration: underline;
  }
}
.directSale {
  .tanshu_verisonTips {
    a {
      color: $primary-color;
    }
  }
}
</style>

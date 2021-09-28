<!--
 * @Description  : 版本图标 icon
 * @Author       : turbo
 * @Date         : 2021-03-29 17:58:11
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-04 16:31:33
-->
<template>
  <span class="ts-iconVer">
    <global-ts-svg-icon class="verIcon" :name="iconVerClass" />
  </span>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import store from '@/store';

export default {
  name: 'ts-icon-ver',
  props: {
    showver: {
      type: Number,
    },
  },
  store,
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    getShowver() {
      if (this.showver === undefined) {
        return this.isOem
          ? versionDef.NotDirectVersionDef.VersionList.STANDARD
          : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL;
      } else {
        return this.showver;
      }
    },
    iconVerClass() {
      return `${this.isOem ? 'ts_notDirect_' : 'ts_direct_'}${this.getShowver}`;
    },
  },
};
</script>

<style lang="scss" scoped>
/* 版本标志组件 start */
.ts-iconVer {
  display: inline-block;
  width: 18px !important;
  height: 17px !important;

  /* width: 34px !important;
    height: 26px !important; */
  padding: 0 !important;
  margin-left: 8px;

  /* background: url('~@/assets/image/comm/versionNew.png') 254px 384px no-repeat; */
  .verIcon {
    width: 18px !important;
    height: 17px !important;
    vertical-align: top;
  }
  &.ts_direct_103 {
    background-position: -127px -178px;
  }
  &.ts_direct_101 {
    background-position: -127px -204px;
  }
  &.ts_notDirect_6 {
    background-position: 0 -280px;
  }
  &.ts_notDirect_1 {
    background-position: 0 -306px;
  }
}

/* 版本标志组件 end */
</style>

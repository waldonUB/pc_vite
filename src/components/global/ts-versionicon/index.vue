<!--
 * @Description  : 版本图标 icon 和版本名称
 * @Author       : turbo
 * @Date         : 2021-03-29 17:58:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:34:07
-->
<template>
  <div class="ts-versionIcon">
    <global-ts-icon-ver :showver="getLimitVer"> </global-ts-icon-ver>
    <span class="ts-versionName">{{ topVersion }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';

export default {
  name: 'ts-versionicon',
  props: {
    limitVer: {
      type: Number,
    },
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
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
    topVersion() {
      return versionDef.getVersionName(this.getLimitVer);
    },
  },
};
</script>

<style lang="scss" scoped>
/* ts-versionicon 组件样式 start */
.ts-versionIcon {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  .ts-iconVer {
    margin: 0 4px;
    vertical-align: top;
  }
  .ts-versionName {
    color: $primary-color;
  }
}
.ts-versionIcon .funcText,
.ts-versionIcon .update-btn {
  padding: 0;
}

/* ts-versionIcon 组件样式 end */
</style>

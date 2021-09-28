<template>
  <div class="ts-versionFuncTip" :class="{ afterTable }">
    <div v-if="showUpdateTip">
      <span class="funcText">{{ funcText }}，请升级到</span>
      <global-ts-versionicon :limitVer="specVer"></global-ts-versionicon>。
      <a :href="updateVersionUrl" target="_blank" class="tanhu-underline update-btn">
        立即升级
      </a>
    </div>

    <div v-else>
      {{ noUpperText || funcText }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';

export default {
  name: 'ts-versionfunctip',
  props: {
    limitVer: Number, // 版本级别
    funcText: {
      // 版本提示前缀
      type: String,
      default: '当前版本不支持该功能',
    },
    noUpperText: {
      // 没有更高版本时出的提示
      type: String,
      default: '',
    },
    isUpperVer: {
      // 是否为更高级版本，如果此选项为true，则limitVer属性失效
      type: Boolean,
      default: false,
    },
    afterTable: {
      // 是否跟在表格的下面
      type: Boolean,
      defalut: false,
    },
  },
  computed: {
    ...mapState({
      globalData: state => state.globalData,
    }),
    updateVersionUrl() {
      return this.globalData.addressUrl.updateVersionUrl;
    },
  },
  data() {
    return {
      specVer: null,
      showUpdateTip: true,
    };
  },
  created() {
    if (this.isUpperVer) {
      const specVer = versionDef.getUpperVersion();
      if (specVer != undefined) {
        this.specVer = specVer;
      } else {
        this.showUpdateTip = false;
      }
    } else {
      this.specVer = this.limitVer;
    }
  },
};
</script>

<style lang="scss" scoped>
.ts-versionFuncTip {
  width: 100%;
  font-size: 14px;
  text-align: center;

  &.afterTable {
    padding: 12px 0;
    color: #909399;
    border: 1px solid #ebeef5;
    border-top: none;
    box-sizing: border-box;
  }
}
</style>

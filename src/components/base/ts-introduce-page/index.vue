<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 10:16:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:15:36
-->
<template>
  <div class="tanshu-introducePage">
    <ts-two-columns-three-item-by-flex v-if="showHead">
      <template v-slot:left>
        <img class="cardBox-left__icon" :src="icon" />
      </template>
      <template>
        <div class="cardBox-middle__box">
          <h5 class="middle__box_title">
            {{ title }}
          </h5>
          <p class="middle__box_des">{{ explain }}</p>
          <global-ts-version-warning class="versionTip" v-if="showVersionTip && !isOem"></global-ts-version-warning>
        </div>
      </template>
      <template v-slot:right>
        <global-ts-tool-tips
          v-if="!hasFinishWxWork"
          class="item"
          effect="dark"
          :content="toolTips"
          placement="top"
          :disabled="noToolTip"
        >
          <global-ts-button class="useBtn" type="primary" size="small" @click="gotoSet">{{
            buttonTxt
          }}</global-ts-button>
        </global-ts-tool-tips>
        <global-ts-version v-else :hasButton="true" :limitVer="showVerCal">
          <global-ts-button
            slot="button"
            class="useBtn"
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="gotoSet"
          >
            {{ buttonTxt }}
          </global-ts-button>
        </global-ts-version>
      </template>
    </ts-two-columns-three-item-by-flex>
    <div class="introductBgBox" v-if="introductBg">
      <img class="introductBg" :src="introductBg" />
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import TsTwoColumnsThreeItemByFlex from '@/components/base/ts-two-columns-three-item-by-flex/index.vue';

export default {
  name: 'ts-introduce-page',
  components: { TsTwoColumnsThreeItemByFlex },
  props: {
    title: {
      type: String,
      default: '',
    },
    explain: {
      type: String,
      default: '',
    },
    buttonTxt: {
      type: String,
      default: '接入企微',
    },
    toolTips: {
      type: String,
      default: '接入企微后即可使用',
    },
    icon: {
      type: String,
      default: '',
    },
    introductBg: {
      type: String,
      default: '',
    },
    noToolTip: {
      type: Boolean,
      default: false,
    },
    showVersionTip: {
      // 是否显示提示
      type: Boolean,
      default: false,
    },
    showVer: {
      // 直销：专业版； 分销：高级版/尊享版/专用版
      type: Number,
      default: undefined,
    },
    hasFinishWxWork: {
      // 是否已完成了企微配置
      type: Boolean,
      default: false,
    },
    isDisabled: {
      // 是否禁用版本按钮
      type: Boolean,
      default: false,
    },
    showHead: {
      // 是否显示头部信息
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    /**
     * @description : showVerCal
     * @author      : ADI
     * @Date        : 2021-06-17 10:22:28
     * @param        {*}
     * @return       {Number}
     */
    showVerCal() {
      if (typeof showVer === 'number') {
        return this.showVer;
      } else {
        // set default
        return this.isOem
          ? versionDef.NotDirectVersionDef.VersionList.MID
          : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL; // 直销：专业版； 分销：高级版/尊享版/专用版,
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    gotoSet() {
      this.$emit('gotoSet');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 介绍页样式 */
.tanshu-introducePage {
  border-radius: 4px;
  ::v-deep .twoColumnsThreeItemByFlex {
    margin-bottom: 0;
    border-radius: 0;
  }
  .introductBgBox {
    display: flex;
    justify-content: center;
    overflow-x: hidden;
  }
  .introductBg {
    object-fit: cover;
  }
  .cardBox-middle__box {
    .versionTip {
      margin-top: 16px;
      margin-bottom: 0;
    }
  }
}

/* END-介绍页样式 */
</style>

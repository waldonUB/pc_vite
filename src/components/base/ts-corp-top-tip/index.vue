<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 11:41:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 13:48:52
-->
<template>
  <div class="ts-corp-top-tip">
    <ts-corp-install-model
      :fromPage="fromPage"
      :corpInstallDialogVisible.sync="corpInstallDialogVisible"
    ></ts-corp-install-model>
    <div v-if="finishLoad && !wxWorkCorpData.appleAgentId" :class="['bg-img-box', { hide: !isShowTip }]">
      <div class="cancel-btn-box" @click="closeTip">
        <global-ts-svg-icon class="icon cancel-btn" name="icon-guanbi1616" color="#fff" />
      </div>
      <div class="text-img-box">
        <img class="text-img-content" :src="textImgCal" alt="" />
        <div :class="['main-faker-btn', { isApp: wxWorkCorpData.corpSetSuccessRel }]" @click="setApp"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// components
import tsCorpInstallModel from '@/components/base/ts-corp-install-model/index.vue';

// utils
import { gotoWxCorpSet, getWxWorkCorp } from '@/utils';

// assets
import wxCorpTopTipImg from '@/assets/image/comm/wxWork/wxCorpTopTip.png';
import wxCorpTopTipMiniAppImg from '@/assets/image/comm/wxWork/wxCorpTopTip_miniApp.png';

export default {
  name: 'ts-corp-top-tip',
  components: { tsCorpInstallModel },
  props: {
    fromPage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowTip: true,
      wxWorkCorpData: {
        finishStep: 0, // 完成步骤
        appleAgentId: '', // 小程序id
      },
      corpInstallDialogVisible: false, // 安装窗口
      finishLoad: false, // 完成加载
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    textImgCal() {
      return this.wxWorkCorpData.corpSetSuccessRel ? wxCorpTopTipMiniAppImg : wxCorpTopTipImg;
    },
  },
  methods: {
    /**
     * 关闭
     * @author waldon
     * @date 2021/1/20
     */
    closeTip() {
      this.isShowTip = false;
    },
    /**
     * 获取企微授权信息
     * @author waldon
     * @date 2021/1/21
     */
    async getWxWorkCorp() {
      this.wxWorkCorpData = await getWxWorkCorp();
      this.finishLoad = true;
      const { finishStep, corpSetSuccessRel, appleAgentId } = this.wxWorkCorpData;
      this.isShowTip = finishStep || !corpSetSuccessRel || !appleAgentId;
    },
    /**
     * 接入企微
     * @author waldon
     * @date 2021/1/23
     */
    setApp() {
      const { corpFinishCorp } = this.wxWorkCorpData;
      if (corpFinishCorp || this.isOem) {
        const path = gotoWxCorpSet(false);
        if (path) {
          this.$router.push({
            name: path,
            params: {
              fromType: 'topTip',
            },
          });
        }
      } else {
        this.corpInstallDialogVisible = true;
      }
    },
  },
  created() {
    this.getWxWorkCorp();
  },
};
</script>

<style lang="scss" scoped>
/* 企微顶部接入提示 start */
.ts-corp-top-tip {
  .bg-img-box {
    position: relative;
    display: flex;
    width: 100%;
    height: 72px;
    min-width: 1000px;
    margin-bottom: 20px;
    overflow: hidden;
    background-image: url('~@/assets/image/comm/wxWork/wxCorpTopTipBg.png');
    background-position: center;
    background-size: cover;
    border-radius: 4px;
    transition: all 0.5s;
    align-items: center;
    justify-content: center;
    &.hide {
      height: 0;
      margin-bottom: 0;
      transition: all 0.5s;
    }
    .cancel-btn-box {
      position: absolute;
      top: 11px;
      right: 11px;
      z-index: 1;
      cursor: pointer;
    }
    .cancel-btn {
      width: 16px;
      height: 16px;
      color: #ffffff;
    }
    .text-img-box {
      position: relative;
      width: 1000px;
      height: 100%;
      .text-img-content {
        width: 100%;
        height: 100%;
      }
      .main-faker-btn {
        position: absolute;
        top: 0;
        right: 34px;
        z-index: 1;
        width: 120px;
        height: 100%;
        cursor: pointer;
        &.isApp {
          right: 104px;
        }
      }
    }
  }
}

/* 企微顶部接入提示 end */
</style>

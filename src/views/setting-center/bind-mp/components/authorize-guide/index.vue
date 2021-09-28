<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:36:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 16:59:03
-->
<template>
  <global-ts-card-box>
    <template v-slot:card-box-head>
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="topTitle">
            <global-ts-tool-tips
              offset="10"
              class="item"
              effect="dark"
              content="拥有带企业品牌LOGO和名称的小程序，打造属于您自己的品牌"
              placement="top-start"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-bianzu"></use>
              </svg>
            </global-ts-tool-tips>
            微信授权
          </div>
        </template>
      </global-ts-header>
    </template>
    <template v-slot:card-box-body>
      <global-ts-warn-tips v-if="!isAuthToClick">
        <p class="warnTipsContent" slot="content">
          由于微信将在春节期间暂停小程序代码审核，本平台将于2020年1月19日起停止审核提交，并于2月1日早上10:00恢复，如有带来不便，望见谅。
        </p>
      </global-ts-warn-tips>
      <div class="authorizeGuide">
        <p class="boldContent">简单四步，拥有属于您的品牌LOGO和名称的小程序</p>
        <el-steps :active="active" finish-status="wait" process-status="finish" :align-center="true">
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-gongzhonghaoshouquan"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-test"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">公众号授权</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-dangqian2"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-test1"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">小程序授权</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-dangqian"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-test2"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">绑定开放平台</span>
          </el-step>
          <el-step>
            <div class="iconWrap" slot="icon">
              <svg class="icon topIcons" aria-hidden="true">
                <use xlink:href="#icon-peizhiyuming"></use>
              </svg>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-test3"></use>
              </svg>
            </div>
            <span class="titleSet" slot="title">配置域名</span>
          </el-step>
        </el-steps>
        <div class="authorizeDetailInfo">
          <p>授权之前，请确认：</p>
          <p>1.您有一个微信认证的服务号。</p>
          <p>2.您有一个尚未授权的企业主体小程序。</p>
          <p>3.授权时必须勾选所有权限，避免影响使用</p>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-button @click="goAuthorize">立即授权 </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import { Steps, Step } from 'element-ui';

export default {
  name: 'authorize-guide',
  components: {
    [Steps.name]: Steps,
    [Step.name]: Step,
  },
  props: {
    isAuthToClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      active: 1,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goAuthorize() {
      this.$parent.changePage(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.authorizeGuide {
  width: 650px;
  padding-top: 50px;
  margin: 0 auto;
  .boldContent {
    margin-bottom: 61px;
    text-align: center;
  }
  .authorizeDetailInfo {
    padding: 20px 0 20px 140px;
    margin-top: 40px;
    font-size: 14px;
    color: $color-53;
    background: #f7f7f7;
    p {
      height: 19px;
      margin-top: 8px;
      line-height: 19px;
      &:nth-child(1) {
        margin-top: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.authorizeGuide {
  svg {
    color: #247af3 !important;
  }
  .el-steps {
    .el-step {
      &:nth-child(1) {
        .el-step__line {
          background-image: linear-gradient(to right, #eeeeee, #247af3);
        }
      }
    }
    .el-step__main {
      .titleSet {
        color: #247af3;
      }
    }
  }
}
</style>

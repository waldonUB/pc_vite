<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 15:00:15
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 16:54:02
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
      <div class="guideToUpgrade">
        <global-ts-versionfunctip funcText="当前版本暂不支持该功能" :limitVer="limitVer"></global-ts-versionfunctip>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-button type="others" :disabled="true">立即授权 </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import versionDef from '@/config/version-def';

export default {
  name: 'no-auth',
  components: {},
  props: {
    isAuthToClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    limitVer() {
      return versionDef.getLimitVer('MID', 'PROFESSIONNAL');
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.guideToUpgrade {
  padding-top: 220px;
  p {
    color: $color-53;
    text-align: center;
  }
}
</style>

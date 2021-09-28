<!--
 * @Author       : ADI
 * @Date         : 2021-05-13 14:31:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-13 15:46:44
-->
<template>
  <div class="sameLogoSet" :class="!isOem ? 'LogoNotOem' : 'oemLogo'" v-cloak>
    <ts-logoparam :is-oem="isOem" :jump-address="addressUrl.tsHomeHost" :img-src="logoSrc"> </ts-logoparam>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tsLogoparam from '@/components/base/ts-logoparam/index.vue';

export default {
  name: 'logo',
  components: { tsLogoparam },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      addressUrl: state => state.globalData.addressUrl,
      logoSrc: state => state.globalData.logoSrc,
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.sameLogoSet {
  &.LogoNotOem {
    min-width: 308px;
  }
  &.oemLogo {
    .logoParant {
      .logoImg {
        height: 38px;
        max-width: 100%;
        margin: 11px 0;
      }
    }
  }
  .logoParant {
    position: relative;
    display: inline-block;
    width: 190px;
    width: 183px;
    height: 60px;
    .logoImg {
      position: absolute;
      top: 0;
      right: auto;
      bottom: 0;
      left: 16px;
      display: block;
      width: auto;
      height: 35px;
      max-height: 100%;
      margin: auto;
    }
    .imgClick {
      display: block;
      height: 60px;
    }
  }
  .guideToHost {
    display: inline-block;
    width: 104px;
    height: 26px;
    font-size: 12px;
    font-weight: 400;
    line-height: 26px;
    color: #333333;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    background: #f3f3f3;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    &:hover {
      border-color: #999999;
    }
  }
}
</style>

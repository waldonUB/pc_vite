<!--
 * @Description  : 头部
 * @Author       : turbo
 * @Date         : 2021-02-19 18:09:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-31 11:12:14
-->

<template>
  <div class="header-wrap">
    <logo class="left" />
    <div class="middle"><gfw /></div>
    <div class="right">
      <components :is="helpComponentName" />
      <user-center />
      <ver-set />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Gfw from './components/gfw.vue';
import HelpDirect from './components/help-direct.vue';
import HelpOem from './components/help-oem.vue';
import Logo from './components/logo.vue';
import UserCenter from './components/user-center.vue';
import VerSet from './components/ver-set.vue';

export default {
  name: 'ts-header',
  components: {
    Gfw,
    HelpDirect,
    HelpOem,
    Logo,
    UserCenter,
    VerSet,
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    helpComponentName() {
      return this.isOem ? 'help-oem' : 'help-direct';
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  position: relative;

  /* 需要覆盖 sidebar(z-index:$zindex-float) */
  z-index: $zindex-float + 1;
  display: flex;
  width: 100%;
  height: 60px;
  min-width: 1040px;
  background: $color-ff;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  .left {
  }
  .middle {
    flex: 1;
    text-align: center;
  }
  .right {
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: 1360px) {
    .right {
      padding-right: 54px;
      box-sizing: border-box;
    }
  }

  @media screen and (min-width: 3500px) {
    .right {
      width: 1000px;
    }
  }
}
</style>

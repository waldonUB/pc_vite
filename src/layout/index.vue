<!--
 * @Description  : 整体布局
 * @Author       : turbo
 * @Date         : 2021-02-19 18:09:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 15:19:19
-->

<template>
  <div class="layout-wrap">
    <ts-header />
    <div class="layout-content">
      <ts-sidebar @reload="reload" />
      <div class="layout-inner">
        <main class="layout-inner__view">
          <keep-alive :include="keepLiveList" v-if="isRouterAlive">
            <router-view />
          </keep-alive>
        </main>
      </div>
    </div>
    <ts-test-util v-if="isTest" />
  </div>
</template>

<script>
// components
import TsHeader from './header/index.vue';
import TsSidebar from './sidebar.vue';
import TsTestUtil from '@/components/base/ts-test-util/index.vue';
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: {
    TsHeader,
    TsSidebar,
    TsTestUtil,
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  computed: {
    ...mapState({
      isTest: state => state.user?.info?.isTest,
      needReload: state => state.router.needReload,
      keepLiveList: state => state.keepalive.keepLiveList,
    }),
  },
  watch: {
    needReload(value) {
      if (value) {
        this.$store.commit('router/setNeedReload', false);
        this.reload();
      }
    },
  },
  methods: {
    reload() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isRouterAlive = false;
        try {
          this.$nextTick(() => (this.isRouterAlive = true));
        } catch (e) {
          console.log('error', e);
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-content {
  display: flex;
  height: calc(100vh - 60px);
}

.layout-inner {
  flex: 1;
  overflow: auto; // hack: 修复 sub menu flex1 计算错误
  .layout-inner__view {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 1094px;
    padding: 20px;
    overflow-x: auto;
    overflow-y: scroll;
    box-sizing: border-box;
  }
}
</style>

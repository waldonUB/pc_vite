<!--
 * @Author       : ADI
 * @Date         : 2021-05-13 14:42:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-13 15:57:56
-->
<template>
  <div class="helpBox" @click="toURL('portalHelpUrl', 'help_click')" v-if="isOem && isShowHelp">
    <global-ts-svg-icon class="icon helpIcon" name="icon-wenhao" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toURL } from '../utils/index.js';

export default {
  name: 'help-box',
  components: {},
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
    toURL() {
      return toURL;
    },
    isShowHelp() {
      return !!this.addressUrl.portalHelpUrl;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
/* 帮助中心 */
.helpBox {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 40px;
  line-height: 24px;
  color: $color-b2;
  text-align: center;
  .icon {
    cursor: pointer;
  }
  .helpIcon {
    font-size: 24px;
    &:hover {
      color: #247af3;
    }
  }
}
</style>

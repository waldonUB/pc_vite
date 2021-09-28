<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:08:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:36:21
-->
<template>
  <global-ts-tool-tips v-if="[1, 2, 3].includes(gfwStatus)" popperClass="pyqGfwTipsBox">
    <div slot="content">
      {{ gfwStatus == 1 ? '当前正在审查中，审核通过后将重新开启' : gfwStatusReason }}
    </div>
    <div class="gfwBox">
      {{ gfwStatus == 1 ? '审查中' : '已封禁' }}
      <global-ts-svg-icon class="icon helpIcon" v-show="!!helpDoc" @click="toHelpCenter" name="icon-bianzu" />
    </div>
  </global-ts-tool-tips>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ts-img-gfw-tip',
  data() {
    return {
      showToolTip: true,
    };
  },
  computed: {
    ...mapState({
      helpDoc: state => state.globalData?.wxWorkConf?.compMaterialConf?.helpDoc,
    }),
  },
  methods: {
    toHelpCenter() {
      window.open(this.helpDoc, '_blank');
    },
  },
  props: {
    gfwStatus: {
      type: Number,
      default: 0,
    },
    gfwStatusReason: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.pyqGfwTipsBox {
  transform: translateY(0);
}
</style>

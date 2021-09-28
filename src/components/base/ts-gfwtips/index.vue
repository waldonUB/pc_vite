<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:29:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:49:26
-->
<template>
  <div class="tanshu_gfwTips" v-show="isShow">
    <global-ts-warn-tips :isCenter="false">
      <div class="contentBox" slot="content">
        <span class="tipDeclare">{{ tipContent }}</span>
        <a :href="appealHelpUrl" target="_blank" v-show="!!appealHelpUrl">查看详情</a>
        <global-ts-svg-icon class="icon close-icon" name="icon-guanbi1616" @click="closeTip" />
      </div>
    </global-ts-warn-tips>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ts-gfwtips',
  props: {
    isShow: {
      default: true,
      type: Boolean,
    },
    tipContent: {
      default: '请勿添加诱导分享、集赞等违规内容！',
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      appealHelpUrl: state => state.globalData?.addressUrl?.appealHelpUrl,
    }),
  },
  methods: {
    closeTip() {
      this.$emit('update:isShow', false); // 暂存关闭的的状态
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.tanshu_gfwTips {
  .contentBox {
    display: inline-block;
  }
  .warnTips {
    background-color: #fffae8;
    border: 1px solid #ffcf33;
  }
  .tanshu_tips {
    margin-right: 8px;
    font-size: 14px;
    color: #ff9900;
  }
  .tipDeclare {
    font-size: 13px;
    color: $color-53;
  }
  a {
    margin-left: 33px;
    font-size: 14px;
    color: #ff9900;
  }
  .close-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    width: 16px;
    height: 16px;
    margin: 0;
    color: #b2b2b2;
    cursor: pointer;
    transform: translate(0, -50%);
    &.close-icon:hover {
      color: #535353;
    }
  }
}
</style>

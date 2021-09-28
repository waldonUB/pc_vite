<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:41:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:03:48
-->
<template>
  <el-popover :popper-class="styleClass" v-model="isShow" :placement="placement" :width="width" :trigger="trigger">
    <div class="popoverContent">
      <img v-if="isShow || isShowed" class="qrCode" :src="realMpQr" />
      <div v-if="!descTip" class="popoverContent-desc flex-v flex-hc">
        <p>{{ textOne }}</p>
        <p>{{ textTwo }}</p>
      </div>
      <div v-else class="popoverContent-desc">
        <p>{{ descTip }}</p>
      </div>
    </div>
    <div slot="reference">
      <slot></slot>
    </div>
  </el-popover>
</template>

<script>
import { Popover } from 'element-ui';
export default {
  name: 'ts-qr-tip',
  components: {
    [Popover.name]: Popover,
  },
  props: {
    bindClass: {
      type: String,
      default: '',
    },
    trigger: {
      // 触发的方式
      type: String,
      default: 'manual', // 默认手动触发
    },
    placement: {
      // 出现位置
      type: String,
      default: 'left',
    },
    width: {
      type: [Number, String],
      default: '303',
    },
    visible: {
      // 状态是否可见
      type: Boolean,
      default: false,
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    descTip: {
      type: String,
      default: '',
    },
    textOne: {
      type: String,
      default: '扫码进入小程序',
    },
    textTwo: {
      type: String,
      default: '将文章分享出去吧',
    },
    detailId: {
      type: Number,
      default: 0,
    },
    isFromTask: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: this.visible,
      isShowed: false, // 是否展示过了
    };
  },
  computed: {
    styleClass() {
      return 'tanshu-qrTip ' + this.bindClass;
    },
    /**
     * 获取二维码
     * @author enson
     * @date 2020-04-10
     * @returns
     */
    realMpQr() {
      if (this.qrCodeUrl) {
        return this.qrCodeUrl;
      } else if (this.isFromTask) {
        return `${this.$store.getters.tsportalUrl}/shareQr.jsp?v=${this.getTime}&fromTsMarketingTask=true&detailId=${this.detailId}`;
      } else {
        return `${this.$store.getters.tsportalUrl}/shareQr.jsp?v=${this.getTime}&fromArticle=true`;
      }
    },
    getTime() {
      return new Date().getTime();
    },
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        this.isShowed = true;
      }
    },
  },
};
</script>

<style lang="scss">
/* tanshu-qrTip组件样式 start */
.tanshu-qrTip {
  box-sizing: border-box;
  .popoverContent {
    overflow: hidden;
    .qrCode {
      float: left;
      width: 140px;
      height: 140px;
      border: 1px solid #eeeeee;
      box-sizing: border-box;
    }
    .popoverContent-desc {
      height: 140px;
      padding-left: 10px;
      font-size: 14px;
      line-height: 21px;
      color: $color-53;

      /* font-weight: bold; */
      text-align: center;
    }
  }
}

/* tanshu-qrTip组件样式 end */
</style>

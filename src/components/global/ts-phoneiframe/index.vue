<template>
  <div class="ts-phoneIframe phoneBox" :class="boxClass" ref="parentBox">
    <div class="userTitle" v-if="iframeType == 2" :style="backgroundColor">
      <p class="nowTime">
        {{ nowTimeStamp | filterTime }}
        <global-ts-svg-icon class="icon batteryIcon" name="icon-Battery" />
        <global-ts-svg-icon class="icon wifiIcon" name="icon-Wi-Fi" />
      </p>
      <p class="cardTitle">{{ titleText }}</p>
    </div>
    <slot v-else name="header"></slot>
    <div class="iframeWrap" ref="iframeWrap" v-if="showFrame">
      <iframe
        id="previewPage"
        :style="fixScrollWidth"
        :ref="refName"
        :src="src"
        :frameborder="frameborder"
        :scrolling="scrolling"
        @load="loaded"
      >
      </iframe>
    </div>
    <slot v-else name="content"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import { format } from '@/utils';

export default {
  name: 'ts-phoneiframe',
  props: {
    // 主要是用于更换手机视图，目前用俩种不同的手机背景图， 默认是表单的背景图， 传article的话，就是文章的背景图
    bindClass: String,
    refName: String, // ref的名称
    src: {
      type: String,
      require: true,
    },
    scrolling: {
      type: String,
      default: 'auto',
    },
    frameborder: {
      type: String,
      default: '0',
    },
    showFrame: {
      type: Boolean,
      default: true,
    },
    iframeType: {
      type: Number,
      default: 1, //1表示刘海屏手机，2表示正常手机
    },
    titleText: {
      type: String,
      default: '我的名片',
    },
    fillScroll: {
      type: Boolean,
      default: false,
    },
    windowSize: {
      type: String,
      default: 'normal',
    }, //尺寸大小，默认是320,big是375，仅在iframeType为2时可用
    titleColor: {
      type: String,
      default: '',
    },
    isInnerIframe: {
      // 是否是手机壳在外层，iframe在里面的类型，例如表单/商品这些
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      nowTimeStamp: '', //当前时间
      fixScrollWidth: '', //修复滚动条的bug
    };
  },
  computed: {
    boxClass() {
      let styleClass = '';
      if (this.bindClass) {
        styleClass += ` ${this.bindClass}`;
      }
      if (this.iframeType == 2) {
        styleClass += ` sizeIframe_${this.windowSize}`;
      }
      if (this.fillScroll) {
        styleClass += ' hideOverflow';
      }
      styleClass += ` iframeTyle_${this.iframeType}`;
      return styleClass;
    },
    backgroundColor() {
      let backColor = '';
      // if (initTsParam.isOem) {
      // 	backColor = `#359C53`; // 分销主题色
      // } else {
      // 	backColor = `#247AF3`; // 直销主题色
      // }
      backColor = '#247AF3'; // 直销主题色
      if (this.titleColor) {
        backColor = this.titleColor;
      }

      return `background:${backColor}`;
    },
  },
  created() {
    this.checkIframeType();
  },
  filters: {
    filterTime(time) {
      if (!time) return '';
      const dateObject = new Date(time);
      const forMateTime = format.date(dateObject, 'HH:mm');
      const hours = parseInt(format.date(dateObject, 'HH'));
      const realHours = Math.abs(hours - 12);
      const minutes = parseInt(format.date(dateObject, 'mm'));
      return `${realHours}:${minutes}${hours >= 12 ? 'PM' : 'AM'}`;
    },
  },
  methods: {
    updateScroll() {
      if (this.fillScroll) {
        if (
          this.$refs[this.refName].contentWindow.checkIsHaveScroll &&
          !this.$refs[this.refName].contentWindow.checkIsHaveScroll()
        ) {
          this.fixScrollWidth = '';
        } else {
          const barWidth = this.$refs[this.refName].contentWindow.preFixBar;
          if (this.isInnerIframe && this.showFrame) {
            this.fixScrollWidth = `width: ${this.$refs.iframeWrap.clientWidth + barWidth}px;`;
          } else {
            this.fixScrollWidth = `width: ${this.$refs.parentBox.clientWidth + barWidth}px`;
          }
        }
      }
    },
    loaded() {
      if (this.fillScroll) {
        this.updateScroll();
      }
      this.$emit('loaded');
    },
    getNowTime() {
      this.nowTimeStamp = +new Date();
    },
    // 如果是新的iframe类型，每隔1分钟更新时间
    checkIframeType() {
      if (this.iframeType == 2) {
        this.getNowTime();
        setTimeout(this.checkIframeType, 60000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* iframe组件样式 start */
.ts-phoneIframe {
  &.phoneBox {
    position: absolute;

    /* right: 25px; */
    top: 48px;
    width: 285px;
    height: 570px;
    background: url('~@/assets/image/comm/direct-phoneBox.png') no-repeat;
    background-size: cover;
    &.hideOverflow {
      overflow: hidden;
    }
    &.article {
      position: absolute;
      top: 48px;
      right: 25px;
      width: 285px;
      height: 570px;
      background: url('~@/assets/image/comm/phone.png') no-repeat;
      background-size: cover;
    }
    &.iframeTyle_2 {
      position: static !important;
      width: 320px;
      background: none !important;
      &.sizeIframe_big {
        width: 375px;
        .userTitle {
          height: 64px;

          /* background-size: 375px 128px; */
        }
      }
      .userTitle {
        width: 100%;
        height: 54px;

        /* background: url('~@/assets/image/phoneTitle.png') no-repeat;
    background-size: 320px 109px;
    background-position: 0 0; */
        color: #ffffff;
        .wifiIcon {
          float: right;
          margin-right: 6px;
          font-size: 16px;
        }
        .batteryIcon {
          float: right;
          margin-right: 23px;
          font-size: 16px;
        }
        .nowTime {
          padding-top: 5px;
          padding-left: 22px;
          overflow: hidden;
          font-size: 12px;
        }
        .cardTitle {
          padding: 0 8px;
          margin-top: 5px;
          overflow: hidden;
          font-size: 16px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      #previewPage {
        position: static;
        width: 100%;
        height: 516px;
        padding: 0;
        transform: scale(1);
      }
    }
    .currentDate {
      display: inline-block;
      margin-top: 24px;
      margin-left: 30px;
      font-size: 10px;
      color: #1f211f;
    }
    .currentPower {
      float: right;
      width: 36px;
      height: 10px;
      margin-top: 25px;
      margin-right: 30px;
      background: url('~@/assets/image/comm/wifi.png') no-repeat;
      background-size: 100% auto;
    }
    img {
      height: auto !important;
      max-width: 100%;
    }
    #previewPage {
      position: absolute;
      top: 11px;
      left: -9px;
      width: 290px;
      height: 550px;
      padding: 0 5px 0 5px;
      overflow-x: hidden;

      /* margin: -45px 0px 0px -10px; */
      overflow-y: auto;
      font-size: 10px;
      color: rgba(31, 33, 31, 0.5);
      background: transparent;
      transform: scale(0.8);
    }
    & > div {
      & > div {
        position: relative;
        min-height: 525px;
      }
    }
    .formTitle {
      position: absolute;
      top: 41px;
      right: 0;
      left: 0;
      display: inline-block;
      width: 17em;
      margin: auto;
      font-size: 12px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
    }
  }
}

/* .ts-phoneIframe.phoneBox.iframeTyle_2.sizeIframe_big .userTitle .wifiIcon {
    right: 90px;
}
.ts-phoneIframe.phoneBox.iframeTyle_2.sizeIframe_big .userTitle .batteryIcon {
    right: 35px;
} */
.directSale {
  .ts-phoneIframe {
    &.phoneBox {
      background: url('~@/assets/image/comm/direct-phoneBox.png') no-repeat;
      background-size: cover;
      &.iframeTyle_2 {
        &.sizeIframe_big {
          .userTitle {
            background-position: 0 -64px;
          }
        }
        .userTitle {
          background-position: 0 -54px;
        }
      }
    }
  }
}

/* iframe组件样式 end */
</style>

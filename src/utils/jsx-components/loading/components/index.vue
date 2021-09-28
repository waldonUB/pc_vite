<!--
 * @Author: ADI
 * @Date: 2021-03-25 17:49:34
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-29 15:50:27
-->
<template>
  <div id="tanshu_loading" class="loading-animate" v-show="isLoading && !['mt', 'pc'].includes(loadingType)">
    <div
      class="loadingBg"
      style=" top: 50%; left: 50%;width: 108px; height: 108px; margin-top: -46px; margin-left: -54px; background-color: rgba(0,0,0,.75); border-radius: 8px;"
    ></div>
    <div>
      <div class="c1"></div>
      <div class="c2"></div>
      <div class="c3"></div>
      <div class="c4"></div>
    </div>
    <span>{{ loadingTips }}</span>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'loading',
  data() {
    return {
      loadingTips: '加载中...',
      isLoading: false,
      loadingQuene: [],
      cacheQuene: {}, //缓存请求loading的队列.因为要等待500ms后才进入等待
      hideLoading: null,
      loadingType: 'pc', // loading类型 1.pc 2.mt，因为改造http方法要改的东西较多，改为从改loading类型入手
    };
  },
  watch: {
    loadingQuene: function(value) {
      const isLoadingContinue = value.length != 0;
      if (isLoadingContinue) {
        this.isLoading = true;
      } else {
        this.isLoading = true;
        if (this.hideLoading) {
          clearTimeout(this.hideLoading);
          this.hideLoading = null;
        }
        this.hideLoading = setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
      if (this.isLoading && value[0] && value[0].msg) {
        this.loadingTips = value[0].msg;
      }
    },
    isLoading(newVal) {
      if (this.loadingType === 'mt') {
        // 如果是h5或企微侧边栏就用这个loading
        if (newVal) {
          Vue.prototype.$indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle',
          });
        } else {
          Vue.prototype.$indicator.close();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-animate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $zindex-ad;
  width: 100%;
  height: 100%;
  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    margin-top: -30px;
    margin-left: -30px;
    & > div {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 16px;
      height: 16px;
      background: $primary-color;
      border-radius: 8px;
      content: '';
      animation: spin-a 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
      transform-origin: 20px 20px;
    }
    & > .c2 {
      top: 10px;
      right: 10px;
      left: auto;
      animation: spin-b 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
      transform-origin: -4px 20px;
    }
    & > .c3 {
      top: auto;
      right: 10px;
      bottom: 10px;
      left: auto;
      animation: spin-c 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
      transform-origin: -4px -4px;
    }
    & > .c4 {
      top: auto;
      bottom: 10px;
      animation: spin-d 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
      transform-origin: 20px -4px;
    }
  }
  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 30px;
    margin-top: 30px;
    margin-left: -50px;
    font-size: 12px;
    font-size: 14px;
    color: $primary-color;
    text-align: center;
  }
}
.directSale {
  .loading-animate {
    & > div {
      & > div {
        background: $primary-color;
      }
    }
    & > span {
      color: $primary-color;
    }
  }
}

@keyframes spin-a {
  0% {
    transform: rotate(90deg) translateZ(0);
  }

  50% {
    transform: rotate(180deg) translateZ(0);
  }

  75% {
    transform: rotate(270deg) translateZ(0);
  }

  100% {
    transform: rotate(360deg) translateZ(0);
  }
}

@keyframes spin-b {
  0% {
    transform: rotate(90deg) translateZ(0);
  }

  25% {
    transform: rotate(90deg) translateZ(0);
  }

  25% {
    transform: rotate(180deg) translateZ(0);
  }

  75% {
    transform: rotate(270deg) translateZ(0);
  }

  100% {
    transform: rotate(360deg) translateZ(0);
  }
}

@keyframes spin-c {
  0% {
    transform: rotate(90deg) translateZ(0);
  }

  25% {
    transform: rotate(90deg) translateZ(0);
  }

  50% {
    transform: rotate(270deg) translateZ(0);
  }

  100% {
    transform: rotate(360deg) translateZ(0);
  }
}

@keyframes spin-d {
  0% {
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }

  25% {
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);
    transform: rotate(90deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }

  50% {
    transform: rotate(180deg) translateZ(0);
    transform: rotate(180deg) translateZ(0);
    transform: rotate(180deg) translateZ(0);
    transform: rotate(180deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }

  75% {
    transform: rotate(270deg) translateZ(0);
    transform: rotate(270deg) translateZ(0);
    transform: rotate(270deg) translateZ(0);
    transform: rotate(270deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }

  75% {
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }

  100% {
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);

    /* IE 9 */

    /* Firefox */

    /* Safari 和 Chrome */
  }
}

/* loading样式结束 */
</style>

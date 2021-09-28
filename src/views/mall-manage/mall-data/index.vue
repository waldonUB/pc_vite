<!--
 * @Description  : 付费统计
 * @Author       : turbo
 * @Date         : 2021-03-30 15:28:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:10
-->

<template>
  <div class="mallData">
    <div class="dataMain" v-show="isShow">
      <global-ts-header>
        <template v-slot:leftPart>
          商城数据
        </template>
      </global-ts-header>
      <div class="pro_listBox">
        <global-ts-slide
          ref="mallDataSlider"
          class="bottomBorder"
          :activeNum="activeNum"
          :slidArray="slideList"
          @changeStatus="changeResonsibilityStatus"
        >
        </global-ts-slide>
        <component :is="currentTemp" @toView="changeResonsibilityStatus" :isShow.sync="isShow"> </component>
      </div>
    </div>
    <div id="ts-detailInfo"></div>
  </div>
</template>

<script>
import customPayment from './components/custom-payment/index.vue';
import productPayment from './components/product-payment/index.vue';

export default {
  name: 'mallData',
  components: {
    customPayment,
    productPayment,
  },
  props: {},
  data() {
    return {
      slideList: [
        {
          key: '客户付费分析',
          value: 1,
        },
        {
          key: '商品付费分析',
          value: 2,
        },
      ],
      currentTemp: 'customPayment',
      isShow: true,
      activeNum: 1,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     *切换slide
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} node
     * @param {*} index
     */
    changeResonsibilityStatus(node, index) {
      const sliderItem = this.$refs.mallDataSlider.$refs.sliderItem;
      switch (index) {
        case 1:
          this.currentTemp = 'customPayment';
          this.$utils.logDog('customPay_show');
          this.activeNum = 1;
          break;
        case 2:
          this.currentTemp = 'productPayment';
          this.$utils.logDog('productPay_show');
          this.activeNum = 2;
          break;
        default:
          this.currentTemp = 'customPayment';
          this.activeNum = 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mallData {
}
</style>

<style lang="scss">
.sortBar {
  .icon {
    vertical-align: -0.12em;
  }
}
.mallData {
  .pro_listBox {
    .bottomBorder {
      position: relative;
      padding-bottom: 17px;
      margin-bottom: 20px;
    }
  }
  .totalInfo {
    margin: 20px 0;
    font-size: 14px;
    color: #898989;
    .peopleTotal {
      width: 71px;
      height: 12px;
      padding-right: 10px;
      margin: 10px;
      margin-left: 0;
      font-size: 14px;
      line-height: 18px;
      border-right: 1px solid #ffdadada;
    }
    .num {
      margin: 0 5px;
      font-size: 20px;
      line-height: 18px;
      color: #247af3;
    }
  }
  .timeType {
    width: 120px;
  }
  .pro_line {
    font-size: 14px;
  }
}
</style>

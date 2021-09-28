<template>
  <div class="ts-carousel">
    <el-carousel
      :type="type"
      :height="height"
      :direction="direction"
      :autoplay="autoplay"
      :interval="interval"
      :arrow="currentArrow"
      :indicator-position="cuttentIndicatorPosition"
      @change="change"
    >
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <slot :item="item"></slot>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { Carousel, CarouselItem } from 'element-ui';

export default {
  name: 'ts-carousel',
  components: {
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
  },
  props: {
    type: {
      // 走马灯的类型
      type: String,
      default: '',
    },
    height: {
      // 面板高度
      type: String,
      default: '',
    },
    direction: {
      // 走马灯展示的方向
      type: String,
      default: 'horizontal',
    },
    autoplay: {
      // 是否自动切换
      type: Boolean,
      default: true,
    },
    interval: {
      // 自动切换的时间间隔，单位为毫秒
      type: Number,
      default: 5000,
    },
    arrow: {
      // 切换箭头的显示时机
      type: String,
      default: 'hover',
    },
    indicatorPosition: {
      // 指示器的位置
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      currentArrow: '',
      cuttentIndicatorPosition: '',
    };
  },
  watch: {
    list() {
      // 只有一张图片的时候不用显示指示器
      if (this.list.length <= 1) {
        this.cuttentIndicatorPosition = 'none';
        this.currentArrow = 'never';
      } else {
        this.currentArrow = this.arrow;
        this.cuttentIndicatorPosition = this.indicatorPosition;
      }
    },
  },
  methods: {
    /**
     * 幻灯片切换的回调函数
     * @author enson
     * @date 2020-06-19
     * @param {*} newKey - 激活的幻灯片的索引
     * @param {*} oldKey - 原幻灯片的索引
     */
    change(newKey, oldKey) {
      this.$emit('change', newKey, oldKey, this.list[newKey]);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-carousel {
  ::v-deep img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>

<!--
 * @Description  : echart 图表数据
 * @Author       : turbo
 * @Date         : 2021-07-25 19:53:47
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-26 16:13:31
-->

<template>
  <div class="chart-map" :class="{ noPadding }">
    <div class="top-title">
      {{ title }}
      <global-ts-tool-tips v-if="toolTips" offset="10" effect="dark" placement="top-start">
        <template #content>
          {{ toolTips }}
        </template>
        <global-ts-svg-icon class="tip-icon" name="icon-wenhao1616"></global-ts-svg-icon>
      </global-ts-tool-tips>
      <slot name="title"></slot>
    </div>
    <div class="map-content">
      <div class="map-tools">
        <div class="set-tools">
          <slot name="tools"></slot>
        </div>
        <div class="comm-tools">
          <div v-if="showTypeBtn" :class="['change-data-box', { 'is-wxwork': isWxWork }]">
            <div
              class="change-btn"
              :class="{ active: !isWxWork }"
              v-tsDebounce="[
                () => {
                  changeType(1);
                },
                'click',
                300,
              ]"
            >
              全部
            </div>
            <div
              class="change-btn"
              :class="{ active: isWxWork }"
              v-tsDebounce="[
                () => {
                  changeType(2);
                },
                'click',
                300,
              ]"
            >
              企业微信
            </div>
          </div>
          <div v-if="isManage" class="upload-excel" @click="handleUpload">
            <global-ts-svg-icon name="icon-xiazai1616" :size="16"></global-ts-svg-icon>
          </div>
        </div>
      </div>
      <div class="map">
        <slot name="mainMap"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ChartMap',
  props: {
    noPadding: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    toolTips: {
      type: String,
      default: '',
    },
    showTypeBtn: {
      // 是否有切换类型数据按钮
      type: Boolean,
      default: false,
    },
    dataType: {
      // 客户 & 线索数据类型
      type: Number,
      default: 1,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    isWxWork() {
      return this.dataType === 2;
    },
  },
  methods: {
    /**
     * @description : 改变数据类型
     * @author      : turbo
     * @Date        : 2021-07-26 10:13:00
     * @param        {Number} type 数据类型 1 - 全部 2 - 企微数据
     */
    changeType(type) {
      this.$emit('handleChange', type);
    },
    /**
     * @description 导出当前图标的数据到excel
     * @author enson
     * @date 2021-01-08
     */
    handleUpload() {
      this.$emit('handleUpload');
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-map {
  &.noPadding {
    .map-content {
      padding: 0;
    }

    .map-tools {
      margin: 20px;
    }
  }

  .top-title {
    @include flex-left;

    margin-bottom: 12px;
    font-size: 16px;
    color: $color-00;

    .tip-icon {
      margin-left: 8px;
      font-size: 16px;
      color: $color-b2;
    }
  }

  .map-content {
    padding: 20px;
    border: 1px solid $color-ee;
    border-radius: 4px;
  }

  .map-tools {
    @include flex-top-between;
  }

  .comm-tools {
    @include flex-center;
  }

  .change-data-box {
    @include flex-center;

    position: relative;
    margin-right: 20px;
    background-color: $color-f7;
    border-radius: 4px;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 88px;
      height: 100%;
      background-color: $primary-color;
      border-radius: 4px;
      content: '';
      transition: all 0.3s;
    }

    &.is-wxwork {
      &::after {
        left: 88px;
      }
    }

    .change-btn {
      @include flex-center;

      z-index: 9;
      width: 88px;
      height: 34px;
      font-size: 14px;
      color: $color-89;
      cursor: pointer;
      border-radius: 4px;

      &.active {
        color: $color-f7;
      }
    }
  }

  .upload-excel {
    @include flex-center;

    width: 34px;
    height: 34px;
    font-size: 16px;
    color: $color-b2;
    cursor: pointer;
    border: 1px solid $color-da;
    border-radius: 4px;
    box-sizing: border-box;
  }
}
</style>

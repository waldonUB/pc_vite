<!--
 * @Author       : ADI
 * @Date         : 2021-05-08 17:47:53
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 13:44:11
-->
<template>
  <div class="tanshu-header-comm" :class="{ autoHeight, noMargin }">
    <div class="leftPart">
      <slot name="leftPart"></slot>
    </div>
    <div class="rightPart">
      <slot name="rightPart"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-header',
  components: {},
  props: {
    autoHeight: {
      type: Boolean,
      default: false,
    },
    noMargin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
/* 每一个tab的顶部样式开始 */
.tanshu-header-comm {
  @include flex-between;

  height: 34px;
  margin-bottom: 20px;

  &.autoHeight {
    height: 16px;

    .leftPart {
      height: 16px;
      line-height: 16px;
    }

    .rightPart {
      height: 16px;
    }
  }

  &.noMargin {
    margin: 0;
  }

  .leftPart {
    @include flex-left;

    height: 34px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.2;
    color: $color-00;
    span {
      /* width: 184px; */
      height: 12px;
      padding-left: 5px;
      font-size: 12px;
      font-weight: 400;
      color: $error-color;
    }
    .helpIcon {
      &.icon {
        width: 1.2em;
        height: 1.2em;
        margin-left: 6px;
        overflow: hidden;
        color: $primary-color;
        vertical-align: -0.15em;
        cursor: pointer;
      }
    }
    .question-icon {
      width: 16px;
      height: 16px;
      margin-left: 6px;
      color: #536363;
      cursor: pointer;
    }
    .redTip {
      margin-left: 5px;
      // font-family: Microsoft YaHei;
      font-size: 12px;
      font-weight: normal;
      line-height: 18px;
      color: $error-color;
    }
  }
  .rightPart {
    @include flex-right;

    height: 34px;
    .rightPartBtn {
      margin-right: 10px;
    }
  }
}
.directSale {
  .tanshu-header-comm {
    .leftPart {
      .helpIcon {
        &.icon {
          color: $primary-color !important;
        }
      }
    }
  }
}
</style>

<template>
  <div :class="tipClassCal" v-if="isShowTip || showVersionTip">
    <global-ts-svg-icon v-if="isShowIcon" :class="['tipIcon', tipType]" :name="iconCal" />
    <p class="tipContent">
      <slot name="content"></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ts-tip',
  props: {
    isShowIcon: {
      type: Boolean,
      default: true,
    },
    showVersionTip: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'middle',
    },
    tipType: {
      type: String,
      default: 'warn',
    },
    isClickShowTip: {
      type: Boolean,
      default: false,
    },
    delayTime: {
      type: Number,
      default: 5000,
    },
    bindClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowTip: false,
      showTimer: 0,
    };
  },
  watch: {
    isClickShowTip(newVal) {
      if (newVal) {
        clearTimeout(this.showTimer);
        this.$emit('update:isClickShowTip', false);
        this.isShowTip = true;
        this.showTimer = setTimeout(() => {
          this.isShowTip = false;
        }, this.delayTime);
      }
    },
  },
  computed: {
    tipClassCal() {
      return [this.size, 'tanshuTip', this.tipType, this.bindClass];
    },
    iconCal() {
      switch (this.tipType) {
        case 'warn':
          return 'icon-icon-1';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 警告提示结束 */
.tanshuTip {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: $zindex-mutual;
  display: flex;
  width: 580px;
  height: 40px;
  padding: 0 14px 0 17px;
  font-size: 14px;
  font-weight: normal;
  line-height: 14px;
  color: $color-53;
  background: #fffae8;
  border: 1px solid $yellow-color;
  border-radius: 2px;
  transform: translateX(-50%);
  box-sizing: border-box;
  align-items: center;
  flex-flow: row nowrap;
  &.versionTip {
    position: static;
    width: 478px;
    margin-bottom: 24px;
    transform: translateX(0);
    .restDay {
      font-size: 14px;
      color: $color-53;
    }
    .remind {
      font-size: 12px;
      color: $color-b2;
    }
  }
  .tipContent {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    justify-content: space-between;
    flex: 1 1 auto;
  }
  .tipIcon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    overflow: hidden;
    vertical-align: -0.15em;
    flex: 0 0 auto;
    &.warn {
      color: $warning-color;
      color: $warning-color;
    }
  }
}

/* .tanshuTip.versionTip .updateBtn{
    color: #B2B2B2;
    font-size: 12px;
} */
</style>

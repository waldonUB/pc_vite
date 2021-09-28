<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:31:05
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-15 15:05:54
-->
<template>
  <global-ts-tool-tips :disabled="tips.length <= 6" effect="dark" :content="tips" placement="top">
    <div @click="emitClick" class="wxWorkTag" :class="tagClassCal">
      <div v-if="withCancel" class="withCancel" @click="deleteTag">
        <i class="el-icon el-icon-close"></i>
      </div>
      <div v-if="withIcon" class="withIcon" :class="withIconClassCal" @click="operateTag">
        <i :class="'el-icon ' + iconCal"></i>
      </div>
      <span class="tagText"><slot></slot></span>
    </div>
  </global-ts-tool-tips>
</template>

<script>
export default {
  name: 'ts-wxtag',
  props: {
    type: {
      type: String,
      default: 'normal',
    },
    // 这个后续统一改掉用withIcon
    withCancel: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'small',
    },
    withIcon: {
      type: String,
      default: '',
    },
  },
  computed: {
    tagClassCal() {
      const classList = [];
      switch (this.type) {
        case 'selected':
          classList.push('selected');
          break;
        case 'staffSelected':
          classList.push('staffSelected');
          break;
        case 'customerSelected':
          classList.push('customerSelected');
          break;
        case 'normalAdd':
          classList.push('normalAdd');
          break;
        case 'selectedAdd':
          classList.push('selectedAdd');
          break;
        case 'staffAdd':
          classList.push('staffAdd');
          break;
        case 'customerAdd':
          classList.push('customerAdd');
          break;
        case 'tagMain': // 区分直分销
          classList.push('tagMain');
      }
      switch (this.size) {
        case 'small':
          classList.push('small');
          break;
        case 'medium':
          classList.push('medium');
      }
      return classList;
    },
    withIconClassCal() {
      if (this.withIcon === 'cancel' || this.withIcon === 'delete') {
        return 'cancel';
      } else {
        return 'plus';
      }
    },
    iconCal() {
      switch (this.withIcon) {
        case 'cancel':
          return 'el-icon-close';
        case 'delete':
          return 'el-icon-minus';
        case 'plus':
          return 'el-icon-plus';
        default:
          return '';
      }
    },
  },
  methods: {
    emitClick() {
      this.$emit('click');
    },
    deleteTag() {
      this.$emit('deletetag');
    },
    operateTag() {
      this.$emit('operateTag');
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkTag {
  position: relative;
  display: flex;
  height: 26px;
  min-width: 48px;
  padding: 0 16px;
  margin: 5px 10px 5px 0;
  color: $color-53;
  cursor: pointer;
  background: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  outline-style: none;
  &.medium {
    height: 38px;
    min-width: 60px;
    font-size: 14px;
  }
  &.selected {
    color: $primary-color;
    background: rgba(36, 122, 243, 0.1);
    border: 1px solid $primary-color;
  }
  &.staffSelected {
    color: $primary-color;
    background: rgba(36, 122, 243, 0.1);
    border: 1px solid $primary-color;
  }
  &.customerSelected {
    color: #f88304;
    background: rgba(248, 131, 4, 0.1);
    border: 1px solid #f88304;
  }
  &.normalAdd {
    color: $color-b2;
    background: #f7f7f7;
  }
  &.selectedAdd {
    color: #ffffff;
    background: $primary-color;
  }
  &.staffAdd {
    color: #ffffff;
    background: $primary-color;
  }
  &.customerAdd {
    color: #ffffff;
    background: #f88304;
  }
  &.tagMain {
    color: $primary-color;
    background: rgba(36, 122, 243, 0.1);
    border: 1px solid $primary-color;
  }
  .withCancel {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    width: 16px;
    height: 16px;
    font-size: 12px;
    color: #ffffff;
    background: $error-color;
    border-radius: 50%;
    transform: translate(50%, -50%);
    justify-content: center;
    align-items: center;
  }
  .withIcon {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    width: 16px;
    height: 16px;
    font-size: 12px;
    color: #ffffff;
    background: $error-color;
    border-radius: 50%;
    transform: translate(50%, -50%);
    justify-content: center;
    align-items: center;
    &.plus {
      background: $primary-color;
    }
  }
  &.sortItem {
    &.selected {
      /* 移动时覆盖对话框层级 */
      z-index: 99999;
      pointer-events: initial !important;
      cursor: move;
      user-select: none !important;
    }
  }
}
.tagText {
  max-width: 6em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 0 auto;
}
.directSale {
  .wxWorkTag {
    &.selected {
      color: $primary-color;
      background: rgba(36, 122, 243, 0.1);
      border: 1px solid $primary-color;
    }
    &.staffSelected {
      color: $primary-color;
      background: rgba(36, 122, 243, 0.1);
      border: 1px solid $primary-color;
    }
    &.selectedAdd {
      color: #ffffff;
      background: $primary-color;
    }
    &.staffAdd {
      color: #ffffff;
      background: $primary-color;
    }
    &.tagMain {
      color: $primary-color;
      background: rgba(36, 122, 243, 0.1);
      border: 1px solid $primary-color;
    }
    .withIcon {
      &.plus {
        background: $primary-color;
      }
    }
  }
}
</style>

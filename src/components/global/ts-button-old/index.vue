<template>
  <div class="ts-button" ref="button" :class="bindClass" v-tsDebounce="[handleClick, 'click', 500]">
    <global-ts-svg-icon class="icon" :name="icon" v-if="isHaveIcon && iconPosition == 'left'" />
    <span v-if="$slots.default">
      <slot></slot>
    </span>
    <global-ts-svg-icon class="icon" :name="icon" v-if="isHaveIcon && iconPosition == 'right'" />
  </div>
</template>

<script>
export default {
  name: 'ts-button',
  props: {
    //按钮的大小，目前有三种，大中小，分别对应：medium / small / mini
    size: {
      type: String,
      default: 'medium',
    },
    // 按钮的类型，目前只有两种，主要按钮和次要按钮，分别对应：primary / others / default / black / textGreen / mainText / warnText / greyText
    type: {
      type: String,
      default: 'primary',
    },
    // 按钮是否为不可点击状态
    disabled: {
      type: [Boolean, Function],
      default: false,
    },
    // 按钮icon的class名称，这里是使用svg
    icon: String,
    //按钮的位置
    iconPosition: {
      type: String,
      default: 'left',
    },
  },
  methods: {
    handleClick: function(event) {
      if (!this.disabled) {
        // waldon 2021年2月25日 event.target为只读属性，严格模式下会直接报错，页面没有发现用到这个属性的，暂时注释掉
        // event.target = this.$refs.button;
        this.$emit('click', event);
      }
    },
  },
  computed: {
    isHaveIcon: function() {
      return typeof this.icon !== 'undefined';
    },
    bindClass: function() {
      var styleClass = '';
      //按钮的尺寸
      if (['medium', 'small', 'mini'].includes(this.size)) {
        styleClass = 'ts-button-size-' + this.size;
      } else {
        styleClass = 'ts-button-size-medium';
      }

      //按钮的类型
      if (
        [
          'primary',
          'others',
          'default',
          'black',
          'textGreen',
          'mainText',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
          'greyOther',
        ].includes(this.type)
      ) {
        styleClass += ' ts-button-type-' + this.type;
      } else {
        styleClass += ' ts-button-type-primary';
      }

      //按钮的位置
      if (['right', 'left'].includes(this.iconPosition)) {
        styleClass += ' ts-button-iconPosition-' + this.iconPosition;
      } else {
        styleClass += ' ts-button-iconPosition-left';
      }

      //如果有icon的话
      if (this.isHaveIcon) {
        styleClass += ' ts-button-isHaveIcon';
        if (this.icon == 'icon-icon-10') {
          styleClass += ' ts-button-deleteButton';
        }
      }

      //如果是不可点击的话
      if (this.disabled) {
        styleClass += ' disabled ';
      }
      return styleClass;
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-button {
  display: inline-block;
  height: 34px;
  min-width: 80px;
  line-height: 34px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
  &.disabled {
    cursor: not-allowed !important;
  }
  .icon {
    margin-right: 6px;
  }
}

/* 最大的size的按钮 */
.ts-button {
  &.ts-button-size-medium {
    height: 40px;
    min-width: 140px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
  }
}

/* 中型的按钮 */
.ts-button {
  &.ts-button-size-small {
    height: 34px;
    min-width: 88px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 34px;
  }
}

/* 小型的按钮 */
.ts-button {
  &.ts-button-size-mini {
    height: 26px;
    min-width: 48px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
  }
}

/* 主按钮正常状态 */
.ts-button {
  &.ts-button-type-primary {
    color: #ffffff;
    background: $primary-color;
    border: 1px solid $primary-color;
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-primary {
      background: $primary-color;
      border: 1px solid $primary-color;
    }
  }
}

/* 主按钮hover状态 */
.ts-button {
  &.ts-button-type-primary {
    &:hover {
      color: #ffffff;
      background: #206dda;
      border: 1px solid #206dda;
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-primary {
      &:hover {
        background: #206dda;
        border: 1px solid #206dda;
      }
    }
  }
}

/* 主按钮不可用状态 */
.ts-button {
  &.ts-button-type-primary {
    &.disabled {
      color: #ffffff;
      background: #bdd7fb;
      border: 1px solid #bdd7fb;
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-primary {
      &.disabled {
        background: #bdd7fb;
        border: 1px solid #bdd7fb;
      }
    }
  }
}

/* 主按钮不可用状态下hover */
.ts-button {
  &.ts-button-type-primary {
    &.disabled {
      &:hover {
        background: #bdd7fb;
        border: 1px solid #bdd7fb;
      }
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-primary {
      &.disabled {
        &:hover {
          background: #bdd7fb;
          border: 1px solid #bdd7fb;
        }
      }
    }
  }
}

/* 次要按钮 */
.ts-button {
  &.ts-button-type-others {
    color: $border-color;
    background: #fdfdfd;
    border: 1px solid $border-color;
    span {
      color: $color-53;
    }
  }
}

/* 灰色背景 hover红色警告按钮 开始 */
.ts-button {
  &.ts-button-type-blackWarn {
    color: #ffffff;
    background: #cdcdcd;
    &:hover {
      background: $error-color;
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-blackWarn {
      background: $color-b2;
      &:hover {
        background: $error-color;
      }
    }
  }
}

/* 灰色背景 hover红色警告按钮 结束 */

/* 次要按钮hover */
.ts-button {
  &.ts-button-type-others {
    &:hover {
      background: #f7f7f7;
      border: 1px solid #f7f7f7;
    }
  }
}

/* 次要按钮不可用状态 */
.ts-button {
  &.ts-button-type-others {
    &.disabled {
      color: $color-b2;
      background: #f7f7f7;
      border: 1px solid #f7f7f7;
    }
  }
}

/* 次要按钮不可用状态hover */
.ts-button {
  &.ts-button-type-others {
    &.disabled {
      &:hover {
        color: $color-b2;
        background: #f7f7f7;
        border: 1px solid #f7f7f7;
      }
    }
  }
}

/* 黑色背景按钮开始 */
.ts-button {
  &.ts-button-type-black {
    color: #ffffff;
    cursor: not-allowed;
    background: #cdcdcd;
  }
}

/* 黑色背景按钮结束 */

/* 白色背景主色调文字按钮开始 */
.ts-button {
  &.ts-button-type-mainText {
    color: $primary-color;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid $primary-color;
    box-sizing: border-box;
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-mainText {
      color: $primary-color;
      cursor: pointer;
      background: #ffffff;
      border: 1px solid $primary-color;
      box-sizing: border-box;
    }
  }
}

/* 白色背景主色调文字按钮结束 */

/* 白色背景警告色文字按钮开始 */
.ts-button {
  &.ts-button-type-warnText {
    color: $error-color;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid $error-color;
    box-sizing: border-box;
  }
}

/* 白色背景警告色文字按钮结束 */

/* 纯文字，绿色字开始 */
.ts-button {
  &.ts-button-type-textGreen {
    min-width: auto;
    padding: 0;
    color: $primary-color;
    &:hover {
      min-width: auto;
      padding: 0;
      color: #206dda;
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-textGreen {
      color: $primary-color;
      &:hover {
        color: #206dda;
      }
    }
  }
}

/* 纯文字，绿色字结束 */

/* 无边框灰色字 */
.ts-button {
  &.ts-button-type-greyText {
    color: $color-89;
    cursor: pointer;
    border: none;
    box-sizing: border-box;
    &:hover {
      color: #333333;
    }
  }
  &.ts-button-size-small {
    &.ts-button-isHaveIcon {
      &.ts-button-type-greyText {
        min-width: auto;
        padding: 0;
      }
    }
  }
}

/* 白色背景警告色文字按钮结束 */

/* 白色背景灰色文字 hover主题色 start */
.ts-button {
  &.ts-button-type-greyMain {
    color: $color-53;
    background: #ffffff;
    border: 1px solid $border-color;
    border-radius: 4px;
    &:hover {
      color: #ffffff;
      background: $primary-color;
      border: 1px solid $primary-color;
    }
  }
}
.directSale {
  .ts-button {
    &.ts-button-type-greyMain {
      &:hover {
        color: #ffffff;
        background: $primary-color;
        border: 1px solid $primary-color;
      }
    }
  }
}

/* 白色背景灰色文字 hover主题色 end */

/* 白色背景灰色文字 hover主题色 start */
.ts-button {
  &.ts-button-type-greyOther {
    color: $color-53;
    background: #ffffff;
    border: 1px solid $border-color;
    border-radius: 4px;
    &:hover {
      color: $primary-color;
      background: #ffffff;
      border: 1px solid $primary-color;
    }
  }
}

/* 白色背景灰色文字 hover主题色 end */

/* 最大的size的按钮 有Icon */
.ts-button {
  &.ts-button-size-medium {
    &.ts-button-isHaveIcon {
      min-width: 80px;
      padding: 0 16px;
    }
  }
}

/* 中型的按钮 有icon */
.ts-button {
  &.ts-button-size-small {
    &.ts-button-isHaveIcon {
      min-width: 80px;
      padding: 0 16px;
    }
  }
  &.ts-button-isHaveIcon {
    svg {
      margin-right: 6px;
    }
    &.ts-button-deleteButton {
      svg {
        color: $color-b2 !important;
      }
    }
  }
  &.ts-button-type-default {
    min-width: auto !important;
    padding: 0 !important;
  }
}

/* icon在左边 */
.ts-button.ts-button-iconPosition-left {
}

/* icon在右边 */
.ts-button.ts-button-iconPosition-right {
}
</style>

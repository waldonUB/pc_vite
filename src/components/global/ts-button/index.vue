<template>
  <fa-button
    :type="bindType"
    :class="[bindClass, { 'with-red-dot': withRedDot && isShowBtnRedDot }]"
    @click="handleClick"
    :size="bindSize"
    :disabled="disabled"
    :loading="loading"
    v-bind="$attrs"
  >
    <global-ts-svg-icon
      :class="['icon', `icon-${iconPosition}`, { hidden: loading }]"
      v-if="isHaveIcon && iconPosition === 'left'"
      :name="icon"
      :size="16"
    ></global-ts-svg-icon>
    <slot></slot>
    <global-ts-svg-icon
      :class="['icon', { hidden: loading }]"
      v-if="isHaveIcon && iconPosition === 'right'"
      :name="icon"
    ></global-ts-svg-icon>
  </fa-button>
</template>

<script>
import { mapState } from 'vuex';

import { debounce } from 'lodash';
import { Icon } from '@fk/faicomponent';

export default {
  name: 'global-button',
  components: {
    [Icon.name]: Icon,
  },
  props: {
    // primary / others / default / black / textGreen / mainText / warnText / greyText / blackWarn / greyMain / greyOther / outline / blueBgText
    type: {
      type: String,
      default: 'primary',
    },
    //按钮的大小，目前有三种，大中小，分别对应: medium / small / mini 高度: 40px / 34px / 26px
    size: {
      type: String,
      default: 'medium',
    },
    // 按钮是否为不可点击状态
    disabled: {
      type: Boolean,
      default: false,
    },
    // 按钮loading状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 按钮icon的class名称，这里是使用svg
    icon: String,
    //按钮的位置
    iconPosition: {
      type: String,
      default: 'left',
    },
    withRedDot: {
      // 带红点的按钮，命名规则为路由名 + 按钮事件名，例：wxChatArt-manageGroup
      type: String,
      default: '',
    },
  },
  data() {
    return {
      btnRedDotList: [
        {
          name: 'wxChatArt-manageGroup',
          isShowRedDot: true,
          versionDate: '2021-04-07', // 红点显示的版本，红点更新后需要改
        },
        {
          name: 'addClue',
          isShowRedDot: true,
          versionDate: '2021-06-03', // 红点显示的版本，红点更新后需要改
        },
      ],
      isShowBtnRedDot: true, // 是否显示按钮红点
    };
  },
  computed: {
    ...mapState({
      openTime: state => state.user.info.openTime,
    }),
    isHaveIcon() {
      return this.icon !== undefined;
    },
    /**
     * @description : 按钮类型 primary(主要操作) / mainText(次要操作) / greyOther(次要操作2) / others / default / black / textGreen / mainText(次要操作) /
     *                        warnText / greyText / blackWarn / greyMain
     * @author      : ADI
     * @Date        : 2021-04-13 15:01:05
     */
    bindType() {
      // ts: primary | mainText | greyOther | others | default | black | textGreen| warnText | greyText | blackWarn | greyMain
      // fa: primary | ghost | dashed | link | text | default
      const typeMap = {
        primary: 'primary',
        others: 'default',
        default: 'link',
        black: 'default',
        textGreen: 'link',
        mainText: 'text',
        warnText: 'text',
        greyText: 'link',
        blackWarn: 'primary',
        greyMain: 'primary',
        greyOther: 'primary',
      };
      return typeMap[this.type] || typeMap.primary;
    },
    /**
     * @description : 设置 class name: global-button-size-[size] global-button-type-[type] disabled
     *                                 global-button-iconPosition-[iconPosition] global-button-isHaveIcon
     * @author      : ADI
     * @Date        : 2021-04-13 15:01:05
     */
    bindClass() {
      let styleClass = 'global-button';
      //按钮的尺寸
      if (['medium', 'small', 'mini'].includes(this.size)) {
        styleClass += ' global-button-size-' + this.size;
      } else {
        styleClass += ' global-button-size-medium';
      }

      //按钮的类型
      if (
        [
          'primary',
          'mainText',
          'greyOther',
          'others',
          'default',
          'black',
          'textGreen',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
          'outLine',
        ].includes(this.type)
      ) {
        styleClass += ' global-button-type-' + this.type;
      } else {
        styleClass += ' global-button-type-primary';
      }

      //按钮的位置
      if (['right', 'left'].includes(this.iconPosition)) {
        styleClass += ' global-button-iconPosition-' + this.iconPosition;
      } else {
        styleClass += ' global-button-iconPosition-left';
      }

      //如果有icon的话
      if (this.isHaveIcon) {
        styleClass += ' global-button-isHaveIcon';
        if (this.icon == 'icon-icon-10') {
          styleClass += ' global-button-deleteButton';
        }
      }

      //如果是不可点击的话
      if (this.disabled) {
        styleClass += ' disabled ';
      }
      return styleClass;
    },
    /**
     * @description : 按钮大小 medium / small / mini
     * @author      : ADI
     * @Date        : 2021-04-13 15:00:27
     */
    bindSize() {
      // ts: medium / small / mini
      // fa: large  / default / small
      const sizeMap = {
        medium: 'large',
        small: 'default',
        mini: 'small',
      };
      return sizeMap[this.size] || sizeMap.small;
    },
  },
  created() {
    if (this.withRedDot) {
      const btnRedDotListStr = localStorage.getItem('btnRedDotList');
      if (btnRedDotListStr && Array.isArray(JSON.parse(btnRedDotListStr))) {
        this.btnRedDotList = this.btnRedDotList.reduce((pre, cur) => {
          const btnItem = JSON.parse(btnRedDotListStr).find(item => item.name === cur.name);
          pre.push(btnItem || cur);
          return pre;
        }, []);
      }
      if (this.openTime) {
        this.btnRedDotList = this.btnRedDotList.filter(
          item => new Date(item.versionDate).getTime() >= new Date(this.openTime).getTime(),
        );
        this.isShowBtnRedDot = this.btnRedDotList.some(item => item.name === this.withRedDot && item.isShowRedDot);
      }
      localStorage.setItem('btnRedDotList', JSON.stringify(this.btnRedDotList));
    }
  },
  methods: {
    handleClick: debounce(function click(event) {
      this.withRedDot && this.setRedDotState(this.withRedDot);
      this.$emit('click', event);
    }, 200),
    /**
     * 设置按钮红点状态
     * @author waldon
     * @date 2020/10/23
     * @param {String} name - 按钮名
     */
    setRedDotState(name) {
      const index = this.btnRedDotList.findIndex(item => item.name === name);
      if (index !== -1) {
        this.$set(this.btnRedDotList, index, {
          name: name,
          isShowRedDot: false,
          versionDate: this.btnRedDotList[index].versionDate,
        });
        this.isShowBtnRedDot = false;
        localStorage.setItem('btnRedDotList', JSON.stringify(this.btnRedDotList));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden {
  opacity: 0;
  visibility: hidden;
}
</style>

<style lang="scss">
$button-primary-hover: $primary-color-hover;
$button-primary-disabled: #bdd8ff;
$button-others-hover: #f7f7f7;
$button-others-disabled: #f7f7f7;
$button-icon: #dadada;
$button-black-bg: #cdcdcd;
$button-blackWarn-bg: #cdcdcd;
$button-greyText-hover: #333333;
$button-border-radius: 4px;

/* button height */
$global-button-medium-height: 40px;
$global-button-small-height: 34px;
$global-button-mini-height: 26px;

/* button padding */
$global-button-size-medium-padding: 16px;
$global-button-size-small-padding: 16px;
$global-button-size-mini-padding: 12px;
$global-button-size-medium-has-icon-padding: 12px;
$global-button-size-small-has-icon-padding: 12px;
$global-button-size-mini-has-icon-padding: 8px;

/* icon padding */
$global-button-size-medium-icon-padding: 8px;
$global-button-size-small-icon-padding: 8px;
$global-button-size-mini-icon-padding: 4px;

.global-button {
  height: $global-button-small-height;
  padding: 0 $global-button-size-small-padding;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  border-radius: $button-border-radius;
  box-sizing: border-box;
  & .icon {
    font-size: 14px;
    vertical-align: middle;
  }
  & > span {
    vertical-align: middle;
  }
  & + .global-button {
    margin-left: 10px;
  }
  &.with-red-dot {
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 12px;
      height: 12px;
      background: $error-color;
      border: 2px solid $color-ff;
      border-radius: 50%;
      content: '';
      opacity: 1;
      transform: translate(50%, -50%);
      box-sizing: border-box;
    }
  }

  /* 移除antd动画 */
  &[fa-click-animating-without-extra-node='true']::after {
    border: 0 none;
    opacity: 0;
    animation: none 0 ease 0 1 normal;
  }
  &.global-button-isHaveIcon {
    &.global-button-iconPosition-left {
      padding: 0 $global-button-size-small-padding 0 $global-button-size-small-has-icon-padding;
      .icon {
        margin-right: $global-button-size-small-icon-padding;
        margin-left: 0;
      }

      /* 自定义loading (+__+) */
      &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
        padding-left: $global-button-size-small-has-icon-padding;
      }
      &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
        padding-left: $global-button-size-small-has-icon-padding;
      }
    }
    &.global-button-iconPosition-right {
      padding: 0 $global-button-size-small-has-icon-padding 0 $global-button-size-small-padding;
      .icon {
        margin-right: 0;
        margin-left: $global-button-size-small-icon-padding;
      }

      /* 自定义loading (+__+) */
      &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
        padding-left: $global-button-size-small-padding;
      }
      &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
        padding-left: $global-button-size-small-padding;
      }
    }
    &.global-button-deleteButton {
      .icon {
        color: $color-b2;
      }
    }
  }

  /* 自定义loading (+__+) */
  &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
    padding-left: $global-button-size-small-padding;
  }
  &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
    padding-left: $global-button-size-small-padding;
  }

  /* medium */
  &.global-button-size-medium {
    height: $global-button-medium-height;
    min-width: 140px;
    padding: 0 $global-button-size-medium-padding;
    font-weight: 500;
    &.global-button-isHaveIcon {
      min-width: 80px;
      &.global-button-iconPosition-left {
        padding: 0 $global-button-size-medium-padding 0 $global-button-size-medium-has-icon-padding;
        .icon {
          margin-right: $global-button-size-medium-icon-padding;
          margin-left: 0;
          vertical-align: middle;
        }

        /* 自定义loading (+__+) */
        &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-medium-has-icon-padding;
        }
        &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-medium-has-icon-padding;
        }
      }
      &.global-button-iconPosition-right {
        padding: 0 $global-button-size-medium-has-icon-padding 0 $global-button-size-medium-padding;
        .icon {
          margin-right: 0;
          margin-left: $global-button-size-medium-icon-padding;
        }

        /* 自定义loading (+__+) */
        &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-medium-padding;
        }
        &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-medium-padding;
        }
      }
    }

    /* 自定义loading (+__+) */
    &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
      padding-left: $global-button-size-medium-padding;
    }
    &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
      padding-left: $global-button-size-medium-padding;
    }
  }

  /* small */
  &.global-button-size-small {
    /* 继承基础样式 */
  }

  /* mini */
  &.global-button-size-mini {
    height: $global-button-mini-height;
    padding: 0 $global-button-size-mini-padding;
    &.global-button-isHaveIcon {
      &.global-button-iconPosition-left {
        padding: 0 $global-button-size-mini-padding 0 $global-button-size-mini-has-icon-padding;
        .icon {
          margin-right: $global-button-size-mini-icon-padding;
          margin-left: 0;
        }

        /* 自定义loading (+__+) */
        &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-mini-has-icon-padding;
        }
        &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-mini-has-icon-padding;
        }
      }
      &.global-button-iconPosition-right {
        padding: 0 $global-button-size-mini-has-icon-padding 0 $global-button-size-mini-padding;
        .icon {
          margin-right: 0;
          margin-left: $global-button-size-mini-icon-padding;
        }

        /* 自定义loading (+__+) */
        &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-mini-padding;
        }
        &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
          padding-left: $global-button-size-mini-padding;
        }
      }
    }

    /* 自定义loading (+__+) */
    &.fa-btn.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
      padding-left: $global-button-size-mini-padding;
    }
    &.fa-btn-sm.fa-btn-loading:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) {
      padding-left: $global-button-size-mini-padding;
    }
  }

  /* primary */

  /* 主操作 */
  &.global-button-type-primary {
    color: $color-ff;
    background: $primary-color;
    border: 1px solid $primary-color;
    &:hover {
      color: $color-ff;
      background: $button-primary-hover;
      border-color: $button-primary-hover;
    }
    &.disabled {
      color: $color-ff;
      background: $button-primary-disabled;
      border: 1px solid $button-primary-disabled;
    }
  }

  /* mainText */

  /* 次要操作 */
  &.global-button-type-mainText {
    color: $primary-color;
    background: $color-ff;
    border-color: $primary-color;
    box-sizing: border-box;
    &.disabled {
      color: $primary-color;
      background: $color-ff;
      border-color: $primary-color;
      box-sizing: border-box;
    }
  }

  /* greyOther */

  /* 次要操作2 */
  &.global-button-type-greyOther {
    color: $color-53;
    background: $color-ff;
    border-color: $border-color;
    border-radius: $button-border-radius;
    &:hover {
      color: $primary-color;
      background: $color-ff;
      border-color: $primary-color;
      border-radius: $button-border-radius;
    }
    &.disabled {
      color: $color-b2;
      background: #fafafa;
      border-color: $border-color;
      border-radius: $button-border-radius;
    }
  }

  /* others */
  &.global-button-type-others {
    color: $color-53;
    background: #fdfdfd;
    border-color: $border-color;
    &:hover {
      background: $button-others-hover;
      border-color: $button-others-hover;
    }
    &.disabled {
      color: $color-53;
      background: $button-others-disabled;
      border: 1px solid $button-others-disabled;
      .icon {
        color: $color-b2;
      }
    }
    .icon {
      color: $button-icon;
    }
  }

  /* default */
  &.global-button-type-default {
    /* min-width: auto !important; */
    padding: 0 !important;
    color: $color-00;
    &.disabled:hover,
    &.disabled:active {
      color: $color-00;
    }
  }

  /* black */
  &.global-button-type-black {
    color: $color-ff;
    cursor: not-allowed;
    background: $button-black-bg;
    &:hover,
    &:focus {
      color: $color-ff;
      background: $button-black-bg;
      border-color: $button-black-bg;
      outline: none;
    }
    &::after {
      border: 0 none;
      opacity: 0;
      animation: none 0 ease 0 1 normal;
    }
  }

  /* textGreen */
  &.global-button-type-textGreen {
    padding: 0;
    color: $primary-color;

    /* min-width: auto; */
    &.disabled {
      color: $primary-color;
    }
    &:not(.global-button-isHaveIcon):hover {
      padding: 0;
      color: $button-primary-hover;

      /* min-width: auto; */
    }
  }

  /* warnText */
  &.global-button-type-warnText {
    color: $error-color;
    background: $color-ff;
    border-color: $error-color;
    box-sizing: border-box;
    &.disabled {
      color: $error-color;
      background: $color-ff;
      border-color: $error-color;
      box-sizing: border-box;
    }
  }

  /* greyText */
  &.global-button-type-greyText {
    padding: 0 !important;
    margin: 0 10px;
    color: $color-89;
    border-color: transparent;
    box-sizing: border-box;
    &:hover {
      color: $button-greyText-hover;
    }
    &.disabled {
      color: $color-89;
    }
    & + .global-button-type-greyText::after {
      position: absolute;
      top: 50%;
      left: -11px;
      width: 1px;
      height: 16px;
      background-color: $color-ee;
      content: '';
      transform: translateY(-50%);
    }
  }

  /* blackWarn */
  &.global-button-type-blackWarn {
    color: $color-ff;
    background: $button-blackWarn-bg;
    border-color: $button-blackWarn-bg;
    &:hover,
    &.disabled:hover {
      background: $error-color;
    }
    &.disabled {
      color: $color-ff;
      background: $button-blackWarn-bg;
      border-color: $button-blackWarn-bg;
    }
  }

  /* greyMain */
  &.global-button-type-greyMain {
    color: $color-53;
    background: $color-ff;
    border-color: $border-color;
    border-radius: $button-border-radius;
    &:hover,
    &.disabled:hover {
      color: $color-ff;
      background: $primary-color;
      border-color: $primary-color;
    }
    &.disabled {
      color: $color-53;
      background: $color-ff;
      border-color: $border-color;
      border-radius: $button-border-radius;
    }
  }

  /* outLine */
  &.global-button-type-outLine {
    color: $primary-color;
    text-shadow: none;
    background: transparent;
    border-color: $primary-color;
    &:hover {
      color: $primary-color-hover;
      border-color: $primary-color-hover;
    }
  }

  /* blueBgText */
  &.global-button-type-blueBgText {
    color: $primary-color;
    background: $primary-color-bg;
    border: 1px solid $primary-color;
    border-radius: 4px;
  }

  /* loading status */
  &.fa-btn.fa-btn-loading {
    position: relative;
    & > span {
      margin-left: 0;
      opacity: 0;
    }
    & > .anticon-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &:not(.fa-btn-circle):not(.fa-btn-circle-outline):not(.fa-btn-icon-only) .anticon:not(:last-child) {
      margin-left: 0;
    }
  }
}
</style>

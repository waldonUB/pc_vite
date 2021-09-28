<!--
 * @Description  : input输入框
 * @Author       : turbo
 * @Date         : 2021-03-19 17:54:51
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:07:09
-->

<template>
  <div class="ts-input" :class="{ 'ts-input-block': block }">
    <fa-input
      ref="tsInput"
      :type="realType"
      :style="{ width: width + 'px' }"
      :placeholder="placeholder"
      :showCount="showCountCal"
      :maxLength="maxLengthCal"
      autocomplete="off"
      v-model="realValue"
      v-bind="$attrs"
      v-on="$listeners"
      @change="changeValue"
    >
      <slot />
      <slot slot="addonBefore" name="addonBefore" />
      <slot slot="addonAfter" name="addonAfter" />
      <slot slot="prefix" name="prefix" />
      <slot slot="suffix" name="suffix" />
    </fa-input>
    <div v-if="type == 'password'" class="ts-input__pwd__icon">
      <global-ts-svg-icon
        v-show="value.length > 0"
        :name="eyeName"
        :width="26"
        :height="26"
        color="#d2d2d2"
        @click.native="togglePwdVisible"
      />
      <global-ts-svg-icon name="icon-icon-15" :width="26" :height="18" color="#d2d2d2" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TsInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'text',
    },
    limitType: {
      type: String,
    },
    width: {
      type: Number,
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    showLimit: {
      type: Boolean,
      default: undefined,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: String,
    },
    maxLength: {
      type: Number,
    },
    // showCount 默认样式为inline-block, 使用该prop转换为block
    block: {
      type: Boolean,
      default: false,
    },
    //不能输入空白
    limitSpace: {
      type: [String, Boolean],
      default: false,
    },
  },
  data() {
    return {
      isShowPwd: false,
      realValue: '',
    };
  },
  computed: {
    realType() {
      return this.type === 'password' && !this.isShowPwd ? 'password' : 'text';
    },
    eyeName() {
      return this.isShowPwd ? 'icon-icon-19' : 'icon-icon-20';
    },
    showCountCal() {
      if (typeof this.showLimit === 'boolean') {
        console.warn('global-ts-input: 建议使用 show-count 替换 showLimit');
        return this.showLimit;
      }
      return this.showCount;
    },
    maxLengthCal() {
      if (this.maxlength) {
        console.warn('global-ts-input: 建议使用 max-length 替换 maxlength');
        return Number(this.maxlength);
      }
      return this.maxLength;
    },
  },
  watch: {
    value: {
      handler(newValue) {
        this.realValue = newValue;
      },
      immediate: true,
    },
  },
  methods: {
    togglePwdVisible() {
      this.isShowPwd = !this.isShowPwd;
    },
    changeValue(e) {
      let { value } = e.target;
      this.$nextTick(() => {
        switch (this.limitType) {
          case 'int': // 限制输入数字
            value = value.replace(/[^\d]/g, '');
            break;
          case 'float': // 限制输入（数字 + 小数点）
            value = value.replace(/[^\d{1,}.\d{1,}|\d{1,}]/g, '');
            break;
          case 'decimal': // 限制输入两位小数（数字 + 小数点）
            value = this.repalcenNum(value);
            break;
          case 'idCard': // 匹配除字母数字点下划线中划线斜杠以外的字符
            value = value.replace(/[^\w./]/gi, '');
        }
        // 不能输入空白
        if (this.limitSpace) {
          value = value.replace(/\s*/g, '');
        }
        this.realValue = value;
        this.$emit('change.value', value);
      });
    },
    repalcenNum(value) {
      value = value + '';
      value = value.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      value = value.replace(/^\./g, ''); // 验证第一个字符是数字而不是.
      value = value.replace(/\.{2,}/g, '.'); // 只保留第一个.并清除多余的.
      value = value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.'); // 只允许输入一个小数点
      value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
      return value;
    },
  },
};
</script>

<style lang="scss">
.ts-input {
  @include flex-center;

  position: relative;
  width: 100%;
}

.fa-input-show-count {
  display: block;
  width: 100%;
}

.ts-input-block {
  .fa-input-show-count {
    &::after {
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.ts-input__pwd__icon {
  @include flex-center;

  position: absolute;
  right: 12px;

  svg:first-child {
    margin-right: 12px;
    cursor: pointer;
  }
}
</style>

<template>
  <div
    class="tshu_select"
    v-sleepError="removeErr"
    :class="[bindClass, sizeClass]"
    :style="{ width: width + 'px' }"
    v-windowResize="computeTop"
  >
    <div class="tshu_select_input" @click="showSelect" :class="selectClass">
      <input type="text" readonly v-model="selctId" class="hide" />
      <div
        class="motivate"
        v-if="!isUseSlot"
        :class="disabled === 'disabled' ? 'isDisabled' : showPlaceholder ? 'showPlaceholder' : ''"
      >
        {{ showVal == '' ? placeholder : showVal }}
      </div>
      <global-ts-svg-icon v-if="!isUseSlot" class="icon tshu_arrow" name="icon-xialakuangjiantou" />
      <slot v-if="isUseSlot" name="inputButton"></slot>
    </div>
    <global-ts-error v-if="haveErr && !hideErr">
      <template v-slot:errorTips>{{ errData.tips }}</template>
    </global-ts-error>
    <ul class="tshu_select_option" v-show="isShow" :style="top" v-tsclickoutside="handleClose">
      <li
        v-for="(item, index) in list"
        @click="selectOption(item[selectkey.value])"
        :class="item.isSelect ? 'select' : ''"
        :key="index"
      >
        {{ item[selectkey.label] }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ts-select',
  data() {
    return {
      showVal: '', //此处的value用于显示
      isShow: false, //是否显示下拉框
      selctId: -99, //选中的ID
      haveErr: false, //是否有错误
      hideErr: true, //是否隐藏错误
      countMyself: 0, //错误统计次数
      errData: null, //错误的相关信息
      countKey: 'tanshuSelect_' + +new Date(), //给每个select框动态配置一个key值
      top: 0,
    };
  },
  //父组件model传入到props的哪个字段
  model: {
    prop: 'selectVal',
    event: 'input',
  },
  props: {
    list: {
      type: Array,
      require: true,
    },
    placeholder: String,
    disabled: {
      type: String,
      default: '',
    },
    direction: String,
    showPlaceholder: {
      type: Boolean,
      default: false,
    },
    selectVal: [Number, String],
    selectkey: {
      type: Object,
      default: function() {
        return {
          label: 'label',
          value: 'value',
        };
      },
    },
    rules: {
      type: Array,
      default: function() {
        return [];
      },
    },
    defindErrType: {
      type: Number,
      default: -1,
    },
    checkCount: Number,
    type: {
      // large -> line-height: 40px, default -> line-height: 34px, large -> line-height: 26px
      type: String,
      default: 'default',
    },
    width: {
      type: Number,
    },
  },
  methods: {
    /**
     *检查是否有报错
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    isHasError() {
      return this.haveErr && !this.hideErr;
    },
    /**
     *显示下拉选择框
     * @author tomato
     * @date 2020-04-10
     * @returns
     */
    showSelect() {
      ++this.countMyself;
      if (this.disabled != 'disabled') {
        if (!this.list || this.list.length == 0) {
          //this.$emit("optionEmpty");
          return;
        }
        this.$emit('update:defindErrType', -1);
        this.isShow = true;
      }
      this.$emit('onSelect');
    },
    /**
     *选择某一选项
     * @author tomato
     * @date 2020-04-10
     * @param {*} value
     */
    selectOption(value) {
      this.selctId = value;
      this.isShow = false;
    },
    /**
     *隐藏下拉选项框
     * @author tomato
     * @date 2020-04-10
     */
    handleClose() {
      this.isShow = false;
    },
    /**
     *检查选项是否合法
     * @author tomato
     * @date 2020-04-10
     * @param {Number} newValue
     */
    checkIslegal(newValue) {
      var that = this;
      if (this.defindErrType < 0) {
        // $.each(this.rules, function(index, data) {
        this.rules.forEach(data => {
          switch (data.type) {
            //字数限制
            case 1:
              var min = data.min;
              var max = data.max;
              if (typeof min !== 'undefined' && newValue <= min.limitNum) {
                that.haveErr = true;
                that.errData = min;
              } else if (typeof max !== 'undefined' && newValue > max.limitNum) {
                that.haveErr = true;
                that.errData = max;
              } else {
                that.haveErr = false;
              }
              if (that.haveErr) {
                return false;
              }
              break;
            case 2:
              //正则表达式
              if (!data.limit.test(newValue)) {
                that.errData = data;
                that.haveErr = true;
                return false;
              }
              break;
          }
        });
        this.$emit('errorCheck', this.haveErr, this.countKey, this.errData);
      }
    },
    /**
     *移除错误
     * @author tomato
     * @date 2020-04-10
     */
    removeErr() {
      this.hideErr = true;
      this.haveErr = false;
      this.errData = null;
      this.$emit('errorCheck', this.haveErr, this.countKey, this.errData);
    },
    /**
     *更新下拉列表
     * @author tomato
     * @date 2020-04-10
     */
    updateList() {
      let isHasSelect = false;
      // this.list&&$.each(this.list,function(data){
      // 	data.isSelect = data[this.selectkey.value] == this.selctId;
      // 	if( data[this.selectkey.value] == this.selctId ){
      // 		this.showVal = data[this.selectkey.label];
      // 		isHasSelect = true;
      // 	}
      // })

      this.list &&
        this.list.forEach(data => {
          data.isSelect = data[this.selectkey.value] == this.selctId;
          if (data[this.selectkey.value] == this.selctId) {
            this.showVal = data[this.selectkey.label];
            isHasSelect = true;
          }
        });
      if (!isHasSelect) {
        this.showVal = this.placeholder;
      }
    },
    setTop: function() {
      var top;
      top = document.querySelector('.tshu_select_direction_up')?.offsetHeight;
      return top;
    },
    //todo  优化此处代码逻辑
    computeTop() {
      if (this.isShow) {
        this.$nextTick(() => {
          const children = this.$el.children[this.$el.children.length - 1];
          // const ulHeight = $(children).outerHeight();
          const ulHeight = children.offsetHeight;
          const elementHeight = this.$el.offsetHeight;
          if (typeof this.direction != 'undefined') {
            if (this.direction == 'up') {
              this.top = 'top: ' + (-ulHeight - 4) + 'px';
            } else if (this.direction == 'down') {
              this.top = 'top: ' + (elementHeight + 4) + 'px';
            }
          } else {
            const BoxHeight = window.innerHeight; //窗口
            const elementTop = this.$el.scrollTop; //元素距离顶部
            if (elementTop + elementHeight + ulHeight + 23 > BoxHeight) {
              this.top = 'top: ' + (-ulHeight - 4) + 'px';
            } else {
              this.top = 'top: ' + (elementHeight + 4) + 'px';
            }
          }
        });
      }
    },
  },
  computed: {
    //自动计算类名
    selectClass() {
      let res = '';
      if (this.isShow) {
        res = 'onselect';
      }
      if (this.haveErr && !this.hideErr) {
        res = 'errClass';
      }
      return res;
    },
    bindClass() {
      // if ($.inArray(this.direction, ['down', 'up']) > -1) {
      if (['down', 'up'].includes(this.direction)) {
        return ' tshu_select_direction_' + this.direction;
      } else {
        return ' tshu_select_direction_down';
      }
    },
    sizeClass() {
      return `tshu_select_${this.type}`;
    },
  },
  //需要等组件实例创建完成之后，才完成数据的双向绑定
  created() {
    this.selctId = this.selectVal;
    this.checkIslegal(this.selectVal);
    this.isUseSlot = this.$slots.inputButton && this.$slots.inputButton.length > 0;
  },
  watch: {
    list: function() {
      this.updateList();
    },
    isShow: function(value) {
      if (value) {
        this.computeTop();
      }
    },
    selectVal: function(value) {
      this.selctId = value;
    },
    selctId: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.updateList();
        this.checkIslegal(newVal);
        let isInarray = false;
        this.list &&
          this.list.forEach(data => {
            if (data[this.selectkey.value] == newVal) {
              isInarray = true;
            }
          });
        this.$emit('input', newVal, isInarray);
        this.$emit('change', newVal, isInarray, oldVal);
      }
    },
    checkCount: function() {
      this.hideErr = false;
      this.$emit('hideError', false, this.countKey);
    },
    countMyself: function() {
      this.hideErr = true;
      this.$emit('hideError', true, this.countKey);
    },
    defindErrType: function(value, oldVal) {
      this.haveErr = value > -1;
      if (value > -1) {
        this.errData = this.rules[value];
      } else {
        this.errData = this.rules[oldVal];
      }
      this.$emit('errorCheck', this.haveErr, this.countKey, this.errData);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 自定义弹窗内容完成 */
.tshu_select {
  position: relative;
  display: inline-block;
  cursor: pointer;
  .tanshu_err {
    position: absolute;
    top: 40px;
  }
  .tshu_select_input {
    position: relative;
    height: 40px;
    overflow: hidden;
    border-radius: 4px;
  }
}

/* turbo add */
.tshu_select.tshu_select_default .tshu_select_input,
.tshu_select.tshu_select_default .tshu_select_input .motivate {
  display: flex;
  width: 100%;
  height: 34px;
  line-height: 32px;
}
.tshu_select {
  .tshu_select_input {
    .motivate {
      height: 40px;
      padding: 0 13px;
      overflow: hidden;
      overflow: hidden;
      font-size: 14px;
      line-height: 40px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
      &.showPlaceholder {
        color: $color-b2;
      }
    }
  }
}

.tshu_select {
  .tshu_select_input {
    .motivate {
      &:hover {
        border: 1px solid $primary-color;
      }
    }
    &.onselect {
      .motivate {
        border: 1px solid $primary-color;
      }
    }
  }
}
.directSale {
  .tshu_select {
    .tshu_select_input {
      .motivate {
        &:hover {
          border: 1px solid $primary-color;
        }
      }
      &.onselect {
        .motivate {
          border: 1px solid $primary-color;
        }
      }
    }
  }
}

.tshu_select {
  .tshu_select_input {
    &:hover {
      .tshu_arrow {
        color: $color-89;
      }
    }
    &.onselect {
      .tshu_arrow {
        color: $color-89;
      }
    }
    .motivate {
      &.isDisabled {
        cursor: not-allowed !important;
        background: #f6f6f6 !important;
        border: 1px solid $border-disabled-color !important;
      }
    }
    &.errClass {
      .motivate {
        border: 1px solid $error-color;
        &:hover {
          border: 1px solid $error-color;
        }
      }
    }
    .tshu_arrow {
      position: absolute;
      top: 50%;
      right: 12px;
      z-index: $zindex-base;

      /* turbo modify */
      width: 14px;
      height: 8px;
      margin-right: 0;
      color: $color-b2;
      transform: translate(0%, -50%);
    }
  }
  &.tshu_select_default {
    .tshu_select_input {
      .tshu_arrow {
        width: 10px;
        height: 6px;
      }
    }
    .motivate {
      height: 34px;
      line-height: 34px;
    }
  }
  .tshu_select_option {
    position: absolute;
    top: 44px;
    left: 0;
    z-index: $zindex-base + 3; // 覆盖fixed table cell 3
    width: 100%;
    max-height: 160px;
    padding: 8px 0;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid $border-color;
    border-radius: 4px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    li {
      height: 36px;
      padding: 0 20px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      line-height: 36px;
      color: $color-53;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}

/* turbo add */
.tshu_select .tshu_select_option li.select,
.tshu_select .tshu_select_option li:hover {
  background: #f6f6f6;
}
</style>

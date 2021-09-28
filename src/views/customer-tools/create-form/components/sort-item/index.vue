<!--
 * @Author       : ADI
 * @Date         : 2021-07-01 09:41:41
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-01 16:47:24
-->
<template>
  <div class="createForm-sortItem flex flex-vc" :class="{ setOptions: !isDragType }">
    <div class="menu-icon" v-if="isDragType"></div>
    <el-input
      v-if="isDragType"
      class="createForm-elInput isDragType"
      :placeholder="placeholderText"
      v-model="name"
      maxlength="15"
    >
      <i
        v-if="[5, 6].includes(item.formItemType)"
        slot="suffix"
        class="el-input__icon el-icon-edit-outline setOptionIcon"
        :class="{ mainColor: item.optionFlag !== '可以' }"
        @mousedown.stop=""
        @mouseup="setOption($event)"
      >
      </i>
      <template slot="prepend" v-if="item.typeText">{{ item.typeText }}</template>
    </el-input>
    <slot v-if="[5, 6].includes(item.formItemType)" name="checkOption"> </slot>
    <el-input
      v-if="!isDragType"
      class="createForm-elInput"
      :placeholder="placeholderText"
      :value="item"
      :autofocus="true"
      @input="setOptionData"
      maxlength="15"
    >
    </el-input>
    <div v-if="isDragType" class="buttomWrap" @mousedown.stop="" @mouseup="handleChange($event, 'update')">
      <el-checkbox :value="item.required">必填</el-checkbox>
    </div>
    <div v-if="isShowDel(item)" class="deleteWrap" @mousedown.stop="" @mouseup="handleChange($event, 'delete')">
      <global-ts-svg-icon class="icon icon_16 createForm-deleteIcom" name="icon-shanchu1616"></global-ts-svg-icon>
    </div>
    <div class="menu-icon dragOption" v-if="!isDragType"></div>
  </div>
</template>

<script>
import { ElementMixin } from 'vue-slicksort';
import { Checkbox, Input } from 'element-ui';

export default {
  name: 'sort-item',
  mixins: [ElementMixin],
  components: { [Checkbox.name]: Checkbox, [Input.name]: Input },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: -1,
    },
    item: {
      type: [Object, String], // Object 用于常规的拖拽, String 用于单选多选的选项
      require: true,
    },
    greyDelIcon: {
      // 是否置灰删除按钮
      type: Boolean,
      require: true,
    },
    dragType: {
      // 类型
      type: String,
      default: 'drag',
    },
  },
  data() {
    return {
      name: this.item.name,
    };
  },
  computed: {
    greyClass() {
      return this.greyDelIcon ? 'greyClass' : '';
    },
    isDragType() {
      return this.dragType === 'drag';
    },
    placeholderText() {
      let text = '请输入名称';
      if (!this.isDragType) {
        text = '请输入选项，最多15个字';
      }
      return text;
    },
  },
  watch: {
    name(newValue) {
      this.$emit(
        'changeItemData',
        {
          ...this.item,
          name: newValue,
        },
        this.index,
      );
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 点击必选/删除按钮执行的方法
     * @author enson
     * @date 2020-05-13
     * @param {*} e - 事件
     * @param {*} type - 对数据的操作
     * @returns
     */
    handleChange(e, type) {
      if (!this.checkClick(e)) return;
      switch (type) {
        case 'update': // 点击必选
          console.log(this.item.required);
          // this.item.required = !this.item.required; // old
          this.$emit(
            'changeItemData',
            {
              ...this.item,
              required: !this.item.required,
            },
            this.index,
          ); // adi fix
          console.log('点击必选', this.item.required);
          break;
        case 'delete': // 点击删除
          if (this.greyDelIcon) {
            return;
          }
          break;
      }
      this.$emit('handleChange', this.item, type);
      this.$emit('changeOptions', this.index, type);
    },
    /**
     * @description 单选/多选输入框点击选项后执行的方法
     * @author enson
     * @date 2020-05-25
     * @param {*} e - event
     */
    setOption(e) {
      if (!this.checkClick(e)) return;
      this.$emit('showDialog', this.item, this.index);
    },
    /**
     * @description 检查是否是鼠标左键点击后松开
     * @author enson
     * @date 2020-05-13
     * @param {*} e - event
     * @returns
     */
    checkClick(e) {
      /*
						click事件的条件是按下并松开鼠标左键！，按下并松开鼠标右键并不会触发click事件
						因为点击事件只监听鼠标的左键不监听右键，因此这里做了一个区分
						button： 返回当事件被触发时，哪个鼠标按钮被点击。
							0|规定鼠标左键
							1|规定鼠标中键
							2|规定鼠标右键
						*/
      if (e && e.button !== 0) return false;
      return true;
    },
    /**
     * @description 设置单选/多选的选项的值
     * @author enson
     * @date 2020-05-30
     * @param {*} value - 选项的值
     */
    setOptionData(value) {
      console.log('e---------', this.item, value);
      this.$emit('updateOptions', this.index, value);
    },
    /**
     * @description 是否展示删除按钮
     * @author enson
     * @date 2020-06-04
     */
    isShowDel(item) {
      return !this.isEdit || !item.id || item.showDelBtn;
    },
  },
};
</script>

<style lang="scss" scoped>
.createForm-sortItem {
  position: relative;
  padding: 8px 12px;
  background-color: #d3e4fd;
  border-radius: 4px;
  box-sizing: border-box;
  &.setOptions {
    position: relative;
    z-index: 9999;
    padding: 0;
    padding-right: 12px;
    .createForm-elInput {
      width: calc(100% - 59px);
    }
  }
  .menu-icon {
    width: 16px;
    height: 2px;
    min-width: 16px;
    padding: 5px 0;
    margin-right: 12px;
    cursor: move;
    background: $color-b2;
    border-top: 2px solid $color-b2;
    border-bottom: 2px solid $color-b2;
    background-clip: content-box;
    &.dragOption {
      margin-right: 0;
      margin-left: 12px;
    }
  }
  .createForm-elInput {
    width: calc(100% - 118px);
    .setOptionIcon {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .buttomWrap {
    margin-left: 12px;
  }
  .deleteWrap {
    margin-left: 12px;
    cursor: pointer;
    &:hover {
      .createForm-deleteIcom {
        color: $color-53;
        &.greyClass {
          color: $border-disabled-color;
        }
      }
    }
    .createForm-deleteIcom {
      margin-right: 0;
      font-size: 16px;
      color: $color-b2;
    }
    .greyClass {
      color: $border-disabled-color;
      pointer-events: none;
    }
  }
  .tanshu_input_contain {
    height: 34px;
  }
  .hidePicture {
    &.checkOption {
      position: absolute;
      top: 0;
      right: 140px;
      bottom: 0;
      width: 100px;
      margin: auto;
      .tanshu_err {
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}
.createForm {
  .createForm-sortItem {
    background-color: transparent;
  }
  .drag-wrap {
    .createForm-sortItem {
      &:hover {
        background: #f5f7fa;
      }
    }
  }
}
</style>

<style lang="scss">
.createForm-sortItem {
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
    transition: none;
    &::after {
      top: 2px;
      left: 5px;
      height: 8px;
      transition: none;
    }
  }
  .createForm-elInput {
    .el-input-group__prepend {
      width: 80px;
      padding: 0 12px;
      color: $color-53;
    }
  }
  .buttomWrap {
    .el-checkbox__label {
      padding-left: 8px;
      font-size: 14px;
      color: $color-53;
    }
  }
  .el-checkbox__input {
    &.is-checked {
      & + .el-checkbox__label {
        color: $color-53;
      }
    }
  }
  .el-input-group__prepend {
    cursor: move;
  }
  .el-input__inner {
    height: 34px;
    padding: 0 10px;
  }
  .hidePicture {
    &.checkOption {
      .el-input__inner {
        width: 100px !important;
        height: 0 !important;
        margin-top: -20px;
        border: 0 none !important;
      }
    }
  }
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:52:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 09:34:38
-->
<template>
  <div class="tanshuFiledInput flex flex-vc" :class="{ setOptions: dragType == 2 }">
    <div class="menu-icon" v-if="menusPosition === 'left'"></div>
    <el-input
      v-model="name"
      v-if="dragType == 1"
      class="elInput isDragType"
      :placeholder="placeholderText"
      maxlength="15"
    >
      <i
        v-if="isShowEdit"
        slot="suffix"
        class="el-input__icon el-icon-edit-outline setOptionIcon"
        :class="{ mainColor: item.optionFlag !== '可以' }"
        @mousedown.stop=""
        @mouseup="setOption($event)"
      >
      </i>
      <template slot="prepend" v-if="item.typeText">{{ item.typeText }}</template>
    </el-input>
    <global-ts-error class="hidePicture checkOption" v-if="checkError">
      <template v-slot:errorTips>{{ errorTip }}</template>
    </global-ts-error>
    <el-input
      v-if="dragType == 2"
      class="elInput"
      :placeholder="placeholderText"
      :value="item"
      :autofocus="true"
      @input="setOptionData"
      maxlength="maxlength"
    >
    </el-input>
    <div v-if="isShowRequired" class="buttomWrap" @mousedown.stop="" @mouseup="handleChange($event, 'update')">
      <el-checkbox :value="item.required">必选</el-checkbox>
    </div>
    <div v-if="isShowDel" class="deleteWrap" @mousedown.stop="" @mouseup="handleChange($event, 'delete')">
      <global-ts-tool-tips
        offset="10"
        class="item"
        effect="dark"
        v-if="deleteTips"
        :content="deleteTips"
        placement="top-start"
      >
        <global-ts-svg-icon :class="greyClass" class="icon deleteIcom" name="icon-icon-10" />
      </global-ts-tool-tips>
      <global-ts-svg-icon v-else :class="greyClass" class="icon deleteIcom" name="icon-icon-10" />
    </div>
    <div class="menu-icon dragOption" v-if="menusPosition === 'right'"></div>
  </div>
</template>

<script>
// const { ElementMixin } = window.VueSlicksort;
import { ElementMixin } from 'vue-slicksort';
import { Input } from 'element-ui';

export default {
  name: 'ts-filed-input',
  data() {
    return {
      name: '',
    };
  },
  mixins: [ElementMixin],
  components: {
    [Input.name]: Input,
  },
  props: {
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
    isShowRequired: {
      //是否显示必选按钮
      type: Boolean,
      require: true,
    },
    menusPosition: {
      //显示菜单icon的位置（left,right)
      type: String,
      default: '',
    },
    isShowDel: {
      //是否显示删除按钮
      type: Boolean,
      default: true,
    },
    isShowEdit: {
      //是否显示编辑icon
      type: Boolean,
      default: false,
    },
    placeholderText: {
      type: String,
      default: '请输入选项，最多15个字',
    },
    maxlength: {
      type: Number,
      default: 15,
    },
    checkError: {
      //是否显示错误提示
      type: Boolean,
      default: false,
    },
    errorTip: {
      type: String,
      default: '请输入选项',
    },
    //1:前面带标题;2:弹窗中的选项，前面不带标题
    dragType: {
      type: Number,
      default: 1,
    },
    deleteTips: {
      type: String,
      default: '',
    },
  },
  watch: {
    'item.name': {
      handler(val) {
        this.name = val;
      },
      immediate: true,
    },
    'name'(val) {
      this.$emit('changeName', val);
    },
  },
  computed: {
    greyClass() {
      return this.greyDelIcon ? 'greyClass' : '';
    },
  },
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
          // TODO 后续业务页签迁移时处理该报错
          // eslint-disable-next-line vue/no-mutating-props
          this.item.required = !this.item.required;
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
      this.$emit('updateOptions', this.index, value);
    },
  },
};
</script>

<style lang="scss" scoped>
.tanshuFiledInput {
  position: relative;
  padding: 8px;
  background-color: transparent;
  box-sizing: border-box;
  &.setOptions {
    position: relative;
    z-index: 9999;
    padding: 0;
    .elInput {
      width: calc(100% - 59px);
    }
  }
  .menu-icon {
    width: 16px;
    height: 2px;
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
  .elInput {
    width: calc(100% - 118px);
    min-width: 444px;
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
      .deleteIcom {
        color: $error-color;
        &.greyClass {
          color: #eeeeee;
        }
      }
    }
    .deleteIcom {
      margin-top: 3px;
      font-size: 19px;
      color: $color-b2;
    }
    .greyClass {
      color: #eeeeee;
      pointer-events: none;
    }
    .icon {
      margin-right: 0;
    }
  }
  .addFont {
    font-weight: bold;
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
</style>

<style lang="scss">
.tanshuFiledInput {
  .el-input-group__prepend {
    cursor: move;
  }
  .el-input__inner {
    padding: 0 10px;
  }
  .buttomWrap {
    .el-checkbox__label {
      padding-left: 4px;
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
  .elInput {
    .el-input-group__prepend {
      width: 80px;
      padding: 0 12px;
    }
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

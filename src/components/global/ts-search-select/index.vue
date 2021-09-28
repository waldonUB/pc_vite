<template>
  <el-select
    :popper-class="searchSelectClass"
    class="ts-search-select"
    :placeholder="placeholder"
    multiple
    :multiple-limit="multiplelimit"
    v-model="valueList"
    @visible-change="resetList"
    @change="changeList"
  >
    <el-input
      class="tshu-search"
      autocomplete="off"
      v-model="keyWord"
      v-tsDebounce="[myFilter, 'input', 500]"
      placeholder="请输入搜索内容"
      suffix-icon="el-icon-search"
    >
    </el-input>
    <template slot="empty">
      <el-input
        class="tshu-search"
        autocomplete="off"
        v-model="keyWord"
        v-tsDebounce="[myFilter, 'input', 500]"
        placeholder="请输入搜索内容"
        suffix-icon="el-icon-search"
      >
      </el-input>
      <p class="ts-search-select_nothingText">暂无数据</p>
    </template>
    <el-option
      v-for="item in filterList"
      :label="item[selectkey.label]"
      :value="item[selectkey.value]"
      :key="item[selectkey.value]"
    >
    </el-option>
  </el-select>
</template>

<script>
import { Input, Select, Option } from 'element-ui';
export default {
  name: 'ts-search-select',
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  //父组件model传入到props的哪个字段
  model: {
    prop: 'selectArr',
    event: 'input',
  },
  props: {
    multiplelimit: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '请选择成员',
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectkey: {
      type: Object,
      default: function() {
        return {
          label: 'label', // 名称 - key
          value: 'value', // 值   - value
        };
      },
    },
    selectVal: {
      type: [String, Number],
      require: true,
    },
    selectArr: {
      type: [String, Number],
      require: true,
    },
    isClearSelected: {
      type: Boolean,
      default: false,
    },
    searchSelectClass: {
      // 传入的类名
      type: String,
      default: '',
    },
  },
  data() {
    return {
      keyWord: '',
      valueList: [],
      filterList: [],
    };
  },
  watch: {
    list(newVal) {
      this.filterList = this.resetFilterList();
    },
    /**
     * 新增一个方法用于第二次进来的时候清空已选择数据
     * @author waldon
     * @date 2020-06-15
     * @param {*} newVal
     */
    isClearSelected(newVal) {
      if (newVal) {
        this.valueList = [];
        this.$emit('update:isClearSelected', false);
      }
    },
  },
  methods: {
    /**
     * 使用test方法实现模糊查询
     * @author enson
     * @date 2020-04-11
     */
    myFilter() {
      if (!this.keyWord) {
        // 如果搜索词为空时 返回所有
        this.filterList = this.resetFilterList();
        return;
      }
      const reg = new RegExp(this.keyWord);
      this.filterList = this.list.filter(item => {
        return !this.checkFilterVal(item[this.selectkey.value]) && reg.test(item[this.selectkey.label]);
      });
    },
    /**
     * 下拉框显示/隐藏的回调函数
     * @author enson
     * @date 2020-04-11
     * @param {Boolean} bool - false 隐藏下拉框的回调函数 - true 显示
     */
    resetList(bool) {
      if (!bool) {
        this.keyWord = ''; // 重置
      }
      this.filterList = this.resetFilterList();
    },
    /**
     * 选中值发生变化时触发
     * @author enson
     * @date 2020-04-11
     * @param {*} value - 目前的选中值
     */
    changeList(value) {
      this.valueList = this.str2IntArr([].concat(value));
      this.$emit('input', JSON.stringify(this.valueList));
    },
    /**
     * 字符串数组转化成整型数据
     * @author enson
     * @date 2020-04-11
     * @param {*} strArr - 字符串数组
     * @returns 整型数组
     */
    str2IntArr(strArr) {
      return strArr.map(function(data) {
        return +data;
      });
    },
    resetFilterList() {
      return this.list.filter(item => {
        return !this.checkFilterVal(item[this.selectkey.value]);
      });
    },
    /**
     * @description 判断是否是过滤掉的值
     * @author enson
     * @date 2020-04-17
     * @param {*} value
     * @returns
     */
    checkFilterVal(value) {
      return [-1].includes(value);
    },
  },
  created() {
    let selectVal = this.selectVal;
    if (this.checkFilterVal(selectVal)) {
      // 全部员工默认不选择
      return;
    }
    try {
      selectVal = this.selectVal.toString().split(',');
    } catch (e) {
      console.warn(e);
    }
    this.valueList = this.str2IntArr([].concat(selectVal));
  },
};
</script>

<style lang="scss" scoped>
/* 可搜索选择框 */
.ts-search-select {
  width: 260px;
}

.tshu-search {
  padding: 8px 10px;
  box-sizing: border-box;
}
.pro_listBox .pro_line .ts-search-select {
  float: left;
  margin-right: 10px;
}

/* 可搜索选择框结束 */
</style>

<style lang="scss">
.ts-search-select {
  &.el-select {
    &:hover {
      .el-input__inner {
        border-color: $primary-color;
      }
    }
  }
  .el-tag--info {
    color: $color-00;
  }
  input {
    height: 34px;
    cursor: pointer;
  }
  .el-select__tags {
    margin-left: 3px;

    /* flex-wrap: nowrap; */
    overflow: auto;
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }
  }
}
.directSale {
  .ts-search-select {
    &.el-select {
      &:hover {
        .el-input__inner {
          border-color: #2e7af3;
        }
      }
    }
  }
}
.el-select-dropdown {
  &.is-multiple {
    .el-select-dropdown__item {
      &.selected {
        color: #ffffff;
        background-color: $primary-color;
        &.hover {
          background-color: $primary-color;
        }
      }
    }
  }
}
.directSale {
  .el-select-dropdown {
    &.is-multiple {
      .el-select-dropdown__item {
        &.selected {
          color: #ffffff;
          background-color: #2e7af3;
          &:hover {
            background-color: #2e7af3;
          }
        }
      }
    }
  }
}
.ts-search-select {
  &.el-select {
    .el-tag__close {
      &.el-icon-close {
        &:hover {
          background-color: $primary-color;
        }
      }
    }
  }
}
.directSale {
  .ts-search-select {
    &.el-select {
      .el-tag__close {
        &.el-icon-close {
          &:hover {
            background-color: #2e7af3;
          }
        }
      }
    }
  }
}
.el-upload--picture-card:hover,
.el-upload:focus {
  border-color: $primary-color;
}
.directSale .el-upload--picture-card:hover,
.directSale .el-upload:focus {
  border-color: #2e7af3;
}
.tshu-search {
  input {
    height: 34px;
  }
  .el-input__suffix {
    right: 12px;
  }
}
.ts-search-select {
  .el-input__icon {
    line-height: 34px;
    cursor: pointer;
  }
}
.ts-search-select_nothingText {
  padding-bottom: 8px;
  margin: 0;
  font-size: 14px;
  color: #999999;
  text-align: center;
}
.ts-searchTree {
  .searchTreeBox {
    height: 204px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .clearIcon {
    z-index: $zindex-base;
    cursor: pointer;
  }
  &.el-popper[x-placement^='bottom'] {
    margin-top: 4px;
  }
  &.el-popper[x-placement^='top'] {
    margin-bottom: 4px;
  }
}
</style>

<template>
  <div class="ts-drapdown" :class="bindClassStyle">
    <el-dropdown :trigger="trigger" :placement="placement" @command="handleClick" @visible-change="handleVisible">
      <slot class="el-dropdown-link" name="link"></slot>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, index) in downData" :key="index" :command="item">
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
export default {
  name: 'ts-dropdown',
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  props: {
    placement: {
      // 菜单弹出位置
      type: String,
      default: 'bottom-end',
    },
    trigger: {
      type: String,
      default: 'click',
    },
    downData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    needArrow: {
      type: Boolean,
      default: false,
    },
    bindClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    bindClassStyle() {
      let style = this.bindClass;
      if (this.needArrow) {
        style += ' noNeedArrow';
      } else {
        style += ' needArrow';
      }
      return style;
    },
  },
  methods: {
    handleClick(itemData) {
      this.$emit('handleClick', itemData);
    },
    /**
     * 判断下拉框隐藏/显示
     * @author lymn
     * @date 2020-11-10
     * @param {Boolean} isShow true则为显示,false则为隐藏
     */
    handleVisible(isShow) {
      this.$emit('handleVisible', isShow);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-drapdown {
  display: inline-block;
}
</style>
<style lang="scss">
.ts-drapdown .el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: $primary-color;
  background-color: transparent;
}
.directSale .ts-drapdown .el-dropdown-menu__item:focus,
.directSale .el-dropdown-menu__item:not(.is-disabled):hover {
  color: $primary-color;
  background-color: transparent;
}
</style>

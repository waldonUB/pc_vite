<template>
  <div :class="[bindClassStyle]">
    <fa-dropdown
      v-model="isShowMenu"
      :trigger="trigger"
      :placement="placement"
      overlayClassName="tsDropdownBtn"
      :getPopupContainer="getPopupContainer"
    >
      <div>
        <slot></slot>
      </div>
      <slot name="overlay">
        <fa-menu slot="overlay">
          <fa-menu-item
            v-for="(item, index) in downData"
            :key="index"
            class="flex flex-vc"
            @click="handleClick(item, index)"
          >
            <ts-fai-qr-popover
              v-if="item.type === 6"
              v-bind="$attrs"
              v-on="$listeners"
              trigger="click"
              placement="right-start"
              popper-class="ts-fa-popover qr-popover"
            >
              <template slot="open">
                <div class="absoluteBox"></div>
              </template>
            </ts-fai-qr-popover>
            <global-ts-svg-icon class="icon tsDropdownIcon" :name="item.iconName" v-if="item.iconName" />
            <span>{{ item.name }}</span>
          </fa-menu-item>
        </fa-menu>
      </slot>
    </fa-dropdown>
  </div>
</template>

<script>
import { Dropdown } from '@fk/faicomponent';
import TsFaiQrPopover from '@/components/base/ts-fai-qr-popover/index.vue';

export default {
  name: 'ts-dropdown-btn',
  components: {
    [Dropdown.name]: Dropdown,
    TsFaiQrPopover,
  },
  props: {
    bindClassStyle: {
      type: String,
      default: '',
    },
    trigger: {
      // 触发下拉的行为
      type: Array,
      default: () => {
        return ['click'];
      },
    },
    placement: {
      // 菜单弹出位置
      type: String,
      default: 'bottomLeft',
    },
    visible: {
      // 菜单是否显示
      type: Boolean,
      default: false,
    },
    getPopupContainer: {
      // 菜单渲染父节点。
      type: Function,
      default: () => document.body,
    },
    overlayClassName: {
      // 下拉根元素的类名称
      type: String,
      default: '',
    },
    downData: {
      // 下拉菜单列表
      type: Array,
      default: () => {
        return [];
      }, // [{name: 菜单名称, iconName: 菜单icon名称}]
    },
  },
  data() {
    return {
      isShowMenu: this.visible,
    };
  },
  methods: {
    /**
     * 点击菜单
     * @author lymn
     * @date 2021-01-05
     * @param {Object} item 菜单对象
     * @param {Number} index 菜单索引
     */
    handleClick(item, index) {
      this.$emit('handleClick', item, index);
    },
  },
  watch: {
    visible(newVal) {
      this.isShowMenu = newVal;
    },
    isShowMenu(newVal) {
      this.$emit('update:visible', newVal); // 更新visible的值
    },
  },
};
</script>

<style lang="scss" scoped>
.tsDropdownBtn .tsDropdownIcon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #898989;
  vertical-align: middle;
}
</style>
<style lang="scss">
.tsDropdownBtn {
  .fa-dropdown-menu {
    padding: 8px 0;
  }
  .fa-dropdown-menu-item {
    position: relative;
  }
  .fa-dropdown-menu-item,
  .fa-dropdown-menu-submenu-title {
    padding: 8px 12px;
    line-height: 19px;
  }
  .fa-dropdown-menu-item:hover,
  .fa-dropdown-menu-submenu-title:hover {
    background: #f5f7fa;
  }
  .fa-dropdown-menu-item .absoluteBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
</style>

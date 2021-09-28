<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 15:57:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-06 14:30:35
-->
<template>
  <div class="wxWorkTag sortItem" :class="tagClassCal">
    <div v-if="withIcon" class="withIcon" :class="withIconClassCal" @mousedown="operateTag">
      <i :class="'el-icon ' + iconCal"></i>
    </div>
    <span class="tagText"><slot></slot></span>
  </div>
</template>

<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort';

export default {
  name: 'SortableItem',
  mixins: [ElementMixin],
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
    item: {
      type: Object,
      default: () => {
        return {};
      },
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
    operateTag(e) {
      this.$emit('operateTag', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkTag {
  &.sortItem {
    &.selected {
      cursor: move;
      user-select: none;
      .withIcon {
        cursor: pointer;
      }
    }
  }
}
</style>

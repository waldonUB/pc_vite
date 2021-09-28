<template>
  <div :class="['paginationWrapper', { withMargin: withMargin }]">
    <fa-pagination
      :pageSizeOptions="pageSizeOptionsCal"
      :total="pageOptionCal.total"
      :showSizeChanger="showSizeChanger"
      :pageSize="pageOptionCal.limit"
      v-model="currentPage"
      @change="changePage(arguments, 'page')"
      @showSizeChange="changePage(arguments, 'size')"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value !== selectTotal">{{ props.value }}条/页</span>
        <span v-else>全部</span>
      </template>
    </fa-pagination>
  </div>
</template>

<script>
import config from './config';

export default {
  name: 'ts-fai-pagination',
  props: {
    pageOption: {
      type: Object,
      required: true,
      default: () => config.pageOption,
    },
    pageSizeOptions: {
      type: Array,
      default: () => {
        return config.pageSizeOptions;
      },
    },
    withMargin: {
      type: Boolean,
      default: true,
    },
    showSizeChanger: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    /**
     * @description : 这里的分页参数跟pc原先的保持一致
     * @author      : ADI
     * @Date        : 2021-04-29 14:54:57
     * @param        {*}
     * @return       {Object} - 分页参数
     */
    pageOptionCal() {
      return { ...config.pageOption, ...this.pageOption };
    },
    /**
     * @description : 分页“全部”的总数
     * @author      : ADI
     * @Date        : 2021-04-29 15:20:46
     * @Return       {String}
     */
    selectTotal() {
      let _selectTotal = String(this.pageOption.total);
      if (this.pageSizeOptions.includes(_selectTotal)) {
        // 避免和原有的分页数冲突
        _selectTotal = String(this.pageOption.total + 1);
      }
      return _selectTotal;
    },
    /**
     * 这里的分页参数跟pc原先的保持一致
     * @author waldon
     * @date 2020/10/21
     * @LastEditors  : ADI
     * @LastEditTime : 2021-04-29 14:56:05
     * @returns {Object} - 分页参数
     */
    pageSizeOptionsCal() {
      return this.pageSizeOptions.concat([this.selectTotal]);
    },
  },
  watch: {
    pageOptionCal: {
      handler(newVal) {
        if (this.currentPage && newVal.pageNow && this.currentPage != newVal.pageNow) {
          // 更新当前选中页码
          this.currentPage = newVal.pageNow;
          this.$emit('changePage', 1);
          this.$emit('change-page', 1); // 兼容HTML模板 https://cn.vuejs.org/v2/guide/components-custom-events.html
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * 改变每页条数回调
     * @author waldon
     * @date 2020/10/21
     * @param {Number} current -
     * @param {Number} pageSize -
     */
    onShowSizeChange(current, pageSize) {
      const pages = {
        pageNow: 1,
        limit: pageSize,
      };
      this.$emit('update:pageOption', { ...this.pageOption, ...pages });
    },
    /**
     * 改变页码/每页条数回调
     * @author waldon
     * @date 2020/10/21
     * @param {Array} args -
     * @param {String} type - 改变类型 1. page 页码 2. size 每页条数
     */
    changePage(args, type) {
      this.currentPage = type === 'page' ? args[0] : 1;
      const pages = {
        pageNow: this.currentPage,
        limit: args[1],
      };
      this.$emit('update:pageOption', { ...this.pageOption, ...pages });
      // 改变分页的回调只需要重新查询列表即可
      this.$emit('changePage', type);
      this.$emit('change-page', type); // 兼容HTML模板 https://cn.vuejs.org/v2/guide/components-custom-events.html
    },
  },
};
</script>

<style lang="scss" scoped>
/* 分页组件 */
.paginationWrapper {
  display: flex;
  &.withMargin {
    margin-top: 20px;
  }
}
</style>

<style lang="scss">
.paginationWrapper {
  .fa-pagination {
    margin-left: auto;
  }
  .fa-pagination-item-active {
    border-color: $primary-color;
    border-color: $primary-color;
    a {
      color: $primary-color;
      color: $primary-color;
    }
  }
  .fa-select-selection {
    &:hover {
      border-color: $primary-color;
      border-color: $primary-color;
      box-shadow: rgba(36, 122, 243, 0.2) 0 0 0 2px;
    }
  }
}
.paginationWrapper .fa-pagination-item:focus a,
.paginationWrapper .fa-pagination-item:hover a {
  color: $primary-color;
  color: $primary-color;
}
.paginationWrapper .fa-pagination-item:focus,
.paginationWrapper .fa-pagination-item:hover {
  border-color: $primary-color;
  border-color: $primary-color;
}
.paginationWrapper .fa-pagination-prev:focus .fa-pagination-item-link,
.paginationWrapper .fa-pagination-next:focus .fa-pagination-item-link,
.paginationWrapper .fa-pagination-prev:hover .fa-pagination-item-link,
.paginationWrapper .fa-pagination-next:hover .fa-pagination-item-link {
  color: $primary-color;
  color: $primary-color;
  border-color: $primary-color;
  border-color: $primary-color;
}
.paginationWrapper .fa-pagination-prev:hover a,
.paginationWrapper .fa-pagination-next:hover a {
  border-color: $primary-color;
  border-color: $primary-color;
  border-color: $primary-color;
}
.paginationWrapper .fa-select-focused .fa-select-selection,
.paginationWrapper .fa-select-selection:focus,
.paginationWrapper .fa-select-selection:active {
  border-color: $primary-color;
  border-color: $primary-color;
}
</style>

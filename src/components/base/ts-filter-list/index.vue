<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 10:33:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:35:55
-->
<template>
  <div class="tanshu-filter-list" v-if="isShow">
    <div class="filter-list">
      <div v-for="(item, index) in filterList" :key="index">
        <div class="filter-item" v-if="item.value">
          <p class="filter-item-value">{{ item.name }}：{{ item.value }}</p>
          <svg class="icon" aria-hidden="true" @click="clear(item.keys, item.id)">
            <use xlink:href="#icon-guanbi1616"></use>
          </svg>
        </div>
      </div>
      <div class="clearBtnWrap" v-if="filterList.length > 0">
        <global-ts-button class="clearBtn" type="greyText" size="small" icon="icon-shanchu1616" @click="clear">
          清空条件
        </global-ts-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-filter-list',
  components: {},
  props: {
    isShow: {
      // 是否显示
      type: Boolean,
      default: false,
    },
    filterList: {
      // 列表数据
      type: Array,
      default: () => {
        return [
          {
            id: '',
            name: '',
            keys: [],
            value: '',
          },
        ];
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    clear(keys, id) {
      this.$emit('clear', keys, id);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 封装的 tanshu-filter-list start */
.tanshu-filter-list {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 6px;
  box-sizing: border-box;
  .filter-list {
    display: flex;
    font-size: 12px;
    flex-wrap: wrap;
    .filter-item {
      display: flex;
      height: 22px;
      padding: 3px 9px 3px 6px;
      margin-top: 6px;
      margin-right: 6px;
      font-size: 12px;
      color: $color-b2;
      background-color: $background-color;
      border-radius: 4px;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      .icon {
        margin-right: 0;
        margin-left: 7px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: $color-53;
        }
      }
      .filter-item-value {
        max-width: 25em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .clearBtnWrap {
      padding-left: 6px;
      .clearBtn {
        height: 22px;
        margin-top: 6px;
      }
    }
  }
}

/* 封装的 tanshu-filter-list end */
</style>

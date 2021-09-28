<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 17:26:36
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-08 15:29:05
-->
<template>
  <div class="tanshu-transfer">
    <fa-transfer
      :dataSource="data"
      :targetKeys="targetKeys"
      :show-search="showSearch"
      :filter-option="(inputValue, item) => item.description.indexOf(inputValue) !== -1"
      :listStyle="listStyle"
      :titles="titles"
      @change="handleChange"
    >
      <template slot="children" slot-scope="{ props: { direction, selectedKeys, filteredItems }, on: { itemSelect } }">
        <global-ts-select
          class="transfer-select"
          v-if="showSelect && direction === 'left'"
          v-model="defaultSelectId"
          :list="selectList"
          :selectkey="{ label: 'name', value: 'id' }"
        >
        </global-ts-select>
        <div class="draggableWrap" :class="{ ' hasSelect': showSelect && direction === 'left' }">
          <draggable
            class="list-group"
            :disabled="direction === 'left'"
            :value="filteredItems"
            @update="dragEnd($event, filteredItems)"
          >
            <li
              v-show="filter(element, direction)"
              v-for="(element, index) in filteredItems"
              :class="{ 'list-group-item': true, 'active': isChecked(selectedKeys, element.key) }"
              :key="element.key"
            >
              <fa-checkbox
                @change="onChange(selectedKeys, element, itemSelect)"
                :checked="isChecked(selectedKeys, element.key)"
              >
                <span class="badge">{{ element.description }}</span>
              </fa-checkbox>
              <span class="arrowWrap" v-if="direction !== 'left'">
                <fa-icon
                  class="arrow-icon"
                  v-if="index !== filteredItems.length - 1"
                  type="arrow-down"
                  @click.stop="changeDragList('down', index)"
                />
                <fa-icon
                  class="arrow-icon"
                  v-if="index != 0"
                  type="arrow-up"
                  @click.stop="changeDragList('up', index)"
                />
              </span>
            </li>
          </draggable>
        </div>
      </template>
      <span slot="notFoundContent">
        暂无数据
      </span>
    </fa-transfer>
  </div>
</template>

<script>
import { Transfer, Icon } from '@fk/faicomponent';
import { postMessage, types } from '@/utils';
import draggable from 'vuedraggable';

/**
 * @description : 移动数组中的元素
 * @author      : ADI
 * @Date        : 2021-04-08 14:59:52
 * @return       {Array}
 */
function dragArr(list = [], oldIndex = 0, newIndex = 0) {
  if (oldIndex === newIndex) return list;
  const _list = [...list];
  const item = _list.splice(oldIndex, 1)[0];
  _list.splice(newIndex, 0, item);
  return _list;
}
export default {
  name: 'ts-transfer',
  components: {
    [Transfer.name]: Transfer,
    [Icon.name]: Icon,
    draggable,
  },
  props: {
    titles: {
      // 标题集合，顺序从左至右
      type: Array,
      default: () => {
        return ['全部商品', '添加商品'];
      },
    },
    targetKeys: {
      // 设置哪些项应该被选中 显示在右侧框数据的 key 集合
      type: Array,
      default: () => {
        return [];
      },
    },
    listStyle: {
      // 穿梭框的样式
      type: Object,
      default: () => {
        return {
          width: '200px',
          height: '283px',
        };
      },
    },
    showSearch: {
      // 是否展示搜索框
      type: Boolean,
      default: true,
    },
    transferKey: {
      type: Object,
      default: function() {
        return {
          key: 'key',
          title: 'title',
          description: 'description',
        };
      },
    },
    // [{key: string.isRequired,title: string.isRequired,description: string,disabled: bool}]
    sourceData: {
      // 数据源，其中的数据将会被渲染到左边一栏中, targetKeys 中指定的除外。
      type: Array,
      default: () => {
        return [];
      },
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    selectList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showItem: {
      type: Function,
      default: null,
    },
    selectId: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      data: [], // 数据源，其中的数据将会被渲染到左边一栏中, targetKeys 中指定的除外。
      defaultSelectId: this.selectId,
      selectRealId: -1,
    };
  },
  created() {
    this.initData();
  },
  watch: {
    sourceData(newVal) {
      this.initData();
    },
    defaultSelectId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectRealId = newVal;
      }
    },
  },
  methods: {
    initData() {
      const transferData = [];
      this.sourceData.forEach(item => {
        item['key'] = item[this.transferKey.key].toString();
        item['title'] = item[this.transferKey.title].toString();
        item['description'] = item[this.transferKey.description].toString();
        transferData.push(item);
      });
      this.data = transferData;
    },
    handleChange(targetKeys, direction, moveKeys) {
      if (direction === 'right') {
        // 因为公司组件是先前插入，不适用，改成向后插入
        targetKeys = targetKeys.filter(currentItem => !moveKeys.includes(currentItem));
        targetKeys = targetKeys.concat(moveKeys);
      }
      this.$emit('update:targetKeys', targetKeys);
      this.$emit('update', targetKeys);
    },
    onChange(checkedKeys, item, itemSelect) {
      const { key } = item;
      const isChecked = !this.isChecked(checkedKeys, key);
      itemSelect(key, isChecked);
    },
    isChecked(selectedKeys, eventKey) {
      return selectedKeys.indexOf(eventKey) !== -1;
    },
    /*
			* @description: 拖拽完成的回调函数
			* @author: enson
			* @date: 2020-10-13 20:16:14
			*   evt.item      //可以知道拖动的本身
				evt.to        // 可以知道拖动的目标列表
				evt.from      // 可以知道之前的列表
				evt.oldIndex  // 可以知道拖动前的位置
				evt.newIndex  // 可以知道拖动后的位置
			*/
    dragEnd(evt, list) {
      let targetKeys = list.map(item => {
        return item.key;
      });
      const { oldIndex, newIndex } = evt;
      // Move
      if ([oldIndex, newIndex].every(val => types.isNumber(val))) {
        if (oldIndex === newIndex) {
          return;
        }
        targetKeys = dragArr(targetKeys, oldIndex, newIndex);
        this.$emit('update:targetKeys', targetKeys);
        this.$emit('update', targetKeys);
      }
    },
    changeDragList(type, index) {
      if (!type) {
        postMessage({
          type: 'error',
          message: '网络错误，请刷新重试',
        });
        return;
      }
      let fromKey;
      const targetKeys = this.targetKeys;
      switch (type) {
        case 'down':
          fromKey = targetKeys[index];
          this.$set(targetKeys, index, targetKeys[index + 1]);
          this.$set(targetKeys, index + 1, fromKey);
          break;
        case 'up':
          fromKey = targetKeys[index];
          this.$set(targetKeys, index, targetKeys[index - 1]);
          this.$set(targetKeys, index - 1, fromKey);
          break;
      }

      this.$emit('update:targetKeys', targetKeys);
      this.$emit('update', targetKeys, 'changeList');
    },
    filter(item, direction) {
      if (this.showItem) {
        return this.showItem(item, this.selectRealId, direction);
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-transfer 穿梭框组件样式 start */
.tanshu-transfer {
  .draggableWrap {
    height: 176px;
    overflow: scroll;
    &.hasSelect {
      height: 144px;
    }
    .list-group {
      .list-group-item {
        height: 32px;
        font-size: 14px;
        line-height: 32px;
        color: $color-53;
        &:hover {
          background: #f6f6f6;
        }
        &.active {
          background: #e6f1ff;
        }
        .badge {
          display: inline-block;
          width: 112px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
        .arrowWrap {
          display: inline-flex;
          width: 32px;
          color: $color-b2;
          vertical-align: middle;
          justify-content: center;
          .arrow-icon {
            width: 16px;
          }
        }
      }
    }
  }
  .transfer-select {
    width: 100%;
    padding-right: 12px;
    box-sizing: border-box;
    .tshu_select_option {
      width: calc(100% - 12px);
      box-sizing: border-box;
    }
    .tshu_select_input {
      height: 32px;
      line-height: 32px;
      input {
        height: 32px;
        line-height: 32px;
      }
      div {
        &.motivate {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
.directSale {
  .tanshu-transfer {
    .draggableWrap {
      .list-group {
        .list-group-item {
          &.active {
            background: #e6f1ff;
          }
        }
      }
    }
  }
}

@-moz-document url-prefix() {
  .tanshu-transfer {
    .draggableWrap {
      .list-group {
        .list-group-item {
          .badge {
            width: 100px;
          }
        }
      }
    }
  }
}

/* tanshu-transfer 穿梭框组件样式 end */
</style>

<style lang="scss">
.tanshu-transfer .fa-checkbox-wrapper:hover .fa-checkbox-inner,
.fa-checkbox:hover .fa-checkbox-inner,
.fa-checkbox-input:focus + .fa-checkbox-inner {
  border-color: #d9d9d9;
}
.tanshu-transfer {
  .fa-transfer-customize-list {
    .fa-transfer-list-body-customize-wrapper {
      padding-right: 0;
    }
  }
  .fa-checkbox {
    & + span {
      padding-right: 3px;
    }
  }
}
</style>

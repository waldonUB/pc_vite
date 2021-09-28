<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:36:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 11:20:58
-->
<template>
  <global-ts-dialog
    class="tagSelectDialog wxCorpDialog center"
    dialog-title="选择客户标签"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    @sure="sure"
    @reset="reset"
    :with-reset-btn="true"
    :with-cancel-btn="false"
  >
    <div class="customerSelectContent">
      <div class="tagBox">
        <div class="groupName">标签组</div>
        <div class="groupName">标签</div>
      </div>
      <div class="tagBox" v-for="(item, index) of customerTagList" :key="index">
        <div class="groupName">{{ item.name }}</div>
        <div class="groupLabelBox">
          <ts-wxtag
            v-for="(subItem, index) of item.tag"
            :key="index"
            class="groupLabel"
            :type="getTagTypeClass(item, subItem)"
            @click="changeTag(item, subItem)"
          >
            {{ subItem.name }}
          </ts-wxtag>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';
import { getCorpTagListAjax } from '@/api/modules/common';

export default {
  name: 'ts-tag-select-dialog',
  components: { tsWxtag },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedTagList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      customerTagList: [],
      selectedTagContentList: [], // 所有选择标签的集合，主要是tag的子元素集合
      selectedGroupWithTagList: [], // 所有选择标签组的集合，其中tag属性包括组下的标签集合
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getCustomerTag();
      }
    },
    selectedTagList(newVal) {
      this.selectedTagContentList = newVal;
    },
  },
  methods: {
    /**
     * 获取标签组的数据集合
     * @author waldon
     * @date 2020/8/5
     */
    getGroupWithTagList() {
      this.selectedGroupWithTagList = [];
      this.selectedTagContentList.forEach(item => {
        const group = {
          id: item.groupId,
          name: item.groupName,
          tag: [item],
        };
        const findGroup = this.selectedGroupWithTagList.find(subItem => subItem.id === item.groupId);
        if (findGroup) {
          findGroup.tag.push(item);
        } else {
          this.selectedGroupWithTagList.push(group);
        }
      });
    },
    async getCustomerTag() {
      const params = {
        type: 0, // 查所有的标签
        isGetAll: true,
      };
      const [err, res] = await getCorpTagListAjax(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return err;
      }
      this.customerTagList = res.data;
    },
    reset() {
      this.selectedTagContentList = [];
    },
    sure() {
      this.getGroupWithTagList(); // 冒出去前先获取标签组结构的数据
      this.$emit('getSelectedTag', this.selectedTagContentList, this.selectedGroupWithTagList);
      this.$emit('update:dialogVisible', false);
    },
    cancel() {
      this.selectedTagContentList = this.selectedTagList; // 点击取消时，重置选择的标签
      this.$emit('update:dialogVisible', false);
    },
    getTagTypeClass(group, tag) {
      const index = this.selectedTagContentList.findIndex(item => {
        return item.groupId === group.id && item.name === tag.name;
      });
      return index > -1 ? 'selected' : 'normal';
    },
    /**
     * 改变标签组中的选择标签
     * 根据分组id来判断不同的标签组
     * 2020年3月24日，标签改为多选
     * */
    changeTag(group, tag) {
      const initLength = this.selectedTagContentList.length;
      this.selectedTagContentList = this.selectedTagContentList.filter(item => item.id !== tag.id);
      if (initLength === 0 || initLength === this.selectedTagContentList.length) {
        this.selectedTagContentList.push(Object.assign({}, tag));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* start:选择客户标签对话框样式 */
.tagSelectDialog {
  .customerSelectContent {
    .tagBox {
      display: flex;
      flex-flow: row wrap;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .groupName {
        height: 26px;
        margin-right: 20px;
        overflow: hidden;
        line-height: 26px;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 0 0 5em;
      }
      .groupLabelBox {
        flex: 0 0 450px;
        display: flex;
        flex-flow: row wrap;
        .groupLabel {
          margin: 0 10px 10px 0;
        }
      }
    }
  }
}

/* end:选择客户标签对话框样式 */
</style>

<style lang="scss">
/* 企微对话框样式 */
.wxCorpDialog {
  &.center {
    &.el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 !important;
      }
    }
  }
  .el-dialog__body {
    max-height: 70vh;
    overflow: auto;
    overflow-y: overlay;
    .uploadBtn_hidden {
      display: none;
    }
  }
}
.directSale .tagSelectDialog .el-dialog__headerbtn:focus .el-dialog__close,
.directSale .tagSelectDialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: $primary-color;
}
</style>

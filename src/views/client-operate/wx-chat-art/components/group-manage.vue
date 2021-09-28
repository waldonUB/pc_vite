<!--
 * @Description  : 分组管理
 * @Author       : turbo
 * @Date         : 2021-07-28 16:39:27
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 11:44:30
-->

<template>
  <div class="group-manage">
    <global-ts-header>
      <template #leftPart>
        <global-ts-tabguide no-margin @backToPrePage="$emit('backToPrePage')">
          <template #leftPart>话术库</template>
          <template #rightPart>分组管理</template>
        </global-ts-tabguide>
      </template>
      <template #rightPart>
        <global-ts-button type="primary" size="small" icon="icon-icon-11" @click="editGroup()">
          添加分组
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="tip">此处的分组排序与企业微信聊天工具栏排列顺序保持一致</div>
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        row-class-name="tree-row"
        cell-class-name="cellStyle"
        :data="groupTagParentList"
        @row-click="groupRowClick"
      >
        <el-table-column label="分组名称" prop="name" min-width="360px" class-name="group-tree"></el-table-column>
        <el-table-column label="排序" min-width="360px">
          <template slot-scope="scope">
            <span v-if="!scope.row.noShowUp" class="sort-icon" @click="removeClassify(scope.row, 'up')">
              <global-ts-svg-icon name="icon-shangyi1616" :size="16"></global-ts-svg-icon>
            </span>
            <span v-if="!scope.row.noShowDown" class="sort-icon" @click="removeClassify(scope.row, 'down')">
              <global-ts-svg-icon name="icon-xiayi1616" :size="16"></global-ts-svg-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="360px">
          <template slot-scope="scope">
            <span class="text_but1" @click="editGroup(scope.row)">编辑</span>
            <span class="text_but1" @click="deleteGroupTag(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-group-dialog
      :group-type="groupType"
      :group-tag-parent-list="groupTagParentList"
      :group-info="groupInfo"
      :dialog-visible.sync="editGroupDialogVisible"
    ></edit-group-dialog>
  </div>
</template>

<script>
// components
import EditGroupDialog from './edit-group-dialog.vue';

// utils
import { confirm } from '@/utils';

// api
import { settingCenter } from '@/api';

export default {
  name: 'GroupManage',
  components: { EditGroupDialog },
  props: {
    groupType: {
      type: Number,
    },
    groupTagList: {
      type: Array,
      required: true,
      default: () => [],
    },
    groupTagParentList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      form: {},
      groupInfo: {},
      editGroupDialogVisible: false,
    };
  },
  methods: {
    groupRowClick(row, column) {
      if (column?.property === 'name') {
        this.$refs.sortTable.toggleRowExpansion(row);
      }
    },
    /**
     * 上移或下移操作
     * @author waldon
     * @date 2020-04-19
     * @param {number} row - 移位的分类
     * @param {string} type - 移位的类型, up - 上移, down - 下移
     */
    async removeClassify(row, type) {
      let swapItem = null;
      const swapList = this.groupTagList.filter(item => item.parentId === row.parentId);
      if (type === 'up') {
        swapItem = swapList.reverse().find(item => item.sort > row.sort);
      } else {
        swapItem = swapList.find(item => item.sort < row.sort);
      }
      if (!swapItem) {
        return;
      }

      const { updateSort } = settingCenter;
      const [err, res] = await updateSort({
        id: row.id,
        swapId: swapItem.id,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      !err && this.$emit('getGroupTagList', this.groupType, true);
    },
    editGroup(row = {}) {
      this.groupInfo = row;
      this.editGroupDialogVisible = true;
    },
    /**
     * 删除分组标签
     * @param {number} id - 标签id
     * @author waldon
     * @date 2020/4/10
     */
    deleteGroupTag(id) {
      confirm('删除分组后，该分组的素材将归入“未分组”中，确认删除吗？').then(async () => {
        const { delTsGroup } = settingCenter;
        const [err, res] = await delTsGroup({ id });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : res.msg,
        });
        !err && this.$emit('getGroupTagList', this.groupType, true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-manage {
  .tip {
    margin-bottom: 20px;
    color: $color-53;
  }
}
</style>

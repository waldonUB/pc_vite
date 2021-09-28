<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:53:51
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-22 09:53:06
-->
<template>
  <global-ts-dialog
    class="groupManagerDialog wxCorpDialog center"
    :dialog-title="manageText + '管理'"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    :withFooter="false"
  >
    <global-ts-dialog
      class="addGroupDialog"
      :dialog-title="groupTagDialogName"
      :dialog-visible.sync="innerDialogVisible"
      :lock-dialog-body-height="false"
      dialog-size="medium"
      @cancel="cancelAddGroupTag"
      @sure="saveGroupTag"
    >
      <div class="addGroupTagContent">
        <div class="item" v-if="groupType == 1 || groupType == 5">
          <p class="groupTagName">上级{{ manageText }}</p>
          <global-ts-select
            type="large"
            v-model="currentTagGroupInfo.parentId"
            :list="groupDropDownList"
            :selectkey="{ label: 'name', value: 'id' }"
            :disabled="currentTagGroupInfo.children && currentTagGroupInfo.children.length > 0 ? 'disabled' : ''"
          ></global-ts-select>
        </div>
        <!--
                     -->
        <div class="item">
          <p class="groupTagName">{{ manageText }}名称</p>
          <global-ts-input
            :maxLength="15"
            tstype="text"
            v-model="currentTagGroupInfo.name"
            :placeholder="'请输入' + manageText + '名称'"
          >
          </global-ts-input>
        </div>
      </div>
    </global-ts-dialog>
    <div class="groupManagerContent">
      <global-ts-button class="addGroupTagBtn" type="primary" size="small" @click="addGroupTag">
        添加
      </global-ts-button>
      <el-table
        :data="groupType == 1 || groupType == 5 ? groupTagParentList : groupTagList"
        :row-key="row => row.id"
        :expand-row-keys="expands"
        border
        header-row-class-name="employeeHeader"
        :indent="0"
        width="100%"
        cell-class-name="cellStyle"
        :fit="true"
      >
        <el-table-column prop="name" :label="manageText + '名称'" min-width="400px"> </el-table-column>
        <el-table-column label="操作" min-width="104px" cell-class-name="editList">
          <template slot-scope="scope">
            <div class="bottomBar">
              <global-ts-button class="text_but1 em_edit" type="default" size="mini" @click="editGroupTag(scope.row)">
                修改
              </global-ts-button>
              <global-ts-button
                class="text_but1 em_delete"
                type="default"
                size="mini"
                @click="deleteGroupTag(scope.row.id)"
              >
                删除
              </global-ts-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </global-ts-dialog>
</template>

<script>
import { post, postMessage, confirm } from '@/utils';
import { Table, TableColumn } from 'element-ui';
import { delTsGroup } from '@/api/modules/component/group-manager-dialog';

export default {
  name: 'ts-group-manager-dialog',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  created() {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    groupTagList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    // 一级分组 parentId = 0
    groupTagParentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 分组类型 1.企业话术 2.图片素材 3.文件素材 5.我的话术
    groupType: {
      type: Number,
      // required: true,
      default: 0,
    },
    manageType: {
      type: Number, // 管理类型 1.分组 2.文件夹
      default: 1,
    },
  },
  data() {
    return {
      innerDialogVisible: false, // 添加分组弹窗，嵌套在分组管理中
      tagGroupUrlList: [
        '/ajax/comm/tsGroup_h.jsp?cmd=addTsGroup', // 新增
        '/ajax/comm/tsGroup_h.jsp?cmd=setTsGroup', // 编辑
      ],
      currentSaveTagGroupUrl: '', // 当前保存分组的url
      currentTagGroupInfo: {
        // 当前保存分组的信息
        id: '',
        parentId: 0,
        name: '',
        type: this.groupType,
        children: [],
      },
      expands: [],
    };
  },
  computed: {
    /**
     * 对话框名字
     * @author waldon
     * @date 2020/4/10
     * @returns {*} 对话框名字
     */
    groupTagDialogName() {
      return this.currentSaveTagGroupUrl === this.tagGroupUrlList[0]
        ? '添加' + this.manageText
        : '修改' + this.manageText;
    },
    /**
     * 分组下拉列表
     * @author turbo
     * @date 2020/10/21
     * @returns {Array} 分组下拉列表
     */
    groupDropDownList() {
      return [
        { id: 0, name: '无' },
        ...this.groupTagParentList.filter(item => item.id !== this.currentTagGroupInfo.id),
      ];
    },
    /**
     * 区分文件夹和分组的文案
     * @author lymn
     * @date 2020-10-22
     * @returns {String} 文案
     */
    manageText() {
      return this.manageType == 1 ? '分组' : '文件夹';
    },
  },
  methods: {
    /**
     * 保存标签组
     * @author waldon
     * @date 2020/4/10
     */
    saveGroupTag() {
      if (this.currentTagGroupInfo.name) {
        post(this.currentSaveTagGroupUrl, this.currentTagGroupInfo).then(res => {
          if (res && res.success) {
            this.cancelAddGroupTag();
            this.initGroupTagForm();
            this.$parent.$parent.getGroupTagList(this.groupType);
            this.$emit('updateGroupTagList');
            postMessage({
              type: 'success',
              message: res.msg,
            });
          } else {
            postMessage({
              type: 'error',
              message: res.msg || '网络错误，请稍候重试',
            });
          }
        });
      } else {
        postMessage({
          type: 'error',
          message: '请输入分组名称',
        });
      }
    },
    /**
     * 初始化表单
     * @author waldon
     * @date 2020/4/10
     */
    initGroupTagForm() {
      this.currentTagGroupInfo = {
        // 当前保存分组的信息
        id: '',
        parentId: 0,
        name: '',
        type: this.groupType,
        children: [],
      };
    },
    /**
     * 添加标签
     * @author waldon
     * @date 2020/4/10
     */
    addGroupTag() {
      this.innerDialogVisible = true;
      this.currentSaveTagGroupUrl = this.tagGroupUrlList[0];
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/4/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
      this.expands = []; // 重置默认展开项
    },
    /**
     * 取消内联对话框
     * @author waldon
     * @date 2020/4/10
     */
    cancelAddGroupTag() {
      this.innerDialogVisible = false;
      this.initGroupTagForm();
    },
    /**
     * 编辑分组标签
     * @param {Object} tag - 标签信息
     * @author waldon
     * @date 2020/4/10
     * @Last Modified by: turbo
     * @Last Modified time: 2020-10-22
     * */
    editGroupTag(tag) {
      tag.parentId > 0 && this.expands.push(tag.parentId + '');
      this.innerDialogVisible = true;
      this.currentTagGroupInfo = {
        ...tag,
      };
      this.groupTagName = tag.name;
      this.currentSaveTagGroupUrl = this.tagGroupUrlList[1];
    },
    /**
     * 删除分组标签
     * @param {number} id - 标签id
     * @author waldon
     * @date 2020/4/10
     * */
    deleteGroupTag(id) {
      const confirmText = `删除${this.manageText}后，该${this.manageText}的素材将归入“未分组”中，确认删除吗？`;
      confirm(confirmText).then(async () => {
        const [err, res] = await delTsGroup({
          id,
        });
        if (err) {
          postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return err;
        }
        this.$emit('deleteGroupSuccess');
        this.$emit('updateGroupTagList');
        this.$parent.$parent.getGroupTagList(this.groupType);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.addGroupDialog {
  .addGroupTagContent {
    .item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .groupTagName {
      margin-bottom: 15px;
    }
    .tshu_select {
      width: 100%;
    }
  }
}
</style>

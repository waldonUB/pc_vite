<!--
 * @Description  : 同步任务列表
 * @Author       : turbo
 * @Date         : 2021-07-23 10:02:44
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-23 18:11:50
-->

<template>
  <div class="task-list">
    <global-ts-header>
      <template #leftPart>
        同步任务管理
        <div class="redTip">*该功能仅限专用版开放使用</div>
      </template>
      <template #rightPart>
        <global-ts-button ref="addButton" type="primary" size="small" icon="icon-icon-11" @click="openAddBox">
          添加上传任务
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="taskList">
        <el-table-column label="序号" prop="id" min-width="50px"></el-table-column>
        <el-table-column label="上传人" prop="staffName" min-width="80px"></el-table-column>
        <el-table-column label="上传时间" prop="timeName" min-width="150px"></el-table-column>
        <el-table-column label="文件名" prop="fileName" min-width="170px"></el-table-column>
        <el-table-column label="任务类型" prop="typeName" min-width="60px"></el-table-column>
        <el-table-column label="状态" prop="statusName" min-width="210px"></el-table-column>
        <el-table-column label="结束时间" prop="doneTimeName" min-width="150px"></el-table-column>
        <el-table-column label="操作" min-width="55px">
          <template slot-scope="scope">
            <span class="text_but1" @click="showResult(scope.row.id)">详细</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :table-data="taskList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        @getData="changeTable"
      ></global-ts-pagination>
    </div>
    <add-task-bubble
      :is-show.sync="isShowAddTaskBubble"
      :link-target="linkTarget"
      @sure="reloadTable"
    ></add-task-bubble>
  </div>
</template>

<script>
// components
import AddTaskBubble from './add-task-bubble.vue';

export default {
  name: 'TaskList',
  components: { AddTaskBubble },
  data() {
    return {
      isReload: false,
      ajaxUrl: '/rest/manage/uploadTask/getTaskList',
      taskList: [],
      linkTarget: {},
      isShowAddTaskBubble: false,
    };
  },
  methods: {
    changeTable(data) {
      this.taskList = data;
    },
    openAddBox() {
      this.linkTarget = {
        target: this.$refs.addButton.$el,
        position: 'right',
      };
      this.isShowAddTaskBubble = true;
    },
    showResult(taskId) {
      this.$pubsub.one('toTaskDetail', fn => {
        fn(taskId);
      });
      this.$emit('toTaskDetail');
    },
    reloadTable() {
      this.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>

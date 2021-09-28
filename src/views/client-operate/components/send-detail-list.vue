<!--
 * @Description  : 成员群发明细列表
 * @Author       : turbo
 * @Date         : 2021-08-02 17:08:39
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 16:42:37
-->

<template>
  <div class="send-detail-list">
    <div class="search-box">
      <div class="left">
        <global-ts-select-click
          :placeholder="`选择${this.sendName}`"
          :select-list-str="requestParam.selectDeptStr"
          @clickHandle="orgSelectDialogVisible = true"
        ></global-ts-select-click>
        <global-ts-fai-select
          select-class="width_220"
          :list="statusList"
          v-model="requestParam.status"
          @change="reloadTable"
        ></global-ts-fai-select>
        <global-ts-button type="greyText" size="small" icon="icon-zhongzhi1616" @click="reset">
          重置
        </global-ts-button>
        <global-ts-button type="greyText" size="small" icon="icon-daochu1616" @click="exportExcel">
          导出
        </global-ts-button>
      </div>
      <global-ts-button
        v-if="msgTaskInfo.isCanRemind"
        type="primary"
        size="small"
        icon="icon-icon-11"
        @click="sendMsgInform(taskId)"
      >
        提醒群发
      </global-ts-button>
    </div>
    <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="sendDetailList">
      <el-table-column :label="sendName" min-width="150px">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" class="head-img" :src="scope.row.avatar" />
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="群发状态"
        prop="statusName"
        :min-width="chatType === 0 ? '150px' : '100px'"
      ></el-table-column>
      <el-table-column label="需要群发" prop="total" :min-width="chatType === 0 ? '150px' : '100px'"></el-table-column>
      <el-table-column label="群发成功" :min-width="chatType === 0 ? '150px' : '100px'">
        <template slot-scope="scope">
          <div v-if="chatType === 0">
            <span v-if="scope.row.status > 0" class="red-text">{{ scope.row.successNum }}</span>
            <span v-else>-</span>
          </div>
          <div v-else>{{ scope.row.successNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="群发失败" :min-width="chatType === 0 ? '200px' : '100px'">
        <template #header>
          <span>群发失败</span>
          <global-ts-tool-tips offset="10" effect="dark" placement="top-start">
            <template #content>
              <div v-if="chatType === 0">
                群发失败原因：<br />
                1、每个客户每个自然月最多接收4条群发消息，超出将无法收到群发消息；<br />
                2、非好友关系，可能被客户删除
              </div>
              <div v-else>每个客户群每个自然月最多接收4条群发消息，超出将无法收到群发消息；</div>
            </template>
            <global-ts-svg-icon class="tip-icon" name="icon-wenhao1616"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </template>
        <template slot-scope="scope">
          <div v-if="chatType === 0">
            <div v-if="scope.row.status > 0">
              <div class="red-text">非好友关系：{{ scope.row.notFriendNum }}</div>
              <div class="red-text">超数量上限：{{ scope.row.notReceiveNum }}</div>
            </div>
            <span v-else>-</span>
          </div>
          <div v-else>{{ scope.row.failNum }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="chatType === 1" label="没有群发" prop="awaitNum" min-width="100">
        <template #header>
          <span>没有群发</span>
          <global-ts-tool-tips offset="10" effect="dark" placement="top-start">
            <template #content>群主在执行群发任务的时候没有实际群发的群</template>
            <global-ts-svg-icon class="tip-icon" name="icon-wenhao1616"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </template>
      </el-table-column>
      <el-table-column label="群发时间" prop="sendTimeName" min-width="180px">
        <template #header>
          <global-ts-tool-tips content="按顺序排序或按倒序排序">
            <div class="sortBar" @click="changeSortType">
              <span>群发时间</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="{ isNotActive: requestParam.desc }"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="{ isNotActive: !requestParam.desc }"
                ></global-ts-svg-icon>
              </span>
            </div>
          </global-ts-tool-tips>
        </template>
        <template slot-scope="scope">
          {{ scope.row.sendTimeName || '-' }}
        </template>
      </el-table-column>
    </el-table>
    <global-ts-pagination
      :table-data="sendDetailList"
      :httpurl="ajaxUrl"
      :is-reload.sync="isReload"
      :request-param="requestParam"
      @getData="changeTable"
    ></global-ts-pagination>
    <ts-org-select-dialog
      :selected-org-data="selectedOrgData"
      :dialog-visible.sync="orgSelectDialogVisible"
      @getSelectedData="getSelectedData"
    ></ts-org-select-dialog>
  </div>
</template>

<script>
import { merge } from 'lodash';

// components
import TsOrgSelectDialog from '@/components/base/ts-org-select-dialog/index.vue';

// utils
import { exportExcel } from '@/utils';
import { sendMsgInform } from '../utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'SendDetailList',
  components: { TsOrgSelectDialog },
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
    taskId: {
      type: Number,
    },
    msgTaskInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      requestParam: {
        id: this.taskId || 0,
        chatType: this.chatType,
        status: -1,
        userIds: '',
        departmentIds: '',
        selectDeptStr: '',
        sortKey: 'sendTime',
        desc: true,
      },
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '/rest/manage/wxwork/msg/getSendMsgDetailList',
      sendDetailList: [],
      selectedOrgData: {
        // 被选中的部门/员工
        dept: [],
        staff: [],
      },
      statusList: [],
      orgSelectDialogVisible: false,
    };
  },
  computed: {
    sendName() {
      return this.chatType === 0 ? '成员' : '群主';
    },
  },
  created() {
    this.initStatusList();
  },
  methods: {
    initStatusList() {
      this.statusList = [
        {
          name: `全部${this.sendName}`,
          id: -1,
        },
        {
          name: '未群发',
          id: 0,
        },
        {
          name: '已群发',
          id: 1,
        },
      ];
    },
    /**
     * 获取选择的数据
     * @author guoyijie
     * @date 2021/4/1
     * @param {Object} selectedData - 选择的数据
     */
    getSelectedData(selectedData) {
      const { dept, staff } = selectedData;
      const selectDeptStr = [];
      const userIds = [];
      const departmentIds = [];
      for (const item of staff) {
        selectDeptStr.push(item.name);
        userIds.push(item.userId);
      }
      for (const item of dept) {
        selectDeptStr.push(item.name);
        departmentIds.push(item.id);
      }
      this.selectedOrgData = selectedData;
      this.requestParam.userIds = userIds.join(',');
      this.requestParam.departmentIds = departmentIds.join(',');
      this.requestParam.selectDeptStr = selectDeptStr.join(',');
      this.reloadTable();
    },
    changeTable(data, res, pages) {
      this.sendDetailList = data;
      this.pages = pages;
    },
    reloadTable() {
      this.isReload = true;
    },
    reset() {
      this.requestParam = {
        id: this.taskId || 0,
        chatType: this.chatType,
        status: -1,
        userIds: '',
        departmentIds: '',
        selectDeptStr: '',
        sortKey: 'sendTime',
        desc: true,
      };
      this.selectedOrgData = {
        dept: [],
        staff: [],
      };
      this.reloadTable();
    },
    async exportExcel() {
      const { getSendMsgDetailList } = wxwork;
      const [err, res] = await getSendMsgDetailList(merge({}, { isGetAll: true }, this.requestParam));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      const keyJson = {
        userName: this.sendName,
        statusName: '群发状态',
        total: '需要群发',
        successNum: '群发成功',
        failNum: '群发失败',
        [this.chatType === 0 ? '' : 'awaitNum']: '没有群发',
        sendTimeName: '群发时间',
      };
      this.chatType === 0 &&
        list.forEach(item => {
          if (item.status > 0) {
            item.failNum = `非好友关系：${item.notFriendNum};超数量上限：${item.notReceiveNum}`;
          } else {
            item.failNum = '-';
            item.successNum = '-';
          }
        });
      exportExcel(list, `${this.sendName}群发明细`, keyJson);
    },
    sendMsgInform,
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.send-detail-list {
  .search-box {
    @include flex-between;

    margin: 20px 0;

    .left {
      @include flex-left;
    }
  }

  .head-img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border-radius: 4px;
  }

  .tip-icon {
    margin-left: 4px;
  }

  .red-text {
    color: $error-color;
  }
}
</style>

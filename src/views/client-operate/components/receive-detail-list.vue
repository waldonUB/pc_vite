<!--
 * @Description  : 客户接收明细列表
 * @Author       : turbo
 * @Date         : 2021-08-02 17:09:22
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 17:04:00
-->

<template>
  <div class="receive-detail-list">
    <div class="search-box">
      <fa-input-search
        v-model="requestParam.name"
        class="faUiSearchInput"
        allow-clear
        :placeholder="`搜索${this.receiveName}`"
        @search="reloadTable"
      >
        <template #enterButton>
          <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
        </template>
      </fa-input-search>
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
    <el-table
      ref="sortTable"
      row-key="id"
      border
      min-width="1010px"
      cell-class-name="cellStyle"
      :data="receiveDetailList"
    >
      <el-table-column :label="receiveName" min-width="150px">
        <template slot-scope="scope">
          <img v-if="scope.row.clientHeadImg" class="head-img" :src="scope.row.clientHeadImg" />
          <span>{{ scope.row[chatType === 0 ? 'clientName' : 'chatName'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="chatType === 1"
        label="建群时间"
        prop="chatCreateTimeName"
        min-width="150px"
      ></el-table-column>
      <el-table-column v-if="chatType === 1" label="群发时间" prop="sendTimeName" min-width="180px">
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
      </el-table-column>
      <el-table-column :label="sendName" :min-width="chatType === 0 ? '150px' : '100px'">
        <template slot-scope="scope">
          <img v-if="scope.row.userAvatar" class="head-img" :src="scope.row.userAvatar" />
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收状态" prop="statusName" :min-width="chatType === 0 ? '200px' : '100px'">
        <template #header>
          <span>接收状态</span>
          <global-ts-tool-tips offset="10" effect="dark" placement="top-start">
            <template #content>
              <div v-if="chatType === 0">
                接收状态<br />
                1、已收到：客户已收到群发消息；<br />
                2、非好友未收到：企业成员被客户删除，客户未收到群发消息；<br />
                3、超上限未收到：每个客户每个月最多接收4条群发消息，超出将无法收到群发消息；<br />
                4、未群发：企业成员还未执行群发任务，客户未收到消息
              </div>
              <div v-else>
                接收状态<br />
                1、已收到：客户群已收到群发消息；<br />
                2、超上限未收到：每个客户群每个自然月最多接收4条群发消息，超出将无法收到群发消息；<br />
                3、未群发：群主还未执行群发；
              </div>
            </template>
            <global-ts-svg-icon class="tip-icon" name="icon-wenhao1616"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </template>
      </el-table-column>
      <el-table-column v-if="chatType === 0" label="群发时间" prop="sendTimeName" min-width="180px">
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
      </el-table-column>
    </el-table>
    <global-ts-pagination
      :table-data="receiveDetailList"
      :httpurl="ajaxUrl"
      :is-reload.sync="isReload"
      :request-param="requestParam"
      @getData="changeTable"
    ></global-ts-pagination>
  </div>
</template>

<script>
import { merge } from 'lodash';

// utils
import { exportExcel } from '@/utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'ReceiveDetailList',
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
    taskId: {
      type: Number,
    },
  },
  data() {
    return {
      requestParam: {
        taskId: this.taskId || 0,
        chatType: this.chatType,
        status: -1,
        name: '',
        sortKey: 'sendTime',
        desc: true,
      },
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '/rest/manage/wxwork/msg/getReceiveMsgDetailList',
      receiveDetailList: [],
      statusList: [],
    };
  },
  computed: {
    sendName() {
      return this.chatType === 0 ? '成员' : '群主';
    },
    receiveName() {
      return this.chatType === 0 ? '客户' : '客户群';
    },
  },
  created() {
    this.initStatusList();
  },
  methods: {
    initStatusList() {
      this.statusList = [
        {
          name: `全部${this.receiveName}`,
          id: -1,
        },
        {
          name: '未群发',
          id: 0,
        },
        {
          name: '已收到',
          id: 1,
        },
        {
          name: '非好友未收到',
          id: 2,
        },
        {
          name: '超上限未收到',
          id: 3,
        },
      ];
      this.chatType === 1 && (this.statusList = this.statusList.filter(item => item.id !== 2));
    },
    changeTable(data, res, pages) {
      this.receiveDetailList = data;
      this.pages = pages;
    },
    reloadTable() {
      this.isReload = true;
    },
    reset() {
      this.requestParam = {
        taskId: this.taskId || 0,
        chatType: this.chatType,
        status: -1,
        name: '',
        sortKey: 'sendTime',
        desc: true,
      };
      this.reloadTable();
    },
    async exportExcel() {
      const { getReceiveMsgDetailList } = wxwork;
      const [err, res] = await getReceiveMsgDetailList(merge({}, { isGetAll: true }, this.requestParam));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      let keyJson = {};
      if (this.chatType === 0) {
        keyJson = {
          clientName: '客户',
          userName: '成员',
          statusName: '接收状态',
          sendTimeName: '群发时间',
        };
      } else {
        keyJson = {
          chatName: '客户群',
          chatCreateTimeName: '建群时间',
          sendTimeName: '群发时间',
          userName: '群主',
          statusName: '接收状态',
        };
      }

      exportExcel(res.data, `${this.receiveName}接收明细`, keyJson);
    },
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.receive-detail-list {
  .search-box {
    @include flex-left;

    margin: 20px 0;
  }

  .faUiSearchInput {
    margin-right: 10px;
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
}
</style>

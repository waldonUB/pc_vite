<!--
 * @Description  : 群详情
 * @Author       : turbo
 * @Date         : 2021-07-21 09:43:20
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-21 13:28:07
-->

<template>
  <div class="group-detail">
    <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
      <template #leftPart>客户群</template>
      <template #rightPart>群详情</template>
    </global-ts-tabguide>
    <div class="">
      <div class="group-detail__head">
        <div class="group-detail__head-left">
          <div class="group-info">
            <div class="group-img"></div>
            <div class="group-base-info">
              <div class="group-name">{{ chatInfo.name }}</div>
              <div class="group-owner">群主：{{ chatInfo.ownerName }}</div>
              <div class="group-create-time">建群：{{ chatInfo.createTimeName }}</div>
            </div>
          </div>
          <div class="group-detail">
            <div class="group-detail-item" v-for="(item, key) in groupDetails" :key="key">
              <p class="group-detail-number">{{ item.number }}</p>
              <p class="group-detail-name">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div class="group-detail__head-right">
          <div class="head">群公告</div>
          <div class="content">
            <div class="group-notice">{{ chatInfo.notice || '暂无群公告' }}</div>
          </div>
        </div>
      </div>
      <div class="pro_listBox">
        <div class="search-box">
          <div class="left">
            <fa-input-search
              v-model="requestParam.memberName"
              placeholder="搜索"
              class="faUiSearchInput"
              allow-clear
              @search="reloadTable"
            >
              <template #enterButton>
                <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
              </template>
            </fa-input-search>
            <global-ts-select
              placeholder="成员类型"
              :width="220"
              :list="clientList"
              v-model="requestParam.type"
            ></global-ts-select>
            <global-ts-select
              placeholder="是否已加好友"
              :width="220"
              :list="friendList"
              v-model="requestParam.addStatus"
            ></global-ts-select>
            <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="reloadTable">
              搜索
            </global-ts-button>
          </div>
          <global-ts-button
            class="export-btn"
            type="greyOther"
            size="small"
            icon="icon-xiazai1616"
            @click="onExportExcel"
          >
            导出
          </global-ts-button>
        </div>
        <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="memberList">
          <el-table-column label="群成员" min-width="200px">
            <template slot-scope="scope">
              <div class="group-member-cell">
                <img class="head-img" :src="scope.row.headImg" />
                {{ scope.row.name }}
                <span v-if="scope.row.corpName" :class="['label-comm', labelColor(scope.row)]">
                  {{ scope.row.corpName }}
                </span>
                <global-ts-tool-tips
                  v-if="scope.row.unKnowClient"
                  class="item"
                  offset="10"
                  effect="dark"
                  content="未添加任意企业成员为好友的群成员无法获取头像和昵称"
                  placement="top-start"
                >
                  <global-ts-svg-icon name="icon-wenhao1616" color="#898989"></global-ts-svg-icon>
                </global-ts-tool-tips>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="成员类型" prop="typeName" min-width="70px"></el-table-column>
          <el-table-column label="已加企业成员" prop="hadAddUser" min-width="80px"></el-table-column>
          <el-table-column label="进群方式" prop="joinSceneName" min-width="80px"></el-table-column>
          <el-table-column label="进群时间" prop="joinTimeName" min-width="100px">
            <template #header>
              <global-ts-tool-tips content="按顺序排序或按倒序排序">
                <div class="sortBar" @click="changeSortType">
                  <span>进群时间</span>
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
          :table-data="memberList"
          :httpurl="ajaxUrl"
          :is-reload.sync="isReload"
          :request-param="requestParam"
          @getData="changeTable"
        ></global-ts-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { merge } from 'lodash';

// utils
import { exportExcel } from '@/utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'GroupDetail',
  data() {
    return {
      requestParam: {
        chatId: '', // 群ID
        memberName: '', // 成员名称
        addStatus: '', // 是否添加成员
        type: '', // 成员类型
        sortKey: 'joinTime',
        isMyClient: false, // 和侧边栏同一个接口, 这里目前不需要用到，但要传
        isExport: false, // 是否是导出
        desc: false, // 排序类型 true - 倒序 false - 正序
      },
      clientList: [
        {
          label: '全部',
          value: '0',
        },
        {
          label: '企业成员',
          value: '1',
        },
        {
          label: '外部客户',
          value: '2',
        },
      ],
      friendList: [
        {
          label: '全部',
          value: '0',
        },
        {
          label: '已加企微好友',
          value: '1',
        },
        {
          label: '未加企微好友',
          value: '2',
        },
      ],
      chatInfo: {
        name: '', // 群名称
        ownerName: '', // 群主名称
        createTimeName: '', // 创建时间
        notice: '', // 群公告
      },
      isReload: false,
      memberList: [],
      ajaxUrl: '/rest/manage/wxwork/chatMember/getChatMemberList',
      groupDetails: {
        total: {
          name: '群人数',
          number: 0,
        },
        myFriendsTotal: {
          name: '我的好友',
          number: 0,
        },
        workmateTotal: {
          name: '我的同事',
          number: 0,
        },
        externalContactTotal: {
          name: '外部客户',
          number: 0,
        },
        todayTotal: {
          name: '今日进群',
          number: 0,
        },
        todayOutTotal: {
          name: '今日退群',
          number: 0,
        },
      },
    };
  },
  computed: {
    labelColor() {
      return function(item) {
        switch (item.type) {
          case 2: // 外部联系人
            if (item.externalType === 2) {
              // 企微
              return 'yellow';
            } else {
              // 微信
              return 'green';
            }
          default:
            return '';
        }
      };
    },
  },
  created() {
    this.$pubsub.emit('toGroupDetail', groupId => {
      this.requestParam.chatId = groupId;
      this.getGroupChatInfo();
    });
  },
  methods: {
    /**
     * @description 获取客户群信息
     * @author enson
     * @date 2021-01-28
     */
    async getGroupChatInfo() {
      const { getGroupChatInfo } = wxwork;
      const [err, res] = await getGroupChatInfo({
        chatId: this.requestParam.chatId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { chatInfo, statInfo } = res.data; // 群信息 & 统计数据
      this.chatInfo = chatInfo;
      for (const [key, value] of Object.entries(statInfo)) {
        this.groupDetails[key].number = value;
      }
    },
    changeTable(data) {
      this.memberList = data.memberList;
    },
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
    reloadTable() {
      this.isReload = true;
    },
    /**
     * @description 导出表格
     * @author enson
     * @date 2021-01-24
     */
    async onExportExcel() {
      const { getChatMemberList } = wxwork;
      const [err, res] = await getChatMemberList(merge({}, this.requestParam, { isExport: true }));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const keyJson = {
        name: '群成员',
        typeName: '成员类型',
        hadAddUser: '已加企业人员',
        joinSceneName: '进群方式',
        joinTimeName: '进群时间',
      };
      exportExcel(res.data.memberList, '群详情', keyJson);
    },
  },
};
</script>

<style lang="scss" scoped>
.group-detail {
  .group-detail__head {
    @include flex-left;

    padding: 20px;
    background-color: $color-ff;
    border-bottom: 1px solid $color-ee;
  }

  .group-detail__head-left {
    flex: 1;
    margin-right: 49px;

    .group-info {
      @include flex-left;
    }

    .group-img {
      width: 140px;
      height: 140px;
      background-image: url('~@/assets/image/groupList/introductIcon.png');
    }

    .group-base-info {
      margin-left: 16px;
      line-height: 19px;
      color: $color-53;
    }

    .group-name {
      @include ellipsis;

      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: $color-00;
    }

    .group-owner {
      margin-bottom: 12px;
    }

    .group-detail {
      @include flex-left;

      margin: 20px 0 0 10px;
    }

    .group-detail-item {
      position: relative;
      width: 80px;
      padding: 0 20px;
      text-align: center;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;

        &::after {
          display: none;
        }
      }

      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 1px;
        height: 36px;
        margin: auto;
        background-color: $color-ee;
        content: '';
      }
    }

    .group-detail-number {
      @include ellipsis;

      font-size: 20px;
      line-height: 26px;
      color: $color-00;
    }

    .group-detail-name {
      margin-top: 2px;
      font-size: 14px;
      line-height: 19px;
      color: $color-89;
    }
  }

  .group-detail__head-right {
    width: 270px;

    .head {
      height: 40px;
      font-weight: bold;
      line-height: 40px;
      color: $color-53;
      text-align: center;
      background-color: $table-header-bg;
      border: 1px solid $color-ee;
      border-radius: 4px 4px 0 0;
      box-sizing: border-box;
    }

    .content {
      height: 188px;
      padding: 20px;
      line-height: 24px;
      color: $color-53;
      background-color: $color-ff;
      border: 1px solid $color-ee;
      border-top: none;
      border-radius: 0 0 4px 4px;
      box-sizing: border-box;
    }

    .group-notice {
      height: 100%;
      overflow-y: auto;
    }
  }

  .search-box {
    @include flex-between;

    margin-bottom: 20px;

    .left {
      @include flex-left;

      > * + * {
        margin-left: 10px;
      }
    }
  }

  .group-member-cell {
    @include flex-left;

    padding: 0 20px 0 30px;
    line-height: 22px;

    .head-img {
      width: 32px;
      height: 32px;
      min-width: 32px;
      margin-right: 12px;
      background-color: #ececec;
      border-radius: 4px;
      opacity: 1;
    }

    .label-comm {
      margin-left: 4px;
      font-size: 12px;

      &.yellow {
        color: $warning-color;
      }

      &.green {
        color: $success-color;
      }
    }
  }
}
</style>

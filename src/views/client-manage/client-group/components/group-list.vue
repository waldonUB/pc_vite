<!--
 * @Description  : 客户群列表
 * @Author       : turbo
 * @Date         : 2021-07-20 14:00:24
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-21 09:52:51
-->

<template>
  <div class="group-list">
    <global-ts-header>
      <template #leftPart>客户群</template>
    </global-ts-header>
    <group-introductiton :isShow.sync="isShowIntroduction"></group-introductiton>
    <div v-if="!isShowIntroduction" class="pro_listBox">
      <div class="search-box">
        <div class="left">
          <fa-input-search
            v-model="requestParam.groupChatName"
            placeholder="搜索"
            class="faUiSearchInput"
            allow-clear
            @search="reloadTable"
          >
            <template #enterButton>
              <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
            </template>
          </fa-input-search>
          <ts-select-list
            v-if="isNoOneSelfDataAuth"
            default-tip="选择群主"
            :width="220"
            :dep-id-list.sync="requestParam.ownerDepIdList"
            :sids.sync="requestParam.ownerSidList"
          ></ts-select-list>
          <ts-select-list
            v-if="isNoOneSelfDataAuth"
            default-tip="选择成员"
            :width="220"
            :dep-id-list.sync="requestParam.memberDepIdList"
            :sids.sync="requestParam.memberSidList"
          ></ts-select-list>
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
      <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="groupList">
        <el-table-column label="群昵称" min-width="300px">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <global-ts-tool-tips
              v-if="scope.row.unKnowClient"
              class="item"
              offset="10"
              effect="dark"
              content="未添加任意企业成员为好友的群成员无法获取头像和昵称"
              placement="top-start"
            >
              <global-ts-svg-icon name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </template>
        </el-table-column>
        <el-table-column label="群主" prop="ownerName" min-width="70px"></el-table-column>
        <el-table-column label="群人数" prop="chatTotal" min-width="80px"></el-table-column>
        <el-table-column label="今日入群" prop="todayTotal" min-width="100px"></el-table-column>
        <el-table-column label="今日退群" prop="todayOutTotal" min-width="100px"></el-table-column>
        <el-table-column label="建群时间" prop="createTimeName" min-width="100px">
          <template #header>
            <global-ts-tool-tips content="按顺序排序或按倒序排序">
              <div class="sortBar" @click="changeSortType">
                <span>建群时间</span>
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
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <span class="text_but1" @click="toGroupDetail(scope.row.id)">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :table-data="groupList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParam"
        @getData="changeTable"
      ></global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { merge } from 'lodash';

// components
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import GroupIntroductiton from './group-introductiton.vue';

// utils
import { exportExcel } from '@/utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'GroupList',
  components: { TsSelectList, GroupIntroductiton },
  data() {
    return {
      isShowIntroduction: false, // 是否显示介绍页面 true - 已接入企微，但还没创建外部群 || 没接入企微（企业id为空）
      requestParam: {
        groupChatName: '', // 群名
        ownerSidList: '', // 群主sid
        ownerDepIdList: '', // 群主部门id
        memberSidList: '', // 成员sid
        memberDepIdList: '', // 成员depId
        sortKey: 'createTime',
        desc: true, // 排序类型 true - 倒序 false - 正序
      },
      firstLoad: true, // 是否是首次请求
      isReload: false,
      groupList: [],
      ajaxUrl: '/rest/manage/wxwork/groupChat/getGroupChatList',
    };
  },
  computed: {
    ...mapState({
      isFinishWxWork: state => state.globalData.wxWorkConf?.wxWorkSysConf?.available,
    }),
    ...mapGetters({
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
  },
  methods: {
    changeTable(data) {
      const list = data.groupChatList;
      this.groupList = list;
      if (this.firstLoad) {
        this.firstLoad = false;
        // 已接入企微，但还没创建外部群 || 没接入企微（企业id为空）
        this.isShowIntroduction = !list || list.length <= 0 || !this.isFinishWxWork;
      }
    },
    /**
     * @description 导出表格
     * @author enson
     * @date 2021-01-24
     */
    async onExportExcel() {
      const { getGroupChatList } = wxwork;
      const [err, res] = await getGroupChatList(merge({}, this.requestParam, { isExport: true }));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const keyJson = {
        name: '群昵称',
        ownerName: '群主',
        chatTotal: '群人数',
        todayTotal: '今日入群',
        todayOutTotal: '今日退群',
        createTimeName: '建群时间',
      };
      exportExcel(res.data.groupChatList, '客户群', keyJson);
    },
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
    reloadTable() {
      this.isReload = true;
    },
    /**
     * @description 进入群详情页面
     * @author enson
     * @date 2021-01-24
     */
    toGroupDetail(groupId) {
      this.$pubsub.one('toGroupDetail', fn => {
        fn(groupId);
      });
      this.$emit('toGroupDetail');
    },
  },
};
</script>

<style lang="scss" scoped>
.group-list {
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
}
</style>

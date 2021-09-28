<!--
 * @Description  : 客户群发列表
 * @Author       : turbo
 * @Date         : 2021-07-29 12:15:40
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 15:19:26
-->

<template>
  <div v-if="!isInit" class="wx-send-msg-list">
    <global-ts-header>
      <template #leftPart>
        {{ titleName }}
        <global-ts-version :hide-hover-text="true" :limit-ver="showVer"></global-ts-version>
        <global-ts-tool-tips offset="10" effect="dark" :content="`如何使用${titleName}`" placement="top-start">
          <global-ts-svg-icon class="question-icon" name="icon-wenhao1616" @click="toHelpCenter"></global-ts-svg-icon>
        </global-ts-tool-tips>
      </template>
      <template #rightPart>
        <global-ts-button
          v-if="hasWxWork && hasData"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="$emit('addMsgSend')"
        >
          {{ chatType === 0 ? '新建群发' : '新建群群发' }}
        </global-ts-button>
      </template>
    </global-ts-header>
    <ts-introduce-page
      v-if="!hasWxWork || !hasData"
      :explain="
        `一键群发消息给客户${chatType === 0 ? '' : '群'}，监督${chatType === 0 ? '员工' : '群主'}群发情况，统计群发结果`
      "
      :title="titleName"
      :icon="introductIcon"
      :introduct-bg="introductBg"
      :button-txt="hasWxWork ? '立即使用' : '接入企微'"
      :no-tool-tip="hasWxWork"
      @gotoSet="gotoSet"
    ></ts-introduce-page>
    <div v-else class="pro_listBox">
      <div class="search-box">
        <fa-input-search
          v-model="requestParam.title"
          placeholder="标题"
          class="faUiSearchInput"
          allow-clear
          @search="reloadTable"
        >
          <template #enterButton>
            <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
          </template>
        </fa-input-search>
        <global-ts-date-picker
          type="datetimerange"
          data-format="yyyy-MM-dd HH:mm:ss"
          @updateTime="getSearchTime"
        ></global-ts-date-picker>
      </div>
      <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="msgSendList">
        <el-table-column label="标题" type="index" :width="chatType === 0 ? '250px' : '150px'" fixed>
          <template slot-scope="scope">
            <span class="text_but1" @click="toMsgSendDetail(scope.row.id)">{{ scope.row.title || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="群发内容" prop="textContent" width="250px"></el-table-column>
        <el-table-column width="250px">
          <template #header>
            <span v-if="chatType === 0">群发成员</span>
            <span v-else>发送成员<br />(群主)</span>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">全部成员</div>
            <global-ts-tool-tips
              v-else
              offset="10"
              effect="dark"
              placement="top"
              :disabled="chatType === 0"
              :content="scope.row.userName"
            >
              <div class="user-name">{{ scope.row.userName }}</div>
            </global-ts-tool-tips>
          </template>
        </el-table-column>
        <el-table-column :label="`${chatType === 0 ? '成员' : '群主'}群发结果`" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.isMoreTime">-</div>
            <div v-else>
              <div>{{ scope.row.sendNum }}人已群发</div>
              <div class="red-text">{{ scope.row.unSendNum }}人未群发</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="`${chatType === 0 ? '客户' : '群'}接收结果`" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.isMoreTime">-</div>
            <div v-else>
              <div>{{ `${scope.row.receiveNum}${chatType === 0 ? '人已群发' : '个群已收到'}` }}</div>
              <div class="red-text">{{ `${scope.row.unReceiveNum}${chatType === 0 ? '人未群发' : '个群未收到'}` }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="群发类型" prop="sendTypeName" width="150px"></el-table-column>
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
        </el-table-column>
        <el-table-column label="操作" min-width="250px" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 6" class="fail-line">
              创建失败
              <global-ts-tool-tips offset="10" effect="dark" placement="top-start">
                <template #content>在所选范围内没有满足群发条件的客户</template>
                <global-ts-svg-icon name="icon-wenhao1616"></global-ts-svg-icon>
              </global-ts-tool-tips>
            </span>
            <div v-else>
              <span class="text_but1" @click="toMsgSendDetail(scope.row.id)">数据统计</span>
              <global-ts-tool-tips
                offset="10"
                effect="dark"
                placement="top"
                content="提醒未群发的成员进行群发"
                :disabled="!scope.row.isCanRemind"
              >
                <span
                  class="text_but1"
                  :class="{ disabled: !scope.row.isCanRemind }"
                  @click="sendMsgInform(scope.row.id, scope.row.isCanRemind)"
                >
                  提醒群发
                </span>
              </global-ts-tool-tips>
              <el-popover trigger="click" popper-class="more-opt-popover">
                <template #reference>
                  <span class="more-btn text_but1">
                    更多
                    <global-ts-svg-icon class="arrow-icon" name="icon-shaixuanxia"></global-ts-svg-icon>
                  </span>
                </template>
                <template>
                  <div
                    class="popover-item"
                    :class="{ disabled: scope.row.isCancel }"
                    @click="cancelSend(scope.row.id, scope.row.isCancel)"
                  >
                    取消群发
                  </div>
                  <div class="popover-item" @click="deleteTask(scope.row.id)">删除</div>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :table-data="msgSendList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParam"
        @getData="changeTable"
      ></global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// assets
import wxCorpMsgSendIcon from '@/assets/image/wxCorpMsgSend/wxCorpMsgSendIcon.png';
import wxCorpMsgSendBg from '@/assets/image/wxCorpMsgSend/wxCorpMsgSendBg.png';
import wxGroupMsgSendIcon from '@/assets/image/wxCorpMsgSend/wxGroupMsgSendIcon.png';
import wxGroupMsgSendBg from '@/assets/image/wxCorpMsgSend/wxGroupMsgSendBg.png';

// components
import TsIntroducePage from '@/components/base/ts-introduce-page/index.vue';

// utils
import { getWxWorkConfInfo, gotoWxCorpSet, confirm } from '@/utils';
import { sendMsgInform, cancelSend } from '../utils';

// config
import versionDef from '@/config/version-def';

// api
import { wxwork } from '@/api';

export default {
  name: 'WxSendMsgList',
  components: { TsIntroducePage },
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isInit: false,
      hasWxWork: false, // 是否已经接入企微
      hasData: false, // 是否有数据
      requestParam: {
        chatType: this.chatType, // 0 - 客户群发, 1 - 客户群群发
        title: '',
        sendStartTime: '', // 开始时间
        sendEndTime: '', // 结束时间
        sortKey: 'sendTime',
        desc: true,
      },
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '',
      msgSendList: [],
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    titleName() {
      return this.chatType === 0 ? '客户群发' : '客户群群发';
    },
    showVer() {
      return versionDef.getLimitVer('MID', 'PROFESSIONNAL');
    },
    introductIcon() {
      return this.chatType === 0 ? wxCorpMsgSendIcon : wxGroupMsgSendIcon;
    },
    introductBg() {
      return this.chatType === 0 ? wxCorpMsgSendBg : wxGroupMsgSendBg;
    },
  },
  created() {
    this.initPage();
  },
  methods: {
    async initPage() {
      this.isInit = true;
      const wxWorkConfInfo = await getWxWorkConfInfo();
      this.hasWxWork = wxWorkConfInfo.wxWorkGroupConf.available;
      await this.checkHasData();
      this.isInit = false;
      this.$nextTick(() => {
        this.ajaxUrl = '/rest/manage/wxwork/msgTask/getMsgTaskList';
      });
    },
    async checkHasData() {
      const { checkHadData } = wxwork;
      const [err, res] = await checkHadData({ chatType: this.chatType });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.hasData = res.data.hadData;
    },
    /**
     * 去帮助中心
     * @author guoyijie
     * @date 2020-06-01
     */
    toHelpCenter() {
      const url = this.addressUrl[this.chatType === 0 ? 'wxWorkMsgSend' : 'wxWorkGroupMsgSend'];
      window.open(url, '_blank');
    },
    gotoSet() {
      if (!this.hasWxWork) {
        gotoWxCorpSet();
      } else {
        this.hasData = true;
      }
    },
    changeTable({ list = [] }, res, pages) {
      this.msgSendList = list;
      this.pages = pages;
    },
    reloadTable() {
      this.isReload = true;
    },
    /**
     * 设置搜索时间
     * @author guoyijie
     * @date 2020-04-29
     * @param {Array} val
     */
    getSearchTime(val) {
      this.requestParam.sendStartTime = val?.[0] || '';
      this.requestParam.sendEndTime = val?.[1] || '';
      this.reloadTable();
    },
    /**
     * 改变数据顺序
     * @author guoyijie
     * @date 2020-07-15
     */
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
    toMsgSendDetail(taskId) {
      this.$emit('msgSendDetail');
      this.$pubsub.one('toMsgSendDetail', fn => {
        fn(taskId);
      });
    },
    /**
     * 主动提醒群发
     * @author waldon
     * @date 2020/4/10
     */
    async sendMsgInform(taskId, isCanRemind) {
      if (!isCanRemind) return;
      sendMsgInform(taskId);
    },
    /**
     * 取消群发
     * @author guoyijie
     * @date 2021-03-25
     * @param {Number} taskId - 群发任务id
     * @param {Boolean} isCancel - 是否可以取消
     */
    async cancelSend(taskId, isCancel) {
      if (isCancel) return;
      const [err, res] = await cancelSend(taskId);
      !err && this.reloadTable();
    },
    /**
     * 删除群发
     * @author waldon
     * @date 2021-03-25
     * @param {Number} taskId - 群发任务id
     */
    deleteTask(taskId) {
      confirm('确认删除群发记录？删除后无法恢复', '删除确认').then(async () => {
        const { delMsgTask } = wxwork;
        const [err, res] = await delMsgTask({ taskId });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '删除成功！',
        });
        !err && this.reloadTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wx-send-msg-list {
  .search-box {
    margin-bottom: 20px;

    > * + * {
      margin-left: 10px;
    }
  }

  .user-name {
    @include line-clamp(2);

    max-width: 230px;
  }

  .red-text {
    color: $error-color;
  }

  .fail-line {
    @include flex-center;

    .ts-svg-icon {
      margin-left: 6px;
      font-size: 16px;
    }
  }
}
</style>

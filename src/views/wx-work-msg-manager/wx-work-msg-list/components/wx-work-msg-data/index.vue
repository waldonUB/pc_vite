<!--
 * @Author       : ADI
 * @Date         : 2021-07-22 15:43:12
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:46
-->
<template>
  <div class="wxWorkMsgData">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          会话存档
          <global-ts-version class="versionIcon" :limitVer="showVer"></global-ts-version>
          <svg class="icon tipIcon icon_16 icon_tipIconStyle" aria-hidden="true" @click="toHelpCenter">
            <use xlink:href="#icon-wenhao1616"></use>
          </svg>
        </div>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <global-ts-slide class="bottomBorder" :slidArray="slideList" @changeStatus="changeResonsibilityStatus">
      </global-ts-slide>
      <div class="pro_line">
        <fa-input-search
          v-if="[2].includes(type)"
          v-model="clientRequestParam.searchMoreArgs"
          placeholder="手机号码/姓名/昵称"
          class="headerLine__search faUiSearchInput floatLeft"
          allowClear
          @search="searchInfo"
        >
          <fa-button slot="enterButton" class="headerLine__search-button" size="large">
            <svg class="icon headerLine__search-icon icon_16" aria-hidden="true">
              <use xlink:href="#icon-sousuo1616"></use>
            </svg>
          </fa-button>
        </fa-input-search>
        <ts-select-list
          v-if="isManager"
          class="headSelect floatLeft"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
          :needUpdate.sync="needUpdate"
          @select="searchInfo"
        >
        </ts-select-list>
      </div>
      <el-table
        min-width="1010px"
        :data="responsibility.tableList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column prop="name">
          <template #header>
            {{ type === 1 ? '成员' : '客户名称' }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            {{ type === 1 ? '绑定企微成员' : '手机号码' }}
          </template>
          <template slot-scope="scope">
            {{ type === 1 ? scope.row.wxWorkStaffName : scope.row.mobile }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            {{ type === 1 ? '企微客户总数' : '当前跟进人' }}
          </template>
          <template slot-scope="scope">
            {{ type === 1 ? scope.row.clientCounts : scope.row.staffName }}
          </template>
        </el-table-column>
        <el-table-column label="客户会话存档数" prop="chatDataUserCounts" min-width="100">
          <template #header>
            <span class="headerTitle">
              客户会话存档数
            </span>
            <global-ts-tool-tips effect="dark" popperClass="wxWorkMsgList_visitDataTitlteTip">
              <div slot="content">
                1、仅记录有1条以上消息会话存档的客户数，与企微客户总数可能会有差异<br />
                2、会话存档需获得客户同意，实际在企微的会话数和存档会话数可能会有差异<br />
                3、会话同步预计有1小时的延迟
              </div>
              <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                <use xlink:href="#icon-wenhao1616"></use>
              </svg>
            </global-ts-tool-tips>
          </template>
        </el-table-column>
        <el-table-column label="群会话存档数" prop="chatDataRoomCounts"></el-table-column>
        <el-table-column label="今日客户会话数" prop="todayChatDataUserCounts"></el-table-column>
        <el-table-column label="今日群会话数" prop="todayChatDataRoomCounts"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="tanshu_color text_but1" @click="seeDetail(scope.row)">
              会话详情
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-fai-pagination @changePage="getMsgInfoList" :pageOption.sync="pages"> </global-ts-fai-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getChatDataContactStatList } from '@/api/modules/views/wx-work-msg-manager/wx-work-msg-list';

export default {
  name: 'wx-work-msg-data',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
        total: 20,
      },
      slideList: [
        {
          key: '根据成员检索',
          value: 1,
        },
        {
          key: '根据客户检索',
          value: 2,
        },
      ],
      type: 1, // 1 - 成员检索 2 - 客户检索
      requestParam: {
        // 公共请求的相关数据
        depIdList: '',
        sids: '',
      },
      clientRequestParam: {
        // 客户相关的请求数据
        searchMoreArgs: '', // 手机号/姓名/昵称
      },
      responsibility: {
        // 响应的数据
        tableList: [], // 表格数据
      },
      needUpdate: false, // 是否需要更新员工组件
    };
  },
  computed: {
    ...mapGetters({
      isManager: 'user/isManage',
    }),
    ...mapState({
      isLogin: state => !!state.globalData?.userTicket,
      addressUrl: state => state.globalData.addressUrl,
    }),
    showVer() {
      return versionDef.getLimitVer('MID', 'PROFESSIONNAL'); // 直销：专业版； 分销：高级版/尊享版/专用版
    },
    requestParamCal() {
      return this.type === 2 ? Object.assign({}, this.requestParam, this.clientRequestParam) : this.requestParam;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  activated() {
    this.initTable();
  },
  methods: {
    /**
     * @description 重置请求参数
     * @author enson
     * @date 2021-05-14
     */
    resetRequestParam() {
      const { requestParam, clientRequestParam, pages } = this.$options.data.call(this);
      this.requestParam = requestParam;
      this.clientRequestParam = clientRequestParam;
      this.needUpdate = true;
      this.pages = pages;
    },
    /**
     * @description 切换tab后的回调函数
     * @author enson
     * @date 2021-04-19
     */
    changeResonsibilityStatus(e, value, index) {
      if (this.type !== value) {
        this.initTable(value);
      }
    },
    /**
     * @description 查看会话详情
     * @author enson
     * @date 2021-04-19
     */
    seeDetail(itemData) {
      this.$utils.FdpLog('yx_page_view_new', {
        yx_app_terminal: 1, // 应用终端 1-PC 2-H5 3-MP
        yx_logon_status: this.isLogin ? 1 : 2, // 是否已经登陆 1-已登录 2-未登录
        yx_free_text_0: this.type === 1 ? '会话存档详情-成员' : '会话存档详情-客户',
      });
      this.$emit('changeComponent', 'wxWorkMsgDetail', {
        sendUserInfo: itemData,
      });
    },
    /**
     * @description 搜索
     * @author enson
     * @date 2021-04-19
     */
    searchInfo() {
      const { pages } = this.$options.data.call(this);
      this.pages = pages;
      this.getMsgInfoList();
    },
    /**
     * @description 获取会话数据
     * @author enson
     * @date 2021-04-20
     */
    async getMsgInfoList() {
      const params = {
        ...{
          pageNow: this.pages.pageNow,
          limit: this.pages.limit,
          type: this.type,
        },
        ...this.requestParamCal,
      };
      const [err, res] = await getChatDataContactStatList(params);
      if (err) {
        return Promise.reject();
      }
      this.responsibility.tableList = res.data;
      this.pages.total = res.total;
    },

    /**
     * @description 初始化表格数据
     * @author enson
     * @date 2021-05-19
     * @param {Number} type 1 - 成员检索 2 - 客户检索
     */
    initTable(type) {
      this.resetRequestParam(); // 重置参数
      type && (this.type = type);
      this.getMsgInfoList();
      this.$utils.FdpLog('yx_page_view_new', {
        yx_app_terminal: 1, // 应用终端 1-PC 2-H5 3-MP
        yx_logon_status: this.isLogin ? 1 : 2, // 是否已经登陆 1-已登录 2-未登录
        yx_free_text_0: this.type === 1 ? '会话存档-根据成员检索' : '会话存档-根据客户检索',
      });
    },
    /**
     * @description 跳转教程内容
     * @author enson
     * @date 2021-05-20
     */
    toHelpCenter() {
      window.open(this.addressUrl.wxChatDataListCount, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkMsgData {
  .bottomBorder {
    position: relative;
    padding-bottom: 17px;
    margin-bottom: 20px;
  }
  .pro_listBox {
    .pro_line {
      .floatLeft {
        float: left;
      }
      .faUiSearchInput {
        margin-right: 12px;
      }
    }
  }
  .tipIcon {
    margin-left: 6px;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>

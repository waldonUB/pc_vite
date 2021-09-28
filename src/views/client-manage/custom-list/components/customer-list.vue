<!--
 * @Description  : 客户列表
 * @Author       : turbo
 * @Date         : 2021-06-30 10:32:37
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-20 12:09:48
-->

<template>
  <div class="customer-list">
    <ts-corp-top-tip from-page="客户列表"></ts-corp-top-tip>
    <global-ts-header>
      <template #leftPart>客户列表</template>
      <template #rightPart>
        <fa-tooltip>
          <template #title>
            <a :href="updateVersionUrl" target="_blank">立即扩容</a>
          </template>
          <div class="customer-num">剩余客户数：{{ availClientCnt }}</div>
        </fa-tooltip>
        <global-ts-button type="primary" size="small" @click="openSyncWxCorpCustomer">企微客户同步</global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-icon-11" @click="editCustomer(-1)">
          客户录入
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <global-ts-slide has-padding :slid-array="slideList" @changeStatus="changeResonsibilityStatus"></global-ts-slide>
      <div class="search-box">
        <fa-input-search
          v-model="requestParam.searchMoreArgs"
          placeholder="手机号码/姓名/昵称/企业"
          class="faUiSearchInput"
          allow-clear
          @search="reloadTable"
          @click.native="$utils.logDog('customList_phone')"
        >
          <template #enterButton>
            <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
          </template>
        </fa-input-search>
        <div class="tag-box" @click="showTagDialog">
          <span>{{ tagListStr || '标签' }}</span>
        </div>
        <global-ts-select
          placeholder="意向度"
          :width="160"
          :list="intentionList"
          v-model="requestParam.intention"
          @click.native="$utils.logDog('customList_intention')"
        ></global-ts-select>
        <global-ts-select
          placeholder="跟进阶段"
          :width="160"
          :list="allFollowStatusList"
          :selectkey="{ label: 'name', value: 'id' }"
          v-model="requestParam.followStatus"
          @click.native="$utils.logDog('customList_followStatus')"
        ></global-ts-select>
        <global-ts-button size="small" icon="icon-icon-4" @click="reloadTable">搜索</global-ts-button>
        <global-ts-button v-if="isManage" size="small" icon="icon-daochu" @click="onExportExcel">导出</global-ts-button>
        <global-ts-button size="small" @click="$emit('customerRepeat')">客户查重</global-ts-button>
        <global-ts-tool-tips effect="dark" placement="top">
          <template #content>
            营销短信发送需要经过短信运营商审核，如果需要及时发送，请在9：00-20：00 点击发送申请。<br />
            如果是20：00后申请，则次日9：00后发送成功。
          </template>
          <global-ts-button size="small" @click="showSendMsgDialog('multipart')">批量发送短信</global-ts-button>
        </global-ts-tool-tips>
        <global-ts-button type="greyText" size="small" icon="icon-shaixuan" @click="showMoreFilter">
          高级筛选
        </global-ts-button>
        <global-ts-button type="greyText" size="small" icon="icon-shezhi" @click="showCustomFiled">
          设置展示项
        </global-ts-button>
      </div>
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
        :data="customList"
        @select="changeSelect"
        @select-all="changeSelect"
      >
        <el-table-column type="selection" width="55px" fixed :reserve-selection="true"></el-table-column>
        <el-table-column label="序号" min-width="50px" fixed>
          <template slot-scope="scope">
            {{ (pages.pageNow - 1) * pages.limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="客户" prop="contacts" min-width="300px" class-name="contacts" fixed>
          <template slot-scope="scope">
            <div class="contactsContent" @click="showCustomerDetail(scope.row.id, 'isDetail')">
              <global-ts-text-img
                :img-url="scope.row.wxHeadImgUrl"
                :img-text="scope.row.contacts"
                :sex-color="sexColor(scope.row.sex)"
              ></global-ts-text-img>
              <div v-if="scope.row.contacts && scope.row.contacts !== scope.row.wxName" class="contactsBox">
                {{ scope.row.contacts }}
                <span v-if="scope.row.wxName">（{{ scope.row.wxName }}）</span>
              </div>
              <div v-else class="contactsBox">
                {{ scope.row.wxName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item of initSelectedList"
          :key="item.field"
          :label="item.name"
          :min-width="item.width + 'px'"
        >
          <template #header>
            <global-ts-tool-tips v-if="sortList.has(item.field)" content="按顺序排序或按倒序排序">
              <div class="sortBar" @click="changeSortType(item.field)">
                <span>{{ sortList.get(item.field).name }}</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanshang"
                    :class="{ isNotActive: isNotActive('up', item.field) }"
                  ></global-ts-svg-icon>
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanxia"
                    :class="{ isNotActive: isNotActive('down', item.field) }"
                  ></global-ts-svg-icon>
                </span>
              </div>
            </global-ts-tool-tips>
            <global-ts-tool-tips
              v-else-if="item.field === 'wxWorkChannelName'"
              content="通过企微助手渠道二维码添加的客户所属的渠道"
            >
              <span>企微渠道</span>
            </global-ts-tool-tips>
            <span v-else>{{ item.name || '无' }}</span>
          </template>
          <template slot-scope="scope">
            <div v-if="item.field === 'tagIdList'" class="tag-list">
              <ts-wxtag v-for="(item, index) of tagList(scope.row)" :key="index">
                {{ item.name }}
              </ts-wxtag>
              <span v-if="tagList(scope.row).length === 0">-</span>
            </div>
            <span v-else-if="item.field === 'relState'" class="text_but1" @click="showDetailInfo(scope.row.id)">
              详细
            </span>
            <span v-else>
              {{ getColumnName(item.field, scope.row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250px" fixed="right">
          <template slot-scope="scope">
            <span class="text_but1" @click="editCustomer(scope.row.id)">编辑</span>
            <span class="text_but1" @click="showCustomerDetail(scope.row.id, 'isDetail')">详情</span>
            <span class="text_but1" @click="showCustomerDetail(scope.row.id, 'addFollow')">写跟进</span>
            <el-popover trigger="click" popper-class="more-opt-popover">
              <template #reference>
                <span class="more-btn text_but1">
                  更多
                  <global-ts-svg-icon class="arrow-icon" name="icon-shaixuanxia"></global-ts-svg-icon>
                </span>
              </template>
              <template>
                <div v-if="requestParam.status === 1" class="popover-item" @click="changeCustomStatus(scope.row.id, 2)">
                  淘汰
                </div>
                <div v-if="requestParam.status === 2" class="popover-item" @click="changeCustomStatus(scope.row.id, 1)">
                  跟进
                </div>
                <div
                  v-if="scope.row.mobile.length === 11"
                  class="popover-item"
                  @click="showSendMsgDialog('single', scope.row)"
                >
                  发送短信
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :limit-index="1"
        :table-data="customList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParamTemp"
        @getData="changeTable"
      ></global-ts-pagination>
    </div>
    <ts-tag-select-dialog
      :selected-tag-list="selectedTagList"
      :dialog-visible.sync="tagSelectDialogVisible"
      @getSelectedTag="getSelectedTag"
    ></ts-tag-select-dialog>
    <ts-custom-file
      :init-all-filed-list="allDefinedFieldList"
      :init-selected-list="initSelectedList"
      :dialog-visible.sync="customFiledDialogVisible"
      @changeSortSuccess="changeSortSuccess"
    ></ts-custom-file>
    <send-msg-dialog
      :open-type="openMsgDialogType"
      :customer-list-with-phone="customerListWithPhone"
      :dialog-visible.sync="sendMsgDialogVisible"
      @clearSelection="clearSelection"
    ></send-msg-dialog>
    <more-filter-dialog
      :dialog-visible.sync="moreFilterDialogVisible"
      @sure="setMoreFilter"
      @reset="resetMoreFilter"
    ></more-filter-dialog>
    <relevance-dialog :cid="selectedCustomId" :dialog-visible.sync="relevanceDialogVisible"></relevance-dialog>
    <customer-detail-dialog
      is-show-merge
      :customer-id="selectedCustomId"
      :detail-type="detailType"
      :customer-list="customList"
      :follow-status-list="followStatusList"
      :dialog-visible.sync="customerDetailDialogVisible"
      @editCustomer="editCustomer"
      @reloadTable="reloadTable"
    ></customer-detail-dialog>
    <customer-detail-dialog
      is-from-merge
      :customer-id="selectedMergeCustomId"
      :customer-list="customerMergeList"
      :follow-status-list="followStatusList"
      :dialog-visible.sync="customerDetailFromMergeDialogVisible"
    ></customer-detail-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

// components
import TsCorpTopTip from '@/components/base/ts-corp-top-tip/index.vue';
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import TsTagSelectDialog from '@/components/base/ts-tag-select-dialog/index.vue';
import TsCustomFile from '@/components/base/ts-custom-file/index.vue';
import SendMsgDialog from './send-msg-dialog.vue';
import MoreFilterDialog from './more-filter-dialog.vue';
import RelevanceDialog from './relevance-dialog.vue';
import CustomerDetailDialog from './customer-detail-dialog.vue';

// utils
import { getWxWorkConfInfo, confirm, gotoWxCorpSet, exportExcel } from '@/utils';
import { getCustomFiledList, getTagList } from '../utils';

// api
import { client } from '@/api';

export default {
  name: 'CustomerList',
  components: {
    TsCorpTopTip,
    TsWxtag,
    TsTagSelectDialog,
    TsCustomFile,
    SendMsgDialog,
    MoreFilterDialog,
    RelevanceDialog,
    CustomerDetailDialog,
  },
  props: {
    isManage: {
      type: Boolean,
      default: false,
    },
    allTagList: {
      type: Array,
      default: () => [],
    },
    isPartUpdate: {
      // 是否需要局部刷新数据，即只更新当前请求状态下的数据
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requestParam: {
        labelId: 1, // 标签
        status: 1, // 跟进库状态
        sid: -1, // 跟进员工
        sort: 8, // 创建时间排序，7是顺序，8是倒序
        contacts: '',
        mobile: '',
        qq: '',
        searchMoreArgs: '', // 手机/联系人/qq
        intention: -1, // 意向度
        followStatus: -1, // 跟进情况
        groupIdList: '', // 标签id的集合
        isVisitsCard: -1, // 是否访问文章
        isVisitsArticle: -1, // 是否访问名片
      },
      moreRequestParam: {}, // 高级筛选
      availClientCnt: 0,
      isShowType: '',
      slideList: [
        {
          key: '跟进库',
          value: 1,
        },
        {
          key: '淘汰库',
          value: 2,
        },
      ],
      tagListStr: '',
      selectedTagList: [],
      tagSelectDialogVisible: false,
      intentionList: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '意向度-高',
          value: 1,
        },
        {
          label: '意向度-中',
          value: 2,
        },
        {
          label: '意向度-低',
          value: 3,
        },
      ],
      followStatusList: [], // 跟进阶段列表
      allFollowStatusList: [], // 跟进阶段列表（包括全部选项）
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '',
      customList: [],
      initSelectedList: [], // 已保存的自定义字段
      allDefinedFieldList: [], // 所有字段
      sortList: new Map([
        ['lastVisitsTimeName', { name: '最近访问时间', sortKeyList: [3, 4] }],
        ['updateTimeName', { name: '最近更新时间', sortKeyList: [5, 6] }],
        ['visitsTimeName', { name: '回访时间', sortKeyList: [1, 2] }],
        ['createTimeName', { name: '创建时间', sortKeyList: [7, 8] }],
      ]),
      detailType: '', // 详情的状态
      selectedCustomId: 0,
      selectedCustomerList: [], // 选中的客户
      selectedMergeCustomId: 0, // 选中的需要合并的客户id
      customerMergeList: [], // 需要合并的客户列表
      openMsgDialogType: '',
      customerListWithPhone: [], // 带手机号的选中客户
      customFiledDialogVisible: false,
      sendMsgDialogVisible: false,
      moreFilterDialogVisible: false,
      relevanceDialogVisible: false,
      customerDetailDialogVisible: false,
      customerDetailFromMergeDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      aid: state => state.user.info.aid,
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl,
    }),
    requestParamTemp() {
      const moreRequestParamTemp = {};
      for (const key in this.moreRequestParam) {
        if (this.moreRequestParam[key] !== undefined) {
          moreRequestParamTemp[key] = this.moreRequestParam[key];
        }
      }
      return {
        ...this.requestParam,
        ...moreRequestParamTemp,
      };
    },
    sexColor() {
      return function(sex) {
        return sex === 1 ? 'man' : sex === 2 ? 'woman' : '';
      };
    },
    visitKey() {
      return `ts_fkw_custom_sort_${this.aid}`;
    },
    /**
     * 标签数据翻译
     * @author waldon
     * @date 2020-05-19
     * @param {Object} row
     * @returns
     */
    tagList() {
      return function(row) {
        return getTagList(this.allTagList, row);
      };
    },
    isNotActive() {
      return function(dirct, field) {
        const sortMap = this.sortList.get(field);
        return (
          !sortMap.sortKeyList.includes(this.requestParam.sort) ||
          sortMap.sortKeyList.indexOf(this.requestParam.sort) === (dirct === 'up' ? 1 : 0)
        );
      };
    },
  },
  async created() {
    this.$utils.FdpLog('yx_djqwkhtb', {
      yx_free_text_0: '进入页面',
    });
    await this.getCustomFiledList();
    await this.getFollowStatusList();
    const wxWorkConfInfo = await getWxWorkConfInfo();
    this.isShowType = !wxWorkConfInfo?.wxWorkChannelListConf?.available ? 1 : 2;
    this.requestParam.sort = parseInt(localStorage.getItem(this.visitKey)) || 8;
    this.$pubsub.on('showCustomerDetail', (id, list) => {
      this.selectedMergeCustomId = id;
      this.customerMergeList = list;
      this.customerDetailFromMergeDialogVisible = true;
    });
    this.initFinish();
  },
  activated() {
    if (this.isPartUpdate) {
      // 只更新当前请求状态下的数据
      this.reloadTable();
    }
  },
  methods: {
    /**
     * 查询自定义字段
     * @author waldon
     * @date 2020-05-19
     */
    async getCustomFiledList() {
      this.initSelectedList = []; // 为了清空饿了么表格的列缓存
      const { allDefinedFieldList, initSelectedList } = await getCustomFiledList(1);
      this.allDefinedFieldList = allDefinedFieldList;
      this.initSelectedList = initSelectedList;
    },
    /**
     * 获取跟进阶段列表
     * @author lymn
     * @date 2020-09-27
     */
    async getFollowStatusList() {
      const { getTsUserFollowStatusList } = client;
      const [err, res] = await getTsUserFollowStatusList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.followStatusList = res.data.optionList;
      this.allFollowStatusList = [...res.data.optionList];
      this.allFollowStatusList.unshift({
        id: 0,
        name: '全部',
      });
    },
    // 不做这个保护，会导致一开始发起同样的三个请求 ，因此必须等到员工列表、状态库、标签加载完成才能发起请求
    // 2020年8月5日做了同请求的保护，上面那种情况不会出现了
    initFinish() {
      this.$nextTick(() => {
        this.ajaxUrl = '/ajax/client/tsClient_h.jsp?cmd=getTsClientList';
      });
    },
    /**
     * 执行企微同步客户逻辑
     * @author waldon
     * @date 2020/7/21
     */
    async openSyncWxCorpCustomer() {
      this.$utils.FdpLog('yx_djqwkhtb', {
        yx_free_text_0: '点击按钮',
      });
      if (this.isShowType === 1) {
        this.$utils.FdpLog('yx_djqwkhtb', {
          yx_free_text_0: '提示未设置企微',
        });
        confirm('您还未完成企业微信相关信息设置，无法使用此功能', '通知', '去设置').then(() => {
          gotoWxCorpSet();
        });
        return;
      }
      const { syncClient } = client;
      const [err, res] = await syncClient();
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '操作成功',
      });
      !err &&
        setTimeout(() => {
          // 企微的所有同步都不是实时的，默认延迟查询
          this.reloadTable();
        }, 1000);
    },
    editCustomer(editId) {
      const isAdd = editId === -1;

      if (isAdd) {
        this.$utils.logDog('customList_newAddCustom');
      } else {
        this.$utils.logDog('customList_editCustom');
        this.$utils.FdpLog('yx_khlbcz', {
          yx_free_text_0: '编辑',
          yx_app_terminal: 1,
        });
      }

      this.$pubsub.one('editCustomer', fn => {
        fn(isAdd, editId);
      });
      this.$emit('customerEdit');
    },
    changeResonsibilityStatus(e, value) {
      this.requestParam.status = value;
      this.reloadTable();
    },
    /**
     * 显示标签弹窗
     * @author waldon
     * @date 2020-05-19
     */
    showTagDialog() {
      this.$utils.logDog('customList_showTagDialog');
      this.$utils.FdpLog('yx_khdbq', {
        yx_free_text_0: '打标签页曝光',
        yx_app_terminal: 1,
      });
      this.tagSelectDialogVisible = true;
    },
    /**
     * 获取已选择的标签
     * @author waldon
     * @date 2020-05-19
     */
    getSelectedTag(selectedGroupList) {
      this.$utils.FdpLog('yx_khdbq', {
        yx_free_text_0: '成功打标签',
        yx_app_terminal: 1,
      });
      this.selectedTagList = selectedGroupList;
      this.tagListStr = selectedGroupList.map(item => item.name).join(', ');
      this.requestParam.groupIdList = JSON.stringify(selectedGroupList.map(item => item.id));
    },
    /**
     * 导出数据
     * @author waldon
     * @date 2020-05-19
     * @modify wuying 导出Excel添加标签、公众号openID
     */
    async onExportExcel() {
      this.$utils.logDog('customList_onExportExcel');
      const { getTsClientList } = client;
      const [err, res] = await getTsClientList({
        ...this.requestParamTemp,
        limit: 20000,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const keyJson = {
        contacts: '客户',
      };
      this.allDefinedFieldList.forEach(item => {
        if (item.field !== 'tagIdList') {
          keyJson[item.field] = item.name;
        }
        if (item.field === 'mobile') {
          keyJson.tagIdNameList = '标签';
        }
      });
      keyJson.bindMpOpenIdList = '公众号openID';
      exportExcel(res.data, '客户列表', keyJson);
    },
    /**
     * 批量发送短信
     * @author waldon
     * @date 2020/9/9
     * @param {String} type - 直接发/批量
     * @param {Object} rowData - 行数据
     */
    showSendMsgDialog(type, rowData) {
      this.openMsgDialogType = type;
      if (type === 'multipart') {
        if (!this.selectedCustomerList.length) {
          return this.$utils.postMessage({
            type: 'error',
            message: '请选择客户',
          });
        }
        this.customerListWithPhone = this.selectedCustomerList.filter(item => item.mobile.length === 11);
      } else {
        this.$utils.FdpLog('yx_khlbcz', {
          yx_free_text_0: '发送短信',
          yx_app_terminal: 1,
        });
        this.customerListWithPhone = [];
        if (rowData.mobile) {
          this.customerListWithPhone.push({
            id: rowData.id,
            contacts: rowData.contacts || rowData.wxName,
            mobile: rowData.mobile,
          });
        }
      }
      this.sendMsgDialogVisible = true;
    },
    clearSelection() {
      this.selectedCustomerList = [];
      this.$refs.sortTable.clearSelection();
    },
    /**
     * 展示更多选项
     * @author waldon
     * @date 2020-06-15
     */
    showMoreFilter() {
      this.moreFilterDialogVisible = true;
    },
    /**
     * 设置高级筛选
     * @author waldon
     * @date 2020-06-18
     * @param {Object} moreRequestParam
     */
    setMoreFilter(moreRequestParam) {
      this.moreRequestParam = {
        ...moreRequestParam,
      };
      this.reloadTable();
    },
    /**
     * 重置高级筛选
     * @author waldon
     * @date 2020-06-18
     * @param {Object} initMoreRequestParam - 重置后的条件
     */
    resetMoreFilter(initMoreRequestParam) {
      this.moreRequestParam = {
        ...initMoreRequestParam,
      };
    },
    /**
     * 显示自定义字段弹窗
     * @author waldon
     * @date 2020-05-19
     */
    showCustomFiled() {
      this.customFiledDialogVisible = true;
    },
    /**
     * 保存自定义字段成功的回调
     * @author waldon
     * @date 2020-05-19
     */
    async changeSortSuccess(selectData) {
      const { batchSetTsUserDefinedList } = client;
      const [err, res] = await batchSetTsUserDefinedList({
        fieldJson: selectData.fieldJson,
        type: 1, // 1为客户列表
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.customFiledDialogVisible = false;
      this.getCustomFiledList();
    },
    /**
     * 改变选中数据
     * @author waldon
     * @date 2020/4/10
     * @param {*} selection - 选中数据
     */
    changeSelect(selection) {
      this.selectedCustomerList = selection.map(item => {
        return {
          id: item.id,
          contacts: item.contacts || item.wxName,
          mobile: item.mobile,
        };
      });
    },
    /**
     * 显示详情弹窗
     * @author waldon
     * @date 2020-05-19
     * @param {Number} id
     * @param {string} type
     */
    showCustomerDetail(id, type = '') {
      switch (type) {
        case 'isDetail':
          this.$utils.logDog('customList_isDetail');
          this.$utils.FdpLog('yx_khxqy', {
            yx_free_text_0: '客户信息',
            yx_app_terminal: 1,
          });
          break;
        case 'addFollow':
          this.$utils.FdpLog('yx_khlbcz', {
            yx_free_text_0: '写跟进',
            yx_app_terminal: 1,
          });
          this.$utils.logDog('customList_addFollow');
          break;
        default:
          this.$utils.logDog('customList_showDetailDialog');
          break;
      }
      this.selectedCustomId = id;
      this.detailType = type;
      this.customerDetailDialogVisible = true;
    },
    changeSortType(type) {
      switch (type) {
        case 'visitsTimeName':
          this.requestParam.sort = this.requestParam.sort === 1 ? 2 : 1;
          break;
        case 'lastVisitsTimeName':
          this.requestParam.sort = this.requestParam.sort === 3 ? 4 : 3;
          break;
        case 'updateTimeName':
          this.requestParam.sort = this.requestParam.sort === 5 ? 6 : 5;
          break;
        case 'createTimeName':
          this.requestParam.sort = this.requestParam.sort === 7 ? 8 : 7;
          break;
        default:
          this.requestParam.sort = 8;
          break;
      }
      localStorage.setItem(this.visitKey, this.requestParam.sort);
      this.reloadTable();
    },
    showDetailInfo(customId) {
      this.selectedCustomId = customId;
      this.relevanceDialogVisible = true;
    },
    /**
     * 格式化显示
     * @author waldon
     * @date 2020-07-23
     * @param {String} columnField - 字段
     * @param {Object} rowData - 行数据
     */
    getColumnName(columnField, rowData) {
      const noneFieldS = ['staffName'];
      return !rowData[columnField] ? (noneFieldS.includes(columnField) ? '无' : '-') : rowData[columnField];
    },
    changeCustomStatus(cid, status) {
      status === 2 &&
        this.$utils.FdpLog('yx_khlbcz', {
          yx_free_text_0: '淘汰',
          yx_app_terminal: 1,
        });
      confirm(`是否将该客户放进${status === 1 ? '跟进库' : '淘汰库'}？`, '修改客户状态确认').then(async () => {
        const { setTsClientStatus } = client;
        const [err, res] = await setTsClientStatus({
          cid,
          status,
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '修改状态成功！',
        });
        !err && this.reloadTable();
      });
    },
    changeTable(data, res, pages) {
      this.customList = data;
      this.customList.forEach(item => {
        item.salesRelTime && (item.salesRelTime = moment(item.salesRelTime).format('yyyy-MM-DD HH:mm:ss')); // 关联时间格式化
        item.birthday && (item.birthday = moment(item.birthday).format('yyyy-MM-DD')); // 生日格式化
      });
      this.pages = pages;
      this.getClientCnt(); // 涉及到更新列表的，都更新剩余客户数
    },
    reloadTable() {
      this.isReload = true;
    },
    /**
     * 获取剩余客户数(管理员才需要)
     * @author waldon
     * @date 2020-07-24
     */
    async getClientCnt() {
      if (!this.isManage) return;

      const { getClientCnt } = client;
      const [err, res] = await getClientCnt({});
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.availClientCnt = res.data.availClientCnt;
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-list {
  .customer-num {
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .search-box {
    @include flex-left;

    margin-bottom: 20px;
    flex-wrap: wrap;

    > * {
      margin-top: 20px;

      & + * {
        margin-left: 10px;
      }
    }

    .tag-box {
      @include ellipsis;

      width: 160px;
      height: 34px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 34px;
      cursor: pointer;
      background-color: $color-ff;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }

  .tag-list {
    @include flex-center;

    ::v-deep .tagText {
      max-width: 5em;
      min-width: 5em;
    }
  }
}
</style>

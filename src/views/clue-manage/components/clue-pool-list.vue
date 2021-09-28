<!--
 * @Description  : 线索列表
 * @Author       : turbo
 * @Date         : 2021-06-03 16:32:51
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-15 16:31:51
-->

<template>
  <div ref="cluePoolList" class="clue-pool-list">
    <global-ts-header>
      <template #leftPart>
        {{ pageName }}
        <global-ts-version :hide-hover-text="true"></global-ts-version>
      </template>
      <template #rightPart>
        <global-ts-button
          with-red-dot="addClue"
          type="primary"
          size="small"
          icon="icon-tianjia1616"
          @click="editClue()"
        >
          录入线索
        </global-ts-button>
        <global-ts-button
          v-if="isManage && $utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUEPOOL_ADD_CLUE)"
          type="outLine"
          size="small"
          @click="$emit('importClue')"
        >
          批量导入
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox" :class="{ hasSelect }">
      <div class="clue-filter-box">
        <div class="search-box">
          <fa-input-search
            v-model="requestParam.searchMoreArgs"
            placeholder="电话/姓名/昵称"
            class="faUiSearchInput"
            allow-clear
            @search="reloadTable"
          >
            <template #enterButton>
              <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
            </template>
          </fa-input-search>
          <ts-select-list
            ref="staffTree"
            v-if="isManage && [1].includes(pageValue) && isNoOneSelfDataAuth"
            :width="220"
            :dep-id-list.sync="requestParam.depIdListJson"
            :sids.sync="requestParam.sidsJson"
            @select="reloadTable"
          ></ts-select-list>
          <global-ts-select
            placeholder="全部来源"
            :width="220"
            :list="sourceList"
            :selectkey="{ label: 'value', value: 'key' }"
            v-model="requestParam.source"
            @change="reloadTable"
          ></global-ts-select>
          <global-ts-button type="greyText" size="small" icon="icon-zhongzhi1616" @click="resetParam">
            重置
          </global-ts-button>
          <global-ts-button type="greyText" size="small" icon="icon-shaixuan" @click="showMoreFilter">
            高级筛选
          </global-ts-button>
          <global-ts-button type="greyText" size="small" icon="icon-daochu1616" @click="onExportExcel">
            导出
          </global-ts-button>
        </div>
        <ts-filter-list
          :isShow="this.filterList.length > 0"
          :filter-list="filterList"
          @clear="clearFilter"
        ></ts-filter-list>
      </div>
      <div v-if="isHaveVersion && selectedIds.length > 0" class="sub-operate-box" :style="getShowOperateBoxStyle">
        <div class="select-desc">
          <div>
            已选中
            <span class="select-number">{{ selectedIds.length }}</span>
            项
          </div>
          <div class="cancel-select" @click="resetMoreSelect">取消选择</div>
        </div>
        <global-ts-button
          v-if="$utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_SET_CLIENT)"
          size="small"
          @click="setViewerToCustomer(selectedIds, 'multiple')"
        >
          置为客户
        </global-ts-button>
        <global-ts-button
          v-if="$utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_GIVEUP_CLUE)"
          size="small"
          @click="releaseClue(selectedIds, 'multiple')"
        >
          放弃线索
        </global-ts-button>
        <global-ts-button
          v-if="$utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_SEA_GET)"
          size="small"
          @click="getMyClue(selectedIds, 'multiple')"
        >
          领取
        </global-ts-button>
        <global-ts-button
          v-if="$utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_SEA_DISTRIBUTE)"
          size="small"
          @click="beforeDistributeClue(selectedIds, 'multiple')"
        >
          分配
        </global-ts-button>
      </div>
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
        :data="clueCustomerList"
        @select="changeSelect"
        @select-all="changeSelect"
      >
        <el-table-column type="selection" width="55px" fixed :reserve-selection="true"></el-table-column>
        <el-table-column label="序号" min-width="50px" fixed>
          <template slot-scope="scope">
            {{ (pages.pageNow - 1) * pages.limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="姓名/昵称" prop="wxName" min-width="300px" class-name="contacts" fixed>
          <template slot-scope="scope">
            <div class="contactsContent" @click="showClueDetail(scope.row.id)">
              <global-ts-text-img :imgUrl="scope.row.wxHeadImgUrl" :imgText="scope.row.name || scope.row.wxName">
              </global-ts-text-img>
              <div class="contactsBox text_but1">
                {{ scope.row.name || scope.row.wxName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="item.name"
          :min-width="item.width + 'px'"
          v-for="(item, index) of initSelectedList"
          :key="item.field + index"
        >
          <template #header>
            <global-ts-tool-tips v-if="sortList.includes(item.field)" content="按顺序排序或按倒序排序">
              <div class="sortBar" @click="changeSortType(item.sortKey)">
                <span>{{ item.name }}</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanshang"
                    :class="{ isNotActive: currentSortField !== item.sortKey || requestParam.desc }"
                  ></global-ts-svg-icon>
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanxia"
                    :class="{ isNotActive: currentSortField !== item.sortKey || !requestParam.desc }"
                  ></global-ts-svg-icon>
                </span>
              </div>
            </global-ts-tool-tips>
            <span v-else>{{ item.name }}</span>
          </template>
          <template slot-scope="scope">
            <span class="table-cell-data">{{ getColumnName(item.field, scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="180px" fixed="right">
          <template #header>
            <div class="operate-table-header">
              <span>操作</span>
              <global-ts-svg-icon
                class="header-icon"
                name="icon-shezhi1616"
                color="#898989"
                hover-color="#333333"
                @click="showCustomFiled"
              ></global-ts-svg-icon>
            </div>
          </template>
          <template slot-scope="scope">
            <span
              class="text_but1"
              v-if="
                scope.row.isShowCustomer &&
                  isHaveVersion &&
                  $utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_SET_CLIENT)
              "
              @click="setViewerToCustomer([scope.row.id], 'single')"
            >
              置为客户
            </span>
            <span
              class="text_but1"
              v-if="
                isHaveVersion &&
                  scope.row.isShowRelease &&
                  $utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_GIVEUP_CLUE)
              "
              @click="releaseClue([scope.row.id], 'single')"
            >
              放弃线索
            </span>
            <span
              class="text_but1"
              v-if="isHaveVersion && scope.row.isShowPickup"
              @click="getMyClue([scope.row.id], 'single')"
            >
              领取
            </span>
            <span
              class="text_but1"
              v-if="isHaveVersion && scope.row.isShowDistribute"
              @click="beforeDistributeClue([scope.row.id], 'single')"
            >
              分配
            </span>
            <span v-if="!isHaveVersion" class="text_but1 disabled">升级后可操作</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-versionfunctip
        v-if="!isHaveVersion"
        func-text="当前版本无法查看完整信息"
        after-table
      ></global-ts-versionfunctip>
      <global-ts-pagination
        :table-data="clueCustomerList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParamTemp"
        @getData="changeTable"
      ></global-ts-pagination>
      <more-filter-dialog
        :dialog-visible.sync="moreFilterDialog"
        @sure="setMoreFilter"
        @reset="resetMoreFilter"
        @resetOneParam="setMoreFilter"
      ></more-filter-dialog>
      <ts-custom-file
        :init-all-filed-list="initAllFiledListTemp"
        :init-selected-list="initSelectedList"
        :dialog-visible.sync="customFiledDialogVisible"
        @changeSortSuccess="changeSortSuccess"
        @cancel="cancelCustomFiledDialog"
      ></ts-custom-file>
      <ts-clue-detail-dialog
        :customer-id="customerId"
        :page-value="pageValue"
        :clue-customer-list="clueCustomerList"
        :dialog-visible.sync="clueDetailDialogVisible"
        @beforeDistributeClue="beforeDistributeClue"
        @editClue="editClue"
        @releaseClue="releaseClue"
        @finish="reloadTable"
      ></ts-clue-detail-dialog>
      <release-clue-dialog
        :ids="releaseClueIds"
        :dialog-visible.sync="releaseClueDialogVisible"
        @sure="refreshPage"
      ></release-clue-dialog>
      <select-staff-dialog :dialog-visible.sync="selectStaffDialogVisible" @sure="distributeClue"></select-staff-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmpty, merge } from 'lodash';

// components
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsFilterList from '@/components/base/ts-filter-list/index.vue';
import TsCustomFile from '@/components/base/ts-custom-file/index.vue';
import TsClueDetailDialog from '@/components/base/ts-clue-detail-dialog/index.vue';
import MoreFilterDialog from './more-filter-dialog.vue';
import ReleaseClueDialog from './release-clue-dialog.vue';
import SelectStaffDialog from './select-staff-dialog.vue';

// utils
import { dom, exportExcel, confirm, clueCommTip, batchSetCustomer, getClue } from '@/utils';
import { getFieldList } from '../utils';

// api
import { client } from '@/api';

export default {
  name: 'CluePoolList',
  components: {
    TsFilterList,
    TsSelectList,
    TsCustomFile,
    TsClueDetailDialog,
    MoreFilterDialog,
    ReleaseClueDialog,
    SelectStaffDialog,
  },
  props: {
    pageName: {
      type: String,
    },
    pageValue: {
      // 0 - 我的线索, 1 - 全部线索, 2 - 线索公海
      type: Number,
    },
  },
  data() {
    return {
      scrollInfo: {
        hasHorizontalScroll: false, // 是否出现横向滚动条
        hasVerticalScroll: false, // 是否出现竖向滚动条
        width: 0, // 滚动条宽度
      },
      requestParam: {
        searchMoreArgs: '', // 手机/联系人/qq
        sid: -1,
        sidsJson: '', // 查询员工, [1,2,3]
        source: '', // 来源, 1 - 文章, 2 - 名片, 3 - 海报, 4 - 文件, 5 - 表单, 6 - 手动录入
        isReceived: '', // 线索是否被领取, 1 - 未领取, 2 - 已领取
        sortKey: 'optUpdateTime', // 更新时间倒序排列
        desc: true, // true - 倒序, false - 正序
      },
      moreRequestParam: {
        // 高级筛选
        wxMobile: '',
        qq: '',
        companyName: '',
        industry: '',
        province: '',
        city: '',
        county: '',
        lastVisitTimeStart: '',
        lastVisitTimeEnd: '',
        lastUpdateTimeStart: '',
        lastUpdateTimeEnd: '',
      },
      initRequestParam: {},
      isReload: false,
      customerId: 0, // 所打开的线索详情的id
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '/rest/manage/clueStat/getList',
      clueCustomerList: [],
      initSelectedList: [],
      sortList: [
        'optUpdateTimeName',
        'receiveTimeName',
        'allVisitClicksName',
        'allVisitTimeName',
        'viewerLastVisitTimeName',
        'createTimeName',
      ],
      sourceList: [],
      filterList: [],
      selectedIds: [], // 选择的线索id
      releaseClueIds: [], // 释放的线索idList
      distributeIds: [], // 分配线索idList
      currentSortField: 'optUpdateTime', // 当前排序的字段
      funcList: this.$route.meta.funcList, // 功能权限列表
      hasSelect: false,
      moreFilterDialog: false, // 是否显示更多筛选框
      customFiledDialogVisible: false,
      clueDetailDialogVisible: false,
      releaseClueDialogVisible: false, // 释放线索弹窗
      selectStaffDialogVisible: false, // 选择跟进人对话框
    };
  },
  computed: {
    ...mapState({
      staffInfo: state => state.user.info.staffInfo,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    ...mapGetters({
      isManage: 'user/isManage',
      getFunctionLimit: 'user/getFunctionLimit',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    initAllFiledList() {
      return getFieldList(this.pageValue);
    },
    initAllFiledListTemp() {
      return this.initAllFiledList.filter(item => {
        if (!this.isManage && item.field === 'staffName') {
          // 管理员才显示跟进人字段
          return false;
        }
        return this.initSelectedList.findIndex(subItem => subItem.field === item.field) === -1;
      });
    },
    requestParamTemp() {
      const moreRequestParamCopy = { searchType: this.pageValue }; // 线索池类型, 0 - 我的线索, 1 - 全部线索, 2 - 线索公海
      for (const key in this.moreRequestParam) {
        this.moreRequestParam[key] && (moreRequestParamCopy[key] = this.moreRequestParam[key]);
      }
      return { ...this.requestParam, ...moreRequestParamCopy };
    },
    isHaveVersion() {
      return this.getFunctionLimit('clueAnalyse').condition;
    },
    /**
     * @description 产品想要的效果，因为我们的滚动条不是在window上的，因此需要通过样式调整，去避免隐藏到滚动条
     * @author enson
     * @date 2021-03-31
     */
    getShowOperateBoxStyle() {
      let showOperateBoxStyle = '';
      if (this.scrollInfo.hasHorizontalScroll) {
        showOperateBoxStyle += `bottom:${this.scrollInfo.width}px;`;
      }
      return showOperateBoxStyle;
    },
  },
  created() {
    this.initRequestParam = { ...this.requestParam };
    this.getCustomFiledList(); // 查询自定义字段
    this.getSourceListDef(); // 获取来源列表
  },
  mounted() {
    this.getCheckScroll();
  },
  methods: {
    /**
     * 查询自定义字段
     * @author waldon
     * @date 2020-06-19
     */
    async getCustomFiledList() {
      this.initSelectedList = []; // 为了清空饿了么表格的列缓存
      const params = {
        type: this.pageValue === 2 ? 4 : 2, // 2为线索公海
      };

      const { getTsUserDefinedList } = client;
      const [err, res] = await getTsUserDefinedList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }

      const { isExistRecord, tsUserDefinedFieldList } = res.data;
      if (isExistRecord) {
        this.initSelectedList = tsUserDefinedFieldList;
        this.initSelectedList.forEach(item => {
          this.initAllFiledList.forEach(subItem => {
            if (item.field === subItem.field) {
              item.width = subItem.width;
              subItem.sortKey && (item.sortKey = subItem.sortKey);
            }
          });
        });
      } else {
        // 没有用过自定义字段的按默认的显示
        this.initSelectedList = this.initAllFiledList.filter(item => {
          return item.isShow;
        });
      }
      // 管理员才显示跟进人字段
      this.initSelectedList = this.initSelectedList.filter(item => !(!this.isManage && item.field === 'staffName'));
    },
    /**
     * 获取来源列表
     * @author waldon
     * @date 2020-07-23
     */
    async getSourceListDef() {
      const { getDef } = client;
      const [err, res] = await getDef();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.sourceList = [
        {
          key: 0,
          value: '全部',
        },
      ].concat(res.data.sourceList);
    },
    getCheckScroll() {
      this.$nextTick(() => {
        const targetNode = this.$refs.cluePoolList;
        const scrollNode = this.$refs.cluePoolList.parentNode.parentNode; // layout-inner__view -> layout-inner
        this.scrollInfo.hasHorizontalScroll = scrollNode.scrollWidth > scrollNode.clientWidth;
        this.scrollInfo.hasVerticalScroll = targetNode.scrollHeight > targetNode.clientHeight;
        if (this.scrollInfo.hasHorizontalScroll || this.scrollInfo.hasVerticalScroll) {
          this.scrollInfo.width = this.scrollInfo.width ? this.scrollInfo.width : dom.getScrollWidth(); // 获取滚动条宽度
        }
      });
    },
    /**
     * 改变选中数据
     * @author waldon
     * @date 2020/4/10
     */
    changeTable(data, res, pages) {
      this.clueCustomerList = data;
      this.pages = pages;
    },
    reloadTable() {
      this.isReload = true;
    },
    editClue(customerInfo = {}) {
      const isAdd = isEmpty(customerInfo);
      if (!isAdd) {
        customerInfo.viewerId = customerInfo.clueId;
        customerInfo.region = customerInfo.wxProvince + ',' + customerInfo.wxCity + ',' + customerInfo.county;
      }
      customerInfo = merge(
        {
          name: '', // 姓名
          wxMobile: '', // 电话
          intention: 0, // 意向度
          remark: '', // 线索的备注信息
          companyName: '', // 公司名称
          region: '', // 省市区
          industry: 0, // 行业
          address: '', // 详细地址
          wxSex: 0, // 性别
          qq: '', // QQ
          viewerId: 0, // 访客id（对应线索表 clueId 字段）
          id: 0,
          sid: this.staffInfo?.sid, // 跟进人id
          sidName: this.staffInfo?.name, // 跟进人名字
        },
        customerInfo,
      );
      this.$pubsub.one('editClue', fn => {
        fn(customerInfo, isAdd);
      });
      this.$emit('editClue');
    },
    /**
     * @description 重置参数
     * @author enson
     * @date 2021-03-08
     */
    resetParam() {
      this.requestParam = { ...this.initRequestParam };
      this.$refs.staffTree && this.$refs.staffTree.clearSelected(); // 清空组织树
      this.reloadTable();
    },
    /**
     * @description 高级筛选
     * @author enson
     * @date 2021-03-08
     */
    showMoreFilter() {
      this.$utils.logDog('moreFilter_show');
      this.moreFilterDialog = true;
    },
    async onExportExcel() {
      const { getList } = client;
      const [err, res] = await getList({
        searchType: this.pageValue,
        limit: 20000,
        ...this.requestParamTemp,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = res.data;
      excelList.forEach(item => {
        item.wxNameAndName = item.name || item.wxName;
      });
      const keyJson = {
        wxNameAndName: '姓名/昵称',
      };
      this.initSelectedList.forEach(item => {
        keyJson[item.field] = item.name;
      });
      exportExcel(excelList, '全部线索', keyJson);
    },
    /**
     * 设置请求参数
     * @author waldon
     * @date 2020-06-18
     * @param {Object} moreRequestParam
     */
    setMoreFilter(moreRequestParam, filterList) {
      filterList && (this.filterList = [].concat(filterList));
      this.moreRequestParam = { ...moreRequestParam };
      this.reloadTable();
    },
    /**
     * 重置高级筛选
     * @author waldon
     * @date 2020-06-18
     * @param {Object} initMoreRequestParam - 重置后的条件
     */
    resetMoreFilter(initMoreRequestParam, reflesh = false) {
      this.moreRequestParam = { ...initMoreRequestParam };
      if (reflesh) this.reloadTable();
    },
    clearFilter(keys, id) {
      if (!id) {
        // 清除所有更多筛选项, 相当于重置的操作
        this.filterList = [];
        this.$pubsub.emit('moreFilterReset', true);
      } else {
        this.filterList = this.filterList.filter(item => item.id !== id);
        this.$pubsub.emit('moreFilterResetOneParam', keys);
      }
    },
    /**
     * 改变选中数据
     * @author waldon
     * @date 2020/4/10
     * @param {Array} selection - 选中数据
     */
    changeSelect(selection) {
      this.selectedIds = selection.map(item => item.id);
      this.hasSelect = true;
    },
    /**
     * @description 重置勾选框
     * @author enson
     * @date 2021-03-25
     */
    resetMoreSelect() {
      this.$refs.sortTable.clearSelection();
      this.selectedIds = [];
      this.hasSelect = false;
    },
    /**
     * 置为客户
     * @author waldon
     * @date 2020-06-19
     * @param {Array} ids - 被选中的访客id
     * @param {String} type - 单个/多个
     */
    async setViewerToCustomer(ids, type) {
      this.$utils.logDog(type === 'single' ? 'setViewerToCustomerSingle_click' : 'setViewerToCustomer_click');
      if (!(ids && ids.length)) {
        this.$utils.postMessage({
          type: 'error',
          message: '请先勾选要操作的数据',
        });
        return;
      }
      await batchSetCustomer(ids);
      this.refreshPage();
    },
    /**
     * 释放线索
     * @author waldon
     * @date 2020-06-19
     * @param {Array} ids - 被选中的访客id
     * @param {String} type - 单个/多个
     */
    releaseClue(ids, type) {
      type && this.$utils.logDog(type === 'single' ? 'releaseSingle_click' : 'release_click');
      if (!(ids && ids.length)) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请先勾选要操作的数据',
        });
      }
      this.releaseClueIds = ids;
      this.releaseClueDialogVisible = true;
    },
    /**
     * @description 在线索公海上领取线索
     * @author enson
     * @date 2021-03-08
     * @param {Array} ids - 被选中的访客id
     */
    async getMyClue(ids) {
      await getClue(ids);
      this.refreshPage();
    },
    /**
     * 分配线索
     * @author waldon
     * @date 2020-06-19
     * @param {Array} ids - 被选中的访客id
     */
    beforeDistributeClue(ids) {
      this.distributeIds = ids;
      this.$utils.logDog('distribute_click');
      if (!(ids && ids.length)) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请先勾选要操作的数据',
        });
      }
      this.selectStaffDialogVisible = true;
    },
    /**
     * 选择跟进人后的回调
     * @author waldon
     * @date 2020-06-19
     * @param {Object} staff - 跟进人
     */
    distributeClue(staff) {
      confirm(`确定将选中的线索分配给${staff.name}`).then(async () => {
        const { distributeClue } = client;
        const [err, res] = await distributeClue({
          idListJson: JSON.stringify(this.distributeIds),
          sid: staff.sid,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        clueCommTip(res.data);
        this.refreshPage();
      });
    },
    /**
     * 格式化显示
     * @author waldon
     * @date 2020-07-23
     * @param {String} columnField - 字段
     * @param {Object} rowData - 行数据
     */
    getColumnName(columnField, rowData) {
      if (!rowData[columnField]) {
        return '-';
      } else if (columnField == 'staffName') {
        return this.$utils.showStaffName(this.tsStaffExtraList, rowData.sid, rowData[columnField]);
      }
      return rowData[columnField];
    },
    /**
     * 展示详情对话框
     * @author waldon
     * @date 2020-06-19
     * @param {Number} id - 线索id
     */
    showClueDetail(id) {
      if (!this.isHaveVersion) return;
      this.$utils.logDog('clueDetail_click');
      this.$utils.logDog('clueDetail_show');
      this.clueDetailDialogVisible = true;
      this.customerId = id;
    },
    /**
     * 改变排序
     * @author waldon
     * @date 2020-06-15
     * @param {String} type - 排序类型
     */
    changeSortType(type) {
      this.currentSortField = type;
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
    /**
     * 设置展示项
     * @author waldon
     * @date 2020-06-17
     */
    showCustomFiled() {
      this.$utils.logDog('fieldDefine_show');
      this.customFiledDialogVisible = true;
    },
    /**
     * 排序成功回调
     * @author waldon
     * @date 2020-06-18
     * @param {Object} selectData - 已选择的数据
     */
    async changeSortSuccess(selectData) {
      const { batchSetTsUserDefinedList } = client;
      const [err, res] = await batchSetTsUserDefinedList({
        fieldJson: selectData.fieldJson,
        type: this.pageValue === 2 ? 4 : 2, // 2为线索池
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.logDog('fieldDefine_save');
      this.customFiledDialogVisible = false;
      this.getCustomFiledList();
    },
    /**
     * 关闭对话框的回调
     * @author waldon
     * @date 2020-07-13
     */
    cancelCustomFiledDialog() {
      this.$utils.logDog('fieldDefine_close');
    },
    /**
     * @description : 重置筛选项并刷新表格
     * @author      : turbo
     * @Date        : 2021-06-24 15:43:45
     */
    refreshPage() {
      this.clueDetailDialogVisible = false;
      this.resetMoreSelect();
      this.reloadTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.clue-pool-list {
  .pro_listBox {
    &.hasSelect {
      padding-bottom: 70px;
    }
  }

  .clue-filter-box {
    margin: 20px 0;
  }

  .search-box {
    @include flex-left;

    > * + * {
      margin-left: 10px;
    }
  }

  .table-cell-data {
    @include line-clamp(2);
  }

  .sub-operate-box {
    @include flex-left;

    position: fixed;
    right: 0;
    bottom: 0;
    left: 272px;
    z-index: 100;
    height: 50px;
    padding: 8px 20px;
    background: $color-ff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  }

  .select-desc {
    @include flex-center;

    margin-right: 32px;
    font-size: 14px;
    color: $color-53;

    .select-number {
      color: $primary-color;
    }

    .cancel-select {
      margin-left: 16px;
      color: $primary-color;
      cursor: pointer;
    }
  }
}
</style>

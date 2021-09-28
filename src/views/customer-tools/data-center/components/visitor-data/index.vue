<!--
 * @Author       : ADI
 * @Date         : 2021-05-24 11:16:04
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-01 09:31:18
-->
<template>
  <div class="visitorData">
    <div class="qrCode_box"></div>
    <div class="visitorAnalyse_main">
      <div class="pro_line">
        <fa-input
          v-if="requestParam.status == 1"
          style="width: 120px;"
          v-model="requestParam.articleId"
          placeholder="文章id"
          @keyup.enter.native="reloadDataList"
        >
        </fa-input>
        <fa-input
          v-if="requestParam.status == 1"
          style="width: 120px;"
          v-model="requestParam.mobile"
          placeholder="手机号码"
          @keyup.enter.native="reloadDataList"
        >
        </fa-input>
        <global-ts-search-select
          class="workList searchSelect"
          v-if="requestParam.status == 1 && isCanSelect && false"
          :selectkey="{ label: 'name', value: 'sid' }"
          :list.sync="visitorResponsibility.workList"
          :selectVal="requestParam.sid"
          v-model="requestParam.sids"
        >
        </global-ts-search-select>
        <ts-select-list
          class="workList searchSelect"
          v-if="requestParam.status == 1 && isCanSelect"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        >
        </ts-select-list>
        <global-ts-select
          class="workList"
          :list="visitorResponsibility.sourceList"
          v-model="requestParam.source"
          :selectkey="{ label: 'key', value: 'value' }"
        >
        </global-ts-select>
        <global-ts-select
          class="workList"
          :list="visitorResponsibility.phoneTypeList"
          v-model="requestParam.isAuthorizeMobile"
          :selectkey="{ label: 'key', value: 'value' }"
        >
        </global-ts-select>
        <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="reloadDataList" ref="button">
          搜索
        </global-ts-button>
        <global-ts-button
          v-if="isFreeVer"
          type="primary"
          size="small"
          icon="icon-daochu"
          ref="button"
          @click="onExportExcel"
          >导出
        </global-ts-button>
      </div>
      <div class="analyseBox" v-if="requestParam.status == 2">
        <div>
          <div></div>
          <p>xxx</p>
          <span>转发文章数量</span>
        </div>
        <div>
          <div></div>
          <p>xxx</p>
          <span>注册客户数量</span>
        </div>
        <div>
          <div></div>
          <p>xxx</p>
          <span>成交客户数量</span>
        </div>
        <div>
          <div></div>
          <p>xxx</p>
          <span>成交客户金额</span>
        </div>
      </div>
      <div class="showVisitorList">
        <el-table
          :class="'tshu-tableset'"
          :data="visitorResponsibility.visitorList"
          border
          min-width="1010px"
          header-row-class-name="employeeHeader"
          cell-class-name="cellStyle"
        >
          <el-table-column
            v-if="requestParam.status == 1"
            prop="wxName"
            label="微信名称"
            min-width="60"
          ></el-table-column>
          <el-table-column label="成员" min-width="60" prop="staffName">
            <template slot-scope="scope">
              {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
            </template>
          </el-table-column>
          <el-table-column label="来源" min-width="60" prop="sourceName"></el-table-column>
          <el-table-column label="手机号码" min-width="95" prop="wxMobile"></el-table-column>
          <el-table-column
            v-if="(requestParam.status == 1) & false"
            prop="firstVisitTimeName"
            label="首次浏览时间"
            min-width="95"
          >
            <template #header>
              <div class="sortBar" @click="changeSortType('firstVisitTime')">
                <span class="nextTimeBaby">首次浏览时间</span>
                <span class="sortArrow">
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 1 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 2 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="requestParam.status == 1" prop="lastVisitTimeName" label="最近浏览时间" min-width="95">
            <template #header>
              <div class="sortBar" @click="changeSortType('lastVisitTime')">
                <span class="nextTimeBaby">最近浏览时间</span>
                <span class="sortArrow">
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 3 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 4 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="requestParam.status == 1" prop="clicks" label="总次数" min-width="70">
            <template #header>
              <div class="sortBar" @click="changeSortType('clicks')">
                <span class="nextTimeBaby">总次数</span>
                <span class="sortArrow">
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 5 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 6 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="requestParam.status == 1"
            prop="readTimesSecond"
            label="总时长"
            min-width="70"
            :formatter="timeFormat"
          >
            <template #header>
              <div class="sortBar" @click="changeSortType('readTimesSecond')">
                <span class="nextTimeBaby">总时长</span>
                <span class="sortArrow">
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 7 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 8 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="requestParam.status == 1"
            prop="tdClicks"
            label="今日次数"
            min-width="50"
          ></el-table-column>
          <el-table-column
            v-if="requestParam.status == 1"
            prop="tdReadTimesSecond"
            label="今日时长"
            min-width="90"
            :formatter="timeFormat"
          ></el-table-column>
          <el-table-column prop="shares" label="转发次数" min-width="80">
            <template #header>
              <div class="sortBar" @click="changeSortType('shares')">
                <span class="nextTimeBaby">转发次数</span>
                <span class="sortArrow">
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 9 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true" :class="requestParam.sort == 10 ? '' : 'isNotActive'">
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="requestParam.status == 1"
            prop="isQualityName"
            label="精准用户"
            min-width="50"
          ></el-table-column>
          <el-table-column
            v-if="requestParam.status == 2"
            prop="transmitNum"
            label="转发文章数量"
            sortable
            min-width="80"
          ></el-table-column>
          <el-table-column
            v-if="requestParam.status == 2"
            prop="registeNum"
            label="注册客户数量"
            sortable
            min-width="80"
          ></el-table-column>
          <el-table-column
            v-if="requestParam.status == 2"
            prop="dealNum"
            label="成交客户数量"
            sortable
            min-width="80"
          ></el-table-column>
          <el-table-column
            v-if="requestParam.status == 2"
            prop="dealTotal"
            label="成交客户金额"
            sortable
            min-width="80"
          ></el-table-column>
          <el-table-column v-if="requestParam.status == 1" label="操作" min-width="50">
            <template slot-scope="scope">
              <span
                class="tanshu_linkColor"
                @click="showDataInfo(scope.row.id, scope.row.wxName, scope.row.isQualityName, scope.row.wxMobile)"
                >详情
              </span>
            </template>
          </el-table-column>
          <template slot="empty">
            <global-ts-nodata :isDefaultText="!isFreeVer">
              <p>暂无访客数据，请前往小程序端分享文章或名片<a class="st_seeGuide" @click="toShare">去分享</a></p>
            </global-ts-nodata>
          </template>
        </el-table>
      </div>
      <global-ts-pagination
        :tableData="visitorResponsibility.visitorList"
        :requestParam="requestParam"
        :isReload.sync="visitorResponsibility.isReload"
        :errorHandle="handleNoData"
        @getData="changeTable"
        :httpurl="visitorResponsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getWorkerList } from '@/utils';
import qrBoxDialogVm from '../qr-box-dialog/index.vue';
import Vue from 'vue';
import TsDataInfoVm from '@/components/base/ts-data-info/index.vue';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import {
  recordClick,
  logDog,
  post,
  postMessage,
  exportExcel,
  setSearchDate,
  postLimitVer,
  getLimitTips,
} from '@/utils';

export default {
  name: 'visitor-data',
  components: { TsSelectList },
  props: {
    articleParams: {
      type: Object,
      default: () => {},
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // isShow: true,
      visitorResponsibility: {
        visitorList: [],
        isReload: false, //是否加载
        httpurl: '', //请求地址
        firstReadingList: [
          {
            key: 1,
            value: '首次浏览时间',
          },
          {
            key: 2,
            value: '最近浏览时间',
          },
        ],
        resonsibilityStatusDef: [
          {
            key: '访客分析',
            value: 1,
          },
        ],
        workList: [], // 工作人员信息
        sourceList: [
          {
            key: '全部来源',
            value: 0,
          },
          {
            key: '文章',
            value: 1,
          },
          {
            key: '名片',
            value: 2,
          },
          {
            key: '海报',
            value: 3,
          },
          {
            key: '表单',
            value: 5,
          },
        ],
        phoneTypeList: [
          {
            key: '全部访客',
            value: 0,
          },
          {
            key: '已授权手机',
            value: 1,
          },
          {
            key: '未授权手机',
            value: 2,
          },
        ],
      },

      requestParam: {
        status: 1,
        sid: -1, //跟进员工
        source: 0,
        isAuthorizeMobile: 0,
        time: '',
        mobile: '',
        articleId: '',
        tiemType: 1,
        timeStart: '',
        timeEnd: '',
        sort: 4,
      },
      beforeLoading: {
        haveLoadStatus: false, //是否已经load了状态
        haveLoadStaff: false, //是否已经load了销售员
      },
      dataInfo: null,
      qrDialog: null,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      userInfo: state => state.user.info,
      functionInfo: state => state.globalData?.functionInfo,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    isFreeVer() {
      return this.functionInfo.viewerList.condition || false;
    },
  },
  watch: {
    'requestParam.time'(newVal) {
      this.requestParam.timeStart = newVal ? newVal[0] : '';
      this.requestParam.timeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {},
  activated() {
    this.requestParamDefaultValue();
    //enter
    recordClick({
      dogId: 100029,
      srcId: 6,
    });
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key === 13) {
        _self.reloadDataList();
      }
    };
    this.requestParam.status = 1; // 默认为访客分析

    this.countIsInitFinish('haveLoadStatus');

    if (this.articleParams.id && this.articleParams.isToView == 1) {
      // 替换路由参数为articleParams
      this.requestParam.articleId = this.articleParams.id;
      this.requestParam.sid = this.articleParams.sid;
    }
    if (this.isCanSelect) {
      getWorkerList().then(list => {
        this.countIsInitFinish('haveLoadStaff');
        this.visitorResponsibility.workList = list[0];
        this.visitorResponsibility.workList = this.visitorResponsibility.workList.filter(item => item.sid != 0);
        if (list[1] == 2) {
          //成员
          this.requestParam.sid = this.visitorResponsibility.workList.sid;
        }
      });
    } else {
      this.countIsInitFinish('haveLoadStaff');
    }
    this.$nextTick(() => {
      this.visitorResponsibility.httpurl = '/ajax/viewer/tsViewer_h.jsp?cmd=getTsViewerList';
      this.reloadTable();
    });
  },
  mounted() {},
  methods: {
    /**
     *重置时间
     *
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.time = val;
    },
    toShare() {
      if (!this.qrDialog) {
        const qrBoxDialogVmConstructor = Vue.extend(qrBoxDialogVm);
        this.qrDialog = new qrBoxDialogVmConstructor({}).$mount('.qrCode_box');
      }
      this.qrDialog.open();
    },
    handleNoData(data) {
      getLimitTips('viewerAnalyse').then(info => {
        if (data.rt == info.rt) {
          // postLimitVer(info.msg);
        } else {
          postMessage({
            type: 'error',
            message: data.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    timeFormat: function(row, column, timeInfo) {
      let timeLong;
      if (timeInfo) {
        timeLong = timeInfo;
      } else if (row && column) {
        timeLong = row[column.property];
      }
      const hour = Math.floor(timeLong / 3600);
      const seconds = timeLong % 60;
      const minutes = (timeLong - hour * 3600 - seconds) / 60;
      const time =
        hour == 0
          ? minutes == 0
            ? seconds == 0
              ? '0'
              : seconds + '秒'
            : minutes + '分' + seconds + '秒'
          : hour + '时' + minutes + '分' + seconds + '秒';
      return time;
    },
    dateFormat: function(row, column, dateInfo) {
      let date;
      if (dateInfo) {
        date = new Date(dateInfo);
      } else if (row && column) {
        var date1 = row[column.property];
        date = new Date(date1);
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
      const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
      const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
      const date2 = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return date2;
    },
    // 导出数据
    onExportExcel() {
      // 导出之后把limit设置回原来的数值
      var limit = this.requestParam.limit;
      this.requestParam.limit = 20000;
      post('/ajax/viewer/tsViewer_h.jsp?cmd=getTsViewerList', this.requestParam).then(response => {
        if (response && response.success) {
          var excelList = response.data;
          excelList.forEach(data => {
            data.firstVisitTimeName = this.dateFormat(0, 0, data.firstVisitTimeName);
            data.lastVisitTimeName = this.dateFormat(0, 0, data.lastVisitTimeName);
            if (data.readTimesSecond != 0) {
              data.readTimesSecond = this.timeFormat(0, 0, data.readTimesSecond);
            }
            if (data.tdReadTimesSecond != 0) {
              data.tdReadTimesSecond = this.timeFormat(0, 0, data.tdReadTimesSecond);
            }
          });
          var keyJson = {
            wxName: '微信名称',
            staffName: '成员',
            sourceName: '来源',
            wxMobile: '手机号码',
            lastVisitTimeName: '最近浏览时间',
            clicks: '总次数',
            readTimesSecond: '总时长',
            tdClicks: '今日次数',
            tdReadTimesSecond: '今日时长',
            shares: '转发次数',
            isQualityName: '精准用户',
          };
          exportExcel(excelList, '访客数据', keyJson);
        } else {
          getLimitTips('viewerAnalyse').then(info => {
            if (response.rt == info.rt) {
              postLimitVer(info.msg);
            } else {
              postMessage({
                type: 'error',
                message: response.msg || '网络错误，请稍候重试',
              });
            }
          });
        }
      });
      this.requestParam.limit = limit;
    },
    // 等待销售员列表、状态库加载完成才能发起请求
    countIsInitFinish(value) {
      this.beforeLoading[value] = true;
    },
    //重载页面
    reloadTable: function() {
      this.visitorResponsibility.isReload = true;
    },
    //订阅数据请求成功事件
    changeTable: function(data) {
      this.visitorResponsibility.visitorList = data;
    },
    //查看详情
    showDataInfo: function(id, name, isQualityName, wxMobile) {
      logDog('dataCenter_showDataInfo');
      // var timeStart = Ts_util.format.date(Ts_util.format.subDate(new Date(), 30, 'days'), 'yyyy-MM-dd')
      // 默认查询时间改为一年
      // var timeStart = Ts_util.format.date(Ts_util.format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd')
      // var timeEnd = Ts_util.format.date(new Date(), 'yyyy-MM-dd');
      // 判断对象是否存在
      if (!this.dataInfo) {
        const TsDataInfoVmConstructor = Vue.extend(TsDataInfoVm);
        this.dataInfo = new TsDataInfoVmConstructor({}).$mount('#ts-dataInfo');
        this.dataInfo.requestParam.articleId = this.requestParam.articleId;
        this.dataInfo.requestParam.viewerId = id;
        this.dataInfo.parent = this.$parent;
        // this.dataInfo.requestParam.time = [timeStart, timeEnd];
        // this.dataInfo.requestParam.timeStart = timeStart;
        // this.dataInfo.requestParam.timeEnd = timeEnd;
        this.dataInfo.name = name;
        this.dataInfo.wxMobile = wxMobile;
        this.dataInfo.isQualityName = isQualityName;
      } else {
        this.dataInfo.requestParam.articleId = this.requestParam.articleId;
        this.dataInfo.requestParam.viewerId = id;
        // this.dataInfo.requestParam.time = [timeStart, timeEnd];
        // this.dataInfo.requestParam.timeStart = timeStart;
        // this.dataInfo.requestParam.timeEnd = timeEnd;
        this.dataInfo.name = name;
        this.dataInfo.wxMobile = wxMobile;
        this.dataInfo.isQualityName = isQualityName;
      }
      this.dataInfo.isShow = true;
      this.$emit('update:isShow', false);
    },
    //加载
    reloadDataList: function() {
      this.requestParam = Object.assign({}, this.requestParam);
      setSearchDate({
        name: ['time'],
        form: this.requestParam,
      });
      if (this.requestParam.time == null) {
        postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.visitorResponsibility.isReload = true;
      }
    },
    changeSortType(row) {
      switch (row) {
        case 'firstVisitTime':
          this.requestParam.sort = this.requestParam.sort == 1 ? 2 : 1;
          break;
        case 'lastVisitTime':
          this.requestParam.sort = this.requestParam.sort == 3 ? 4 : 3;
          break;
        case 'clicks':
          this.requestParam.sort = this.requestParam.sort == 5 ? 6 : 5;
          break;
        case 'readTimesSecond':
          this.requestParam.sort = this.requestParam.sort == 7 ? 8 : 7;
          break;
        case 'shares':
          this.requestParam.sort = this.requestParam.sort == 9 ? 10 : 9;
          break;
        default:
          this.requestParam.sort = 2;
      }
      this.visitorResponsibility.isReload = true;
    },
    /**
     * @description : 设置requestParam默认值
     * @author      : ADI
     * @Date        : 2021-05-24 15:00:30
     * @param        {*}
     * @return       {*}
     */
    requestParamDefaultValue() {
      this.requestParam.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    },
  },
};
</script>

<style lang="scss" scoped>
.visitor-data {
}
</style>

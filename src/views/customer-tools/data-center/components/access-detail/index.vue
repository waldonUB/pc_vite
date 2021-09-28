<!--
 * @Author       : ADI
 * @Date         : 2021-05-24 11:16:27
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-04 16:41:26
-->
<template>
  <div class="accessDetail">
    <div class="qrCode_box"></div>
    <div class="accessDetail_main">
      <div class="pro_line">
        <ts-select-list
          v-if="isCanSelect"
          class="workList searchSelect floatLeft"
          :isStrParam="true"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        ></ts-select-list>
        <fa-input
          style="width: 200px;"
          v-model="requestParam.title"
          @keyup.enter.native="reloadDataList"
          placeholder="文章标题"
        ></fa-input>
        <global-ts-date-picker
          @updateTime="getSearchTime"
          defaultStartTime="year"
          clear-icon="delete-solid"
        ></global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadDataList">
          搜索
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
          导出
        </global-ts-button>
      </div>
      <div class="accessDetail">
        <el-table
          ref="tab"
          :data="accessResponsibility.formTableList"
          border
          cell-class-name="cellStyle"
          header-row-class-name="employeeHeader"
          box-sizing="border-box"
        >
          <el-table-column label="微信名称" min-width="60" prop="wxName"></el-table-column>
          <el-table-column label="成员" min-width="60" prop="staffName">
            <template slot-scope="scope">
              {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
            </template>
          </el-table-column>
          <el-table-column label="文章标题" min-width="60" prop="dataTitle"></el-table-column>
          <el-table-column label="访问时间" min-width="60" prop="createTimeName">
            <template #header>
              <div class="sortBar" @click="changeSortType('createTime')">
                <span class="nextTimeBaby">访问时间</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="阅读时长" min-width="60" prop="visitTimeName">
            <template #header>
              <div class="sortBar" @click="changeSortType('visitTime')">
                <span class="nextTimeBaby">阅读时长</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'visitTime' && !requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanshang"
                    :size="14"
                  />
                  <global-ts-svg-icon
                    class="icon"
                    :class="requestParam.sortKey === 'visitTime' && requestParam.desc ? '' : 'isNotActive'"
                    name="icon-shaixuanxia"
                    :size="14"
                  />
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="精准用户" min-width="60" prop="isQualityName"></el-table-column>
          <template slot="empty">
            <div :class="{ noSroll: headerNumer < 5 }">
              暂无访问数据 <a class="showQrDialog" @click="toShare">去分享</a>
            </div>
          </template>
        </el-table>

        <global-ts-versionfunctip
          v-if="isFreeVersion && accessResponsibility.formTableList.length > 0"
          funcText="当前版本无法查看完整信息"
          afterTable
        ></global-ts-versionfunctip>
      </div>
      <global-ts-pagination
        :tableData="accessResponsibility.formTableList"
        :requestParam="requestParam"
        :isReload.sync="accessResponsibility.isReload"
        @getData="changeTable"
        :httpurl="accessResponsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import versionDef from '@/config/version-def';
import qrBoxDialogVm from '../qr-box-dialog/index.vue';
import Vue from 'vue';
import { getWorkerList, postMessage, exportExcel } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getTsViewerRecordStat } from '@/api/modules/views/customer-tools/data-center';

export default {
  name: 'access-detail',
  components: { TsSelectList },
  props: {
    articleParams: {
      // 请求的文章数据
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      qrDialog: null, //点击去分享弹窗
      accessResponsibility: {
        workList: [], // 员工列表
        isReload: false, // 是否重新加载数据
        httpurl: '', // 请求数据的地址
        formTableList: [], // 表格数据
        initTime: '',
      },
      sid: -1,
      requestParam: {
        sortKey: 'createTime', // 排序
        type: 100, // 查看类型
        sids: '', // 成员
        title: '', // 文章标题
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
        searchOne: false, // 是否精确搜索
        desc: true,
      },
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
      addressUrl: state => state.globalData.addressUrl,
    }),
    headerNumer() {
      let header = this.accessResponsibility.formTableList.formHeader;
      header = (header && Object.keys(header)) || [];
      console.log(header);
      return header.length;
    },
    isFreeVersion() {
      return versionDef.checkIsFree();
    },
    updateVersionUrl() {
      return this.addressUrl?.updateVersionUrl;
    },
  },
  watch: {},
  created() {},
  async activated() {
    this.requestParamDefaultValue();
    if (this.articleParams) {
      // 从文章数据-访问明细点击跳转过来的
      this.requestParam.title = this.articleParams.title ? this.articleParams.title : '';
      this.requestParam.searchOne = true; // 精确搜索
      if (this.articleParams.sid) {
        // 从员工数据-数据跳转过来的
        const sids = [];
        sids.push(this.articleParams.sid);
        this.requestParam.sids = JSON.stringify(sids);
        this.sid = this.articleParams.sid;
      }
    }
    await this.getWorkList();
    this.accessResponsibility.httpurl = '/rest/manage/viewerRecord/getTsViewerRecordStat'; // 请求表格数据接口地址
    this.reloadDataList();
  },
  mounted() {},
  methods: {
    /**
     * 获取员工列表
     * @author lymn
     * @date 2020-07-07
     * @returns {Promise}
     */
    getWorkList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            this.accessResponsibility.workList = list[0];
            this.accessResponsibility.workList = this.accessResponsibility.workList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //成员
              // this.requestParam.sid = this.accessResponsibility.workList.sid;
              this.id = this.accessResponsibility.workList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 重新加载数据
     * @author lymn
     * @date 2020-07-07
     */
    reloadDataList() {
      this.requestParam.searchOne = false; // 模糊搜索
      this.accessResponsibility.isReload = true;
    },
    /**
     * 导出
     * @author lymn
     * @date 2020-07-07
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, response] = await getTsViewerRecordStat(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = response.data;
      const keyJson = {
        wxName: '微信名称',
        staffName: '成员',
        dataTitle: '文章标题',
        createTimeName: '访问时间',
        visitTimeName: '阅读时长',
        isQualityName: '精准用户',
      };
      exportExcel(excelList, '访问明细', keyJson);
    },
    /**
     * 获取请求时间
     * @author lymn
     * @date 2020-07-07
     * @param {Array} val 数组存放开始时间和结束时间
     */
    getSearchTime(val) {
      this.accessResponsibility.initTime = val;
      this.requestParam.createTimeStart = val[0];
      this.requestParam.createTimeEnd = val[1];
    },
    /**
     * 弹出分享弹窗
     * @author lymn
     * @date 2020-07-07
     */
    toShare() {
      if (!this.qrDialog) {
        const qrBoxDialogVmConstructor = Vue.extend(qrBoxDialogVm);
        this.qrDialog = new qrBoxDialogVmConstructor({}).$mount('.qrCode_box');
      }
      this.qrDialog.open();
    },
    /**
     * 获取请求数据
     * @author lymn
     * @date 2020-07-07
     * @param {Array} data 访问明细数据
     */
    changeTable(data) {
      this.accessResponsibility.formTableList = data;
      console.log(this.accessResponsibility.formTableList, 'data==');
    },
    /**
     * 访问时间顺序调换
     * @author lymn
     * @date 2020-07-07
     * @param {String} type 属性类型
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.accessResponsibility.isReload = true;
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
.access-detail {
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-06-30 16:17:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 17:01:12
-->
<template>
  <div class="accessDetail">
    <div class="pro_line">
      <ts-select-list
        class="floatLeft"
        v-if="isCanSelect"
        :isStrParam="true"
        :depIdList.sync="requestParam.depIdList"
        :sids.sync="requestParam.sids"
      >
      </ts-select-list>
      <fa-input
        style="width: 200px;"
        v-model="requestParam.title"
        placeholder="表单标题"
        @keyup.enter.native="reloadFormData"
      >
      </fa-input>
      <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
      <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadFormData">
        搜索
      </global-ts-button>
      <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
        导出
      </global-ts-button>
    </div>
    <div class="accessDetail">
      <el-table
        ref="tab"
        :data="formResponsibility.formTableList"
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
        <el-table-column label="表单标题" min-width="60" prop="dataTitle"></el-table-column>
        <el-table-column label="访问时间" min-width="60" prop="createTimeName">
          <template #header>
            <div class="sortBar" @click="changeSortType('createTime')">
              <span class="nextTimeBaby">访问时间</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="requestParam.sortKey === 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="requestParam.sortKey === 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否提交" min-width="60" prop="hasCommit"></el-table-column>
        <template slot="empty">
          <div :class="{ noSroll: headerNumer < 5 }">
            暂无访问数据 <a class="showQrDialog" @click="toShare">去分享</a>
          </div>
        </template>
      </el-table>
      <div class="tanshu-freeTip" v-if="isFreeVersion">
        <global-ts-versionfunctip funcText="当前版本无法查看完整信息"></global-ts-versionfunctip>
      </div>
    </div>
    <global-ts-pagination
      ref="formPagination"
      :tableData="formResponsibility.formTableList"
      :requestParam="requestParam"
      :isReload.sync="formResponsibility.isReload"
      @getData="changeTable"
      :httpurl="formResponsibility.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { getWorkerList, exportExcel } from '@/utils';
import { getTsViewerRecordStat } from '@/api/modules/views/customer-tools/form-data';

export default {
  name: 'access-detail',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      sid: -1, //跟进员工
      requestParam: {
        sortKey: 'createTime', // 排序
        type: 400, // 查看类型
        sids: '', // 成员
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
        title: '', // 表单标题
        desc: true,
      },
      formResponsibility: {
        staffList: [], // 员工列表
        formTableList: [], // 表单数据列表 -> 即表格的数据
        isReload: false,
        initTime: '', // 默认选中时间
        httpurl: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth', // 是否是管理员
    }),
    ...mapState({
      userInfo: state => state.user.info,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl,
    }),
    isFreeVersion() {
      return versionDef.checkIsFree();
    },
    headerNumer() {
      let header = this.formResponsibility.formTableList.formHeader;
      header = (header && Object.keys(header)) || [];
      console.log(header);
      return header.length;
    },
  },
  watch: {},
  async activated() {
    await this.getTsStaffList();
    this.formResponsibility.httpurl = '/rest/manage/viewerRecord/getTsViewerRecordStat'; // 请求表格数据接口地址
    this.reloadFormData();
  },
  created() {
    this.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
  },
  mounted() {},
  methods: {
    /**
     * 重新加载数据
     * @author lymn
     * @date 2020-07-06
     */
    reloadFormData: function() {
      this.formResponsibility.isReload = true; // 会触发changeTable事件
    },
    /**
     * 获取请求时间
     * @author lymn
     * @date 2020-07-06
     * @param {Array} val 数组存放开始和结束时间
     */
    getSearchTime: function(val) {
      this.formResponsibility.initTime = val;
      this.requestParam.createTimeStart = val[0];
      this.requestParam.createTimeEnd = val[1];
    },
    /**
     * 获取员工列表
     * @author lymn
     * @date 2020-07-06
     * @returns {Promise}
     */
    getTsStaffList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            this.formResponsibility.staffList = list[0];
            this.formResponsibility.staffList = this.formResponsibility.staffList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //成员
              this.sid = this.formResponsibility.staffList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 导出
     * @author lymn
     * @date 2020-07-06
     */
    //review
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, response] = await getTsViewerRecordStat(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = response.data;
      const keyJson = {
        wxName: '微信名称',
        staffName: '成员',
        dataTitle: '表单标题',
        createTimeName: '访问时间',
        hasCommit: '是否提交',
      };
      exportExcel(excelList, '访问明细', keyJson);
    },
    /**
     * 获取表格数据
     * @author lymn
     * @date 2020-07-06
     * @param {Array} data 表格数据
     */
    changeTable(data) {
      this.formResponsibility.formTableList = data;
    },
    /**
     * 显示分享弹窗
     * @author lymn
     * @date 2020-07-06
     */
    toShare() {
      this.$emit('toShare');
    },
    /**
     * 访问时间顺序调换
     * @author lymn
     * @date 2020-07-06
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.formResponsibility.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.index {
}
</style>

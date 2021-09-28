<!--
 * @Author       : ADI
 * @Date         : 2021-06-04 14:13:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-08 10:28:53
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
      />
      <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year" />
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
        :data="cardResponsibility.formTableList"
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
        <el-table-column label="访问时间" min-width="60" prop="createTimeName">
          <template #header>
            <div class="sortBar" @click="changeSortType('createTime')">
              <span class="nextTimeBaby">访问时间</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanshang"
                />
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanxia"
                />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="访问时长" min-width="60" prop="visitTimeName">
          <template #header>
            <div class="sortBar" @click="changeSortType('visitTime')">
              <span class="nextTimeBaby">访问时长</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'visitTime' && !requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanshang"
                />
                <global-ts-svg-icon
                  class="icon"
                  :class="requestParam.sortKey === 'visitTime' && requestParam.desc ? '' : 'isNotActive'"
                  name="icon-shaixuanxia"
                />
              </span>
            </div>
          </template>
        </el-table-column>
        <template slot="empty">
          <div :class="{ noSroll: headerNumer < 5 }">
            暂无访问数据 <a class="showQrDialog" @click="toShare">去分享</a>
          </div>
        </template>
      </el-table>
      <div class="tanshu-freeTip" v-if="isFreeVersion && cardResponsibility.formTableList.length > 0">
        <global-ts-versionfunctip funcText="当前版本无法查看完整信息"></global-ts-versionfunctip>
      </div>
    </div>
    <global-ts-pagination
      ref="formPagination"
      :tableData="cardResponsibility.formTableList"
      :requestParam="requestParam"
      :isReload.sync="cardResponsibility.isReload"
      @getData="changeTable"
      :httpurl="cardResponsibility.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import { getWorkerList, exportExcel } from '@/utils';
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getTsViewerRecordStat } from '@/api/modules/views/customer-tools/data-center';

export default {
  name: 'access-detail',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      cardResponsibility: {
        staffList: [], // 员工列表
        isReload: false, // 是否重新加载数据
        httpurl: '', // 请求数据的地址
        formTableList: [], // 表格数据
        initTime: [], // 初始默认选中时间
      },
      sid: -1, //跟进员工
      requestParam: {
        sortKey: 'createTime', // 排序
        desc: true, // 倒序
        type: 200, // 查看类型
        sids: '', // 销售员
        title: '', // 文章标题
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
      isDepartmentAdm: 'user/isDepartmentAdm',
      isCanSelect: 'user/isNoOneSelfDataAuth', // 是否是管理员
    }),
    ...mapState({
      userInfo: state => state.user.info,
      functionInfo: state => state.globalData?.functionInfo,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      addressUrl: state => state.globalData.addressUrl,
      helpDoc: state => state.user.info?.wxWorkConf?.compMaterialConf?.helpDoc,
      isOem: state => state.user.info.isOem,
    }),
    // 是否为免费版
    isFreeVersion() {
      return versionDef.checkIsFree();
    },
    // 版本升级链接
    updateVersionUrl() {
      return this.addressUrl.updateVersionUrl;
    },
    headerNumer() {
      let header = this.cardResponsibility.formTableList.formHeader;
      header = (header && Object.keys(header)) || [];
      return header.length;
    },
  },
  watch: {},
  async created() {
    this.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    console.log(this.isCanSelect, 'isCanSelect');
    await this.getTsStaffList();
    this.cardResponsibility.httpurl = '/rest/manage/viewerRecord/getTsViewerRecordStat'; // 请求表格数据接口地址
  },
  mounted() {},
  methods: {
    /**
     * 获取员工列表
     */
    getTsStaffList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            this.cardResponsibility.staffList = list[0];
            this.cardResponsibility.staffList = this.cardResponsibility.staffList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //销售员
              this.sid = this.cardResponsibility.staffList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 设置搜索时间
     */
    getSearchTime(val) {
      this.cardResponsibility.initTime = val;
      this.requestParam.createTimeStart = val[0];
      this.requestParam.createTimeEnd = val[1];
    },
    /**
     * 重新加载数据
     */
    reloadFormData() {
      this.cardResponsibility.isReload = true; // 会触发changeTable事件
    },
    /**
     * 导出
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, res] = await getTsViewerRecordStat(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      var excelList = res.data;
      var keyJson = {
        wxName: '微信名称',
        staffName: '成员',
        createTimeName: '访问时间',
        visitTimeName: '访问时长',
      };
      exportExcel(excelList, '访问明细', keyJson);
    },
    /**
     * 获取表格数据
     */
    changeTable(data) {
      this.cardResponsibility.formTableList = data;
    },
    /**
     * 小程序二维码弹窗
     */
    toShare() {
      this.$emit('toShare');
    },
    /**
     * 访问时间顺序调换
     * @author lymn
     * @date 2020-07-02
     * @param {String} type 属性类型
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.cardResponsibility.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.access-detail {
}
</style>

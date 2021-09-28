<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 13:43:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:32
-->
<template>
  <div class="customPayment">
    <div class="totalInfo">
      <span class="peopleTotal">
        购买总人数<span class="num">{{ customPay.totalPeople }} </span>人
      </span>
      <span>购买总金额<span class="num" v-html="customPay.totalPrice"></span><span>元</span></span>
    </div>
    <div class="pro_line">
      <global-ts-input
        style="width: 160px;"
        v-model="requestParam.name"
        placeholder="微信名称"
        @keyup.enter.native="reloadDataList"
      >
      </global-ts-input>
      <ts-select-list
        class="floatLeft"
        v-if="isCanSelect"
        :depIdList.sync="requestParam.depIdList"
        :sids.sync="requestParam.sids"
      >
      </ts-select-list>
      <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
      <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadDataList">
        搜索
      </global-ts-button>
    </div>
    <div class="customPaymentList">
      <el-table
        type="index"
        :class="'tshu-tableset'"
        header-row-class-name="employeeHeader"
        :data="customPay.tableList"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
      >
        <el-table-column prop="wxName" key="wxName" label="微信名称" min-width="70"></el-table-column>
        <el-table-column prop="staffName" label="成员" min-width="70" key="staffName">
          <template slot-scope="scope">
            {{
              scope.row.staffName ? $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) : '无'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="firstBuyTime" label="首次购买时间" min-width="130" key="firstBuyTime">
          <template #header>
            <div class="sortBar" @click="changeSortType('firstBuyTime')">
              <span class="nextTimeBaby">首次购买时间</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'firstBuyTime' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'firstBuyTime' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="首次购买商品" min-width="200" key="productName"></el-table-column>
        <el-table-column prop="firstBuyAmount" label="首次购买金额" min-width="120" key="firstBuyAmount">
          <template #header>
            <div class="sortBar" @click="changeSortType('firstBuyAmount')">
              <global-ts-tool-tips offset="10" class="item" effect="dark" content="不含优惠金额" placement="top-start">
                <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenhao1616"></use>
                </svg>
              </global-ts-tool-tips>
              <span class="nextTimeBaby">首次购买金额</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'firstBuyAmount' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'firstBuyAmount' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="购买总金额" min-width="90" key="amount">
          <template #header>
            <div class="sortBar" @click="changeSortType('amount')">
              <global-ts-tool-tips
                offset="10"
                class="item"
                effect="dark"
                content="购买金额不包含优惠金额"
                placement="top-start"
              >
                <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenhao1616"></use>
                </svg>
              </global-ts-tool-tips>
              <span class="nextTimeBaby">购买总金额</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'amount' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'amount' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="购买详情" min-width="70" prop="detail">
          <template slot-scope="scope">
            <div style="display: inline-block;" class="positionBox" replace>
              <a class="tanshu_linkColor" @click="toView(scope.row.id)">查看</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <global-ts-pagination
      :tableData="customPay.tableList"
      :requestParam="requestParam"
      :isReload.sync="customPay.isReload"
      @getData="changeTable"
      :httpurl="customPay.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import { format, getWorkerList, fmoney } from '@/utils';
import { mapGetters, mapState } from 'vuex';
import customPayDetail from '../custom-pay-detail';
import TsSelectList from '@/components/base/ts-select-list/index.vue';

export default {
  name: 'custom-payment',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      requestParam: {
        buyTime: '',
        name: '',
        sid: -1,
        sort: 'firstBuyTime',
        desc: true,
      },
      workList: [],
      customPay: {
        tableList: [],
        isReload: false,
        httpurl: '',
        totalPrice: fmoney(0, 2),
        totalPeople: 0,
      },
      detailInfo: null,
    };
  },
  computed: {
    ...mapGetters({
      isCanSelect: 'user/isManage',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  watch: {
    'requestParam.buyTime'(newVal) {
      this.requestParam.buyTimeStart = newVal ? newVal[0] : '';
      this.requestParam.buyTimeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {
    getWorkerList().then(list => {
      this.workList = list[0];
      if (list[1] == 2) {
        //成员
        this.requestParam.sid = this.workList.sid;
      }
    });
    this.$nextTick(() => {
      this.customPay.httpurl = '/ajax/mall/tsMallOrder_h.jsp?cmd=getViewerMallInfoList';
      this.reloadDataList();
    });
  },
  mounted() {},
  methods: {
    /**
     *查询
     *
     * @author guoyijie
     * @date 2020-05-06
     */
    reloadDataList() {
      this.customPay.isReload = true;
    },
    /**
     *选择购买时间
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.buyTime = val;
    },
    /**
     *获取表格数据
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} data
     */
    changeTable(data) {
      this.customPay.tableList = data.tsViewerList;
      this.customPay.totalPrice = fmoney(data.statInfo.amount || 0, 2);
      this.customPay.totalPeople = data.statInfo.cnt || 0;
    },
    /**
     *查看详情
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} id
     */
    toView(id) {
      var timeStart = format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd');
      var timeEnd = format.date(new Date(), 'yyyy-MM-dd');
      if (!this.detailInfo) {
        this.detailInfo = new customPayDetail();
        this.detailInfo.parent = this.$parent;
        this.detailInfo.$mount('#ts-detailInfo');
      }
      this.detailInfo.requestParam.viewerId = id;
      this.detailInfo.isShow = true;
      this.$utils.logDog('customPayDetail_show');
      this.$emit('update:isShow', false);
    },
    /**
     *选择排序
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} row
     */
    changeSortType(row) {
      this.requestParam.sort = row;
      this.requestParam.desc = !this.requestParam.desc;
      this.customPay.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-payment {
}
</style>

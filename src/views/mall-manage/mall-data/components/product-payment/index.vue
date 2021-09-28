<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 13:43:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:42
-->
<template>
  <div class="productPayment">
    <div class="totalInfo">
      <span class="peopleTotal">
        购买商品 <span class="num">{{ productPay.productCnt }} </span>种
      </span>
      <span class="peopleTotal">
        购买总人数 <span class="num">{{ productPay.customerCnt }} </span>人
      </span>
      <span class="peopleTotal">购买总金额<span class="num" v-html="productPay.amount"></span><span>元</span></span>
      <span>退款总金额<span class="num" v-html="productPay.refundAmount"></span><span>元</span></span>
    </div>
    <div class="pro_line">
      <ts-select-list
        class="floatLeft"
        v-if="isCanSelect"
        :depIdList.sync="requestParam.depIdList"
        :sids.sync="requestParam.sids"
      >
      </ts-select-list>
      <global-ts-button
        v-if="isCanSelect"
        type="primary"
        size="small"
        icon="icon-icon-4"
        ref="button"
        @click="reloadDataList"
        >搜索
      </global-ts-button>
    </div>
    <div class="productPaymentList">
      <el-table
        type="index"
        :class="'tshu-tableset'"
        header-row-class-name="employeeHeader"
        :data="productPay.tableList"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
      >
        <el-table-column prop="productName" key="productName" label="商品名称" min-width="200">
          <template #header>
            <div class="sortBar">
              <global-ts-tool-tips
                offset="10"
                class="item"
                effect="dark"
                content="仅展示有被浏览过的商品"
                placement="top-start"
              >
                <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenhao1616"></use>
                </svg>
              </global-ts-tool-tips>
              <span class="nextTimeBaby">商品名称</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="visits" label="访问人数" min-width="100" key="visits">
          <template #header>
            <div class="sortBar" @click="changeSortType('visits')">
              <span class="nextTimeBaby">访问人数</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'visits' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'visits' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="customerCnt" label="购买客户数" min-width="100" key="customerCnt">
          <template #header>
            <div class="sortBar" @click="changeSortType('customerCnt')">
              <span class="nextTimeBaby">购买客户数</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'customerCnt' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'customerCnt' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="conversionRate" label="购买转化率" key="conversionRate" min-width="100">
          <template #header>
            <div class="sortBar" @click="changeSortType('conversionRate')">
              <global-ts-tool-tips
                offset="10"
                class="item"
                effect="dark"
                content="购买转化率=购买客户数/访问人数"
                placement="top-start"
              >
                <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenhao1616"></use>
                </svg>
              </global-ts-tool-tips>
              <span class="nextTimeBaby">购买转化率</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="购买金额" key="amount" min-width="100">
          <template #header>
            <div class="sortBar" @click="changeSortType('amount')">
              <global-ts-tool-tips offset="10" class="item" effect="dark" content="不含优惠金额" placement="top-start">
                <svg class="icon ts-tabel-header-icon" aria-hidden="true">
                  <use xlink:href="#icon-wenhao1616"></use>
                </svg>
              </global-ts-tool-tips>
              <span class="nextTimeBaby">购买金额</span>
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
        <el-table-column prop="cnt" label="购买件数" key="cnt" min-width="100">
          <template #header>
            <div class="sortBar" @click="changeSortType('cnt')">
              <span class="nextTimeBaby">购买件数</span>
              <span class="sortArrow">
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'cnt' && !requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanshang"></use>
                </svg>
                <svg
                  class="icon"
                  aria-hidden="true"
                  :class="requestParam.sort == 'cnt' && requestParam.desc ? '' : 'isNotActive'"
                >
                  <use xlink:href="#icon-shaixuanxia"></use>
                </svg>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" key="refundAmount" label="退款金额" min-width="100"></el-table-column>
      </el-table>
    </div>
    <global-ts-pagination
      :tableData="productPay.tableList"
      :requestParam="requestParam"
      :isReload.sync="productPay.isReload"
      @getData="changeTable"
      :httpurl="productPay.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getWorkerList, fmoney } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';

export default {
  name: 'product-payment',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      requestParam: {
        sid: -1,
        sort: 'amount',
        desc: true,
      },
      workList: [],
      productPay: {
        tableList: [],
        isReload: false,
        httpurl: '',
        productCnt: 0,
        customerCnt: 0,
        amount: fmoney(0, 2),
        refundAmount: fmoney(0, 2),
      },
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
  watch: {},
  created() {
    getWorkerList().then(res => {
      this.workList = res[0];
    });
    this.$nextTick(() => {
      this.productPay.httpurl = '/ajax/mall/tsMallOrder_h.jsp?cmd=getMallProductList';
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
      this.productPay.isReload = true;
    },
    /**
     *获取表格数据
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} data
     */
    changeTable(data) {
      this.productPay.tableList = data.productList;
      this.productPay.productCnt = data.statInfo.productCnt || 0;
      this.productPay.customerCnt = data.statInfo.customerCnt || 0;
      this.productPay.amount = fmoney(data.statInfo.amount || 0, 2);
      this.productPay.refundAmount = fmoney(data.statInfo.refundAmount || 0, 2);
    },
    /**
     *排序
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} row
     */
    changeSortType(row) {
      this.requestParam.sort = row;
      this.requestParam.desc = !this.requestParam.desc;
      this.productPay.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-payment {
}
</style>

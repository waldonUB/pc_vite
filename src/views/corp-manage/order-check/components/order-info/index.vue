<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 16:52:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 16:56:04
-->
<template>
  <div class="ts-orderInfo" v-if="isShow">
    <span></span>
    <global-ts-tabguide @backToPrePage="backManage">
      <template v-slot:leftPart>订单审批</template>
      <template v-slot:rightPart>订单详情</template>
    </global-ts-tabguide>
    <div class="pro_listBox">
      <div class="showTabList">
        <el-table
          :class="'tshu-tableset'"
          :data="dataList"
          border
          min-width="1010px"
          header-row-class-name="employeeHeader"
          cell-class-name="cellStyle"
        >
          <el-table-column prop="thirdOrderId" label="订单编号" min-width="120px"></el-table-column>
          <el-table-column prop="buyTimeName" label="购买时间" min-width="166px"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="142px"></el-table-column>
          <el-table-column prop="payTypeName" label="类型" min-width="80px"></el-table-column>
          <el-table-column prop="amount" label="数量" min-width="118px"></el-table-column>
          <el-table-column prop="totalPrice" label="金额（元）" min-width="102px"></el-table-column>
          <el-table-column prop="bkge" label="佣金（元）" min-width="102px"></el-table-column>
          <el-table-column prop="dataSourceName" label="来源" min-width="113px"></el-table-column>
        </el-table>
      </div>
      <global-ts-pagination
        :tableData="dataList"
        :requestParam="form"
        :isReload.sync="isReload"
        @getData="getDataList"
        :httpurl="httpurl"
      >
      </global-ts-pagination>
      <div id="ts-refundOrder"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-info',
  components: {},
  props: {},
  data() {
    return {
      form: {
        id: 0,
      },
      isShow: true,
      isReload: false,
      httpurl: '/ajax/order/tsOrder_h.jsp?cmd=getTsOrderItemList',
      // 表格数据
      dataList: [],
      refundOrder: null,
      refundOrderArr: {
        1: '是',
        0: '否',
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 获取订单详情表格数据
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} data
     */
    getDataList(data) {
      this.dataList = data;
    },
    /**
     *返回订单页面
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    backManage() {
      this.isShow = false;
      this.refundOrder = null;
      this.dataList = [];
      this.parent.isShow = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-info {
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 15:26:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 16:21:53
-->
<template>
  <div class="ts-consumeInfo" v-if="isShow">
    <global-ts-tabguide @backToPrePage="backLast">
      <template v-slot:leftPart>消费记录</template>
      <template v-slot:rightPart>消费详情</template>
    </global-ts-tabguide>
    <div class="pro_listBox">
      <div class="showTabList">
        <el-table
          :class="'tshu-tableset'"
          :data="dataList"
          border
          header-row-class-name="employeeHeader"
          min-width="1010px"
          cell-class-name="cellStyle"
        >
          <el-table-column prop="thirdOrderId" label="订单编号" min-width="120px"></el-table-column>
          <el-table-column prop="buyTimeName" label="购买时间" min-width="164px"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="114px"></el-table-column>
          <el-table-column prop="payTypeName" label="类型" min-width="64px"></el-table-column>
          <el-table-column prop="amount" label="数量" min-width="114px"></el-table-column>
          <el-table-column prop="totalPrice" label="金额（元）" min-width="104px"></el-table-column>
          <el-table-column prop="bkge" label="佣金（元）" min-width="104px"></el-table-column>
          <el-table-column prop="dataSourceName" label="来源" min-width="84px"></el-table-column>
          <el-table-column label="退款" cell-class-name="editList" min-width="74px">
            <template slot-scope="scope">
              <global-ts-button
                class="arrows_select"
                v-if="scope.row.del == 0"
                type="default"
                size="mini"
                iconPosition="right"
                icon="icon-icon-8"
                @click="showRefundOrder(scope.row, $event)"
                :ref="'button' + scope.row.id"
                >{{ refundOrderArr[scope.row.del] }}
              </global-ts-button>
              <span style="color: #00bb72;" v-else>{{ refundOrderArr[scope.row.del] }}</span>
            </template>
          </el-table-column>
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
import refundOrder from '../refund-order/index.vue';
import Vue from 'vue';

export default {
  name: 'consume-info',
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
      refundOrderArr: { 1: '是', 0: '否' },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getDataList(data) {
      this.dataList = data;
    },
    //返回消费记录
    backLast() {
      this.isShow = false;
      this.refundOrder = null;
      this.dataList = [];
      this.parent.isShow = true;
    },
    // 显示弹窗
    showRefundOrder(data, event) {
      // 判断对象是否存在
      if (!this.refundOrder) {
        const vmConstructor = Vue.extend(refundOrder);
        this.refundOrder = new vmConstructor();
        this.refundOrder.form.id = data.id;
        this.refundOrder.form.orderId = data.orderId;
        this.refundOrder.form.refundOrder = data.del;
        this.refundOrder.$mount('#ts-refundOrder');
        this.refundOrder.parent = this;
      } else {
        this.refundOrder.form.id = data.id;
        this.refundOrder.form.orderId = data.orderId;
        this.refundOrder.form.refundOrder = data.del;
      }
      this.refundOrder.isShow = true;
      this.refundOrder.changeTarget({
        target: this.$refs['button' + data.id].$el,
        position: 'right',
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

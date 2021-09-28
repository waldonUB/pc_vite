<!--
 * @Description  : 订单审批
 * @Author       : turbo
 * @Date         : 2021-03-30 14:16:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 17:16:44
-->

<template>
  <div class="orderBox">
    <div id="order_check_edit_newBuy">
      <div></div>
    </div>
    <!--挂载编辑订单详情弹窗-->

    <router-view v-if="isOtherRouter"></router-view>
    <div v-if="!isOtherRouter">
      <div class="ts-consumeRecode" v-if="isShow">
        <global-ts-header>
          <template v-slot:leftPart>订单审批</template>
          <template v-slot:rightPart>
            <global-ts-button
              class="pro_header_addEm"
              type="primary"
              size="small"
              icon="icon-icon-11"
              @click="newAddProduct"
              >订单录入
            </global-ts-button>
          </template>
        </global-ts-header>
        <div class="pro_listBox">
          <div class="consumeRecode_main">
            <div class="pro_line">
              <ts-select-list
                class="floatLeft"
                v-if="isCanSelect"
                :depIdList.sync="form.depIdList"
                :sids.sync="form.sids"
              >
              </ts-select-list>
              <global-ts-input
                style="width: 120px;"
                v-model="form.contacts"
                placeholder="客户"
                @keyup.enter.native="reloadTable"
              >
              </global-ts-input>
              <global-ts-input
                style="width: 120px;"
                v-model="form.thOrderId"
                placeholder="订单号"
                @keyup.enter.native="reloadTable"
              >
              </global-ts-input>
              <global-ts-select
                style="width: 150px;height: 34px;"
                v-model="form.status"
                placeholder="全部状态"
                :list="checkStatusList"
              >
              </global-ts-select>
              <global-ts-button
                type="primary"
                size="small"
                style="height: 34px; line-height: 34px;"
                icon="icon-icon-4"
                @click="reloadTable"
                ref="button"
                >搜索
              </global-ts-button>
            </div>
            <div class="showTabList">
              <el-table
                :class="'tshu-tableset'"
                :data="dataList"
                border
                min-width="1010px"
                box-sizing="border-box"
                header-row-class-name="employeeHeader"
                cell-class-name="cellStyle"
              >
                <el-table-column prop="clientName" label="客户" min-width="60px"> </el-table-column>
                <el-table-column prop="clientMobile" label="联系手机" min-width="106px"> </el-table-column>
                <el-table-column prop="staffName" label="销售员" min-width="60px">
                  <template slot-scope="scope">
                    {{
                      scope.row.staffName
                        ? $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName)
                        : '无'
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="buyTimeName" label="购买时间" min-width="152px"> </el-table-column>
                <el-table-column prop="companyName" label="所属公司" min-width="70px"> </el-table-column>
                <el-table-column prop="thirdOrderId" label="订单编号" min-width="94px"> </el-table-column>
                <el-table-column prop="totalPrice" label="金额（元）" min-width="86px"> </el-table-column>
                <el-table-column prop="bkge" label="佣金（元）" min-width="86px"> </el-table-column>
                <el-table-column label="状态" cell-class-name="editList" min-width="72px">
                  <template slot-scope="scope">
                    <global-ts-button
                      class="arrows_select"
                      type="default"
                      v-if="scope.row.status == 0"
                      size="mini"
                      icon="icon-icon-8"
                      iconPosition="right"
                      @click="showRefundOrder(scope.row, $event)"
                      :ref="'button' + scope.row.id"
                      >{{ checkStatusArr[scope.row.status] }}
                    </global-ts-button>
                    <span class="checkStatus" v-else>{{ checkStatusArr[scope.row.status] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="订单详情" min-width="64px" cell-class-name="editList">
                  <template slot-scope="scope">
                    <a class="text_but1" @click="showOrderInfo(scope.row.id)">进入</a>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="90px" cell-class-name="editList">
                  <template slot-scope="scope">
                    <div class="bottomBar">
                      <span class="text_but1" v-if="scope.row.status == 1">无</span>
                      <span class="text_but1" v-if="scope.row.status == 0" @click="editOrder(scope.row.id)">编辑</span>
                      <span class="text_but1" v-if="scope.row.status == 0" @click="deleteOrderTable(scope.row.id)">
                        删除
                      </span>
                    </div>
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
          </div>
        </div>
      </div>
      <div id="ts-orderInfo"></div>
      <div id="ts-orderEdit"></div>
      <div id="ts-refundOrder"></div>
      <div id="ts-orderAdd"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { confirm, getWorkerList, fmoney } from '@/utils';
import refundOrder from './components/refund-order/index.vue';
import orderInfo from './components/order-info/index.vue';
import Vue from 'vue';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getOrderDefList, delOrder } from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'orderCheck',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      form: {
        sid: -1,
        status: -1,
        thOrderId: '',
        contacts: '',
      },
      isShow: true,
      isReload: false,
      httpurl: '/ajax/order/tsOrder_h.jsp?cmd=getTsOrderList&isFromAudit=true',
      // 表格数据
      dataList: [],
      // 业务人员列表
      staffList: [],
      statInfo: [],
      nowStyle: '',
      orderInfo: null,
      checkStatusList: [],
      checkStatusArr: {},
      poupUpInfo: {
        voteStatus: 1,
        id: -1,
        target: null,
      },
      isOtherRouter: false,
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
    console.log('ADI-LOG => created');
    this.$utils.logDog('showOrderCheck');
    //enter
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        _self.reloadTable();
      }
    };
    getWorkerList().then(list => {
      this.staffList = list[0];
      if (list[1] == 2) {
        //销售员
        this.form.sid = this.staffList.sid;
      }
    });
    this.getOrderDefList();
  },
  mounted() {},
  activated() {
    console.log('ADI-LOG => activated');
    this.reloadTable();
  },
  methods: {
    /**
     * @description : getOrderDefList
     * @author      : ADI
     * @Date        : 2021-07-20 17:13:33
     * @param        {*}
     * @return       {*}
     */
    async getOrderDefList() {
      const [err, response] = await getOrderDefList();
      if (err) {
        return Promise.reject(err);
      }
      // 转换成需要用的数据结构
      this.checkStatusList = [
        {
          label: '全部审核状态',
          value: -1,
        },
      ];
      this.checkStatusArr = {};
      response.data.statusList.forEach(data => {
        this.checkStatusArr[data.key] = data.value;
        this.checkStatusList.push({
          value: data.key,
          label: data.value,
        });
      });
    },
    /**
     *新增订单跳转
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    newAddProduct() {
      this.$utils.logDog('orderCheckIn');
      this.$router.push({
        path: '/orderCheckIn',
      });
    },
    /**
     *编辑订单跳转
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} id-订单id
     * @param {*} sid
     */
    editOrder(id, sid) {
      this.$router.push({
        path: '/orderCheckEdit',
        query: {
          orderId: id,
          sid: sid,
        },
      });
    },
    /**
     * 显示弹窗
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} data
     * @param {*} event
     */
    showRefundOrder(data, event) {
      // 判断对象是否存在
      if (!this.refundOrder) {
        const vm = Vue.extend(refundOrder);
        this.refundOrder = new vm();
        this.refundOrder.form.id = data.id;

        this.refundOrder.$mount('#ts-refundOrder');
        this.refundOrder.parent = this;
      } else {
        this.refundOrder.form.id = data.id;
      }
      this.refundOrder.isShow = true;
      this.refundOrder.changeTarget({
        target: this.$refs['button' + data.id].$el,
        position: 'right',
      });
    },
    /**
     *查看订单详情
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} id-订单id
     */
    showOrderInfo(id) {
      // 判断对象是否存在
      if (!this.orderInfo) {
        const vm = Vue.extend(orderInfo);
        this.orderInfo = new vm();
        this.orderInfo.form.id = id;
        this.orderInfo.$mount('#ts-orderInfo');
        this.orderInfo.parent = this;
      } else {
        this.orderInfo.form.id = id;
      }
      this.orderInfo.isShow = true;
      this.isShow = false;
    },
    /**
     *删除订单
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} id-订单id
     */
    deleteOrderTable(id) {
      this.deleteOrder(id).then(() => {
        this.isReload = true;
      });
    },
    /**
     *删除订单
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} id-订单id
     */
    deleteOrder(id) {
      return confirm('确认删除订单？删除后无法恢复', '删除确认').then(async action => {
        if (action == 'confirm') {
          const [err, res] = await delOrder({
            id,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '系统错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '删除成功！',
          });
          return Promise.resolve();
        }
      });
    },
    /**
     *更新表格数据
     *
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} data
     */
    getDataList(data) {
      this.dataList = data.infoList;
      this.statInfo = data.statInfo;
      this.statInfo.stat_disCidCnt = fmoney(this.statInfo.stat_disCidCnt, 0);
      this.statInfo.stat_priceSum = fmoney(this.statInfo.stat_priceSum, 2);
      this.statInfo.stat_bkgeSum = fmoney(this.statInfo.stat_bkgeSum, 2);
    },
    /**
     *搜索
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    reloadTable() {
      this.isReload = true;
    },
  },
};
</script>

<style lang="scss">
.orderBox {
  padding: 30px 0 0;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  .pro_listBox {
    .pro_line {
      padding-bottom: 24px;
    }
    .el-table__body-wrapper {
      .cell {
        .arrows_select {
          padding-left: 0;
        }
      }
    }
    .checkStatus {
      color: #247af3;
    }
  }
}
.ordreInfo {
  font-size: 14px;
  font-weight: 400;
  color: #535353;
}
</style>

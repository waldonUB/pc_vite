<!--
 * @Description  : 消费记录
 * @Author       : turbo
 * @Date         : 2021-03-30 14:16:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 13:58:10
-->

<template>
  <div class="consumeBox">
    <div class="ts-consumeRecode" v-if="isShow">
      <global-ts-header>
        <template v-slot:leftPart>消费记录</template>
      </global-ts-header>
      <div class="pro_listBox">
        <div class="consumeRecode_main">
          <div class="pro_line">
            <div class="statInfo">
              <label>总消费人数</label>
              <span>{{ statInfo.stat_disCidCnt }}</span>
              <span style="font-size: 14px;">人</span>
              <label>总消费金额</label>
              <span v-html="statInfo.stat_priceSum"></span>
              <span style="font-size: 14px;">元</span>
              <label>总佣金</label>
              <span v-html="statInfo.stat_bkgeSum"></span>
              <span style="font-size: 14px;">元</span>
            </div>
          </div>
          <div class="pro_line">
            <ts-select-list class="floatLeft" v-if="isUpperAdm" :depIdList.sync="form.depIdList" :sids.sync="form.sids">
            </ts-select-list>
            <global-ts-input
              style="width: 120px;"
              v-model="form.contacts"
              placeholder="客户"
              @keyup.enter.native="reloadDataList"
            >
            </global-ts-input>
            <global-ts-input
              style="width: 120px;"
              v-model="form.thOrderId"
              @keyup.enter.native="reloadDataList"
              placeholder="订单号"
            >
            </global-ts-input>
            <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="reloadDataList" ref="button">
              搜索
            </global-ts-button>
          </div>
          <div class="showTabList">
            <el-table
              :class="'tshu-tableset'"
              :data="dataList"
              border
              header-row-class-name="employeeHeader"
              min-width="950px"
              cell-class-name="cellStyle"
            >
              <el-table-column prop="clientName" label="客户" min-width="70px"></el-table-column>
              <el-table-column prop="clientMobile" label="联系手机" min-width="99px"></el-table-column>
              <el-table-column prop="staffName" label="销售员" min-width="70px">
                <template slot-scope="scope">
                  {{
                    scope.row.staffName
                      ? $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName)
                      : '无'
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="buyTimeName" label="购买时间" min-width="154px"></el-table-column>
              <el-table-column prop="companyName" label="所属公司" min-width="130px"></el-table-column>
              <el-table-column prop="thirdOrderId" label="订单编号" min-width="96px"></el-table-column>
              <el-table-column prop="totalPrice" label="金额（元）" min-width="92px"></el-table-column>
              <el-table-column prop="bkge" label="佣金（元）" min-width="92px"></el-table-column>
              <el-table-column prop="dataSourceName" label="来源" min-width="72px"></el-table-column>
              <el-table-column label="消费详情" cell-class-name="editList" min-width="66px">
                <template slot-scope="scope">
                  <span class="text_but1" @click="showConsumeInfo(scope.row.id)">进入</span>
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
    <div id="ts-consumeInfo"></div>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getWorkerList, fmoney } from '@/utils';
import { mapGetters, mapState } from 'vuex';
import consumeInfo from './components/consume-info/index.vue';
import Vue from 'vue';

export default {
  name: 'consumeRecode',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      form: {
        sid: -1,
        status: 1,
        thOrderId: '',
        createTimeStart: '2019-01-01',
        createTimeEnd: '2019-04-01',
        contacts: '',
      },
      isShow: true,
      isReload: false,
      httpurl: '/ajax/order/tsOrder_h.jsp?cmd=getTsOrderList',
      // 表格数据
      dataList: [],
      // 业务人员列表
      staffList: [],
      statInfo: [],
      consumeInfo: null,
      isUpperAdm: false,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  watch: {},
  created() {
    this.$utils.logDog('showConsumeRecode');
    //enter
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key === 13) {
        _self.reloadDataList();
      }
    };
    this.isUpperAdm = this.isManage;
    // 获取员工列表
    const params = {
      workId: 2,
    };
    getWorkerList(params).then(list => {
      this.staffList = list[0].map(item => {
        return {
          value: item.sid,
          label: item.name,
        };
      });
    });
  },
  mounted() {},
  methods: {
    showConsumeInfo(id) {
      // 判断对象是否存在
      if (!this.consumeInfo) {
        const vmConstructor = Vue.extend(consumeInfo);
        this.consumeInfo = new vmConstructor();
        this.consumeInfo.form.id = id;
        this.consumeInfo.$mount('#ts-consumeInfo');
        this.consumeInfo.parent = this;
      } else {
        this.consumeInfo.form.id = id;
      }
      this.consumeInfo.isShow = true;
      this.isShow = false;
    },
    getDataList(data) {
      this.dataList = data.infoList;
      this.statInfo = data.statInfo;
      this.statInfo.stat_disCidCnt = fmoney(this.statInfo.stat_disCidCnt, 0);
      this.statInfo.stat_priceSum = fmoney(this.statInfo.stat_priceSum, 2);
      this.statInfo.stat_bkgeSum = fmoney(this.statInfo.stat_bkgeSum, 2);
    },
    reloadDataList(data) {
      this.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.consumeRecode_main {
  .global-button {
    &.global-button-type-primary {
      float: left;
    }
  }
}
.statInfo {
  label {
    width: 71px;
    height: 12px;
    padding-left: 10px;
    margin: 10px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    color: #898989;
    border-left: 1px solid #ffdadada;
    &:first-child {
      padding: 0;
      margin: 0;
      border-left: 0;
    }
  }
  span {
    width: 81px;
    height: 16px;
    font-size: 20px;
    font-weight: 400;
    line-height: 18px;
    color: #247af3;
  }
}
.directSale {
  .statInfo {
    span {
      color: #247af3;
    }
  }
}
.consumeBox {
  .pro_listBox {
    .pro_line {
      &:nth-of-type(2) {
        padding-bottom: 24px;
      }
    }
  }
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 13:46:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:24
-->
<template>
  <div class="customPayDetail" id="ts-detailInfo" v-show="isShow">
    <global-ts-tabguide @backToPrePage="backLast">
      <template v-slot:leftPart>客户付费分析</template>
      <template v-slot:rightPart>客户付费详情</template>
    </global-ts-tabguide>
    <div class="pro_listBox">
      <div class="totalInfo">
        <span class="peopleTotal">
          购买商品
          <span class="num">{{ customPayDetail.buyType }} </span>种
        </span>
        <span class="peopleTotal">
          购买总金额<span class="num" v-html="customPayDetail.amount"></span><span>元</span>
        </span>
        <span class="peopleTotal">
          退款商品<span class="num">{{ customPayDetail.refundType }} </span>种
        </span>
        <span>退款总金额<span class="num" v-html="customPayDetail.refundAmount"></span><span>元</span></span>
      </div>
      <div class="pro_line">
        <label for="createTime">下单时间：</label>
        <global-ts-date-picker id="createTime" :isInit="false" @updateTime="getCreateTime"> </global-ts-date-picker>
        <label for="buyTime">购买时间：</label>
        <global-ts-date-picker id="buyTime" :isInit="false" @updateTime="getBuyTime"> </global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadDataList">
          搜索
        </global-ts-button>
      </div>
      <div class="customPayDetailList">
        <el-table
          type="index"
          :class="'tshu-tableset'"
          header-row-class-name="employeeHeader"
          :data="customPayDetail.tableList"
          border
          min-width="1010px"
          cell-class-name="cellStyle"
        >
          <el-table-column prop="wxName" key="wxName" label="微信名称" min-width="70"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" min-width="130" key="createTime">
            <template #header>
              <div class="sortBar" @click="changeSortType('createTime')">
                <span class="nextTimeBaby">下单时间</span>
                <span class="sortArrow">
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="requestParam.sort == 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="requestParam.sort == 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="buyTime" label="购买时间" min-width="130" key="buyTime">
            <template #header>
              <div class="sortBar" @click="changeSortType('buyTime')">
                <span class="nextTimeBaby">购买时间</span>
                <span class="sortArrow">
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="requestParam.sort == 'buyTime' && !requestParam.desc ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="requestParam.sort == 'buyTime' && requestParam.desc ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="购买商品" min-width="200" key="productName"></el-table-column>
          <el-table-column prop="amount" label="购买金额" min-width="70" key="amount">
            <template #header>
              <div class="sortBar" @click="changeSortType('amount')">
                <global-ts-tool-tips
                  offset="10"
                  class="item"
                  effect="dark"
                  content="不含优惠金额"
                  placement="top-start"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-bianzu"></use>
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
          <el-table-column prop="cnt" key="cnt" label="购买件数" min-width="70"></el-table-column>
          <el-table-column prop="type" key="type" label="购买状态" min-width="70"></el-table-column>
          <el-table-column label="操作" min-width="70" prop="refresh">
            <template slot-scope="scope">
              <div style="display: inline-block;" class="positionBox" replace>
                <a class="tanshu_linkColor" @click="refresh(scope.row.id)">刷新</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <global-ts-pagination
        :tableData="customPayDetail.tableList"
        :requestParam="requestParam"
        :isReload.sync="customPayDetail.isReload"
        @getData="changeTable"
        :httpurl="customPayDetail.httpurl"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { getWorkerList, fmoney } from '@/utils';
import { refreshOrder } from '@/api/modules/views/mall-manage/mall-data';

export default {
  name: 'custom-pay-detail',
  components: {},
  props: {},
  data() {
    return {
      requestParam: {
        wxName: '',
        sid: -1,
        sort: 'createTime',
        desc: true,
        createTime: '',
        buyTime: '',
        viewerId: 0,
      },
      workList: [],
      customPayDetail: {
        tableList: [],
        isReload: false,
        httpurl: '',
        amount: fmoney(0, 2),
        buyType: 0,
        refundAmount: fmoney(0, 2),
        refundType: 0,
      },
      isShow: false,
      refreshTimer: null,
      lastRefreshId: 0,
    };
  },
  computed: {},
  watch: {
    'requestParam.createTime'(newVal) {
      console.log(newVal);
      this.requestParam.createTimeStart = newVal ? newVal[0] : '';
      this.requestParam.createTimeEnd = newVal ? newVal[1] : '';
    },
    'requestParam.buyTime'(newVal) {
      console.log(newVal);
      this.requestParam.buyTimeStart = newVal ? newVal[0] : '';
      this.requestParam.buyTimeEnd = newVal ? newVal[1] : '';
    },
    'requestParam.viewerId'(newVal) {
      this.reloadDataList();
    },
  },
  created() {
    console.log(this.requestParam.createTime);
    console.log(this.requestParam.buyTime);
    getWorkerList().then(list => {
      this.workList = list[0];
      if (list[1] == 2) {
        //成员
        this.requestParam.sid = this.workList.sid;
      }
    });
    this.$nextTick(() => {
      this.customPayDetail.httpurl = '/ajax/mall/tsMallOrder_h.jsp?cmd=getMallOrderList';
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
      this.customPayDetail.isReload = true;
    },
    /**
     *选择下单时间
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} val
     */
    getCreateTime(val) {
      console.log(val);
      this.requestParam.createTime = val;
    },
    /**
     *选择购买时间
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} val
     */
    getBuyTime(val) {
      console.log(2);
      console.log(val);
      this.requestParam.buyTime = val;
    },
    clickRefresh(id) {
      if (this.lastRefreshId == id) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.refresh, 30000, id);
      } else {
        this.refresh(id);
      }
      this.lastRefreshId = id;
    },
    async refresh(id) {
      const [err, res] = await refreshOrder({
        id,
      });
      this.customPayDetail.tableList = [];
      this.reloadDataList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
    },
    /**
     *获取表格数据
     *
     * @author guoyijie
     * @date 2020-05-06
     * @param {*} data
     */
    changeTable(data) {
      this.customPayDetail.tableList = data.mallOrderList;
      this.customPayDetail.amount = fmoney(data.statInfo.amount || 0, 2);
      this.customPayDetail.buyType = data.statInfo.buyType || 0;
      this.customPayDetail.refundAmount = fmoney(data.statInfo.refundAmount || 0, 2);
      this.customPayDetail.refundType = data.statInfo.refundType || 0;
    },
    /**
     *返回
     *
     * @author guoyijie
     * @date 2020-05-06
     */
    backLast() {
      this.isShow = false;
      this.parent.isShow = true;
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
      this.customPayDetail.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-pay-detail {
}
</style>

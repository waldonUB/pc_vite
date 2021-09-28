<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 17:39:57
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-28 17:31:24
-->
<template>
  <global-ts-card-box class="nowOrderInfo">
    <template v-slot:card-box-head>
      <div id="order_check_edit_newBuy">
        <div></div>
      </div>
      <div class="operateList">
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>订单审批</template>
          <template v-slot:rightPart>订单编辑</template>
        </global-ts-tabguide>
      </div>
    </template>
    <template v-slot:card-box-body>
      <div class="cardBox">
        <div class="ordreInfo">
          <div class="title">订单信息</div>
          <fa-form-model class="formBox" ref="checkInOrderRuleForm" layout="vertical" :model="showInfo">
            <div class="rightPart" style="min-width: 870px;">
              <div class="infoBox">
                <div class="contactAcct">
                  <fa-form-model-item label="联系人">
                    <global-ts-input
                      size="large"
                      class="accountName"
                      :disabled="true"
                      v-model="showInfo.clientName"
                      placeholder="请输入帐号"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="customSource">
                  <div class="contactAcct">
                    <fa-form-model-item label="销售员">
                      <global-ts-input
                        size="large"
                        class="accountName"
                        :disabled="true"
                        v-model="showInfo.staffName"
                        placeholder="请输入帐号"
                      >
                      </global-ts-input>
                    </fa-form-model-item>
                  </div>
                </div>
              </div>
              <div class="infoBox">
                <div class="contactAcct">
                  <fa-form-model-item label="所属公司" prop="companyId">
                    <global-ts-fai-select
                      class="accountName"
                      :disabled="true"
                      v-model="showInfo.companyName"
                      style="width: 350px;"
                      type="large"
                      placeholder="请选择所属公司"
                      :getPopupContainer="true"
                    >
                    </global-ts-fai-select>
                  </fa-form-model-item>
                </div>
                <div class="customSource">
                  <div class="contactAcct">
                    <fa-form-model-item label="订单号" prop="thOrderId">
                      <global-ts-input
                        :disabled="true"
                        class="accountName"
                        v-model="showInfo.thirdOrderId"
                        placeholder="请输入订单号"
                        size="large"
                      >
                      </global-ts-input>
                    </fa-form-model-item>
                  </div>
                </div>
              </div>
              <div class="infoBox">
                <div>
                  <div>
                    <fa-form-model-item label="购买时间" prop="buyTime">
                      <el-date-picker
                        :disabled="true"
                        class="orderCheckTimePicker"
                        v-model="showInfo.buyTimeName"
                        type="datetime"
                        start-placeholder="请选择购买时间"
                      >
                      </el-date-picker>
                    </fa-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </fa-form-model>
        </div>
        <div class="orderBuyInfo">
          <div class="title">购买详情</div>
          <div class="orderBox pro_listBox">
            <el-table
              :data="otherInfo.nowCacheList"
              border
              header-row-class-name="employeeHeader"
              min-width="1010px"
              box-sizing="border-box"
              cell-class-name="cellStyle"
            >
              <el-table-column
                prop="thirdOrderId"
                label="订单编号"
                min-width="120px"
                :key="'thOrderId' + showInfo.thirdOrderId"
              >
                {{ showInfo.thirdOrderId }}
              </el-table-column>
              <el-table-column
                prop="buyTime"
                label="购买时间"
                min-width="154px"
                :key="'buyTime' + showInfo.buyTimeName"
              >
                {{ showInfo.buyTimeName }}
              </el-table-column>
              <el-table-column prop="productName" label="产品名称" min-width="100px"></el-table-column>
              <el-table-column prop="payTypeName" label="类型" min-width="48px"></el-table-column>
              <el-table-column prop="amount" label="数量" min-width="107px"></el-table-column>
              <el-table-column prop="totalPrice" label="金额/￥" min-width="94px"></el-table-column>
              <el-table-column prop="bkge" label="佣金/￥" min-width="94px"></el-table-column>
              <el-table-column prop="dataSourceName" label="来源" min-width="94px"></el-table-column>
              <el-table-column label="操作" min-width="130px">
                <template slot-scope="scope">
                  <div class="bottomBar">
                    <span class="tanshu_linkColor" @click="editBuyeRecord(scope.row.id)">编辑 </span>
                    <span class="tanshu_linkColor editCustom" @click="deleteBuyRecord(scope.row.id)">删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="buySurport">
            <span @click="addBuyInfo">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-3"></use>
              </svg>
              新增购买详情
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div class="bottomBtn bottomBar">
        <global-ts-button class="em_add_emp" type="primary" size="medium" @click="addOrder">添加 </global-ts-button>
        <global-ts-button class="orderEdit_cancel" type="others" size="medium" @click="backManage">
          取消
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import { confirm, loading, filterData, getNewAddPoup } from '@/utils';
import {
  getTsOrderItemList,
  getTsOrder,
  getTsProductList,
  getOrderDefList,
  updateTsOrder,
} from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'order-check-edit',
  components: {},
  props: {},
  data() {
    return {
      //新添的form结构
      form: {
        cid: -1,
        thOrderId: '',
        buyTime: '',
      },
      showInfo: {
        clientName: '',
        staffName: '',
        companyName: '',
        companyId: '',
        thirdOrderId: '',
        buyTimeName: '',
        sid: '',
      },
      otherInfo: {
        companyList: [],
        productType: [],
        cacheList: [], //原有的数据列表
        nowCacheList: [], //操作的数据列表
        changeCacheList: [], //修改的数据
      },
      urlInfo: this.$route.query,
      poupInfo: null,
    };
  },
  computed: {
    hasInlistId() {
      var list = [];
      this.otherInfo.nowCacheList.forEach(data => {
        list.push(data.productId);
      });
      return list;
    },
  },
  watch: {},
  created() {
    this.getTsOrder();
    this.getOrderInfo();
    this.getOrderDefList();
  },
  mounted() {},
  methods: {
    /**
     * @description : 获取订单信息
     * @author      : ADI
     * @Date        : 2021-07-22 11:18:26
     * @param        {*}
     * @return       {*}
     */
    async getTsOrder() {
      const [err, response] = await getTsOrder({
        id: this.urlInfo.orderId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.showInfo = filterData(response.data, [
        'clientName',
        'staffName',
        'companyName',
        'companyId',
        'thirdOrderId',
        'buyTimeName',
        'sid',
      ]);
      this.showInfo.staffName = this.showInfo.staffName || '无';
      this.getTsProductList();
    },
    /**
     * @description : 获取产品列表
     * @author      : ADI
     * @Date        : 2021-07-22 11:17:53
     * @param        {*}
     * @return       {*}
     */
    async getTsProductList() {
      const [err, res] = await getTsProductList({
        isGetAll: true,
        companyId: this.showInfo.companyId,
        dataSource: 1,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.otherInfo.companyList = res.data;
    },
    /**
     * @description : 获取类型列表
     * @author      : ADI
     * @Date        : 2021-07-22 11:10:33
     * @param        {*}
     * @return       {*}
     */
    async getOrderDefList() {
      const [err, response] = await getOrderDefList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.otherInfo.productType = response.data.payTypeList;
    },
    createPoupByOpt() {
      return new Promise(resolve => {
        if (!this.poupInfo) {
          loading.addQuene({
            key: 'loadingPoupBox',
          });
          // Ts_util.Res.loadg('poupBuyInfo').then(() => {
          //   loading.poupQuene('loadingPoupBox');
          //   this.poupInfo = Ts_util.getNewAddPoup.getOrderBox(this.showInfo.sid);
          //   this.poupInfo.$mount('#order_check_edit_newBuy div');
          //   resolve();
          // });
          loading.poupQuene('loadingPoupBox');
          this.poupInfo = getNewAddPoup.getOrderBox(this.showInfo.sid);
          this.poupInfo.$mount('#order_check_edit_newBuy div');
          resolve();
        } else {
          resolve();
        }
      });
    },
    addBuyInfo() {
      this.createPoupByOpt().then(() => {
        this.poupInfo.showPoup({
          companyId: this.showInfo.companyId,
          submitFn: (changeInfo, done) => {
            if (this.hasInlistId.includes(changeInfo.productId)) {
              this.$utils.postMessage({
                type: 'warning',
                message: '该产品购买详情已存在，请勿重复添加',
              });
            } else {
              changeInfo.id = +new Date() + 'addId';
              changeInfo.bkge = changeInfo.bymoney;
              changeInfo.payTypeName = changeInfo.productTypeName;
              changeInfo.dataSourceName = changeInfo.source;
              this.otherInfo.nowCacheList.push(changeInfo);
              done();
            }
          },
        });
      });
    },
    //编辑某项内容
    editBuyeRecord(id) {
      this.createPoupByOpt().then(() => {
        var cusData;
        this.otherInfo.nowCacheList.forEach(data => {
          if (data.id == id) {
            cusData = data;
            return false;
          }
        });

        this.poupInfo.showPoup(
          Object.assign(filterData(cusData, ['productId', 'payType', 'amount', 'totalPrice']), {
            submitFn: (changeInfo, done) => {
              if (this.hasInlistId.includes(changeInfo.productId) && cusData.productId != changeInfo.productId) {
                this.$utils.postMessage({
                  type: 'warning',
                  message: '该产品购买详情已存在，请勿重复添加',
                });
              } else {
                changeInfo.bkge = changeInfo.bymoney;
                changeInfo.payTypeName = changeInfo.productTypeName;
                changeInfo.dataSourceName = changeInfo.source;
                if (!this.otherInfo.changeCacheList.includes(id)) {
                  this.otherInfo.changeCacheList.push(id);
                }
                this.otherInfo.nowCacheList.forEach((data, index) => {
                  if (data.id == id) {
                    Object.assign(this.otherInfo.nowCacheList[index], changeInfo);
                    return false;
                  }
                });
                done();
              }
            },
            companyId: this.showInfo.companyId,
          }),
        );
      });
    },
    deleteBuyRecord(id) {
      confirm('确认删除该记录？删除后无法恢复', '删除确认').then(action => {
        if (action == 'confirm') {
          var deleteIndex;
          this.otherInfo.nowCacheList.forEach((data, index) => {
            if (data.id == id) {
              deleteIndex = index;
              return false;
            }
          });
          this.otherInfo.nowCacheList.splice(deleteIndex, 1);
        }
      });
    },
    //返回订单审批页面
    backManage() {
      this.$router.push({
        path: '/orderCheck',
      });
    },
    //添加订单
    async addOrder() {
      // debugger
      if (this.otherInfo.nowCacheList.length <= 0) {
        this.$utils.postMessage({
          type: 'error',
          message: '请添加购买详情',
        });
        return;
      }
      var addItemListJson = []; //新增购买详情
      var setItemListJson = []; //修改的购买详情
      var delItemIdListJson = []; //删除的购买详情
      this.otherInfo.nowCacheList.forEach(nowData => {
        var addData;
        this.otherInfo.cacheList.forEach(data => {
          if (nowData.id == data.id) {
            addData = nowData;
            return false;
          }
        });
        if (!addData) {
          addItemListJson.push(nowData);
        }
        //修改的记录
        this.otherInfo.changeCacheList.forEach(data => {
          const dataId = data + '';
          if (dataId.indexOf('addId') < 0 && data == nowData.id) {
            setItemListJson.push(nowData);
            return false;
          }
        });
      });
      //删除的记录
      this.otherInfo.cacheList.forEach(data => {
        var sameData;
        this.otherInfo.nowCacheList.forEach(nowData => {
          const dataId = nowData.id + '';
          if (dataId.indexOf('addId') < 0 && data.id == nowData.id) {
            sameData = nowData;
            return false;
          }
        });
        //这个已经被删除
        if (!sameData) {
          delItemIdListJson.push(data.id);
        }
      });
      const [err, res] = await updateTsOrder({
        id: this.urlInfo.orderId,
        addItemListJson: JSON.stringify(addItemListJson),
        setItemListJson: JSON.stringify(setItemListJson),
        delItemIdListJson: JSON.stringify(delItemIdListJson),
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: '编辑成功！',
      });
      this.backManage();
    },
    // 获取订单列表
    async getOrderInfo() {
      const [err, response] = await getTsOrderItemList({
        id: this.urlInfo.orderId,
        isGetAll: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.otherInfo.nowCacheList = [].concat(response.data);
      this.otherInfo.cacheList = [].concat(response.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.nowOrderInfo {
  .tanshu-cardBox-bottom {
    .bottomBtn {
      height: 100%;
      text-align: center;
      .em_add_emp {
        width: 140px;
        margin-right: 10px;
      }
      .orderEdit_cancel {
        width: 80px;
      }
    }
    & > div {
      &:hover {
        margin-top: 10px;
        text-align: center;
      }
    }
  }
  .tanshu-cardBox-body {
    .cardBox {
      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 18px;
        color: $color-00;
      }
      .formBox {
        float: left;
        width: 60%;
        min-width: 870px;
      }
      .ordreInfo {
        height: 315px;
        padding: 30px 37px 40px 20px;
        padding-top: 10px;
        clear: both;
        border-bottom: 1px solid $border-disabled-color;
        .infoBox {
          .orderCheckTimePicker {
            width: 350px;
            height: 40px;
          }
        }
        .title {
          float: left;
          width: 175px;
          margin-bottom: 40px;
        }
        .rightPart {
          float: left;
          & > div {
            &:nth-child(n + 2) {
              margin-top: 30px;
            }
            & > div {
              &:nth-child(2) {
                margin-left: 30px;
              }
            }

            height: 66px;
            clear: both;
            & > div {
              float: left;
              width: 350px;
            }
          }
        }
      }
      .orderBuyInfo {
        padding: 0 30px;
        .orderBox {
          padding: 0;
          .tanshu_linkColor {
            &:nth-child(1) {
              display: inline-block;
              margin-right: 22px;
            }
          }
        }
        .title {
          padding: 40px 0 31px 11px;
        }
        .buySurport {
          height: 50px;
          font-size: 14px;
          line-height: 50px;
          color: #247af3;
          text-align: center;
          border: 1px solid $border-disabled-color;
          border-top: none;
          span {
            cursor: pointer;
            &:nth-child(2) {
              color: #206dda;
            }
          }
        }
      }
    }
  }
}
.orderBox {
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}
.tanshu-cardBox-body {
  .rightPart {
    font-size: 14px;
    font-weight: 400;
    color: $color-53;
  }
}
</style>

<style lang="scss">
.ordreInfo .el-input__inner {
  width: 350px;
  margin-right: 60px;
  margin-bottom: 30px;
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-07-21 10:26:02
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-28 17:30:35
-->
<template>
  <global-ts-card-box class="checkInOrder">
    <template v-slot:card-box-head>
      <div class="operateList">
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>订单审批</template>
          <template v-slot:rightPart>订单录入</template>
        </global-ts-tabguide>
      </div>
    </template>
    <template v-slot:card-box-body>
      <div class="cardBox">
        <div class="ordreInfo">
          <div class="title">订单信息</div>
          <fa-form-model class="center" ref="checkInOrderRuleForm" layout="vertical" :model="form" :rules="rules">
            <div class="rightPart">
              <div class="infoBox">
                <div class="contactAcct">
                  <fa-form-model-item label="联系人">
                    <global-ts-input
                      size="large"
                      class="accountName"
                      :disabled="true"
                      v-model="otherInfo.checkData.contacts"
                      placeholder="请输入帐号"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="customSource">
                  <div class="contactAcct">
                    <fa-form-model-item label="成员">
                      <global-ts-input
                        size="large"
                        class="accountName"
                        :disabled="true"
                        v-model="otherInfo.checkData.staffName"
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
                      type="large"
                      placeholder="请选择所属公司"
                      :list="otherInfo.companyList"
                      v-model="form.companyId"
                      style="width: 350px;"
                      :selectkey="{ label: 'name', value: 'id' }"
                      :disabled="form.itemListJson.length > 0"
                      :getPopupContainer="true"
                    >
                    </global-ts-fai-select>
                  </fa-form-model-item>
                </div>
                <div class="customSource">
                  <div class="contactAcct">
                    <fa-form-model-item label="订单号" prop="thOrderId">
                      <global-ts-input
                        class="accountName"
                        v-model="form.thOrderId"
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
                        class="orderCheckTimePicker"
                        v-model="form.buyTime"
                        type="datetime"
                        start-placeholder="请选择购买时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :editable="false"
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
              :data="form.itemListJson"
              border
              header-row-class-name="employeeHeader"
              min-width="1010px"
              box-sizing="border-box"
              cell-class-name="cellStyle"
            >
              <el-table-column prop="thOrderId" label="订单编号" min-width="120px" :key="'thOrderId' + form.thOrderId">
                {{ form.thOrderId }}
              </el-table-column>
              <el-table-column prop="buyTime" label="购买时间" min-width="154px" :key="'buyTime' + form.buyTime">
                {{ form.buyTime }}
              </el-table-column>
              <el-table-column prop="productName" label="产品名称" min-width="100px"></el-table-column>
              <el-table-column prop="productTypeName" label="类型" min-width="48px"></el-table-column>
              <el-table-column prop="amount" label="数量" min-width="107px"></el-table-column>
              <el-table-column prop="totalPrice" label="金额/￥" min-width="94px"></el-table-column>
              <el-table-column prop="bymoney" label="佣金/￥" min-width="94px"></el-table-column>
              <el-table-column prop="source" label="来源" min-width="95px"></el-table-column>
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
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import { confirm, loading, filterData, mixErrorObject, getLimitTips, postLimitVer, getNewAddPoup } from '@/utils';
import { merge } from 'lodash';
import { getTsCompanyList, addTsOrder } from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'check-order',
  mixins: [mixErrorObject()],
  components: {},
  props: {},
  data() {
    return {
      //新添的form结构
      form: {
        cid: this.$parent.passData.id,
        companyId: undefined,
        thOrderId: '',
        itemListJson: [],
        buyTime: '',
      },
      otherInfo: {
        companyList: [],
        activeList: [],
        connectList: [],
        productList: [],
        productType: [],
        checkData: Object.assign({}, this.$parent.passData),
        editId: -1, //编辑的Id
        cloneData: Object.assign({}, this.$parent.passData),
      },
    };
  },
  computed: {
    hasInlistId() {
      const list = [];
      this.form.itemListJson.forEach(data => {
        list.push(data.productId);
      });
      return list;
    },
    rules() {
      return {
        companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
        thOrderId: [
          { required: true, message: '请填写订单号', trigger: 'blur' },
          { min: 1, max: 19, message: '订单号不能超过19位数字', trigger: 'change' },
        ],
        buyTime: [{ required: true, message: '请填写购买时间', trigger: 'change' }],
      };
    },
  },
  watch: {
    'form.buyTime': function(value) {
      const timeStamps = new Date(value.replace(/-/g, '/')).getTime();
      //本身就没有成员的话，不用提示
      if (this.otherInfo.checkData.sid > 0 && timeStamps < this.otherInfo.checkData.salesRelTime) {
        // this.$utils.postMessage({
        //     type: "warning",
        //     message: "选择的时间导致成员发生变更，请确认"
        // });
        this.otherInfo.checkData.sid = 0;
        this.otherInfo.checkData.staffName = '无';
      }
      if (
        this.otherInfo.cloneData.sid != 0 &&
        this.otherInfo.checkData.sid == 0 &&
        timeStamps >= this.otherInfo.checkData.salesRelTime
      ) {
        // this.$utils.postMessage({
        //     type: "warning",
        //     message: "选择的时间导致成员发生变更，请确认"
        // });
        this.otherInfo.checkData.sid = this.otherInfo.cloneData.sid;
        this.otherInfo.checkData.staffName = this.otherInfo.cloneData.staffName;
      }
    },
  },
  created() {
    this.getTsCompanyList();
  },
  mounted() {},
  methods: {
    /**
     * @description : 获取公司列表
     * @author      : ADI
     * @Date        : 2021-07-22 10:01:31
     * @param        {*}
     * @return       {*}
     */
    async getTsCompanyList() {
      const [err, response] = await getTsCompanyList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.otherInfo.companyList = response.data;
      this.otherInfo.activeList = [].concat(response.data);
    },
    createPoupByOpt() {
      return new Promise(resolve => {
        if (!this.poupInfo) {
          loading.addQuene({
            key: 'loadingPoupBox',
          });
          // Ts_util.Res.loadg('poupBuyInfo').then(() => {
          //   loading.poupQuene('loadingPoupBox');
          //   this.poupInfo = Ts_util.getNewAddPoup.getOrderBox(this.otherInfo.checkData.sid);
          //   this.poupInfo.$mount('#order_check_edit_new_add div');
          //   resolve();
          // });
          loading.poupQuene('loadingPoupBox');
          this.poupInfo = getNewAddPoup.getOrderBox(this.otherInfo.checkData.sid);
          this.poupInfo.$mount('#order_check_edit_new_add div');
          resolve();
        } else {
          resolve();
        }
      });
    },
    addBuyInfo() {
      this.createPoupByOpt().then(() => {
        this.poupInfo.showPoup({
          companyId: this.form.companyId,
          sid: this.otherInfo.checkData.sid,
          submitFn: (changeInfo, done) => {
            if (this.hasInlistId.includes(changeInfo.productId)) {
              this.$utils.postMessage({
                type: 'warning',
                message: '该产品购买详情已存在，请勿重复添加',
              });
            } else {
              changeInfo.id = ++this.otherInfo.editId;
              this.form.itemListJson.push(changeInfo);
              done();
            }
          },
        });
      });
    },
    //编辑某项内容
    editBuyeRecord(id) {
      this.createPoupByOpt().then(() => {
        let cusData;
        this.form.itemListJson.forEach(data => {
          if (data.id == id) {
            cusData = data;
            return false;
          }
        });
        this.poupInfo.showPoup(
          Object.assign(
            {
              companyId: this.form.companyId,
              sid: this.otherInfo.checkData.sid,
              submitFn: (changeInfo, done) => {
                if (this.hasInlistId.includes(changeInfo.productId) && cusData.productId != changeInfo.productId) {
                  this.$utils.postMessage({
                    type: 'warning',
                    message: '该产品购买详情已存在，请勿重复添加',
                  });
                } else {
                  let itemIndex = -1;
                  this.form.itemListJson.forEach((data, index) => {
                    if (data.id == id) {
                      itemIndex = index;
                      return false;
                    }
                  });
                  const changeList = [].concat(this.form.itemListJson);
                  changeList[itemIndex] = changeInfo;
                  this.form.itemListJson = changeList;
                  done();
                }
              },
            },
            filterData(cusData, ['productId', 'payType', 'amount', 'totalPrice']),
          ),
        );
      });
    },
    deleteBuyRecord(id) {
      confirm('确认删除该记录？删除后无法恢复', '删除确认').then(action => {
        if (action == 'confirm') {
          let itemIndex = -1;
          this.form.itemListJson.some((data, index) => {
            if (data.id == id) {
              itemIndex = index;

              return true;
            }
          });
          this.form.itemListJson.splice(itemIndex, 1);
        }
      });
    },
    //返回订单审批页面
    backManage() {
      this.$parent.backToOtherPage();
    },
    checkIsChangeStaff() {
      return new Promise(resolve => {
        //如果成员发生了更改
        if (this.otherInfo.cloneData.sid != 0 && this.otherInfo.cloneData.sid != this.otherInfo.checkData.sid) {
          confirm('成员发生变更，是否继续添加？', '添加确认').then(action => {
            if (action == 'confirm') {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    },
    //添加订单
    addOrder() {
      this.$refs.checkInOrderRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        this.checkIsChangeStaff().then(async () => {
          const transPartData = merge({}, this.form);
          transPartData.itemListJson = JSON.stringify(transPartData.itemListJson);
          const [err, response] = await addTsOrder(transPartData);
          if (err) {
            getLimitTips('orderAdd').then(info => {
              if (err.rt == info.rt) {
                postLimitVer(info.msg);
                return;
              }
              this.$utils.postMessage({
                type: 'error',
                message: err.msg || '网络错误，请稍候重试',
              });
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '订单添加成功！',
          });
          this.backManage();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.checkInOrder {
  .tanshu-cardBox-bottom {
    .bottomBtn {
      text-align: center;
    }
  }
  .tanshu-cardBox-body {
    .cardBox {
      .ordreInfo {
        height: 258px;
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
          width: 112px;
        }
        .rightPart {
          float: left;
          margin-left: 51px;
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
      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 18px;
        color: #000000;
      }
      .orderBuyInfo {
        padding: 0 20px;
        .title {
          padding-top: 40px;
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
            &:hover {
              color: #206dda;
            }
          }
        }
        .orderBox {
          .tanshu_linkColor {
            &:nth-child(1) {
              display: inline-block;
              margin-right: 22px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.checkInOrder {
  .tanshu-cardBox-body {
    .ordreInfo {
      .infoBox {
        .orderCheckTimePicker {
          .el-input__inner {
            padding-left: 26px;
          }
          &.onError {
            .el-input__inner {
              border: 1px solid $error-color !important;
            }
          }
        }
      }
    }
  }
}
</style>

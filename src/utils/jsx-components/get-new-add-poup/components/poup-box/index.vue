<!--
 * @Author       : ADI
 * @Date         : 2021-07-21 10:40:04
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-23 14:30:34
-->
<template>
  <global-ts-dialog
    :lock-dialog-body-height="true"
    class="addOrderInfo"
    :dialog-visible="selectOption.showAddOrder"
    dialog-title="新增购买详情"
    width="620px"
    @sure="submitOrder"
    @cancel="cancelOrder"
  >
    <div class="addInfoBox">
      <fa-form-model
        class="inputInfoBox"
        ref="searchUserRuleForm"
        layout="vertical"
        :model="submitOption"
        :rules="rules"
      >
        <fa-form-model-item label="产品" prop="productId">
          <global-ts-fai-select
            type="large"
            placeholder="请选择"
            :list="selectOption.companyList"
            v-model="submitOption.productId"
            v-if="selectOption.showAddOrder"
            :selectkey="{ label: 'name', value: 'id' }"
          >
          </global-ts-fai-select>
        </fa-form-model-item>
        <fa-form-model-item label="类型" prop="payType">
          <global-ts-fai-select
            type="large"
            placeholder="请选择"
            :list="selectOption.productType"
            v-model="submitOption.payType"
            :selectkey="{ label: 'value', value: 'key' }"
          >
          </global-ts-fai-select>
        </fa-form-model-item>
        <fa-form-model-item label="数量" prop="amount">
          <global-ts-input
            size="large"
            class="accountName"
            style="width: 270px;"
            v-if="selectOption.showAddOrder"
            v-model="submitOption.amount"
            placeholder="请填写整数"
          >
          </global-ts-input>
        </fa-form-model-item>
        <fa-form-model-item label="金额" prop="totalPrice">
          <global-ts-input
            size="large"
            class="accountName"
            style="width: 270px;"
            v-if="selectOption.showAddOrder"
            v-model="submitOption.totalPrice"
            placeholder="请填写金额（限两位小数）"
          >
          </global-ts-input>
        </fa-form-model-item>
      </fa-form-model>
    </div>
  </global-ts-dialog>
</template>

<script>
import { getNameFromList, manageRegxp } from '@/utils';
import { getBkge, getTsProductList, getOrderDefList } from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'poup-box',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    rules() {
      return {
        productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入数量', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                callback(new Error('请输入整数'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
          {
            min: 0,
            max: 9,
            message: '数量不能超过9位数字',
            trigger: 'change',
            transform(value) {
              if (typeof value === 'number') {
                value = String(value);
              }
              return value;
            },
          },
        ],
        totalPrice: [
          { required: true, message: '请输入金额', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(4).test(value)) {
                callback(new Error('请输入正确金额（0-9999999.99）'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
      };
    },
  },
  watch: {
    'selectOption.showAddOrder'(show) {
      if (!show) {
        this.$refs.searchUserRuleForm?.resetFields();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    submitOrder() {
      this.$refs.searchUserRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        this.submitOption.sid = this.sid;
        const [err, response] = await getBkge(this.submitOption);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        const changeInfo = {
          productId: this.submitOption.productId,
          payType: this.submitOption.payType,
          productName: getNameFromList(this.selectOption.companyList, this.submitOption.productId, ['name', 'id']),
          productTypeName: getNameFromList(this.selectOption.productType, this.submitOption.payType, ['value', 'key']),
          productType: this.selectOption.productType,
          amount: parseInt(this.submitOption.amount),
          totalPrice: parseFloat(this.submitOption.totalPrice),
          bymoney: response.data,
          source: '手动录入',
        };
        const done = () => {
          this.cancelOrder();
        };
        this.showOpt.submitFn && this.showOpt.submitFn(changeInfo, done);
      });
    },
    cancelOrder() {
      this.selectOption.showAddOrder = false;
    },
    //显示弹窗
    async showPoup(opt) {
      this.showOpt = opt;
      if (!this.showOpt.companyId) {
        this.$utils.postMessage({
          type: 'error',
          message: '请选择公司后，再添加购买详情！',
        });
        return;
      }
      // this.tanshu_removeCheckErr();
      this.submitOption.productId = this.showOpt.productId || undefined;
      this.submitOption.payType = this.showOpt.payType || 1;
      this.submitOption.amount = this.showOpt.amount || '';
      this.submitOption.totalPrice = this.showOpt.totalPrice || '';
      if (typeof opt.sid !== 'undefined') {
        this.submitOption.sid = opt.sid;
      }
      var hasCount = 0;
      var that = this;
      var countIsSuccess = function() {
        if (++hasCount == 2) {
          that.selectOption.showAddOrder = true;
        }
      };
      //获取产品列表
      const [err, response] = await getTsProductList({
        isGetAll: true,
        companyId: this.showOpt.companyId,
        dataSource: 1,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      } else {
        this.selectOption.companyList = response.data;
        countIsSuccess();
      }

      //获取类型列表
      const [getOrderDefListErr, getOrderDefListResponse] = await getOrderDefList();
      if (getOrderDefListErr) {
        this.$utils.postMessage({
          type: 'error',
          message: getOrderDefListErr.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(getOrderDefListErr);
      } else {
        this.selectOption.productType = getOrderDefListResponse.data.payTypeList;
        countIsSuccess();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addOrderInfo {
  .addInfoBox {
    padding: 0 0 20px 0;
  }
  .bottomBar {
    height: 38px;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid $border-disabled-color;
    & > div {
      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }
  .errorInfoBox {
    padding: 20px;
    margin-bottom: 30px;
    background: #fff0f0;
    border: 1px solid $error-color;
    border-radius: 4px;
    svg {
      color: $error-color;
    }
  }
  .inputInfoBox {
    .redSnowFlower {
      width: 100%;
    }
    & > .fa-form-item {
      display: inline-block;
      width: 270px;
      .ts-fai-select {
        width: 270px;
      }
      &:nth-child(2n + 1) {
        margin-right: 20px;
      }

      /* &:nth-child(n + 2) {
        margin-top: 20px;
      } */
    }
  }
}
</style>

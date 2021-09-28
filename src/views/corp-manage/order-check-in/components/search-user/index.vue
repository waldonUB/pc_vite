<!--
 * @Author       : ADI
 * @Date         : 2021-07-21 10:25:43
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 09:54:04
-->
<template>
  <global-ts-card-box class="selectUser" :bottomTips="true">
    <template v-slot:card-box-head>
      <div class="operateList">
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>订单审批</template>
          <template v-slot:rightPart>订单录入</template>
        </global-ts-tabguide>
      </div>
    </template>
    <template v-slot:card-box-body>
      <fa-form-model class="center" ref="searchUserRuleForm" layout="vertical" :model="formData" :rules="rules">
        <fa-form-model-item label="联系手机" prop="phoneNumber">
          <global-ts-input class="accountName" v-model="formData.phoneNumber" placeholder="请输入手机号码" size="large">
          </global-ts-input>
        </fa-form-model-item>
      </fa-form-model>
    </template>
    <template v-slot:card-box-bottom>
      <global-ts-buttontips>
        <global-ts-button slot="button" class="em_add_emp" type="primary" size="medium" @click="addOrder">
          查询
        </global-ts-button>
        <span slot="buttonTips">说明：请先根据联系手机查找联系人</span>
      </global-ts-buttontips>
    </template>
  </global-ts-card-box>
</template>

<script>
import { filterData, manageRegxp } from '@/utils';
import { getTsClientByMobile } from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'search-user',
  components: {},
  props: {},
  data() {
    return {
      formData: {
        phoneNumber: '',
      },
      cid: -1,
    };
  },
  computed: {
    rules() {
      return {
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(13).test(value)) {
                callback(new Error('手机号码格式为6-25位数字'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    backManage() {
      this.$parent.backToOtherPage();
    },
    addOrder() {
      this.$refs.searchUserRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        const [err, response] = await getTsClientByMobile({
          mobile: this.formData.phoneNumber,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        const list = response.data;
        if (list.length <= 0) {
          this.$utils.postMessage({
            type: 'warning',
            message: response.msg || '手机号输入错误或该联系人不属于您',
          });
        } else {
          this.$parent.passData = filterData(response.data[0], ['id', 'sid', 'contacts', 'staffName', 'salesRelTime']);
          this.$parent.passData.staffName = this.$parent.passData.staffName || '无';
          this.$parent.changeCom('checkOrder');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.selectUser .center {
  width: 350px;
  padding-top: 30px;
  margin: 0 auto;
}
</style>

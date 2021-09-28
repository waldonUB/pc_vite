<!--
 * @Description  : 开通公司的表单
 * @Author       : turbo
 * @Date         : 2021-07-22 11:28:20
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 13:27:12
-->

<template>
  <global-ts-card-box class="open-form">
    <template #card-box-head>
      <global-ts-header>
        <template #leftPart>
          第三方接入
          <div class="redTip">*该功能仅限专用版开放使用</div>
        </template>
      </global-ts-header>
    </template>
    <template #card-box-body>
      <fa-form-model layout="vertical">
        <fa-form-model-item label="选择开通公司">
          <global-ts-select
            type="large"
            placeholder="请选择开通公司"
            :list="companyList"
            v-model="form.companyId"
          ></global-ts-select>
        </fa-form-model-item>
        <fa-form-model-item label="自动接入建站快车">
          <fa-radio-group v-model="form.openThird">
            <fa-radio v-for="(item, index) in openThird" :key="index" :value="item.value">
              {{ item.label }}
            </fa-radio>
          </fa-radio-group>
        </fa-form-model-item>
      </fa-form-model>
    </template>
    <template #card-box-bottom>
      <global-ts-buttontips>
        <template #button>
          <global-ts-button type="primary" size="medium" @click="onSubmit">保存</global-ts-button>
        </template>
        <template #buttonTips>说明：设置接入后，将同步建站快车的客户、产品和订单数据</template>
      </global-ts-buttontips>
    </template>
  </global-ts-card-box>
</template>

<script>
// api
import { third } from '@/api';

export default {
  name: 'OpenForm',
  data() {
    return {
      form: {
        companyId: 0,
        openThird: 0,
      },
      companyList: [],
      openThird: [
        {
          label: '否',
          value: 0,
        },
        {
          label: '是',
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getCompanyList();
  },
  methods: {
    async getCompanyList() {
      const { getTsCompanyList } = third;
      const [err, res] = await getTsCompanyList({
        isGetAll: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      res.data.forEach(data => {
        this.companyList.push({
          value: data.id,
          label: data.name,
        });
      });
    },
    async onSubmit() {
      if (this.form.openThird === 1) {
        const { addAgentThirdInfo } = third;
        const [err, res] = await addAgentThirdInfo(this.form);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$emit('toCompanyList');
      } else {
        this.$utils.postMessage({
          type: 'warning',
          message: '目前只能选择自动接入建站快车',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.open-form {
  .fa-form {
    width: 350px;
    margin: 40px auto 0;
  }
}
</style>

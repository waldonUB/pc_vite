<!--
 * @Description  : 开通推广链接的表单
 * @Author       : turbo
 * @Date         : 2021-07-22 15:19:04
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 17:20:15
-->

<template>
  <global-ts-card-box class="open-form">
    <template #card-box-head>
      <global-ts-header>
        <template #leftPart>
          推广链接
          <div class="redTip">*该功能仅限专用版开放使用</div>
        </template>
      </global-ts-header>
    </template>
    <template #card-box-body>
      <fa-form-model layout="vertical">
        <fa-form-model-item label="选择开通公司">
          <global-ts-select
            type="large"
            placeholder="请选择"
            :width="540"
            :list="companyList"
            v-model="form.companyId"
            @change="changeCompanyInfo"
          ></global-ts-select>
        </fa-form-model-item>
        <fa-form-model-item label="是否开通推广链接">
          <fa-radio-group v-model="form.openProUrl">
            <fa-radio v-for="(item, index) in openProUrlList" :key="index" :value="item.value">
              {{ item.label }}
            </fa-radio>
          </fa-radio-group>
        </fa-form-model-item>
        <fa-form-model-item v-if="form.openProUrl === 1" label="推广注册链接设置">
          <global-ts-input size="large" placeholer="请输入推广注册链接" v-model="form.proUrl"></global-ts-input>
        </fa-form-model-item>
      </fa-form-model>
      <div v-if="form.openProUrl === 1" class="divider">
        <span class="title">以下为效果预览，保存后生效</span>
        <div class="copy-url-box">
          <div class="label">复制链接后，将链接发给其他人，他们通过该页面注册后即可成为你的客户</div>
          <div class="input-box">
            <div class="copy-content">{{ showProUrl }}</div>
            <global-ts-button class="copy-link-button" type="primary" size="medium" @click="copyUrl">
              复制链接
            </global-ts-button>
          </div>
        </div>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-buttontips>
        <template #button>
          <global-ts-button type="primary" size="medium" @click="onSubmit">保存</global-ts-button>
        </template>
        <template #buttonTips>说明：设置后，销售员可以将该链接发给客户注册</template>
      </global-ts-buttontips>
    </template>
  </global-ts-card-box>
</template>

<script>
// utils
import { clipboard } from '@/utils';

// api
import { third } from '@/api';

export default {
  name: 'OpenForm',
  data() {
    return {
      form: {
        companyId: 0,
        openProUrl: 0,
        proUrl: '',
      },
      showProUrl: '',
      companyList: [],
      companyListTemp: {},
      openProUrlList: [],
    };
  },
  watch: {
    'form.proUrl'() {
      if (this.form.proUrl === '') {
        this.showProUrl = '';
        return;
      }

      this.showProUrl = this.form.proUrl + `${this.form.proUrl.indexOf('?') > -1 ? '&' : '?'}_st=成员ID`;
    },
  },
  created() {
    this.getCompanyList();
    this.getDefList();
  },
  methods: {
    async getCompanyList() {
      const { getTsCompanyList } = third;
      const [err, res] = await getTsCompanyList({
        isGetAll: true,
        openInterface: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '获取公司列表失败，请重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      this.form.companyId = list[0]?.id || 0;
      for (const data of list) {
        this.companyList.push({
          value: data.id,
          label: data.name,
        });
        this.companyListTemp[data.id] = data;
      }
    },
    async getDefList() {
      const { getTsCompanyDefList } = third;
      const [err, res] = await getTsCompanyDefList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '页面初始化失败，请重试',
        });
        return Promise.reject(err);
      }
      const { openProUrlList = [] } = res.data;
      for (const data of openProUrlList) {
        this.openProUrlList.push({
          value: data.key,
          label: data.value,
        });
      }
    },
    changeCompanyInfo() {
      const companyId = this.form.companyId || 0;
      const companyInfo = this.companyListTemp[companyId] || {};
      this.form.openProUrl = companyInfo.openProUrl || 0;
      this.form.proUrl = companyInfo.proUrl || '';
    },
    copyUrl() {
      clipboard(this.showProUrl, '复制成功', '当前浏览器不支持');
    },
    async onSubmit() {
      const { setProUrl } = third;
      const [err, res] = await setProUrl(this.form);
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '保存失败，请重试' : '保存成功',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.open-form {
  .fa-form {
    width: 540px;
    margin: 40px auto 0;
  }

  .divider {
    width: 100%;
    margin: 60px auto 0;
    overflow: hidden;
    color: $color-b2;
    text-align: center;
    background-color: $color-ff;

    .title {
      position: relative;

      &::before {
        position: absolute;
        top: 50%;
        left: 200px;
        width: 1000000px;
        border-top: 1px solid $color-ee;
        content: '';
        transform: translate(0%, -50%);
      }

      &::after {
        position: absolute;
        top: 50%;
        right: 200px;
        width: 1000000px;
        border-top: 1px solid $color-ee;
        content: '';
        transform: translate(0%, -50%);
      }
    }
  }

  .copy-url-box {
    width: 540px;
    margin: 70px auto 0;

    .label {
      margin-bottom: 10px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.85);
      text-align: left;
    }

    .input-box {
      @include flex-left;
    }

    .copy-content {
      @include flex-left;

      width: 395px;
      height: 40px;
      padding: 0 10px;
      color: rgba(0, 0, 0, 0.65);
      border: 1px solid $color-da;
      border-right: 0 none;
      border-radius: 4px 0 0 4px;
      box-sizing: border-box;
    }

    .copy-link-button {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>

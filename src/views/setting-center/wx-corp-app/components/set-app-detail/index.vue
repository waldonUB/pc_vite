<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:57:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:06:23
-->
<template>
  <global-ts-card-box class="detailWrapper setAppDetail">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>企微设置</template>
        <template v-slot:rightPart>企微小程序</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="tip-box">
        <global-ts-warn-tips size="middle" tip-type="info">
          <p class="warnTipsContent" slot="content">
            如何将小程序安装到企业微信？
            <a :href="setAppHelpUrlCal" target="_blank">查看详情</a>
          </p>
        </global-ts-warn-tips>
      </div>
      <div class="mainWrapper">
        <fa-form-model ref="setAppDetailForm" :model="editInfo" :rules="formRules" :hideRequiredMark="true">
          <fa-form-model-item label="AgentId" prop="appleAgentId">
            <global-ts-input v-model="editInfo.appleAgentId"> </global-ts-input>
          </fa-form-model-item>
          <fa-form-model-item label="Secret" prop="appleAgentSecret">
            <global-ts-input v-model="editInfo.appleAgentSecret"> </global-ts-input>
          </fa-form-model-item>
        </fa-form-model>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-button type="primary" size="medium" @click="saveSetting">保存</global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import { mapState } from 'vuex';
import { filterData, getWxWorkCorp } from '@/utils';
import { saveWxWorkCorpByApple } from '@/api/modules/views/setting-center';

export default {
  name: 'set-app-detail',
  components: {},
  props: {
    currentTemp: {
      type: String,
      default: '',
    },
    wxWorkCorpData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isPublishApp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editInfo: {
        appleAgentId: '',
        appleAgentSecret: '',
      },
      rules: {}, // 输入框校验规则，重复部分较多，放在方法里面写
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      isOem: state => state.user.info.isOem,
    }),
    setAppHelpUrlCal() {
      if (this.isOem && !this.isPublishApp) {
        // 分销未授权
        return this.addressUrl.wxWorkCorpSetting_9;
      } else {
        return this.addressUrl.wxWorkCorpSetting_7;
      }
    },
    formRules() {
      return {
        appleAgentId: [{ required: true, message: '请输入appleAgentId', trigger: 'blur' }],
        appleAgentSecret: [{ required: true, message: '请输入appleAgentSecret', trigger: 'blur' }],
      };
    },
  },
  watch: {},
  created() {
    this.editInfo = {
      ...this.editInfo,
      ...filterData(this.wxWorkCorpData, ['appleAgentId', 'appleAgentSecret']),
    };
  },
  mounted() {},
  methods: {
    backManage() {
      this.$emit('update:currentTemp', 'wxCorpAppList');
    },
    /**
     * 保存企微小程序设置
     * @author waldon
     * @date 2021/1/23
     */
    saveSetting() {
      this.$refs['setAppDetailForm'].validate(async valid => {
        if (valid) {
          const [err, res] = await saveWxWorkCorpByApple(this.editInfo);
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          getWxWorkCorp._refresh = true; // 改变时需设为true，重新从接口查对应的信息
          this.$utils.postMessage({
            type: 'success',
            message: '成功安装小程序到企业微信',
          });
          const wxWorkCorpData = await getWxWorkCorp();
          this.$emit('update:wxWorkCorpData', wxWorkCorpData);
          this.backManage();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.setAppDetail .tip-box {
  padding: 20px;
  margin-bottom: 25px;
  box-sizing: border-box;
}
</style>

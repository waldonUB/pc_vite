<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:54:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:22:00
-->
<template>
  <global-ts-card-box class="detailWrapper wxCorpAppDetail">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>企微设置</template>
        <template v-slot:rightPart>接入企微</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="stepBox tsSteps">
        <fa-steps :current="currentCal" labelPlacement="vertical">
          <fa-step :title="item.title" v-for="item of stepList" :key="item.key">
            <template slot="description">
              <global-ts-tool-tips
                offset="10"
                effect="dark"
                content="如何换绑企业"
                placement="top-start"
                v-if="item.key === stepDefine.INSTALL_APP"
              >
                <div @click="gotoWxCorpAppRebindUrl" class="inStallBox">安装应用</div>
              </global-ts-tool-tips>
              <a v-if="active === item.key && item.isShowGuide && false" :href="stepGuideUrl" target="_blank">
                查看设置指引
              </a>
            </template>
          </fa-step>
        </fa-steps>
      </div>
      <div class="mainWrapper">
        <div class="stadyWrapper">
          <studyTip v-if="active !== stepDefine.INSTALL_APP" @handleClick="toSeeStudyLink(stepGuideUrl)"></studyTip>
        </div>
        <div class="inputWrapper" v-if="active === stepDefine.CUSTOMER_SET">
          <div class="text">客户联系Secret</div>
          <fa-input v-model="editInfo.externalSecret"> </fa-input>
        </div>
        <div class="inputWrapper" v-else>
          <div class="text">通讯录Secret</div>
          <fa-input v-model="editInfo.userSecret"> </fa-input>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">回调地址（URL）</div>
          <fa-input v-model="editInfo.wxCallback" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" @click="copyUrl('wxCallback')">复制</global-ts-button>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">Token</div>
          <fa-input v-model="editInfo.token" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl('token')">
            复制
          </global-ts-button>
          <global-ts-tool-tips v-if="!lastCheckCal" offset="10" effect="dark" content="重新获取" placement="top-start">
            <global-ts-svg-icon
              class="icon icon_16 reloadIcon"
              :size="16"
              name="icon-zhongzhi1616"
              @click="reloadKey('token')"
            ></global-ts-svg-icon>
          </global-ts-tool-tips>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">EncodingAESKey</div>
          <fa-input v-model="editInfo.aesKey" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl('aesKey')">
            复制
          </global-ts-button>
          <global-ts-tool-tips v-if="!lastCheckCal" offset="10" effect="dark" content="重新获取" placement="top-start">
            <global-ts-svg-icon
              class="icon icon_16 reloadIcon"
              :size="16"
              name="icon-zhongzhi1616"
              @click="reloadKey('aesKey')"
            ></global-ts-svg-icon>
          </global-ts-tool-tips>
        </div>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-button type="primary" size="medium" @click="saveSetting" :disabled="hasEmptyCal || isFinishSet">
        {{ saveTextCal }}
      </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import detailComm from '../../mixins/detail-comm/index.vue';
import ManagerDef from '@/config/manager-def';
import { filterData, getWxWorkCorp } from '@/utils';
import { saveWxWorkCorpByExternal, saveWxWorkCorpByUser } from '@/api/modules/views/setting-center';
import { mapState } from 'vuex';

export default {
  name: 'wx-corp-app-detail',
  mixins: [detailComm],
  components: {},
  props: {},
  data() {
    return {
      active: ManagerDef.WX_CORP_STEP_DEFINE.CONTACTS_SET,
      stepDefine: ManagerDef.WX_CORP_STEP_DEFINE,
      stepList: [
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE.INSTALL_APP,
          title: '',
          isShowGuide: false,
        },
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE.CONTACTS_SET,
          title: '通讯录设置',
          isShowGuide: true,
        },
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE.CUSTOMER_SET,
          title: '客户联系设置',
          isShowGuide: true,
        },
      ],
      editInfo: {
        externalSecret: '', // 客户联系secret
        token: '',
        aesKey: '',
        wxCallback: '',
        userSecret: '', // 通讯录secret
      },
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    /**
     * 换绑指引
     * @author waldon
     * @date 2021/1/28
     * @returns {String} - 换绑指引
     */
    wxCorpAppRebindUrl() {
      return this.addressUrl.wxWorkCorpSetting_5; // 换绑指引
    },
    /**
     * 对应指引
     * @author waldon
     * @date 2021/1/22
     * @returns {String} - 返回值说明
     */
    stepGuideUrl() {
      switch (this.active) {
        case ManagerDef.WX_CORP_STEP_DEFINE.CUSTOMER_SET:
          return this.addressUrl.wxWorkCorpSetting_3; // 客户联系设置
        case ManagerDef.WX_CORP_STEP_DEFINE.CONTACTS_SET:
          return this.addressUrl.wxWorkCorpSetting_6; // 通讯录设置
        default:
          return '';
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 换绑
     * @author waldon
     * @date 2021/1/28
     */
    gotoWxCorpAppRebindUrl() {
      window.open(this.wxCorpAppRebindUrl);
    },
    /**
     * 保存企微授权信息
     * @author waldon
     * @date 2021/1/23
     */
    async saveSetting() {
      let ajaxUrl = '';
      let params = {};
      switch (this.active) {
        case ManagerDef.WX_CORP_STEP_DEFINE.CUSTOMER_SET:
          ajaxUrl = saveWxWorkCorpByExternal;
          params = filterData(this.editInfo, ['externalSecret', 'token', 'aesKey']);
          break;
        case ManagerDef.WX_CORP_STEP_DEFINE.CONTACTS_SET:
          ajaxUrl = saveWxWorkCorpByUser;
          params = filterData(this.editInfo, ['userSecret']);
          break;
      }
      if (!ajaxUrl) {
        return;
      }
      let isCanSave = true;
      Object.keys(params).forEach(item => {
        if (!params[item]) {
          this.rules[`${item}ErrCount`]++;
          isCanSave = false;
        }
      });
      if (!isCanSave) {
        // 每一项都不能为空
        return;
      }
      const [err, res] = await ajaxUrl(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const nextFN = async () => {
        // 保存成功后的逻辑
        getWxWorkCorp._refresh = true;
        this.isFinishSet = false;
        if (this.active < Math.max(...Object.values(ManagerDef.WX_CORP_STEP_DEFINE))) {
          // 完成设置返回列表
          this.active++;
        } else {
          this.isFinishSet = true;
        }
        this.$utils.postMessage({
          type: 'success',
          message: this.isFinishSet ? '您已成功接入企业微信' : '保存成功',
        });
        const wxWorkCorpData = await getWxWorkCorp();
        this.editInfo = { ...this.editInfo, ...wxWorkCorpData };
        this.$emit('update:wxWorkCorpData', wxWorkCorpData);
        if (this.isFinishSet) {
          // 如果完成设置，最后再跳回列表页
          this.$emit('update:currentTemp', 'wxCorpAppList');
        }
      };
      if (res.data && !res.data.checkPass) {
        // 校验不通过则提示用户去企微后台设置
        const checkOption = {
          step: this.active,
          nextFN,
          checkMsg:
            this.active === this.stepDefine.CUSTOMER_SET
              ? '校验客户联系消息通知中，请按照设置教程，到企业微信后台点击【保存】'
              : '校验通讯录消息通知中，请按照设置教程，到企业微信后台点击【保存】',
          checkStepCount: 0,
          checkMaxCount: 60,
        };
        clearTimeout(this.checkStepTimer);
        this.toCheckStep(checkOption);
      } else {
        nextFN();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detailWrapper {
  &.oem {
    .stepBox {
      width: 684px;
    }
    .mainWrapper {
      width: 684px;
    }
  }
  .mainWrapper {
    justify-content: flex-start;
    padding-left: 12px;
    box-sizing: border-box;
    .inputWrapper {
      width: 562px;
      justify-content: flex-start;
    }
  }
  .tanshu-cardBox-bottom {
    .btn-left {
      margin-right: 10px;
    }
  }
}
</style>

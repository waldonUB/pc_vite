<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:55:01
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:21:11
-->
<template>
  <global-ts-card-box class="detailWrapper oem wxCorpAppDetail">
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
              <a v-if="active === item.key && item.isShowGuide && false" :href="stepGuideUrl" target="_blank">
                查看设置指引
              </a>
            </template>
          </fa-step>
        </fa-steps>
      </div>
      <div class="mainWrapper">
        <div class="stadyWrapper">
          <studyTip @handleClick="toSeeStudyLink(stepGuideUrl)"></studyTip>
        </div>
        <div class="stepWrapper" v-if="active === stepDefine.INSTALL_APP">
          <div class="inputWrapper">
            <div class="text">企业名称</div>
            <fa-input v-model="editInfo.corpName"> </fa-input>
          </div>
          <div class="inputWrapper">
            <div class="text">企业ID</div>
            <div class="input-content-wrapper">
              <div class="idChangeTip" @click="changeCorpId" v-if="!canIdChange">更换企业ID</div>
              <fa-input :disabled="!canIdChange" v-model="editInfo.corpId"> </fa-input>
            </div>
          </div>
        </div>
        <div class="stepWrapper" v-else-if="active === stepDefine.CORP_AGENT_SET">
          <div class="inputWrapper">
            <div class="text">AgentId</div>
            <fa-input v-model="editInfo.corpAgentId"> </fa-input>
          </div>
          <div class="inputWrapper">
            <div class="text">Secret</div>
            <fa-input v-model="editInfo.corpAgentSecret"> </fa-input>
          </div>
        </div>
        <div class="stepWrapper" v-else>
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
            <global-ts-button class="copyBtn" size="small" @click="copyUrl('wxCallback')">复制</global-ts-button>
          </div>
          <div class="inputWrapper copyInput">
            <div class="text">Token</div>
            <fa-input v-model="editInfo.token" disabled="disabled"> </fa-input>
            <global-ts-button class="copyBtn" size="small" @click="copyUrl('token')">
              复制
            </global-ts-button>
            <global-ts-tool-tips
              v-if="!lastCheckCal"
              offset="10"
              effect="dark"
              content="重新获取"
              placement="top-start"
            >
              <global-ts-svg-icon
                class="icon icon_16 reloadIcon"
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
            <global-ts-tool-tips
              v-if="!lastCheckCal"
              offset="10"
              effect="dark"
              content="重新获取"
              placement="top-start"
            >
              <global-ts-svg-icon
                class="icon icon_16 reloadIcon"
                name="icon-zhongzhi1616"
                @click="reloadKey('aesKey')"
              ></global-ts-svg-icon>
            </global-ts-tool-tips>
          </div>
        </div>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-button
        v-if="active !== stepDefine.INSTALL_APP"
        class="btn-left"
        type="others"
        size="medium"
        @click="lastStep"
      >
        上一步
      </global-ts-button>
      <global-ts-button
        type="primary"
        size="medium"
        @click="saveSetting"
        :disabled="hasEmptyCal || isFinishSet || isCleaning"
        >{{ saveTextCal }}
      </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import detailComm from '../../mixins/detail-comm/index.vue';
import ManagerDef from '@/config/manager-def';
import { mapState } from 'vuex';
import { confirm, filterData, getWxWorkCorp } from '@/utils';
import {
  saveWxWorkCorpByCorp,
  saveWxWorkCorpByAgent,
  saveWxWorkCorpByExternal,
  saveWxWorkCorpByUser,
} from '@/api/modules/views/setting-center';

export default {
  name: 'wx-corp-app-detail-oem',
  mixins: [detailComm],
  components: {},
  props: {},
  data() {
    return {
      active: ManagerDef.WX_CORP_STEP_DEFINE_OEM.INSTALL_APP,
      stepDefine: ManagerDef.WX_CORP_STEP_DEFINE_OEM,
      stepList: [
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE_OEM.INSTALL_APP,
          title: '企业信息设置',
          isShowGuide: true,
        },
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE_OEM.CORP_AGENT_SET,
          title: '创建自建应用',
          isShowGuide: true,
        },
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE_OEM.CONTACTS_SET,
          title: '通讯录设置',
          isShowGuide: true,
        },
        {
          key: ManagerDef.WX_CORP_STEP_DEFINE_OEM.CUSTOMER_SET,
          title: '客户联系设置',
          isShowGuide: true,
        },
      ],
      editInfo: {
        corpName: '', // 企业名称
        corpId: '', // 企业id
        corpAgentId: '',
        corpAgentSecret: '',
        externalSecret: '', // 客户联系secret
        token: '',
        aesKey: '',
        wxCallback: '',
        userSecret: '', // 通讯录secret
        cleanOldData: false, // 是否清除换绑企业的数据
      },
      canIdChange: true, // 是否允许更改企业ID
      lastCropId: '', // 缓存上次保存的企业id
      isCleaning: false, // 是否正在清除数据
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    isChangeIdCal() {
      return this.lastCropId && this.lastCropId !== this.editInfo.corpId;
    },
    /**
     * 对应指引
     * @author waldon
     * @date 2021/1/22
     * @returns {String} - 返回值说明
     */
    stepGuideUrl() {
      switch (this.active) {
        case this.stepDefine.INSTALL_APP:
          return this.addressUrl.wxWorkCorpSetting_1; // 企业信息设置
        case this.stepDefine.CORP_AGENT_SET:
          return this.addressUrl.wxWorkCorpSetting_2; // 创建自建应用
        case this.stepDefine.CUSTOMER_SET:
          return this.addressUrl.wxWorkCorpSetting_3; // 客户联系设置
        case this.stepDefine.CONTACTS_SET:
          return this.addressUrl.wxWorkCorpSetting_6; // 通讯录设置
        default:
          return this.addressUrl.wxWorkCorpSetting_6; // 通讯录设置
      }
    },
  },
  watch: {},
  created() {
    this.canIdChange = !this.editInfo.corpId;
  },
  mounted() {},
  methods: {
    /**
     * copy from wxCorpSetting
     * @modify waldon
     * @date 2021/3/4
     */
    changeCorpId() {
      confirm('企业ID是企业的唯一标识，更换企业ID会导致旧数据失效，请确认是否需要更换企业ID', '提示', '确认更换').then(
        () => {
          this.canIdChange = true;
          this.lastCropId = this.editInfo.corpId;
        },
      );
    },
    /**
     * 保存设置
     * @modify waldon 2021年3月1日 迁移和修改分销的保存
     * @date 2020/4/10
     * */
    async saveSetting() {
      if (this.isChangeIdCal) {
        // 解绑清除操作
        this.clearOldData();
        return;
      }
      this.canIdChange = false;
      let ajaxUrl = '';
      let params = {};
      switch (this.active) {
        case this.stepDefine.INSTALL_APP:
          ajaxUrl = saveWxWorkCorpByCorp;
          params = filterData(this.editInfo, ['corpName', 'corpId', 'cleanOldData']);
          break;
        case this.stepDefine.CORP_AGENT_SET:
          ajaxUrl = saveWxWorkCorpByAgent;
          params = filterData(this.editInfo, ['corpAgentId', 'corpAgentSecret']);
          break;
        case this.stepDefine.CUSTOMER_SET:
          ajaxUrl = saveWxWorkCorpByExternal;
          params = filterData(this.editInfo, ['externalSecret', 'token', 'aesKey']);
          break;
        case this.stepDefine.CONTACTS_SET:
          ajaxUrl = saveWxWorkCorpByUser;
          params = filterData(this.editInfo, ['userSecret']);
          break;
      }
      if (!ajaxUrl) {
        return;
      }
      let isCanSave = true;
      const { CORP_AGENT_SET, CUSTOMER_SET, CONTACTS_SET } = this.stepDefine;
      if ([CORP_AGENT_SET, CUSTOMER_SET, CONTACTS_SET].includes(this.active)) {
        Object.keys(params).forEach(item => {
          if (!params[item]) {
            this.rules[`${item}ErrCount`]++;
            isCanSave = false;
          }
        });
      }
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
        getWxWorkCorp.getWxWorkCorp_refresh = true;
        this.isFinishSet = false;
        this.isCleaning = false; // 清除数据完成
        if (this.active < Math.max(...Object.values(ManagerDef.WX_CORP_STEP_DEFINE_OEM))) {
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
        if (this.editInfo.cleanOldData) {
          // 如果是清除了信息的情况，需要重新赋值
          this.editInfo.cleanOldData = false;
        }
        this.$emit('update:wxWorkCorpData', wxWorkCorpData);
        if (this.isFinishSet) {
          // 如果完成设置，最后再跳回列表页
          this.$emit('update:currentTemp', 'wxCorpAppList');
          this.$emit('completeSet'); // 完成设置，现在放在保存通讯录的接口中，目前他是最后一步的设置
        }
      };
      if (res.data && !res.data.checkPass && this.active >= this.stepDefine.CUSTOMER_SET) {
        // 校验不通过则提示用户去企微后台设置
        const checkOption = {
          step: this.active - 1,
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
    /**
     * 更换企业
     * @modify waldon 从setting页面复制过来
     * @date 2021/3/1
     */
    clearOldData() {
      this.lastCropId = this.editInfo.corpId;
      this.canIdChange = false;
      confirm('更换企业成功，部分旧数据已失效,建议您清除旧数据', '提示', '全部清除')
        .then(() => {
          this.editInfo.cleanOldData = true;
          this.saveSetting();
        })
        .catch(() => {
          this.saveSetting();
        })
        .finally(() => {
          this.isCleaning = true;
        });
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
      padding-left: 85px;
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

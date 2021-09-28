<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:56:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 13:46:35
-->
<template>
  <global-ts-card-box class="detailWrapper wxWorkMsgDetail">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>企微设置</template>
        <template v-slot:rightPart>接入会话存档</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="stepBox tsSteps">
        <fa-steps :current="currentCal" labelPlacement="vertical">
          <fa-step :title="item.title" v-for="item of stepWxWorkMsgList" :key="item.key"></fa-step>
        </fa-steps>
      </div>
      <div class="mainWrapper">
        <studyTip @handleClick="toSeeStudyLink"></studyTip>
        <div class="userInput-wraper" v-if="active === stepConfig.CREATE">
          <div class="inputWrapper">
            <div class="text">Agentld</div>
            <global-ts-input v-model="selfEditInfo.corpAgentId"> </global-ts-input>
          </div>
          <div class="inputWrapper">
            <div class="text">Secret</div>
            <global-ts-input v-model="selfEditInfo.corpAgentSecret"> </global-ts-input>
          </div>
        </div>
        <div class="userInput-wraper" v-if="active === stepConfig.SET_TOOL">
          <div class="inputWrapper" v-for="(ipDress, index) in selfEditInfo.ipList" :key="index">
            <div class="text">可信IP地址</div>
            <global-ts-input disabled="disabled" :placeholder="ipDress"></global-ts-input>
            <global-ts-button class="copyBtn" size="small" @click="copyUrl(ipDress)">复制</global-ts-button>
          </div>
          <div class="inputWrapper">
            <div class="text">消息密钥</div>
            <global-ts-input v-model="selfEditInfo.publicKey" disabled="disabled"> </global-ts-input>
            <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.publicKey, true)">
              复制
            </global-ts-button>
          </div>
          <div class="inputWrapper">
            <div class="text">公钥版本</div>
            <global-ts-input class="input-full" limitInput="int" maxlength="9" v-model="selfEditInfo.publicKeyVer">
            </global-ts-input>
          </div>
          <div class="inputWrapper">
            <div class="text">会话密钥 (Secret)</div>
            <global-ts-input class="input-full" v-model="selfEditInfo.secret"> </global-ts-input>
          </div>
        </div>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-button
        v-if="active !== stepConfig.CREATE"
        class="btn-left"
        type="others"
        size="medium"
        @click="lastStep"
      >
        上一步
      </global-ts-button>
      <global-ts-button type="primary" size="medium" @click="saveSetting" :disabled="hasEmptyCal">
        {{ saveTextCal }}
      </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import ManagerDef from '@/config/manager-def';
import studyTip from '../study-tip/index.vue';
import { clipboard, filterData, getWxWorkCorp } from '@/utils';
import { mapState } from 'vuex';
import { getSettingInfo, saveWxWorkCorpByAgent, saveSettingInfo } from '@/api/modules/views/setting-center';

export default {
  name: 'wx-work-msg-detail',
  components: {
    studyTip,
  },
  props: {},
  data() {
    return {
      active: ManagerDef.WXWORK_MSG_STEP_DEFINE.CREATE,
      stepConfig: ManagerDef.WXWORK_MSG_STEP_DEFINE,
      stepWxWorkMsgList: [
        // 步骤list
        {
          key: ManagerDef.WXWORK_MSG_STEP_DEFINE.CREATE,
          title: '创建自建应用',
        },
        {
          key: ManagerDef.WXWORK_MSG_STEP_DEFINE.SET_TOOL,
          title: '接入会话存档',
        },
      ],
      selfEditInfo: {
        corpAgentId: '', // agentld
        corpAgentSecret: '', // secret
        ipList: [], // ip地址
        publicKey: '', // 消息密钥
        publicKeyVer: '', // 公钥版本
        secret: '', // 会话密钥 secret
      },
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    /**
     * 步骤条显示比实际小1
     * @author waldon
     * @date 2021/1/23
     * @returns {Number} - 步骤条显示
     */
    currentCal() {
      return this.active - 1;
    },
    saveTextCal() {
      return this.active === this.stepConfig.SET_TOOL ? '完成设置' : '下一步';
    },
    /**
     * 是否存在空行
     * 创建应用是检验 agentld || secret
     * 接入企微会话时检验 publicSecret || sessionSecret
     * @author waldon
     * @date 2021/1/29
     * @returns {Boolean} - 返回值说明
     */
    hasEmptyCal() {
      let targetObj;
      if (this.active === this.stepConfig.CREATE) {
        targetObj = filterData(this.selfEditInfo, ['corpAgentId', 'corpAgentSecret']);
      } else {
        targetObj = filterData(this.selfEditInfo, ['publicKeyVer', 'secret', 'ipList', 'publicKey']);
      }
      return Object.keys(targetObj).some(key => !targetObj[key]);
    },
  },
  watch: {},
  created() {
    this.getConfigInfo();
    this.$utils.FdpLog('yx_jrqk', {
      yx_free_text_0: '进入第1步',
    });
  },
  mounted() {},
  methods: {
    backManage() {
      this.$emit('update:currentTemp', 'wxCorpAppList');
    },
    /**
     * 上一步
     * @author waldon
     * @date 2021/2/7
     */
    lastStep() {
      this.active--;
    },
    /**
     * 复制地址
     * @author enson
     * @date 2021/1/23
     * @param {String} type - 复制地址
     */
    copyUrl(value, isTextArea = false) {
      clipboard(value, '复制成功', '当前浏览器不支持', isTextArea);
    },
    async saveSetting() {
      if (this.active === this.stepConfig.CREATE) {
        // 创建应用
        await this.saveWxWorkCorpByAgent();
        this.active++;
        this.$utils.FdpLog('yx_jrqk', {
          yx_free_text_0: '进入第2步',
        });
        return;
      }

      let isCanSave = true;
      for (const key in this.selfEditInfo) {
        if (!this.selfEditInfo[key]) {
          isCanSave = false;
          break; // break, 中途跳出循环
        }
      }
      if (!isCanSave) {
        // 每一项都不能为空
        this.$utils.postMessage({
          type: 'error',
          message: '选项不能为空',
        });
        return;
      }
      this.saveMsgConfigInfo().then(() => {
        this.backManage();
        this.$utils.FdpLog('yx_jrqk', {
          yx_free_text_0: '配置完成',
        });
      });
    },
    /**
     * @description 查看教程
     * @author enson
     * @date 2021-04-21
     */
    toSeeStudyLink() {
      const helpUrlMap = new Map();
      helpUrlMap.set(this.stepConfig.CREATE, this.addressUrl.wxChatDataCreatAgent);
      helpUrlMap.set(this.stepConfig.SET_TOOL, this.addressUrl.wxChatDataSetting);
      window.open(helpUrlMap.get(this.active));
    },
    /**
     * @description 保存企微授权信息-内部应用
     * @author enson
     * @date 2021-04-23
     */
    async saveWxWorkCorpByAgent() {
      const [err, res] = await saveWxWorkCorpByAgent({
        ...filterData(this.selfEditInfo, ['corpAgentId', 'corpAgentSecret']),
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve();
    },
    /**
     * @description 获取企微会话记录：企微接入信息
     * @author enson
     * @date 2021-04-23
     * @returns
     */
    async getMsgConfigInfo() {
      const [err, res] = await getSettingInfo({
        ts_hideMessage: true,
      });
      if (err) {
        return Promise.reject(err);
      }
      return Promise.resolve(res.data);
    },
    /**
     * @description 保存企微会话记录：企微接入信息
     * @author enson
     * @date 2021-04-23
     */
    async saveMsgConfigInfo() {
      const [err, res] = await saveSettingInfo({
        ...filterData(this.selfEditInfo, ['publicKey', 'publicKeyVer', 'secret']),
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
        message: '您已成功接入企业会话存档',
      });
      return Promise.resolve();
    },
    /**
     * @description 获取配置信息
     * @author enson
     * @date 2021-04-23
     * @returns
     */
    getConfigInfo() {
      getWxWorkCorp._refresh = true;
      Promise.all([getWxWorkCorp(), this.getMsgConfigInfo()]).then(res => {
        const [wxWorkCorpInfo, wxWorkMsgInfo] = res;
        if (!wxWorkCorpInfo || !wxWorkMsgInfo) {
          this.$utils.postMessage({
            type: 'error',
            message: '网络错误，请稍候重试',
          });
          return;
        }
        this.selfEditInfo = {
          corpAgentId: wxWorkCorpInfo.corpAgentId || '', // agentld
          corpAgentSecret: wxWorkCorpInfo.corpAgentSecret || '', // secret
          ipList: wxWorkMsgInfo.ipList || [], // ip地址
          publicKey: wxWorkMsgInfo.publicKey || '', // 消息密钥
          publicKeyVer: wxWorkMsgInfo.publicKeyVer || '', // 公钥版本
          secret: wxWorkMsgInfo.secret || '', // 会话密钥 secret
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detailWrapper {
  &.wxWorkMsgDetail {
    .mainWrapperContent {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 535px;
      margin: auto;
    }
    .userInput-wraper {
      width: 100%;
    }
    .mainWrapper {
      .inputWrapper {
        ::v-deep .fa-input {
          width: 100%;
        }
        .copyBtn {
          padding: 0;
        }
      }
    }
    .stepBox {
      width: 296px;
    }
  }
}
</style>

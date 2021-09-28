<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:55:52
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:24:24
-->
<template>
  <global-ts-card-box class="detailWrapper chatTool">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>企微设置</template>
        <template v-slot:rightPart>聊天工具栏设置</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="stepBox tsSteps">
        <fa-steps :current="currentCal" labelPlacement="vertical">
          <fa-step :title="item.title" v-for="item of stepList" :key="item.key">
            <template slot="description">
              <a v-if="active === item.key && item.isShowGuide" :href="stepGuideUrl" target="_blank">查看设置指引</a>
            </template>
          </fa-step>
        </fa-steps>
      </div>
      <div class="mainWrapper" v-if="active === stepDefine.CREATE">
        <div class="inputWrapper" v-if="!isOem">
          <div class="text">AgentId</div>
          <fa-input v-model="selfEditInfo.corpAgentId"> </fa-input>
        </div>
        <div class="inputWrapper" v-if="!isOem">
          <div class="text">Secret</div>
          <fa-input v-model="selfEditInfo.corpAgentSecret"> </fa-input>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">可信域名</div>
          <fa-input v-model="selfEditInfo.trustUrl" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.trustUrl)">复制</global-ts-button>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">校验文件</div>
          <fa-input v-model="uploadFileNameCal" disabled="disabled"> </fa-input>
          <el-upload
            class="uploadWrapper"
            name="filedata"
            :action="uploadUrl"
            :accept="fileAccept"
            :file-list="fileList"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
          >
            <global-ts-button class="copyBtn" size="small">上传</global-ts-button>
          </el-upload>
        </div>
      </div>
      <div class="mainWrapper" v-else>
        <div class="inputWrapper copyInput">
          <div class="text">客户详情</div>
          <fa-input v-model="selfEditInfo.pageInfo.customCenter" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.pageInfo.customCenter)">
            复制
          </global-ts-button>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">快捷回复</div>
          <fa-input v-model="selfEditInfo.pageInfo.chatCenter" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.pageInfo.chatCenter)">
            复制
          </global-ts-button>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">商品列表</div>
          <fa-input v-model="selfEditInfo.pageInfo.productCenter" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.pageInfo.productCenter)">
            复制
          </global-ts-button>
        </div>
        <div class="inputWrapper copyInput">
          <div class="text">营销工具</div>
          <fa-input v-model="selfEditInfo.pageInfo.marketCenter" disabled="disabled"> </fa-input>
          <global-ts-button class="copyBtn" size="small" @click="copyUrl(selfEditInfo.pageInfo.marketCenter)">
            复制
          </global-ts-button>
        </div>
      </div>
    </template>
    <template #card-box-bottom>
      <global-ts-button
        v-if="active !== stepDefine.CREATE"
        class="btn-left"
        type="others"
        size="medium"
        @click="lastStep"
        >上一步
      </global-ts-button>
      <global-ts-button type="primary" size="medium" @click="saveSetting" :disabled="hasEmptyCal">
        {{ saveTextCal }}
      </global-ts-button>
    </template>
  </global-ts-card-box>
</template>

<script>
import { Upload } from 'element-ui';
import { clipboard, getUrL, filterData, getUploadFile, getWxWorkCorp } from '@/utils';
import ManagerDef from '@/config/manager-def';
import { mapState } from 'vuex';
import { saveWxWorkCorpByAgent } from '@/api/modules/views/setting-center';

export default {
  name: 'chat-tool-detail',
  components: {
    [Upload.name]: Upload,
  },
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
  },
  data() {
    return {
      active: ManagerDef.SELF_APP_STEP_DEFINE.CREATE,
      stepDefine: ManagerDef.SELF_APP_STEP_DEFINE,
      stepList: [],
      selfEditInfo: {
        corpAgentId: '',
        corpAgentSecret: '',
        trustUrl: '',
        pageInfo: {},
      },
      rules: {}, // 输入框校验规则，重复部分较多，放在方法里面写
      uploadUrl: getUrL('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=uploadTxt&type=1'),
      fileAccept: '.txt',
      fileList: [],
      fileName: '',
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      isOem: state => state.user.info.isOem,
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
    /**
     * 文件名
     * @author waldon
     * @date 2020/4/10
     * @returns {*} 对话框按钮内容
     */
    uploadFileNameCal() {
      return this.fileName ? this.fileName : '未上传文件';
    },
    /**
     * 是否存在空行
     * 校验：id、秘钥、校验文件
     * @author waldon
     * @date 2021/1/29
     * @returns {Boolean} - 返回值说明
     */
    hasEmptyCal() {
      const { corpAgentId, corpAgentSecret } = this.selfEditInfo;
      return !corpAgentId || !corpAgentSecret || !this.fileName;
    },
    saveTextCal() {
      return this.active === ManagerDef.SELF_APP_STEP_DEFINE.SET_TOOL ? '完成设置' : '下一步';
    },
    /**
     * 对应指引
     * @author waldon
     * @date 2021/1/22
     * @returns {String} - 返回值说明
     */
    stepGuideUrl() {
      switch (this.active) {
        case ManagerDef.SELF_APP_STEP_DEFINE.CREATE:
          if (this.isOem) {
            return this.addressUrl.wxWorkCorpSetting_8; // 分销的是可信域名设置的教程
          } else {
            return this.addressUrl.wxWorkCorpSetting_2; // 直销的是自建应用教程
          }
        case ManagerDef.SELF_APP_STEP_DEFINE.SET_TOOL:
          return this.addressUrl.wxWorkChatFunction; // 聊天工具配置
        default:
          return '';
      }
    },
  },
  watch: {},
  async created() {
    this.stepList = [
      {
        key: ManagerDef.SELF_APP_STEP_DEFINE.CREATE,
        title: this.isOem ? '设置可信域名' : '创建自建应用',
        isShowGuide: true,
      },
      {
        key: ManagerDef.SELF_APP_STEP_DEFINE.SET_TOOL,
        title: '配置聊天工具栏',
        isShowGuide: true,
      },
    ];
    this.selfEditInfo = {
      ...this.selfEditInfo,
      ...filterData(this.wxWorkCorpData, ['corpAgentId', 'corpAgentSecret', 'trustUrl', 'pageInfo']),
    };
    this.getRules();
    this.fileName = await getUploadFile();
  },
  mounted() {},
  methods: {
    /**
     * 上一步
     * @author waldon
     * @date 2021/2/7
     */
    lastStep() {
      this.active--;
    },
    /**
     * 完成上传的回调
     * @author waldon
     * @date 2020/4/10
     * @param {Object} res - 后端返回数据
     * @param {Object} file - 文件数据
     * */
    uploadSuccess(res, file) {
      if (res && res.success) {
        this.$utils.postMessage({
          type: 'success',
          message: '上传成功',
        });
        this.fileName = file.name;
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      }
    },
    /**
     * 上传前操作
     * 限制上传文件的格式
     * @author waldon
     * @date 2020/4/10
     * */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAccept.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传txt格式的文件',
          });
          return false;
        }
        if (file.name === this.fileName) {
          this.$utils.postMessage({
            type: 'error',
            message: '该文件已存在，请勿重复上传',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 1) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件大小不能超过1M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '文件类型不符合规范，请上传txt格式的文件',
        });
      }
    },
    /**
     * 获取校验规则
     * @author waldon
     * @date 2021/1/25
     */
    getRules() {
      const ruleParams = {
        corpAgentId: 'corpAgentId为空',
        corpAgentSecret: 'corpAgentSecret为空',
      };
      for (const item in ruleParams) {
        this.$set(this.rules, item, [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: ruleParams[item],
              topTips: ruleParams[item],
            },
          },
        ]);
        this.$set(this.rules, `${item}ErrCount`, 0);
      }
    },
    backManage() {
      this.$emit('update:currentTemp', 'wxCorpAppList');
    },
    /**
     * 复制地址
     * @author waldon
     * @date 2021/1/23
     * @param {String} url - 复制地址
     */
    copyUrl(url) {
      clipboard(url, '复制成功', '当前浏览器不支持');
    },
    /**
     * 保存自建应用
     * @author waldon
     * @date 2021/1/23
     */
    async saveSetting() {
      if (this.active === ManagerDef.SELF_APP_STEP_DEFINE.SET_TOOL) {
        // 如果完成设置，最后再跳回列表页
        this.$utils.postMessage({
          type: 'success',
          message: '您已完成企微聊天工具栏设置',
        });
        this.$emit('update:currentTemp', 'wxCorpAppList');
        return;
      } else if (this.active === ManagerDef.SELF_APP_STEP_DEFINE.CREATE && this.isOem) {
        // 分销的直接跳过无需保存
        this.active++;
        return;
      }
      let isCanSave = true;
      Object.keys(this.selfEditInfo).forEach(item => {
        if (!this.selfEditInfo[item]) {
          this.rules[`${item}ErrCount`]++;
          isCanSave = false;
        }
      });
      if (!isCanSave) {
        // 每一项都不能为空
        return;
      }
      const [err, res] = await saveWxWorkCorpByAgent(this.selfEditInfo);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      getWxWorkCorp._refresh = true; // 改变时需设为true，重新从接口查对应的信息
      this.active++;
      this.$utils.postMessage({
        type: 'success',
        message: '保存成功',
      });
      const wxWorkCorpData = await getWxWorkCorp();
      this.$emit('update:wxWorkCorpData', wxWorkCorpData);
    },
  },
};
</script>

<style lang="scss" scoped>
.chatTool .stepBox {
  width: 296px;
}
</style>

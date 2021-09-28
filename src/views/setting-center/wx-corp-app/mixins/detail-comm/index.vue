<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 11:05:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 10:22:06
-->
<script>
import { mapState } from 'vuex';
import { clipboard, filterData } from '@/utils';
import { checkWxWorkConf } from '@/api/modules/views/setting-center';
import studyTip from '../../components/study-tip/index.vue';
import { getRandomStrAndNum } from '@/api/modules/views/setting-center';

export default {
  name: 'detail-comm',
  components: { studyTip },
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
      rules: {}, // 输入框校验规则，重复部分较多，放在方法里面写
      isFinishSet: false, // 是否完成设置
      checkStepTimer: 0, // 检查轮询
      checkMessageBox: null, // 检查的提示
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    /**
     * 是否存在空行
     * @author waldon
     * @date 2021/1/29
     * @returns {Boolean} - 返回值说明
     */
    hasEmptyCal() {
      const {
        externalSecret,
        token,
        aesKey,
        userSecret,
        corpAgentId,
        corpAgentSecret,
        corpId,
        corpName,
      } = this.editInfo;
      switch (this.active) {
        case this.stepDefine.INSTALL_APP:
          // 分销独有
          return !corpId || !corpName;
        case this.stepDefine.CORP_AGENT_SET:
          // 分销独有
          return !corpAgentId || !corpAgentSecret;
        case this.stepDefine.CUSTOMER_SET:
          return !externalSecret || !token || !aesKey;
        case this.stepDefine.CONTACTS_SET:
          return !userSecret;
      }
      return false;
    },
    lastCheckCal() {
      return this.active === this.stepDefine.CUSTOMER_SET;
    },
    saveTextCal() {
      return this.lastCheckCal ? '完成设置' : '下一步';
    },
    /**
     * 步骤条显示比实际小1
     * @author waldon
     * @date 2021/1/23
     * @returns {Number} - 步骤条显示
     */
    currentCal() {
      return this.active - 1;
    },
  },
  watch: {},
  beforeDestroy() {
    this.cleanMessageBox();
  },
  created() {
    this.editInfo = { ...this.editInfo, ...this.wxWorkCorpData };
    this.getRules();
    if (this.wxWorkCorpData.finishStep) {
      this.active = Number(this.wxWorkCorpData.finishStep);
    }
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
     * 获取校验规则
     * @author waldon
     * @date 2021/1/25
     */
    getRules() {
      const ruleParams = {
        externalSecret: '客户联系Secret为空', // 客户联系secret
        token: 'token为空',
        aesKey: 'aesKey为空',
        userSecret: 'userSecret为空', // 通讯录secret
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
     * @param {String} type - 复制地址
     */
    copyUrl(type) {
      clipboard(this.editInfo[type], '复制成功', '当前浏览器不支持');
    },
    /**
     * 轮询检查
     * @author waldon
     * @date 2021/2/1
     * @param {Object} checkOption - 轮询检查入参
     * 1.nextFN 成功回调
     * 2.errMsg 错误提示
     * 3.checkStepCount 已检查次数
     * 4.checkMaxCount 最大检查次数
     */
    async toCheckStep(checkOption) {
      const params = filterData(checkOption, ['step']);
      const [err, res] = await checkWxWorkConf(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      if (res.data.checkPass) {
        this.cleanMessageBox();
        checkOption.nextFN.call(this);
      } else {
        if (!this.checkMessageBox) {
          this.checkMessageBox = this.$utils.postMessage({
            type: 'success',
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: `<p>${checkOption.checkMsg}</p>`,
          });
        }
        checkOption.checkStepCount++;
        if (checkOption.checkStepCount < checkOption.checkMaxCount) {
          this.checkStepTimer = setTimeout(() => {
            this.toCheckStep(checkOption);
          }, 1000);
        } else {
          this.cleanMessageBox();
          this.$utils.postMessage({
            type: 'error',
            message: res.data.msg || '网络错误，请稍候重试',
          });
        }
      }
    },
    /**
     * 清除弹窗
     * @author waldon
     * @date 2021/2/7
     */
    cleanMessageBox() {
      this.checkMessageBox && this.checkMessageBox.clearFun && this.checkMessageBox.clearFun();
      this.checkMessageBox = null;
    },
    toSeeStudyLink(tipLinkUrl) {
      window.open(tipLinkUrl);
    },
    /**
     * @description 重新获取token/aesKey
     * @author enson
     * @date 2021-07-04
     * @param {*} type
     */
    async reloadKey(type) {
      const paramMap = new Map();
      paramMap.set('token', {
        startLen: 3,
        endLen: 32,
      });
      paramMap.set('aesKey', {
        startLen: 43,
      });

      if (!paramMap.has(type)) return;
      const [err, res] = await getRandomStrAndNum(paramMap.get(type));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.editInfo[type] = res.msg;
      return Promise.resolve();
    },
  },
};
</script>

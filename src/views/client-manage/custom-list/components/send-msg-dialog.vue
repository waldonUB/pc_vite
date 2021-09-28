<!--
 * @Description  : 发送短信对话框
 * @Author       : turbo
 * @Date         : 2021-07-12 15:36:56
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-12 17:38:57
-->

<template>
  <global-ts-dialog
    class="send-msg-dialog"
    dialog-title="发送短信"
    dialog-size="medium"
    sure-name="发送"
    :dialog-visible.sync="dialogVisible"
    @sure="sure"
    @cancel="cancel"
  >
    <global-ts-warn-tips :is-show-icon="false">
      <template #content>
        <span class="warn-tips-content">
          预计发送：{{ customerListWithPhone.length }}条，当前剩余：
          <span :class="{ redText: isShowBuyText }"> {{ msgNumInfo.smsSurplusAmount }} </span>条
        </span>
        <span v-if="isShowBuyText">，</span>
        <span v-if="isShowBuyText && !isCreator">请联系超级管理员购买短信包</span>
        <a v-if="isShowBuyText && isCreator" :href="buySmsUrl" target="_blank">去购买</a>
      </template>
    </global-ts-warn-tips>
    <fa-form-model layout="vertical">
      <fa-form-model-item label="发送对象">
        <div class="information">
          <div ref="informationText" class="text">{{ sendUserNameStr }}</div>
          <div v-if="isShowTotal" class="tip">等{{ customerListWithPhone.length }}位客户</div>
        </div>
      </fa-form-model-item>
      <fa-form-model-item>
        <template #label>
          选择模板
          <span v-if="isCreator" class="title-tip">
            （没有你要的模板？<a :href="setSmsTemplateUrl" target="_blank">去添加</a>）
          </span>
          <span v-else class="title-tip">（没有你要的模板？联系超级管理员添加）</span>
          <global-ts-tool-tips offset="10" effect="dark" content="找不到已申请的短信模板？" placement="top-start">
            <global-ts-svg-icon name="icon-bianzu" color="#2882ff" @click="gotoAddTempHelp"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </template>
        <global-ts-select
          type="large"
          placeholder="请选择模板"
          :list="msgTempList"
          :selectkey="{ label: 'sign', value: 'templateId' }"
          v-model="requestParam.templateId"
          @change="changeTemplate"
        ></global-ts-select>
      </fa-form-model-item>
      <fa-form-model-item label="模板内容">
        <div class="template-content">{{ requestParam.template }}</div>
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { merge } from 'lodash';

// api
import { client } from '@/api';

export default {
  name: 'SendMsgDialog',
  props: {
    openType: {
      type: String,
      default: '',
    },
    customerListWithPhone: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      requestParam: {
        templateId: '',
        template: '',
      },
      cloneRequestParam: {},
      msgNumInfo: {
        smsTotalAmount: 0, // 总共的短信数量
        smsSurplusAmount: 0, // 剩余的短信数量
      },
      msgTempList: [], // 短信模板列表
      isShowTotal: false, // 是否显示*位客户
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.getMsgNum();
        this.getMsgTempList();
      }
    },
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      buySmsUrl: state => state.globalData?.addressUrl?.buySmsUrl,
      setSmsTemplateUrl: state => state.globalData?.addressUrl?.setSmsTemplateUrl,
    }),
    ...mapGetters({
      isCreator: 'user/isCreator',
    }),
    /**
     * 是否显示购买提示
     * @author waldon
     * @date 2020/9/11
     * @returns {Boolean} 是否显示购买提示
     */
    isShowBuyText() {
      return this.customerListWithPhone.length > this.msgNumInfo.smsSurplusAmount;
    },
    sendUserNameStr() {
      this.$nextTick(() => {
        const informationText = this.$refs.informationText;
        this.isShowTotal = informationText && informationText.clientWidth >= 444;
      });
      return this.customerListWithPhone.map(item => item.contacts).join('，');
    },
  },
  created() {
    this.cloneRequestParam = {
      ...this.requestParam,
    };
  },
  methods: {
    /**
     * 获取短信包的数量
     * @author waldon
     * @date 2020/9/10
     */
    async getMsgNum() {
      const { getTsSmsTotal } = client;
      const [err, res] = await getTsSmsTotal({
        ts_hideLoading: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.msgNumInfo = res.data;
      this.dialogVisible && setTimeout(this.getMsgNum, 10000); // 窗口打开的情况下，每10秒查一次短信包数量
    },
    /**
     * 获取短信模板
     * @author waldon
     * @date 2020/9/10
     */
    async getMsgTempList() {
      const { getTsSmsTemplateList } = client;
      const [err, res] = await getTsSmsTemplateList({
        ts_hideLoading: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.msgTempList = res.data;
    },
    /**
     * 确定的回调
     * @author waldon
     * @date 2020/6/10
     * */
    async sure() {
      const { sendSms } = client;
      const [err, res] = await sendSms(
        merge(
          {},
          {
            templateId: '',
            template: '',
            expectNum: this.customerListWithPhone.length,
            mobileList: JSON.stringify(this.customerListWithPhone),
          },
          this.requestParam,
        ),
      );
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : '正在发送...',
      });
      if (!err) {
        if (this.openType === 'multipart') {
          // 如果是多选的就清空掉选中的客户
          this.$emit('clearSelection');
        }
        this.requestParam = {
          ...this.cloneRequestParam,
        };
        this.cancel();
      }
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 跳转到对应的教程页
     * 地址前端先写死
     * @author waldon
     * @date 2020/9/18
     */
    gotoAddTempHelp() {
      window.open(this.isOem ? 'https://adm.webportal.top/sys/view.jsp?id=1515' : 'https://kht.fkw.com/blog/29816/');
    },
    /**
     * 改变模板
     * @author waldon
     * @date 2020/9/11
     * @param {Object} rowDataTempId - 单个模板
     */
    changeTemplate(rowDataTempId) {
      const tempInfo = this.msgTempList.find(item => rowDataTempId === item.templateId);
      tempInfo && (this.requestParam.template = tempInfo.template);
    },
  },
};
</script>

<style lang="scss" scoped>
.send-msg-dialog {
  .warnTips {
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
  }

  .warn-tips-content {
    display: flex;
  }

  .redText {
    color: $error-color;
  }

  .fa-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .information {
    @include flex-left;

    height: 40px;
    padding-left: 12px;
    cursor: not-allowed;
    border: 1px solid $color-ee;
    border-radius: 4px;
    box-sizing: border-box;

    .text {
      @include ellipsis;

      max-width: 445px;
    }
  }

  .title-tip {
    font-size: 12px;
    color: $color-b2;

    a {
      font-size: 12px;
    }
  }

  .template-content {
    height: 180px;
    padding: 12px;
    overflow-y: auto;
    line-height: 21px;
    cursor: not-allowed;
    border: 1px solid $color-ee;
    border-radius: 4px;
    box-sizing: border-box;
  }
}
</style>

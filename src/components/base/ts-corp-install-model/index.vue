<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 11:43:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:13:42
-->
<template>
  <div class="ts-corp-install-model">
    <global-ts-dialog
      v-bind="$attrs"
      wrap-class-name="corpInstallDialog noFooter"
      dialog-title="是否已注册企业微信"
      dialog-size="middle"
      :dialog-visible.sync="corpInstallDialogVisibleCal"
      @cancel="handleCancel"
    >
      <div class="dialogContent">
        <div class="setPart">
          <div class="setTitle">没有企业微信</div>
          <div class="setDesc">30秒注册企业微信，自动添加凡科客户通</div>
          <global-ts-button class="setBtn" size="small" icon="icon-danseqiwei1616" @click="registerApp('registerUrl')">
            注册企业微信
          </global-ts-button>
        </div>
        <div class="setPart">
          <div class="setTitle">已有企业微信</div>
          <div class="setDesc">安装凡科客户通到企业微信</div>
          <global-ts-button
            type="others"
            class="setBtn"
            size="small"
            icon="icon-caiseqiwei1616"
            @click="registerApp('appAuthUrl')"
            >安装到企业微信
          </global-ts-button>
        </div>
      </div>
    </global-ts-dialog>
  </div>
</template>

<script>
import { postMessage, FdpLog } from '@/utils';
import { mapState } from 'vuex';
import { wxworkGetRegisterUrl, wxworkGetAppAuthUrl } from '@/api/modules/component/corp-install-model';

export default {
  name: 'ts-corp-install-model',
  // 继承所有父组件的内容
  inheritAttrs: true,
  props: {
    corpInstallDialogVisible: {
      type: Boolean,
      default: false,
    },
    fromPage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      registerUrl: '', // 注册链接
      appAuthUrl: '', // 安装链接
    };
  },
  watch: {
    corpInstallDialogVisible(newVal) {
      if (newVal) {
        FdpLog('yx_aztc', {
          yx_free_text_0: this.fromPage,
        });
        this.getRegisterUrl();
        this.getAppAuthUrl();
      }
    },
  },
  computed: {
    corpInstallDialogVisibleCal: {
      get() {
        return this.corpInstallDialogVisible;
      },
      set(newVal) {
        this.$emit('update:corpInstallDialogVisible', newVal);
      },
    },
  },
  methods: {
    /**
     * 注册或安装应用
     * @author waldon
     * @date 2021/1/21
     * @param {String} type - 类型
     */
    registerApp(type) {
      if (this[type]) {
        switch (type) {
          case 'registerUrl':
            FdpLog('yx_aztc_an', {
              yx_free_text_1: this.fromPage,
              yx_free_text_2: '注册企业微信',
            });
            break;
          case 'appAuthUrl':
            FdpLog('yx_aztc_an', {
              yx_free_text_1: this.fromPage,
              yx_free_text_2: '安装到企业微信',
            });
            break;
        }
        this.handleCancel();
        window.open(this[type]);
      }
    },
    /**
     * 关闭
     * @author waldon
     * @date 2021/1/20
     */
    handleCancel() {
      this.$emit('update:corpInstallDialogVisible', false);
    },
    /**
     * 获取注册链接
     * @author waldon
     * @date 2021/1/21
     */
    async getRegisterUrl() {
      const [err, res] = await wxworkGetRegisterUrl();
      if (err) {
        return err;
      }
      this.registerUrl = res.data;
    },
    /**
     * 企业微信应用授权地址
     * @author waldon
     * @date 2021/1/21
     */
    async getAppAuthUrl() {
      const [err, res] = await wxworkGetAppAuthUrl();
      if (err) {
        return err;
      }
      this.appAuthUrl = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
/* 企微接入弹窗 start */
.corpInstallDialog {
  .dialogContent {
    display: flex;
    height: 156px;
    flex-flow: row nowrap;
    .setPart {
      display: flex;
      width: 50%;
      flex: 0 0 auto;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .setTitle {
        font-size: 16px;
        font-weight: bold;
        line-height: 21px;
        color: $color-00;
      }
      .setDesc {
        margin-top: 12px;
        font-size: 14px;
        line-height: 19px;
        color: $color-89;
      }
      .setBtn {
        margin-top: 20px;
        flex: 0 0 auto;
        .icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          vertical-align: -0.2em;
        }
      }
    }
  }
}

/* 企微接入弹窗 end */
</style>

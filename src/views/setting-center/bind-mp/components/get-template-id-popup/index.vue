<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:54:39
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 11:28:43
-->
<template>
  <div id="templateIdPopup" class="tshu-bubble">
    <div class="contentBox">
      <div class="bubbleBox">请输入公众号订阅消息模板ID：</div>
      <div class="companyText">
        <global-ts-input tstype="text" v-model="tempIdNew" placeholder="请输入公众号订阅消息模板ID"></global-ts-input>
      </div>
    </div>
    <div class="bottomBtn">
      <global-ts-button class="sureBtn" type="primary" size="small" @click="sureFun"> 确认 </global-ts-button>
      <global-ts-button class="cancel" type="others" size="small" @click="cancelFun">
        取消
      </global-ts-button>
    </div>
  </div>
</template>

<script>
import { bindMpOneTimeSubMsgTempId } from '@/api/modules/views/setting-center/bind-mp';

export default {
  name: 'get-template-id-popup',
  components: {},
  props: {
    tempId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tempIdNew: '',
    };
  },
  computed: {},
  watch: {
    tempId(nVal) {
      this.tempIdNew = nVal;
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     *确认消息模板Id
     * @author tomato
     * @date 2020-04-10
     */
    sureFun() {
      const that = this;
      this.setTempId(this.tempIdNew).then(res => {
        if (res.rt == 0) {
          this.$utils.postMessage({
            type: 'success',
            message: res.msg || '操作成功',
          });
        }
      });
      that.$emit('changeTempId', that.tempIdNew, true);
    },
    /**
     *取消消息模板Id
     * @author tomato
     * @date 2020-04-10
     */
    cancelFun() {
      this.$emit('changeTempId', this.tempIdNew, false);
    },
    /**
     *设置消息模板Id
     * @author tomato
     * @date 2020-04-10
     * @param {String} tempIdNew,新的消息模板Id
     * @returns
     */
    async setTempId(tempIdNew) {
      const [err, response] = await bindMpOneTimeSubMsgTempId({
        templateId: tempIdNew,
      });
      if (err) {
        return Promise.reject(err);
      }
      return Promise.resolve(response);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 小弹窗 */
#templateIdPopup {
  &.tshu-bubble {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 172px;
    margin: auto;
  }
}
.tshu-bubble {
  position: absolute;
  top: 0;
  left: 0;
  z-index: $zindex-mutual;
  width: 320px;
  background: #ffffff;
  border-bottom: 1px solid $border-disabled-color;
  border-radius: 4px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.24);
  &.fixed {
    position: fixed;
    z-index: $zindex-dialog;
  }
  .contentBox {
    padding: 30px 20px 20px;
  }
  .bottomBtn {
    width: 100%;
    height: 64px;
    padding-top: 15px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    border-top: 1px solid $border-disabled-color;
    box-sizing: border-box;
    .sureBtn {
      height: 34px;
      min-width: 88px;
      margin-right: 10px;
      font-size: 14px;
      line-height: 1;
    }
    .cancel {
      width: 100px;
      height: 34px;
      font-size: 14px;
      line-height: 1;
    }
  }
}
</style>

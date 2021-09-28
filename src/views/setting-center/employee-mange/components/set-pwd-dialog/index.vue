<!--
 * @Author       : ADI
 * @Date         : 2021-07-08 11:27:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 14:05:23
-->
<template>
  <global-ts-wx-work-dialog
    class="setPwdDialog wxCorpDialog center"
    dialogTitle="设置密码"
    :tsDialogVisible.sync="dialogVisible"
    dialogSize="small"
    cancelName="跳过"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="dialogContent">
      <global-ts-input
        maxlength="20"
        tstype="password"
        v-model="pwd"
        placeholder="默认密码为：123456"
        :rules="rules.pwdRule"
        :checkCount="rules.httpRuleErrCount"
        @errorCheck="errorCheck"
      >
      </global-ts-input>
    </div>
  </global-ts-wx-work-dialog>
</template>

<script>
import { mixErrorObject } from '@/utils';

export default {
  name: 'set-pwd-dialog',
  components: {},
  mixins: [mixErrorObject()],
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      pwd: '',
      rules: {
        pwdRule: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入密码',
              topTips: '密码为空',
            },
          },
          {
            type: 1,
            min: {
              limitNum: 5,
              tips: '密码由6-20位字符组成，区分大小写',
              topTips: '密码输入不正确',
            },
            max: {
              limitNum: 20,
              tips: '密码由6-20位字符组成，区分大小写',
              topTips: '密码输入不正确',
            },
          },
        ],
        httpRuleErrCount: 0,
        haveErr: false,
      },
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.pwd = '';
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 错误检查
     * @author waldon
     * @date 2020/7/23
     * @param {*} haveErr - 是否存在错误
     * @returns {*}
     */
    errorCheck(haveErr) {
      this.rules.haveErr = haveErr;
    },
    /**
     * 设置密码
     * @author waldon
     * @date 2020/6/1
     */
    sure() {
      if (this.rules.haveErr) {
        this.rules.httpRuleErrCount++;
        return;
      }
      this.$emit('sure', this.pwd);
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/1
     */
    cancel() {
      this.$emit('sure', '123456'); // 跳过的时候设置默认密码
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.set-pwd-dialog {
}
</style>

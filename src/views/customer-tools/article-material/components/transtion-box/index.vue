<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:29:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 17:19:46
-->
<template>
  <global-ts-dialog
    id="linkBox"
    class="linkBox"
    width="620px"
    :dialog-visible.sync="isDialog"
    dialog-title="转载文章"
    @sure="onTransition"
    @cancel="cancelFun"
  >
    <div class="contentBox">
      <fa-form-model ref="authDialogRuleForm" layout="vertical" :model="requestParam" :rules="rules">
        <fa-form-model-item label="支持一键转载微信、知乎、今日头条文章" prop="transitionLink">
          <fa-input v-if="isDialog" v-model="requestParam.transitionLink" placeholder="请输入要转换的文章网址链接">
          </fa-input>
        </fa-form-model-item>
      </fa-form-model>
    </div>
  </global-ts-dialog>
</template>

<script>
import { manageRegxp, postMessage } from '@/utils';

const validatorLink = (rule, value, callback) => {
  if (!manageRegxp(12).test(value)) {
    callback(new Error('请输入微信/知乎/头条文章链接'));
  } else {
    callback();
  }
};

export default {
  name: 'wx-auth-dialog',
  components: {},
  props: {},
  data() {
    return {
      requestParam: {
        transitionLink: '',
      },
      isDialog: false,
    };
  },
  computed: {
    rules() {
      return {
        transitionLink: [
          { required: true, message: '请输入微信/知乎/头条文章链接', trigger: 'blur' },
          {
            validator: validatorLink,
            trigger: 'blur',
          },
        ],
      };
    },
  },
  watch: {
    isDialog(newVal) {
      if (!newVal) {
        // 添加基哥要求的反馈，关闭时清空链接
        this.requestParam.transitionLink = '';
        this.$refs.authDialogRuleForm.resetFields();
      }
    },
  },
  created() {
    this.requestParam.transitionLink = '';
  },
  mounted() {},
  methods: {
    parentMsg(msg) {
      this.isDialog = msg;
    },
    cancelFun() {
      this.isDialog = false;
    },
    onTransition() {
      // turbo
      // 头条资讯类文章需要特殊的提示。。基哥让改的。。有问题找她。。正所谓冤有头。。
      if (/.*m.toutiaocdn.(cn|net).*/.test(this.requestParam.transitionLink)) {
        return postMessage({
          type: 'error',
          message: '转载失败，仅支持资讯类文章',
        });
      }
      this.$refs.authDialogRuleForm.validate(async valid => {
        console.log('valid', valid);
        if (!valid) {
          // 检查是否有错误
          return;
        }
        this.$emit('onTransitionHandle', this.requestParam.transitionLink);
        this.isDialog = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.linkBox {
  .inputTip {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 14px;
    color: #535353;
  }
}
</style>

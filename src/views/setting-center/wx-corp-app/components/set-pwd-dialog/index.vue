<!--
 * @Author       : ADI
 * @Date         : 2021-07-05 10:57:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 12:06:29
-->
<template>
  <global-ts-dialog
    class="setPwdDialog wxCorpDialog center"
    dialog-title="设置密码"
    :dialog-visible.sync="dialogVisible"
    dialogSize="small"
    cancel-btn-name="跳过"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="dialogContent">
      <fa-form-model ref="pwdForm" :model="form" :rules="formRules" :hideRequiredMark="true">
        <fa-form-model-item ref="pwd" prop="pwd" :has-feedback="false">
          <global-ts-input maxlength="20" type="password" v-model="form.pwd" placeholder="默认密码为：123456">
          </global-ts-input>
        </fa-form-model-item>
      </fa-form-model>
    </div>
  </global-ts-dialog>
</template>

<script>
export default {
  name: 'set-pwd-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      form: {
        pwd: '',
      },
    };
  },
  computed: {
    formRules() {
      return {
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码由6-20位字符组成，区分大小写', trigger: 'blur' },
        ],
      };
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.form.pwd = '';
      } else {
        this.$refs.pwdForm?.resetFields();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 设置密码
     * @author waldon
     * @date 2020/6/1
     */
    sure() {
      this.$refs['pwdForm'].validate(valid => {
        if (valid) {
          this.$emit('sure', this.form.pwd);
          this.$emit('update:dialogVisible', false);
        } else {
          return false;
        }
      });
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

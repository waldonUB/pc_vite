<!--
 * @Author       : ADI
 * @Date         : 2021-07-23 17:53:55
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 14:24:53
-->
<template>
  <global-ts-bubble
    :isDisabled="bubbleDisabled"
    class="compannyBubble"
    v-windowResize="changePosition"
    :isShow.sync="isShow"
    :style="nowStyle"
    @cancel="cancelShow"
    @sure="onSubmit"
  >
    <template v-slot:boxContent>
      <fa-form-model ref="ruleForm" :model="form" layout="vertical" :rules="formRules" :hideRequiredMark="true">
        <fa-form-model-item
          label="公司名称："
          prop="companyName"
          :rules="companyNameRule.length ? companyNameRule : formRules['companyName']"
        >
          <global-ts-input
            class="marginBottom"
            v-model="form.companyName"
            placeholder="请输入公司名称"
            @focus="bubbleDisabled = false"
          >
          </global-ts-input>
        </fa-form-model-item>
      </fa-form-model>
    </template>
  </global-ts-bubble>
</template>

<script>
import { getLimitTips, postLimitVer, bubble } from '@/utils';
import { addTsCompany, setTsCompany, getTsCompany } from '@/api/modules/views/corp-manage/commpany-manage';

export default {
  name: 'commpan-bubble',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    formRules() {
      return {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 1, max: 25, message: '公司名称不能超过25个字，请修改', trigger: 'blur' },
        ],
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) {
          this.bubbleDisabled = true;
          return;
        }
        let cmdAjax = '';
        const param = {
          name: this.form.companyName,
        };
        if (this.isAddType) {
          cmdAjax = addTsCompany;
        } else {
          cmdAjax = setTsCompany;
          param['id'] = this.commpanyId;
        }
        const [err, res] = await cmdAjax(param);
        if (err) {
          this.bubbleDisabled = true;
          getLimitTips('companyAdd').then(info => {
            if (err.rt == info.rt) {
              postLimitVer(info.msg, 0, 2);
              return;
            }
            if (err.rt == -6) {
              this.customCompanyNameRule(this.form.companyName);
              return;
            }
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
          });
          return Promise.reject(err);
        }
        this.parent.isReload = true;
        this.cancelShow();
      });
    },
    // 取消隐藏信息
    cancelShow() {
      this.isShow = false;
    },
    showPage() {
      this.isShow = true;
      this.changePosition();
    },
    async changeTarget(opt) {
      this.linkTarget = opt.linkTarget;
      this.commpanyId = opt.commpanyId;
      this.parent = opt.parent;
      this.isAddType = opt.commpanyId < 0;
      if (!this.isAddType) {
        const [err, response] = await getTsCompany({
          id: this.commpanyId,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.form.companyName = response.data.name;
        this.showPage();
      } else {
        this.form.companyName = '';
        this.showPage();
      }
    },
    changePosition() {
      this.$nextTick(() => {
        /**
         * 需要跟随的对象 - this.$el
         * 被跟随的对象 - this.linkTarget
         * 跟随所在位置 - "right"
         * 当前节点所在的盒子 - $('.commpanyManage')
         */
        console.log('this.$el', this.$el);
        console.log('this.linkTarget', this.linkTarget);
        console.log('$(.commpanyManage)', document.querySelector('.commpanyManage'));
        this.nowStyle = bubble.calculatePosition(
          this.$el,
          this.linkTarget,
          'right',
          document.querySelector('.commpanyManage'),
        );
      });
    },
    customCompanyNameRule(companyName) {
      const key = 'companyName';
      this.companyNameRule = [
        ...this.formRules[key],
        {
          validator: (rule, value, callback) => {
            if (value === companyName) {
              callback(new Error('公司名称已存在，请修改'));
            } else {
              callback();
            }
          },
          trigger: 'change',
        },
      ];
      this.$nextTick(() => {
        this.$refs?.ruleForm.validateField(key);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.compannyBubble {
  width: 340px;
}
</style>

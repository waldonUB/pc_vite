<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:47:34
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 15:43:08
-->
<template>
  <global-ts-bubble
    :style="nowStyle"
    :isShow.sync="bubbleShow"
    @sure="onSubmit"
    @cancel="cancel"
    ref="bubble"
    :isFixed="isFixed"
    v-windowResize="changePosition"
  >
    <template v-slot:boxContent>
      <fa-form-model ref="ruleForm" :model="form" layout="vertical" :rules="formRules" :hideRequiredMark="true">
        <fa-form-model-item ref="name" label="分类名称：" prop="name" :has-feedback="false">
          <fa-input v-focus v-model="form.name" type="text" class="marginBottom" placeholder="请输入分类名称">
          </fa-input>
        </fa-form-model-item>
      </fa-form-model>
    </template>
  </global-ts-bubble>
</template>

<script>
import { postMessage, post, bubble } from '@/utils';

export default {
  name: 'ts-classify-bubble',
  data() {
    return {
      form: {
        name: '', // 分类名称
      },
      nowStyle: {}, // 弹窗位置
      rules: {
        // 填写分类的规则
        name: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入分类名称',
            },
            max: {
              limitNum: 10,
              tips: '分类不能超过10个字符',
            },
          },
          {
            type: 3,
            tips: '分类名称已存在，请修改',
          },
        ],
        defindErrType: {
          name: -1,
        },
      },
      bubbleShow: false,
    };
  },
  props: {
    httpurl: {
      // 提交时请求地址
      type: String,
      default: '',
    },
    linkTarget: {
      // 目标位置信息 {target: '被跟随的位置元素', position: '相对位置'}
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    isShow: {
      // 是否显示分类管理弹窗
      type: Boolean,
      default: false,
    },
    param: {
      // 请求时需要额外携带的参数
      type: Object,
      default: () => {
        return {};
      },
    },
    initForm: {
      // 编辑的内容
      type: Object,
      default: () => {
        return {};
      },
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isShow(value) {
      this.bubbleShow = value;
      if (value) {
        this.initBubble();
        this.changePosition(this.linkTarget);
        if (Object.keys(this.initForm).length > 0) {
          this.getClassifyInfo(this.initForm);
        }
      }
    },
    bubbleShow(value) {
      if (value !== this.isShow) {
        this.$emit('update:isShow', value);
      }
    },
  },
  computed: {
    formRules() {
      return {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '分类不能超过10个字符', trigger: 'blur' },
        ],
      };
    },
  },
  methods: {
    /**
     * 初始化分类管理弹窗
     */
    initBubble() {
      this.form = { name: '' };
      // this.isShow = true;
    },
    /**
     * 提交
     */
    onSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.httpurl) {
            const url = this.httpurl;
            post(url, Object.assign({}, this.param, this.form)).then(res => {
              if (res && res.success) {
                this.$emit('submitSuccess');
                this.cancel();
              } else {
                postMessage({
                  type: 'error',
                  message: res.msg || '网络错误，请稍候重试',
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 设置分类弹窗的位置
     */
    changePosition(opt) {
      // this.linkTarget = opt; // ADI 注释的
      this.$nextTick(() => {
        // this.nowStyle = Ts_util.bubble.calculatePosition(this.$el, this.linkTarget.target, this.linkTarget.position,$('.classifyManager'));
        this.nowStyle = bubble.calculatePosition(
          this.$refs.bubble.$el,
          this.linkTarget.target,
          this.linkTarget.position,
          document.querySelector('.classifyManager'),
          this.isFixed,
        );
      });
    },
    /**
     * 获取信息
     */
    getClassifyInfo(item) {
      this.form = { ...item };
    },
    /**
     * 取消
     */
    cancel() {
      this.$emit('update:isShow', false);
      this.$emit('update:initForm', {}); // 清空编辑内容
    },
  },
};
</script>

<style lang="scss" scoped>
.bubbleBox {
  padding-bottom: 10px;
  font-size: 14px;
  color: $color-53;
}
</style>

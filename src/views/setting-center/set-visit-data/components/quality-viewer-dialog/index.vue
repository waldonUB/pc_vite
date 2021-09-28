<!--
 * @Author       : ADI
 * @Date         : 2021-07-13 11:41:04
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 17:52:14
-->
<template>
  <global-ts-dialog
    class="tanshuDialogNew tanshuDialogNewSizeBig qualityViewerDialog"
    :dialog-visible.sync="showQualityViewerDialog"
    dialog-title="优质访客定义"
    @sure="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="tanshuDialogNewContent">
      <fa-alert
        class="qualityViewerDialog_contentBox__alert flex flex-vc flex-hc"
        message="2个条件同时满足才算优质访客"
        type="warning"
        showIcon
      />
      <fa-form-model ref="ruleForm" layout="vertical" :model="qualityViewerFormData" :rules="rules">
        <fa-form-model-item ref="qualityMinClicks" label="文章最少点击次数" prop="qualityMinClicks">
          <fa-input
            size="large"
            class="contentBox__item_input"
            :maxLength="6"
            v-model.number="qualityViewerFormData.qualityMinClicks"
          >
          </fa-input>
          <span style="padding-left: 5px;line-height: 40px;">次</span>
        </fa-form-model-item>
        <fa-form-model-item ref="qualityMinReadTimeSecond" label="文章最少阅读时间" prop="qualityMinReadTimeSecond">
          <fa-input
            size="large"
            class="contentBox__item_input"
            :maxLength="6"
            @pressEnter="handleConfirm"
            v-model.number="qualityViewerFormData.qualityMinReadTimeSecond"
          >
          </fa-input>
          <span style="padding-left: 5px;line-height: 40px;">秒</span>
        </fa-form-model-item>
      </fa-form-model>
    </div>
  </global-ts-dialog>
</template>

<script>
import { Alert } from '@fk/faicomponent';

export default {
  name: 'quality-viewer-dialog',
  components: {
    [Alert.name]: Alert,
  },
  props: {
    qualityOriginFormData: Object,
  },
  data() {
    return {
      showQualityViewerDialog: false,
      qualityViewerFormData: {
        qualityMinClicks: '',
        qualityMinReadTimeSecond: '',
      },
      qualityViewerRules: {
        click: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入最小点击次数',
              topTips: '最小点击次数为空',
            },
            max: {
              limitNum: 6,
              tips: '最小点击次数不能超过6位数',
              topTips: '最小点击次数超过上限',
            },
          },
        ],
        time: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入最少阅读时间',
              topTips: '最少阅读时间为空',
            },
            max: {
              limitNum: 6,
              tips: '最少阅读时间不能超过6位数',
              topTips: '最少阅读时间超过上限',
            },
          },
        ],
        defindErrType: {},
      },
    };
  },
  computed: {
    rules() {
      return {
        qualityMinClicks: [
          { required: true, message: '请输入最小点击次数', trigger: 'blur' },
          { min: 0, max: 999999, message: '请输入正确次数(0-999999)', trigger: 'blur', type: 'integer' },
        ],
        qualityMinReadTimeSecond: [
          { required: true, message: '请输入最少阅读时间', trigger: 'blur' },
          { min: 0, max: 999999, message: '请输入正确时间(0-999999)', trigger: 'blur', type: 'integer' },
        ],
      };
    },
  },
  watch: {
    qualityOriginFormData: {
      handler() {
        Object.assign(this.qualityViewerFormData, this.qualityOriginFormData);
      },
      deep: true,
    },
    showQualityViewerDialog(showState) {
      // 修复错误提示弹窗关闭后在打开一直显示的问题
      if (showState === false) {
        Object.assign(this.qualityViewerFormData, this.qualityOriginFormData);
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    parentControl(show) {
      this.showQualityViewerDialog = show;
      this.tanshu_firstShowTips = true;
    },
    handleConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.qualityViewerFormData);
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.showQualityViewerDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/* 优质访客定义弹窗 */
.qualityViewerDialog {
  .red-dot {
    color: red;
    vertical-align: middle;
  }
  .qualityViewerDialog_contentBox__alert {
    margin-bottom: 20px;
    font-size: 14px;
  }
  .qualityViewerDialog_contentBox__item {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .contentBox__item_title {
    margin: 10px 0;
    font-size: 14px;
    line-height: $zindex-base;
    color: $color-53;
  }
}
</style>

<style lang="scss">
.qualityViewerDialog {
  .qualityViewerDialog_contentBox__alert {
    .fa-alert-message {
      color: $color-53;
    }
    .fa-alert-icon {
      position: relative;
      top: 0;
      left: 0;
      margin-right: 3px;
    }
  }
  .fa-form-item-children {
    display: flex;
    align-items: center;
  }
}
</style>

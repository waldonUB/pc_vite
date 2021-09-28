<!--
 * @Description  : 添加上传任务
 * @Author       : turbo
 * @Date         : 2021-07-23 12:42:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-28 17:15:49
-->

<template>
  <global-ts-bubble
    ref="addTaskBubble"
    class="add-task-bubble"
    :style="nowStyle"
    :is-show.sync="bubbleShow"
    :is-disabled="hasErr"
    v-windowResize="changePosition"
    @sure="sure"
    @cancel="cancel"
  >
    <template #boxContent>
      <fa-form-model ref="form" layout="vertical" :model="form" :rules="rules" @validate="validate">
        <fa-form-model-item label="所属公司：" prop="companyId">
          <global-ts-fai-select
            class="width_full-max"
            placeholder="请选择"
            :list="companyList"
            :get-popup-container="() => $refs.addTaskBubble.$el"
            v-model="form.companyId"
          ></global-ts-fai-select>
        </fa-form-model-item>
        <fa-form-model-item label="任务类型：" prop="type">
          <global-ts-fai-select
            class="width_full-max"
            placeholder="请选择"
            :list="uploadTypeList"
            :selectkey="{ label: 'value', value: 'key' }"
            :get-popup-container="() => $refs.addTaskBubble.$el"
            v-model="form.type"
            @change="changeType"
          ></global-ts-fai-select>
        </fa-form-model-item>
      </fa-form-model>
      <div v-if="downloadUrl" class="upload-file">
        <div class="tip">按模板格式填写后上传确认<a class="download-btn" :href="downloadUrl" download>下载模板</a></div>
        <fa-upload
          name="filedata"
          accept=".xls,.xlsx"
          action="/ajax/upload_h.jsp?cmd=uploadExcelTmpFile"
          :show-upload-list="false"
          @change="handleChange"
        >
          <global-ts-button type="primary" size="small">点击上传</global-ts-button>
        </fa-upload>
        <div class="file-name">{{ form.fileName }}</div>
      </div>
    </template>
  </global-ts-bubble>
</template>

<script>
// utils
import { bubble, downloadTempUrl } from '@/utils';

// api
import { third, task } from '@/api';

export default {
  name: 'AddTaskBubble',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    linkTarget: {
      // 目标位置信息 {target: '被跟随的位置元素', position: '相对位置'}
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      bubbleShow: false,
      hasErr: false,
      form: {
        fileId: '',
        fileName: '',
        type: undefined,
        companyId: undefined,
      },
      rules: {
        companyId: [
          {
            validator: (rule, value, callback) => {
              callback(!value ? '请选择所属公司' : undefined);
            },
          },
        ],
        type: [
          {
            validator: (rule, value, callback) => {
              callback(!value ? '请选择任务类型' : undefined);
            },
          },
        ],
      },
      nowStyle: '',
      companyList: [],
      uploadTypeList: [],
      downloadUrl: '',
    };
  },
  watch: {
    isShow(newVal) {
      this.bubbleShow = newVal;
      if (newVal) {
        this.changePosition();
        this.getTsCompanyList();
        this.getDefList();
      }
    },
    bubbleShow(newVal) {
      if (newVal !== this.isShow) {
        this.$emit('update:isShow', newVal);
      }
    },
  },
  methods: {
    changePosition() {
      this.$nextTick(() => {
        this.nowStyle = bubble.calculatePosition(
          this.$el,
          this.linkTarget.target,
          this.linkTarget.position,
          document.querySelector('.uploadTask'),
        );
      });
    },
    async getTsCompanyList() {
      const { getTsCompanyList } = third;
      const [err, res] = await getTsCompanyList({ isGetAll: true });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.companyList = res.data;
    },
    async getDefList() {
      const { getDefList } = task;
      const [err, res] = await getDefList();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const { typeList } = res.data;
      this.uploadTypeList = typeList;
    },
    async changeType() {
      this.form.fileId = '';
      this.form.fileName = '';
      if (this.form.type <= 0) return;

      const url = await downloadTempUrl(this.form.type);
      this.downloadUrl = url;
    },
    initBubble() {
      this.form = {
        fileId: '',
        fileName: '',
        type: 0,
        companyId: 0,
      };
      this.downloadUrl = '';
    },
    validate() {
      this.hasErr = this.$refs.form?.fields?.some(field => field.validateState === 'error');
    },
    handleChange(info) {
      let message = '';
      if (info.file.status === 'done') {
        const res = info.file.response;
        if (res.success) {
          this.form.fileId = res.data.id;
          this.form.fileName = res.data.name;
        } else {
          message = res.msg || '上传失败';
        }
      } else if (info.file.status === 'error') {
        message = '上传失败';
      }
      message &&
        this.$utils.postMessage({
          type: 'error',
          message,
        });
    },
    async sure() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      if (this.form.fileId === '' || this.form.fileName === '') {
        return this.$utils.postMessage({
          type: 'error',
          message: '还没上传excel文件',
        });
      }

      const { addUploadTask } = task;
      const [err, res] = await addUploadTask(this.form);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '添加任务失败，请刷新重试',
        });
        return Promise.reject(err);
      }
      this.initBubble();
      this.cancel();
      this.$emit('sure');
    },
    cancel() {
      this.$emit('update:isShow', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.add-task-bubble {
  .upload-file {
    margin-bottom: 20px;

    .tip {
      margin-bottom: 12px;
      color: $color-53;
    }

    .download-btn {
      margin-left: 8px;
    }

    .file-name {
      margin-top: 12px;
      color: $primary-color;
    }
  }
}
</style>

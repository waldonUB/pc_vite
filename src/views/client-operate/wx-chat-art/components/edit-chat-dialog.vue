<!--
 * @Description  : 录入/编辑话术对话框
 * @Author       : turbo
 * @Date         : 2021-07-27 17:02:21
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 10:15:35
-->

<template>
  <global-ts-dialog
    class="edit-chat-dialog"
    dialog-size="medium"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <fa-form-model layout="vertical">
      <fa-form-model-item label="分组">
        <fa-cascader
          size="large"
          :placeholder="'请选择分组'"
          :options="groupTagParentList"
          :field-names="{ value: 'id', label: 'name', children: 'children' }"
          :display-render="({ labels }) => labels.join(' - ')"
          :popup-style="{ zIndex: 3000 }"
          :change-on-select="true"
          v-model="cascaderValue"
          @change="handleCascaderChange"
        ></fa-cascader>
      </fa-form-model-item>
      <fa-form-model-item label="话术">
        <fa-textarea placeholder="请输入话术" :max-length="1300" :rows="4" v-model="form.content"></fa-textarea>
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

// utils
import { postLimitVer } from '@/utils';

// api
import { material } from '@/api';

export default {
  name: 'EditChatDialog',
  props: {
    groupType: {
      type: Number,
    },
    groupTagParentList: {
      type: Array,
      required: true,
      default: () => [],
    },
    chatInfo: {
      type: Object,
      default: () => {},
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      form: {
        typeGroup: 0,
        id: 0,
        groupId: 0,
        content: '',
      },
      cascaderValue: [],
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal && !this.isAddType) {
        this.form = {
          typeGroup: this.chatInfo.typeGroup || this.groupType,
          id: this.chatInfo.id || 0,
          groupId: this.chatInfo.groupId || 0,
          content: this.chatInfo.content || '',
        };
        this.cascaderValue =
          this.chatInfo.groupParentId > 0
            ? [this.chatInfo.groupParentId, this.chatInfo.groupId]
            : this.chatInfo.groupId > 0
            ? [this.chatInfo.groupId]
            : [];
      } else {
        this.form = {
          typeGroup: this.groupType,
          id: 0,
          groupId: 0,
          content: '',
        };
        this.cascaderValue = [];
      }
    },
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    isAddType() {
      return !this.chatInfo?.id;
    },
    dialogTitle() {
      return this.chatInfo?.id ? '编辑话术' : '录入话术';
    },
  },
  methods: {
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/4/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 保存话术
     * @author waldon
     * @date 2020/4/10
     */
    async sure() {
      if (this.form.content.trim() === '') {
        return this.$utils.postMessage({
          type: 'error',
          message: '请输入话术',
        });
      }
      const { addTsMaterialInfo, setTsMaterialInfo } = material;
      const [err, res] = this.isAddType ? await addTsMaterialInfo(this.form) : await setTsMaterialInfo(this.form);
      if (err?.rt === 6038 || err?.rt === 6039) {
        return postLimitVer(err?.msg);
      }
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : res.msg,
      });
      if (!err) {
        this.cancel();
        this.$emit('saveChatSuccess');
        this.$utils.FdpLog('yx_schs', {
          yx_free_text_0: this.groupType === 1 ? '企业话术' : '个人话术',
          yx_staff_position: this.isManage ? 1 : 2, // 员工职务, 1 - 管理员, 2 - 销售员, 4 - 未知
        });
      }
    },
    /**
     * 处理级联选择的值改变
     * @author turbo
     * @date 2020/10/21
     */
    handleCascaderChange(value) {
      this.form.groupId = value.length > 1 ? value[1] : value[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-chat-dialog {
  .fa-form-item {
    margin-bottom: 12px;

    &:last-child {
      padding: 0;
      margin: 0;
    }
  }
}
</style>

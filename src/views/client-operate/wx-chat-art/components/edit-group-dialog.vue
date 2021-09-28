<!--
 * @Description  : 添加/修改分组对话框
 * @Author       : turbo
 * @Date         : 2021-07-28 17:59:58
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 11:17:29
-->

<template>
  <global-ts-dialog
    class="edit-group-dialog"
    dialog-size="medium"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <fa-form-model layout="vertical">
      <fa-form-model-item label="上级分组">
        <global-ts-fai-select
          class="width_full-max"
          size="large"
          :list="groupDropDownList"
          v-model="form.parentId"
        ></global-ts-fai-select>
      </fa-form-model-item>
      <fa-form-model-item label="分组名称">
        <global-ts-input
          size="large"
          placeholder="请输入分组名称"
          :max-length="15"
          v-model="form.name"
        ></global-ts-input>
      </fa-form-model-item>
    </fa-form-model>
  </global-ts-dialog>
</template>

<script>
// api
import { settingCenter } from '@/api';

export default {
  name: 'EditGroupDialog',
  props: {
    groupType: {
      type: Number,
    },
    groupTagParentList: {
      type: Array,
      required: true,
      default: () => [],
    },
    groupInfo: {
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
        id: 0,
        parentId: 0,
        name: '',
        type: 5, // 我的话术
      },
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal && !this.isAddType) {
        this.form = {
          id: this.groupInfo.id || 0,
          parentId: this.groupInfo.parentId || 0,
          name: this.groupInfo.name || '',
          type: this.groupInfo.type || this.groupType,
        };
      } else {
        this.form = {
          id: 0,
          parentId: 0,
          name: '',
          type: this.groupType,
        };
      }
    },
  },
  computed: {
    isAddType() {
      return !this.groupInfo?.id;
    },
    dialogTitle() {
      return this.groupInfo?.id ? '修改分组' : '添加分组';
    },
    /**
     * 分组下拉列表
     * @author turbo
     * @date 2020/10/21
     * @returns {Array} 分组下拉列表
     */
    groupDropDownList() {
      return [{ id: 0, name: '无' }, ...this.groupTagParentList.filter(item => item.id !== this.form.id)];
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    async sure() {
      if (this.form.name.trim() === '') {
        return this.$utils.postMessage({
          type: 'error',
          message: '请输入分组名称',
        });
      }
      const { addTsGroup, setTsGroup } = settingCenter;
      const [err, res] = this.isAddType ? await addTsGroup(this.form) : await setTsGroup(this.form);
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : res.msg,
      });
      if (!err) {
        this.cancel();
        this.$pubsub.emit('getGroupTagList', this.groupType, true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-group-dialog {
  .fa-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin: 0;
    }
  }
}
</style>

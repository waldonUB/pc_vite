<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:42:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 16:03:29
-->
<template>
  <global-ts-dialog
    class="reasonDialog wxCorpDialog"
    :dialog-visible.sync="dialogVisible"
    :dialog-title="dialogTitlte"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="inputGroup">
      <div class="inputGroup-item">
        <global-ts-input
          class="setInput fill-show-count"
          :maxLength="10"
          :placeholder="placeholder"
          :showCount="true"
          v-model="reason"
        >
        </global-ts-input>
        <p v-if="isEdit" class="add-desc">注意：编辑操作不会更新公海的历史数据，只对新数据生效</p>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
export default {
  name: 'reason-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      // 是否是编辑
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请输入原因',
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reason: '',
    };
  },
  computed: {
    dialogTitlte() {
      return this.isEdit ? '编辑原因' : '新增原因';
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.reason = this.name;
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    sure() {
      if (!this.reason) {
        this.$utils.postMessage({
          type: 'error',
          message: this.placeholder,
        });
        return;
      }
      this.$emit('sure', this.reason);
    },
  },
};
</script>

<style lang="scss" scoped>
.reasonDialog {
  .add-desc {
    margin-top: 12px;
    font-size: 14px;
    color: #898989;
  }
}
</style>

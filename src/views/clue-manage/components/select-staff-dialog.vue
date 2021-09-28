<!--
 * @Description  : 选择分配员工对话框
 * @Author       : turbo
 * @Date         : 2021-06-24 16:12:46
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-29 18:19:34
-->

<template>
  <global-ts-dialog
    dialog-title="选择成员"
    dialog-size="small"
    :dialog-visible.sync="dialogVisible"
    @sure="sure"
    @cancel="cancel"
  >
    <ts-search-tree
      ref="searchTree"
      :is-worker="false"
      :select-value.sync="staff.name"
      @select="selectSalers"
    ></ts-search-tree>
  </global-ts-dialog>
</template>

<script>
// components
import TsSearchTree from '@/components/base/ts-search-tree/index.vue';

export default {
  name: 'SelectStaffDialog',
  components: { TsSearchTree },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      staff: {
        sid: '',
        name: '',
      },
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.staff = {
          sid: '',
          name: '',
        };
        this.$nextTick(() => {
          this.$refs.searchTree.initData();
        });
      }
    },
  },
  methods: {
    selectSalers(value) {
      this.staff.sid = value.sid;
      this.staff.name = value.name;
    },
    /**
     * 选择员工返回
     * @author waldon
     * @date 2020/6/1
     */
    sure() {
      if (!this.staff.sid) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请选择成员',
        });
      }
      this.$emit('sure', this.staff);
      this.cancel();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/1
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped></style>

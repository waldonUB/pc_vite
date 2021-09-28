<!--
 * @Author       : ADI
 * @Date         : 2021-07-08 11:26:52
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 14:49:00
-->
<template>
  <global-ts-dialog
    class="changeWorkDialog wxCorpDialog center"
    dialog-title="设置角色"
    :dialog-visible.sync="dialogVisible"
    dialog-size="small"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="dialogContent">
      <el-select class="fitBox" v-model="selectId" filterable placeholder="请选择角色">
        <el-option v-for="item in workList" :key="item.key" :label="item.roleName" :value="item.key"> </el-option>
      </el-select>
    </div>
  </global-ts-dialog>
</template>

<script>
import { Select, Option } from 'element-ui';

export default {
  name: 'change-work-dialog',
  components: { [Select.name]: Select, [Option.name]: Option },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    workList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    initSelectId: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      selectId: '',
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.selectId = this.initSelectId;
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 选择成员返回
     * @author waldon
     * @date 2020/6/1
     */
    sure() {
      if (this.selectId === '') {
        this.$utils.postMessage({
          type: 'error',
          message: '请选择角色',
        });
        return;
      }
      const work = this.workList.find(item => item.key === this.selectId);
      this.$emit('sure', work);
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

<style lang="scss" scoped>
.change-work-dialog {
}
</style>

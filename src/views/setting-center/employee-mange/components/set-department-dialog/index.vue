<!--
 * @Author       : ADI
 * @Date         : 2021-07-08 11:27:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 10:33:20
-->
<template>
  <global-ts-dialog
    class="bindDialog"
    :dialog-visible.sync="isShowDialog"
    :dialog-title="isEdit ? '修改名称' : '添加子部门'"
    dialog-size="small"
    @cancel="close"
    @sure="sure"
  >
    <div class="bindBox">
      <fa-input
        class="fitBox"
        id="departmentName"
        v-model="departmentName"
        placeholder="请输入部门名称"
        :maxLength="20"
        :showCount="true"
      >
      </fa-input>
    </div>
  </global-ts-dialog>
</template>

<script>
import { setDepartment, addDepartment } from '@/api/modules/views/setting-center/employee-mange';

export default {
  name: 'set-department-dialog',
  components: {},
  props: {
    isGetAll: {
      type: Boolean,
      value: true,
    },
  },
  data() {
    return {
      isEdit: false, // 是否是编辑
      departmentName: '', // 部门名称
      isShowDialog: false, // 控制弹窗是否显示
      currentData: null, // 当前操作的部门数据
      parent: null,
      currentNode: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async sure() {
      console.log('currentData', this.currentData);
      if (!this.departmentName) {
        this.$utils.postMessage({
          type: 'error',
          message: '部门名称不能为空',
        });
        return;
      }
      if (this.isEdit) {
        await this.setDepartName();
        this.currentData.name = this.departmentName;
      } else {
        const newChild = await this.addDepartment();
        this.$set(newChild, 'isLeaf', true);
        this.append(newChild);
      }
      this.isShowDialog = false;
    },
    close() {
      this.isShowDialog = false;
    },
    append(newChild) {
      /**
       *  特殊处理, 如果是公司添加子部门的话
       */

      if (this.currentData.id === 0 && this.currentData.fid === -1) {
        this.$emit('updateTree');
        return;
      }

      if (!this.currentData.children) {
        this.$set(this.currentData, 'children', []);
      }

      this.$nextTick(() => {
        this.$set(this.currentData, 'hasChild', true);
        if (this.isGetAll) {
          this.parent.$refs.companyList.append(this.currentData);
        } else {
          this.parent.$refs.companyList.handleExpand(this.currentData);
        }
      });
    },
    /**
     * @description 修改部门
     * @author enson
     * @date 2020-08-31
     * @returns
     */
    async setDepartName() {
      const [err, res] = await setDepartment({
        id: this.currentData.id,
        name: this.departmentName,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '操作成功',
      });
      return Promise.resolve();
    },
    /**
     * @description 添加子部门
     * @author enson
     * @date 2020-08-31
     */
    async addDepartment() {
      const [err, res] = await addDepartment({
        fid: this.currentData.id,
        name: this.departmentName,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '操作成功',
      });
      return Promise.resolve(res.data);
    },
    /**
     * @description 控制弹窗是否显示
     * @author enson
     * @date 2020-08-24
     * @param {Boolean} flag true-显示 false-不显示
     * @param {Boolean} isEdit true-编辑 false-创建子部门
     * @param {Object}  currentData 当前操作的部门数据
     */
    initDialog(flag, isEdit = false, currentData = null, parent) {
      this.isShowDialog = flag;
      this.isEdit = isEdit;
      if (currentData) {
        this.currentData = currentData.data;
        this.currentNode = currentData.node;
      }
      console.log('this.currentData', this.currentData);
      this.parent = parent;
      this.departmentName = this.isEdit ? this.currentData.name : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.set-department-dialog {
}
</style>

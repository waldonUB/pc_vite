<!--
 * @Description  : 关联情况对话框
 * @Author       : turbo
 * @Date         : 2021-07-13 11:56:39
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-13 13:36:56
-->

<template>
  <global-ts-dialog
    dialog-title="关联情况"
    dialog-width="760px"
    :with-footer="false"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
  >
    <el-table row-key="id" border min-width="700px" :data="companyList">
      <el-table-column label="所属公司" prop="companyName" min-width="399px"></el-table-column>
      <el-table-column label="第三方客户ID" prop="thirdClientId" min-width="300px"></el-table-column>
    </el-table>
  </global-ts-dialog>
</template>

<script>
// api
import { client } from '@/api';

export default {
  name: 'RelevanceDialog',
  props: {
    cid: {
      type: Number,
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      companyList: [],
    };
  },
  created() {
    this.getTsClientCompanyList();
  },
  methods: {
    async getTsClientCompanyList() {
      const { getTsClientCompanyList } = client;
      const [err, res] = await getTsClientCompanyList({
        cid: this.cid,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.companyList = res.data;
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped></style>

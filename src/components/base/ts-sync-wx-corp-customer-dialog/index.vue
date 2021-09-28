<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:42:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 11:36:08
-->
<template>
  <global-ts-dialog
    class="syncWxCorpCustomerDialog wxCorpDialog center"
    dialog-title="导入企微成员"
    :dialog-visible.sync="dialogVisible"
    dialog-size="large"
    @sure="sure"
    @cancel="cancel"
  >
    <div class="syncWxCorpCustomerDialogContent">
      <div class="titleTip">
        选择企微成员（确定后将新创建帐号，并设置销售员角色，可在成员管理调整）
      </div>
      <div class="tagWrapper">
        <ts-wxtag v-for="item of selectedOrgData.dept" :key="item.id" class="workTag" type="selected">
          {{ item.name }}
        </ts-wxtag>
        <ts-wxtag v-for="item of selectedOrgData.staff" :key="item.id" class="workTag" type="staffSelected">
          {{ item.name }}
        </ts-wxtag>
        <ts-wxtag @click="showFilterDialog" class="workTag" type="normalAdd">
          <global-ts-svg-icon class="icon tagIcon" name="icon-icon-11" />
        </ts-wxtag>
      </div>
      <div class="bottomTip">
        导入企微成员后，系统将自动同步关联的客户
      </div>
      <ts-org-select-dialog
        dialogTitle="选择员工"
        :isGetAll="false"
        :selectedOrgData="selectedOrgData"
        :defaultExpandKeys.sync="defaultExpandKeys"
        @getSelectedData="getSelectedData"
        :dialogVisible.sync="orgSelectDialogVisible"
      >
      </ts-org-select-dialog>
    </div>
  </global-ts-dialog>
</template>

<script>
import { FdpLog, postMessage } from '@/utils';
import MD5 from 'md5.js';
import tsOrgSelectDialog from '@/components/base/ts-org-select-dialog/index.vue';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';
import { syncWxWorkUserAjax } from '@/api/modules/common';

export default {
  name: 'ts-sync-wx-corp-customer-dialog',
  components: { tsOrgSelectDialog, tsWxtag },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    pwd: {
      // 默认密码为123456
      type: String,
      default: '123456',
    },
    isSetPwd: {
      // 是否设置密码
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      orgSelectDialogVisible: false, // 组织架构弹窗
      selectedOrgData: {
        // 被选中的部门/员工
        dept: [],
        staff: [],
      },
      defaultExpandKeys: [],
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.selectedOrgData = {
          // 被选中的部门/员工
          dept: [],
          staff: [],
        };
        this.defaultExpandKeys = [];
        FdpLog('yx_djqwsjtb', {
          yx_free_text_0: '弹窗曝光',
        });
        FdpLog('yx_djqwkhtb', {
          yx_free_text_0: '点击按钮',
        });
      }
    },
    isSetPwd(newVal) {
      if (newVal) {
        this.syncWxWorkUser();
      }
    },
  },
  computed: {},
  methods: {
    /**
     * 获取选择的数据
     * @author waldon
     * @date 2020/4/10
     * @param {*} selectedData - 选择的数据
     * */
    getSelectedData(selectedData) {
      this.selectedOrgData = selectedData;
    },
    /**
     * 组织部门筛选弹窗
     * @author waldon
     * @date 2020/7/21
     * @returns {*}
     */
    showFilterDialog() {
      this.orgSelectDialogVisible = true;
    },
    sure() {
      if (
        !(
          (this.selectedOrgData.dept && this.selectedOrgData.dept.length) ||
          (this.selectedOrgData.staff && this.selectedOrgData.staff.length)
        )
      ) {
        postMessage({
          type: 'error',
          message: '请选择员工再点击确定',
        });
        return;
      }
      FdpLog('yx_djqwsjtb', {
        yx_free_text_0: '点击确定',
      });
      if (this.isSetPwd) {
        this.syncWxWorkUser();
      }
      this.$emit('sure', this.selectedOrgData);
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 同步企微用户
     * @author waldon
     * @date 2020/7/23
     */
    async syncWxWorkUser() {
      const userIds = this.selectedOrgData.staff.map(item => item.userId);
      const partis = this.selectedOrgData.dept.map(item => item.id);
      const params = {
        userIds: JSON.stringify(userIds),
        partis: JSON.stringify(partis),
        pwd: new MD5().update(this.pwd).digest('hex'),
      };
      const [err, res] = await syncWxWorkUserAjax(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
      } else {
        postMessage({
          type: 'success',
          message: res.msg,
        });
        this.$emit('syncWxWorkUserSuccess');
      }
      this.$emit('update:isSetPwd', false); // 更改password状态
    },
    cancel() {
      FdpLog('yx_djqwsjtb', {
        yx_free_text_0: '点击取消',
      });
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.syncWxCorpCustomerDialog {
  .syncWxCorpCustomerDialogContent {
    padding: 20px 30px;
    box-sizing: border-box;
    .titleTip {
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 14px;
      color: $color-00;
    }
    .bottomTip {
      margin-top: 20px;
      font-size: 14px;
      line-height: 14px;
      color: $color-b2;
    }
    .tagWrapper {
      display: flex;
      flex-flow: row wrap;
      .workTag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .tagIcon {
        margin-right: 0;
      }
    }
  }
}
</style>

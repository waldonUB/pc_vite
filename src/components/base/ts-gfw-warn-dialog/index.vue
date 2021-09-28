<template>
  <global-ts-dialog
    class="gfwWarnDialog wxCorpDialog"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    :with-footer="false"
  >
    <div class="gfwWarnDialogContent">
      <div class="warnTipBox">
        系统检测到您有多条资料可能违反相关服务协议，请及时处理
      </div>
      <div class="optionsBox">
        <div class="option" v-for="(item, index) of gfwInfoList" :key="index" @click="routeToUrl(item)">
          {{ item.typeName }}>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import { mapState } from 'vuex';
import ManagerDef from '@/config/manager-def';

export default {
  name: 'ts-gfw-warn-dialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '违规告警',
    },
    gfwInfoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.info,
    }),
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 跳到对应的页面
     * @author waldon
     * @date 2020/5/22
     * @param {*} gfwInfo - 被审查的页面信息
     * @returns {*}
     */
    routeToUrl(gfwInfo) {
      let flag = true;
      if (this.userInfo.staffInfo.workId === 4) {
        // 自定义角色
        const permissions = this.userInfo.staffInfo.permissions;
        switch (gfwInfo.typeName) {
          case '文章':
          case '表单':
          case '海报':
            flag = permissions.includes(ManagerDef.FUNC_PERMISSION.GET_CUSTOMER_TOOL);
            break;
          case '文档':
          case '图片':
          case '视频':
            flag = permissions.includes(ManagerDef.FUNC_PERMISSION.OFFICE_CASE);
            break;
          case '商品':
            flag = permissions.includes(ManagerDef.FUNC_PERMISSION.PRODUCT_MANAGER);
        }
      }
      if (!flag) {
        postMessage({
          type: 'error',
          message: '暂无该功能权限，请联系管理员',
        });
        return;
      }
      window.open(gfwInfo.gfwCloseUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.gfwWarnDialog {
  .gfwWarnDialogContent {
    .warnTipBox {
      display: flex;
      height: 48px;
      padding-left: 30px;
      font-size: 14px;
      color: red;
      background-color: #fef5dd;
      align-items: center;
    }
    .optionsBox {
      display: flex;
      padding: 0 0 20px 30px;
      box-sizing: border-box;
      flex-flow: row wrap;
      .option {
        margin: 20px 200px 0 0;
        font-size: 14px;
        color: $color-53;
        cursor: pointer;
        &:hover {
          color: rgb(4, 8, 18);
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.gfwWarnDialog {
  &.wxCorpDialog {
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>

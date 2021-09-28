<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:29:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-21 15:41:56
-->
<template>
  <global-ts-dialog
    class="wxAuthDialog wxCorpDialog center"
    dialog-title="选择公众号"
    :dialog-visible="dialogVisible"
    dialog-size="large"
    @cancel="cancel"
    :with-footer="false"
  >
    <div class="dialogContent">
      <auth-qr-dialog @finishAuth="finishAuth" :dialogVisible.sync="authQrDialogVisible"> </auth-qr-dialog>
      <multipart-import-dialog
        @importArticleSuccess="importArticleSuccess"
        :selectedAppid="selectedAppid"
        :dialogVisible.sync="multipartImportDialogVisible"
      >
      </multipart-import-dialog>
      <global-ts-warn-tips size="small">
        <p class="warnTipsContent" slot="content">
          授权公众号后，将该公众号的全部图文素材导入企业文库
        </p>
      </global-ts-warn-tips>
      <el-table ref="wxAuthTb" :data="wxAuthList" header-row-class-name="employeeHeader" border>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0"></span>
            <span v-else>{{ (pages.pageNow - 1) * pages.limit + scope.$index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选择导入文章的公众号">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0" class="tanshu_linkColor" @click="showQrDialog">+授权公众号 </span>
            <div class="cellItem" v-else>
              <global-ts-text-img
                class="textImgBox"
                :sexColor="sexColorCal"
                :imgUrl="scope.row.headImg"
                :imgText="scope.row.name"
              >
              </global-ts-text-img>
              <div class="autoName">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="120" label="操作">
          <template slot-scope="scope">
            <span v-if="scope.$index" class="tanshu_linkColor" @click="showMultipartImportDialog(scope.row)">
              选择导入
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        direction="up"
        v-model="wxAuthList"
        :httpurl="ajaxUrl"
        :isReload.sync="isReload"
        :requestParam="requestParam"
        @getData="changeTable"
      >
      </global-ts-pagination>
    </div>
  </global-ts-dialog>
</template>

<script>
import AuthQrDialog from '../auth-qr-dialog/index.vue';
import MultipartImportDialog from '../multipart-import-dialog/index.vue';
import { mapState } from 'vuex';
import { Table, TableColumn } from 'element-ui';

export default {
  name: 'wx-auth-dialog',
  components: { AuthQrDialog, MultipartImportDialog, [Table.name]: Table, [TableColumn.name]: TableColumn },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      wxAuthList: [],
      requestParam: {},
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      selectedArticleList: [], // 选择的文章数据
      ajaxUrl: '/ajax/userWxAuth/tsWxMpAuth_h.jsp?cmd=getTsWxMpAuthList',
      isReload: false,
      authQrDialogVisible: false, // 扫码弹窗
      multipartImportDialogVisible: false, // 批量导入弹窗
      selectedAppid: '',
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    sexColorCal() {
      if (this.isOem) {
        return 'oemColor';
      } else {
        return 'notOemColor';
      }
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.isReload = true;
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 导入文章成功的回调
     * @author waldon
     * @date 2020/9/21
     */
    importArticleSuccess() {
      this.$parent && this.$parent.reloadTable();
    },
    /**
     * 授权完成回调
     * @author waldon
     * @date 2020/9/19
     * @param {Object} rowData -
     */
    finishAuth(rowData) {
      this.isReload = true;
      this.showMultipartImportDialog(rowData);
    },
    /**
     * 显示批量导入窗口
     * @author waldon
     * @date 2020/9/18
     * @param {Object} rowData -
     */
    showMultipartImportDialog(rowData) {
      this.selectedAppid = rowData.appid;
      this.multipartImportDialogVisible = true;
    },
    /**
     * 展示二维码弹窗
     * @author waldon
     * @date 2020/9/17
     */
    showQrDialog() {
      this.authQrDialogVisible = true;
    },
    changeTable(data, all, pages) {
      this.wxAuthList = data;
      this.wxAuthList.unshift({}); // 占多一行
      this.pages = pages;
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.wxAuthDialog {
  .cellItem {
    display: flex;
    height: 32px;
    padding-left: 304px;
    line-height: 32px;
    text-align: left;
    box-sizing: border-box;
    align-items: center;
    .textImgBox {
      display: inline-block;
    }
    img {
      width: 32px;
      height: 32px;
      border-radius: 2px;
    }
    .autoName {
      display: inline-block;
      max-width: 330px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:34:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-24 10:49:20
-->
<template>
  <global-ts-dialog
    class="multipartImportDialog wxCorpDialog center"
    dialog-title="选择导入文章"
    :dialog-visible="dialogVisible"
    dialog-size="large"
    :lock-dialog-body-height="false"
    :append-to-body="true"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="dialogContent">
      <ts-classify-bubble
        :isFixed="true"
        :isShow.sync="isShowBubble"
        :linkTarget="linkTarget"
        httpurl="/rest/manage/article/type/getTempTypeList"
        @submitSuccess="getTempTypeList"
      >
      </ts-classify-bubble>
      <global-ts-warn-tips size="small">
        <p class="warnTipsContent" slot="content">
          请勿导入包含虚假营销、政治敏感等违规内容的文章
          <a :href="appealHelpUrl" target="_blank">查看详情</a>
        </p>
      </global-ts-warn-tips>
      <div class="marginBox">
        <div class="classifyBox">
          <span>分类</span>
          <div
            class="createClassify"
            :class="isHaveVersion ? 'hasVersion' : ''"
            @click="addClassifyRel"
            ref="addButton"
          >
            <global-ts-svg-icon class="icon" name="icon-icon-11" />
            创建分类
          </div>
        </div>
        <div class="selectListBox">
          <el-select
            class="classifySelectList"
            v-model="tempTypeId"
            :disabled="!isHaveVersion || tempTypeList.length === 0"
            placeholder="请选择分类"
          >
            <el-option
              v-for="optionItem in tempTypeList"
              :key="optionItem.id"
              :label="optionItem.name"
              :value="optionItem.id"
            >
            </el-option>
          </el-select>
          <div class="selectTip">已选择文章：{{ selectedArticleNumCal }}</div>
        </div>
      </div>
      <el-table
        ref="importArticleTb"
        :data="importArticleListData"
        row-key="id"
        @select="changeSelect"
        @select-all="changeSelectAll"
        header-row-class-name="employeeHeader"
        :indent="articleTbIndent"
        border
      >
        <el-table-column :reserve-selection="true" type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">
            {{ (pages.pageNow - 1) * pages.limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column class-name="articleTitle" prop="title" label="文章标题">
          <template slot-scope="scope">
            {{ scope.row.title || '未命名文章' }}
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        direction="up"
        v-model="importArticleListData"
        :httpurl="ajaxUrl"
        :errorHandle="articleErrorHandle"
        :isReload.sync="isReload"
        :requestParam="requestParam"
        :selectPage="selectPage"
        @getData="changeTable"
      >
      </global-ts-pagination>
    </div>
  </global-ts-dialog>
</template>

<script>
import commonData from '../../mixins/common-data/index.js';
import { mapState } from 'vuex';
import { FdpLog, postMessage, showCapacityTip } from '@/utils';
import TsClassifyBubble from '@/components/base/ts-classify-bubble/index.vue';
import { Table, TableColumn, Select, Option } from 'element-ui';
import { importWxArticle } from '@/api/modules/views/customer-tools/article-material';

export default {
  name: 'multipart-import-dialog',
  mixins: [commonData],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Select.name]: Select,
    [Option.name]: Option,
    TsClassifyBubble,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectedAppid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      importArticleListData: [],
      requestParam: {
        appId: '',
      },
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      selectPage: [
        {
          value: 10,
          label: 10,
        },
        {
          value: 50,
          label: 50,
        },
      ],
      selectedArticleList: [], // 选择的文章数据
      ignoreArticleList: [], // 忽略的文章数据
      ajaxUrl: '/ajax/userWxAuth/tsWxMpAuth_h.jsp?cmd=getMpArticleList',
      isReload: false,
      isSelectAll: false, // 是否点击了全选
      totalGroupNum: 0, // 所有组
      articleTbIndent: 0, // 子项间距
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user?.info?.isOem,
      appealHelpUrl: state => state.globalData?.addressUrl?.appealHelpUrl,
    }),
    /**
     * 已选文章组数量
     * @author waldon
     * @date 2020/9/21
     * @returns {Number} - 已选文章组数量
     */
    selectedArticleNumCal() {
      if (this.isSelectAll) {
        return this.totalGroupNum - JSON.parse(this.formatImportJson(this.ignoreArticleList)).length;
      } else {
        return JSON.parse(this.formatImportJson(this.selectedArticleList)).length;
      }
    },
    articleNoAuthUrlCal() {
      if (this.isOem) {
        return 'https://easydoc.xyz/s/80638278/KV0USCIG/dEvAyNDd';
      } else {
        return 'https://kht.fkw.com/blog/30150/';
      }
    },
  },
  watch: {
    dialogVisible(newVal) {
      console.log('this.tempTypeList', this.tempTypeList);
      if (newVal) {
        this.isSelectAll = false;
        this.requestParam.appId = this.selectedAppid;
        this.isReload = true;
        this.getTempTypeList().then(res => {
          this.tempTypeId = '';
          if (Array.isArray(this.tempTypeList) && this.tempTypeList.length) {
            const subClassify = this.tempTypeList.find(item => item.name === '公众号文章');
            if (subClassify) {
              this.tempTypeId = subClassify.id;
            }
          }
        });
        FdpLog('yx_drwztc', {
          yx_free_text_0: '弹窗曝光',
        });
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    addClassifyRel() {
      this.addClassify(this.$refs.addButton);
    },
    /**
     * 格式化导入的id信息
     * @author waldon
     * @date 2020/9/19
     * @param {Array} list -
     * @returns {String} - 格式化导入信息
     */
    formatImportJson(list) {
      const formatList = list.reduce((prev, curr) => {
        if (prev.length === 0 || prev.findIndex(item => item.mediaId === curr.mediaId) === -1) {
          prev.push({
            mediaId: curr.mediaId,
            indexList: [curr.index],
          });
        } else {
          const lastItem = prev.find(item => item.mediaId === curr.mediaId);
          if (lastItem) {
            lastItem.indexList.push(curr.index);
          }
        }
        return prev;
      }, []);
      return JSON.stringify(formatList);
    },
    /**
     * @description : 导入文章
     * @author      : ADI
     * @Date        : 2021-05-21 17:40:30
     * @param        {*}
     * @return       {Promise}
     */
    async importArticle() {
      const params = {
        appId: this.requestParam.appId,
        type: this.tempTypeId,
        isImportAll: this.isSelectAll,
        mediaJson: this.formatImportJson(this.selectedArticleList),
        ignoreMediaJson: this.formatImportJson(this.ignoreArticleList),
      };
      const [err, res] = await importWxArticle(params);
      if (err) {
        showCapacityTip(err);
        return Promise.reject(err);
      }
      postMessage({
        type: 'success',
        message: '导入中，请稍后刷新页面查看',
      });
      // 重置条件
      this.tempTypeId = '';
      this.isSelectAll = false;
      this.selectedArticleList = [];
      this.ignoreArticleList = [];
      this.$refs.importArticleTb.clearSelection();
      return Promise.resolve();
    },
    changeTable(data, all, pages) {
      this.totalGroupNum = all.total;
      this.importArticleListData = data;
      if (this.isSelectAll) {
        // 如果之前勾了全选，剩下的数据要默认勾选
        this.$refs.importArticleTb.clearSelection(); // 先情况，否则即使相同id也会重复勾选
        const selectedList = this.importArticleListData.filter(
          item => !this.ignoreArticleList.find(subItem => subItem.id === item.id),
        );
        this.checkedRows(selectedList);
      }
      this.pages = pages;
      this.expandAllArrow();
    },
    /**
     * 分页错误回调
     * @author waldon
     * @date 2020/9/24
     * @param {Object} res - 分页请求数据
     */
    articleErrorHandle(res) {
      if (!res.success && res.rt === 61007) {
        postMessage({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: `<p>获取公众号文章失败，请刷新重试！<a href="${this.articleNoAuthUrlCal}" target="_blank">查看原因</a></p>`,
        });
      } else {
        postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      }
    },
    /**
     * 默认选中操作
     * @author waldon
     * @date 2020/9/19
     * @param {Array} list - 选中行
     */
    checkedRows(list) {
      list.forEach(item => {
        this.$refs.importArticleTb.toggleRowSelection(item, true);
        if (Array.isArray(item.children) && item.children.length) {
          this.checkedRows(item.children);
        }
      });
    },
    changeSelectAll(selection) {
      this.selectedArticleList = [];
      this.ignoreArticleList = [];
      this.isSelectAll = Array.isArray(selection) && !!selection.length;
      this.changeSelect(selection);
    },
    /**
     * 改变选中数据
     * @author waldon
     * @date 2020/4/10
     * @param {*} selection - 选中数据
     */
    changeSelect(selection) {
      if (this.isSelectAll) {
        // 全选时，取消勾选某项时添加进移除的选项
        this.ignoreArticleList = [];
        this.importArticleListData.forEach(item => {
          const index = selection.findIndex(subItem => item.id === subItem.id);
          if (index === -1) {
            // 将非勾选的加进忽略列表
            this.ignoreArticleList.push({
              id: item.id,
              mediaId: item.mediaId,
              index: item.index,
            });
          }
        });
      } else {
        this.selectedArticleList = selection.map(item => {
          return {
            id: item.id,
            mediaId: item.mediaId,
            index: item.index,
          };
        });
      }
    },
    /**
     * 展开树形表格，饿了么里面没有发现这个api，
     * toggleRowExpansion 这个api只针对展开行，而不是树形表格，
     * 暂时用点击事件处理
     * @author waldon
     * @date 2020/9/16
     */
    expandAllArrow() {
      this.$nextTick(() => {
        const arrow = document.getElementsByClassName('el-table__expand-icon');
        for (const item of arrow) {
          if (item.children && item.children.length) {
            item.click();
          }
        }
      });
    },
    /**
     * 确定的回调
     * @author waldon
     * @date 2020/6/10
     * */
    async sure() {
      FdpLog('yx_drwztc', {
        yx_free_text_0: '点击导入',
      });
      await this.importArticle(); // 不发送成功的，无需关掉弹窗
      this.$emit('importArticleSuccess');
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      FdpLog('yx_drwztc', {
        yx_free_text_0: '点击取消',
      });
      this.$emit('update:dialogVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.marginBox {
  .classifyBox {
    display: flex;
    width: 340px;
    align-items: center;
    .createClassify {
      margin-left: auto;
      color: rgba(178, 178, 178, 1);
      cursor: not-allowed;
      &.hasVersion {
        cursor: pointer;
        &:hover {
          color: #247af3;
        }
      }
    }
  }
  .selectListBox {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 20px 0;
  }
  .classifySelectList {
    width: 340px;
  }
}
</style>
<style lang="scss">
.multipartImportDialog {
  .el-table__body-wrapper {
    .articleTitle {
      .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

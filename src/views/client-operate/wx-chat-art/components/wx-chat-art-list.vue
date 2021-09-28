<!--
 * @Description  : 企微话术列表
 * @Author       : turbo
 * @Date         : 2021-07-27 09:36:32
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 11:45:47
-->

<template>
  <div v-if="!isInit" class="wx-chat-art-list">
    <global-ts-header>
      <template #leftPart>话术库</template>
      <template #rightPart>
        <global-ts-button type="primary" size="small" @click="operateByTemp('batchImport')">批量录入</global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-icon-11" @click="operateByTemp('singleImport')">
          录入话术
        </global-ts-button>
      </template>
    </global-ts-header>
    <!-- 介绍页 -->
    <ts-introduce-page v-if="!showContent" :show-head="false" :introduct-bg="wxChatArtRecommendPng"></ts-introduce-page>
    <!-- 功能页 -->
    <div v-else class="pro_listBox">
      <global-ts-slide has-padding :slid-array="slideList" @changeStatus="changeSlide"></global-ts-slide>
      <div class="search-box">
        <fa-input-search
          v-model="requestParam.name"
          placeholder="话术"
          class="faUiSearchInput"
          allow-clear
          @search="reloadTable"
        >
          <template #enterButton>
            <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
          </template>
        </fa-input-search>
        <fa-cascader
          size="default"
          placeholder="请选择分组"
          :options="groupTagParentList"
          :field-names="{ value: 'id', label: 'name', children: 'children' }"
          :display-render="({ labels }) => labels.join(' - ')"
          :change-on-select="true"
          @change="handleCascaderChange"
        ></fa-cascader>
        <el-popover popper-class="wx-chat-art-list__opt-popover" placement="bottom" trigger="click">
          <template #reference>
            <global-ts-button type="primary" size="small">批量操作</global-ts-button>
          </template>
          <div>
            <global-ts-button class="opt-btn" type="default" :disabled="checkedIds.length === 0" @click="moveGroup">
              批量移动
            </global-ts-button>
          </div>
          <div>
            <global-ts-button
              class="opt-btn"
              type="default"
              :disabled="checkedIds.length === 0"
              @click="deleteChat(checkedIds)"
            >
              批量删除
            </global-ts-button>
          </div>
        </el-popover>
        <global-ts-button withRedDot="wxChatArt-manageGroup" type="primary" size="small" @click="manageGroup">
          分组管理
        </global-ts-button>
      </div>
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
        :data="chatList"
        @select="changeSelect"
        @select-all="changeSelect"
      >
        <el-table-column type="selection" width="55px" :reserve-selection="true"></el-table-column>
        <el-table-column label="序号" width="50px">
          <template slot-scope="scope">
            {{ (pages.pageNow - 1) * pages.limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="分组" prop="groupName" min-width="150px"></el-table-column>
        <el-table-column label="话术" prop="content" min-width="400px">
          <template slot-scope="scope">
            <div class="content-text">
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="createTimeName" min-width="150px">
          <template #header>
            <global-ts-tool-tips content="按顺序排序或按倒序排序">
              <div class="sortBar" @click="changeSortType">
                <span>进群时间</span>
                <span class="sortArrow">
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanshang"
                    :class="{ isNotActive: requestParam.desc }"
                  ></global-ts-svg-icon>
                  <global-ts-svg-icon
                    class="icon"
                    name="icon-shaixuanxia"
                    :class="{ isNotActive: !requestParam.desc }"
                  ></global-ts-svg-icon>
                </span>
              </div>
            </global-ts-tool-tips>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <span class="text_but1" @click="editChat(scope.row)">编辑</span>
            <span class="text_but1" @click="deleteChat([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        http-config-by-json
        :table-data="chatList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        :request-param="requestParam"
        @getData="changeTable"
      ></global-ts-pagination>
      <ts-batch-import-dialog
        upload-url="/rest/manage/material/batchImportWord"
        dialogTitle="批量导入"
        :upload-data="{ typeGroup: groupType }"
        :download-temp-url="downloadTempUrl"
        :dialog-visible.sync="batchImportDialogVisible"
        @batchImportSuccess="reloadTable"
      ></ts-batch-import-dialog>
      <ts-move-group-dialog
        :group-type="groupType"
        :move-ids="checkedIds"
        :before-move-group-ids="beforeMoveGroupIds"
        :group-tag-list="groupTagList"
        :group-tag-parent-list="groupTagParentList"
        :dialogVisible.sync="moveGroupDialogVisible"
        @moveSuccess="moveSuccess"
      ></ts-move-group-dialog>
      <edit-chat-dialog
        :group-type="groupType"
        :group-tag-parent-list="groupTagParentList"
        :chat-info="chatInfo"
        :dialog-visible.sync="editChatDialogVisible"
        @saveChatSuccess="reloadTable"
      ></edit-chat-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

// assets
import wxChatArtRecommendPng from '@/assets/image/comm/wxWork/wxChatArtRecommend.png';

// components
import TsIntroducePage from '@/components/base/ts-introduce-page/index.vue';
import TsBatchImportDialog from '@/components/base/ts-batch-import-dialog/index.vue';
import TsMoveGroupDialog from '@/components/base/ts-move-group-dialog/index.vue';
import EditChatDialog from './edit-chat-dialog.vue';

// utils
import { getWxWorkConfInfo, downloadTempUrl, gotoWxCorpSet, postLimitVer, confirm } from '@/utils';

// config
import versionDef from '@/config/version-def';
import ManagerDef from '@/config/manager-def';
import { material } from '@/api';

// api

export default {
  name: 'WxChatArtList',
  components: { TsIntroducePage, TsBatchImportDialog, TsMoveGroupDialog, EditChatDialog },
  props: {
    groupType: {
      type: Number,
    },
    groupTagList: {
      type: Array,
      required: true,
      default: () => [],
    },
    groupTagParentList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      isInit: false,
      wxWorkSysConfAvailable: false, // 是否完成企微设置
      wxWorkSysConfAvailableMessageItem: null,
      slideList: [
        {
          key: '我的话术',
          value: 5,
        },
      ],
      requestParam: {
        typeGroup: 5,
        name: '',
        groupId: -1,
        sortKey: 'createTime',
        desc: true,
      },
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      ajaxUrl: '',
      chatList: [],
      checkedIds: [],
      beforeMoveGroupIds: [],
      chatInfo: {},
      downloadTempUrl: '',
      batchImportDialogVisible: false,
      moveGroupDialogVisible: false,
      editChatDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    ...mapGetters({
      isManage: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
    }),
    /*
     * 校验版本
     * [直销：专业版]、[分销：高级/专用/尊享版]可用
     * [需求修改] 七天试用版可用
     * @return {Boolean}
     */
    checkHasVersion() {
      return (
        versionDef.getIsFreeTry() || // 七天试用版
        versionDef.checkVersion(
          this.isOem
            ? versionDef.NotDirectVersionDef.VersionList.MID
            : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL,
        )
      );
    },
    // 是否显示功能模块，当版本与企微设置校验成功后显示
    showContent() {
      return this.checkHasVersion && this.wxWorkSysConfAvailable;
    },
    wxChatArtRecommendPng() {
      return wxChatArtRecommendPng;
    },
  },
  created() {
    this.initPage();
  },
  beforeRouteLeave(to, from, next) {
    // 关闭企微设置提示弹窗
    if (to.name === 'wxCorpApp') {
      this.wxWorkSysConfAvailableMessageItem?.clearFun?.();
    }
    next();
  },
  methods: {
    /**
     * 初始化页面数据
     */
    async initPage() {
      this.isInit = true;
      const wxWorkConfInfo = await getWxWorkConfInfo();
      this.downloadTempUrl = await downloadTempUrl(ManagerDef.DOWNLOAD_TEMP_TYPE.CHAT);
      this.wxWorkSysConfAvailable = !!wxWorkConfInfo?.wxWorkSysConf?.available;
      this.isManage &&
        this.slideList.unshift({
          key: '企业话术', // 管理员权限才有
          value: 1,
        });
      this.isInit = false;
      this.$nextTick(() => {
        this.ajaxUrl = '/rest/manage/material/getTsMaterialList';
      });
    },
    changeTable(data, res, pages) {
      this.chatList = data;
      this.pages = pages;
    },
    reloadTable() {
      this.isReload = true;
      this.$refs.sortTable.clearSelection();
    },
    /**
     * 根据动态组件的渲染，来执行不同操作
     * 这个位置的按钮在顶部，放不了在动态组件中，但是数据都在组件中
     * @author waldon
     * @date 2020/4/10
     * @param {string} type - 点击事件类型
     */
    operateByTemp(type) {
      // 校验版本
      if (!this.checkHasVersion) {
        return postLimitVer('当前版本不可录入话术', 0, 3);
      }
      // 校验企微设置
      if (!this.wxWorkSysConfAvailable) {
        // 不是超级管理员进行提示
        if (!this.isUpperAdm) {
          return this.$utils.postMessage({
            type: 'error',
            message: '暂无权限，请联系超级管理员',
          });
        }
        // 2010/1/2 德钦新需求添加版本控制，这版不上，后续上了在替换
        const wxSettingPath = gotoWxCorpSet(false);
        // 路径为空，没有权限跳转
        if (!wxSettingPath) {
          return false;
        }
        const href = `${location.origin}/#/${wxSettingPath}`;
        this.wxWorkSysConfAvailableMessageItem = this.$utils.postMessage({
          type: 'warning',
          dangerouslyUseHTMLString: true,
          message: `请先完成企微助手设置 , <a href="${href}">去完成</a>`,
        });
        return;
      }
      switch (type) {
        case 'batchImport':
          this.batchImport();
          break;
        case 'singleImport':
          this.editChat();
          break;
      }
    },
    /**
     * 显示批量录入对话框
     * @author waldon
     * @date 2020/4/10
     */
    batchImport() {
      this.batchImportDialogVisible = true;
    },
    editChat(row = {}) {
      this.chatInfo = row;
      this.editChatDialogVisible = true;
    },
    /**
     * 批量删除话术
     * @author waldon
     * @date 2020/4/10
     * @param {Array} ids - 话术id列表
     */
    deleteChat(ids) {
      confirm('是否确认删除选中的话术？').then(async () => {
        const { batchDelTsMaterial } = material;
        const [err, res] = await batchDelTsMaterial({
          ids: JSON.stringify(ids),
          typeGroup: this.groupType,
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '删除成功',
        });
        !err && this.reloadTable();
      });
    },
    /**
     * 滑块改变回调
     * @author waldon
     * @date 2020/4/10
     * @param {Object} e - 滑块节点
     * @param {Number} value - 滑块值
     * */
    async changeSlide(e, value) {
      this.requestParam.typeGroup = value;
      this.$emit('changeGroupType', value);
      this.$emit('getGroupTagList', value);
      this.reloadTable();
    },
    /**
     * 处理级联选择的值改变
     * @author turbo
     * @date 2020/10/21
     */
    handleCascaderChange(value) {
      this.requestParam.groupId = value.length === 1 ? value[0] : -1;
      this.reloadTable();
    },
    /**
     * 移动分组
     * @author waldon
     * @date 2020/4/10
     */
    moveGroup() {
      this.moveGroupDialogVisible = true;
    },
    /**
     * 移动分组成功回调
     * @author waldon
     * @date 2020/4/10
     */
    moveSuccess() {
      this.moveGroupDialogVisible = false;
      this.checkedIds = [];
      this.reloadTable();
    },
    /**
     * 管理分组
     * @author waldon
     * @date 2020/4/10
     */
    manageGroup() {
      this.$emit('toGroupManage');
    },
    /**
     * 改变选中的数据
     * @author waldon
     * @date 2020/4/10
     * @param {Array} selection - 选中的数据
     */
    changeSelect(selection) {
      this.checkedIds = selection.map(item => item.id);
      this.beforeMoveGroupIds = [...new Set(selection.map(item => item.groupId))];
    },
    changeSortType() {
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.wx-chat-art-list {
  .search-box {
    @include flex-left;

    margin: 20px 0;

    > * + * {
      margin-left: 10px;
    }
  }

  .content-text {
    @include line-clamp(3);
  }
}

.opt-btn {
  min-width: auto;
}
</style>

<style lang="scss">
.wx-chat-art-list__opt-popover {
  min-width: auto;
}
</style>

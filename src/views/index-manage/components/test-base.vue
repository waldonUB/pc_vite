<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 16:15:39
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 15:00:50
-->
<template>
  <div class="test-base">
    <aside style="font-size: 24px;" @click="handleFun">
      <strong> 业务组件迁移进度: {{ count }}/45 </strong>
    </aside>

    <h1>Theme</h1>
    <el-button type="primary">EL自定义主题色测试</el-button>
    <fa-button type="primary">FA自定义主题色测试</fa-button>

    <h1 @click="dialogVisible = true">ts-dialog-{{ tsModalSize }}</h1>
    <template v-for="size in ['large', 'medium', 'small', 'smallText']">
      <global-ts-button
        @click="
          () => {
            tsModalSize = size;
            dialogVisible = true;
          }
        "
        :key="size"
        :type="size === tsModalSize ? '' : 'others'"
      >
        {{ size }}
      </global-ts-button>
    </template>
    <global-ts-dialog
      :dialog-visible="dialogVisible"
      :dialog-title="'dialogTitle'"
      :dialog-size="tsModalSize"
      :dialog-width="''"
      :with-title="true"
      :with-footer="true"
      :with-reset-btn="true"
      sure-btn-name="sure"
      cancel-btn-name="cancel"
      reset-btn-name="reset"
      :sureBtnDisabled="false"
      :sure-btn-loading="false"
      :centered="true"
      :mask-closable="false"
      :keyboard="false"
      :z-index="2000"
      wrap-class-name="wrapClassName"
      @sure="
        () => {
          dialogVisible = false;
        }
      "
      @cancel="
        () => {
          dialogVisible = false;
        }
      "
      @reset="
        () => {
          dialogVisible = false;
        }
      "
    >
      <!-- <div slot="title"><span class="mainTitle">高级筛选</span><span class="subDes">（支持模糊筛选）</span></div> -->
      <!-- <div slot="footer">footer</div> -->
      内容
    </global-ts-dialog>

    <h1 @click="activityDialogVisible = true">ts-activity-dialog</h1>
    <ts-activity-dialog :activityDialogVisible.sync="activityDialogVisible"></ts-activity-dialog>

    <h1 @click="multipartImportDialogVisible = true">ts-batch-import-dialog</h1>
    <ts-batch-import-dialog
      :uploadData="uploadData"
      @batchImportSuccess="handleFun"
      uploadUrl="/ajax/upload_h.jsp?cmd=uploadExcelTmpFile"
      :downloadTempUrl="downloadTempUrl"
      :dialogVisible.sync="multipartImportDialogVisible"
    ></ts-batch-import-dialog>

    <h1>ts-gfwtips</h1>
    <ts-gfwtips :isShow.sync="isFirstShow"></ts-gfwtips>

    <h1>ts-img-gfw-tip</h1>
    <ts-img-gfw-tip :gfw-status="1"></ts-img-gfw-tip>

    <h1 @click="orgSelectDialogVisible = true">ts-org-select-dialog</h1>
    <ts-org-select-dialog
      :selectedOrgData="selectedOrgData"
      :defaultExpandKeys.sync="defaultExpandKeys"
      @getSelectedData="getSelectedData"
      :dialogVisible.sync="orgSelectDialogVisible"
    ></ts-org-select-dialog>

    <h1 @click="isShowDialog = true">ts-qr-dialog</h1>
    <ts-qr-dialog desc="立即扫码登录小程序，获取意向客户" :isShowDialog.sync="isShowDialog"></ts-qr-dialog>

    <h1 @click="syncWxCorpCustomerDialogVisible = true">ts-sync-wx-corp-customer-dialog</h1>
    <ts-sync-wx-corp-customer-dialog
      :isSetPwd.sync="isSetPwd"
      :pwd="initPwd"
      @sure="confirmSyncWxCorp"
      @syncWxWorkUserSuccess="syncWxWorkUserSuccess"
      :dialogVisible.sync="syncWxCorpCustomerDialogVisible"
    ></ts-sync-wx-corp-customer-dialog>

    <h1></h1>
    <ts-wxtag>basebasebasebase</ts-wxtag>

    <h1 @click="tagSelectDialogVisible = true">ts-tag-select-dialog</h1>
    <ts-tag-select-dialog
      :selectedTagList="selectedTagList"
      :dialogVisible.sync="tagSelectDialogVisible"
      @getSelectedTag="handleFun"
    ></ts-tag-select-dialog>

    <h1>ts-cropper</h1>
    <ts-cropper
      class="nowUpload"
      accept="*"
      :list="fileList"
      :auto-crop-width="680"
      :auto-crop-height="348"
      :is-batch-add="true"
      :folder-type="2"
      custom-file-name="名片图片"
      @remove="deleteBg"
      @success="uploadBg"
    ></ts-cropper>

    <h1 @click="isShowArticleBubble = true">ts-article-bubble</h1>
    <ts-article-bubble
      :dialogVisible.sync="isShowArticleBubble"
      @cancelbubble="isShowArticleBubble = false"
      @confirmbubble="handleFun"
      :selectId="0"
      :selectArticle="{
        id: 0,
        title: '',
        type: 0,
      }"
    ></ts-article-bubble>

    <h1>ts-cardmodule</h1>
    <ts-cardmodule
      cardtitle="我的个人简介"
      :module-show.sync="showBriefModule"
      editkey="model"
      modulekey="cardBaseName"
      :show-switch="true"
      @changefold="handleFun"
    ></ts-cardmodule>

    <h1 @click="handleBubbleClick" class="classifyManager">
      ts-classify-bubble

      <ts-classify-bubble
        :initForm="{}"
        :isShow.sync="isShowBubble"
        :linkTarget="linkTarget"
        :isFixed="true"
        httpurl="/ajax/article/tsArticleType_h.jsp?cmd=addArticleType"
        @submitSuccess="handleFun"
      ></ts-classify-bubble>
    </h1>

    <h1>ts-classify-manager</h1>
    <ts-classify-manager
      backPageName="视频中心"
      backClassifyName="视频"
      :initClassifyParam="{
        type: '',
      }"
      :initRequestParam="{
        type: '',
      }"
      @changeComponent="handleFun"
    ></ts-classify-manager>

    <h1>ts-clue</h1>
    <ts-clue :isFollow="true" @getNextPage="handleFun" :slideVal="0" :actionList="actionList" :viewerId="0"></ts-clue>

    <h1 @click="previewVisible = true">ts-preview-picture</h1>
    <ts-preview-picture
      :previewVisible.sync="previewVisible"
      previewImgUrl="https://camo.githubusercontent.com/84219530f779a9be5213a92a852af381b5d8bac12ca193b30157831436fe682b/68747470733a2f2f67772e616c6963646e2e636f6d2f7466732f544231636b415443474c37674b306a535a46425858585a5a7058612d3534302d3534302e6a7067"
    >
    </ts-preview-picture>

    <h1>ts-company-list</h1>
    <ts-company-list
      bindClass="selectCompany"
      ref="orgTree"
      :showCheckBox="true"
      :needStaff="true"
      :isWorker="false"
      :selectKeyList="[]"
      :delKeyList="[]"
      :addKeyList="[]"
      :defaultExpandKeys="[]"
      :updateTree.sync="updateTree"
      :onlyStaff="true"
      :check-strictly="false"
      @checkItem="handleFun"
      @handleCheckChange="handleFun"
      @changeSelectList="handleFun"
      @start="handleFun"
    ></ts-company-list>

    <h1>ts-company-all-list</h1>
    <ts-company-all-list
      bindClass="selectCompany"
      :permissions="0"
      ref="orgTree"
      :showCheckBox="true"
      :needStaff="true"
      :isWorker="false"
      :selectKeyList="[]"
      :delKeyList="[]"
      :addKeyList="[]"
      :defaultExpandKeys="[]"
      :updateTree.sync="updateTree"
      :onlyStaff="true"
      :expandOnClickNode="true"
      @checkNode="handleFun"
    ></ts-company-all-list>

    <h1 @click="bigImgOpen = true">ts-bigImg</h1>
    <ts-bigImg :isOpen.sync="bigImgOpen"></ts-bigImg>

    <h1>ts-carousel</h1>
    <ts-carousel height="100px"></ts-carousel>

    <h1 @click="corpInstallDialogVisible = true">ts-corp-install-model</h1>
    <ts-corp-install-model
      from-page="企微设置页"
      :corpInstallDialogVisible.sync="corpInstallDialogVisible"
    ></ts-corp-install-model>

    <h1>ts-corp-top-tip</h1>
    <ts-corp-top-tip from-page="客户列表"></ts-corp-top-tip>

    <h1>ts-filed-input and ts-slicksort-list</h1>
    <ts-slicksort-list
      lockAxis="y"
      v-model="optionList"
      :pressThreshold="10"
      :lockToContainerEdges="true"
      lockOffset="50px"
    >
      <ts-filed-input
        v-for="(item, index) in optionList"
        menusPosition="left"
        :index="index"
        :key="index"
        :item="item"
        :isShowDel="optionList.length > 1"
        :greyDelIcon="false"
        deleteTips="删除选项后，已选中的选项会被一并删除，请谨慎操作"
        @changeName="val => handleChangeName(val, index)"
        @updateOptions="handleFun"
        @changeOptions="handleFun"
      ></ts-filed-input>
    </ts-slicksort-list>

    <h1 @click="tsGfwWarnDialogShow = true">ts-gfw-warn-dialog</h1>
    <tsGfwWarnDialog :dialog-visible.sync="tsGfwWarnDialogShow" :gfw-info-list="[]"></tsGfwWarnDialog>

    <h1>ts-logoparam</h1>
    <ts-logoparam :is-oem="isOem" :jump-address="addressUrl.tsHomeHost" :img-src="logoSrc"></ts-logoparam>

    <h1>ts-question-mark</h1>
    <ts-question-mark></ts-question-mark>

    <h1>ts-search-tree</h1>
    <ts-search-tree
      ref="searchTree"
      bindClass="clubTree"
      :isWorker="false"
      :selectValue.sync="selectValue"
      @select="selectSalers"
    ></ts-search-tree>

    <h1 @click="optionDialogVisible = true">ts-custom-file</h1>
    <ts-custom-file
      @changeSortSuccess="handleFun"
      :initAllFiledList="initAllFiledList"
      :initSelectedList="[]"
      :dialogVisible.sync="optionDialogVisible"
    ></ts-custom-file>

    <h1 @click="groupManagerDialogVisible = true">ts-group-manager-dialog</h1>
    <ts-group-manager-dialog
      :groupTagList="groupTagList"
      :groupTagParentList="groupTagParentList"
      :dialogVisible.sync="groupManagerDialogVisible"
      :groupType="1"
      @updateGroupTagList="handleFun"
    ></ts-group-manager-dialog>

    <h1 @click="showInsertDialog = true">ts-insert-dialog</h1>
    <ts-insert-dialog
      :dialog-visible.sync="showInsertDialog"
      :default-id="1"
      :filter-type-list="[4, 5]"
      @select="handleFun"
      :show-type="2"
    ></ts-insert-dialog>

    <h1 @click="isShowOtherBubble = true">ts-select-other-bubble{{ selectType }}</h1>
    <button @click="handleSelectType">change type</button>
    <ts-select-other-bubble
      :dialogVisible.sync="isShowOtherBubble"
      :selectType="selectType"
      :selectInfo="{
        id: 0,
        title: '',
        type: 0,
      }"
      :isKtuPoster.sync="isKtuPoster"
      :selectId="0"
      @confirmbubble="handleFun"
    ></ts-select-other-bubble>

    <h1 @click="moveGroupDialogVisible = true">ts-move-group-dialog</h1>
    <ts-move-group-dialog
      @moveSuccess="handleFun"
      :beforeMoveGroupIds="[]"
      :moveIds="[]"
      :groupTagList="groupTagList2"
      :groupTagParentList="groupTagList2"
      :dialogVisible.sync="moveGroupDialogVisible"
      :groupType="1"
    ></ts-move-group-dialog>

    <h1 @click="selectDialogVisible = true">ts-select-list-dialog</h1>
    <ts-select-list-dialog
      :dialogVisible.sync="selectDialogVisible"
      dialogTitle="设置所在部门"
      :selectType="2"
      :isNecessary="true"
      :selectedOrgData="singleSelectedOrgData"
      :needUpdate="true"
      :needStaff="false"
      :check-strictly="true"
      @getSelectedData="handleFun"
    ></ts-select-list-dialog>

    <h1>ts-data-info</h1>
    <ts-data-info></ts-data-info>

    <h1>ts-qr-tip</h1>
    <ts-qr-tip
      class="qrTipWrap"
      placement="bottom"
      textOne="扫码打开小程序"
      textTwo="去完成任务"
      bindClass="popover-shareBtn shareTask"
      :width="182"
      trigger="hover"
      :isFromTask="true"
    >
      <span class="tanshu_linkColor">去完成</span>
    </ts-qr-tip>
    <ts-qr-tip
      class="qrTipWrap"
      trigger="click"
      bindClass="popover-shareBtn shareArticle"
      :width="220"
      placement="bottom"
      descTip="微信扫码后，点击右上角分享"
    >
      <span class="tanshu_linkColor text_margin" @click="handleFun">分享</span>
    </ts-qr-tip>

    <h1>ts-select-list</h1>
    <ts-select-list class="floatLeft" :depIdList.sync="depIdList" :sids.sync="sids"></ts-select-list>

    <h1>ts-transfer</h1>
    <ts-transfer
      :source-data="productAllList"
      :target-keys.sync="productIdList"
      :transfer-key="{ key: 'id', title: 'name', description: 'name' }"
      @update="handleFun"
    ></ts-transfer>

    <h1>ts-type-box</h1>
    <ts-type-box
      :showAddBtn="true"
      :initList="[
        {
          id: -1,
          name: '全部',
        },
      ]"
      :typeList="[{ id: 0, name: '未分类' }]"
      @showManage="handleFun"
      @changeClassify="handleFun"
      :selectType="-1"
    ></ts-type-box>

    <h1>ts-two-columns-three-item-by-flex</h1>
    <!-- 公众号提醒 -->
    <ts-two-columns-three-item-by-flex>
      <template v-slot:left>
        left
      </template>
      <template>
        <div class="cardBox-middle__box">
          <h5 class="middle__box_title">公众号提醒</h5>
          <p class="middle__box_des">开启后，有新访客时将通过公众号进行提醒，在【小程序】-【个人中心】绑定后可用</p>
        </div>
      </template>
      <template v-slot:right>
        <div class="cardBox-right__box flex flex-vc">right</div>
      </template>
    </ts-two-columns-three-item-by-flex>

    <h1 @click="handleGetLoginCard">getLoginCard</h1>

    <h1 @click="handleGetGuide">getGuide</h1>

    <h1 @click="handleGetOpenPoup">getOpenPoup</h1>

    <h1 @click="handleVersionChangePopup">versionChangePopup</h1>

    <h1 @click="handleNewVersionMinAppPopup">newVersionMinAppPopup</h1>

    <h1 @click="handleGetPopup">getPopup</h1>

    <h1 @click="handleLoading">loading</h1>

    <h1>ts-ellipsis-tip</h1>
    <ts-ellipsis-tip :outerShellWidth="10" :contentText="'item.otherName'" />

    <h1>ts-filter-list</h1>
    <ts-filter-list />

    <h1>ts-introduce-page</h1>
    <ts-introduce-page />

    <h1>ts-link-edit-dialog</h1>
    <ts-link-edit-dialog />

    <h1>ts-message-list</h1>
    <ts-message-list />
  </div>
</template>

<script>
import { fixImgUrl, postMessage } from '@/utils';

import TsActivityDialog from '@/components/base/ts-activity-dialog/index.vue';
import TsArticleBubble from '@/components/base/ts-article-bubble/index.vue';
import TsBatchImportDialog from '@/components/base/ts-batch-import-dialog/index.vue';
import TsCardmodule from '@/components/base/ts-cardmodule/index.vue';
import TsBigImg from '@/components/base/ts-big-img/index.vue';
import TsCarousel from '@/components/base/ts-carousel/index.vue';
import TsClassifyBubble from '@/components/base/ts-classify-bubble/index.vue';
import TsClassifyManager from '@/components/base/ts-classify-manager/index.vue';
import TsClue from '@/components/base/ts-clue/index.vue';
import TsCompanyAllList from '@/components/base/ts-company-all-list/index.vue';
import TsCompanyList from '@/components/base/ts-company-list/index.vue';
import TsCorpInstallModel from '@/components/base/ts-corp-install-model/index.vue';
import TsCorpTopTip from '@/components/base/ts-corp-top-tip/index.vue';
import TsCropper from '@/components/base/ts-cropper/index.vue';
import TsGfwWarnDialog from '@/components/base/ts-gfw-warn-dialog/index.vue';
import TsGfwtips from '@/components/base/ts-gfwtips/index.vue';
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import TsLogoparam from '@/components/base/ts-logoparam/index.vue';
import TsOrgSelectDialog from '@/components/base/ts-org-select-dialog/index.vue';
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import TsQrDialog from '@/components/base/ts-qr-dialog/index.vue';
import TsQuestionMark from '@/components/base/ts-question-mark/index.vue';
import TsSearchTree from '@/components/base/ts-search-tree/index.vue';
import TsSyncWxCorpCustomerDialog from '@/components/base/ts-sync-wx-corp-customer-dialog/index.vue';
import TsTagSelectDialog from '@/components/base/ts-tag-select-dialog/index.vue';
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import TsCustomFile from '@/components/base/ts-custom-file/index.vue';
import TsSlicksortList from '@/components/base/ts-slicksort-list/index.vue';
import TsFiledInput from '@/components/base/ts-filed-input/index.vue';
import TsGroupManagerDialog from '@/components/base/ts-group-manager-dialog/index.vue';
import TsInsertDialog from '@/components/base/ts-insert-dialog/index.vue';
import TsSelectOtherBubble from '@/components/base/ts-select-other-bubble/index.vue';
import TsMoveGroupDialog from '@/components/base/ts-move-group-dialog/index.vue';
import TsSelectListDialog from '@/components/base/ts-select-list-dialog/index.vue';
import TsDataInfo from '@/components/base/ts-data-info/index.vue';
import TsQrTip from '@/components/base/ts-qr-tip/index.vue';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsTransfer from '@/components/base/ts-transfer/index.vue';
import TsTypeBox from '@/components/base/ts-type-box/index.vue';
import TsTwoColumnsThreeItemByFlex from '@/components/base/ts-two-columns-three-item-by-flex/index.vue';
import TsEllipsisTip from '@/components/base/ts-ellipsis-tip/index.vue';
import TsFilterList from '@/components/base/ts-filter-list/index.vue';
import TsIntroducePage from '@/components/base/ts-introduce-page/index.vue';
import TsLinkEditDialog from '@/components/base/ts-link-edit-dialog/index.vue';
import TsMessageList from '@/components/base/ts-message-list/index.vue';

import { mapState } from 'vuex';
import { Button } from 'element-ui';
import {
  getLoginCard,
  getGuide,
  getOpenPoup,
  versionChangePopup,
  newVersionMinAppPopup,
  getPopup,
  loading,
} from '@/utils';

export default {
  name: 'test-base',
  components: {
    [Button.name]: Button,
    TsActivityDialog,
    TsGfwtips,
    TsBatchImportDialog,
    TsImgGfwTip,
    TsOrgSelectDialog,
    TsQrDialog,
    TsSyncWxCorpCustomerDialog,
    TsTagSelectDialog,
    TsWxtag,
    TsCropper,
    TsArticleBubble,
    TsBigImg,
    TsCardmodule,
    TsCarousel,
    TsClassifyBubble,
    TsClassifyManager,
    TsClue,
    TsPreviewPicture,
    TsCompanyAllList,
    TsCompanyList,
    TsCorpInstallModel,
    TsCorpTopTip,
    TsGfwWarnDialog,
    TsLogoparam,
    TsQuestionMark,
    TsSearchTree,
    TsCustomFile,
    TsSlicksortList,
    TsFiledInput,
    // TsCustomFile,
    TsDataInfo,
    TsGroupManagerDialog,
    TsInsertDialog,
    TsMoveGroupDialog,
    TsQrTip,
    TsSelectListDialog,
    TsSelectOtherBubble,
    TsSelectList,
    TsTransfer,
    TsTwoColumnsThreeItemByFlex,
    TsTypeBox,
    TsEllipsisTip,
    TsFilterList,
    TsIntroducePage,
    TsLinkEditDialog,
    TsMessageList,
  },
  props: {},
  data() {
    return {
      isShowArticleBubble: false, // 是否显示指定文章弹窗
      count: 0,
      activityDialogVisible: false,
      multipartImportDialogVisible: false, // 批量导入弹窗
      uploadData: {
        isClue: true, // 标记是线索池导入
      },
      isFirstShow: true,
      selectedOrgData: {
        // 被选中的部门/员工
        dept: [],
        staff: [],
      },
      defaultExpandKeys: [],
      orgSelectDialogVisible: false, // 组织架构弹窗
      isShowDialog: false, // 是否显示二维码弹窗
      syncWxCorpCustomerDialogVisible: false, // 企微客户同步弹窗
      isSetPwd: false, // 是否设置密码
      initPwd: '', // 初始化的密码
      selectedTagList: [], // 标签集合
      tagSelectDialogVisible: false,
      fileList: [],
      showBriefModule: 'open',
      isShowBubble: false,
      linkTarget: {},
      previewVisible: false,
      updateTree: false,
      bigImgOpen: false,
      actionList: [
        {
          date: '2021-03-09',
          list: [
            {
              id: 413176,
              aid: 9876900,
              sid: 1,
              viewerId: 5,
              dataId: 16,
              dataTitle: '参与活动赢大奖',
              templateId: 0,
              visitTime: 1,
              source: 6,
              type: 600,
              headId: 0,
              createTime: 1615282296000,
              updateTime: 1615282296000,
              flag: 0,
              siteId: 0,
              orderId: 0,
              itemId: 0,
              isImg: false,
              createTimeName: '17:31',
              typeName: '参与活动',
              visitTimeName: '1秒',
              list: [],
            },
            {
              id: 413175,
              aid: 9876900,
              sid: 1,
              viewerId: 5,
              dataId: 16,
              dataTitle: '参与活动赢大奖',
              templateId: 0,
              visitTime: 315,
              source: 6,
              type: 600,
              headId: 0,
              createTime: 1615279700000,
              updateTime: 1615280015000,
              flag: 0,
              siteId: 0,
              orderId: 0,
              itemId: 0,
              isImg: false,
              createTimeName: '16:48',
              typeName: '参与活动',
              visitTimeName: '5分15秒',
              list: [],
            },
          ],
        },
      ],
      corpInstallDialogVisible: false, // 接入弹窗
      tsGfwWarnDialogShow: false,
      selectValue: '',
      optionDialogVisible: false,
      initAllFiledList: [
        { field: 'name', name: '商品名称', width: 300, isShow: true, defaultSort: 1 },
        { field: 'price', name: '价格', width: 100, isShow: true, defaultSort: 2 },
        { field: 'sourceName', name: '来源', width: 100, isShow: true, defaultSort: 3 },
        { field: 'clickViewersName', name: '浏览人数', width: 100, isShow: true, defaultSort: 4 },
        { field: 'selfStatus', name: '上架状态', width: 100, isShow: true, defaultSort: 5 },
        { field: 'pubStatus', name: '发布状态', width: 100, isShow: true, defaultSort: 6 },
      ],
      optionList: [
        { name: '123', typeText: '选项一' },
        { name: '', typeText: '选项二' },
        { name: '', typeText: '选项三' },
        { name: '', typeText: '选项四' },
      ],
      groupTagList2: [
        {
          id: 12537,
          type: 1,
          name: 'gkh',
          parentId: 12536,
          sort: 4,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          sid: 0,
          del: 0,
          deler: 0,
          type2: 0,
          flag: 0,
          isSystem: false,
          isDir: true,
          noShowUp: true,
          noShowDown: true,
        },
        {
          id: 12535,
          type: 1,
          name: '2',
          parentId: 0,
          sort: 3,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          sid: 0,
          del: 0,
          deler: 0,
          type2: 0,
          flag: 0,
          isSystem: false,
          isDir: true,
          noShowUp: true,
        },
        {
          id: 12536,
          type: 1,
          name: 'gkd',
          parentId: 0,
          sort: 2,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          sid: 0,
          del: 0,
          deler: 0,
          type2: 0,
          flag: 0,
          isSystem: false,
          isDir: true,
          children: [
            {
              id: 12537,
              type: 1,
              name: 'gkh',
              parentId: 12536,
              sort: 4,
              createTime: 1611802236000,
              updateTime: 1611802236000,
              sid: 0,
              del: 0,
              deler: 0,
              type2: 0,
              flag: 0,
              isSystem: false,
              isDir: true,
              noShowUp: true,
              noShowDown: true,
            },
          ],
        },
        {
          id: 12534,
          type: 1,
          name: '11111',
          parentId: 0,
          sort: 1,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          sid: 0,
          del: 0,
          deler: 0,
          type2: 0,
          flag: 0,
          isSystem: false,
          isDir: true,
          noShowDown: true,
        },
      ],
      groupManagerDialogVisible: false,
      groupTagParentList: [
        {
          id: 12534,
          sid: 0,
          name: '11111',
          parentId: 0,
          sort: 1,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
        },
        {
          id: 12535,
          sid: 0,
          name: '2',
          parentId: 0,
          sort: 2,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
        },
        {
          id: 12536,
          sid: 0,
          name: 'gkd',
          parentId: 0,
          sort: 3,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
          children: [
            {
              id: 12537,
              sid: 0,
              name: 'gkh',
              parentId: 12536,
              sort: 4,
              createTime: 1611802236000,
              updateTime: 1611802236000,
              isSystem: false,
              isDir: true,
            },
          ],
        },
      ],
      groupTagList: [
        {
          id: 12534,
          sid: 0,
          name: '11111',
          parentId: 0,
          sort: 1,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
        },
        {
          id: 12535,
          sid: 0,
          name: '2',
          parentId: 0,
          sort: 2,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
        },
        {
          id: 12536,
          sid: 0,
          name: 'gkd',
          parentId: 0,
          sort: 3,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
          children: [
            {
              id: 12537,
              sid: 0,
              name: 'gkh',
              parentId: 12536,
              sort: 4,
              createTime: 1611802236000,
              updateTime: 1611802236000,
              isSystem: false,
              isDir: true,
            },
          ],
        },
        {
          id: 12537,
          sid: 0,
          name: 'gkh',
          parentId: 12536,
          sort: 4,
          createTime: 1611802236000,
          updateTime: 1611802236000,
          isSystem: false,
          isDir: true,
        },
      ],
      showInsertDialog: false,
      isShowOtherBubble: false,
      isKtuPoster: false,
      selectType: 4,
      moveGroupDialogVisible: false,
      selectDialogVisible: false,
      singleSelectedOrgData: {
        // 单选设置部门
        dept: [], // 已选择的部门信息
        staff: [], // 已选择的成员信息
      },
      depIdList: '[]',
      sids: '[]',
      productAllList: [
        {
          id: 9,
          mallSiteId: -1,
          mallProductId: 0,
          name: '草莓2号',
          price: '面议',
          selfStatus: 0,
          summary: '草莓2号草莓2号',
          coverImgId: 'AJABCAAQAhgAIPyyioMGKLS8juUHMBA4EA',
          updateTime: 1617159624000,
          del: 0,
          type: 1,
          picIdList: '["AJABCAAQAhgAIPyyioMGKLS8juUHMBA4EA"]',
          coverType: 0,
          clicks: 1,
          sid: 0,
          priceType: 1,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 1,
          mallAppRelease: false,
          coverUrl: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIPyyioMGKLS8juUHMBA4EA.jpg',
          productImgsCount: 1,
          isShowCover: true,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=9&jumpType=1&sid=1',
          isRel: false,
          realCover: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIPyyioMGKLS8juUHMBA4EA.jpg',
          clicksName: '1',
          clickViewersName: '1',
          key: '9',
          title: '草莓2号',
          description: '草莓2号',
        },
        {
          id: 8,
          mallSiteId: -1,
          mallProductId: 0,
          name: '草莓',
          price: '11.00',
          selfStatus: 0,
          summary: '草莓草莓草莓',
          coverImgId: 'AJABCAAQAhgAIP6di4MGKJDNgOcBMBA4EA',
          updateTime: 1617108838000,
          del: 0,
          type: 1,
          picIdList: '["AJABCAAQAhgAIP6di4MGKJDNgOcBMBA4EA"]',
          coverType: 0,
          clicks: 0,
          sid: 0,
          priceType: 0,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 0,
          mallAppRelease: false,
          coverUrl: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIP6di4MGKJDNgOcBMBA4EA.jpg',
          productImgsCount: 1,
          isShowCover: true,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=8&jumpType=1&sid=1',
          isRel: false,
          realCover: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIP6di4MGKJDNgOcBMBA4EA.jpg',
          clicksName: '0',
          clickViewersName: '0',
          key: '8',
          title: '草莓',
          description: '草莓',
        },
        {
          id: 7,
          mallSiteId: -1,
          mallProductId: 0,
          name: '001',
          price: '面议',
          selfStatus: 0,
          summary: '',
          coverImgId: '',
          updateTime: 1617159634000,
          del: 0,
          type: 1,
          picIdList: '["AJABCAAQAhgAIJPytP8FKJWX144B","AJABCAAQAhgAIJHytP8FKIrJlK8E"]',
          coverType: 0,
          clicks: 1,
          sid: 0,
          priceType: 1,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 1,
          mallAppRelease: false,
          coverUrl: '//st.aaadns.com/image/comm/no-pic.jpg?v=202006011512',
          productImgsCount: 2,
          isShowCover: false,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=7&jumpType=1&sid=1',
          isRel: false,
          realCover: '//st.aaadns.com/image/comm/no-pic.jpg?v=202006011512',
          clicksName: '1',
          clickViewersName: '1',
          key: '7',
          title: '001',
          description: '001',
        },
        {
          id: 6,
          mallSiteId: -1,
          mallProductId: 0,
          name: '34',
          price: '面议',
          selfStatus: 0,
          summary: '343',
          coverImgId: 'AJABCAAQAhgAIITq--8FKI35ptsF',
          updateTime: 1613810656000,
          del: 0,
          type: 1,
          picIdList:
            '["AJABCAAQAhgAIITq--8FKI35ptsF","AJABCAAQBBgAIOrGwYEGKK2Y_O4G","AJABCAAQAhgAIObdwYEGKLiM5J0H","AJABCAAQAhgAIObdwYEGKLiM5J0H"]',
          coverType: 0,
          clicks: 0,
          sid: 0,
          priceType: 1,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 0,
          mallAppRelease: false,
          coverUrl: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIITq--8FKI35ptsF.jpg',
          productImgsCount: 4,
          isShowCover: true,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=6&jumpType=1&sid=1',
          isRel: false,
          realCover: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIITq--8FKI35ptsF.jpg',
          clicksName: '0',
          clickViewersName: '0',
          key: '6',
          title: '34',
          description: '34',
        },
        {
          id: 5,
          mallSiteId: -1,
          mallProductId: 0,
          name: '23324',
          price: '面议',
          selfStatus: 0,
          summary: '42342',
          coverImgId: 'AJABCAAQAhgAIPjL0f8FKK7hls0F',
          updateTime: 1617692635000,
          del: 0,
          type: 1,
          picIdList:
            '["AJABCAAQAhgAIPjL0f8FKK7hls0F","AJABCAAQAhgAINnW--8FKMiUjd8G","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIPryxIAGKICA9ocG","AJABCAAQAhgAIPryxIAGKICA9ocG","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIPryxIAGKICA9ocG","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c","AJABCAAQAhgAIKj3xIAGKLWr63c"]',
          coverType: 0,
          clicks: 1,
          sid: 0,
          priceType: 1,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 1,
          mallAppRelease: false,
          coverUrl: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIPjL0f8FKK7hls0F.jpg',
          productImgsCount: 15,
          isShowCover: true,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=5&jumpType=1&sid=1',
          isRel: false,
          realCover: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIPjL0f8FKK7hls0F.jpg',
          clicksName: '1',
          clickViewersName: '1',
          key: '5',
          title: '23324',
          description: '23324',
        },
        {
          id: 4,
          mallSiteId: -1,
          mallProductId: 0,
          name: '1111111111',
          price: '面议',
          selfStatus: 0,
          summary: '11111111111111111111',
          coverImgId: 'AJABCAAQAhgAIKj3xIAGKLWr63c',
          updateTime: 1612762745000,
          del: 0,
          type: 1,
          picIdList: '["AJABCAAQAhgAIKj3xIAGKLWr63c"]',
          coverType: 0,
          clicks: 0,
          sid: 0,
          priceType: 1,
          isGfwClose: 0,
          gfwReasonId: 0,
          clickViewers: 0,
          mallAppRelease: false,
          coverUrl: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIKj3xIAGKLWr63c.jpg',
          productImgsCount: 1,
          isShowCover: true,
          mallEditPdUrl: '',
          sourceName: '系统录入',
          gfwStatusReasion: '',
          statusName: '正常',
          visitUrl: '/h5RedirectPage.jsp?productId=4&jumpType=1&sid=1',
          isRel: false,
          realCover: '//9889713.s144i.aaadns.com/2/AJABCAAQAhgAIKj3xIAGKLWr63c.jpg',
          clicksName: '0',
          clickViewersName: '0',
          key: '4',
          title: '1111111111',
          description: '1111111111',
        },
      ],
      productIdList: [],
      dialogVisible: false,
      tsModalSize: 'large',
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      addressUrl: state => state.globalData.addressUrl,
      logoSrc: state => state.globalData.logoSrc,
    }),
    downloadTempUrl() {
      return `${this.$store.state.globalData?.resRoot}/doc/线索批量导入模板.xlsx`;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.count = document.querySelectorAll('h1').length;
  },
  methods: {
    handleGetPopup() {
      // getPopup('articleLibrary');
      // getPopup('dataCenter', 7);
      getPopup('createArticle', 3);
    },
    handleNewVersionMinAppPopup() {
      newVersionMinAppPopup();
    },
    handleVersionChangePopup() {
      versionChangePopup();
    },
    handleGetOpenPoup() {
      getOpenPoup();
    },
    handleLoading() {
      loading.addQuene(
        {
          key: 'ADITEST',
          loadingType: 'ADITEST',
        },
        '上传中...',
      );
      setTimeout(() => {
        loading.poupQuene('ADITEST');
      }, 2000);
    },
    handleGetGuide() {
      getGuide();
      getGuide();
      getGuide();
    },
    handleGetLoginCard() {
      getLoginCard();
      getLoginCard();
      getLoginCard();
    },
    handleFun(res) {
      console.log('res', res);
    },
    getSelectedData(selectedData) {
      this.selectedOrgData = selectedData;
    },
    syncWxWorkUserSuccess() {
      this.isSetPwd = false;
    },
    confirmSyncWxCorp() {
      this.setPwdDialogVisible = true;
    },
    deleteBg() {
      this.fileList = [];
    },
    uploadBg(res, file) {
      console.log('res', res);
      if (res && res.fullViewUrl) {
        this.fileList = [{ url: fixImgUrl(res.fullViewUrl), name: 'fixImgUrl(res.fullViewUrl)' }];
      } else {
        postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
      }
    },
    handleBubbleClick(e) {
      this.linkTarget = {
        target: e.target,
        position: 'left,top',
      };
      this.isShowBubble = true;
    },
    selectSalers(value) {
      // this.selectedSid = value.sid;
      console.log('value', value);
      // this.selectValue = value.name;
    },
    handleChangeName(val, index) {
      const newItem = this.optionList[index] ? { ...this.optionList[index] } : {};
      newItem.name = val;
      this.$set(this.optionList, index, newItem);
    },
    handleSelectType() {
      const createRandowNumFun = (min, max) => parseInt(Math.random() * (max - min + 1) + min);
      this.selectType = createRandowNumFun(2, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  position: relative;
  &::before {
    position: absolute;
    left: -20px;
    font-size: 24px;
    color: rgb(15, 211, 48);
    content: '#';
  }
}
.test-base {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 40px;
  background: white;
  box-sizing: border-box;
}
</style>

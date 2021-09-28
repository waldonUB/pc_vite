<!--
 * @Author: ADI
 * @Date: 2021-03-23 16:15:05
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 15:49:39
-->
<template>
  <div class="test">
    <aside style="font-size: 24px;">
      <strong> 公用组件迁移进度: {{ count }}/55 </strong>
    </aside>

    <h1>test-button</h1>
    <test-button></test-button>

    <h1>ts-company-all-list</h1>
    <ts-company-all-list></ts-company-all-list>

    <h1>loading</h1>
    <global-ts-button @click="handleShowLoading">show</global-ts-button>

    <h1>ts-fai-img-upload</h1>
    <global-ts-fai-img-upload
      name="filedata"
      class="materialUploadBox"
      :fileList="[]"
      :isBatchAdd="true"
      :folderType="videoFolderType"
      size="large"
      @uploadcomplete="uploadSuccess"
      @remove="removeMaterial"
    ></global-ts-fai-img-upload>

    <h1>ts-fai-img-upload-style-box</h1>
    <global-ts-fai-img-upload-style-box
      :file-list="[]"
      id="materialUploadBox"
      size="medium"
      @upload-click="uploadSuccess"
      @remove="removeMaterial"
    ></global-ts-fai-img-upload-style-box>

    <h1>ts-fai-pagination</h1>
    <global-ts-fai-pagination
      class="paginationBox"
      @changePage="() => {}"
      :withMargin="false"
      :showSizeChanger="false"
      :pageOption.sync="pages"
    ></global-ts-fai-pagination>

    <h1 @click="faDialogVisible = true">ts-fai-modal</h1>
    <global-ts-fai-modal
      wrapClassName="setParamDialog"
      dialogTitle="dialogTitle"
      :dialogVisible.sync="faDialogVisible"
      @handleCancel="handleClick"
      @handleOk="handleClick"
    ></global-ts-fai-modal>

    <h1>ts-dropdown-btn</h1>
    <global-ts-dropdown-btn>ts-dropdown-btn</global-ts-dropdown-btn>

    <h1>ts-morebtn</h1>
    <global-ts-morebtn></global-ts-morebtn>

    <h1>ts-dropdown</h1>
    <global-ts-dropdown :downData="downData" @handleClick="downItemClick">
      <template v-slot:link>
        <global-ts-button class="pro_header_addEm" type="primary" size="small" icon="icon-icon-11">
          添加文章
        </global-ts-button>
      </template>
    </global-ts-dropdown>

    <h1>ts-logoparam</h1>
    <ts-logoparam></ts-logoparam>

    <h1>ts-question-mark</h1>
    <ts-question-mark> </ts-question-mark>

    <h1 @click="bigImgOpen = true">ts-bigImg</h1>
    <ts-bigImg :isOpen.sync="bigImgOpen"></ts-bigImg>

    <h1>ts-nodata</h1>
    <global-ts-nodata>暂无数据</global-ts-nodata>

    <h1>ts-search-tree</h1>
    <ts-search-tree
      ref="searchTree"
      bindClass="clubTree"
      :isWorker="false"
      :selectValue.sync="selectValue"
      @select="selectSalers"
    ></ts-search-tree>

    <h1 @click="tsGfwWarnDialogShow = true">ts-gfw-warn-dialog</h1>
    <tsGfwWarnDialog :dialog-visible.sync="tsGfwWarnDialogShow" :gfw-info-list="[]"></tsGfwWarnDialog>

    <h1>ts-version-warning</h1>
    <global-ts-version-warning></global-ts-version-warning>

    <h1>ts-phoneiframe</h1>
    <!-- <global-ts-phoneiframe :showFrame="false">
      <span #header class="formTitle ellispsis">我的海报</span>
      <div slot="content">
        content
      </div>
    </global-ts-phoneiframe> -->

    <h1>ts-version-tip</h1>
    <global-ts-version-tip></global-ts-version-tip>

    <h1>ts-carousel</h1>
    <ts-carousel height="100px"></ts-carousel>

    <h1>ts-point-upload</h1>
    <global-ts-point-upload
      class="materialTextUploadBox flexItem"
      :multiple="true"
      :isShowFileList="true"
      :isShowLoading="true"
      accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
      :limitSize="10"
      sizeCheckTip="请上传10m以内的图片"
      :beforeUpload="() => {}"
      @breakUpload="breakUpload"
      @uploadError="uploadError"
    >
      <global-ts-button class="uploadBtn" size="small">上传文件</global-ts-button>
    </global-ts-point-upload>

    <h1 @click="showWxDialog = true">ts-wx-work-dialog</h1>
    <!-- ['large', 'medium', 'small'] -->
    <global-ts-wx-work-dialog
      dialogSize="large"
      dialogTitle="title"
      :ts-dialog-visible="showWxDialog"
      @sure="handleWxDialogSure"
      @cancel="handleWxDialogCancel"
    >
      content
    </global-ts-wx-work-dialog>

    <h1>ts-textImg</h1>
    <global-ts-text-img imgText="ADI" imgUrl="" sexColor="#ccc"></global-ts-text-img>

    <h1>ts-date-picker</h1>
    <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"></global-ts-date-picker>

    <h1>ts-search-select</h1>
    <global-ts-search-select
      :selectkey="{ label: 'name', value: 'sid' }"
      :list="[
        {
          key: '全部来源',
          value: 0,
        },
        {
          key: '文章',
          value: 1,
        },
        {
          key: '名片',
          value: 2,
        },
        {
          key: '海报',
          value: 3,
        },
        {
          key: '表单',
          value: 5,
        },
      ]"
      selectVal="selectVal"
    >
    </global-ts-search-select>

    <h1>ts-warn-tips</h1>
    <template v-for="size in ['middle', 'small']">
      <global-ts-warn-tips :size="size" :key="'tips' + size">
        <p class="warnTipsContent" slot="content">
          {{ size }} // 请勿导入包含虚假营销、政治敏感等违规内容的文章
          <a href="" target="_blank">查看详情</a>
        </p>
      </global-ts-warn-tips>
    </template>

    <h1>ts-tip</h1>
    <global-ts-tip :showVersionTip="true" bindClass="versionTip">
      <template class="versionTip" slot="content">
        <span class="restDay"> 付费功能体验倒计时: {{ 1 }}天{{ 1 }}小时 </span>
        <span class="remind">
          （到期将自动失效）
        </span>
        <a class="updateBtn" target="_blank" href="">立即升级</a>
      </template>
    </global-ts-tip>

    <h1>ts-icon-ver</h1>
    <global-ts-icon-ver></global-ts-icon-ver>

    <h1>ts-version</h1>
    <global-ts-version :hideHoverText="false"></global-ts-version>

    <h1>ts-versionfunctip</h1>
    <global-ts-versionfunctip funcText="当前版本无法查看完整信息"></global-ts-versionfunctip>

    <h1>ts-versionicon</h1>
    <global-ts-versionicon></global-ts-versionicon>

    <h1>ts-buttontips</h1>
    <global-ts-buttontips>
      <global-ts-button slot="button" type="primary" @click="handleClick('buttontips')">佣金申请 </global-ts-button>
      <span slot="buttonTips">剩余可申请佣金不超过 0 元将无法提交申请</span>
    </global-ts-buttontips>

    <h1 @click="isShowDialog = true">ts-el-dialog</h1>
    <global-ts-el-dialog class="linkBox" width="522px" :isShowDialog.sync="isShowDialog" title="ts-el-dialog">
      <div slot="title">title slot</div>
      <div>content</div>
      <div slot="footer">footer slot</div>
    </global-ts-el-dialog>

    <h1>tool-tips</h1>
    <global-ts-tool-tips effect="dark" content="content" placement="bottom-start">
      <div>default slot</div>
      <div slot="content">content slot</div>
    </global-ts-tool-tips>

    <h1>ts-slide</h1>
    <global-ts-slide
      :slidArray="[
        {
          key: '文章浏览记录',
          value: 1,
        },
        {
          key: '文章转发记录',
          value: 2,
        },
        {
          key: '表单提交记录',
          value: 3,
        },
      ]"
      :changeKey="{
        value: 'value',
        key: 'key',
      }"
    ></global-ts-slide>

    <h1>ts-card-box</h1>
    <global-ts-card-box>
      <div slot="card-box-bg">card-box-bg</div>
      <div slot="card-box-head">card-box-head</div>
      <div slot="card-box-body">card-box-body</div>
      <div slot="card-box-bottom">card-box-bottom</div>
    </global-ts-card-box>

    <h1>ts-tabguide</h1>
    <global-ts-tabguide>
      <div slot="leftPart">leftPart</div>
      <div slot="rightPart">rightPart</div>
    </global-ts-tabguide>

    <h1>ts-header</h1>
    <global-ts-header>
      <div slot="leftPart">leftPart</div>
      <div slot="rightPart">rightPart</div>
    </global-ts-header>

    <h1>button</h1>
    <template v-for="size in ['medium', 'small', 'mini']">
      <template
        v-for="type in ['primary', 'others', 'default', 'black', 'textGreen', 'mainText', 'warnText', 'greyText']"
      >
        <global-ts-button
          class="jumpPage"
          :type="type"
          :size="size"
          @click="handleClick(size + type)"
          :key="size + type"
        >
          <span class="prePage"> {{ size }} -- {{ type }} </span>
        </global-ts-button>
      </template>
      <template
        v-for="type in ['primary', 'others', 'default', 'black', 'textGreen', 'mainText', 'warnText', 'greyText']"
      >
        <global-ts-button
          class="jumpPage"
          :type="type"
          :size="size"
          @click="handleClick(size + type)"
          :key="size + type + 'disabled'"
          disabled
        >
          <span class="prePage"> {{ size }} -- {{ type }} -- disabled </span>
        </global-ts-button>
      </template>
      <div style="height: 1em;" :key="size" />
    </template>

    <h1 @click="bubbleShow = true">bubble</h1>
    <div style="position: relative;">
      <global-ts-bubble class="messageBox" :isShow.sync="bubbleShow" :isFixed="false">
        <template v-slot:boxContent>
          <div class="radioBox"></div>
          <div class="tipsText">修改后将会改变分佣状态</div>
        </template>
      </global-ts-bubble>
    </div>

    <h1>pagination</h1>
    <global-ts-pagination
      ref="formPagination"
      :tableData="taskResponsibility.formTableList"
      :requestParam="taskResponsibility.requestParam"
      :isReload.sync="taskResponsibility.isReload"
      @getData="changeTable"
      @sendPageInfo="sendPageInfo"
      :httpurl="taskResponsibility.httpurl"
    ></global-ts-pagination>

    <h1>input</h1>
    <template v-for="type in ['password', 'text']">
      <global-ts-input :type="type" :key="type" :value="type"></global-ts-input>
    </template>

    <h1>select</h1>
    <global-ts-select
      type="large"
      class="moreFilterInput"
      v-model="selectType"
      placeholder="全部类型"
      :selectkey="{ label: 'name', value: 'id' }"
      @change="handleChange"
      :list="[
        { name: '周日', id: 7 },
        { name: '周一', id: 1 },
        { name: '周二', id: 2 },
        { name: '周三', id: 3 },
        { name: '周四', id: 4 },
        { name: '周五', id: 5 },
        { name: '周六', id: 6 },
      ]"
    ></global-ts-select>

    <h1>ts-fai-input-search</h1>
    <global-ts-fai-input-search />

    <h1>ts-select-click</h1>
    <global-ts-select-click />
  </div>
</template>

<script>
import { loading } from '@/utils';
import TsCarousel from '@/components/base/ts-carousel/index.vue';
import TsGfwWarnDialog from '@/components/base/ts-gfw-warn-dialog/index.vue';
import TsSearchTree from '@/components/base/ts-search-tree/index.vue';
import TsBigImg from '@/components/base/ts-big-img/index.vue';
import TsQuestionMark from '@/components/base/ts-question-mark/index.vue';
import TsLogoparam from '@/components/base/ts-logoparam/index.vue';
import TsCompanyAllList from '@/components/base/ts-company-all-list/index.vue';
import TsCommDef from '@/config/ts-comm-def';
import TestButton from './test-button.vue';
import { getGfwInto } from '@/api/modules/utils/gfw';

export default {
  name: 'test',
  components: {
    TsCarousel,
    TsGfwWarnDialog,
    TsSearchTree,
    TsBigImg,
    TsQuestionMark,
    TsLogoparam,
    TsCompanyAllList,
    TestButton,
  },
  data() {
    return {
      count: 0,
      selectType: '',
      taskResponsibility: {
        isReload: false,
        formTableList: [],
        httpurl: '/ajax/marketingTask/tsMarketingDetails_h.jsp?cmd=getTsMarketingDetailsListById', // 请求路径
        requestParam: {
          sid: -1,
          sidListStr: '[]', // 多名员工
          depIdList: '', // 部门
          title: '', // 任务名称
          startTimeStr: '', // 开始时间
          endTimeStr: '', // 结束时间
          status: 0,
          isGetAll: false, // 是否
          taskType: -1, //任务类型
        },
      },
      bubbleShow: false,
      isShowDialog: false,
      showWxDialog: false,
      fileAcceptCal: [
        // 文件上传类型限制
        '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx',
        '.mp4',
        '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      ],
      fileLimitSize: [200, 500, 10], // 文件大小限制
      fileSizeCheckTip: ['请上传200M以内的文档', '请上传500M以内的视频', '请上传10m以内的图片'],
      requestParam: {
        // 保存接口请求数据
        // isCorp: false, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
        groupId: 0, // 选中文件夹id,默认为"企业文件根目录"
        content: '', // 文件列表
      },
      tsGfwWarnDialogShow: false,
      selectValue: '',
      bigImgOpen: false,
      downData: [
        {
          type: 'createArticle',
          name: '自己写文章',
        },
        {
          type: 'transformArticle',
          name: '转载文章',
        },
      ],
      faDialogVisible: false,
      pages: {
        pageNow: 1,
        limit: 24,
        // limit: 2,
        maxPage: 1,
        total: 0,
      },
      videoFolderType: TsCommDef.FolderType.PERSON_SYS_VIDEO,
      uploadSuccessFileList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.testGfw();
  },
  mounted() {
    this.count = document.querySelectorAll('h1').length;
  },
  methods: {
    async testGfw() {
      const [err, res] = await getGfwInto();
      console.log('err,res', err, res);
    },
    handleClick(data) {
      this.faDialogVisible = false;
      console.log('data', data);
    },
    handleChange(data) {
      console.log('data', data);
    },
    changeTable(data, all) {
      this.taskResponsibility.formTableList = data.list;
      console.log('data,all', data, all);
    },
    sendPageInfo(obj) {
      console.log('obj', obj);
    },
    getSearchTime(data) {
      console.log('data', data);
    },
    wxDialogCancel(data) {
      console.log('data', data);
    },
    wxDialogSure(data) {
      console.log('data', data);
    },
    handleWxDialogSure(val) {
      this.showWxDialog = false;
    },
    handleWxDialogCancel(val) {
      this.showWxDialog = val;
    },
    breakUpload(data) {
      console.log('breakUpload', data);
    },
    uploadError(error) {
      console.log('uploadError', error);
    },
    selectSalers(value) {
      this.selectedSid = value.sid;
      this.selectValue = value.name;
    },
    downItemClick(downItem) {
      console.log('downItem', downItem);
    },
    uploadSuccess(res) {
      console.log(res, '上传成功');
    },
    removeMaterial(removeMaterial) {
      console.log('removeMaterial', removeMaterial);
    },
    handleShowLoading() {
      console.log('loading', loading);
      loading.addQuene({
        key: 'adi',
        loadingType: 'adi',
      });
      setTimeout(() => loading.poupQuene('adi'), 2000);
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
.test {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 40px;
  background: white;
  box-sizing: border-box;
}
</style>

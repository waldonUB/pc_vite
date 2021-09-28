<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 17:03:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 13:59:45
-->
<template>
  <global-ts-dialog
    wrap-class-name="fileUploadSelect"
    :dialog-title="'添加' + acceptTypeName"
    dialog-size="large"
    :dialog-visible.sync="innerDialogVisible"
    :submit-btn-disabled="submitBtnDisabled"
    :lock-dialog-body-height="false"
    @cancel="handleCancel"
    @sure="handleOk"
  >
    <div class="dialogContent">
      <!-- Menu -->
      <div class="leftPart">
        <fa-menu mode="vertical" v-model="sliderConfig.menu" theme="mixed">
          <fa-menu-item @click="handleTitleClick" v-for="item of sliderConfig.list" :key="item.typeGroup">
            {{ item.key }}
          </fa-menu-item>
        </fa-menu>
      </div>
      <div class="splitBox"></div>
      <!-- Content -->
      <div class="mainBox">
        <!-- 操作栏 -->
        <div class="headerLine">
          <fa-input-search
            v-model="requestParam.name"
            placeholder="文件名称"
            :allowClear="true"
            @keyup.enter.native="reloadDataList"
            @search="reloadDataList"
            class="headerLine__search faUiSearchInput"
          >
            <fa-button slot="enterButton" class="headerLine__search-button">
              <global-ts-svg-icon class="icon headerLine__search-icon" name="icon-sousuo1616" />
            </fa-button>
          </fa-input-search>

          <!-- 上传 -->
          <global-ts-point-upload
            v-show="showUpload"
            class="materialTextUploadBox flexItem headerLine__upload"
            :multiple="true"
            :isShowFileList="false"
            :isShowLoading="false"
            :accept="getFileLimitConfig('fileAcceptCalMap')"
            :limitSize="getFileLimitConfig('fileLimitSizeMap')"
            :sizeCheckTip="getFileLimitConfig('fileSizeCheckTipMap')"
            @beforeUpload="file => beforeUpload(file, CategoryDef)"
            @uploadProgress="uploadProgress"
            @breakupload="breakUpload"
            @uploadError="uploadError"
          >
            <global-ts-button class="uploadBtn" size="small">上传{{ acceptTypeName }}</global-ts-button>
          </global-ts-point-upload>
        </div>
        <!-- 面包屑 -->
        <div class="fileUploadBreadcrumbWrapper">
          <div v-if="filePath.length === 1 || isSearchStatus" class="currentFilePath">
            {{ homePathName }}
          </div>
          <div v-else class="flex flex-vc fubBreadcrumbBox">
            <div
              v-for="(item, index) in filePath"
              :key="index"
              :class="['flex', 'flex-vc', 'fubBreadcrumbBoxItem', { finalBox: index === filePath.length - 1 }]"
              @click="goBackFile(item, index)"
            >
              <div :class="[index === filePath.length - 1 ? 'currentFilePath' : 'filePath', 'tanshu-ellipsis']">
                {{ item.name }}
              </div>
              <global-ts-svg-icon class="filePathIcon" name="icon-xiangyou1616" v-if="index < filePath.length - 1" />
            </div>
          </div>
        </div>
        <!-- 文件列表 -->
        <div class="fileList" v-loading="fileListLoading" v-if="fileList.length">
          <div v-for="(item, index) in fileList" class="itemBox" :key="index">
            <div
              v-if="item.success"
              class="imgBox"
              :class="[
                { checkImgBox: checkConfig.info[requestParam.typeGroup].includes(item.id) },
                { boxPointer: item.isDir },
              ]"
            >
              <div @click="gotoChildFile(item)">
                <el-checkbox
                  v-if="useCheckbox(item)"
                  :disabled="checkboxDisabled(item)"
                  :value="checkConfig.info[requestParam.typeGroup].includes(item.id)"
                  :class="['itemCheckBox', { checkIn: checkConfig.info[requestParam.typeGroup].includes(item.id) }]"
                  @change="flag => checkItem(flag, item, index)"
                >
                  <img class="itemImg" :src="getIcon(item)" />
                </el-checkbox>
                <img class="itemImg" :src="getIcon(item)" v-else />
              </div>
              <!-- 文件审查 -->
              <global-ts-tool-tips v-if="[1, 2, 3].includes(item.gfwStatus)" popperClass="wxPersonGfwTipsBox">
                <div slot="content">
                  {{ item.gfwStatus === 1 ? '当前正在审查中，审核通过后将重新开启' : item.gfwStatusReason }}
                </div>
                <div class="gfwBox">
                  {{ item.gfwStatus === 1 ? '审查中' : '已封禁' }}
                  <global-ts-svg-icon class="icon helpIcon" name="icon-bianzu" @click="toHelpCenter" />
                </div>
              </global-ts-tool-tips>
            </div>
            <div v-else-if="item.fail" class="uploadImgWrapper">
              <img class="fileImg" :src="iconErrIMG" />
            </div>
            <div v-else class="uploadImgWrapper">
              <div class="uploadImgBox">
                <div class="uploadText">{{ acceptTypeName }}上传中</div>
                <fa-progress
                  class="progressBox"
                  :percent="item.progress"
                  size="small"
                  :showInfo="false"
                  :strokeWidth="2"
                ></fa-progress>
              </div>
            </div>
            <div :class="['fileTitle multiTextEllipsis', { fileErr: item.fail }]">
              <div class="fileName">
                {{ item.isDir ? item.name : item.commName }}
              </div>
            </div>
          </div>
        </div>
        <!-- 空文件提示 -->
        <div class="nothingBox" v-loading="fileListLoading" v-else>
          <p class="nothingBox__text">暂无{{ acceptTypeName }}，点击右上角【上传{{ acceptTypeName }}】按钮进行上传吧</p>
        </div>
        <!-- 步进器 -->
        <global-ts-fai-pagination
          :showSizeChanger="false"
          class="paginationBox"
          @changePage="getFileList"
          :withMargin="false"
          :pageOption.sync="pages"
        >
        </global-ts-fai-pagination>
      </div>
      <div class="splitBoxRight"></div>
      <!-- Select Box -->
      <div class="selectedBox">
        <div class="addTotalText">待添加（{{ checkConfig.list.length }}/{{ limitNum }}）</div>
        <div class="selectedFileList">
          <div v-for="(item, index) in checkConfig.list" class="itemBox" :key="index">
            <div class="imgBox">
              <img class="itemImg" :src="getIcon(item)" />
              <span class="imgBox_remove">
                <global-ts-svg-icon
                  class="icon imgBox_remove__Icon"
                  name="icon-icon-10"
                  @click="handleRemoveCheckItem(item)"
                />
              </span>
            </div>
            <div class="fileTitle">
              <div class="fileName">{{ item.commName }}</div>
            </div>
          </div>
          <!--
							<div class="blockViewHeight" v-show="!checkConfig.list.length"></div>
							-->
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { TYPEGROUPMAP } from './config';
import TsCommDef from '@/config/ts-comm-def';
import { postMessage, getIcon, getFileName } from '@/utils';
import { batchAddMaterialInfo, getFileMatList } from '@/api/modules/component/file-select-dialog';
import { mapState } from 'vuex';
import { Progress } from '@fk/faicomponent';
import { Checkbox } from 'element-ui';
import iconErrIMG from '@/assets/image/material/icon_err.png';
import iconFileIMG from '@/assets/image/material/icon_file.png';
import iconVideoIMG from '@/assets/image/material/icon_video.png';

export default {
  name: 'file-select-upload-dialog',
  components: {
    [Progress.name]: Progress,
    [Checkbox.name]: Checkbox,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 最多选择文件数
    limitNum: {
      type: Number,
      default: 50,
    },
    // TsCommDef.WxMaterialCategoryDefNameMap => img doc video
    acceptType: {
      type: String,
      default: '',
    },
    // 是否过滤违规文件
    filterGfwFile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sliderConfig: {
        list: [
          {
            key: '企业文件',
            typeGroup: TYPEGROUPMAP.CORP_FOLDER,
            cloneSource: 0,
          },
          {
            key: '我的文件',
            typeGroup: TYPEGROUPMAP.PERSON_FOLDER,
            cloneSource: 1,
          },
        ],
        menu: [TYPEGROUPMAP.CORP_FOLDER],
      },
      checkConfig: {
        info: {
          // 选中的文件夹/文件 {isDir: 是否为文件夹, id: 文件夹/文件id}
          [TYPEGROUPMAP.CORP_FOLDER]: [],
          [TYPEGROUPMAP.PERSON_FOLDER]: [],
        },
        list: [],
      },
      requestParam: {
        // 搜索条件
        name: '', // 根据文件名称查询
        typeGroup: TYPEGROUPMAP.CORP_FOLDER, // 12:	企业 13: 个人
        groupId: 0, // 文件夹id,0/空:根目录 -1:全局搜索
        category: '', // 文件类型（1：文档，2：图片，3：视频, 4：文件夹）
        status: '', // 过滤违规文件
      },
      isSearchStatus: false, // 是否处于搜索状态,如果是的话不显示面包屑导航
      isLoading: false, // 防止多次点击文件夹，导致面包屑重复，这里用防抖指令会导致创建新文件夹时，点击文件夹获取的文件夹信息不是最新的
      fileList: [], // 文件数据
      filePath: [
        {
          // 文件路径 {id: 文件夹id, name: 文件夹名称}
          name: '企业文件夹',
        },
      ],
      pages: {
        // 分页
        pageNow: 1,
        limit: 18,
        maxPage: 2,
        total: 18,
      },
      uploadConfig: {
        uploadList: [], // 全部上传的文件列表
        successList: [], // 上传成功的文件列表
        fileAcceptCalMap: {
          // 文件上传类型限制
          doc: '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx',
          video: '.mp4',
          img: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
        },
        fileLimitSizeMap: {
          doc: 200,
          video: 500,
          img: 10,
        }, // 文件大小限制
        fileSizeCheckTipMap: {
          doc: '请上传200M以内的文档',
          video: '请上传500M以内的视频',
          img: '请上传10m以内的图片',
        },
        requestParam: {
          // 保存接口请求数据
          isCorp: false, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
          groupId: 0, // 选中文件夹id,默认为"根目录"
          content: '', // 文件列表
        },
      },
      fileListLoading: false, // 文件列表加载状态
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.initData();
      }
    },
    filePath() {
      this.resetUploadConfig();
    },
  },
  computed: {
    ...mapState({
      isUpperAdm: state => state.user.info?.staffInfo?.isUpperAdm,
      helpDoc: state => state.user.info?.wxWorkConf?.compMaterialConf?.helpDoc,
    }),
    innerDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      },
    },
    acceptTypeName() {
      const acceptTypeName = TsCommDef.WxMaterialCategoryDefNameMap[this.acceptType] || '文件';
      return acceptTypeName;
    },
    CategoryDef() {
      return TsCommDef.WxMaterialCategoryDef;
    },
    homePathName() {
      return this.filePath[0] && this.filePath[0].name;
    },
    /**
     * 是否显示上传按钮
     * @author: ADI
     * @Date: 2021-01-28 13:41:07
     * @param {*}
     * @return {*}
     */
    showUpload() {
      // 管理员或个人页签显示
      if (this.isUpperAdm || this.requestParam.typeGroup === TYPEGROUPMAP.PERSON_FOLDER) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 弹窗确认按钮disabled状态控制
     * @author: ADI
     * @date: 2021-03-09
     */
    submitBtnDisabled() {
      return this.checkConfig.list.length < 1;
    },
    iconErrIMG() {
      return iconErrIMG;
    },
    iconFileIMG() {
      return iconFileIMG;
    },
    iconVideoIMG() {
      return iconVideoIMG;
    },
  },
  methods: {
    /**
     * 初始化数据
     * @author: ADI
     * @Date: 2021-01-28 13:42:36
     * @param {*}
     * @return {*}
     */
    initData() {
      // 重置data
      this.initOriginOptionData();
      // 动态配置文件类型
      this.initRequestParam();
      if (this.isUpperAdm) {
        this.getFileList();
      } else {
        // 非管理员默认选择个人页签
        this.selectPersonSlider();
      }
    },
    /**
     * 选择个人页签
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    selectPersonSlider() {
      this.sliderConfig.menu = [TYPEGROUPMAP.PERSON_FOLDER];
      this.handleTitleClick({
        key: TYPEGROUPMAP.PERSON_FOLDER,
      });
    },
    /**
     * 获取文件列表
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Object} otherParam 其他额外配置的参数
     */
    async getFileList(otherParam) {
      this.fileListLoading = true;
      const [err, res] = await getFileMatList(Object.assign({}, this.requestParam, this.pages, otherParam));
      this.fileListLoading = false;
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg,
        });
        return Promise.reject(err);
      }
      // 初始化文件状态
      let fileList = res.data || [];
      // 过滤封禁文件
      if (this.filterGfwFile) {
        fileList = fileList.filter(item => ![1, 2, 3].includes(item.gfwStatus));
      }
      this.fileList = fileList.map(file => {
        file.success = true;
        return file;
      });
      this.pages.total = res.total;
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit) || 1;
      // 判断搜索状态
      if (this.requestParam.name) {
        this.isSearchStatus = true;
        this.initBreadcrumb();
      } else {
        this.isSearchStatus = false;
      }
      return Promise.resolve(this.fileList);
    },
    /**
     * 初始化面包屑导航
     * @description: ADI
     */
    initBreadcrumb() {
      const pathItem = this.sliderConfig.list.find(item => item.typeGroup === this.requestParam.typeGroup);
      this.filePath = [
        {
          name: pathItem.key,
        },
      ];
    },
    /**
     * 初始化请求参数，主要是动态配置文件类型
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    initRequestParam() {
      this.initOriginOptionData('requestParam');
      // 初始化文件类型
      this.requestParam.category = this.CategoryDef[this.acceptType] || '';
      // 是否过滤封禁文件
      this.requestParam.status = this.filterGfwFile ? 0 : '';
    },
    /**
     * 重置当前vm.$data
     * @author: ADI
     * @Date: 2021-01-29 17:40:58
     * @param {Array or String} needInitKey
     * @return {Data or undefined} 成功返回原始数据
     */
    initOriginOptionData(needInitKey = '') {
      const originData = this.$options.data();
      // 重置$data
      if (!needInitKey) {
        return Object.assign(this.$data, originData);
      }
      const originKeys = Object.keys(originData);
      const verifyHasKey = k => originKeys.includes(k);
      // 重置部分key
      if (Array.isArray(needInitKey)) {
        return needInitKey
          .filter(key => verifyHasKey(key))
          .map(key => {
            return (this[key] = originData[key]);
          });
      }
      // 重置key
      if (verifyHasKey(needInitKey)) {
        return (this[needInitKey] = originData[needInitKey]);
      }
    },
    /**
     * 搜索,不论处于哪个位置,这里都是全局搜索,搜索状态时不显示面包屑导航
     * @author: ADI
     * @Date: 2021-01-29 17:40:58
     */
    reloadDataList() {
      if (this.requestParam.name) {
        this.requestParam.groupId = -1; // 搜索状态
      } else {
        this.requestParam.groupId = 0; // 非搜索状态要指向根目录
      }
      this.initBreadcrumb();
      this.initOriginOptionData('pages');
      this.getFileList();
    },
    /**
     * 子项点击
     * @author: ADI
     * @Date: 2021-01-28 14:19:00
     */
    handleTitleClick({ item, key, keyPath }) {
      if (this.requestParam.typeGroup !== key) {
        this.fileList = [];
        this.initRequestParam();
        this.requestParam.typeGroup = key;
        this.reloadDataList();
      }
    },
    /**
     * 获取子级文件夹/文件
     * @author: ADI
     * @Date: 2021-01-28 14:19:18
     */
    gotoChildFile(file) {
      if (file.isDir && !this.isLoading) {
        this.initOriginOptionData('pages');
        this.requestParam.name = '';
        this.requestParam.groupId = file.id;
        this.isLoading = true;
        this.getFileList()
          .then(() => {
            // 记得清空搜索名称
            if (!this.isSearchStatus) {
              this.filePath.push({
                // 更新文件路径
                id: file.id,
                name: file.name,
              });
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    /**
     * 面包屑导航跳转
     * @author: ADI
     * @Date: 2021-01-28 14:19:18
     * @param {Object} item 导航项
     * @param {Number} index 导航索引
     */
    goBackFile(item, index) {
      if (index === this.filePath.length - 1) return;
      this.initOriginOptionData('pages');
      this.requestParam.name = '';
      this.requestParam.groupId = index === 0 ? 0 : item.id;
      this.getFileList().then(() => {
        this.filePath = this.filePath.slice(0, index + 1);
      });
    },
    /**
     * 保存
     * @author: ADI
     * @Date: 2021-01-28 14:19:18
     */
    async saveUpload() {
      const [err, res] = await batchAddMaterialInfo(
        Object.assign({}, this.uploadConfig.requestParam, {
          content: JSON.stringify(this.uploadConfig.successList),
          typeGroup: this.requestParam.typeGroup,
        }),
      );
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return err;
      }
      const needSelectFileList = res.data || [];
      needSelectFileList.forEach(file => {
        this.checkItem(true, file);
      });
      postMessage({
        type: 'success',
        message: '上传成功',
      });
      this.$emit('fileUploadSuccess');
      this.getFileList();
      this.uploadConfig.successList = [];
    },
    /**
     * 确定的回调
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    async handleOk() {
      this.$emit('update:dialogVisible', false);
      this.$emit('success', this.checkConfig.list);
    },
    /**
     * 取消的回调
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    handleCancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 跳转帮助页
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    toHelpCenter() {
      if (!this.helpDoc) return;
      window.open(this.helpDoc, '_blank');
    },
    /**
     * 选中或取消选中文件/文件夹
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Boolean} flag 是否为选中
     * @param {Object} item 选中的文件/文件夹
     * @param {Number} index 选中的文件/文件夹索引
     */
    checkItem(flag, item, index) {
      if (flag) {
        // 选中
        if (this.checkConfig.list.length >= this.limitNum) {
          postMessage({
            type: 'error',
            message: `最多支持添加${this.limitNum}个`,
          });
          return;
        }
        this.checkConfig.info[this.requestParam.typeGroup].push(item.id);
        this.checkConfig.list.push(item);
      } else {
        // 取消选中
        const checkIndex = this.checkConfig.list.findIndex(
          checkItem => checkItem.id === item.id && checkItem.typeGroup === item.typeGroup,
        );
        if (checkIndex !== -1) {
          // 移除文件
          const checkFile = this.checkConfig.list.splice(checkIndex, 1)[0];
          // 取消选择
          const infoIndex = this.checkConfig.info[item.typeGroup].findIndex(infoId => infoId === checkFile.id);
          if (infoIndex !== -1) {
            this.checkConfig.info[item.typeGroup].splice(infoIndex, 1);
          }
        }
      }
    },
    /**
     * 侧边栏取消文件选择
     * @author: ADI
     * @Date: 2021-02-26 12:02:44
     * @param {Boolean} flag 是否为选中
     * @param {Object} item 选中的文件/文件夹
     * @param {Number} index 选中的文件/文件夹索引
     */
    handleRemoveCheckItem(item) {
      this.checkItem(false, item);
    },
    /**
     * 获取文件夹/文件icon
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Object} file
     */
    getIcon(file) {
      if (file.isDir) {
        return iconFileIMG;
      } else {
        switch (
          file.category // 1:文档 2:图片 3:视频
        ) {
          case this.CategoryDef.doc:
            return getIcon(file.name);
          case this.CategoryDef.img:
            return file.content;
          case this.CategoryDef.video:
            return file.coverImgUrl || iconVideoIMG;
        }
      }
    },
    /**
     * 是否允许选择文件复选框
     * @description: ADI
     * @param {*} file
     * @return {*} boolean
     */
    useCheckbox(file) {
      // 不可选的文件
      if (file.focused) {
        return false;
      }
      // 不可选 系统文件与文件夹
      if (file.isSystem || file.isDir) {
        return false;
      }
      // 不可选 违禁文件
      if ([1, 2, 3].includes(file.gfwStatus)) {
        return false;
      }
      return true;
    },
    /**
     * 是否禁用选择文件复选框
     * @author: ADI
     * @Date: 2021-01-28 11:41:37
     * @param {*} item
     * @return {*}
     */
    checkboxDisabled(item) {
      // 已选择项
      if (this.checkConfig.info[this.requestParam.typeGroup].includes(item.id)) {
        return false;
      }
      // 超出限制个数
      if (this.checkConfig.list.length >= this.limitNum) {
        return true;
      }
    },
    /**
     * 获取上传文件配置项
     * @author: ADI
     * @Date: 2021-01-28 10:07:51
     * @param {String} key 单类型传Map:['fileAcceptCalMap','fileLimitSizeMap','fileSizeCheckTipMap'],多类型上传传空
     * @return {Array or String}
     */
    getFileLimitConfig(key) {
      const Map = this.uploadConfig[key];
      if (!Map) {
        throw new Error(`Map:${key}不存在`);
      }
      // 返回单类型配置字符串
      if (this.acceptType) {
        return Map[this.acceptType];
      }
      // 返回多类型配置数组
      return Object.values(Map);
    },
    /**
     * 重置上传文件配置
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     */
    resetUploadConfig() {
      const isCorp = this.requestParam.typeGroup === TYPEGROUPMAP.CORP_FOLDER;
      const groupId = this.requestParam.groupId;
      this.uploadConfig.uploadList = [];
      this.uploadConfig.successList = [];
      this.uploadConfig.requestParam = {
        isCorp, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
        groupId, // 选中文件夹id,默认为"企业文件根目录"
        content: '', // 文件列表
      };
    },
    /**
     * 上传文件之前
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Object} file 上传的文件
     * @param {Number} categoryType 上传的文件类型 具体可查看CategoryDef变量的定义 1:文档 2:视频 3:图片
     */
    beforeUpload(file) {
      const nameArr = getFileName(file.name);
      let categoryType;
      if (this.uploadConfig.fileAcceptCalMap.doc.indexOf(nameArr[1]) != -1) {
        categoryType = 1;
      } else if (this.uploadConfig.fileAcceptCalMap.img.indexOf(nameArr[1]) != -1) {
        categoryType = 2;
      } else {
        categoryType = 3;
      }
      file.category = categoryType;
      file.editName = nameArr[0];
      file.progress = 0; // 初始化进度条
      file.focused = true; // 仅做显示，不可选择
      this.uploadConfig.uploadList.push(file);
      this.fileList.push(file);
    },
    /**
     * 更新上传进度
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Boolean} param
     * @return {Boolean} return
     */
    uploadProgress(res, file) {
      this.fileList.find((item, index) => {
        if (item.uid === file.uid) {
          const progress = res.percent; // 更新进度条
          this.fileList[index].progress = progress;
          this.$set(this.fileList, index, this.fileList[index]);
          return true;
        }
      });
    },
    /**
     * 上传文件结果
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @date 2021-01-12
     */
    breakUpload(res, file) {
      this.setStatus(true, file, res);
    },
    /**
     * 上传失败
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Object} file 文件对象
     */
    uploadError(file) {
      this.setStatus(false, file);
    },
    /**
     * 文件的上传结果
     * @author: ADI
     * @Date: 2021-01-28 14:02:44
     * @param {Boolean} isSuccess 是否上传成功
     * @param {Object} file
     * @param {Object} data 文件
     */
    setStatus(isSuccess, file = {}, data = {}) {
      if (isSuccess) {
        let newSuccessFile = data;
        // 文档和视频
        newSuccessFile = {
          uid: file.uid,
          name: data.name,
          content: data.id,
          type: data.type,
          size: data.size,
        };
        switch (file.category) {
          case this.CategoryDef.video:
            newSuccessFile.coverImg = data.frameInfo.frameImgId;
            break;
          case this.CategoryDef.img:
            newSuccessFile.url = data.fullViewUrl;
            break;
        }
        this.uploadConfig.successList.push(newSuccessFile);
        this.saveUpload();
      }
      // 为当前上传文件添加成功/失败的状态
      this.fileList.find((item, index) => {
        if (item.uid === file.uid) {
          if (isSuccess) {
            this.fileList[index].success = true;
            if (file.category === this.CategoryDef.video) {
              this.fileList[index].coverImgUrl = data.frameInfo && data.frameInfo.frameImgId;
            } else if (file.category === this.CategoryDef.img) {
              this.fileList[index].content = data.fullViewUrl;
            }
          } else {
            this.fileList[index].fail = true;
          }
          this.$set(this.fileList, index, this.fileList[index]);
          return true;
        }
      });
    },
    /**
     * 自定义检验图片
     * @author ADI
     * @date 2021-01-20
     * @param {Boolean} param
     * @return {Boolean} return
     */
    customBeforeUpload(file) {
      const sameItem = this.uploadConfig.uploadList.some(item => item.name === file.name);
      if (sameItem) return false;
      return sameItem;
    },
  },
};
</script>

<style lang="scss" scoped>
/* fileUploadSelect组件 */
.fileUploadSelect_pictureCardWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* dialogContent */
.fileUploadSelect {
  .dialogContent {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    padding: 0;
    .leftPart {
      flex: 0 0 auto;
      width: 120px;
    }
    .selectedBox {
      position: relative;
      width: 180px;
      padding-top: 20px;
      box-sizing: border-box;
      flex: 0 0 auto;
      .addTotalText {
        position: absolute;
        top: -49px;
        left: 0;
        width: 100%;
        font-size: 16px;
        line-height: 49px;
        color: #000000;
        text-align: center;
        vertical-align: middle;
      }
      .selectedFileList {
        display: flex;
        height: 635px;
        overflow-y: scroll;
        flex-direction: column;
        align-items: center;
        .itemBox {
          display: inline-block;
          width: 90px;
          margin-top: 20px;
          vertical-align: top;
          &:first-child {
            margin-top: 0;
          }
        }
        .imgBox {
          position: relative;
          width: 90px;
          height: 90px;
          padding: 10px;
          margin: 0 auto;
          border: 1px solid transparent;
          border-radius: 4px;
          box-sizing: border-box;
          .itemImg {
            width: 70px;
            height: 70px;
            border-radius: 4px;
            object-fit: cover;
          }
          &:hover {
            .imgBox_remove {
              opacity: 1;
              visibility: visible;
            }
          }
          .imgBox_remove {
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            width: 70px;
            height: 70px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 4px;
            border-radius: 4px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s linear;
            justify-content: center;
            align-items: center;
          }
          .imgBox_remove__Icon {
            width: 26px;
            height: 26px;
            margin-right: 0;
            color: #ffffff;
            cursor: pointer;
          }
        }
        .fileTitle {
          .fileName {
            overflow: hidden;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .blockViewHeight {
          width: 100%;
          height: 100%;
          flex: 0 0 600px;
        }
      }
      .addTip {
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 14px;
        color: $color-89;
      }
    }
    .splitBox {
      position: absolute;
      top: 148px;
      left: 119px;
      width: 1px;
      height: calc(100% - 148px);
      background-color: #eeeeee;
    }
    .splitBoxRight {
      position: absolute;
      top: -49px;
      right: 180px;
      width: 1px;
      height: calc(100% + 49px);
      background-color: #eeeeee;
    }
    .mainBox {
      width: 700px;
      height: 632px;
      padding: 20px 0 20px 30px;
      box-sizing: border-box;
      flex: 0 0 auto;
      .headerLine {
        display: flex;
        flex-flow: row nowrap;
        .headerLineBtn {
          margin-right: 10px;
          &.input {
            width: 200px;
          }
        }
      }
      .headerLine__search {
        width: 220px;
      }
      .headerLine__upload {
        margin-left: 12px;
      }
    }
    .fileList {
      /* flex-wrap: wrap; */
      height: 462px;
      margin-top: 20px;
      overflow-y: auto;
      ::-webkit-scrollbar {
        width: 4px;
      }
      .itemBox {
        display: inline-block;
        width: 90px;
        margin: 0 20px 20px 0;
        vertical-align: top;
      }
      .imgBox {
        position: relative;
        width: 90px;
        height: 90px;
        padding: 10px;
        margin: 0 auto;
        border: 1px solid transparent;
        border-radius: 4px;
        box-sizing: border-box;
        img {
          width: 70px;
          height: 70px;
          object-fit: cover;
        }
        &:hover {
          background: #f5f7fa;
        }
        &.checkImgBox {
          background: $primary-color-bg;
          border: 1px solid $primary-color;
        }
        &.boxPointer {
          cursor: pointer;
        }
        .gfwBox {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 70px;
          height: 20px;
          margin: auto;
          font-size: 12px;
          line-height: 20px;
          color: $error-color;
          text-align: center;
          background: #fef0f0;
          .helpIcon {
            &.icon {
              width: 12px;
              height: 12px;
              margin: 0 2px 0 0;
              color: $error-color;
            }
          }
        }
        .itemCheckBox {
          position: relative;
        }
        .settingBox {
          position: absolute;
          right: 5px;
          bottom: 5px;
          display: none;
          .icon {
            margin-right: 0;
            font-size: 16px;
            color: $color-89;
          }
          &.showSettingBtn {
            display: block;
            .icon {
              color: $primary-color;
            }
          }
        }
      }
      .fileTitle {
        font-size: 14px;
        color: $color-53;
        text-align: center;
        &.multiTextEllipsis {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .fileName {
        height: 40px;
        margin-top: 2px;
        line-height: 20px;
        word-break: break-all;
        border: 1px solid transparent;
      }
      .fileErr {
        color: $error-color;
      }
    }
    .uploadImgWrapper {
      width: 90px;
      height: 90px;
      padding: 10px;
      box-sizing: border-box;
    }
    .uploadImgBox {
      position: relative;
      display: flex;
      width: 70px;
      height: 70px;
      margin: 0 auto;
      background: #f7f7f7;
      border-radius: 4px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .uploadText {
        font-size: 12px;
        color: $color-53;
      }
    }
    .nothingBox {
      height: 400px;
      padding: 0;
      margin-top: 30px;
      font-size: 14px;
      line-height: 1;
      color: #909399;
      text-align: center;
      .nothingBox__text {
        line-height: 400px;
        user-select: none;
      }
    }
  }
}

/* dialogContent End */
.progressBox {
  width: 60px;
}
.fileUploadSelect .dialogContent .fileList .imgBox:hover .itemCheckBox,
.fileUploadSelect .dialogContent .fileList .imgBox:hover .settingBox {
  display: block;
}
.directSale {
  .fileUploadSelect {
    .dialogContent {
      .fileList {
        .imgBox {
          .settingBox {
            &.showSettingBtn {
              .icon {
                color: $primary-color;
              }
            }
          }
        }
      }
    }
  }
}

/* 两行文本溢出缺省 */

/* fileUploadBreadcrumbWrapper */
.fileUploadBreadcrumbWrapper {
  margin-top: 20px;
  .currentFilePath {
    font-size: 14px;
    font-weight: bold;
    color: $color-00;
    text-decoration: none;
  }
  .fubBreadcrumbBox {
    width: 100%;
    .fubBreadcrumbBoxItem {
      flex: 0 1 auto;
      overflow: hidden;
    }
    .filePath {
      font-size: 14px;
      font-weight: normal;
      color: $color-89;
      cursor: pointer;

      /* width: 100%; */
      &:hover {
        color: $primary-color-hover;
        text-decoration: underline;
      }
    }
    .filePathIcon {
      width: 16px;
      height: 16px;
      margin: 0 8px;
      color: $color-89;
    }
  }
}

/* fileUploadSelect组件 End */
</style>

<style lang="scss">
@media (max-width: 767px) {
  .fileUploadSelect {
    .fa-modal {
      max-width: 100%;
    }
  }
}

/* 弹窗 */
.fileUploadSelect {
  &.tsFaiModal-wrap {
    min-width: 1008px;
    .fa-modal-body {
      .defaultBody {
        padding: 0;
      }
    }
  }
  .fa-menu {
    &.fa-menu-mixed {
      &.fa-menu-vertical {
        & > .fa-menu-item-selected {
          color: $primary-color;
          border-right: none;
          &.fa-menu-item {
            &:last-child {
              border-bottom: 1px solid #eeeeee;
            }
          }
        }
      }
    }
  }
  .fa-menu-mixed {
    &.fa-menu-vertical {
      width: 100% !important;
      & > .fa-menu-item {
        height: 74px;
        line-height: 74px;
        text-align: center;
        border-right: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        box-sizing: border-box;
        &::after {
          border-right: 3px solid $primary-color;
        }
        &:hover {
          color: $primary-color;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .fa-menu-mixed.fa-menu-inline,
  .fa-menu-mixed.fa-menu-vertical {
    padding-top: 0;
    background-color: #ffffff;
  }
  .fa-menu-radius-top,
  .fa-menu-radius-bottom {
    display: none;
  }
  .dialogContent {
    .leftPart {
      .fa-menu-item {
        color: $color-53;
      }
    }
  }
  .selectedBox {
    .fa-select-selection {
      width: 140px;
      height: 34px;
      line-height: 34px;
      .fa-select-selection__rendered {
        line-height: 34px;
      }
    }
  }
  .paginationWrapper {
    .fa-pagination {
      margin-right: 20px;
    }
  }
  .fa-modal-close {
    right: 180px;
  }
}

/* 弹窗 End */
.progressBox {
  .fa-progress-inner {
    background: #dadada;
  }
}
</style>

<style lang="scss">
.fileUploadSelect {
  .dialogContent {
    .fileList {
      .imgBox {
        &:hover {
          .itemCheckBox {
            .el-checkbox__input {
              opacity: 1;
            }
          }
        }
        .itemCheckBox {
          .el-checkbox__input {
            position: absolute;
            top: -4px;
            left: -4px;
            font-size: 0;
            opacity: 0;
            transition: opacity 0.2s;
          }
          &.checkIn {
            .el-checkbox__input {
              opacity: 1;
            }
          }
          .el-checkbox__label {
            padding-left: 0;
          }
          .el-checkbox__inner {
            width: 16px;
            height: 16px;
            &::after {
              top: 2px;
              left: 5px;
            }
          }
        }
      }
    }
  }
  .nothingBox {
    .el-loading-mask {
      right: 1px;
    }
  }
}
</style>

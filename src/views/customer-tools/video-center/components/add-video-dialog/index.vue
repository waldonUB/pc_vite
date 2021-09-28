<!--
 * @Author       : ADI
 * @Date         : 2021-06-28 14:01:46
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 10:56:21
-->
<template>
  <global-ts-fai-modal
    wrapClassName="addVideoDialog"
    dialogTitle="添加视频"
    dialogTitleTip="（只能添加mp4，大小不超过500MB）"
    dialogSize="large"
    :dialogVisible.sync="addVideoDialogVisibleCal"
    @handleCancel="handleCancel"
    @handleOk="handleOk"
  >
    <div class="dialogContent">
      <div class="leftPart">
        <fa-menu mode="vertical" v-model="selectMenu" theme="mixed">
          <fa-menu-item @click="handleTitleClick" v-for="item of sliderList" :key="item.typeGroup">
            {{ item.key }}
          </fa-menu-item>
        </fa-menu>
      </div>
      <div class="splitBox"></div>
      <div class="mainBox">
        <div class="headerLine">
          <fa-input
            class="headerLineBtn input"
            v-model="requestParam.name"
            placeholder="搜索视频"
            @keyup.enter.native="reloadDataList"
          >
          </fa-input>
          <global-ts-button
            class="headerLineBtn"
            type="primary"
            size="small"
            icon="icon-icon-4"
            @click="reloadDataList"
          >
            搜索
          </global-ts-button>
          <global-ts-point-upload
            v-if="isManager || requestParam.typeGroup === 13"
            class="headerLineBtn"
            :multiple="false"
            :accept="videoAcceptCal"
            :isShowFileList="false"
            :limitSize="500"
            :isShowLoading="false"
            :extraUploadOption="extraUploadOption"
            sizeCheckTip="请上传500M以内的视频"
            @beforeUpload="file => beforeUpload(file, CategoryDef.video)"
            @uploadProgress="uploadProgress"
            @breakupload="breakUploadVideo"
            @uploadError="uploadError"
          >
            <global-ts-button class="uploadBtn headerLineBtn" size="small">上传视频</global-ts-button>
          </global-ts-point-upload>
        </div>
        <div class="fileList" v-if="fileList.length">
          <div v-for="(item, index) in fileList" class="itemBox" :key="index">
            <div
              v-if="item.success"
              class="imgBox"
              :class="{ checkImgBox: checkIdInfo[requestParam.typeGroup].includes(item.id) }"
            >
              <img class="itemImg" :src="getIcon(item)" @click="gotoChildFile(item)" />
              <el-checkbox
                :value="checkIdInfo[requestParam.typeGroup].includes(item.id)"
                :class="['itemCheckBox', { checkIn: checkIdInfo[requestParam.typeGroup].includes(item.id) }]"
                @change="flag => checkItem(flag, item, index)"
              ></el-checkbox>
            </div>
            <div class="uploadImgWrapper" v-else-if="item.fail">
              <img class="fileImg" :src="icon_errIMG" />
            </div>
            <div class="uploadImgWrapper" v-else>
              <div class="uploadImgBox">
                <div class="uploadText">文件上传中</div>
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
              <div class="fileName">{{ item.commName }}</div>
            </div>
          </div>
        </div>
        <div class="nothingText" v-else>
          暂无视频，点击右上角【上传视频】按钮进行上传吧
        </div>
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
      <div class="selectedBox">
        <div class="addTotalText">待添加（{{ checkItemList.length }}/50）</div>
        <div class="addTip" v-if="isManager">添加至</div>
        <fa-tree-select
          v-if="isManager"
          @change="selectClassify"
          dropdownMatchSelectWidth
          dropdownClassName="ts-fa-tree-select"
          v-model="saveParams.groupId"
          style="width: 100%;"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto', zIndex: '9999' }"
          placeholder="请选择分类"
        >
          <fa-tree-select-node v-for="item of classifyList" :key="item.id" :value="item.id" :title="item.name">
            <fa-tree-select-node
              v-for="subItem of item.children"
              :key="item.id + '_' + subItem.id"
              :value="item.id + '_' + subItem.id"
              :title="subItem.name"
            />
          </fa-tree-select-node>
        </fa-tree-select>
        <div class="selectedFileList">
          <div v-for="(item, index) in checkItemList" class="itemBox" :key="index">
            <div class="imgBox">
              <img class="itemImg" :src="getIcon(item)" @click="gotoChildFile(item)" />
            </div>
            <div class="fileTitle">
              <div class="fileName">{{ item.commName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </global-ts-fai-modal>
</template>

<script>
import { CategoryDef } from '@/config/ts-comm-def';
import icon_errIMG from '@/assets/image/material/icon_err.png';
import { loading, getFileName, getIcon } from '@/utils';
import { Checkbox } from 'element-ui';
import { getTsWxWorkMaterialList, batchAddVideoInfo } from '@/api/modules/views/customer-tools/video-center';
import { getTsGroupList, batchAddMaterialInfo } from '@/api/modules/views/customer-tools';
import { Progress } from '@fk/faicomponent';

export default {
  name: 'add-video-dialog',
  components: { [Checkbox.name]: Checkbox, [Progress.name]: Progress },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isManager: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requestParam: {
        name: '',
        category: 3, // 视频文件
        fromVideo: true, // 来源视频中心，可以过滤审查中的视频
        typeGroup: 12, // 12企业文件，13个人文件
      },
      saveParams: {
        groupId: 0,
        content: JSON.stringify([]),
        type: 0, // 视频类型（0：企业文件， 1：个人文件）
      },
      pages: {
        pageNow: 1,
        limit: 12,
        maxPage: 2,
        total: 12,
      },
      sliderList: [
        {
          key: '企业文件',
          typeGroup: 12,
          cloneSource: 0,
        },
        {
          key: '我的文件',
          typeGroup: 13,
          cloneSource: 1,
        },
      ],
      fileList: [], // 文件数据
      filePath: [
        {
          // 文件路径 {id: 文件夹id, name: 文件夹名称}
          name: '企业文件夹',
        },
      ],
      checkIdInfo: {
        // 选中的文件夹/文件id
        12: [],
        13: [],
      },
      checkItemList: [],
      isSearchStatus: false,
      videoAcceptCal: '.mp4',
      CategoryDef: CategoryDef,
      successList: [],
      classifyList: [
        {
          id: 0,
          name: '企业视频',
          children: [],
        },
        {
          id: -1,
          name: '个人视频',
          children: [],
        },
      ],
      selectMenu: [12],
      extraUploadOption: {}, // 上传视频接口额外需要传的数据
    };
  },
  computed: {
    addVideoDialogVisibleCal: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      },
    },
    icon_errIMG() {
      return icon_errIMG;
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        Object.assign(this.$data, this.$options.data());
        this.reloadDataList();
        this.getGroupList();
      }
    },
    selectMenu(newVal) {
      this.extraUploadOption = {
        isCorp: newVal.indexOf(this.sliderList[0].typeGroup) != -1, // 是否为企业文件
      };
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 保存
     * @author lymn
     * @date 2020-10-29
     */
    async saveUpload() {
      const params = {
        // 保存接口请求数据
        isCorp: this.requestParam.typeGroup === 12, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
        typeGroup: this.requestParam.typeGroup,
        groupId: 0, // 选中文件夹id,默认为"企业文件根目录"
        content: '', // 文件列表
      };
      const [err, res] = await batchAddMaterialInfo(
        Object.assign(params, {
          content: JSON.stringify(this.successList),
        }),
      );
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: '上传成功',
      });
      this.successList = [];
      this.getFileList();
    },
    /**
     * 分类选项
     * @author waldon
     * @date 2020/12/1
     * @param {Number} value - 参数1
     * @param {Array} label - 参数2
     * @param {Object} extra - 参数3
     */
    selectClassify(value, label, extra) {
      this.saveParams.type = label[0] === '个人视频' && value === -1 ? 1 : 0;
    },
    async getGroupList() {
      const params = {
        type: 17, // 企业视频
      };
      const [err, res] = await getTsGroupList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.classifyList[0].children = res.data; // 只有两层，简单处理
    },
    /**
     * 文件的上传结果
     * @author lymn
     * @date 2020-11-02
     * @param {Boolean} isSuccess 是否上传成功
     * @param {Object} file
     * @param {Object} data 文件
     */
    setStatus(isSuccess, file, data) {
      console.log(file, data, '上传成功');
      if (isSuccess) {
        let newSuccessFile = data;
        if ([CategoryDef.doc, CategoryDef.video].includes(file.category)) {
          // 文档和视频
          newSuccessFile = {
            uid: data.uid,
            name: data.name,
            content: data.id,
            type: data.type,
            size: data.size,
          };
          if (file.category == CategoryDef.video) {
            // 视频
            // file.coverImg = data.frameInfo.frameImgId
            newSuccessFile.coverImg = data.frameInfo.frameImgId;
          }
        } else {
          // file.url = data.url
          newSuccessFile = data;
        }
        newSuccessFile.uid = file.uid;
        // newSuccessFile.editName = file.name // 可编辑名称
        this.successList.push(newSuccessFile);
        this.saveUpload();
      }
      this.fileList.find((item, index) => {
        if (item.uid == file.uid) {
          if (isSuccess) {
            this.fileList[index].success = true;
            if (file.category == CategoryDef.video) {
              this.fileList[index].coverImg = data.frameInfo.frameImgId;
            } else if (file.category == CategoryDef.img) {
              this.fileList[index].url = data.url;
            }
          } else {
            this.fileList[index].fail = true;
          }
          console.log(this.fileList, 'fileList===');
          this.$set(this.fileList, index, this.fileList[index]);
          return true;
        }
      });
    },
    /**
     * 上传文件之前
     * @author lymn
     * @date 2020-11-12
     * @param {Object} file 上传的文件
     * @param {Number} categoryType 上传的文件类型 具体可查看CategoryDef变量的定义 1:文档 2:视频 3:图片
     */
    beforeUpload(file, categoryType) {
      file.category = categoryType;
      file.commName = getFileName(file.name)[0];
      file.progress = 0; // 初始化进度条
      this.fileList.push(file);
    },
    /**
     * 更新图片上传进度
     * @author lymn
     * @date 2020-10-29
     * @param {Boolean} param
     * @return {Boolean} return
     */
    uploadProgress(res, file) {
      console.log(res, file, '进度变化');
      this.fileList.find((item, index) => {
        if (item.uid == file.uid) {
          const progress = res.percent; // 更新进度条
          this.fileList[index].progress = progress;
          this.$set(this.fileList, index, this.fileList[index]);
          return true;
        }
      });
    },
    /**
     * 上传视频结果
     * @author lymn
     * @date 2020-10-30
     * @param {Boolean} param
     * @return {Boolean} return
     */
    breakUploadVideo(res, file) {
      console.log(res, file, '视频文件');
      this.setStatus(true, file, res);
      loading.poupQuene('breakUploadLoading');
    },
    /**
     * 断点上传失败
     * @author lymn
     * @date 2020-11-18
     * @param {Object} file 文件对象
     */
    uploadError(file) {
      this.setStatus(false, file);
    },
    /**
     * 获取文件夹/文件icon
     * @author lymn
     * @date 2020-11-07
     * @param {Object} file
     */
    getIcon(file) {
      if (file.isDir) {
        return this.resRoot + '/image/material/icon_file.png';
      } else {
        switch (
          file.category // 1:文档 2:图片 3:视频
        ) {
          case CategoryDef.doc:
            return getIcon(file.name);
          case CategoryDef.img:
            return file.content;
          case CategoryDef.video:
            return file.coverImgUrl || this.resRoot + '/image/material/icon_video.png';
        }
      }
    },
    /**
     * 搜索,不论处于哪个位置,这里都是全局搜索,搜索状态时不显示面包屑导航
     * @author lymn
     * @date 2020-11-02
     */
    reloadDataList() {
      this.filePath = [
        {
          // 文件路径 {id: 文件夹id, name: 文件夹名称}
          name: '企业文件夹',
        },
      ];
      this.pages.pageNow = 1;
      // this.requestParam.name = this.searchName
      this.getFileList().then(() => {
        // this.requestParam.name = ''
      });
    },
    /**
     * 获取文件列表
     * @author lymn
     * @date 2020-11-03
     */
    async getFileList() {
      const [err, res] = await getTsWxWorkMaterialList(Object.assign({}, this.requestParam, this.pages));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      res.data.forEach(item => {
        item.success = true;
      });
      this.fileList = res.data;
      this.pages.total = res.total;
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit) || 1;
      if (!this.fileList.length && this.pages.total && this.pages.pageNow > this.pages.maxPage) {
        // 处理最后一页数据被清空的情况，更新页码
        this.pages.pageNow = this.pages.maxPage;
      }
      // 判断搜索状态
      if (this.requestParam.name) {
        this.isSearchStatus = true;
        this.filePath = [
          {
            name: '企业文件夹',
          },
        ]; // 初始化面包屑导航
      } else {
        this.isSearchStatus = false;
      }
      return Promise.resolve();
    },
    /**
     * 选中或取消选中文件/文件夹
     * @author lymn
     * @date 2020-11-07
     * @param {Boolean} flag 是否为选中
     * @param {Object} item 选中的文件/文件夹
     * @param {Number} index 选中的文件/文件夹索引
     */
    checkItem(flag, item, index) {
      if (flag) {
        // 选中
        if (this.checkItemList.length >= 50) {
          this.$utils.postMessage({
            type: 'error',
            message: '最多支持添加50个',
          });
          return;
        }
        this.checkIdInfo[this.requestParam.typeGroup].push(item.id);
        this.checkItemList.push(item);
      } else {
        // 取消选中
        const index = this.checkItemList.findIndex(
          checkItem => checkItem.id === item.id && checkItem.typeGroup === item.typeGroup,
        );
        if (index !== -1) {
          this.checkItemList.splice(index, 1);
          this.checkIdInfo[this.requestParam.typeGroup].splice(index, 1);
        }
      }
    },
    /**
     * 获取子级文件夹/文件
     * @author lymn
     * @date 2020-11-07
     * @param {Object} file - 文件
     */
    gotoChildFile(file) {
      if (file.isDir && !this.isLoading) {
        this.requestParam.name = ''; // 清空搜索名称
        this.pages.pageNow = 1;
        // this.requestParam.groupId = file.id
        this.isLoading = true;
        this.getFileList()
          .then(() => {
            // 记得清空搜索名称
            this.initCheckStatus();
            if (!this.isSearchStatus) {
              this.filePath.push({
                // 更新文件路径
                id: file.id,
                name: file.name,
              });
            }
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
    onSelectChange() {},
    /**
     * 子项点击
     * @author waldon
     * @date 2020/12/1
     * @param {Object}  - 子项点击参数
     */
    handleTitleClick({ item, key, keyPath }) {
      if (this.requestParam.typeGroup !== key) {
        this.requestParam.name = ''; // 清空搜索名称
        this.requestParam.typeGroup = key;
        this.reloadDataList();
      }
    },
    /**
     * 确定的回调
     * @author waldon
     * @date 2020-05-20
     */
    async handleOk() {
      await this.batchAddVideoInfo();
      this.$emit('update:dialogVisible', false);
      this.$emit('saveVideoSuccess');
    },
    /**
     * 取消的回调
     * @author waldon
     * @date 2020-05-20
     */
    handleCancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 添加视频
     * @author waldon
     * @date 2020/11/26
     */
    async batchAddVideoInfo() {
      if (!this.checkItemList.length) {
        this.$utils.postMessage({
          type: 'error',
          message: '请选择要添加的视频',
        });
        return;
      }
      let params = {
        groupId: 0,
        content: '',
      };
      const groups = (this.saveParams.groupId + '').split('_');
      params.groupId = groups[groups.length - 1];
      const checkData = this.checkItemList.map(item => {
        return {
          id: item.id,
          cloneSource: item.typeGroup === 12 ? 0 : 1, // 视频来源（0：企业文件， 1：个人文件）
        };
      });
      params.type = this.isManager ? this.saveParams.type : 1; // 销售员直接保存为个人视频
      params.content = JSON.stringify(checkData);
      params = { ...this.saveParams, ...params };
      const [err, res] = await batchAddVideoInfo(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '添加成功',
      });
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.addVideoDialog {
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
      padding: 20px;
      box-sizing: border-box;
      flex: 0 0 auto;
      .addTotalText {
        position: absolute;
        top: -40px;
        left: 0;
        width: 100%;
        font-size: 16px;
        line-height: 1;
        color: $color-00;
        text-align: center;
      }
      .selectedFileList {
        display: flex;
        height: 400px;
        overflow-y: scroll;
        flex-direction: column;
        align-items: center;
        .itemBox {
          display: inline-block;
          width: 90px;
          margin-top: 20px;
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
        }
        .fileTitle {
          .fileName {
            overflow: hidden;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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
      background-color: $border-disabled-color;
    }
    .splitBoxRight {
      position: absolute;
      top: -62px;
      right: 180px;
      width: 1px;
      height: calc(100% + 62px);
      background-color: $border-disabled-color;
    }
    .mainBox {
      width: 700px;
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
    }
    .fileList {
      height: 400px;
      margin-top: 30px;
      overflow-y: scroll;
      .itemBox {
        display: inline-block;
        width: 90px;
        margin: 0 20px 30px 0;
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
          background: #e6f1ff;
        }
        &.checkImgBox {
          background: #e6f1ff;
          border: 1px solid #247af3;
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
              fill: $error-color;
            }
          }
        }
        .itemCheckBox {
          position: absolute;
          top: 4px;
          left: 4px;
          display: none;
          width: 16px;
          height: 16px;
          &.checkIn {
            display: block;
          }
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
              color: #247af3;
            }
          }
        }
      }
      .fileTitle {
        font-size: 14px;
        color: $color-53;
        text-align: center;
      }
      .fileName {
        max-height: 40px;
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
    .nothingText {
      height: 400px;
      padding: 0;
      margin-top: 30px;
      font-size: 14px;
      line-height: 400px;
      color: #909399;
      text-align: center;
    }
  }
}
.addVideoDialog .dialogContent .fileList .imgBox:hover .itemCheckBox,
.addVideoDialog .dialogContent .fileList .imgBox:hover .settingBox {
  display: block;
}
</style>

<style lang="scss">
.addVideoDialog {
  &.tsFaiModal {
    .fa-modal-body {
      padding: 0;
    }
  }
  .fa-menu {
    &.fa-menu-mixed {
      &.fa-menu-vertical {
        & > .fa-menu-item-selected {
          color: #247af3;
          border-right: none;
          &.fa-menu-item {
            &:last-child {
              border-bottom: 1px solid $border-disabled-color;
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
        border-right: 1px solid $border-disabled-color;
        border-bottom: 1px solid $border-disabled-color;
        box-sizing: border-box;
        &::after {
          border-right: 3px solid #247af3;
        }
        &:hover {
          color: #247af3;
        }
        &:last-child {
          border-bottom: none;
        }
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
.addVideoDialog .fa-menu-mixed.fa-menu-inline,
.addVideoDialog .fa-menu-mixed.fa-menu-vertical {
  padding-top: 0;
  background-color: $color-ff;
}
.addVideoDialog .fa-menu-radius-top,
.addVideoDialog .fa-menu-radius-bottom {
  display: none;
}
.progressBox {
  width: 60px;
  .fa-progress-inner {
    background: $border-color;
  }
}

/* 公司树形组件 */
.ts-fa-tree-select .fa-select-tree li .fa-select-tree-node-content-wrapper {
  width: auto;
}
</style>

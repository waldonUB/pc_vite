<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:11:14
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 15:17:39
-->
<template>
  <global-ts-wx-work-dialog
    class="uploadAllFileDailog"
    :withTitle="true"
    dialogSize="large"
    :tsDialogVisible.sync="dialogVisible"
    :disabledSureBtn="disabledSureBtn"
    @cancel="cancelUpload"
    @sure="saveUpload"
  >
    <p class="title" slot="title">
      上传文件
    </p>
    <div class="uploadContent">
      <div class="headLine flex">
        <div class="positionBox flex flex-vc flexItem">
          <div class="flexItem">上传至</div>
          <div class="selectBox">
            <selectFolderList
              v-if="dialogVisible"
              ref="selectFolderList"
              :showInputFolderIcon="true"
              :defaultSelectId="checkFolderId"
              size="small"
              @select="selectFolder"
            >
            </selectFolderList>
          </div>
          <global-ts-button class="newAddBtn flexItem" size="small" type="mainText" @click="newAddFolder">
            新建文件夹
          </global-ts-button>
        </div>
        <global-ts-point-upload
          class="materialTextUploadBox flexItem"
          :multiple="true"
          :accept="fileAcceptCal"
          :isShowFileList="false"
          :limitSize="fileLimitSize"
          :isShowLoading="false"
          :sizeCheckTip="fileSizeCheckTip"
          :customBeforeUpload="customBeforeUpload"
          @beforeUpload="file => beforeUpload(file, CategoryDef)"
          @uploadProgress="uploadProgress"
          @breakupload="breakUpload"
          @uploadError="uploadError"
        >
          <global-ts-button class="uploadBtn" size="small">上传文件</global-ts-button>
        </global-ts-point-upload>
      </div>
      <div class="fileListBox">
        <div class="listBox flex">
          <div v-for="(item, index) in showUploadList" class="itemBox" :key="index">
            <global-ts-tool-tips class="item" effect="dark" :disabled="!item.fail" placement="top">
              <div slot="content" class="uploadErrTip">
                格式错误！<br />
                格式：仅支持png、jpg、jpeg、ppt、pptx、pdf、doc、docx、xls、xlsx、mp4
              </div>
              <div>
                <div :class="['imgBox flex flex-hc flex-vc', { successImgBox: item.success }]">
                  <img class="fileImg" :src="getIcon(item)" v-if="item.success" />
                  <img class="fileImg" :src="iconErrIMG" v-else-if="item.fail" />
                  <div v-else>
                    <div class="uploadText">文件上传中</div>
                    <fa-progress
                      class="progressBox"
                      :percent="item.progress"
                      size="small"
                      :showInfo="false"
                      :strokeWidth="2"
                    ></fa-progress>
                  </div>
                  <div class="grayMask" v-if="item.success || item.fail" @click="removeFile(item)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-icon-10"></use>
                    </svg>
                  </div>
                </div>
                <div
                  :class="['fileTitle multiTextEllipsis', { fileErr: item.fail }]"
                  @click="showEditName(item, index)"
                >
                  <fa-input
                    v-model="item.editName"
                    tstype="text"
                    placeholder="请输入名称"
                    v-if="item.showEditName"
                    :autofocus="true"
                    @focus="(e, flag) => changeFocus(flag, item, index)"
                    @change="newVal => changeValue(item, index, newVal)"
                    size="small"
                  >
                  </fa-input>
                  <div v-else>{{ item.editName }}</div>
                </div>
              </div>
            </global-ts-tool-tips>
          </div>
        </div>
      </div>
      <global-ts-fai-pagination
        class="paginationBox"
        @changePage="changeShowUploadList"
        :withMargin="false"
        :showSizeChanger="false"
        :pageOption.sync="pages"
      >
      </global-ts-fai-pagination>
    </div>
  </global-ts-wx-work-dialog>
</template>

<script>
import { confirm, getUrL, getFileName, showCapacityTip } from '@/utils';
import selectFolderList from '../select-folder-list/index.vue';
import editFolderDialog from '../edit-folder-dialog/index.vue';
import { CategoryDef, GROUPTYPE } from '../../config';
import iconErrIMG from '@/assets/image/material/icon_err.png';
import iconWordIMG from '@/assets/image/material/icon_word.png';
import iconExcelIMG from '@/assets/image/material/icon_excel.png';
import iconPdfIMG from '@/assets/image/material/icon_pdf.png';
import iconPptIMG from '@/assets/image/material/icon_ppt.png';
import iconVideoIMG from '@/assets/image/material/icon_video.png';
import { batchAddMaterialInfo } from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'upload-all-file-dialog',
  components: {
    // editFolderDialog,
    selectFolderList,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    checkFolderId: {
      // 默认选中的文件夹
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      uploadList: [], // 全部上传的文件列表
      showUploadList: [], // 当前页面显示的文件列表
      successList: [], // 上传成功的文件列表
      // selectFolderId: 0, // 指定文件夹,默认为"企业文件根目录"
      imgAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      docAcceptCal: '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx',
      videoAcceptCal: '.mp4',
      fileAcceptCal: [
        // 文件上传类型限制
        '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx',
        '.mp4',
        '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      ],
      fileLimitSize: [200, 500, 10], // 文件大小限制
      fileSizeCheckTip: ['请上传200M以内的文档', '请上传500M以内的视频', '请上传10m以内的图片'],
      // uploadImgUrl: Ts_util.http.getUrL('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=uploadFileTmp'),
      uploadImgUrl: getUrL('/ajax/upload_h.jsp?cmd=uploadTmpFile'),
      requestParam: {
        // 保存接口请求数据
        isCorp: false, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
        groupId: 0, // 选中文件夹id,默认为"企业文件根目录"
        content: '', // 文件列表
      },
      CategoryDef: CategoryDef,
      pages: {
        pageNow: 1,
        limit: 24,
        // limit: 2,
        maxPage: 1,
        total: 0,
      },
      disabledSureBtn: false, // 是否禁用确认按钮
      // editFolderDialogVisible: false, // 新建文件夹窗口是否可见
    };
  },
  computed: {
    iconErrIMG() {
      return iconErrIMG;
    },
    // disabledSureBtn() { // 是否禁用确认按钮
    //     return !this.successList.length
    // }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        // 初始化数据
        this.uploadList = [];
        this.showUploadList = [];
        console.log('?????');
        this.pages = {
          pageNow: 1,
          limit: 24,
          // limit: 2,
          maxPage: 1,
          total: 0,
        };
        this.successList = [];
        this.requestParam = {
          isCorp: false, //是否为企业文件夹 true:企业文件夹 false:个人文件夹
          groupId: this.checkFolderId || 0, // 选中文件夹id,默认为"企业文件根目录"
          content: '', // 文件列表
        };
      }
    },
    /**
     * 监听默认选中的文件夹
     * @author lymn
     * @date 2020-11-21
     */
    checkFolderId(newVal) {
      this.requestParam.groupId = newVal;
    },
    successList(newVal) {
      this.disabledSureBtn = !this.successList.length;
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 点击后编辑名称
     * @author lymn
     * @date 2020-11-02
     * @param {Object} item 对应的文件
     */
    showEditName(item, index) {
      if (item.success) {
        // 下载成功后才能编辑名称
        item.showEditName = true;
        this.$forceUpdate();
        // this.$set(this.uploadList, index, this.uploadList[index])
      }
    },
    /**
     * 修改文件名称
     * @author lymn
     * @date 2020-11-02
     * @param {String} newVal 新的名称
     */
    changeValue(file, index, newVal) {
      this.successList.find((item, index) => {
        if (item.uid == file.uid) {
          if (newVal) {
            const suffix = getFileName(item.name)[1]; // 文件后缀名
            item.name = newVal + suffix;
          } else {
            file.editName = getFileName(item.name)[0]; // 如果输入为空，则默认置为之前的名称
          }
          return true;
        }
      });
      file.showEditName = false;
      this.$forceUpdate();
      // this.$set(this.uploadList, index, this.uploadList[index])
    },
    /**
     * 聚焦/失焦
     * @author lymn
     * @date 2020-11-02
     * @param {Object} e event事件
     * @param {Boolean} flag 聚焦时为true，失焦时为false
     */
    changeFocus(flag, item, index) {
      if (!flag) {
        // 失去焦点
        item.showEditName = false;
        this.$forceUpdate();
        // this.$set(this.uploadList, index, this.uploadList[index])
      }
    },
    /**
     * 删除文件
     * @author lymn
     * @date 2020-11-02
     * @param {Object} file 要删除的文件
     */
    removeFile(file) {
      if (file.success) {
        confirm('确认删除吗').then(() => {
          this.removeItem(file);
        });
      } else {
        this.removeItem(file);
      }
    },
    removeItem(file) {
      const uid = file.uid;
      this.uploadList.find((item, index) => {
        if (item.uid == uid) {
          console.log(item.uid);
          this.uploadList.splice(index, 1);
          this.updatePageData();
          return true;
        }
      });
      this.successList.find((item, index) => {
        if (item.uid == uid) {
          this.successList.splice(index, 1);
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
    beforeUpload(file) {
      const nameArr = getFileName(file.name);
      let categoryType;
      if (this.docAcceptCal.indexOf(nameArr[1]) != -1) {
        categoryType = 1;
      } else if (this.imgAcceptCal.indexOf(nameArr[1]) != -1) {
        categoryType = 2;
      } else {
        categoryType = 3;
      }
      file.category = categoryType;
      file.editName = nameArr[0];
      file.progress = 0; // 初始化进度条
      this.uploadList.push(file);
      this.updatePageData();
    },
    // /**
    //  * 自定义上传
    //  * @author waldon
    //  * @date 2020/12/15
    //  * @param {Object} fileInfo - 文件信息
    //  */
    // customRequest (fileInfo) {
    //     let uploadSuccess = (file) => {
    //         return (res) => {
    //             res.url = res.fullViewUrl
    //             res.name = res.fileName
    //             res.size = res.encodeSize
    //             res.content = res.id
    //             this.uploadSuccess(res, file)
    //         }
    //     }
    //     let uploadProgress = (file) => {
    //         return (res) => {
    //             res.percent = res.total.percent
    //             this.uploadProgress(res, file)
    //         }
    //     }
    //     let uploadError = (file) => {
    //         return (res) => {
    //             this.$utils.postMessage({
    //                 type: "error",
    //                 message: res.message || "网络错误，请稍候重试"
    //             });
    //             this.setStatus(false, file)
    //         }
    //     }
    //     let uploadOption = {
    //         tempFilePath: fileInfo.file,
    //         isComm: false,
    //         putExtra: {
    //             fileName: fileInfo.file.name
    //         },
    //         next: uploadProgress(fileInfo.file),
    //         complete: uploadSuccess(fileInfo.file),
    //         error: uploadError(fileInfo.file)
    //     }
    //     Ts_util.tsFaiUpload(uploadOption)
    // },
    /**
     * 更新上传进度
     * @author lymn
     * @date 2020-10-29
     * @param {Boolean} param
     * @return {Boolean} return
     */
    uploadProgress(res, file) {
      // console.log(res, file, '进度变化')
      this.uploadList.find((item, index) => {
        if (item.uid == file.uid) {
          const progress = res.percent; // 更新进度条
          this.uploadList[index].progress = progress;
          // this.$set(this.uploadList, index, this.uploadList[index]) // 更新所有上传文件的进度

          // let prePage = Math.floor(index / this.pages.limit)
          // let prePageLimit =  (this.pages.pageNow - 1) * this.pages.limit
          // let showIndex
          // if (prePageLimit > 0) {
          //     showIndex = index % ((this.pages.pageNow - 1) * this.pages.limit) // 当前页码下文件的索引
          // } else {
          //     showIndex = index
          // }
          // if (showIndex < this.pages.limit && prePage == this.pages.pageNow) {
          //     // 更新当前可见文件的上传进度
          //     this.$set(this.showUploadList, showIndex, this.uploadList[index])
          // }
          this.$forceUpdate();
          return true;
        }
      });
    },
    /**
     * 上传文件结果
     * @author lymn
     * @date 2021-01-12
     */
    breakUpload(res, file) {
      this.setStatus(true, file, res);
    },
    /**
     * 上传图片结果
     * @author lymn
     * @date 2020-10-29
     * @param {Boolean} param
     * @return {Boolean} return
     */
    uploadSuccess(res, file, fileList) {
      if (res.id) {
        file.category = CategoryDef.img;
        this.setStatus(true, file, res);
      } else {
        this.setStatus(false, file);
      }
    },
    // /**
    //  * 上传文档结果
    //  * @author lymn
    //  * @date 2020-10-29
    //  * @param {Boolean} param
    //  * @return {Boolean} return
    //  */
    // breakUploadDoc(res, file) {
    //     this.setStatus(true, file, res)
    //     Ts_util.loading.poupQuene("breakUploadLoading");
    // },
    /**
     * 取消
     * @author lymn
     * @date 2020-10-29
     */
    cancelUpload() {
      console.log('关闭弹窗');
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 保存
     * @author lymn
     * @date 2020-10-29
     */
    async saveUpload() {
      if (this.successList.length === 0) {
        this.$utils.postMessage({
          type: 'error',
          message: '请上传文件',
        });
        return;
      }

      // let params = {
      //     groupId: this.requestParam.groupId,
      //     content: JSON.stringify(this.successList),
      //     // typeGroup: 12
      //     isCorp: false
      // }
      this.disabledSureBtn = true;
      const [err, res] = await batchAddMaterialInfo(
        Object.assign(this.requestParam, {
          content: JSON.stringify(this.successList),
          typeGroup: GROUPTYPE,
        }),
      );
      if (err) {
        showCapacityTip(err);
        this.disabledSureBtn = false;
        return Promise.reject(err);
      }
      this.$emit('update:dialogVisible', false);
      this.$utils.postMessage({
        type: 'success',
        message: '上传成功',
      });
      this.$emit('success');
    },
    // /**
    //  * 上传视频结果
    //  * @author lymn
    //  * @date 2020-10-30
    //  * @param {Boolean} param
    //  * @return {Boolean} return
    //  */
    // breakUploadVideo(res, file) {
    //     console.log(res, file, '视频文件')
    //     this.setStatus(true, file, res)
    //     Ts_util.loading.poupQuene("breakUploadLoading");
    // },
    /**
     * @author lymn
     * @date 2020-10-30
     * @param {Boolean} param
     * @return {Boolean} return
     */
    beforeUploadDoc(file) {
      console.log(file, '上传图片前');
    },
    /**
     * 获取文件图片
     * @author lymn
     * @date 2020-11-02
     * @param {Boolean} param
     * @return {Boolean} return
     */
    getIcon(file) {
      const fileName = file.name;
      if (fileName && fileName.includes('.')) {
        const fileNames = fileName.split('.');
        const fileType = fileNames[fileNames.length - 1];
        switch (fileType) {
          case 'doc':
          case 'docx':
            return iconWordIMG;
          case 'xls':
          case 'xlsx':
            return iconExcelIMG;
          case 'pdf':
            return iconPdfIMG;
          case 'ppt':
          case 'pptx':
          case 'pps':
          case 'ppsx':
            return iconPptIMG;
          case 'jpg':
          case 'jpeg':
          case 'png':
            return file.url;
          case 'mp4':
          case 'MP4':
            return file.coverImg || iconVideoIMG;
        }
      }
    },
    /**
     * 文件的上传结果
     * @author lymn
     * @date 2020-11-02
     * @param {Boolean} isSuccess 是否上传成功
     * @param {Object} file
     * @param {Object} data 文件
     * @param {Boolean}
     */
    setStatus(isSuccess, file, data) {
      if (isSuccess) {
        let newSuccessFile = data;
        console.log(file.category, file, data, '设置成功状态');
        // if ([CategoryDef.doc, CategoryDef.video].includes(file.category)) {
        // 文档和视频
        newSuccessFile = {
          uid: file.uid,
          name: data.name,
          content: data.id,
          type: data.type,
          size: data.size,
        };
        switch (file.category) {
          case CategoryDef.video:
            newSuccessFile.coverImg = data.frameInfo.frameImgId;
            break;
          case CategoryDef.img:
            newSuccessFile.url = data.fullViewUrl;
            break;
        }
        // if (file.category == CategoryDef.video) {
        //     // 视频
        //     // file.coverImg = data.frameInfo.frameImgId
        //     newSuccessFile.coverImg = data.frameInfo.frameImgId
        // }
        // } else {
        // file.url = data.fullViewUrl // 图片路径
        // newSuccessFile = data
        // }
        // newSuccessFile.uid =  file.uid
        // newSuccessFile.editName = file.name // 可编辑名称

        console.log(newSuccessFile, '上传成功的文件');
        this.successList.push(newSuccessFile);
      }
      console.log();
      this.uploadList.find((item, index) => {
        if (item.uid == file.uid) {
          if (isSuccess) {
            this.uploadList[index].success = true;
            if (file.category == CategoryDef.video) {
              this.uploadList[index].coverImg = data.frameInfo.frameImgId;
            } else if (file.category == CategoryDef.img) {
              this.uploadList[index].url = data.fullViewUrl;
            }
          } else {
            this.uploadList[index].fail = true;
          }

          this.$forceUpdate();
          // console.log(this.uploadList, 'uploadList===')
          // this.$set(this.uploadList, index, this.uploadList[index])
          return true;
        }
      });
    },
    selectFolder(selectKey) {
      // this.selectFolderId = selectKey
      this.requestParam.groupId = selectKey;
    },
    /**
     * 新建文件夹
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    newAddFolder() {
      this.$emit('showNewFolderDialog');
    },
    /**
     * 刷新文件层级列表数据
     * @author lymn
     * @date 2020-11-10
     */
    updateFolderList() {
      this.$refs.selectFolderList.getFolderList();
      this.$emit('updateData'); // 新建文件夹后,也要刷新文件夹页数据
    },
    /**
     * 断点上传失败
     * @author lymn
     * @date 2020-11-18
     * @param {Object} file 文件对象
     */
    uploadError(file) {
      this.setStatus(false, file);
      console.log(file, '文件对象');
    },
    /**
     * 上传图片前校验
     * @author lymn
     * @date 2020-11-21
     */
    checkImgBeforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = '.' + fileNames[fileNames.length - 1];
        const imgAcceptArr = this.imgAcceptCal.split(',');
        if (!imgAcceptArr.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '文件类型不符合规范，请上传jpg/jpeg/png格式的图片',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败，请上传10m以内的图片',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
      return true;
    },
    /**
     * 更新分页信息
     * @author lymn
     * @date 2021-01-06
     */
    updatePageData() {
      this.pages.total = this.uploadList.length;
      this.pages.maxPage = Math.ceil(this.uploadList.length / this.pages.limit);
      if (this.pages.pageNow > this.pages.maxPage) this.pages.pageNow = this.pages.maxPage || 1;
      console.log(this.pages, 'pages');
      this.changeShowUploadList();
    },
    /**
     * 切换分页
     * @author lymn
     * @date 2021-01-06
     * @param {Boolean} param
     * @return {Boolean} return
     */
    changeShowUploadList() {
      const { pageNow, limit, total } = this.pages;
      const maxLimit = pageNow * limit > total ? total : pageNow * limit;
      this.showUploadList = this.uploadList.slice((pageNow - 1) * limit, maxLimit);
      console.log((pageNow - 1) * limit, maxLimit, this.showUploadList, 'changeShowUploadList');
    },
    /**
     * 自定义检验图片
     * @author lymn
     * @date 2021-01-20
     * @param {Boolean} param
     * @return {Boolean} return
     */
    customBeforeUpload(file) {
      const sameItem = this.uploadList.find(item => item.name == file.name);
      if (sameItem) return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-all-file-dialog {
}
</style>

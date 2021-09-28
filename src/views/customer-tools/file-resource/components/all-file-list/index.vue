<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:24:01
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-01 18:00:15
-->
<template>
  <div class="allFileBox">
    <global-ts-header>
      <template v-slot:leftPart>
        <div v-if="filePath.length == 1 || isSearchStatus">
          产品文件
        </div>
        <div v-else class="flex flex-vc crubmbsBox">
          <div
            v-for="(item, index) in filePath"
            :class="['flex', 'flex-vc', 'crubmbsItem', { finalBox: index == filePath.length - 1 }]"
            :key="index"
            @click="goBackFile(item, index)"
          >
            <div :class="[index == filePath.length - 1 ? 'currentFilePath' : 'filePath', 'tanshu-ellipsis']">
              {{ item.name }}
            </div>
            <global-ts-svg-icon v-if="index < filePath.length - 1" class="filePathIcon" name="icon-xiangyou1616" />
          </div>
        </div>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="">
        <div class="pro_line">
          <fa-input
            style="width: 200px;"
            v-model="requestParam.name"
            placeholder="搜索文件/文件夹"
            @keyup.enter.native="reloadDataList"
          >
          </fa-input>
          <global-ts-button
            class="materialBtn materialSearchBtn"
            type="primary"
            size="small"
            icon="icon-icon-4"
            @click="reloadDataList"
          >
            搜索
          </global-ts-button>
        </div>
        <div class="fileList flex" v-if="fileList.length">
          <div v-for="(item, index) in fileList" class="itemBox" :key="index">
            <div class="imgBox" :class="[{ checkImgBox: checkIds.includes(item.id) }, { boxPointer: item.isDir }]">
              <div @click="gotoChildFile(item)">
                <img class="itemImg" :src="getIcon(item)" />
                <global-ts-svg-icon v-if="item.isSystem" class="icon systemIcon" name="icon-wenjianjiashezhi32" />
              </div>
              <global-ts-tool-tips v-if="[1, 2, 3].includes(item.gfwStatus)" popperClass="wxPersonGfwTipsBox">
                <div slot="content">
                  {{ item.gfwStatus == 1 ? '当前正在审查中，审核通过后将重新开启' : item.gfwStatusReason }}
                </div>
                <div class="gfwBox">
                  {{ item.gfwStatus == 1 ? '审查中' : '已封禁' }}
                  <global-ts-svg-icon class="icon helpIcon" name="icon-bianzu" @click="toHelpCenter" />
                </div>
              </global-ts-tool-tips>
              <global-ts-dropdown-btn
                :class="{ showDropDownBtn: item.isShowSettingMenu }"
                :visible.sync="item.isShowSettingMenu"
                bindClassStyle="fileMoreBtn"
                :downData="settingDownData(item)"
                :getPopupContainer="getPopupContainer"
                @handleClick="settingItem => downSettingClick(settingItem, item)"
              >
                <global-ts-morebtn :isCheck="item.isShowSettingMenu"></global-ts-morebtn>
              </global-ts-dropdown-btn>
            </div>
            <div class="fileTitle multiTextEllipsis">
              <div :class="['fileName', { canEdit: !item.isSystem }]">{{ item.isDir ? item.name : item.commName }}</div>
            </div>
          </div>
        </div>
        <div class="nothingText" v-else>
          暂无文件，点击右上角【上传文件】按钮进行上传吧
        </div>
        <global-ts-fai-pagination
          class="paginationBox"
          @changePage="getFileList"
          :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
          :withMargin="false"
          :pageOption.sync="pages"
        >
        </global-ts-fai-pagination>
      </div>
    </div>
    <moveFolderDialog
      :dialogVisible.sync="moveFolderDisable"
      :checkItems="checkItems"
      :checkIds="checkIds"
      @updateData="getFileList"
    ></moveFolderDialog>
    <editFolderDialog :editItem="editItem" :dialogVisible.sync="editFolderDialogVisible" @success="addFolderSuccess">
    </editFolderDialog>
    <materialDetailDialog
      @editSuccess="initPageData"
      :dialogVisible.sync="materialDetailDialogVisible"
      :currentMaterialData="editItem"
      :materialType="editFileType"
      :materialFile="editItemContent"
    >
    </materialDetailDialog>
    <videoEditDialog
      @editSuccess="initPageData"
      :dialogVisible.sync="videoEditDialogVisible"
      :currentVideoData="editItem"
    >
    </videoEditDialog>
    <fileAttrDialog :file="editItem" :dialogVisible.sync="fileAttrDialogVisible"> </fileAttrDialog>
  </div>
</template>

<script>
import { confirm, getIcon } from '@/utils';
import editFolderDialog from '../edit-folder-dialog/index.vue';
import fileAttrDialog from '../file-attr-dialog/index.vue';
import moveFolderDialog from '../move-folder-dialog/index.vue';
// import uploadAllFileDialog from '../upload-all-file-dialog/index.vue';
import materialDetailDialog from '../material-detail-dialog/index.vue';
import videoEditDialog from '../video-edit-dialog/index.vue';
import { CategoryDef, GROUPTYPE } from '../../config';
import { mapState } from 'vuex';
import { getFileCategory } from '../../utils';
import iconFileIMG from '@/assets/image/material/icon_file.png';
import iconVideoIMG from '@/assets/image/material/icon_video.png';
import {
  batchDelFileOrDir,
  getProductMaterialList,
  setTsGroup,
} from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'all-file-list',
  components: {
    fileAttrDialog, // 文件/文件夹属性弹窗
    moveFolderDialog, // 移动弹窗
    // uploadAllFileDialog, // 上传文件弹窗
    editFolderDialog, // 编辑/创建文件夹弹窗
    materialDetailDialog, // 文档/图片编辑弹窗
    videoEditDialog, // 视频编辑弹窗
  },
  props: {},
  data() {
    return {
      // GROUPTYPE: GROUPTYPE, // 类型 12:企业文件
      requestParam: {
        // 搜索条件
        name: '', // 根据文件名称查询
        typeGroup: GROUPTYPE,
        groupId: '', // 文件夹id,0/空:根目录 -1:全局搜索
      },
      // downData: [ // 批量按钮列表
      //     {
      //         type: 1,
      //         name: '批量移动'
      //     },
      //     {
      //         type: 2,
      //         name: '批量删除'
      //     }
      // ],
      fileList: [], // 文件数据
      isAllCheck: false, // 是否全部选中
      name: '', // 编辑框的名称
      showInput: [], // 是否显示编辑框
      filePath: [
        {
          // 文件路径 {id: 文件夹id, name: 文件夹名称}
          name: '产品文件夹',
        },
      ],
      // searchName: '', // 搜索内容
      checkItems: [], // 选中的文件夹/文件 {isDir: 是否为文件夹, id: 文件夹/文件id}
      checkIds: [], // 选中的文件夹/文件id
      // availCapacity: 0, // 剩余容量
      isOpenMatCapLimit: false, // 是否开启限制个人容量
      pages: {
        // 分页
        pageNow: 1,
        limit: 100,
        maxPage: 2,
        total: 50,
      },
      moveFolderDisable: false, // 是否显示移动弹窗
      editFolderDialogVisible: false, // 是否显示新建文件夹窗口
      materialDetailDialogVisible: false, // 是否显示编辑图片/文档弹窗
      videoEditDialogVisible: false, // 是否显示视频编辑弹窗
      fileAttrDialogVisible: false, // 是否显示属性弹窗
      editItem: {}, // 待编辑的文件夹/文件
      showSettingBoxId: '', // 显示设置按钮列表的文件/文件夹id
      editItemContent: [], // 待编辑的文档的内容
      editFileType: '', // 编辑的文件类型 'doc':文档 'img':图片
      isSearchStatus: false, // 是否处于搜索状态,如果是的话不显示面包屑导航
      checkFolderId: 0, // 选中文件夹的id
      pageStatus: 'normal', // normal：正常展示，search：搜索状态， result:搜索结果
      isLoading: false, // 防止多次点击文件夹，导致面包屑重复，这里用防抖指令会导致创建新文件夹时，点击文件夹获取的文件夹信息不是最新的
      getListUrlArr: [
        '/rest/manage/library/getProductMaterialList',
        '/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getFileMatList',
      ],
      getListUrl: '/rest/manage/library/getProductMaterialList', // 请求文件列表接口
      uploadDialogVisible: false, // 是否显示上传文件窗口
    };
  },
  computed: {
    ...mapState({
      upgradeUrl: state => state.globalData?.addressUrl?.updateVersionUrl, // 升级链接
      wxWorkConf: state => state.globalData?.wxWorkConf,
    }),
    // indeterminate() { // 是否显示部分选中状态
    //     return !!this.checkIds.length && !this.isAllCheck
    // }
  },
  watch: {
    checkIds(newVal) {
      // if (!newVal.length) {
      //     this.isAllCheck = false
      // }
      if (this.fileList.length && newVal.length == this.fileList.length) {
        this.isAllCheck = true;
      } else {
        this.isAllCheck = false;
      }
    },
    fileList(newVal) {
      if (!newVal.length) this.isAllCheck = false;
    },
  },
  created() {
    this.getFileList();
    // this.getOpacity();
  },
  mounted() {},
  methods: {
    initName() {
      this.requestParam.name = '';
    },
    /**
     * 刷新页面数据,包括文件列表和容量
     * @author lymn
     * @date 2020-11-12
     */
    initPageData() {
      this.getFileList();
      // this.getOpacity()
    },
    /**
     * 返回设置项
     * @author lymn
     * @date 2020-11-10
     * @param {Object} file 文件夹
     * @param {Boolean} isDir 是否为文件夹,文件夹没有下载按钮
     * @return {Object} downItem 设置按钮项
     */
    settingDownData(file) {
      const downItem = [
        {
          type: 5,
          name: '复制',
          iconName: 'icon-fuzhi1616',
        },
        {
          type: 4,
          name: '属性',
          iconName: 'icon-shuxing1616',
        },
      ];
      // 文件
      if (!file.isDir) {
        downItem.unshift({
          type: 1,
          name: '下载',
          iconName: 'icon-xiazai1616',
        });
      }
      return downItem;
    },
    // settingDownData()
    /**
     * 跳转帮助页
     * @author lymn
     * @date 2020-11-07
     */
    toHelpCenter() {
      window.open(this.wxWorkConf.compMaterialConf.helpDoc, '_blank');
    },
    /**
     * 搜索,不论处于哪个位置,这里都是全局搜索,搜索状态时不显示面包屑导航
     * @author lymn
     * @date 2020-11-02
     */
    reloadDataList() {
      if (this.requestParam.name) {
        this.requestParam.groupId = -1; // 搜索状态
      } else {
        this.requestParam.groupId = 0; // 非搜索状态要指向根目录
      }
      (this.filePath = [
        {
          // 文件路径 {id: 文件夹id, name: 文件夹名称}
          name: '产品文件夹',
        },
      ]),
        (this.pages.pageNow = 1);
      // this.requestParam.name = this.searchName
      this.getFileList().then(() => {
        // this.requestParam.name = ''
      });
    },
    // /**
    //  * 点击批量操作选项
    //  * @author lymn
    //  * @date 2020-11-07
    //  * @param {Object} item 批量操作选项
    //  */
    // downItemClick(item) {
    //     // console.log(arguments, '批量按钮')
    //     switch (item.type) {
    //         case 1:
    //             this.batchMove()
    //             break
    //         case 2:
    //             this.batchDelete(this.checkItems)
    //             break
    //     }
    // },
    /**
     * 删除文件
     * @author lymn
     * @date 2020-11-07
     * @param {Array} delList 要删除的文件列表 {isDir: 是否为文件夹, id: 文件夹/文件id}
     */
    batchDelete(delList) {
      const params = {
        delList: JSON.stringify(delList), // 待删除的列表
      };
      confirm('确认将所选内容放入回收站吗').then(async () => {
        const [err, res] = await batchDelFileOrDir(params);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '删除成功',
        });
        this.initPageData();
      });
    },
    /**
     * 批量移动
     * @author lymn
     * @date 2020-11-07
     */
    batchMove() {
      this.moveFolderDisable = true;
    },
    /**
     * 显示编辑框
     * @author lymn
     * @date 2020-11-03
     * @param {Object} item 文件
     * @param {Number} index 文件索引
     * @return {Boolean} return
     */
    showEditName(item, index) {
      if (!item.isSystem) {
        // 系统资源文件不可修改
        this.showInput[index] = true;
        this.$set(this.showInput, index, true);
        this.name = item.isDir ? item.name : item.commName;
      }
    },
    /**
     * 点击设置列表中的选项
     * @author lymn
     * @date 2020-11-03
     * @param {Object} downItem 选中的设置按钮项
     * @param {Object} fileItem 选中的文件项
     */
    downSettingClick(downItem, fileItem) {
      // console.log(arguments)
      this.editItem = fileItem;
      fileItem.isShowSettingMenu = false;
      this.$forceUpdate();
      switch (downItem.type) {
        case 1:
          // 下载
          window.open(fileItem.pcDownloadPath);
          break;
        case 5:
          // 复制
          if (fileItem.isDir) {
            this.editFolderDialogVisible = true;
          } else {
            const category = getFileCategory(fileItem.name);
            switch (category) {
              case CategoryDef.doc:
                this.materialDetailDialogVisible = true;
                this.editFileType = 'doc';
                this.editItemContent = [
                  {
                    content: fileItem.content,
                    name: fileItem.name,
                    size: fileItem.size,
                    type: fileItem.type,
                  },
                ];
                break;
              case CategoryDef.img:
                this.materialDetailDialogVisible = true;
                this.editFileType = 'img';
                break;
              case CategoryDef.video:
                this.videoEditDialogVisible = true;
                break;
            }
          }
          break;
        case 3:
          // 删除
          this.batchDelete([
            {
              isDir: fileItem.isDir,
              id: fileItem.id,
            },
          ]);
          break;
        case 4:
          // 属性
          this.fileAttrDialogVisible = true;
          break;
      }
    },
    /**
     * 设置下拉框显示/隐藏
     * @author lymn
     * @date 2020-11-10
     * @param {Boolean} isShow true则为显示,false则为隐藏
     * @param {Object} file 点击对应的文件
     */
    downSettingVisible(isShow, file) {
      if (isShow) this.showSettingBoxId = file.id;
      else this.showSettingBoxId = '';
    },
    /**
     * 获取文件列表
     * @author lymn
     * @date 2020-11-03
     * @param {Object} otherParam 其他额外配置的参数
     */
    async getFileList(otherParam) {
      const [err, res] = await getProductMaterialList(Object.assign({}, this.requestParam, this.pages, otherParam));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.fileList = res.data;
      this.pages.total = res.total;
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit) || 1;
      // if (!this.fileList.length && this.pages.total && (this.pages.pageNow > this.pages.maxPage)) {
      //     // 处理最后一页数据被清空的情况，更新页码
      //     this.pages.pageNow = this.pages.maxPage
      // }
      // 判断搜索状态
      if (this.requestParam.name) {
        this.isSearchStatus = true;
        this.filePath = [
          {
            name: '产品文件夹',
          },
        ]; // 初始化面包屑导航
      } else {
        this.isSearchStatus = false;
      }
      this.initCheckStatus(); // 初始化选中状态，避免多种特殊情况难以处理
      // console.log(this.fileList, '文件列表')
      return Promise.resolve();
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
        this.$set(this.showInput, index, false);
      }
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
        this.checkItems.push({
          isDir: item.isDir,
          id: item.id,
        });
        this.checkIds.push(item.id);
      } else {
        // 取消选中
        this.isAllCheck = false;
        this.checkItems.find((checkItem, index) => {
          if (checkItem.id == item.id) {
            this.checkItems.splice(index, 1);
            this.checkIds.splice(index, 1);
            return true;
          }
        });
      }
    },
    /**
     * 点击全选按钮
     * @author lymn
     * @date 2020-11-07
     * @param {Boolean} param
     * @return {Boolean} return
     */
    // setAllCheck(e) {
    //     let isCheck = e.target.checked
    //     this.setAllCheckStatus(isCheck)
    // },
    /**
     * 设置全选状态
     * @author lymn
     * @date 2020-11-07
     * @param {Boolean} param
     * @return {Boolean} return
     */
    setAllCheckStatus(isCheck) {
      this.isAllCheck = isCheck;
      this.checkItems = [];
      this.checkIds = [];
      if (isCheck) {
        this.fileList.forEach(item => {
          if (!item.isSystem) {
            this.checkItems.push({
              isDir: item.isDir,
              id: item.id,
            });
            this.checkIds.push(item.id);
          }
        });
      }
    },
    /**
     * 获取文件夹/文件icon
     * @author lymn
     * @date 2020-11-07
     * @param {Object} file
     */
    getIcon(file) {
      if (file.isDir) {
        return iconFileIMG;
      } else {
        // if ([2,3]file.category)
        file.category = getFileCategory(file.name);
        switch (
          file.category // 1:文档 2:图片 3:视频
        ) {
          case CategoryDef.doc:
            return getIcon(file.name);
          case CategoryDef.img:
            return file.content;
          case CategoryDef.video:
            return file.coverImgUrl || iconVideoIMG;
        }
      }
    },
    /**
     * 获取子级文件夹/文件
     * @author lymn
     * @date 2020-11-07
     * @param {Object} 文件
     */
    gotoChildFile(file) {
      if (file.isDir && !this.isLoading) {
        this.requestParam.name = ''; // 清空搜索名称
        this.pages.pageNow = 1;
        this.requestParam.groupId = file.id;
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
    // showUploadFile() {
    //     this.checkFolderId = this.requestParam.groupId > 0 ? this.requestParam.groupId : 0
    //     this.uploadDialogVisible = true
    // },
    /**
     * 面包屑导航跳转
     * @author lymn
     * @date 2020-11-07
     * @param {Object} item 导航项
     * @param {Number} index 导航索引
     */
    goBackFile(item, index) {
      if (index == this.filePath.length - 1) return;
      this.requestParam = {
        typeGroup: GROUPTYPE,
        groupId: index == 0 ? '' : item.id,
        name: '',
      };
      this.getFileList().then(() => {
        this.initCheckStatus();
        this.filePath = this.filePath.slice(0, index + 1);
      });
    },
    /**
     * 创建文件夹
     * @author lymn
     * @date 2020-11-07
     */
    // addNewGroup() {
    //     console.log(this.filePath, 'filePath')
    //     if (this.filePath.length >= 5) {
    //         // 文件夹层级不能高于五级
    //         this.$utils.postMessage({
    //             type: 'error',
    //             message: '文件夹最高支持5级'
    //         })
    //         return
    //     }
    //     let params = {
    //         type: GROUPTYPE,
    //         isDir: true,
    //     }
    //     let len = this.filePath.length
    //     if (len > 1){
    //         // 普通展示文件夹列表状态下，指定父文件夹,如果是在企业文件根目录下,不需要指定
    //         params.parentId = this.filePath[len - 1].id
    //     }
    //     if (this.isSearchStatus) {
    //         // 搜索状态下，指定父文件夹
    //         params.parentId = this.requestParam.groupId > 0 ? this.requestParam.groupId : 0
    //     }
    //     post('/ajax/comm/tsGroup_h.jsp?cmd=addTsGroup', params).then((res) => {
    //         if (res && res.success) {
    //             // 新创建文件夹要清除搜索状态
    //             this.requestParam.name = ''
    //             if (this.requestParam.groupId == -1) this.requestParam.groupId = 0
    //             // if (this.requestParam.groupId == -1) this.requestParam.groupId = 0

    //             this.getFileList().then(() => {
    //                 // 新建文件夹后处于编辑态
    //                 let curIndex = this.fileList.findIndex(item => !item.isSystem) // 如果有系统资源文件夹。新创建的文件夹在此文件夹之后
    //                 console.log(curIndex, 'curIndex===')
    //                 if (curIndex > - 1) {
    //                     this.$set(this.showInput, curIndex, true)
    //                     this.name = this.fileList[curIndex].name
    //                     console.log(this.showInput, '展示input===')
    //                 }
    //             })
    //             this.$utils.postMessage({
    //                 type: 'success',
    //                 message: '新建文件夹成功'
    //             })
    //         } else {
    //             this.$utils.postMessage({
    //                 type: 'error',
    //                 message: res.msg || '系统错误，请稍候重试'
    //             })
    //         }
    //     })
    // },
    /**
     * 初始化文件选中状态
     * @author lymn
     * @date 2020-11-07
     */
    initCheckStatus() {
      this.setAllCheckStatus(false);
    },
    /**
     * 修改文件夹名称
     * @author lymn
     * @date 2020-11-07
     */
    async setFolderName(item, newVal, index) {
      console.log(item, '修改名称的项');
      const params = {
        id: item.id,
        name: newVal,
        type: GROUPTYPE,
        parentId: item.parentId, // 父文件夹
        isDir: true,
      };
      const [err, res] = await setTsGroup(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        this.$set(this.showInput, index, false);
        return Promise.reject(err);
      }
      item.name = newVal;
      // this.$forceUpdate()
      this.getFileList();
    },
    /**
     * 显示新建文件夹窗口
     * @author lymn
     * @date 2020-11-10
     * @param {Boolean} param
     * @return {Boolean} return
     */
    showNewFolderDialog() {
      this.editFolderDialogVisible = true;
      this.editItem = {};
    },
    /**
     * 创建文件夹成功
     * @author lymn
     * @date 2020-11-10
     * @param {String} editType 编辑类型 add:新建 edit:编辑
     * @param {Number} id 新建文件夹的id
     */
    addFolderSuccess(editType, id) {
      this.checkFolderId = id; // 2021年7月1日 adi 同步敏铃的代码
    },
    /**
     * 获取企业文件的容量信息(注意:在这个页面删除文件后,容量不会回升,回收站彻底删除文件后,容量才会回升)
     * @author lymn
     * @date 2020-11-10
     */
    // getOpacity() {
    //     let params = {
    //         typeGroup:GROUPTYPE,
    //         isCorp: false, // 是否企业文件夹 true:企业文件 false:个人文件
    //         setCap: false, // 是否为空间设置页面
    //     }
    //     post('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getMaterialResInfo', params).then((res) => {
    //         if (res && res.success) {
    //             // this.availCapacity = res.data.resSizeInfo.availCapacityName
    //             this.isOpenMatCapLimit = res.data.resSizeInfo.openMatCapLimit
    //         } else {
    //             this.$utils.postMessage({
    //                 type: 'error',
    //                 message: res.msg || '系统错误，请稍候重试'
    //             })
    //         }
    //     })
    // },
    /**
     * 没有选中文件的情况下，点击批量按钮
     * @author lymn
     * @date 2020-11-20
     */
    handleBatchClick() {
      this.$utils.postMessage({
        type: 'error',
        message: '您还未选择任何内容，无法进行批量操作',
      });
    },
    /**
     * 下拉加载更多
     * @author lymn
     * @date 2021-01-06
     * @param {Boolean} param
     * @return {Boolean} return
     */
    loadMore() {
      // console.log('下拉加载更多111')
      console.log(this.pages, 'pages');
      if (this.pages.pageNow < this.pages.maxPage) {
        console.log('下拉加载更多');
        this.pages.pageNow++;
        this.getFileList();
      }
    },
    /**
     * 菜单渲染父节点
     * @author lymn
     * @date 2021-01-20
     * @param {Boolean} param
     * @return {Boolean} return
     */
    getPopupContainer() {
      return document.getElementsByClassName('pro_listBox')[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.allFileBox {
  .crubmbsBox {
    width: 100%;
  }
  .testCrumb {
    flex: 0 1 auto;
  }
  .crubmbsItem {
    flex: 0 1 auto;
    overflow: hidden;
  }
  .filePath {
    width: 100%;
    font-size: 16px;
    font-weight: normal;
    color: $color-89;
    cursor: pointer;
    &:hover {
      color: #247af3;
      text-decoration: underline;
    }
  }
  .filePathIcon {
    width: 16px;
    height: 16px;
    margin: 0 8px;
    color: $color-89;
  }
  .currentFilePath {
    font-size: 16px;
    font-weight: bold;
    color: $color-00;
    text-decoration: none;
  }
  .line {
    display: inline-block;
    width: 1px;
    height: 16px;
    margin: 0 8px;
    background: #cfcfcf;
  }
  .pro_line {
    .materialBtn {
      margin-right: 10px;
      box-sizing: border-box;
      &:last-child {
        margin-right: 0;
      }
    }
    .operateBtn {
      min-width: 90px;
    }
  }
  .allCheckBox {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    .allCheckText {
      display: inline-block;
      height: 18px;
    }
  }
  .fileList {
    margin-top: 20px;
    flex-wrap: wrap;
    .itemBox {
      width: 124px;
      margin: 0 20px 20px 0;
    }
    .imgBox {
      position: relative;
      width: 124px;
      height: 124px;
      padding: 8px;
      margin: 0 auto;
      border: 1px solid transparent;
      border-radius: 4px;
      box-sizing: border-box;
      &.boxPointer {
        cursor: pointer;
      }
      img {
        width: 108px;
        height: 108px;
        border-radius: 4px;
        object-fit: cover;
      }
      .systemIcon {
        position: absolute;
        top: 53px;
        right: 0;
        left: 0;
        width: 32px;
        height: 32px;
        margin: auto;
        color: #ffbd10;
      }
      &:hover {
        background: #f5f7fa;
      }
      &.checkImgBox {
        background: #e6f1ff;
        border: 1px solid #247af3;
      }
      .showDropDownBtn {
        &.fileMoreBtn {
          display: block;
        }
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
        position: absolute;
        top: 8px;
        left: 8px;
        display: none;
        width: 24px;
        height: 24px;
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
      }
      .fileMoreBtn {
        position: absolute;
        top: 8px;
        right: 8px;
        display: none;
      }
    }
    .fileTitle {
      margin-top: 4px;
      font-size: 14px;
      color: $color-53;
      text-align: center;
    }
    .fileName {
      max-height: 48px;
      padding: 1px 5px;
      line-height: 22px;
      word-break: break-all;
      box-sizing: border-box;
    }
  }
  .nothingText {
    padding: 20px;
    font-size: 14px;
    color: #909399;
    text-align: center;
  }
}

/* 选中文件的情况 */
.allFileBox .fileList .imgBox:hover .itemCheckBox,
.allFileBox .fileList .imgBox:hover .fileMoreBtn,
.allFileBox .fileList .imgBox.checkImgBox .itemCheckBox,
.allFileBox .fileList .imgBox.checkImgBox .fileMoreBtn {
  display: block;
}
.directSale {
  .allFileBox {
    .fileList {
      .imgBox {
        &:hover {
          background: #e6f1ff;
        }
      }
    }
  }
}
.fileNameInputBox {
  .tanshu_input_contain {
    line-height: 22px;
  }
}
</style>

<style lang="scss">
.tanshu-header-comm {
  .leftPart {
    width: calc(100% - 500px);
  }
}
.allFileBox {
  .el-input__inner {
    padding: 0 8px;
  }
  .allCheckBox {
    .el-checkbox__label {
      height: 18px;
      line-height: 18px;
    }
  }
  .fileList {
    .imgBox {
      .itemCheckBox {
        .el-checkbox__inner {
          width: 24px;
          height: 24px;
          &::after {
            left: 7px;
            width: 6px;
            height: 14px;
          }
        }
      }
    }
  }
}
</style>

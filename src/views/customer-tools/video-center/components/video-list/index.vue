<!--
 * @Author       : ADI
 * @Date         : 2021-06-28 14:20:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 10:53:33
-->
<template>
  <div class="videoCenter">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          视频中心
        </div>
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          class="pro_header_addEm rightPartBtn"
          icon="icon-icon-11"
          type="primary"
          size="small"
          @click="showAddVideoDialog"
          >添加视频
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="videoList">
        <global-ts-slide
          class="tanshu-bottomBorder"
          ref="videoCenterSlider"
          :slidArray="sliderList"
          @changeStatus="changeSlide"
        >
        </global-ts-slide>
        <ts-type-box
          :showAddBtn="this.sliderType === 'templateVideo'"
          :initList="initClassifyList"
          :typeList="classifyList"
          @showManage="showClassifyManage"
          @changeClassify="changeClassify"
          :selectType="requestParam.groupId"
          v-if="this.sliderType !== 'personVideo'"
        >
        </ts-type-box>
        <div class="listWrapper">
          <div class="pro_line flex-rn">
            <fa-select
              showSearch
              placeholder="最新发布"
              optionFilterProp="children"
              class="headerFilter"
              @change="changeSelect"
            >
              <fa-select-option v-for="item of selectList" :key="item.id" :value="item.id">
                {{ item.name }}
              </fa-select-option>
            </fa-select>
            <fa-input
              size="small"
              class="headerFilter"
              v-model="requestParam.name"
              placeholder="视频名称"
              @keyup.enter.native="getVideoList"
            >
            </fa-input>
            <global-ts-button
              type="primary"
              size="small"
              icon="icon-icon-4"
              ref="button"
              @click="getVideoList"
              @keyup.enter.native="getVideoList"
              >搜索
            </global-ts-button>
          </div>
          <div class="videoListContent">
            <div class="videoItemBox" v-for="(item, index) of videoList" :key="item.id">
              <div :class="['videoItem', { isClick: item.isShowMenu }]">
                <div class="imgBox">
                  <img class="imgContent" :src="item.coverImgUrl" alt="" />
                </div>
                <div class="baseInfoBox">
                  <div class="subBase playBox">
                    <global-ts-svg-icon class="icon" name="icon-bofang"></global-ts-svg-icon>
                    <span class="num">{{ item.clickViewers }}</span>
                  </div>
                  <div class="subBase shareBox">
                    <global-ts-svg-icon class="icon" name="icon-fenxiang1"></global-ts-svg-icon>
                    <span class="num">{{ item.shareViewers }}</span>
                  </div>
                </div>
                <fa-dropdown
                  :getPopupContainer="getPopupContainer"
                  v-model="item.isShowMenu"
                  placement="bottomLeft"
                  :trigger="['click']"
                  overlayClassName="videoOperate ts-fa-dropdown"
                >
                  <fa-menu slot="overlay">
                    <fa-menu-item
                      class="operateBox"
                      v-for="subItem of videoOperateListCal"
                      :key="subItem.id"
                      @click="videoOperate(item, subItem)"
                    >
                      <fa-popover
                        v-if="subItem.id === 'share' && item.isShowMiniQr"
                        :getPopupContainer="getPopupContainer"
                        placement="rightTop"
                        trigger="hover"
                        overlayClassName="ts-fa-popover no-arrow"
                      >
                        <template slot="content">
                          <div class="qrBox">
                            <div class="imgBox">
                              <img class="imgContent" :src="item.shareCode" alt="" />
                            </div>
                            <div class="tip">扫码进行分享</div>
                          </div>
                        </template>
                        <div class="absoluteBox"></div>
                      </fa-popover>
                      <global-ts-svg-icon class="icon" :name="subItem.icon"></global-ts-svg-icon>
                      <span class="text">{{ subItem.name }}</span>
                    </fa-menu-item>
                  </fa-menu>
                  <div class="moreBtn">
                    <div class="whiteDot" v-for="subItem of 3" :key="item.id + '_' + subItem"></div>
                  </div>
                </fa-dropdown>
              </div>
              <div :class="['fileTitle multiTextEllipsis', { fileErr: item.fail }]" @click="showEditName(item, index)">
                <fa-input
                  :maxLength="50"
                  v-model="item.commName"
                  placeholder="请输入名称"
                  v-if="item.showEditName"
                  :autofocus="true"
                  v-focus
                  @blur="e => changeBlur(item, index)"
                  @pressEnter="e => changeBlur(item, index)"
                  size="small"
                >
                </fa-input>
                <div v-else :class="['fileName', { fileNameManager: isShowEditCal }]">{{ item.commName }}</div>
              </div>
            </div>
            <div class="emptyBox" v-if="!videoList.length">{{ emptyTipCal }}</div>
          </div>
        </div>
      </div>
      <global-ts-fai-pagination
        :showSizeChanger="true"
        class="paginationBox"
        @changePage="getVideoList"
        :withMargin="false"
        :pageOption.sync="pages"
      >
      </global-ts-fai-pagination>
    </div>
    <addVideoDialog
      ref="addVideoDialog"
      @saveVideoSuccess="getVideoList"
      :isManager="isManager"
      :dialogVisible.sync="addVideoDialogVisible"
    >
    </addVideoDialog>
  </div>
</template>

<script>
import addVideoDialog from '../add-video-dialog/index.vue';
import TsTypeBox from '@/components/base/ts-type-box/index.vue';
import { confirm } from '@/utils';
import { Select, Dropdown, Popover } from '@fk/faicomponent';
import {
  saveTsVideoInfo,
  saveTsVideoTemplateInfo,
  getTsHotVideoList,
  getTsVideoTemplateList,
  getTsVideoList,
  delTsVideoTemplate,
  delTsVideo,
} from '@/api/modules/views/customer-tools/video-center';
import { getTsGroupList } from '@/api/modules/views/customer-tools';

export default {
  name: 'video-list',
  components: {
    addVideoDialog,
    TsTypeBox,
    [Select.name]: Select,
    [Dropdown.name]: Dropdown,
    [Popover.name]: Popover,
  },
  props: {
    isManager: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requestParam: {
        sortKey: '',
        name: '',
        desc: true,
        groupId: -1,
      },
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
        total: 10,
      },
      ajaxUrlInfo: {
        hotVideo: getTsHotVideoList,
        templateVideo: getTsVideoTemplateList,
        personVideo: getTsVideoList,
      },
      classifyTypeInfo: {
        hotVideo: 16, // 热门视频分类16、企业视频分类17
        templateVideo: 17,
      },
      sliderType: 'hotVideo',
      sliderList: [
        {
          key: '热门视频',
          value: 1,
          className: '', // 使用slider组件，这个属性是一定要声明的，因为组件中根据这个来切换样式
        },
        {
          key: '企业视频',
          value: 2,
          className: '',
        },
        {
          key: '我的视频',
          value: 3,
          className: '',
        },
      ],
      initClassifyList: [
        {
          id: -1,
          name: '全部',
        },
      ],
      classifyList: [],
      selectList: [
        {
          id: 0,
          name: '最新发布',
          sortKey: 'createTime',
        },
        {
          id: 1,
          name: '最多浏览',
          sortKey: 'clickViewers',
        },
        {
          id: 2,
          name: '最多下载',
          sortKey: 'downloadCnt',
        },
      ],
      videoList: [], // 视频列表
      delVideoUrlInfo: {
        // 删除视频url
        templateVideo: delTsVideoTemplate, // 企业视频
        personVideo: delTsVideo, // 个人视频
      },
      videoOperateList: [
        {
          id: 'play',
          name: '播放',
          icon: 'icon-bofang',
          adminPermission: false,
          sliderPermission: ['hotVideo', 'templateVideo', 'personVideo'],
        },
        {
          id: 'download',
          name: '下载',
          icon: 'icon-xiazai1',
          adminPermission: false,
          sliderPermission: ['hotVideo', 'templateVideo', 'personVideo'],
        },
        {
          id: 'share',
          name: '分享',
          icon: 'icon-fenxiang1',
          adminPermission: false,
          sliderPermission: ['hotVideo', 'templateVideo', 'personVideo'],
        },
        {
          id: 'addTask',
          name: '发任务',
          icon: 'icon-farenwu',
          adminPermission: true,
          sliderPermission: ['hotVideo', 'templateVideo'],
        },
        {
          id: 'delete',
          name: '删除',
          icon: 'icon-shanchu1',
          adminPermission: true,
          sliderPermission: ['templateVideo', 'personVideo'],
        },
      ],
      addVideoDialogVisible: false, // 添加视频弹窗
    };
  },
  computed: {
    isShowEditCal() {
      return this.sliderType === 'personVideo' || (this.isManager && this.sliderType !== 'hotVideo');
    },
    emptyTipCal() {
      return this.sliderType === 'hotVideo' ? '暂无视频' : '暂无视频，点击右上角【添加视频】按钮前往创建吧';
    },
    /**
     * 根据页签类型和管理员权限返回可操作列表
     * @author waldon
     * @date 2020/11/29
     * @returns {Array} - 有权限的操作列表
     */
    videoOperateListCal() {
      return this.videoOperateList.filter(
        item => item.sliderPermission.includes(this.sliderType) && (this.isManager ? true : !item.adminPermission),
      );
    },
  },
  watch: {},
  created() {
    this.getVideoList();
  },
  activated() {
    this.getGroupList();
  },
  mounted() {},
  methods: {
    /**
     * 点击后编辑名称
     * @author lymn
     * @date 2020-11-02
     * @param {Object} rowData 对应的文件
     * @param {Number} index
     */
    showEditName(rowData, index) {
      if (!this.isShowEditCal) {
        return;
      }
      rowData.initName = rowData.commName; // 改变之前先保存之前的名字，失败时回到之前的名字
      rowData.showEditName = true;
      this.$set(this.videoList, index, this.videoList[index]);
    },
    /**
     * @description :失去焦点，隐藏输入框
     * @author      : ADI
     * @Date        : 2021-06-29 16:32:36
     * @param        {*} file data item
     * @param        {*} index data index
     * @return       {*}
     */
    changeBlur(file, index) {
      file.showEditName = false;
      if (!file.commName.length) {
        // 置空则返回原始值
        file.commName = file.initName;
      }
      this.saveTsVideoInfo(file);
      this.$set(this.videoList, index, this.videoList[index]);
    },
    /**
     * 编辑视频
     * @author waldon
     * @date 2020/12/7
     * @param {Object} rowData - 视频数据
     */
    async saveTsVideoInfo(rowData) {
      const ajaxUrl = rowData.type === 0 ? saveTsVideoInfo : saveTsVideoTemplateInfo;
      const params = {
        id: rowData.id,
        name: rowData.commName,
      };
      const [err, res] = await ajaxUrl(params);
      if (err) {
        rowData.commName = rowData.initName;
        this.$utils.postMessage({
          type: 'error',
          message: res.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
    },
    /**
     * 视频播放
     * @author waldon
     * @date 2020/12/1
     * @param {Object} rowData - 视频播放
     */
    playVideo(rowData) {
      const pagePlay = window.open();
      const html = `
                    <body>
                        <video controls width="30%" autoplay src="${rowData.visitUrl}"></video> 
                    </body>
                `;
      pagePlay.document.write(html);
    },
    /**
     * 视频操作
     * @author waldon
     * @date 2020/11/29
     * @param {Object} rowData - 操作视频数据
     * @param {Object} subData - 操作类型数据
     */
    videoOperate(rowData, subData) {
      switch (subData.id) {
        case 'play':
          this.playVideo(rowData);
          break;
        case 'download':
          const pageDownload = window.open(rowData.pcDownloadPath);
          pageDownload.opener = null;
          break;
        case 'share':
          if (!rowData.isShowMiniQr) {
            confirm(
              '当前小程序不是最新版，请更新<br>（更新后可以使用新功能）',
              '小程序新版本发布提醒',
              '去更新',
              true,
              true,
            ).then(action => {
              if (action === 'confirm') {
                this.router.push({
                  path: '/bindMp',
                });
              }
            });
          }
          break;
        case 'addTask':
          this.$router.push({
            name: 'allTask',
            params: {
              fromPage: 'videoCenter',
              taskType: 8, // 任务类型8是视频
              dataId: rowData.id,
              dataName: rowData.name,
              isHotVideo: rowData.isHotVideo,
              isShowMiniQr: rowData.isShowMiniQr,
            },
          });
          break;
        case 'delete':
          this.delVideo(rowData);
      }
    },
    /**
     * 删除视频
     * @author waldon
     * @date 2020/11/29
     * @param {Object} rowData - 行数据
     */
    delVideo(rowData) {
      confirm('确定将该视频删除？', '操作确认').then(async () => {
        const params = {
          id: rowData.id,
        };
        const ajaxUrl = this.delVideoUrlInfo[this.sliderType];
        const [err, res] = await ajaxUrl(params);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.getVideoList();
        this.$utils.postMessage({
          type: 'success',
          message: '删除成功',
        });
      });
    },
    /**
     * 显示添加视频对话框
     * @author waldon
     * @date 2020/11/26
     */
    showAddVideoDialog() {
      this.addVideoDialogVisible = true;
    },
    async getGroupList() {
      if (this.sliderType === 'personVideo') {
        return;
      }
      const params = {
        type: this.classifyTypeInfo[this.sliderType],
      };
      const [err, res] = await getTsGroupList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.classifyList = res.data;
    },
    /**
     * 必须要设置popover的挂载节点，滚动有问题
     * @author waldon
     * @date 2020/10/23
     * @returns {Object} - 挂载节点
     */
    getPopupContainer() {
      return document.getElementsByClassName('pro_listBox')[0];
    },
    /**
     * 查询视频
     * @author waldon
     * @date 2020/11/26
     */
    async getVideoList() {
      const params = { ...this.requestParam, ...this.pages };
      const ajaxUrl = this.ajaxUrlInfo[this.sliderType];
      const [err, res] = await ajaxUrl(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.videoList = res.data;
      this.pages.total = res.total;
    },
    /**
     * 改变选项
     * @author waldon
     * @date 2020/11/26
     * @param {Number} value - 选项值
     */
    changeSelect(value) {
      this.requestParam.sortKey = this.selectList[value].sortKey;
    },
    /**
     * 切换分类
     * @author lymn
     * @date 2020-07-15
     * @param {Number} id -分类的id
     */
    changeClassify(id) {
      this.pages.pageNow = 1;
      this.requestParam.groupId = id;
      this.getVideoList();
    },
    /**
     * 显示分类管理页
     * @author lymn
     * @date 2020-07-15
     */
    showClassifyManage() {
      this.$emit('changeComponent', { page: 'classifyManager' });
    },
    /**
     * 页签改变
     * @author waldon
     * @date 2020/11/26
     * @param {Object} e - 页签对象
     * @param {Number} value - 滑块值
     */
    changeSlide(e, value) {
      switch (value) {
        case 1:
          this.sliderType = 'hotVideo';
          this.getGroupList();
          break;
        case 2:
          this.sliderType = 'templateVideo';
          this.getGroupList();
          break;
        case 3:
          this.sliderType = 'personVideo';
      }
      const params = {
        type: this.classifyTypeInfo[this.sliderType],
      };
      this.$emit('changeSlide', params);
      this.pages.pageNow = 1;
      this.requestParam.groupId = -1;
      this.requestParam.name = '';
      this.getVideoList();
    },
  },
};
</script>

<style lang="scss" scoped>
.videoCenter {
  .videoListContent {
    display: flex;
    flex-flow: row wrap;
    .videoItemBox {
      width: 176px;
      height: 182px;
      margin-right: 20px;
      margin-bottom: 20px;
    }
    .videoItem {
      position: relative;
      width: 176px;
      height: 136px;
      padding: 8px;
      margin-right: 10px;
      border: 1px solid transparent;
      border-radius: 4px;
      opacity: 1;
      box-sizing: border-box;
      .moreBtn {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 1;
        display: flex;
        width: 24px;
        height: 0;
        overflow: hidden;
        cursor: pointer;
        background: $color-ff;
        border-radius: 2px;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        .whiteDot {
          width: 4px;
          height: 4px;
          margin-right: 2px;
          background: #247af3;
          border-radius: 50%;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .imgBox {
        width: 160px;
        height: 120px;
        background: $color-ff;
        border: 1px solid $border-color;
        border-radius: 4px;
        opacity: 1;
        box-sizing: border-box;
        .imgContent {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          object-fit: cover;
        }
      }
      .baseInfoBox {
        position: absolute;
        top: 92px;
        right: 6px;
        left: 8px;
        display: flex;
        height: 36px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
        border-radius: 0 0 4px 4px;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        .subBase {
          display: flex;
          margin-top: 12px;
          font-size: 12px;
          line-height: 20px;
          color: $color-ff;
          opacity: 1;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          &.playBox {
            margin-right: 20px;
          }
          .icon {
            color: $color-ff;
          }
        }
      }
    }
    .desc {
      overflow: hidden;
      font-size: 14px;
      color: $color-53;
      text-align: center;
      text-overflow: ellipsis;
    }
    .fileTitle {
      width: 160px;
      margin: 8px auto 0 auto;
      font-size: 14px;
      line-height: 20px;
      color: $color-53;
      text-align: center;
      word-break: break-all;
      border: 1px solid transparent;
    }
    .fileName {
      &.fileNameManager {
        padding: 1px;
        margin-top: 0;
        border: 1px solid transparent;
        border-radius: 4px;
        &:hover {
          border: 1px solid #247af3;
        }
      }
    }
  }
  .emptyBox {
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: #909399;
    text-align: center;
  }
  .videoOperate {
    .operateBox {
      cursor: pointer;
      &:hover {
        color: #247af3;
        .icon {
          color: #247af3;
        }
      }
      .icon {
        width: 0.85em;
        height: 0.85em;
        color: $color-b2;
        vertical-align: -0.05em;
      }
    }
  }
}
.videoCenter .videoListContent .videoItem:hover,
.videoCenter .videoListContent .videoItem.isClick {
  background: #e6f1ff;
  border: 1px solid #247af3;
}
.videoCenter .videoListContent .videoItem:hover .moreBtn,
.videoCenter .videoListContent .videoItem.isClick .moreBtn {
  height: 24px;
}
@media screen and (min-width: 1581px) and (max-width: 1920px) {
  .videoCenter .videoListContent .videoItemBox:nth-child(8n) {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
.videoCenter {
  .operateBox {
    &.fa-dropdown-menu-item {
      position: relative;
      .absoluteBox {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
      }
    }
  }
  .fa-popover-inner-content {
    padding: 0;
    .qrBox {
      width: 180px;
      height: 209px;
      padding: 10px;
      background: $color-ff;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
      .imgBox {
        width: 160px;
        height: 160px;
        .imgContent {
          width: 100%;
          height: 100%;
        }
      }
      .tip {
        margin-top: 10px;
        text-align: center;
      }
    }
  }
}
</style>

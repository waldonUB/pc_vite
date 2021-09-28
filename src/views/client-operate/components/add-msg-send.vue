<!--
 * @Description  : 新建群发
 * @Author       : turbo
 * @Date         : 2021-07-29 23:37:05
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 15:37:46
-->

<template>
  <div class="add-msg-send">
    <global-ts-card-box>
      <template #card-box-head>
        <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
          <template #leftPart>{{ titleName }}</template>
          <template #rightPart>{{ chatType === 0 ? '新建群发' : '新建群群发' }}</template>
        </global-ts-tabguide>
      </template>
      <template #card-box-body>
        <div class="add-msg-send__content">
          <div class="add-msg-send__form">
            <fa-form-model ref="addMsgSendForm" layout="vertical" :model="form" :rules="rules">
              <fa-form-model-item label="标题" prop="title">
                <global-ts-input
                  size="large"
                  placeholder="仅作内部标记，不会对外展示"
                  show-count
                  block
                  :max-length="20"
                  v-model="form.title"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="chatType === 1">
                <template #label>
                  群发群主<global-ts-tool-tips
                    offset="10"
                    effect="dark"
                    placement="top-start"
                    content="因企业微信限制，只可以群发消息给每个群主最近活跃的200个群聊，最近活跃指最近创建或最近发过消息的客户群"
                  >
                    <global-ts-svg-icon class="question-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                  </global-ts-tool-tips>
                </template>
                <global-ts-select-click
                  class="width_full-max"
                  size="medium"
                  placeholder="选择成员"
                  :select-list-str="form.selectDeptStr"
                  @clickHandle="showFilterDialog('dept')"
                ></global-ts-select-click>
                <div v-if="selectResultTip" class="text-tip">{{ selectResultTip }}</div>
              </fa-form-model-item>
              <div v-if="chatType === 0" class="horizontal-item">
                <fa-form-model-item class="horizontal" label="群发范围：">
                  <fa-radio-group v-model="form.type">
                    <fa-radio v-for="(item, index) in scopeList" :key="index" :value="item.value">
                      {{ item.label }}
                    </fa-radio>
                  </fa-radio-group>
                </fa-form-model-item>
                <div v-if="form.type === 2" class="sub-form">
                  <fa-form-model-item class="horizontal" label="成员：">
                    <global-ts-select-click
                      placeholder="选择成员"
                      :select-list-str="form.selectDeptStr"
                      @clickHandle="showFilterDialog('dept')"
                    ></global-ts-select-click>
                  </fa-form-model-item>
                  <fa-form-model-item class="horizontal" label="标签：">
                    <global-ts-select-click
                      placeholder="选择标签"
                      :select-list-str="form.selectTagStr"
                      @clickHandle="showFilterDialog('tag')"
                    ></global-ts-select-click>
                  </fa-form-model-item>
                  <fa-form-model-item class="horizontal" label="添加时间：">
                    <global-ts-date-picker
                      type="datetimerange"
                      data-format="yyyy-MM-dd HH:mm:ss"
                      @updateTime="setAddTime"
                    ></global-ts-date-picker>
                  </fa-form-model-item>
                  <div v-if="selectResultTip" class="text-tip">{{ selectResultTip }}</div>
                </div>
              </div>
              <div class="horizontal-item">
                <fa-form-model-item class="horizontal" label="群发时间：">
                  <fa-radio-group v-model="form.sendType">
                    <fa-radio v-for="(item, index) in sendTimeTypeList" :key="index" :value="item.value">
                      {{ item.label }}
                    </fa-radio>
                  </fa-radio-group>
                </fa-form-model-item>
                <div v-if="form.sendType === 1" class="sub-form">
                  <fa-form-model-item class="horizontal" label="发送时间：">
                    <el-date-picker
                      type="datetime"
                      size="small"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      :picker-options="pickerOptions"
                      v-model="form.sendTime"
                    >
                    </el-date-picker>
                    <global-ts-tool-tips
                      offset="10"
                      effect="dark"
                      placement="top-start"
                      :content="`到了预设的时间，将在企业微信下发一条群发指令给对应${chatType === 0 ? '成员' : '群主'}`"
                    >
                      <global-ts-svg-icon class="question-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                    </global-ts-tool-tips>
                  </fa-form-model-item>
                </div>
              </div>
              <fa-form-model-item class="top-align" label="群发内容">
                <fa-textarea show-count :rows="4" :max-length="1300" v-model="form.textContent"></fa-textarea>
              </fa-form-model-item>
              <fa-form-model-item label="添加素材">
                <div class="type-box">
                  <div
                    v-for="item in checkTypeList"
                    :key="item.key"
                    :class="['type-item', { checked: item.key === form.contentType }]"
                    @click="changeContentType(item.key)"
                  >
                    <global-ts-svg-icon :name="item.icon"></global-ts-svg-icon>
                    <div>{{ item.name }}</div>
                  </div>
                </div>
                <div v-if="form.dataId && form.contentType === contentTypeDef.ARTICLE" class="material-info">
                  <span>{{ articleInfo.coverTitle }}</span>
                  <global-ts-svg-icon
                    name="icon-bianji1616"
                    @click="changeContentType(contentTypeDef.ARTICLE)"
                  ></global-ts-svg-icon>
                  <global-ts-svg-icon name="icon-shanchu1616" @click="deleteMaterial"></global-ts-svg-icon>
                </div>
                <div v-if="form.linkTitle && form.contentType === contentTypeDef.LINK" class="material-info">
                  <span>{{ form.linkTitle }}</span>
                  <global-ts-svg-icon
                    name="icon-bianji1616"
                    @click="changeContentType(contentTypeDef.LINK)"
                  ></global-ts-svg-icon>
                  <global-ts-svg-icon name="icon-shanchu1616" @click="deleteMaterial"></global-ts-svg-icon>
                </div>
                <div v-if="form.imgMediaId && form.contentType === contentTypeDef.PICTURE" class="img-info">
                  <img :src="form.imgUrl" />
                  <div class="mask">
                    <global-ts-svg-icon
                      name="icon-bianji1616"
                      @click="changeContentType(contentTypeDef.PICTURE)"
                    ></global-ts-svg-icon>
                    <global-ts-svg-icon name="icon-shanchu1616" @click="clearPicture"></global-ts-svg-icon>
                  </div>
                </div>
              </fa-form-model-item>
            </fa-form-model>
          </div>
          <div class="add-msg-send__preview">
            <global-ts-preview-phone>
              <template #content>
                <div v-if="form.textContent" class="chat-item">
                  <img class="head-img" :src="headImg" />
                  <div class="chat-box chat-text">{{ form.textContent }}</div>
                </div>
                <div v-if="form.imgMediaId && form.contentType === contentTypeDef.PICTURE" class="chat-item">
                  <img class="head-img" :src="headImg" />
                  <img class="chat-img" :src="form.imgUrl" />
                </div>
                <div v-if="form.linkTitle && form.contentType === contentTypeDef.LINK" class="chat-item">
                  <img class="head-img" :src="headImg" />
                  <div class="chat-box chat-article">
                    <div class="title">{{ form.linkTitle }}</div>
                    <div class="cover-info">
                      <div class="cover-title">{{ form.linkDesc }}</div>
                      <img class="cover-img" :src="form.linkPicurl || linkIcon" />
                    </div>
                  </div>
                </div>
                <div v-if="form.dataId && form.contentType === contentTypeDef.ARTICLE" class="chat-item">
                  <img class="head-img" :src="headImg" />
                  <div class="chat-box chat-article">
                    <div class="title">{{ articleInfo.coverTitle }}</div>
                    <div class="cover-info">
                      <div class="cover-title">{{ articleInfo.coverContent }}</div>
                      <img class="cover-img" :src="articleInfo.coverImgUrl || linkIcon" />
                    </div>
                  </div>
                </div>
              </template>
            </global-ts-preview-phone>
          </div>
        </div>
      </template>
      <template #card-box-bottom>
        <global-ts-buttontips>
          <template #button>
            <global-ts-button type="primary" size="medium" @click="addMsgSend">通知成员发送</global-ts-button>
          </template>
          <template #buttonTips>
            通知成员，向选中的客户发送以上企业消息
            <global-ts-tool-tips offset="10" effect="dark" placement="top" content="使用帮助">
              <global-ts-svg-icon name="icon-wenhao1616" @click="helpDialogVisible = true"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </template>
        </global-ts-buttontips>
      </template>
    </global-ts-card-box>
    <ts-org-select-dialog
      :selected-org-data="selectedOrgData"
      :dialog-visible.sync="orgSelectDialogVisible"
      @getSelectedData="getSelectedData"
    ></ts-org-select-dialog>
    <ts-tag-select-dialog
      :selected-tag-list="selectedTagList"
      :dialog-visible.sync="tagSelectDialogVisible"
      @getSelectedTag="getSelectedTag"
    ></ts-tag-select-dialog>
    <ts-article-bubble
      :select-id="articleInfo.id"
      :father-type-id="articleInfo.type"
      :select-article="articleInfo"
      :dialog-visible.sync="articleBubbleVisible"
      @confirmbubble="selectArticle"
      @cancelbubble="articleBubbleVisible = false"
    ></ts-article-bubble>
    <global-ts-file-select-upload-dialog
      accept-type="img"
      :limit-num="1"
      :dialog-visible.sync="fileSelectUploadDialogVisible"
      @success="uploadSuccess"
    ></global-ts-file-select-upload-dialog>
    <edit-link-dialog
      :link-info="form"
      :dialog-visible.sync="editLinkDialogVisible"
      @sureEditLinkInfo="sureEditLinkInfo"
    ></edit-link-dialog>
    <help-dialog :chat-type="chatType" :dialog-visible.sync="helpDialogVisible"></help-dialog>
  </div>
</template>

<script>
import { merge } from 'lodash';

// assets
import headImgPng from '@/assets/image/wxCorpMsgSend/headImg.png';
import linkIconPng from '@/assets/image/wxCorpMsgSend/linkIcon.png';

// components
import TsOrgSelectDialog from '@/components/base/ts-org-select-dialog/index.vue';
import TsTagSelectDialog from '@/components/base/ts-tag-select-dialog/index.vue';
import TsArticleBubble from '@/components/base/ts-article-bubble/index.vue';
import EditLinkDialog from './edit-link-dialog.vue';
import HelpDialog from './help-dialog.vue';

// utils
import { beforeUpload } from '../utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'AddMsgSend',
  components: { TsOrgSelectDialog, TsTagSelectDialog, TsArticleBubble, EditLinkDialog, HelpDialog },
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        chatType: this.chatType, //0客户群发，1客户群群发
        textContent: '', //群发内容
        title: '', //标题
        type: 1, //群发范围：1全部客户，2指定条件
        sendType: 0, //群发时间0.立即1定时
        contentType: 0, //群发类型
        imgMediaId: '',
        linkTitle: '',
        linkDesc: '',
        linkPicurl: '',
        linkUrl: '',
        sendTime: '',
        dataId: '',
        dataSource: 0,
        addStartTime: '',
        addEndTime: '',
        depIdList: '', //成员筛选
        selectTagStr: '',
        selectDeptStr: '',
        imgUrl: '',
      },
      selectResultInfo: {
        staff: '',
        tag: '',
        addTime: '',
        userIds: '',
        departmentIds: '',
        corpTagIds: '',
        number: 0,
      },
      rules: {
        title: [{ required: true, message: '请输入标题' }],
      },
      scopeList: [
        {
          label: '全部客户',
          value: 1,
        },
        {
          label: '指定客户',
          value: 2,
        },
      ],
      sendTimeTypeList: [
        {
          label: '立即群发',
          value: 0,
        },
        {
          label: '定时群发',
          value: 1,
        },
      ],
      contentTypeDef: {
        PICTURE: 1, // 图文
        LINK: 2, // 链接
        MINIPROGRAM: 3, // 小程序
        ARTICLE: 4, // 文章
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000; // 选当前时间之后的时间
        },
      },
      selectedOrgData: {
        // 被选中的部门/员工
        dept: [],
        staff: [],
      },
      selectedTagList: [], // 选中显示的标签
      articleInfo: {},
      orgSelectDialogVisible: false,
      tagSelectDialogVisible: false,
      articleBubbleVisible: false,
      fileSelectUploadDialogVisible: false,
      editLinkDialogVisible: false,
      helpDialogVisible: false,
    };
  },
  computed: {
    titleName() {
      return this.chatType === 0 ? '客户群发' : '客户群群发';
    },
    checkTypeList() {
      return [
        {
          key: this.contentTypeDef.ARTICLE,
          name: '文章',
          icon: 'icon-wenzhang1616',
        },
        {
          key: this.contentTypeDef.PICTURE,
          name: '图片',
          icon: 'icon-tupian1616',
        },
        {
          key: this.contentTypeDef.LINK,
          name: '链接',
          icon: 'icon-lianjie1616',
        },
      ];
    },
    selectResultTip() {
      let { staff, tag, addTime } = this.selectResultInfo;
      const { number } = this.selectResultInfo;
      staff = staff ? `【${staff}】等成员添加的` : '';
      tag = tag ? `标签为【${tag}】等的` : '';
      addTime = addTime ? `添加时间在【${addTime}】之间的` : '';
      return this.chatType === 0
        ? staff || tag || addTime
          ? `将群发消息给${staff}${staff && tag ? '，且' : ''}${tag}${
              (tag || staff) && addTime ? '，且' : ''
            }${addTime}客户，预计共${number}个客户;`
          : ''
        : staff
        ? `将群发消息给群主为【${staff}】等的群，预计共${number}个群;`
        : '';
    },
    headImg() {
      return headImgPng;
    },
    linkIcon() {
      return linkIconPng;
    },
  },
  methods: {
    /**
     * 保存
     * @author guoyijie
     * @date 2021-03-29
     */
    async addMsgSend() {
      const valid = await this.$refs.addMsgSendForm.validate();
      if (!valid) return;

      if (!this.form.selectDeptStr) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请选择群发群主',
        });
      }

      if (this.form.contentType === 0 && !this.form.textContent) {
        return this.$utils.postMessage({
          type: 'error',
          message: '请添加群发内容或素材',
        });
      }

      if (this.form.dataId) {
        const { coverTitle, coverContent, coverImgUrl, previewUrl } = this.articleInfo;
        this.form.linkTitle = coverTitle || '';
        this.form.linkDesc = coverContent || '';
        this.form.linkUrl = previewUrl || '';
        this.form.linkPicurl = coverImgUrl || '';
      }

      const { addMsgTask } = wxwork;
      const [err, res] = await addMsgTask(merge({}, this.form, this.selectResultInfo));
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : res.msg,
      });
      !err && this.$emit('backToPrePage');
    },
    /**
     * 显示对话框类型
     * @author waldon
     * @date 2020/4/10
     * @param {String} type - 对话框类型
     */
    showFilterDialog(type) {
      if (type === 'dept') {
        this.orgSelectDialogVisible = true;
      } else {
        this.tagSelectDialogVisible = true;
      }
    },
    /**
     * 获取选择的数据
     * @author waldon
     * @date 2020/4/10
     * @param {Object} selectedData - 选择的数据
     */
    getSelectedData(selectedData) {
      const { dept, staff } = selectedData;
      this.selectResultInfo.staff = dept[0]?.name || staff[0]?.name || '';
      const selectDeptStr = [];
      const userIds = [];
      const departmentIds = [];
      this.form.selectDeptStr = '';
      this.selectedOrgData = selectedData;
      for (const item of staff) {
        selectDeptStr.push(item.name);
        userIds.push(item.userId);
      }
      for (const item of dept) {
        selectDeptStr.push(item.name);
        departmentIds.push(item.id);
      }
      this.selectResultInfo.userIds = userIds.join(',');
      this.selectResultInfo.departmentIds = departmentIds.join(',');
      this.form.selectDeptStr = selectDeptStr.join(',');
      this.getSelectClientCnt();
    },
    /**
     * 设置添加时间
     * @author guoyijie
     * @date 2020-04-29
     * @param {Array} val
     */
    setAddTime(val) {
      this.selectResultInfo.addTime = val?.[0] ? val.join(' 至 ') : '';
      this.form.addStartTime = val?.[0] || '';
      this.form.addEndTime = val?.[1] || '';
      this.getSelectClientCnt();
    },
    /**
     * 获取选择的标签
     * @author waldon
     * @date 2020/4/10
     * @param {Array} selectedTag - 选择的标签
     */
    getSelectedTag(selectedTag) {
      this.form.selectTagStr = '';
      this.selectedTagList = selectedTag;
      this.selectResultInfo.tag = selectedTag[0]?.name || '';
      const selectTagStr = [];
      const corpTagIds = [];
      for (const item of selectedTag) {
        selectTagStr.push(item.name);
        corpTagIds.push(item.id);
      }
      this.selectResultInfo.corpTagIds = corpTagIds.join(',');
      this.form.selectTagStr = selectTagStr.join(',');
      this.getSelectClientCnt();
    },
    async getSelectClientCnt() {
      const { userIds, departmentIds, corpTagIds } = this.selectResultInfo;
      if (!userIds && !departmentIds && !corpTagIds && !this.form.addStartTime && !this.form.addEndTime) return;

      const { getSelectClientCnt } = wxwork;
      const [err, res] = await getSelectClientCnt({
        type: 2,
        chatType: this.chatType, // 0 - 客户群发, 1 - 客户群群发
        userIds,
        departmentIds,
        corpTagIds,
        addStartTime: this.form.addStartTime,
        addEndTime: this.form.addEndTime,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.selectResultInfo.number = res.total;
    },
    changeContentType(key) {
      switch (key) {
        case this.contentTypeDef.ARTICLE:
          this.articleBubbleVisible = true;
          break;
        case this.contentTypeDef.PICTURE:
          this.fileSelectUploadDialogVisible = true;
          break;
        case this.contentTypeDef.LINK:
          this.editLinkDialogVisible = true;
      }
    },
    /**
     * 选中文章
     * @author guoyijie
     * @date 2020-08-31
     * @param {Object} articleObj 返回的文章对象，属性如下
     */
    selectArticle(articleObj) {
      this.deleteMaterial();
      this.articleInfo = articleObj;
      this.form.dataId = articleObj.id;
      this.form.dataSource = articleObj.cloneSource;
      this.form.contentType = this.contentTypeDef.ARTICLE;
      this.articleBubbleVisible = false; // 关闭弹窗
    },
    /**
     * 完成上传的回调
     * @author waldon
     * @date 2020/4/10
     * @param {Object} res - 后端返回数据
     */
    uploadSuccess(res) {
      const file = res[0];
      const flag = beforeUpload(file);
      if (!flag) return;
      this.deleteMaterial();
      this.form.imgMediaId = file.resId; // 图片的 srcid
      this.form.imgUrl = file.content;
      this.form.contentType = this.contentTypeDef.PICTURE;
    },
    sureEditLinkInfo(linkInfo) {
      this.deleteMaterial();
      this.form = merge({}, this.form, linkInfo);
      this.form.contentType = this.contentTypeDef.LINK;
    },
    deleteMaterial() {
      this.form.contentType = 0;
      this.form.linkPicurl = '';
      this.form.linkDesc = '';
      this.form.linkTitle = '';
      this.form.dataId = '';
      this.form.linkUrl = '';
      this.form.imgMediaId = '';
      this.articleInfo = {};
    },
    clearPicture() {
      this.form.imgMediaId = '';
      this.form.imgUrl = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.add-msg-send {
  position: relative;
  width: 100%;
  height: 100%;

  .add-msg-send__content {
    @include flex-top-center;
  }

  .add-msg-send__form {
    width: 990px;
    padding: 28px 0 0 32px;
    box-sizing: border-box;

    .horizontal-item {
      padding-bottom: 8px;
      margin-bottom: 24px;

      > .horizontal {
        padding-bottom: 0;
      }
    }

    .horizontal {
      margin-bottom: 0;
    }

    .text-tip {
      margin-top: 12px;
      color: $color-b2;
    }

    .sub-form {
      padding: 16px 20px 8px 20px;
      margin-top: 8px;
      background-color: $color-ff;
      border: 1px solid $color-ee;
      border-radius: 4px;

      ::v-deep {
        .fa-form-item-children {
          @include flex-left;
        }
      }

      .text-tip {
        margin-top: 4px;
      }
    }

    .question-icon {
      margin-left: 8px;
      font-size: 16px;
      color: $color-b2;
    }

    .type-box {
      @include flex-left;

      .type-item {
        @include flex-column-center;

        position: relative;
        width: 64px;
        height: 64px;
        margin-right: 12px;
        font-size: 12px;
        color: $color-53;
        text-align: center;
        cursor: pointer;
        border: 1px solid $color-da;
        border-radius: 4px;

        .ts-svg-icon {
          color: $color-89;
        }

        &.checked {
          color: $primary-color;
          border-color: $primary-color;

          &::after {
            position: absolute;
            right: -1px;
            bottom: -1px;
            width: 24px;
            height: 24px;
            background: url('~@/assets/image/wxCorpMsgSend/checkIcon.png') no-repeat;
            content: '';
          }

          .ts-svg-icon {
            color: $primary-color;
          }
        }
      }
    }

    .material-info {
      margin-top: 12px;
      color: $color-00;

      > * + * {
        margin-left: 8px;
      }

      .ts-svg-icon {
        font-size: 16px;
        color: $color-b2;
        cursor: pointer;

        &:hover {
          color: $primary-color;
        }
      }
    }

    .img-info {
      position: relative;
      width: 140px;
      height: 140px;
      margin-top: 20px;
      border: 1px solid $color-ee;
      border-radius: 4px;

      &:hover {
        .mask {
          opacity: 1;
        }
      }

      img {
        width: 100%;
        height: 100%;
      }

      .mask {
        @include flex-center;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        opacity: 0;

        > .ts-svg-icon + .ts-svg-icon {
          margin-left: 8px;
        }

        .ts-svg-icon {
          font-size: 20px;
          color: $color-b2;
          cursor: pointer;

          &:hover {
            color: $color-ff;
          }
        }
      }
    }
  }

  .add-msg-send__preview {
    @include flex-center;

    min-width: 400px;
    flex: 1;
  }
}
</style>

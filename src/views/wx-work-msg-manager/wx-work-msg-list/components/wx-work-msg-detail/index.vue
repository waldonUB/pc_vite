<!--
 * @Author       : ADI
 * @Date         : 2021-07-22 15:43:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:56:26
-->
<template>
  <div class="wxWorkMsgDetail">
    <global-ts-tabguide @backToPrePage="backManage">
      <template v-slot:leftPart>会话存档</template>
      <template v-slot:rightPart>"{{ sendUserInfo.name }}" 的会话详情</template>
    </global-ts-tabguide>
    <div class="wxWorkMsgDetail_content">
      <div class="wxWorkMsgDetail_content_left">
        <div class="header">
          <fa-input-search
            v-model="companyKey"
            placeholder="搜索"
            class="headerLine__search faUiSearchInput-white floatLeft"
            allowClear
            @search="changeMessageList"
          >
            <fa-button slot="enterButton" class="headerLine__search-button" size="large">
              <svg class="icon headerLine__search-icon icon_16" aria-hidden="true">
                <use xlink:href="#icon-sousuo1616"></use>
              </svg>
            </fa-button>
          </fa-input-search>
        </div>
        <div class="content">
          <div class="messageList">
            <ts-message-list :otherOptions="otherOptions" @handle-click="selectTarget" />
          </div>
        </div>
      </div>
      <div class="wxWorkMsgDetail_content_right">
        <div class="header">
          <fa-input-search
            v-model="requestParam.content"
            placeholder="消息内容"
            class="headerLine__search faUiSearchInput-white floatLeft"
            allowClear
            @search="onSearch"
          >
            <fa-button slot="enterButton" class="headerLine__search-button" size="large">
              <svg class="icon headerLine__search-icon icon_16" aria-hidden="true">
                <use xlink:href="#icon-sousuo1616"></use>
              </svg>
            </fa-button>
          </fa-input-search>
          <global-ts-date-picker
            class="datePicker"
            @handle-change="getSearchTime"
            :isUpdate.sync="isUpdateTime"
            :isInit="false"
          >
          </global-ts-date-picker>
          <global-ts-select
            class="typeList"
            :list="msgTypeList"
            v-model="requestParam.msgType"
            :selectkey="{ label: 'value', value: 'key' }"
          >
          </global-ts-select>
        </div>
        <div class="content">
          <div class="msg-content">
            <div class="scroll-content-wrap" v-if="!!messageList.length">
              <dynamic-scroller
                :items="messageList"
                :min-item-size="50"
                @scroll.native="rollingLoad"
                ref="msgContent"
                class="scroll-content"
              >
                <template v-slot="{ item, index, active }">
                  <dynamic-scroller-item class="msg-content-item" :item="item" :active="active" :data-index="index">
                    <div :class="['send-title', { isSelf: item.fromUserId === sendUserInfo.userId }]">
                      <span class="send-title-name"> {{ item.fromUserName }} </span>
                      &nbsp;<span class="send-title-time">({{ item.msgTimeName }})</span>
                    </div>
                    <div :class="['send-content', { noText: ![MSG_TYPE.TEXT].includes(item.msgType) }]">
                      <span class="testWrap" v-if="[MSG_TYPE.TEXT].includes(item.msgType)">{{ item.contentName }}</span>
                      <div v-if="[MSG_TYPE.IMAGE].includes(item.msgType)" class="imageMsgWrap">
                        <el-image
                          class="imageMsg"
                          fit="contain"
                          :src="item.mediaUrlThumb"
                          lazy
                          @click="handleClickImg(item.mediaUrl)"
                        >
                          <div slot="error" class="image-slot">
                            <span class="image-slot-tip">加载失败</span>
                          </div>
                          <div slot="placeholder" class="image-slot">
                            加载中...
                          </div>
                        </el-image>
                      </div>
                      <span v-if="item.hasRevoke" class="hasRevoke">（该消息已被撤回）</span>
                    </div>
                  </dynamic-scroller-item>
                </template>
              </dynamic-scroller>
            </div>
            <fa-empty class="tanshu-empty" v-else>
              <svg slot="image" class="icon tshu_empty_icon" aria-hidden="true">
                <use xlink:href="#icon-queshiicon-64-40"></use>
              </svg>
            </fa-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MSG_TYPE } from '../../config';
import TsMessageList from '@/components/base/ts-message-list/index.vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { Image } from 'element-ui';
import { Empty } from '@fk/faicomponent';
import { getChatDataList } from '@/api/modules/views/wx-work-msg-manager/wx-work-msg-list';

export default {
  name: 'wxWorkMsgDetail',
  components: { TsMessageList, DynamicScroller, DynamicScrollerItem, [Image.name]: Image, [Empty.name]: Empty },
  props: {
    sendUserInfo: {
      // 当前发送人
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      msgTypeList: [
        // 消息类型List
        { key: '', value: '全部消息' },
        { key: 'text', value: '文本' },
        { key: 'image', value: '图片' },
      ],
      requestParam: {
        // 聊天详情请求的参数
        relUserId: '', // 接收人 (即侧边栏选中的人)
        roomId: '', // 群聊ID
        content: '', // 消息内容
        msgType: '', // 消息类型
        // msgTimeStart: Ts_util.format.date(Ts_util.format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'), // 消息发送起始时间、
        // msgTimeEnd: Ts_util.format.date(new Date(), 'yyyy-MM-dd'), // 消息发送结束时间、
        msgTimeStart: '',
        msgTimeEnd: '',
      },
      pages: {
        pageNow: 1,
        limit: 20,
        maxPage: 2,
        total: 20,
      },
      messageList: [], // 消息列表
      previewImgUrl: '', // 当前预览的图片
      companyKey: '',
      requestCompanyKey: '', // 左侧消息列表请求参数 - 搜索联系人名称
      scrollLoadingFlag: true,
      isUpdateTime: false,
    };
  },
  computed: {
    otherOptions() {
      return {
        name: this.requestCompanyKey,
        ownerId: this.sendUserInfo.userId,
      };
    },
    MSG_TYPE() {
      return MSG_TYPE;
    },
  },
  watch: {
    'requestParam.msgType'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.onSearch();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    backManage() {
      this.$emit('changeComponent', 'wxWorkMsgData');
    },
    /**
     * @description 搜索
     * @author enson
     * @date 2021-04-30
     */
    onSearch() {
      const { pages } = this.$options.data.call(this);
      this.pages = pages;
      this.initData();
    },
    /**
     * @description 获取日期选择器的值
     * @author enson
     * @date 2020-05-11
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.msgTimeStart = (val && val[0]) || '';
      this.requestParam.msgTimeEnd = (val && val[1]) || '';
      this.onSearch();
    },
    /**
     * @description 获取消息详情
     * @author enson
     * @date 2021-05-10
     */
    async getMsgDetailInfo() {
      // 没有发送人和接收人的userId不存在 直接return
      if (!this.sendUserInfo.userId) return Promise.reject();

      // 通信人userid 群聊id 俩者缺一不可
      if (!this.requestParam.relUserId && !this.requestParam.roomId) return Promise.reject();

      const params = {
        ...{
          userId: this.sendUserInfo.userId,
          pageNow: this.pages.pageNow,
          limit: this.pages.limit,
        },
        ...this.requestParam,
      };
      const [err, response] = await getChatDataList(params);
      if (err) {
        return Promise.reject();
      }
      const resData = response.data;
      const allSize = response.total;
      const maxPage = Math.ceil(allSize / this.pages.limit) || 1;
      this.pages = Object.assign({}, this.pages, {
        maxPage: maxPage,
        total: allSize,
      });
      return Promise.resolve(resData);
    },
    /**
     * @description 点击图片预览
     * @author enson
     * @date 2021-05-10
     * @param {String} imgUrl - 图片链接
     */
    handleClickImg(imgUrl) {
      window.open(imgUrl);
    },
    /**
     * @description 选择聊天成员/聊天群
     * @author enson
     * @date 2021-05-11
     * @param {*} targetInfo
     */
    selectTarget(targetInfo) {
      this.resetRequestParam(); // 重置
      if (targetInfo.otherType !== 3) {
        // otherType，1成员，2客户，3群聊
        this.requestParam.relUserId = targetInfo.otherId;
      } else {
        this.requestParam.roomId = targetInfo.otherId;
      }
      this.initData();
    },
    changeMessageList() {
      this.requestCompanyKey = this.companyKey || '';
    },
    /**
     * @description 重置请求参数
     * @author enson
     * @date 2021-05-17
     */
    resetRequestParam() {
      const { requestParam, pages, scrollLoadingFlag } = this.$options.data.call(this);
      this.requestParam = Object.assign({}, requestParam);
      this.pages = pages;
      this.scrollLoadingFlag = scrollLoadingFlag;
      this.isUpdateTime = true;
    },
    rollingLoad(event) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        if (this.scrollLoad(event) && this.scrollLoadingFlag) {
          //scrollLoadingFlag为true说明可以进行下一次请求
          this.scrollLoadingFlag = false;
          if (this.pages.pageNow >= this.pages.maxPage) {
            this.scrollLoadingFlag = true;
            return;
          }
          this.pages.pageNow++;
          this.getMsgDetailInfo().then(messageList => {
            this.messageList = messageList.concat(this.messageList);
            const beforeLastIndex = messageList.length;
            this.scrollLoadingFlag = true;
            this.$nextTick(() => {
              if (this.$refs.msgContent) {
                this.$refs.msgContent.scrollToItem(beforeLastIndex);
              }
            });
          });
        }
      }, 50);
    },
    scrollLoad(event) {
      return event.target.scrollTop === 0;
    },
    /**
     * @description 初始化数据
     * @author enson
     * @date 2021-05-18
     */
    initData() {
      this.getMsgDetailInfo().then(messageList => {
        this.messageList = messageList;
        this.$nextTick(() => {
          if (this.$refs.msgContent) {
            this.$refs.msgContent.scrollToBottom();
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wxWorkMsgDetail {
  display: flex;
  height: 100%;
  flex-direction: column;
  .wxWorkMsgDetail_content {
    display: flex;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    flex: 1;
    .header {
      display: flex;
      height: 74px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
    }
    .content {
      position: relative;
      overflow: hidden;
      flex: 1;
    }
    .wxWorkMsgDetail_content_left {
      display: flex;
      width: 261px;
      min-width: 261px;
      background: $color-ff;
      border-right: 1px solid $border-disabled-color;
      flex-direction: column;
      .messageList {
        height: 100%;
      }
    }
    .wxWorkMsgDetail_content_right {
      position: relative;
      display: flex;
      background: $table-header-bg;
      border-radius: 0 4px 0 0;
      flex: 1;
      flex-direction: column;
      .header {
        position: relative;
        height: 74px;
        padding: 0 20px;
        justify-content: flex-start;
        &::after {
          position: absolute;
          bottom: 0;
          display: block;
          width: 100%;
          height: 1px;
          margin-left: -20px;
          background: $border-disabled-color;
          content: '';
        }
        .typeList {
          width: 220px;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        .msg-content {
          position: relative;
          padding-bottom: 0;
          overflow: hidden;
          flex: 1;
          .scroll-content-wrap {
            height: 100%;
          }
          .scroll-content {
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          .tanshu-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .hasRevoke {
            margin-left: 8px;
            font-size: 14px;
            color: $color-b2;
          }
          .send-title {
            display: flex;
            margin-bottom: 4px;
            font-size: 14px;
            color: $color-89;
            align-items: center;
            &.isSelf {
              color: $primary-color;
            }
          }
          .send-content {
            padding-bottom: 30px;
            font-size: 14px;
            line-height: 22px;
            color: $color-00;
            word-break: break-all;
            word-wrap: break-word;
            white-space: pre-wrap;
            &.noText {
              display: flex;
              align-items: flex-end;
              flex-wrap: wrap;
            }
            .imageMsg {
              .image-slot {
                display: flex;
                width: 140px;
                height: 100%;
                height: 140px;
                font-size: 14px;
                color: $color-89;
                background: $background-color;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
        .pagination {
          display: flex;
          padding: 20px;
          margin-top: 0;
          border-top: 1px solid $border-disabled-color;
          align-items: center;
        }
      }
      .tshu_select {
        .tshu_select_input {
          .motivate {
            height: 34px;
            line-height: 34px;
          }
        }
      }
    }
  }
  .wxWorkMsgDetail_content_left {
    .tanshu-message-list {
      .empty {
        position: absolute;
        top: 257px;
        left: 98px;
        margin: 0;
      }
    }
  }
}

.wxWorkMsgDetail .wxWorkMsgDetail_content .wxWorkMsgDetail_content_right .content .msg-content .send-content .imageMsg,
.wxWorkMsgDetail
  .wxWorkMsgDetail_content
  .wxWorkMsgDetail_content_right
  .content
  .msg-content
  .send-content
  .imageMsg
  img {
  max-width: 140px;
  max-height: 140px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.wxWorkMsgDetail {
  .wxWorkMsgDetail_content {
    .wxWorkMsgDetail_content_right {
      .content {
        .msg-content {
          .fa-spin-message {
            display: flex;
            justify-content: center;
          }
        }
      }
      .faUiSearchInput-white {
        .fa-input {
          background-color: transparent;
        }
      }
      .header {
        .el-input__inner {
          &.datePicker {
            margin-right: 12px;
            margin-left: 12px;
          }
        }
      }
    }
  }
}
.wxWorkMsgDetail .wxWorkMsgDetail_content .wxWorkMsgDetail_content_right .el-date-editor,
.wxWorkMsgDetail .wxWorkMsgDetail_content .wxWorkMsgDetail_content_right .el-date-editor .el-range-input {
  background-color: transparent;
}
</style>

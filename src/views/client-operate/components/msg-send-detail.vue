<!--
 * @Description  : 客户群发详情
 * @Author       : turbo
 * @Date         : 2021-08-02 14:26:48
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 16:03:16
-->

<template>
  <div class="msg-send-detail">
    <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
      <template #leftPart>{{ titleName }}</template>
      <template #rightPart>数据统计</template>
    </global-ts-tabguide>
    <div class="msg-send-detail__base-info">
      <div class="msg-task-info">标题：{{ msgTaskInfo.title }}</div>
      <div class="msg-task-info">
        创建人：{{ $utils.showStaffName(tsStaffExtraList, msgTaskInfo.sid, msgTaskInfo.creatorName) }}
      </div>
      <div v-if="chatType === 0" class="msg-task-info">群发范围：{{ msgTaskInfo.typeName }}</div>
      <div v-else class="msg-task-info">
        群主：
        <div ref="deptList" class="ellipsis-line">
          <span v-for="(item, index) in msgTaskInfo.departmentNameList" :key="item.id">
            <global-ts-svg-icon name="icon-bumen1616" :size="16"></global-ts-svg-icon>
            {{ item }}
            <span v-if="index < msgTaskInfo.departmentNameList.length - 1 || msgTaskInfo.userNameListStr">、</span>
          </span>
          {{ msgTaskInfo.userNameListStr }}
        </div>
        <el-popover
          v-if="msgTaskInfo.hasStaff && deptListLength > 360"
          popper-class="dept-list-popover"
          placement="bottom-end"
          width="380"
          trigger="click"
        >
          <div class="more-info">
            <span v-for="(item, index) in msgTaskInfo.departmentNameList" :key="item.id">
              <global-ts-svg-icon name="icon-bumen1616" :size="16"></global-ts-svg-icon>
              {{ item }}
              <span v-if="index < msgTaskInfo.departmentNameList.length - 1 || msgTaskInfo.userNameListStr">、</span>
            </span>
            {{ msgTaskInfo.userNameListStr }}
          </div>
          <template #reference>
            <a>查看</a>
          </template>
        </el-popover>
      </div>
      <div class="msg-task-info">
        群发类型：{{ msgTaskInfo.sendTypeName }}
        <a v-if="!msgTaskInfo.isCancel" class="cancel-btn" @click="cancelSend(taskId)">取消群发</a>
      </div>
      <div class="msg-task-info">创建时间：{{ msgTaskInfo.createTimeName }}</div>
      <div class="msg-task-info">群发时间：{{ msgTaskInfo.sendTimeName }}</div>
      <div v-if="chatType === 0 && msgTaskInfo.type === 2 && msgTaskInfo.hasStaff" class="msg-task-info">
        群发成员：
        <div ref="deptList" class="ellipsis-line">
          <span v-for="(item, index) in msgTaskInfo.departmentNameList" :key="item.id">
            <global-ts-svg-icon name="icon-bumen1616" :size="16"></global-ts-svg-icon>
            {{ item }}
            <span v-if="index < msgTaskInfo.departmentNameList.length - 1 || msgTaskInfo.userNameListStr">、</span>
          </span>
          {{ msgTaskInfo.userNameListStr }}
        </div>
        <el-popover
          v-if="msgTaskInfo.hasStaff && deptListLength > 360"
          popper-class="dept-list-popover"
          placement="bottom-end"
          width="380"
          trigger="click"
        >
          <div class="more-info">
            <span v-for="(item, index) in msgTaskInfo.departmentNameList" :key="item.id">
              <global-ts-svg-icon name="icon-bumen1616" :size="16"></global-ts-svg-icon>
              {{ item }}
              <span v-if="index < msgTaskInfo.departmentNameList.length - 1 || msgTaskInfo.userNameListStr">、</span>
            </span>
            {{ msgTaskInfo.userNameListStr }}
          </div>
          <template #reference>
            <a>查看</a>
          </template>
        </el-popover>
      </div>
      <div v-if="chatType === 0 && msgTaskInfo.type === 2 && msgTaskInfo.tagNameListStr" class="msg-task-info">
        群发标签：
        <div ref="tagList" class="ellipsis-line">{{ msgTaskInfo.tagNameListStr }}</div>
        <el-popover
          v-if="msgTaskInfo.tagNameListStr && tagListLength > 360"
          popper-class="dept-list-popover"
          placement="bottom-end"
          width="380"
          trigger="click"
        >
          <div class="more-info">{{ msgTaskInfo.tagNameListStr }}</div>
          <template #reference>
            <a>查看</a>
          </template>
        </el-popover>
      </div>
      <div v-if="chatType === 0 && msgTaskInfo.addStartTimeName" class="msg-task-info">
        添加时间：
        {{ msgTaskInfo.addStartTimeName }}
        {{ msgTaskInfo.addStartTimeName ? ' 至 ' : '' }}
        {{ msgTaskInfo.addEndTimeName }}
      </div>
      <div class="msg-task-info">
        群发内容：
        <div class="send-content">
          <span v-if="msgTaskInfo.textContent" class="item">{{ msgTaskInfo.textContent }}</span>
          <span v-if="msgTaskInfo.contentType === 2" class="item">
            <global-ts-svg-icon name="icon-lianjie1616" :size="16"></global-ts-svg-icon>
            {{ msgTaskInfo.linkTitle }}
          </span>
          <span v-if="msgTaskInfo.contentType === 4" class="item">
            <global-ts-svg-icon name="icon-wenzhang1616" :size="16"></global-ts-svg-icon>
            {{ msgTaskInfo.linkTitle }}
          </span>
          <img v-if="msgTaskInfo.imgMediaIdUrl" class="img-item" img :src="msgTaskInfo.imgMediaIdUrl" />
        </div>
      </div>
    </div>
    <div class="pro_listBox">
      <div class="msg-send-detail__data-info">
        <div class="data-info-item" v-for="item in countList" :key="item.key">
          <div class="title">{{ item.title }}</div>
          <div class="content">
            <div v-for="subItem in item.info" :key="subItem.key" class="item">
              <global-ts-tool-tips
                :disabled="!subItem.disabled"
                offset="10"
                class="item"
                effect="dark"
                placement="top-start"
              >
                <template #content>
                  未群发：{{ msgTaskInfo.awaitNum }}<br />
                  超数量上限群发失败：{{ msgTaskInfo.notReceiveNum }}<br />
                  非好友关系群发失败：{{ msgTaskInfo.notFriendNum }}
                </template>
                <div>
                  <div class="number">{{ subItem.number }}</div>
                  <div>{{ subItem.subTitle }}</div>
                </div>
              </global-ts-tool-tips>
            </div>
          </div>
        </div>
      </div>
      <global-ts-slide has-padding :slid-array="slideList" @changeStatus="changeSlide"></global-ts-slide>
      <component
        :is="currentComponent"
        :chat-type="chatType"
        :task-id="taskId"
        :msg-task-info="msgTaskInfo"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { merge } from 'lodash';

// components
import SendDetailList from './send-detail-list.vue';
import ReceiveDetailList from './receive-detail-list.vue';

// utils
import { cancelSend } from '../utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'MsgSendDetail',
  components: { SendDetailList, ReceiveDetailList },
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      taskId: 0,
      msgTaskInfo: {},
      countList: [],
      deptListLength: 0,
      tagListLength: 0,
      slideList: [],
      currentComponent: 'sendDetailList',
    };
  },
  computed: {
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    titleName() {
      return this.chatType === 0 ? '客户群发' : '客户群群发';
    },
    sendName() {
      return this.chatType === 0 ? '成员' : '群主';
    },
    receiveName() {
      return this.chatType === 0 ? '客户' : '客户群';
    },
  },
  created() {
    this.$pubsub.emit('toMsgSendDetail', taskId => {
      this.taskId = taskId;
      this.syncMsgResult(taskId);
    });
  },
  methods: {
    async syncMsgResult(taskId) {
      const { getMsgTaskInfo } = wxwork;
      const [err, res] = await getMsgTaskInfo({ taskId });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.msgTaskInfo = merge({}, this.msgTaskInfo, res.data);
      this.msgTaskInfo.userNameListStr = this.msgTaskInfo.userNameList.join('、');
      this.msgTaskInfo.tagNameListStr = this.msgTaskInfo.tagNameList.join('、');
      this.msgTaskInfo.hasStaff =
        this.msgTaskInfo.departmentNameList.length > 0 || this.msgTaskInfo.userNameList.length > 0;
      this.countList = [
        {
          key: 'send',
          title: `${this.sendName}群发统计`,
          info: [
            {
              key: '1_1',
              subTitle: `全部${this.sendName}`,
              number: this.msgTaskInfo.userTotal,
              disabled: false,
            },
            {
              key: '1_2',
              subTitle: '已群发',
              number: this.msgTaskInfo.sendNum,
              disabled: false,
            },
            {
              key: '1_3',
              subTitle: '未群发',
              number: this.msgTaskInfo.unSendNum,
              disabled: false,
            },
          ],
        },
        {
          key: 'receive',
          title: `${this.receiveName}接收统计`,
          info: [
            {
              key: '1_1',
              subTitle: `${this.chatType === 0 ? '全部客户' : '客户群'}`,
              number: this.msgTaskInfo.clientTotal,
              disabled: false,
            },
            {
              key: '1_2',
              subTitle: '已收到',
              number: this.msgTaskInfo.receiveNum,
              disabled: false,
            },
            {
              key: '1_3',
              subTitle: '未收到',
              number: this.msgTaskInfo.unReceiveNum,
              disabled: true,
            },
          ],
        },
      ];
      this.slideList = [
        {
          value: 'sendDetailList',
          key: `${this.sendName}群发明细`,
        },
        {
          value: 'receiveDetailList',
          key: `${this.receiveName}接收明细`,
        },
      ];
      this.$nextTick(() => {
        if (this.msgTaskInfo.type === 2 && this.msgTaskInfo.hasStaff) {
          this.deptListLength = this.$refs.deptList?.clientWidth;
        }
        if (this.msgTaskInfo.tagNameListStr) {
          this.tagListLength = this.$refs.tagList?.clientWidth;
        }
      });
    },
    cancelSend,
    changeSlide(e, value) {
      this.currentComponent = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.msg-send-detail {
  .msg-send-detail__base-info {
    @include card-in-gray;
    @include flex-wrap;

    padding: 20px 0 0 20px;
    margin-bottom: 20px;
    color: $color-53;

    .msg-task-info {
      @include flex-top-left;

      width: 50%;
      margin-bottom: 20px;
      line-height: 19px;
    }

    .ellipsis-line {
      @include ellipsis;

      max-width: 361px;
    }

    .cancel-btn {
      margin-left: 10px;
    }

    .send-content {
      @include flex-column-left;

      > .item + .item {
        margin-top: 8px;
      }

      .img-item {
        width: 140px;
        border-radius: 4px;
      }
    }
  }

  .msg-send-detail__data-info {
    @include flex-center;

    margin-bottom: 30px;

    > .data-info-item + .data-info-item {
      margin-left: 20px;
    }

    .data-info-item {
      flex: 1;
      color: $color-53;

      .title {
        margin-bottom: 12px;
      }

      .content {
        @include flex-between;

        height: 150px;
        border: 1px solid $color-ee;
        border-radius: 4px;

        &::before,
        &::after {
          display: block;
          content: '';
        }

        .item {
          @include flex-column-center;

          width: 100px;

          .number {
            margin-bottom: 12px;
            font-size: 32px;
            font-weight: bold;
            line-height: 42px;
            color: $color-00;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-popover {
  &.dept-list-popover {
    overflow-y: auto;

    .more-info {
      max-height: 190px;
    }
  }
}
</style>

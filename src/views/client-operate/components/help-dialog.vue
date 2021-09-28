<!--
 * @Description  : 使用前必读对话框
 * @Author       : turbo
 * @Date         : 2021-08-02 11:58:35
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 15:01:07
-->

<template>
  <global-ts-dialog
    class="help-dialog"
    dialog-size="medium"
    dialog-title="使用前必读"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <div v-for="item in helpInfo" :key="item.key" class="line">
      <div class="title">{{ item.title }}</div>
      <div class="explain" :class="{ 'red-text': item.isRed }">{{ item.explain }}</div>
    </div>
  </global-ts-dialog>
</template>

<script>
const helpInfoMap = new Map([
  [
    0,
    [
      {
        key: 1,
        title: '一、什么是客户群发？',
        explain: '企业成员可把通知、祝福、活动等消息批量发送给指定客户。',
        isRed: false,
      },
      {
        key: 2,
        title: '二、如何使用客户群发？',
        explain:
          '管理员先拟好群发内容，再选择需要群发的客户（打上某些标签或加了xx为好友），以“群发任务”的形式指派给对应的企业成员，成员在企业微信上点击即可一键群发。',
        isRed: false,
      },
      {
        key: 3,
        title: '三、群发是否有频率限制？',
        explain: '客户每个自然月最多接收4条群发消息，超出将群发失败。',
        isRed: true,
      },
      {
        key: 4,
        title: '四、群发后可查看哪些数据？',
        explain: '支持查看企业成员群发情况（谁群发了，谁还没群发）、客户接收情况（多少客户收到了，多少客户没收到）。',
        isRed: false,
      },
    ],
  ],
  [
    1,
    [
      {
        key: 1,
        title: '一、什么是客户群群发？',
        explain: '企业成员可把通知、祝福、活动等消息批量发送给客户群。',
        isRed: false,
      },
      {
        key: 2,
        title: '二、如何使用客户群发？',
        explain:
          '管理员先拟好群发内容，再选择需要群发的客户群，以“群发任务”的形式指派给对应的群主，群主在企业微信上点击即可一键群发。',
        isRed: false,
      },
      {
        key: 3,
        title: '三、群发是否有频率限制？',
        explain: '每个客户群每个自然月最多接收4条群发消息，超出将群发失败。',
        isRed: true,
      },
      {
        key: 4,
        title: '四、群发后可查看哪些数据？',
        explain: '支持查看群主群发情况（谁群发了，谁还没群发）、客户群接收情况（多少个群收到了，多少个群没收到）。',
        isRed: false,
      },
    ],
  ],
]);

export default {
  name: 'HelpDialog',
  props: {
    chatType: {
      // 0 - 客户群发, 1 - 客户群群发
      type: Number,
      required: true,
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    helpInfo() {
      return helpInfoMap.get(this.chatType);
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    sure() {
      this.cancel();
    },
  },
};
</script>

<style lang="scss" scoped>
.help-dialog {
  .line {
    margin-bottom: 32px;
    color: $color-53;

    &:last-child {
      margin-bottom: 0;
    }

    .title {
      margin-bottom: 8px;
      font-weight: bold;
      color: $color-00;
    }

    .explain {
      &.red-text {
        color: $error-color;
      }
    }
  }
}
</style>

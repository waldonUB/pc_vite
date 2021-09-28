<!--
 * @Description  : 客户群群发
 * @Author       : turbo
 * @Date         : 2021-03-30 15:32:46
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-03 13:51:12
-->

<template>
  <keep-alive include="wxSendMsgList">
    <component
      :is="currentComponent"
      :chat-type="1"
      @backToPrePage="currentComponent = 'wxSendMsgList'"
      @addMsgSend="currentComponent = 'addMsgSend'"
      @msgSendDetail="currentComponent = 'msgSendDetail'"
    ></component>
  </keep-alive>
</template>

<script>
// components
import WxSendMsgList from '../components/wx-send-msg-list.vue';
import AddMsgSend from '../components/add-msg-send.vue';
import MsgSendDetail from '../components/msg-send-detail.vue';

export default {
  name: 'WxGroupMsgSend',
  components: { WxSendMsgList, AddMsgSend, MsgSendDetail },
  data() {
    return {
      currentComponent: 'wxSendMsgList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

<!--
 * @Description  : 客户群发
 * @Author       : turbo
 * @Date         : 2021-03-30 15:31:52
 * @LastEditors  : turbo
 * @LastEditTime : 2021-08-02 15:05:28
-->

<template>
  <keep-alive include="wxSendMsgList">
    <component
      :is="currentComponent"
      :chat-type="0"
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
  name: 'WxCorpMsgSend',
  components: { WxSendMsgList, AddMsgSend, MsgSendDetail },
  data() {
    return {
      currentComponent: 'wxSendMsgList',
    };
  },
};
</script>

<style lang="scss" scoped></style>

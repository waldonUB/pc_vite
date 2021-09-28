<!--
 * @Author       : ADI
 * @Date         : 2021-04-14 14:23:15
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-14 14:37:01
-->
<template>
  <fa-modal
    v-model="visible"
    :closable="false"
    :centered="true"
    :maskClosable="false"
    :width="669"
    :footer="null"
    :zIndex="1000"
    wrapClassName="ts_versionChangePopup"
  >
    <div class="content">
      <div class="btn" @click="cancel"></div>
    </div>
  </fa-modal>
</template>

<script>
import { setCookie, format, FdpLog } from '@/utils';
import { mapState } from 'vuex';
import { Modal } from '@fk/faicomponent';

export default {
  name: 'index',
  components: {
    [Modal.name]: Modal,
  },
  computed: {
    ...mapState({
      globalData: state => state.globalData,
    }),
  },
  mounted() {
    FdpLog('yx_portal_popup_expo', {
      yx_free_text_0: '12月版本调整通知',
    });
    setCookie(`ts_versionChangePopup${this.globalData.userTicket}`, true, {
      expires: format.addDate(new Date(), 30, 'days'),
    });
  },
  methods: {
    cancel() {
      FdpLog('yx_portal_popup_click', {
        yx_free_text_0: '弹窗点击时记录',
      });
      this.visible = false;
      this.resolve();
    },
  },
};
</script>

<style lang="scss">
.ts_versionChangePopup {
  .fa-modal-content {
    background-color: transparent;
    box-shadow: none;
  }
  .fa-modal-body {
    padding: 0;
  }
  .content {
    position: relative;
    width: 669px;
    height: 515px;
    background: url('~@/assets/image/comm/operateTip/changePopup.png') no-repeat;
    background-size: 100% 100%;
    .btn {
      position: absolute;
      right: 0;
      bottom: 35px;
      left: 0;
      width: 328px;
      height: 88px;
      margin: auto;
      cursor: pointer;
      background: url('~@/assets/image/comm/operateTip/changePopupBtn.png') no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url('~@/assets/image/comm/operateTip/changePopupBtn-hover.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>

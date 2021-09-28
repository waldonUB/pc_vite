<!--
 * @Author       : ADI
 * @Date         : 2021-05-11 17:23:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-31 11:11:45
-->
<template>
  <div class="gfwClose" v-cloak>
    <div class="gfwClose_msg" v-if="gwfData.gfwInfoList.length || gwfData.isPlatformClose">
      <span class="gfwClose_msg_text">{{ gwfData.gfwCloseMsg }}</span>
      <span class="gfwClose_msg_url" @click="showGfwDialog" v-if="!gwfData.isPlatformClose">立即查看</span>
      <a class="feedback" v-if="gwfData.showFeedback" @click="jumpFeedback" target="_blank">
        提交申诉
      </a>
    </div>
    <ts-gfw-warn-dialog
      :dialog-visible.sync="isShowGfwDialog"
      :gfw-info-list="gwfData.gfwInfoList"
    ></ts-gfw-warn-dialog>
  </div>
</template>

<script>
import { getGfwInto } from '@/api/modules/utils/gfw';
import { postMessage, confirm } from '@/utils';
import { toURL } from '../utils/index.js';
import tsGfwWarnDialog from '@/components/base/ts-gfw-warn-dialog/index.vue';
import { mapState } from 'vuex';

export default {
  name: 'gfw',
  components: { tsGfwWarnDialog },
  props: {},
  data() {
    return {
      gwfData: {
        gfwCloseMsg: '',
        gfwCloseUrl: '',
        gfwInfoList: [],
        isPlatformClose: false,
        showFeedback: false,
      },
      isShowGfwDialog: false,
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData?.addressUrl,
    }),
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      const [err, res] = await getGfwInto();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg,
        });
        return;
      }
      this.gwfData = res.data;
    },
    /**
     * 显示告警弹窗/直接跳转到对应链接
     * @author waldon
     * @date 2020/5/22
     */
    showGfwDialog() {
      if (this.gwfData.gfwInfoList.length > 1) {
        this.isShowGfwDialog = true;
      } else if (this.gwfData.gfwInfoList.length === 1) {
        // 直接跳转链接
        window.open(this.gwfData.gfwInfoList[0].gfwCloseUrl);
      }
    },
    /**
     *跳转到申诉中心
     * @author tomato
     * @date 2020-04-10
     */
    jumpFeedback() {
      confirm('请确认已经整改了违规内容，再进行申诉', '提交申诉').then(action => {
        if (action == 'confirm') {
          toURL('functionalSuggestionUrl');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.gfwClose {
  /* float: left; */
  display: inline-block;
  min-width: 480px;
  margin: 0 auto;
  font-size: 12px;
  .feedback {
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .gfwClose_msg {
    height: 40px;
    padding-right: 20px;
    margin: 10px;
    white-space: nowrap;
    background: rgba(255, 245, 220, 1);
    .gfwClose_msg_text {
      padding: 0 20px;
      font-size: 14px;
      line-height: 40px;
      color: rgba(255, 0, 0, 1);
      text-indent: 10px;
    }
    .gfwClose_msg_url {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

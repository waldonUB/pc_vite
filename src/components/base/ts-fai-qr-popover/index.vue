<!--
 * @Author       : ADI
 * @Date         : 2021-07-15 15:07:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 16:33:36
-->
<template>
  <el-popover v-bind="$attrs" v-on="$listeners" @show="visibleChange">
    <div class="qr-wrapper" @click.stop="operatePopover">
      <fa-tabs defaultActiveKey="qr" @change="changeTab">
        <fa-tab-pane tab="二维码" key="qr">
          <div class="imgBox">
            <img class="imgContent" :src="shareInfo.qrImgUrl" alt="" />
          </div>
          <div class="tip">打开微信扫一扫，右上角分享</div>
          <div class="operate-box">
            <global-ts-button class="left-btn" type="primary" size="small" @click="downloadQrImg">
              下载二维码
            </global-ts-button>
            <global-ts-button type="mainText" size="small" @click="copyH5Link">复制链接 </global-ts-button>
          </div>
        </fa-tab-pane>
        <fa-tab-pane tab="小程序码" key="miniApp" v-if="isShowMiniApp">
          <div class="imgBox">
            <img class="imgContent" :src="miniAppImgUrl" alt="" />
          </div>
          <div class="tip">微信扫一扫，分享给好友</div>
          <div class="operate-box">
            <global-ts-button type="primary" size="small" @click="downloadMiniAppImg">下载小程序码 </global-ts-button>
          </div>
        </fa-tab-pane>
      </fa-tabs>
    </div>
    <template slot="reference">
      <slot name="open"></slot>
    </template>
  </el-popover>
</template>

<script>
import { addUrlParams, clipboard, dom } from '@/utils';
import { generatorForShareQr } from '@/api/modules/component/fai-qr-popover';
import { Popover } from 'element-ui';
import { Tabs } from '@fk/faicomponent';

export default {
  name: 'ts-fai-qr-popover',
  components: {
    [Popover.name]: Popover,
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane,
  },
  props: {
    shareInfo: {
      type: Object,
      default: () => {
        return {
          qrImgUrl: '',
        };
      },
    },
    isShowMiniApp: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentKey: 'qr', // 当前选择的key
      miniAppImgUrl: '', // 小程序码
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    operatePopover() {
      this.$emit('operatePopover');
    },
    /**
     * popover显示/隐藏回调
     * 因小程序码加载较慢，所以改为一开始就加载
     * @author waldon
     * @date 2021/7/5
     * @param {Boolean} newVal - 显示/隐藏
     */
    visibleChange(newVal) {
      console.log('newVal', newVal);
      const callbackFn = miniAppImgOptions => {
        this.createMiniAppImg(miniAppImgOptions).then(res => {
          this.miniAppImgUrl = res;
        });
      };
      this.$emit('visibleChange', {
        callbackFn,
      });
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
     * 下载二维码
     * @author waldon
     * @date 2021/7/2
     */
    downloadQrImg() {
      const url = addUrlParams(this.shareInfo.qrImgUrl, {
        download: true,
      });
      window.open(url);
    },
    /**
     * 下载小程序码
     * @author waldon
     * @date 2021/7/2
     * @returns {Object} - 返回值说明
     */
    async downloadMiniAppImg() {
      dom.downloadBlobToImg({
        blob: this.miniAppImgUrl,
        fileName: this.shareInfo.fileName,
      });
    },
    /**
     * 生成小程序码的通用逻辑
     * @author waldon
     * @date 2021/7/2
     * @param {Object} options - 参数
     * @returns {Promise} -
     */
    async createMiniAppImg(options) {
      const [err, shareRes] = await generatorForShareQr(options);
      if (err) {
        return Promise.reject(err);
      }
      const URL = window.URL || window.webkitURL;
      const objectUrl = URL.createObjectURL(shareRes);
      return Promise.resolve(objectUrl);
      // return new Promise(async (resolve, reject) => {
      //   const shareRes = await post('/rest/manage/qrCode/generatorForShareQr', options, {
      //     emulateJSON: false,
      //     responseType: 'blob',
      //   });
      //   if (!(shareRes && shareRes.data)) {
      //     reject();
      //     return;
      //   }
      //   const URL = window.URL || window.webkitURL;
      //   const objectUrl = URL.createObjectURL(shareRes.data);
      //   resolve(objectUrl);
      // });
    },
    /**
     * 复制h5链接
     * @author waldon
     * @date 2021/7/2
     * @returns {Object} - 返回值说明
     */
    copyH5Link() {
      clipboard(this.shareInfo.h5DetailUrl, '复制成功', '当前浏览器不支持', true);
    },
    /**
     * 改变页签
     * @author waldon
     * @date 2021/7/2
     * @param {String} newVal - 页签值
     */
    changeTab(newVal) {
      this.currentKey = newVal;
      this.$emit('changeTab', newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-fai-qr-popover {
}
</style>

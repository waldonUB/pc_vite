<!--
 * @Author       : ADI
 * @Date         : 2021-07-06 14:33:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 14:34:48
-->

<script>
import { gotoWxCorpSet, getWxWorkCorp } from '@/utils';

export default {
  name: 'auth-comm',
  components: {},
  props: {},
  data() {
    return {
      wxWorkCorpData: {}, // 企微信息
    };
  },
  computed: {},
  watch: {},
  created() {
    getWxWorkCorp().then(res => {
      this.wxWorkCorpData = res;
    });
    this.getAuthTip();
  },
  mounted() {},
  methods: {
    /**
     * 从缓存中获取是否要提示
     * 因为授权小程序的方法中用了reload这种强硬的手段
     * 这里只能通过这种方式来规避一下
     * @author waldon
     * @date 2021/3/8
     */
    getAuthTip() {
      if (sessionStorage.getItem('authTip') === 'show') {
        const wxSettingPath = gotoWxCorpSet(false);
        const href = `${location.origin}/#/${wxSettingPath}`;
        this.$utils.postMessage({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: `
                            <div>成功授权第三方小程序，您在企业微信上的小程序已失效，请安装新的小程序，<a href="${href}">去处理</a></div>
                        `,
        });
        sessionStorage.setItem('authTip', 'hide');
      }
    },
    /**
     * 用户之前没有授权第三方就安装了企微第三方小程序，
     * 之后他再授权第三方小程序。所以，之前安装的企微小程序是失效的，
     * 此时，需要提醒用户去删除掉之前安装的小程序，
     * 再重新把自己的小程序安装到企微
     * @author waldon
     * @date 2021/3/8
     */
    setAuthTip() {
      if (this.wxWorkCorpData.appleAgentId) {
        // 用户已安装企微小程序
        sessionStorage.setItem('authTip', 'show');
      }
    },
  },
};
</script>

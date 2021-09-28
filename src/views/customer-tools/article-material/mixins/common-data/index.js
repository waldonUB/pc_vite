/*
 * @Author       : ADI
 * @Date         : 2021-05-19 10:38:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-26 09:56:06
 */
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { postMessage } from '@/utils';
import { getTempTypeList } from '@/api/modules/views/customer-tools/article-material';

export default {
  computed: {
    ...mapState({
      addressUrl: state => state.globalData?.addressUrl,
      jumpUrl: state => state.globalData?.addressUrl.updateVersionUrl,
    }),
    isHaveVersion() {
      return versionDef.getIsFreeTry() || versionDef.getIsProfessionnal();
    },
  },
  data() {
    return {
      tempTypeList: [], // 企业文库二级分类
      tempTypeId: '', // 当前选择的分类id
      linkTarget: {},
      isShowBubble: false,
    };
  },
  methods: {
    addClassify(target, position = 'right') {
      this.linkTarget = {
        target,
        position,
      };
      console.log(this.linkTarget);
      this.isShowBubble = true;
    },
    /**
     * 获取企业文库二级分类
     * @author waldon
     * @date 2020/9/16
     */
    async getTempTypeList() {
      const params = {
        isGetAll: true,
      };
      const [err, res] = await getTempTypeList(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.tempTypeList = res.data;
      return Promise.resolve(res.data);
    },
  },
  created() {
    this.getTempTypeList();
  },
};

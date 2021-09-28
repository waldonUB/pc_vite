<!--
 * @Author       : ADI
 * @Date         : 2021-07-19 11:47:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:34
-->
<script>
import { getTaskTypeDef } from '@/api/modules/views/corp-manage/all-task';

export default {
  name: 'taskCommon',
  components: {},
  props: {},
  data() {
    return {
      taskTypeList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getTaskTypeDef();
  },
  mounted() {},
  methods: {
    /**
     * 获取任务类型定义
     * @author waldon
     * @date 2020/11/7
     */
    async getTaskTypeDef() {
      const [err, res] = await getTaskTypeDef();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.taskTypeList = res.data.typeList;
    },
  },
};
</script>

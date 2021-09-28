<!--
 * @Author       : ADI
 * @Date         : 2021-07-25 09:25:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:47
-->

<script>
import { getTaskTypeDef } from '@/api/modules/views/corp-manage/my-task';

export default {
  name: 'task-common',
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

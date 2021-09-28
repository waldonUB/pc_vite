<!--
 * @Author       : ADI
 * @Date         : 2021-07-07 16:36:57
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 16:42:45
-->

<script>
import { setRoleInfo } from '@/api/modules/views/setting-center/role-manage';

export default {
  methods: {
    /**
     * 添加/修改/删除角色
     * @author waldon
     * @date 2021/1/4
     * @param {Object} params - 行数据
     * @param {String} type - 类型
     */
    async setRoleInfo(params, type) {
      const [err, res] = await setRoleInfo(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg,
      });
      if (type === 'add') {
        // 创建角色成功计算
        this.$utils.FdpLog('yx_cjjs', {});
      }
      return Promise.resolve();
    },
  },
};
</script>

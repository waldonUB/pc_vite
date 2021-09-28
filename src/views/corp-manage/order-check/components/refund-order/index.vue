<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 16:53:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 17:27:28
-->
<template>
  <global-ts-bubble
    :isShow.sync="isShow"
    :style="nowStyle"
    @cancel="cancelShow"
    @sure="onSubmit"
    v-windowResize="changePosition"
  >
    <template v-slot:boxContent>
      <div class="radioBox">
        <span v-for="(item, index) in statusList" :key="index">
          <input type="radio" v-model="form.refundOrder" :id="'radio' + index" name="radio" :value="item.value" />
          <label :for="'radio' + index">{{ item.label }}</label>
        </span>
      </div>
      <div class="tipsText">
        <span class="warning_alert">
          <global-ts-svg-icon class="icon" name="icon-bianzu"></global-ts-svg-icon>
          确定已审核后<b>无法恢复</b>
        </span>
      </div>
    </template>
  </global-ts-bubble>
</template>

<script>
import { bubble } from '@/utils';
import { auditTsOrder } from '@/api/modules/views/corp-manage/order-check';

export default {
  name: 'refund-order',
  components: {},
  props: {},
  data() {
    return {
      form: {
        id: 0,
        refundOrder: 0,
      },
      isShow: true,
      linkTarget: null,
      nowStyle: '',
      statusList: [
        {
          value: 1,
          label: '已审核',
        },
        {
          value: 0,
          label: '待审核',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     *确认修改订单审核状态
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    async onSubmit() {
      if (this.form.refundOrder == 1) {
        const [err, res] = await auditTsOrder(this.form);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg,
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功！',
        });
        this.isShow = false;
        // 重新加载数据
        this.parent.isReload = true;
        this.form.refundOrder = 0;
      } else {
        this.isShow = false;
      }
    },
    /**
     *取消修改
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    cancelShow() {
      this.isShow = false;
    },
    /**
     *设置弹窗对应订单对象
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    changeTarget(opt) {
      this.linkTarget = opt;
      this.changePosition();
    },
    /**
     *设置弹窗位置
     *
     * @author guoyijie
     * @date 2020-04-10
     */
    changePosition() {
      this.$nextTick(() => {
        this.nowStyle = bubble.calculatePosition(
          this.$el,
          this.linkTarget.target,
          this.linkTarget.position,
          document.querySelector('.orderBox'),
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.refund-order {
}
</style>

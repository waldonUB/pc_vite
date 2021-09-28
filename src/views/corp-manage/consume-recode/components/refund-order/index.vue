<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 15:26:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 13:58:15
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
          确定退款后<b>无法恢复</b>
        </span>
      </div>
    </template>
  </global-ts-bubble>
</template>

<script>
import { bubble } from '@/utils';
import { refundTsOrderItem } from '@/api/modules/views/corp-manage/consume-recode';

export default {
  name: 'refund-order',
  components: {},
  props: {},
  data() {
    return {
      form: {
        id: 0,
      },
      isShow: true,
      linkTarget: null,
      nowStyle: '',
      statusList: [
        {
          value: 1,
          label: '退款',
        },
        {
          value: 0,
          label: '不退款',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      if (this.form.refundOrder == 1) {
        const [err, res] = await refundTsOrderItem(this.form);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg,
          });
          return Promise.reject(err);
        }
        // 重新加载数据
        this.parent.isReload = true;
        this.cancelShow();
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功！',
        });
      } else {
        this.cancelShow();
      }
    },
    // 取消隐藏信息
    cancelShow() {
      this.isShow = false;
    },
    changeTarget(opt) {
      this.linkTarget = opt;
      this.changePosition();
    },
    changePosition() {
      this.$nextTick(() => {
        this.nowStyle = bubble.calculatePosition(
          this.$el,
          this.linkTarget.target,
          this.linkTarget.position,
          document.querySelector('.consumeBox'),
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.radioBox {
  float: left;
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.tipsText {
  float: left;
}
</style>

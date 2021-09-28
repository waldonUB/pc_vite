<!--
 * @Author       : ADI
 * @Date         : 2021-07-23 15:01:41
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 15:08:52
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
        <span v-for="(label, value) in payStatusArr" :key="value">
          <input type="radio" v-model="form.status" :id="'radio' + value" name="radio" :value="value" />
          <label :for="'radio' + value">{{ label }}</label>
        </span>
      </div>
      <div class="tipsText">
        <span class="warning_alert">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bianzu"></use>
          </svg>
          确认支付成功后<b>无法更改</b>
        </span>
      </div>
    </template>
  </global-ts-bubble>
</template>

<script>
import { bubble } from '@/utils';
import { payBkgeRecord } from '@/api/modules/views/corp-manage/commision-record';

export default {
  name: 'commision',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      if (this.form.status == 1) {
        const [err, res] = await payBkgeRecord(this.form);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg,
          });
          return Promise.reject(err);
        }
        this.cancelShow();
        // 重新加载数据
        this.parent.isReload = true;
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功',
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
          document.querySelector('.commisionBox'),
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.commision {
}
</style>

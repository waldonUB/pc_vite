<!--
 * @Author       : ADI
 * @Date         : 2021-07-30 13:52:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 14:27:54
-->
<template>
  <global-ts-bubble
    id="messageBox"
    :isShow.sync="isShow"
    :style="nowStyle"
    v-windowResize="changePosition"
    @cancel="cancelShow"
    @sure="sureShow"
  >
    <template v-slot:boxContent>
      <div class="radioBox">
        <span v-for="(item, index) in payTypeList" :key="index">
          <input
            type="radio"
            v-model="poupUpInfo.bkgeStatus"
            :id="'changePayType' + index"
            name="changePayType"
            :value="item.value"
          />
          <label :for="'changePayType' + index">{{ item.changeLabel }}</label>
        </span>
      </div>
      <div class="tipsText">修改后将会改变分佣状态</div>
    </template>
  </global-ts-bubble>
</template>

<script>
import { bubble } from '@/utils';
import { setTsProductStatus } from '@/api/modules/views/corp-manage/product-manage';

export default {
  name: 'change-bk-type',
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
    //点击确定按钮
    async sureShow() {
      //确定修改分佣状态
      const [err, res] = await setTsProductStatus(this.poupUpInfo);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg,
        });
        return Promise.reject(err);
      }
      this.parent.updateSomeQuene(this.poupUpInfo);
      this.$utils.postMessage({
        type: 'success',
        message: '修改成功！',
      });
      this.cancelShow();
    },
    //取消显示
    cancelShow() {
      this.isShow = false;
    },
    changeTarget(opt) {
      this.poupUpInfo.bkgeStatus = opt.bkgeStatus;
      this.poupUpInfo.id = opt.id;
      this.linkTarget = opt.target;
      this.parent = opt.parent;
      this.payTypeList = this.parent.payTypeList;
      this.isShow = true;
      this.changePosition();
    },
    changePosition() {
      this.$nextTick(() => {
        this.nowStyle = bubble.calculatePosition(
          this.$el,
          this.linkTarget,
          'right',
          document.querySelector('.productManage'),
        );
      });
    },
  },
};
</script>

<style lang="scss">
#messageBox {
  width: 320px;
  .contentBox {
    padding: 20px;
    .radioBox {
      height: 40px;
      margin-bottom: 4px;
      line-height: 40px;
    }
    .tipsText {
      font-size: 14px;
      font-weight: 400;
      color: $color-89;
      text-align: left;
    }
  }
}
</style>

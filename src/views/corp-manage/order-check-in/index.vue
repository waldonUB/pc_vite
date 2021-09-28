<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 17:39:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-21 13:58:55
-->
<template>
  <div class="orderEdit">
    <div id="order_check_edit_new_add">
      <div></div>
    </div>
    <!--挂载新增页编辑订单详情弹窗-->
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import searchUser from './components/search-user/index.vue';
import checkOrder from './components/check-order/index.vue';

export default {
  name: 'order-check-in',
  components: { searchUser, checkOrder },
  props: {},
  data() {
    return {
      currentComponent: 'searchUser',
      passData: {}, //组件之前传递param
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeCom(name) {
      this.currentComponent = name;
    },
    backToOtherPage() {
      this.$router.push({
        path: '/orderCheck',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.orderEdit {
  height: 100%;
}
</style>

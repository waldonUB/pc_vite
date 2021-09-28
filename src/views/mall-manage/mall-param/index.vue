<!--
 * @Description  : 商品参数
 * @Author       : turbo
 * @Date         : 2021-03-30 15:27:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:15:03
-->

<template>
  <div class="mallParam">
    <component :is="currentComponent" @changeComponent="change"></component>
  </div>
</template>

<script>
import setMallParam from './components/set-mall-param/index.vue';

export default {
  name: 'mallParam',
  components: {
    setMallParam,
  },
  props: {},
  data() {
    return {
      currentComponent: 'setMallParam',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 切换组件
     * @author lymn
     * @date 2020-08-24
     * @param {String} component 组件名称
     */
    change(component) {
      this.currentComponent = component;
    },
  },
};
</script>

<style lang="scss" scoped>
.mallParam {
}
</style>

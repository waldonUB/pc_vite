<!--
 * @Description  : 获客海报 - 海报
 * @Author       : turbo
 * @Date         : 2021-03-30 13:48:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 14:13:23
-->

<template>
  <div class="posterManage">
    <router-view v-if="isOtherRouter"></router-view>
    <div v-else>
      <component :is="currentComponent" @changeComponent="change" :slideVal="slideVal"></component>
    </div>
  </div>
</template>

<script>
import posterList from './components/poster-list/index.vue';
import classifyManager from './components/classify-manager/index.vue';

export default {
  name: 'PosterManage',
  beforeRouteEnter(to, from, next) {
    // 因为当钩子执行前，组件实例还没被创建
    // vm 就是当前组件的实例相当于上面的 this
    next(vm => {
      vm.isOtherRouter = to.name != 'posterManage';
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.isOtherRouter = to.name != 'posterManage';
    // 创建海报页面跳转过来的，因为属于同一个Vue实例，跳转过来不会触发created函数
    if (to.query.typeId) {
      this.slideVal = parseInt(to.query.typeId);
    }
    next();
  },
  components: { posterList, classifyManager },
  data() {
    return {
      isOtherRouter: false, // 是否跳转到子级菜单
      currentComponent: 'posterList',
      slideVal: 1, // 海报模板页选择的分类
    };
  },
  created() {
    // 其他页面跳转过来的
    if (this.$route.query.typeId) {
      // 指定海报分类 1：热门海报 2：企业海报 3：我的海报
      this.slideVal = parseInt(this.$route.query.typeId);
    }
  },
  methods: {
    /**
     * 切换页面组件
     * @author lymn
     * @date 2020-07-15
     * @param {Object} component 组件
     * @param {slideVal} slideVal 选择的分类
     */
    change(component, slideVal) {
      this.currentComponent = component;
      if (slideVal) this.slideVal = slideVal;
    },
  },
};
</script>

<style lang="scss" scoped></style>

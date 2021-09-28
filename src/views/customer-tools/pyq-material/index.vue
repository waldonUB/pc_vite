<!--
 * @Description  : 朋友圈素材
 * @Author       : turbo
 * @Date         : 2021-03-30 14:09:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 18:21:57
-->

<template>
  <div class="pyqMaterial">
    <keep-alive include="pyqMaterialList">
      <component
        :is="currentComponent"
        :isPartUpdate="isPartUpdate"
        @changeComponent="change"
        :typeGroup="defaultParams.typeGroup"
        :editId="editId"
      ></component>
    </keep-alive>
  </div>
</template>

<script>
import pyqMaterialList from './components/pyq-material-list/index.vue';
import addPyqMaterial from './components/add-pyq-material/index.vue';

export default {
  name: 'PyqMaterial',
  components: {
    pyqMaterialList,
    addPyqMaterial,
  },
  data() {
    return {
      currentComponent: 'pyqMaterialList',
      editId: 0, // 素材id 用于跳转任务详情
      isAdd: false,
      isPartUpdate: false,
      defaultParams: {
        component: '',
        editId: 0,
        isAdd: false,
        isUpdate: 'unNeed',
        typeGroup: 14,
      },
    };
  },
  methods: {
    /**
     * 切换组件
     * @author guoyijie
     * @date 2020-08-24
     * @param {String} component 组件名称
     * @param {Number} id素材id 可选
     */
    change(param) {
      console.log(param);
      this.defaultParams = Object.assign(this.defaultParams, param);
      // if (this.defaultParams.isUpdate == 'all') {
      //     // 刷新客户列表页
      //     // tanShuApp.changeRouter(this.$route.name);
      // } else if (this.defaultParams.isUpdate == 'part') {
      //     this.isPartUpdate = true; // 局部刷新
      // }
      this.currentComponent = this.defaultParams.component;
      this.editId = this.defaultParams.editId;
      this.isAdd = this.defaultParams.isAdd;
    },
  },
};
</script>

<style lang="scss" scoped>
.pyqMaterial {
  height: 100%;
}
</style>

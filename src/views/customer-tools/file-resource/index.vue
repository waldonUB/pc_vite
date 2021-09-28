<!--
 * @Description  : 产品文件
 * @Author       : turbo
 * @Date         : 2021-03-30 13:59:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-15 15:07:56
-->

<template>
  <div class="wxPersonMaterial">
    <component ref="corpMaterialTemp" :is="currentTemp"> </component>
  </div>
</template>

<script>
import allFileList from './components/all-file-list/index.vue';

export default {
  name: 'FileResource',
  components: {
    allFileList,
  },
  data() {
    return {
      currentTemp: 'allFileList',
      dialogVisible: false, // 是否显示上传文件弹窗
    };
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        this.screenWidth += 1;
      })();
    };
  },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.wxPersonMaterial {
  .inputGroupBox {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .inputTip {
      margin-bottom: 10px;
    }
  }
}
.fileResourceWrap {
  .fa-form-item {
    margin-bottom: 12px;
  }
}
</style>

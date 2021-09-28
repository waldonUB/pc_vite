<!--
 * @Author       : ADI
 * @Date         : 2021-06-11 15:26:15
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-15 15:22:16
-->

<template>
  <div class="wxCorpMaterial">
    <component ref="corpMaterialTemp" :is="currentTemp"> </component>
  </div>
</template>

<script>
import { GROUPTYPE, CategoryDef } from '@/views/customer-tools/file-resource/config';
import allFileList from './components/all-file-list/index.vue';

export default {
  name: 'WxCorpMaterial',
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
.wxCorpMaterial {
  .inputGroupBox {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .inputTip {
      margin-bottom: 10px;
    }
  }
  .uploadBtn {
    display: inline-block;
  }
}
.fileResourceWrap {
  .fa-form-item {
    margin-bottom: 12px;
  }
}
</style>

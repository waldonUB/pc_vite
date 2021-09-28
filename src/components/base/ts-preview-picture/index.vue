<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 17:24:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 17:22:23
-->
<template>
  <el-dialog
    :visible.sync="previewVisible"
    class="tanshu-previewPicture"
    :append-to-body="true"
    :before-close="handelClose"
  >
    <img width="100%" :src="previewImgUrl" alt="" />
  </el-dialog>
</template>

<script>
import { Dialog } from 'element-ui';

export default {
  name: 'ts-preview-picture',
  inheritAttrs: true,
  components: {
    [Dialog.name]: Dialog,
  },
  props: {
    previewVisible: {
      type: Boolean,
      default: false,
    },
    previewImgUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    handelClose() {
      this.$emit('update:previewVisible', false);
      this.$emit('handle-close');
    },
  },
};
</script>

<style lang="scss" scoped>
.tanshu-previewPicture {
  img {
    width: auto;
    max-height: 700px;
  }
}
</style>
<style lang="scss">
.tanshu-previewPicture {
  .el-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    margin: 0 !important;
    transform: translate(-50%, -50%);
  }
}
</style>

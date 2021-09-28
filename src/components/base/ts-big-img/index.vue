<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 10:21:54
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-03 09:59:25
-->
<template>
  <transition name="el-fade-in el-zoom-in-top">
    <div v-if="isOpen" class="ts-bigImg" :style="imgAddress">
      <div class="closeBtn" @click="updateStatus(false)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ts-big-img',
  props: {
    imgSrc: {
      type: String,
      default: '',
    },
    imgKey: {
      type: [Number, String],
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    imgAddress() {
      return `background-image: url(${this.imgSrc})`;
    },
  },
  methods: {
    updateStatus(status) {
      this.$emit('update:isOpen', status);
    },
  },
  watch: {
    isOpen(value) {
      this.$emit('updateClose', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-bigImg {
  position: relative;
  height: 331px;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  border-radius: 4px;
  opacity: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  .closeBtn {
    position: absolute;
    right: 10px;
    bottom: 5px;
    width: 62px;
    height: 27px;
    cursor: pointer;
    background: url('~@/assets/image/indexManage/indexB/articleTipBtn.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>

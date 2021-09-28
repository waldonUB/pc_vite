<template>
  <div :class="['ts-moreBtn', className, { checkMoreBtn: isCheck }]">
    <div class="whiteDot" v-for="i of 3" :key="i"></div>
  </div>
</template>

<script>
export default {
  name: 'ts-morebtn',
  props: {
    className: {
      type: String,
      default: '',
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
/* morebtn组件样式 start */
.ts-moreBtn {
  display: flex;
  display: flex;
  width: 24px;
  height: 24px;
  padding: 0 4px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 2px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  .whiteDot {
    width: 4px;
    height: 4px;
    background: $color-b2;
    border-radius: 50%;
  }
  &:hover {
    .whiteDot {
      background: $primary-color;
    }
  }
  &.checkMoreBtn {
    .whiteDot {
      background: $primary-color;
    }
  }
}

/* morebtn组件样式 end */
</style>

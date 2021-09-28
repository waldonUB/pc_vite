<template>
  <div class="textImg" :class="imgClass">
    <img v-if="imgUrl" class="imgContent" :src="imgUrl" />
    <div class="imgName" :class="sexColor" v-else>
      {{ getImgName(imgText) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-text-img',
  props: {
    imgClass: {
      type: String,
      default: '',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    sexColor: {
      type: String,
      default: '',
    },
    imgText: {
      type: String,
      default: '',
    },
  },
  methods: {
    /**
     * 取第一个字显示
     * @author waldon
     * @date 2020/4/30
     * @param {*} name - 显示的字
     * @returns {*}
     */
    getImgName(name) {
      if (name) {
        return name.slice(0, 1);
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.textImg {
  flex: 0 0 auto;
  position: relative;
  margin-right: 7px;
  border-radius: 2px;
  .imgContent {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 2px;
  }
  .imgName {
    display: flex;
    width: 32px;
    height: 32px;
    font-size: 18px;
    font-weight: bold;
    line-height: 18px;
    color: #b8b9b9;
    background-color: #f7f7f8;
    border-radius: 2px;
    align-items: center;
    justify-content: center;
    &.woman {
      color: #f88304;
      background-color: #fef2e5;
    }
    &.oemColor {
      color: $primary-color;
      background-color: #ebf7f0;
    }
  }
}
.textImg .imgName.man,
.textImg .imgName.notOemColor {
  color: $primary-color;
  background-color: #e9f1fd;
}
</style>

<!--
 * @Description  : svg图标
 * @Author       : turbo
 * @Date         : 2021-03-22 10:00:31
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 14:13:02
-->

<template>
  <svg
    class="ts-svg-icon"
    aria-hidden="true"
    :style="{
      width: width + 'px',
      height: height + 'px',
      color: isHover ? hoverColor || color : color,
      fontSize: size + 'px',
    }"
    v-on="$listeners"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <use :xlink:href="`#${nameCal}`" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      default: '',
      require: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    color: {
      type: String,
    },
    size: {
      type: Number,
    },
    hoverColor: {
      type: String,
    },
  },
  computed: {
    nameCal() {
      if (this.name[0] === '#') {
        console.warn('global-ts-svg-icon wran: 统一去除"#"', this.name);
        return this.name.slice(1);
      } else {
        return this.name;
      }
    },
  },
  data() {
    return {
      isHover: false,
    };
  },
};
</script>

<style lang="scss">
.ts-svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  font-size: 14px;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>

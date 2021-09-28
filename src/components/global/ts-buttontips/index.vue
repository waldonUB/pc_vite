<template>
  <div class="tanshubuttonTips">
    <div class="buttonArray">
      <slot name="button"></slot>
    </div>
    <div class="tips">
      <slot name="buttonTips"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ts-buttontips',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
/* 按钮下面有提示文字的组件 */
.tanshubuttonTips {
  .buttonArray {
    text-align: center;
  }
  .tips {
    margin-top: 10px;
    // font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: 400;
    color: $color-53;
    text-align: center;
  }
}
</style>

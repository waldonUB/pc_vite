<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 14:05:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 14:07:11
-->
<template>
  <fa-input-search
    v-model="realValue"
    :placeholder="placeholder"
    class="faUiSearchInput"
    @keyup.enter.native="search"
    @search="search"
  >
    <fa-button slot="enterButton" class="headerLine__search-button" size="large">
      <global-ts-svg-icon class="icon headerLine__search-icon icon_16" name="icon-sousuo1616" />
    </fa-button>
  </fa-input-search>
</template>

<script>
export default {
  name: 'ts-fai-input-search',
  components: {},
  props: {
    value: {
      // 输入文本
      type: String,
      defualt: '',
    },
    placeholder: {
      // 提示
      type: String,
      default: '',
    },
  },
  data() {
    return {
      realValue: '',
    };
  },
  computed: {},
  watch: {
    value(newVal) {
      this.realValue = newVal;
    },
    realValue(newVal) {
      this.$emit('input', newVal);
    },
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      this.$emit('search', this.realValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-fai-input-search {
}
</style>

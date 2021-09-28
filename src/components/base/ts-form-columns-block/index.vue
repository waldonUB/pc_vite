<!--
 * @Author       : ADI
 * @Date         : 2021-07-15 15:25:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 15:26:20
-->
<template>
  <div class="formColumnsBlock">
    <div class="title" v-if="title">{{ title }}</div>
    <div class="twoColumns flex">
      <slot name="twoColumns"></slot>
    </div>
    <div class="oneColumns">
      <slot name="oneColumns"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ts-form-columns-block',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
  },
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

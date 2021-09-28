<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:43:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 14:18:29
-->
<template>
  <div class="businessModel">
    <div class="businessModel-item">
      <div class="name">允许不同成员创建重复客户：</div>
      <div class="content">
        <fa-radio-group @change="onChange" v-model="isRepeat">
          <fa-radio :value="true">允许</fa-radio>
          <fa-radio :value="false">不允许</fa-radio>
        </fa-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'business-model',
  components: {},
  props: {},
  data() {
    return {
      isRepeat: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onChange(e) {
      console.log('radio checked', e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.businessModel {
  padding-top: 12px;
  .businessModel-item {
    display: flex;
    align-items: center;
    .name {
      margin-right: 20px;
      font-size: 14px;
      line-height: 16px;
      color: $color-53;
    }
  }
}
</style>

<!--
 * @Author       : ADI
 * @Date         : 2021-07-21 15:45:10
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 17:52:50
-->
<template>
  <fa-select
    :size="sizeCal"
    class="ts-fai-select"
    :class="[selectClass]"
    v-bind="$attrs"
    v-on="$listeners"
    dropdownClassName="ts-fai-select__dropdown"
    :getPopupContainer="getPopupContainerCal"
    @change="handleChange"
  >
    <fa-select-option v-for="item in list" :key="item[selectkey.value]" :value="item[selectkey.value]">
      {{ item[selectkey.label] }}
    </fa-select-option>
    <!-- <template #suffixIcon>
      <global-ts-svg-icon class="suffixIcon" name="icon-xialakuangjiantou"></global-ts-svg-icon>
    </template> -->
  </fa-select>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  name: 'ts-fai-select',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    selectkey: {
      type: Object,
      default: () => ({ label: 'name', value: 'id' }),
    },
    type: {
      type: String,
    },
    selectClass: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'default',
    },
    getPopupContainer: {
      type: [Function, Boolean],
      default: () => document.body,
    },
  },
  data() {
    return {};
  },
  computed: {
    sizeCal() {
      return this.type || this.size;
    },
    getPopupContainerCal() {
      if (typeof this.getPopupContainer === 'boolean' && this.getPopupContainer === true) {
        return trigger => trigger.parentNode;
      }
      return this.getPopupContainer;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-fai-select {
  width: 340px;

  &.width_220 {
    width: 220px;
  }
}
</style>

<style lang="scss">
.ts-fai-select {
  .fa-select-lg {
    font-size: 14px;
  }
}

/* .ts-fai-select__dropdown {
  &.fa-select-dropdown {
    z-index: $zindex-loading + 10;
  }
} */
</style>

<!--
 * @Description  : 客户自定义字段编辑
 * @Author       : turbo
 * @Date         : 2021-07-05 15:43:59
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-08 14:30:47
-->

<template>
  <div class="edit-fields">
    <global-ts-input
      v-if="itemTemp.fieldType === 1"
      size="large"
      :placeholder="'请输入' + itemTemp.name"
      :max-length="1000"
      v-model="itemTemp.value"
    ></global-ts-input>
    <fa-textarea
      v-if="itemTemp.fieldType === 2"
      :placeholder="'请输入' + itemTemp.name"
      :max-length="1000"
      :rows="4"
      v-model="itemTemp.value"
    ></fa-textarea>
    <el-date-picker
      v-if="itemTemp.fieldType === 3"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间"
      v-model="itemTemp.value"
    ></el-date-picker>
    <global-ts-input
      v-if="itemTemp.fieldType === 4"
      size="large"
      limit-type="decimal"
      :placeholder="'请输入' + itemTemp.name"
      :max-length="50"
      v-model="itemTemp.value"
    ></global-ts-input>
    <global-ts-select
      v-if="itemTemp.fieldType === 5"
      type="large"
      placeholder="请选择"
      :show-placeholder="itemTemp.value === ''"
      :list="itemTemp.optionList"
      :selectkey="{ label: 'name', value: 'id' }"
      v-model="itemTemp.value"
    ></global-ts-select>
    <fa-select
      v-if="itemTemp.fieldType === 6"
      mode="multiple"
      size="large"
      placeholder="请选择"
      v-model="itemTemp.value"
    >
      <fa-select-option v-for="optionItem in item.optionList" :key="optionItem.id">
        {{ optionItem.name }}
      </fa-select-option>
    </fa-select>
  </div>
</template>

<script>
export default {
  name: 'EditFields',
  props: {
    fieldsListName: {
      type: String,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      itemTemp: {},
    };
  },
  created() {
    this.itemTemp = { ...this.item };
  },
  watch: {
    'itemTemp.value'(newValue, oldValue) {
      if (oldValue === undefined) return; // 初始化时不用回传数据
      this.$emit('change', this.fieldsListName, this.itemTemp);
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-fields {
  .el-date-editor {
    width: 350px;
  }
}
</style>

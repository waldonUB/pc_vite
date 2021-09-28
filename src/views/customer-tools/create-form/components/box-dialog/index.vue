<!--
 * @Author       : ADI
 * @Date         : 2021-07-01 09:55:31
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-01 16:44:00
-->
<template>
  <global-ts-dialog
    class="setOptionsBox"
    width="620px"
    :dialog-visible="isDialog"
    :dialog-title="optionTitle"
    :closable="false"
    @sure="save"
    @cancel="close"
  >
    <slot></slot>
  </global-ts-dialog>
</template>

<script>
export default {
  name: 'box-dialog',
  components: {},
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
    selectDragData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    currentItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    optionTitle() {
      return this.currentItem && this.currentItem.formItemType === 6 ? '多选' : '单选';
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$emit('update:isDialog', false);
    },
    save() {
      // 判断一下选项的值是否有相同的，有相同的选项的话无法保存
      const current = Array.from(new Set([...this.selectDragData]));
      console.log('this.selectDragData', this.selectDragData);
      const flag = this.selectDragData.every(element => {
        return element.replace(/\s/g, ''); // 去除所有空格
      });
      if (!flag) {
        this.$utils.postMessage({
          type: 'error',
          message: '保存失败，选项不能为空',
        });
        return;
      }

      if (current.length !== this.selectDragData.length) {
        this.$utils.postMessage({
          type: 'error',
          message: '保存失败，存在相同的选项',
        });
        return;
      }
      this.$emit('saveOptions');
      this.close();
    },
  },
};
</script>

<style lang="scss">
.setOptionsBox {
  .numberWrap {
    height: 14px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 14px;
    color: $color-53;
    span {
      color: $color-b2;
    }
  }
  .createForm-sortItem {
    padding: 0;
    padding-right: 12px;
    margin-bottom: 20px;
    background: #ffffff;
    &:hover {
      background: #f5f7fa;
    }
    .menu-icon {
      &.dragOption {
        margin-right: 0;
        margin-left: 12px;
      }
    }
    .deleteWrap {
      .createForm-deleteIcom {
        margin-top: 3px;
      }
      .icon {
        margin-right: 0;
      }
    }
  }
  .bottomBar {
    padding-top: 16px;
    text-align: center;
    border-top: 1px solid $border-disabled-color;
    .sure {
      margin-right: 10px;
    }
  }
  .addBtn {
    height: 40px;
    line-height: 40px;
    color: $color-89;
    text-align: center;
    cursor: pointer;
    border: 1px dashed $border-color;
    border-radius: 4px;
    box-sizing: border-box;
    .iconText {
      color: $color-53;
    }
    &.isGrey {
      color: $border-disabled-color;
      pointer-events: none;
      border-color: $border-disabled-color;
      .iconText {
        color: $border-disabled-color;
      }
    }
    &:hover {
      color: $primary-color;
      border: 1px dashed $primary-color;
      .iconText {
        color: $primary-color;
      }
    }
  }
}
</style>

<style lang="scss">
.createForm {
  .firstStep {
    .setOptionsBox {
      .el-dialog {
        &.tanshu-dialog {
          .el-dialog__body {
            padding: 0;
            padding-bottom: 16px;
            .optionsWrap {
              max-height: 310px;
              padding: 20px 30px 30px;
              overflow-y: scroll;
            }
          }
        }
      }
    }
  }
}
</style>

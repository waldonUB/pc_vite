<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 15:46:49
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-12 14:14:08
-->
<template>
  <global-ts-dialog
    class="customFiledDialog wxCorpDialog"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    @sure="sure"
    @reset="reset"
    sure-btn-name="保存"
    :with-cancel-btn="false"
    :with-reset-btn="true"
  >
    <div class="customFiledDialogContent">
      <div class="infoPart">
        <div class="infoTitle"><span>显示字段</span><span class="subDes">（拖拽可排序）</span></div>
        <sortable-list axis="xy" v-model="selectedList" :lockToContainerEdges="true" lockOffset="0px">
          <sortable-item
            withIcon="delete"
            size="medium"
            class="groupLabel"
            type="selected"
            @operateTag="deleteTag(item)"
            v-for="(item, index) in selectedList"
            :index="index"
            :key="index"
            :item="item"
          >
            {{ item.name }}
          </sortable-item>
        </sortable-list>
      </div>
      <div class="infoPart subPart">
        <div class="infoTitle"><span>隐藏字段</span><span class="subDes">（点击添加）</span></div>
        <div class="infoBox">
          <ts-wxtag
            @click.native="addToShow(item)"
            withIcon="plus"
            v-for="item of allFiledList"
            :key="item[fieldName]"
            size="medium"
            class="groupLabel"
          >
            {{ item.name }}
          </ts-wxtag>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import SortableList from './components/sortable-list/index.vue';
import SortableItem from './components/sortable-item/index.vue';
import { mapState, mapGetters } from 'vuex';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';

export default {
  name: 'ts-custom-file',
  components: { SortableList, SortableItem, tsWxtag },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    initSelectedList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    initAllFiledList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dialogTitle: {
      type: String,
      default: '自定义显示字段',
    },
    fieldName: {
      type: String,
      default: 'field',
    },
  },
  data() {
    return {
      allFiledList: [],
      selectedList: [],
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
    }),
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    specialVer() {
      return this.isOem && this.userInfo.msg.realVer === 2;
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.reset();
      }
    },
  },
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
      this.$emit('cancel');
    },
    /**
     * 确定的回调，可以在父组件执行保存操作
     * 把对话框关闭放到父组件来做
     * @author waldon
     * @date 2020-06-17
     */
    sure() {
      this.selectedList.forEach((item, index) => {
        item.sort = index + 1;
      });
      const params = {
        // 后续这里如果后端接口需要传不同的字段可以加属性
        fieldJson: JSON.stringify(this.selectedList),
      };
      this.$emit('changeSortSuccess', params);
    },
    /**
     * 重置条件
     * @author waldon
     * @date 2020-06-17
     */
    reset() {
      this.selectedList = [...this.initSelectedList];
      this.allFiledList = this.initAllFiledList.filter(item => {
        if (!this.specialVer && item.field === 'relState') {
          // 分销专用版才显示关联情况
          return false;
        }
        return this.selectedList.findIndex(subItem => subItem.field === item.field) === -1;
      });
    },
    /**
     * 添加显示字段
     * @author waldon
     * @date 2020-06-17
     * @param {*} tagInfo
     */
    addToShow(tagInfo) {
      const index = this.selectedList.findIndex(item => tagInfo[this.fieldName] === item[this.fieldName]);
      if (!this.selectedList.length || index === -1) {
        this.selectedList.push({ ...tagInfo });
      }
      this.allFiledList = this.allFiledList.filter(item => item[this.fieldName] !== tagInfo[this.fieldName]);
    },
    /**
     * 将字段放到隐藏列表
     * 排序按照默认的sort来进行
     * @author waldon
     * @date 2020-06-17
     * @param {*} tagInfo
     */
    deleteTag(tagInfo) {
      this.selectedList = this.selectedList.filter(item => item[this.fieldName] !== tagInfo[this.fieldName]);
      this.allFiledList.push(tagInfo);
      this.allFiledList.sort((prev, curr) => {
        return prev.defaultSort - curr.defaultSort;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.customFiledDialog {
  .customFiledDialogContent {
    .infoPart {
      .infoBox {
        display: flex;
        flex-flow: row wrap;
        margin-top: 20px;
      }
      .infoTitle {
        font-size: 14px;
        line-height: 14px;
        color: rgba(0, 0, 0, 1);
        .subDes {
          font-size: 12px;
          color: $color-53;
        }
      }
      &.subPart {
        margin-top: 30px;
      }
    }
  }
}
</style>

<style lang="scss">
.customFiledDialog {
  &.wxWorkDialog {
    .el-dialog__body {
      height: 500px;
      padding: 20px;
    }
  }
}
</style>

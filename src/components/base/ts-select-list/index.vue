<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 17:20:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-27 09:53:29
-->
<template>
  <div class="tanshu-selectList ">
    <div class="tagBox " :class="bingClassStyle" :style="{ width: width + 'px' }" @click="showlistDialog">
      <span class="tagListStr " :class="tagTipStyle">{{ selectListStr || defaultTip }}</span>
      <i class="el-icon-arrow-down"></i>
    </div>
    <slot name="errorTip"></slot>
    <ts-select-list-dialog
      v-if="![4].includes(selectType)"
      ref="orgDialog"
      :needStaff="needStaff"
      :isNecessary="isNecessary"
      :dialogTitle="dialogTitle"
      :permissions="permissions"
      :dialogVisible.sync="selectDialogVisible"
      :selectType="selectType"
      :isWorker="isWorker"
      :needUpdate.sync="needUpdate"
      :selectedOrgData="selectParam"
      :check-strictly="checkStrictly"
      @getSelectedData="getSelectedData"
    >
    </ts-select-list-dialog>
    <ts-org-select-dialog
      v-else
      dialogTitle="选择员工"
      selectType="selectList"
      :selectedOrgData="selectParam"
      :defaultExpandKeys.sync="wxWorkdefaultExpandKeys"
      @getSelectedData="getSelectedData"
      :dialogVisible.sync="selectDialogVisible"
    >
    </ts-org-select-dialog>
  </div>
</template>

<script>
import tsOrgSelectDialog from '@/components/base/ts-org-select-dialog/index.vue';
import tsSelectListDialog from '@/components/base/ts-select-list-dialog/index.vue';

export default {
  name: 'ts-select-list',
  components: { tsOrgSelectDialog, tsSelectListDialog },
  props: {
    selectType: {
      // 组件的类型 1-员工组件 2-部门组件 3-销售员选择组件（单选）4 - 企微员工组件
      type: Number,
      default: 1, // 1-员工 2-部门
    },
    bindClass: {
      // 自定义样式
      type: String,
      default: '',
    },
    depIdList: {
      // 传入的部门id
      type: String,
      default: '',
    },
    sids: {
      // 传入的员工的sid
      type: String,
      default: '',
    },
    defaultTip: {
      // 提示
      type: String,
      default: '全部成员',
    },
    selectedOrgData: {
      // 被选中的员工|部门的数据
      type: Object,
      default: () => {
        return {
          dept: [],
          staff: [],
        };
      },
    },
    disabled: {
      // 是否可选
      type: String,
      default: '',
    },
    isWorker: {
      // 是否只包含有职位的员工
      type: Boolean,
      default: false,
    },
    needUpdate: {
      // 是否需要更新
      type: Boolean,
      default: false,
    },
    isNecessary: {
      //是否必选
      type: Boolean,
      default: false,
    },
    needStaff: {
      //是否有员工
      type: Boolean,
      default: true,
    },
    isStrParam: {
      // 是否需要将sids/depIdList 转成 "xxx, xxx, xxx"的形式
      type: Boolean,
      default: false,
    },
    permissions: {
      type: String,
      default: '',
    },
    checkStrictly: {
      // 是否开启tree结构 父子关联  false=开始 true=关闭
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 260,
    },
  },
  data() {
    return {
      selectListStr: '',
      selectDialogVisible: false,
      selectParam: {
        // 被选中的员工|部门的数据 这里是针对员工组件做一个缓存
        dept: [],
        staff: [],
      },
      wxWorkdefaultExpandKeys: [], // 用于企微
    };
  },
  computed: {
    bingClassStyle() {
      let style = this.bindClass;
      if (this.disabled === 'disabled') {
        style += ' isDisabled';
      }
      return style;
    },
    tagTipStyle() {
      return !this.selectListStr ? 'tagTipStyle' : '';
    },
    dialogTitle() {
      let title = '';
      switch (this.selectType) {
        case 1:
          title = '选择成员';
          break;
        case 2:
          title = '设置所在部门';
          break;
      }
      return title;
    },
  },
  methods: {
    /**
     * 清空选择的数据
     * @author waldon
     * @date 2020/9/15
     */
    clearSelected() {
      this.$refs.orgDialog.reset(); // 清空组织树
      this.$refs.orgDialog.sure();
    },
    showlistDialog() {
      if (this.disabled != 'disabled') {
        this.selectDialogVisible = true;
        this.$emit('click');
      }
    },
    getSelectedData(param) {
      console.log('nnnnn');
      let depIdList = [];
      let sids = [];
      switch (this.selectType) {
        case 1: // 员工
          this.selectListStr = param.dept
            .map(item => item.name)
            .concat(param.staff.map(item => item.name))
            .join(', ');
          depIdList = param.dept.map(item => item.id);
          sids = param.staff.map(item => item.sid);
          break;
        case 3: // 员工
          this.selectListStr = param.staff.map(item => item.name).join(' ');
          if (param.staff[0]) {
            sids = sids.push(param.staff[0].sid);
          }
          break;
        case 2: // 部门
          this.selectListStr = param.dept.map(item => item.name).join(', ');
          depIdList = param.dept.map(item => item.id);
          break;
        case 4: // 企微
          this.selectListStr = param.dept
            .map(item => item.name)
            .concat(param.staff.map(item => item.name))
            .join(', ');
          depIdList = param.dept.map(item => item.id);
          sids = param.staff.map(item => item.userId);
          break;
      }
      this.selectParam = Object.assign({}, param);
      this.$emit('update:selectedOrgData', param);
      if (!this.isStrParam) {
        this.$emit('update:depIdList', JSON.stringify(depIdList));
        this.$emit('update:sids', JSON.stringify(sids));
      } else {
        this.$emit('update:depIdList', depIdList.join());
        this.$emit('update:sids', sids.join());
      }
      this.$emit('select', sids);
      this.$emit('change', sids);
    },
    initData() {
      console.log('initinit');
      console.log(this.selectedOrgData);
      this.selectParam = Object.assign(
        {
          dept: [],
          staff: [],
        },
        this.selectedOrgData,
      );
      const departmetName = (this.selectedOrgData.dept && this.selectedOrgData.dept.map(item => item.name)) || [];
      const staffName = (this.selectedOrgData.staff && this.selectedOrgData.staff.map(item => item.name)) || [];
      this.selectListStr = departmetName.concat(staffName).join(', ');
    },
  },
  created() {
    this.initData();
  },
  mounted() {},
  watch: {
    needUpdate(newVal, oldVal) {
      if (newVal) {
        this.initData();
        this.$emit('update:needUpdate', false);
      }
    },
    selectedOrgData: {
      handler(newName) {
        this.selectParam = Object.assign(
          {
            dept: [],
            staff: [],
          },
          newName,
        );
        const departmetName = (newName.dept && newName.dept.map(item => item.name)) || [];
        const staffName = (newName.staff && newName.staff.map(item => item.name)) || [];
        console.log('xxx');
        this.selectListStr = departmetName.concat(staffName).join(', ');
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-selectList 组件样式 start */
.tanshu-selectList {
  position: relative;
  .tagBox {
    position: relative;
    z-index: 2;
    width: 260px;
    height: 34px;
    padding: 0 10px;
    padding-right: 25px;
    overflow: hidden;
    font-size: 14px;
    line-height: 34px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid $border-color;
    border-radius: 4px;
    box-sizing: border-box;
    &.isDisabled {
      cursor: not-allowed !important;
      background: #f6f6f6 !important;
      border: 1px solid #eeeeee !important;
    }
    .tagListStr {
      &.tagTipStyle {
        color: #c0c4cc;
      }
    }
    &.errorTip {
      border: 1px solid $error-color;
    }
  }
  &.floatLeft {
    .tagBox {
      float: left;
    }
  }
}

/* tanshu-selectList 组件样式 end */
</style>

<style lang="scss">
.tanshu-selectList {
  .el-icon-arrow-down {
    position: absolute;
    top: 50%;
    right: 10px;
    color: $color-b2;
    transform: translateY(-50%);
  }
}
</style>

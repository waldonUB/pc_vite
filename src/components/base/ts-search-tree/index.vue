<template>
  <div class="ts-search-tree" :bindClass="bindClass">
    <el-popover
      :disabled="disabled"
      v-model="visible"
      placement="bottom-start"
      :visible-arrow="false"
      :popper-class="popperClass"
      class="ts-search-select"
      @show="changeArrow('up')"
      @hide="changeArrow('down')"
      trigger="click"
    >
      <div>
        <el-input class="tshu-search" autocomplete="off" v-model="keyWord" placeholder="请输入搜索内容" clearable>
        </el-input>
        <div class="searchTreeBox">
          <ts-company-all-list
            bindClass="selectCompany"
            :permissions="permissions"
            ref="orgTree"
            :showCheckBox="false"
            :needStaff="true"
            :isWorker="isWorker"
            :selectKeyList="selectKeyList"
            :isNeedPermission="isNeedPermission"
            :delKeyList="delKeyList"
            :addKeyList="addKeyList"
            :defaultExpandKeys="expandKeyCal"
            :updateTree.sync="updateTree"
            :onlyStaff="selectType === 3"
            :expandOnClickNode="true"
            @checkNode="selectNode"
          >
          </ts-company-all-list>
        </div>
      </div>
      <el-input
        class="tshu-search"
        slot="reference"
        :disabled="disabled"
        :readonly="true"
        clearable
        placeholder="请选择成员"
        v-model="selectValueInput"
        @click="clickHandle"
        :suffix-icon="'el-icon-arrow-' + this.arrow"
      >
        <i
          slot="suffix"
          v-if="selectValue"
          class="el-input__icon el-icon-circle-close clearIcon"
          @click.stop="clearVal"
        ></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import { Popover, Input } from 'element-ui';
import tsCompanyAllList from '@/components/base/ts-company-all-list/index.vue';
import { searchDepartmentList, getTsStaffList } from '@/api/modules/component/search-tree';

export default {
  name: 'ts-search-tree',
  props: {
    defaultExpandKeys: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectedOrgData: {
      // 被选中的员工/部门的数据
      type: Object,
      default: () => {
        return {
          dept: [],
          staff: [],
        };
      },
    },
    dialogTitle: {
      type: String,
      default: '选择员工',
    },
    selectType: {
      type: Number,
      default: 1, // 1-选择员工 2-选择部门 3-单选员工
    },
    isWorker: {
      type: Boolean,
      default: false,
    },
    needUpdate: {
      type: Boolean,
      default: false,
    },
    isNeedPermission: {
      type: Boolean,
      default: true,
    },
    needStaff: {
      type: Boolean,
      default: true,
    },
    isNecessary: {
      type: Boolean,
      default: false,
    },
    selectValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: String,
      default: '',
    },
    popoverStyle: {
      type: String,
      default: '',
    },
    bindClass: {
      type: String,
      default: '',
    },
  },
  components: {
    [Input.name]: Input,
    [Popover.name]: Popover,
    tsCompanyAllList,
  },
  data() {
    return {
      orgList: [],
      selectedDeptList: [], // 被选中的部门list
      selectedUserList: [], // 被选中的员工list
      rootKey: '',
      searchTimer: -1,
      selectKeyList: [], // 被选中过的节点idList
      delKeyList: [], // 删除的节点idList
      addKeyList: [], // 添加的节点idList
      updateTree: false,
      isGetAll: true,
      keyWord: '',
      arrow: 'down',
      visible: false,
      selectValueInput: '',
    };
  },
  watch: {
    keyWord(newVal) {
      this.$refs.orgTree.$refs.companyTree.filter(newVal);
    },
    selectValue: {
      handler(val) {
        this.selectValueInput = val;
      },
      immediate: true,
    },
    selectValueInput(val) {
      this.$emit('update:selectValue', val);
    },
  },
  computed: {
    selectkey() {
      return this.selectType == 2 ? { label: 'name', value: 'id' } : { label: 'name', value: 'sid' };
    },
    expandKeyCal() {
      if (this.defaultExpandKeys && this.defaultExpandKeys.length) {
        return this.defaultExpandKeys;
      }
      return [this.rootKey];
    },
    popperClass() {
      return 'ts-search-tree' + ' ' + this.bindClass;
    },
  },
  methods: {
    changeArrow(direction) {
      this.arrow = direction;
    },
    clearVal() {
      this.$emit('update:selectValue', '');
      this.$emit('select', { sid: '', name: '' });
    },
    clickHandle() {
      this.$emit('click');
    },
    initData() {
      // this.selectValue='';
      this.keyWord = '';
    },
    selectNode(value) {
      // this.selectValue = value.name;
      this.visible = false;
      this.$emit('update:selectValue', value.name);
      this.$emit('select', value);
    },
    /**
     * @description 获取搜索结果
     * @author enson
     * @date 2020-08-28
     * @param {String} queryString
     * @param {function} callback
     */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.searchData(query).then(list => {
            this.searchList = list;
          });
        }, 200);
      } else {
        this.searchList = [];
      }
    },
    selectOption(selectItem) {
      const findIndex = this.selectValueList.findIndex(item => {
        return selectItem[this.selectkey.value] == item;
      });
      if (findIndex >= 0) {
        this.selectValueList.splice(findIndex, 1);
        this.deleteTag('staff', selectItem);
      } else {
        this.selectValueList.push(selectItem[this.selectkey.value]);
        this.handleSelect(selectItem);
      }
      this.searchList &&
        this.searchList.forEach(data => {
          data.isSelect = this.selectValueList.includes(data[this.selectkey.value]);
        });
    },
    removeSelect(value) {
      this.selectValueList = this.selectValueList.filter(item => item !== value);
      this.searchList &&
        this.searchList.forEach(data => {
          data.isSelect = this.selectValueList.includes(data[this.selectkey.value]);
        });
    },
    async searchData(queryString) {
      let ajaxFun = searchDepartmentList;
      let params = {};

      if (this.selectType === 1 || this.selectType === 3) {
        ajaxFun = getTsStaffList;
        params = {
          sacct: queryString,
          hasSales: this.isWorker ? 1 : 0,
        };
      } else {
        params = {
          name: queryString,
        };
      }
      const [err, res] = await ajaxFun(Object.assign({}, { isGetAll: true }, params));
      if (err) {
        return Promise.reject(err);
      }
      let list;
      if (this.selectType === 1 || this.selectType === 3) {
        list = res.data || [];
      } else {
        list = res.data?.departmentList || [];
      }
      return Promise.resolve(list);
    },
  },
};
</script>

<style lang="scss">
.el-popper {
  &[x-placement^='bottom'].ts-search-tree {
    margin-top: 4px;
  }
}

.ts-search-tree {
  .searchTreeBox {
    height: 204px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .clearIcon {
    z-index: $zindex-base;
    cursor: pointer;
  }
}
</style>

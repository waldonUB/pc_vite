<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:56:26
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-18 15:43:13
-->
<template>
  <div class="tanshu-selectListDialog">
    <global-ts-dialog
      class="orgSelectDialog wxCorpDialog tanshu-selectListDialog"
      :dialog-title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      dialog-size="large"
      @cancel="cancel"
      @sure="sure"
      @reset="reset"
      reset-btn-name="清空"
      :with-reset-btn="true"
      :with-cancel-btn="false"
    >
      <div class="orgSelectContent selectListContent">
        <div class="orgSelectWrapper">
          <div class="selectTitle">
            <p class="titleText left">组织架构</p>
            <p class="titleText">已选择</p>
          </div>
          <div class="selectContent">
            <div class="leftContent">
              <el-input
                v-model="searchName"
                :placeholder="selectType == 1 ? '请输入姓名/帐号' : '请输入部门名称'"
                clearable
                @clear="clearSearchName"
              ></el-input>
              <div class="searchBox" v-if="searchName">
                <div class="searchItem" v-for="(item, index) in searchList" @click="selectOption(item)" :key="index">
                  <div class="leftPart">
                    <p class="name" v-html="getLightName(item.name)"></p>
                    <p class="position">{{ item.depPath }}</p>
                  </div>
                  <el-checkbox v-model="item.isSelect" @change="selectOption(item)"></el-checkbox>
                </div>
              </div>
              <div class="selectTree">
                <ts-company-all-list
                  v-if="isGetAll"
                  bindClass="selectCompany"
                  ref="orgTree"
                  :showCheckBox="true"
                  :permissions="permissions"
                  :needStaff="needStaff"
                  :isWorker="isWorker"
                  :selectKeyList="selectKeyList"
                  :delKeyList="delKeyList"
                  :addKeyList="addKeyList"
                  :defaultExpandKeys="expandKeyCal"
                  :updateTree.sync="updateTree"
                  :onlyStaff="selectType === 3"
                  :check-strictly="checkStrictly"
                  @checkItem="scrollToBottom"
                  @handleCheckChange="getCheckList"
                  @changeSelectList="changeSelectList"
                  @start="initData"
                >
                </ts-company-all-list>
                <ts-company-list
                  v-else
                  bindClass="selectCompany"
                  ref="orgTree"
                  :showCheckBox="true"
                  :needStaff="needStaff"
                  :isWorker="isWorker"
                  :selectKeyList="selectKeyList"
                  :delKeyList="delKeyList"
                  :addKeyList="addKeyList"
                  :defaultExpandKeys="expandKeyCal"
                  :updateTree.sync="updateTree"
                  :onlyStaff="selectType === 3"
                  :check-strictly="checkStrictly"
                  @checkItem="scrollToBottom"
                  @handleCheckChange="getCheckList"
                  @changeSelectList="changeSelectList"
                  @start="initData"
                >
                </ts-company-list>
              </div>
            </div>
            <div class="selectedBox" ref="selectedBox">
              <div class="selectWrapper">
                <div class="orgTypeName">
                  <span>部门</span>
                  <span v-if="this.selectedDeptList.length === 0" class="nothingText">暂无数据</span>
                </div>
                <div class="selectLabelBox">
                  <ts-wxtag
                    :withCancel="true"
                    @deletetag="deleteTag('dept', item)"
                    v-for="(item, index) of selectedDeptList"
                    :key="index"
                    class="selectLabel"
                  >
                    {{ item.name }}
                  </ts-wxtag>
                </div>
              </div>
              <div class="selectWrapper" v-if="selectType === 1 || selectType === 3">
                <div class="orgTypeName">
                  <span>成员</span><span v-if="this.selectedUserList.length === 0" class="nothingText">暂无数据</span>
                </div>
                <div class="selectLabelBox">
                  <ts-wxtag
                    :withCancel="true"
                    @deletetag="deleteTag('staff', item)"
                    v-for="(item, index) of selectedUserList"
                    :key="index"
                    class="selectLabel"
                  >
                    {{ item.name }}
                  </ts-wxtag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </global-ts-dialog>
  </div>
</template>

<script>
import { getHighlight, postMessage } from '@/utils';
import tsCompanyAllList from '@/components/base/ts-company-all-list/index.vue';
import tsCompanyList from '@/components/base/ts-company-list/index.vue';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';
import { Input } from 'element-ui';
import { getDepartmentListIsGetAll } from '@/api/modules/component/select-list-dialog';
import { searchDepartmentList, getTsStaffList } from '@/api/modules/component/search-tree';

export default {
  name: 'ts-select-list-dialog',
  components: {
    [Input.name]: Input,
    tsCompanyAllList,
    tsWxtag,
    tsCompanyList,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
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
      default: 1, // 1-选择员工 2-选择部门
    },
    isWorker: {
      type: Boolean,
      default: false,
    },
    needUpdate: {
      type: Boolean,
      default: false,
    },
    needStaff: {
      type: Boolean,
      default: true,
    },
    isNecessary: {
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
  },
  data() {
    return {
      orgKeyWord: '', // 搜索的关键字
      orgList: [],
      selectedDeptList: [], // 被选中的部门list
      selectedUserList: [], // 被选中的员工list
      rootKey: '',
      searchTimer: -1,
      selectKeyList: [], // 被选中过的节点idList
      delKeyList: [], // 删除的节点idList
      addKeyList: [], // 添加的节点idList
      updateTree: false,
      searchList: [],
      selectValue: '',
      isGetAll: true,
      searchName: '',
      selectValueList: [],
    };
  },
  async mounted() {
    const params = {
      needStaff: this.needStaff,
      needCorp: true,
      isWorker: this.isWorker,
      isOnly: +new Date(), // fix bug: 处理多个员工组件在同个页面时，因为请求链接相同 + 参数相同导致不走then后面的逻辑
    };
    if (this.permissions) {
      params.permissions = this.permissions;
    }
    const [err, res] = await getDepartmentListIsGetAll(params);
    if (!err) {
      this.isGetAll = res.data.needLoadAll;
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        // this.$nextTick( ()=> {
        this.orgKeyWord = '';
        if (this.needUpdate) {
          // this.$refs.orgTree.$refs.companyTree.setCheckedKeys([]) // 不用取消勾选，有坑会触发勾选的事件
          this.updateTree = true;
        } else {
          this.initData();
        }
        // })
      }
    },
    updateTree() {
      console.log('更新');
      console.log(this.updateTree);
    },
    searchName(newVal) {
      console.log();
      this.remoteMethod(newVal);
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
    // needStaff () {
    // 	return this.selectType === 1 || this.selectType === 3;
    // },
  },
  methods: {
    /**
     * 高亮搜索字
     * @author guoyijie
     * @date 2020/5/20
     * @returns {*}
     */
    getLightName(name) {
      if (!name) {
        return '';
      }
      return getHighlight(name, this.searchName, false, 'search-name');
    },
    clearSearchName() {},
    reset() {
      this.selectedDeptList = [];
      this.selectedUserList = [];
      this.selectValueList = [];
      // this.searchName='';
      this.updateSelectList();
      this.$nextTick(() => {
        this.$refs.orgTree &&
          this.$refs.orgTree.$refs.companyTree &&
          this.$refs.orgTree.$refs.companyTree.setCheckedKeys([]);
      });
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
            this.updateSelectList();
          });
        }, 200);
      } else {
        this.searchList = [];
        this.updateSelectList();
      }
    },
    selectOption(selectItem) {
      const findIndex = this.selectValueList.findIndex(item => {
        return selectItem[this.selectkey.value] == item;
      });
      if (findIndex >= 0) {
        this.selectValueList.splice(findIndex, 1);
        const type = this.selectType == 1 ? 'staff' : 'dept';
        this.deleteTag(type, selectItem);
      } else {
        this.selectValueList.push(selectItem[this.selectkey.value]);
        this.handleSelect(selectItem);
      }
      this.updateSelectList();
    },
    removeSelect(value) {
      this.selectValueList = this.selectValueList.filter(item => item !== value);
      this.updateSelectList();
    },
    updateSelectList() {
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
    changeSelectList(data, checked) {
      if (this.selectType == 2) {
        checked
          ? this.selectValueList.push(data.id)
          : (this.selectValueList = this.selectValueList.filter(item => item !== data.id));
      } else {
        if (data.isStaff) {
          checked
            ? this.selectValueList.push(data.sid)
            : (this.selectValueList = this.selectValueList.filter(item => item !== data.sid));
        }
      }
    },
    scrollToBottom(isStaff) {
      if (this.selectType == 2 || isStaff) {
        this.$nextTick(() => {
          const domObj = this.$refs.selectedBox;
          domObj.scrollTop = domObj.scrollHeight;
        });
      }
    },
    /**
     * @description 点击选中建议项时触发
     * @author enson
     * @date 2020-08-28
     */
    handleSelect(selectItem) {
      this.scrollToBottom(selectItem.isStaff);
      this.addKeyList = [];
      let index;
      if (selectItem.isStaff) {
        // 一个员工可能有多个部门
        selectItem.dept.forEach(depItem => {
          this.addKeyList.push(`${selectItem.sid}#${depItem.id}`);
        });
        index = this.selectedUserList.findIndex(currentItem => currentItem.sid === selectItem.sid);
        if (index === -1) {
          //vvvvv
          const itemList = [selectItem];
          this.selectedUserList = [...this.selectedUserList, ...itemList];
        }
      } else {
        this.addKeyList.push(selectItem.id);
        index = this.selectedDeptList.findIndex(currentItem => currentItem.id === selectItem.id);
        if (index === -1) {
          const itemList = [selectItem];
          this.selectedDeptList = [...this.selectedDeptList, ...itemList];
        }
      }
    },
    /**
     * @description 获取当前勾选的数据 （当前！！）
     * @author enson
     * @date 2020-08-28
     * @param {Array} checkList    - 勾选的数据
     * @param {Array} unSelectIdList - 取消勾选的数据Id
     */
    getCheckList(checkList, unSelectIdList) {
      const selectedDeptList = checkList.filter(item => !item.isStaff); // 将部门添加到右侧已选择
      let selectedUserList = checkList.filter(item => item.isStaff);

      // 去重
      selectedUserList = selectedUserList.reduce((prev, curr) => {
        const index = prev.findIndex(item => item.sid === curr.sid); // 将人员添加到右侧已选择，不存在的时候才加进去
        if (index === -1) {
          prev.push(curr);
        }
        return prev;
      }, []);
      if (this.selectType === 3 && checkList.length > 0) {
        if (selectedUserList.length > 1) {
          postMessage({
            type: 'error',
            message: '仅可以选中某个员工',
          });
          this.$refs.orgTree.$refs.companyTree.setCheckedKeys(this.selectKeyList);
          return;
        }
      }
      this.selectedDeptList = selectedDeptList.reduce((prev, curr) => {
        const index = prev.findIndex(item => item.id === curr.id); // 将人员添加到右侧已选择，不存在的时候才加进去
        if (index === -1) {
          prev.push(curr);
        }
        return prev;
      }, []);

      // 过滤掉取消选择的
      this.selectedUserList = selectedUserList;
      // this.selectValueList=[]
      // for (let item of this.selectedUserList){
      // 	this.selectValueList.push(item.sid)
      // }
      // this.updateSelectList()
      this.selectKeyList = [];
      for (const item of this.selectedUserList) {
        for (const depItem of item.depIdList) {
          this.selectKeyList.push(`${item.sid}#${depItem}`);
        }
      }
    },
    /**
     * 删除已选择的部门/员工
     * @param {Object} orgItem - 被移除的部门/员工
     * @param {string} type - 被移除的类型
     * */
    deleteTag(type, orgItem) {
      /**
       * 1 根据type去区分是移除的是员工还是部门
       * 2 根据id对selectedDeptList|selectedUserList进行过滤
       * 3 将删除的id添加到delKeyList
       */
      this.delKeyList = [];
      switch (type) {
        case 'dept':
          this.removeSelect(orgItem.id);
          this.selectedDeptList = this.selectedDeptList.filter(item => item.id !== orgItem.id); // 将部门添加到右侧已选择
          this.delKeyList.push(orgItem.id);
          break;
        case 'staff':
          this.removeSelect(orgItem.sid);
          if (this.isGetAll) {
            this.selectedUserList = this.selectedUserList.filter(item => item.sid !== orgItem.sid);
            for (const depItem of orgItem.depIdList) {
              this.selectKeyList = this.selectKeyList.filter(item => {
                item !== `${orgItem.sid}#${depItem}`;
              });
              this.delKeyList.push(`${orgItem.sid}#${depItem}`);
            }
          } else {
            this.selectedUserList = this.selectedUserList.filter(item => item.sid !== orgItem.sid);
            // if (orgItem.dept && orgItem.dept.length > 0) {
            // 	orgItem.dept.forEach(currentItem => {
            // 		this.delKeyList.push(`${orgItem.sid}#${currentItem.id}`);
            // 	})
            // } else {
            // 	this.delKeyList.push(`${orgItem.sid}#${orgItem.depId}`);
            // }
            for (const depItem of orgItem.depIdList) {
              this.delKeyList.push(`${orgItem.sid}#${depItem}`);
            }
          }
          break;
      }
    },
    sure() {
      const params = {
        dept: this.selectedDeptList,
        staff: this.selectedUserList,
      };
      if (this.isNecessary) {
        if (this.selectType == 1) {
          //员工
          if (params.dept.length === 0 && params.staff.length === 0) {
            postMessage({
              type: 'error',
              message: '请选择部门或员工',
            });
            return;
          }
        } else if (this.selectType == 3) {
          //员工
          if (params.staff.length === 0) {
            postMessage({
              type: 'error',
              message: '请选择员工',
            });
            return;
          }
        } else {
          //部门
          if (params.dept.length === 0) {
            postMessage({
              type: 'error',
              message: '请选择部门',
            });
            return;
          }
        }
      }
      this.$emit('getSelectedData', params);
      this.cancel();
    },
    cancel() {
      this.searchName = '';
      this.$emit('update:dialogVisible', false);
    },
    initData() {
      console.log('-----执行initData方法----');
      let depIdList = [];
      const userIdList = [];
      this.selectKeyList = [];
      try {
        console.log('selectedOrgData----->', this.selectedOrgData);
        this.selectedDeptList = this.selectedOrgData.dept;
        this.selectedUserList = this.selectedOrgData.staff;
        depIdList = this.selectedDeptList.map(item => {
          return item.id !== undefined ? item.id : item;
        });
        this.selectValueList = [];
        if (this.selectType == 2) {
          for (const item of this.selectedDeptList) {
            this.selectValueList.push(item.id);
          }
        } else {
          for (const item of this.selectedUserList) {
            this.selectValueList.push(item.id);
          }
        }
        console.log('updateExpandKeys', this.selectValueList);
        if (this.isGetAll) {
          this.$refs.orgTree.updateExpandKeys(this.selectValueList);
        }
        for (const item of this.selectedUserList) {
          for (const depItem of item.depIdList) {
            userIdList.push(`${item.sid}#${depItem}`);
          }
        }
        // console.log(this.selectValueList)
        // if (this.isGetAll) {
        // 	for (let item of this.selectedUserList) {
        // 		for (let depItem of item.depIdList) {
        // 			userIdList.push(`${item.sid}#${depItem}`)
        // 		}
        // 	}

        // } else {
        // 	if (this.selectType === 1 || this.selectType === 3) {
        // 		userIdList = this.selectedUserList.map(item => `${item.sid}#${item.depId}`);
        // 	}
        // }
        this.selectKeyList = depIdList.concat(userIdList);
        console.log('depIdList.concat(userIdList)', this.selectKeyList);
        try {
          this.$refs.orgTree.$refs.companyTree.setCheckedKeys(this.selectKeyList);
        } catch (e) {
          console.log('e', e);
        }
      } catch (e) {
        console.log('e', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-selectListDialog 组件样式 start */
.tanshu-selectListDialog {
  .orgSelectDialog {
    .orgSelectContent {
      .orgSelectWrapper {
        .selectContent {
          .leftContent {
            position: relative;
          }
        }
      }
    }
  }
  .wxWorkTag {
    margin: 10px 10px 5px 0;
  }
  .searchBox {
    position: absolute;
    top: 106px;
    left: 0;
    z-index: 10;
    width: 300px;
    height: 266px;
    margin-top: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #ffffff;
  }
  .selectTree {
    margin-top: 15px;
  }
  .searchItem {
    display: flex;

    /* width: 100%; */
    height: 36px;
    padding: 10px 20px;
    background: #ffffff;
    align-items: center;
    justify-content: space-between;
    .leftPart {
      display: flex;
      flex-direction: column;
      align-items: space-between;
      .name {
        max-width: 200px;
        overflow: hidden;
        font-size: 14px;
        color: $color-53;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .position {
        max-width: 200px;
        overflow: hidden;
        font-size: 12px;
        color: $color-b2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &:hover {
      background: #e6f1ff;
    }
    .search-name {
      color: $primary-color;
    }
  }
}

/* 搜索员工的部分 */
.directSale {
  .tanshu-selectListDialog {
    .searchItem {
      &:hover {
        background: #e6f1ff;
      }
      .search-name {
        color: $primary-color;
      }
    }
  }
}

/* tanshu-selectListDialog组件样式 end */

/* start:组织架构选择通知发送对话框样式 */
.orgSelectDialog {
  .orgSelectContent {
    .orgSelectWrapper {
      position: relative;
      border: 1px solid rgba(238, 238, 238, 0.9);
      box-sizing: border-box;
      &::after {
        position: absolute;
        top: 0;
        left: 300px;
        width: 1px;
        height: 100%;
        background-color: rgba(238, 238, 238, 0.9);
        content: '';
      }
      .selectTitle {
        display: flex;
        height: 47px;
        background: rgba(250, 250, 250, 1);
        border-bottom: 1px solid rgba(238, 238, 238, 0.9);
        align-items: center;
        flex-flow: row nowrap;
      }
      .titleText {
        font-size: 16px;
        color: rgba(0, 0, 0, 1);
        text-align: center;
        flex: 1;
        &.left {
          flex: 0 0 300px;
        }
      }
      .selectContent {
        display: flex;
        flex-flow: row nowrap;
        .leftContent {
          padding: 20px;
          overflow-x: scroll;
          box-sizing: border-box;
          flex: 0 0 300px;

          .selectCompany {
            height: 239px;
          }
        }
        .selectInputBox {
          margin-bottom: 15px;
        }
        .selectedBox {
          height: 337px;
          padding: 20px 0 20px 20px;
          overflow-y: auto;
          box-sizing: border-box;
          .selectWrapper {
            .orgTypeName {
              display: flex;
              height: 38px;
              margin-right: 10px;
              align-items: center;
              .nothingText {
                margin-left: 10px;
                font-size: 14px;
                color: rgba(178, 178, 178, 1);
              }
            }
            .selectLabelBox {
              display: flex;
              margin-bottom: 10px;
              flex-flow: row wrap;
              flex: 0 0 270px;
              .selectLabel {
                margin-right: 10px;
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
}

/* end:组织架构选择通知发送对话框样式 */
</style>

<style lang="scss">
.tanshu-selectListDialog {
  &.orgSelectDialog {
    &.wxCorpDialog {
      .el-dialog {
        height: 600px;
        .selectListContent {
          height: 442px;
          padding: 21px 30px 34px 30px;
          box-sizing: border-box;
          .orgSelectWrapper {
            height: 100%;
            .selectTree {
              .selectCompany {
                position: relative;
                height: 239px;
              }
            }
          }
        }
      }
    }
  }
}
.orgSelectDialog {
  .orgSelectContent {
    .orgSelectWrapper {
      .selectContent {
        .el-tree-node__content {
          & > .el-tree-node__expand-icon {
            padding: 6px 6px 0 6px;
          }
        }
      }
    }
  }
}
</style>
